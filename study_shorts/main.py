#!/usr/bin/env python3
# 実行方法: python3 main.py
"""
学習効率化チャンネル StudyFlow 自動運営システム
- 毎日5本のShortsを自動生成・投稿（最低60秒）
- 投稿スケジュール: 7:00 / 10:00 / 13:00 / 17:00 / 21:00
- ジャンルローテーション: 勉強法 / 記憶術 / 学習科学 / 集中力 / 試験対策
- 投稿時間以外は30分ごとに情報収集
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import time
import threading
from datetime import datetime
from config import OUTPUT_DIR, SHORTS_TARGET_SECONDS
from collector import collect_continuously, collect_once
from script_generator import generate_shorts_script, pick_genre
from tts_generator import generate_audio
from shorts_creator import build_shorts_video
from thumbnail_creator import create_thumbnail
from uploader import upload_shorts, upload_bgm, check_credentials_ready
from bgm_creator import create_bgm_video

# 1日5本の Shorts 投稿スケジュール（時, 分, スロット番号）
SHORTS_SCHEDULE = [
    ( 7, 0, 1),   # 第1回:  7:00
    (10, 0, 2),   # 第2回: 10:00
    (13, 0, 3),   # 第3回: 13:00
    (17, 0, 4),   # 第4回: 17:00
    (21, 0, 5),   # 第5回: 21:00
]

# BGM 動画投稿スケジュール（時, 分）
BGM_SCHEDULE = [(22, 0)]   # 22:00 に1本


def create_and_upload_shorts(slot: int = 1):
    """1本のShorts（最低60秒）を生成してアップロードする。"""
    print("\n" + "=" * 60)
    print(f"  【Shorts 生成開始 第{slot}回】{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")
    audio_path  = os.path.join(OUTPUT_DIR, f"audio_{date_str}_{slot}.mp3")
    video_path  = os.path.join(OUTPUT_DIR, f"shorts_{date_str}_{slot}.mp4")
    thumb_path  = os.path.join(OUTPUT_DIR, f"thumb_{date_str}_{slot}.jpg")

    try:
        # ジャンルをスロット番号でローテーション
        genre = pick_genre(slot - 1)

        print(f"\n[1/4] スクリプト生成中（ジャンル: {genre}）...")
        script = generate_shorts_script(genre=genre)

        print("\n[2/4] 音声生成中...")
        generate_audio(script["full_text"], audio_path)

        print("\n[3/4] サムネイル生成中（DALL-E）...")
        create_thumbnail(
            title=script.get("title", "効率的な勉強法"),
            genre_label=script.get("genre_label", "学習Tips"),
            thumbnail_prompt=script.get("thumbnail_prompt", script.get("image_prompt", "")),
            output_path=thumb_path,
        )

        print(f"\n[4/4] Shorts動画生成中（最低{SHORTS_TARGET_SECONDS}秒）...")
        build_shorts_video(script, audio_path, video_path, max_seconds=float(SHORTS_TARGET_SECONDS))

        print("\n[5/5] YouTubeにアップロード中...")
        if check_credentials_ready():
            url, video_id = upload_shorts(video_path, thumb_path, script)
            print(f"\n  ✅ Shorts 投稿完了 第{slot}回: {url}")
        else:
            print("\n  ⚠️  client_secret.json 未設定のためアップロードスキップ")
            print("     setup_youtube_auth.py を実行して認証を完了してください")

    except Exception as e:
        print(f"\n  ❌ エラー（第{slot}回）: {e}")
        import traceback
        traceback.print_exc()

    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)


def create_and_upload_bgm():
    """30分 集中BGM 動画を生成してアップロードする。"""
    print("\n" + "=" * 60)
    print(f"  【BGM動画 生成開始】{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    date_str  = datetime.now().strftime("%Y%m%d")
    video_path = os.path.join(OUTPUT_DIR, f"bgm_{date_str}.mp4")

    try:
        print("\n[1/2] BGM動画生成中（約3〜5分かかります）...")
        create_bgm_video(video_path)

        print("\n[2/2] YouTubeにアップロード中...")
        if check_credentials_ready():
            url, _ = upload_bgm(video_path, date_str)
            print(f"\n  ✅ BGM動画 投稿完了: {url}")
        else:
            print("\n  ⚠️  client_secret.json 未設定のためアップロードスキップ")

    except Exception as e:
        print(f"\n  ❌ BGMエラー: {e}")
        import traceback
        traceback.print_exc()

    finally:
        if os.path.exists(video_path):
            os.remove(video_path)


def _stop_collect(collect_thread, stop_event):
    if collect_thread and collect_thread.is_alive():
        stop_event.set()
        collect_thread.join()
        stop_event.clear()
    return collect_thread


def _start_collect(stop_event):
    t = threading.Thread(target=collect_continuously, args=(30, stop_event), daemon=True)
    t.start()
    return t


def run_scheduler():
    """メインスケジューラー（1日5本 Shorts + 22:00 BGM 自動投稿）。"""
    times_str = " / ".join(f"{h:02d}:{m:02d}" for h, m, _ in SHORTS_SCHEDULE)
    bgm_str   = " / ".join(f"{h:02d}:{m:02d}" for h, m in BGM_SCHEDULE)
    print("=" * 60)
    print("  学習効率化チャンネル StudyFlow 自動運営システム 起動")
    print(f"  Shorts投稿: 毎日 {times_str}（1日5本）")
    print(f"  BGM動画  : 毎日 {bgm_str}（30分 集中BGM）")
    print("  情報収集  : 投稿時間以外は30分ごとに自動実行")
    print("=" * 60)

    collect_once()

    posted_today: dict[tuple, bool] = {}
    stop_event = threading.Event()
    collect_thread = _start_collect(stop_event)

    while True:
        now = datetime.now()
        today = now.date()

        for (sh, sm, slot) in SHORTS_SCHEDULE:
            key = (today, "shorts", slot)
            if now.hour == sh and now.minute == sm and key not in posted_today:
                _stop_collect(collect_thread, stop_event)
                create_and_upload_shorts(slot=slot)
                posted_today[key] = True
                collect_thread = _start_collect(stop_event)
                break

        for (bh, bm) in BGM_SCHEDULE:
            key = (today, "bgm", bh, bm)
            if now.hour == bh and now.minute == bm and key not in posted_today:
                _stop_collect(collect_thread, stop_event)
                create_and_upload_bgm()
                posted_today[key] = True
                collect_thread = _start_collect(stop_event)
                break

        if not collect_thread or not collect_thread.is_alive():
            collect_thread = _start_collect(stop_event)

        time.sleep(60)


if __name__ == "__main__":
    if "--once" in sys.argv:
        # 単発テスト: 第1回スロットを即座に生成
        slot_arg = 1
        for i, arg in enumerate(sys.argv):
            if arg == "--slot" and i + 1 < len(sys.argv):
                slot_arg = int(sys.argv[i + 1])
        create_and_upload_shorts(slot=slot_arg)
    elif "--bgm" in sys.argv:
        # BGM動画を即座に生成・投稿
        create_and_upload_bgm()
    elif "--collect" in sys.argv:
        # 情報収集のみ実行
        collect_once()
    else:
        run_scheduler()
