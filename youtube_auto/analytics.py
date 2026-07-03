"""
動画パフォーマンス分析・学習モジュール
投稿した動画の視聴データを収集し、次回の動画生成に活かす
"""
import json
import os
import requests
from datetime import datetime
from config import YOUTUBE_API_KEY, DATA_DIR

LEARNING_DB_FILE = os.path.join(DATA_DIR, "learning_db.json")


# ─────────────────────────────────────────
# DB I/O
# ─────────────────────────────────────────

def _load_db() -> dict:
    if os.path.exists(LEARNING_DB_FILE):
        with open(LEARNING_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"videos": [], "last_stats_update": None}


def _save_db(db: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(LEARNING_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────
# 記録
# ─────────────────────────────────────────

def record_video(video_id: str, script_data: dict, video_type: str = "shorts"):
    """投稿した動画を学習DBに記録する。"""
    if not video_id:
        return
    db = _load_db()
    existing_ids = {v["video_id"] for v in db["videos"]}
    if video_id in existing_ids:
        return

    record = {
        "video_id": video_id,
        "type": video_type,
        "title": script_data.get("title", ""),
        "tags": script_data.get("tags", []),
        "topics_used": script_data.get("topics_used", []),
        "hook": script_data.get("hook", ""),
        "uploaded_at": datetime.now().isoformat(),
        "stats_updated_at": None,
        "views": 0,
        "likes": 0,
        "comments": 0,
    }
    db["videos"].append(record)
    _save_db(db)
    print(f"  📊 学習DB記録: {video_type} video_id={video_id}")


# ─────────────────────────────────────────
# 統計更新
# ─────────────────────────────────────────

def fetch_and_update_stats():
    """YouTube Data API で全動画の統計を取得して更新する。"""
    if not YOUTUBE_API_KEY:
        print("  ⚠️  YouTube API Keyが未設定のため統計更新をスキップ")
        return

    db = _load_db()
    if not db["videos"]:
        print("  📊 記録済み動画なし。スキップ。")
        return

    video_ids = [v["video_id"] for v in db["videos"] if v.get("video_id")]
    updated = 0

    for i in range(0, len(video_ids), 50):
        batch = video_ids[i : i + 50]
        try:
            resp = requests.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={
                    "part": "statistics",
                    "id": ",".join(batch),
                    "key": YOUTUBE_API_KEY,
                },
                timeout=15,
            )
            resp.raise_for_status()
            stats_map = {}
            for item in resp.json().get("items", []):
                s = item.get("statistics", {})
                stats_map[item["id"]] = {
                    "views": int(s.get("viewCount", 0)),
                    "likes": int(s.get("likeCount", 0)),
                    "comments": int(s.get("commentCount", 0)),
                }
            for v in db["videos"]:
                if v["video_id"] in stats_map:
                    v.update(stats_map[v["video_id"]])
                    v["stats_updated_at"] = datetime.now().isoformat()
                    updated += 1
        except Exception as e:
            print(f"  ⚠️  統計取得エラー（バッチ {i}）: {e}")

    db["last_stats_update"] = datetime.now().isoformat()
    _save_db(db)
    print(f"  📊 統計更新完了: {updated}件")


# ─────────────────────────────────────────
# インサイト生成
# ─────────────────────────────────────────

def get_learning_insights() -> dict:
    """
    学習DBを分析して次回動画生成に活かすインサイトを返す。

    返り値のキー:
      high_view_topics  : 高視聴数トピック [{"topic": str, "avg_views": int}, ...]
      high_view_tags    : 高視聴数タグ     [{"tag": str, "avg_views": int}, ...]
      high_view_hooks   : 高視聴Shortsフック [{"hook": str, "views": int}, ...]
      avg_views_shorts  : Shortsの平均視聴数
      avg_views_video   : 通常動画の平均視聴数
      trend             : "up" | "down" | "stable"
      top_videos        : 上位3動画情報
      total_videos      : 総動画数
    """
    db = _load_db()
    videos = db.get("videos", [])
    if not videos:
        return {}

    shorts = [v for v in videos if v["type"] == "shorts"]
    normal = [v for v in videos if v["type"] == "video"]

    def avg_views(lst):
        return round(sum(v["views"] for v in lst) / len(lst)) if lst else 0

    # トピック別平均視聴数
    topic_acc: dict[str, list[int]] = {}
    for v in videos:
        for t in v.get("topics_used", []):
            topic_acc.setdefault(t, []).append(v["views"])
    high_view_topics = sorted(
        [{"topic": t, "avg_views": round(sum(vs) / len(vs))} for t, vs in topic_acc.items()],
        key=lambda x: x["avg_views"], reverse=True,
    )[:10]

    # タグ別平均視聴数（2件以上のみ）
    tag_acc: dict[str, list[int]] = {}
    for v in videos:
        for tag in v.get("tags", []):
            tag_acc.setdefault(tag, []).append(v["views"])
    high_view_tags = sorted(
        [{"tag": t, "avg_views": round(sum(vs) / len(vs))} for t, vs in tag_acc.items() if len(vs) >= 2],
        key=lambda x: x["avg_views"], reverse=True,
    )[:10]

    # Shorts フック別視聴数
    high_view_hooks = sorted(
        [{"hook": v["hook"], "views": v["views"]} for v in shorts if v.get("hook")],
        key=lambda x: x["views"], reverse=True,
    )[:5]

    # トレンド判定（前半 vs 後半）
    trend = _calc_trend(videos)

    top_videos = sorted(videos, key=lambda x: x["views"], reverse=True)[:3]

    return {
        "high_view_topics": high_view_topics,
        "high_view_tags": high_view_tags,
        "high_view_hooks": high_view_hooks,
        "avg_views_shorts": avg_views(shorts),
        "avg_views_video": avg_views(normal),
        "trend": trend,
        "top_videos": [{"title": v["title"], "views": v["views"], "type": v["type"]} for v in top_videos],
        "total_videos": len(videos),
    }


def _calc_trend(videos: list) -> str:
    if len(videos) < 4:
        return "stable"
    sorted_v = sorted(videos, key=lambda x: x.get("uploaded_at", ""))
    half = len(sorted_v) // 2
    old_avg = sum(v["views"] for v in sorted_v[:half]) / half
    new_avg = sum(v["views"] for v in sorted_v[half:]) / (len(sorted_v) - half)
    if old_avg == 0:
        return "stable"
    ratio = new_avg / old_avg
    if ratio > 1.2:
        return "up"
    if ratio < 0.8:
        return "down"
    return "stable"


# ─────────────────────────────────────────
# レポート表示
# ─────────────────────────────────────────

def print_analytics_report():
    """コンソールに分析レポートを出力する。"""
    insights = get_learning_insights()
    if not insights:
        print("  📊 学習データなし（動画投稿後に蓄積されます）")
        return

    print("\n" + "=" * 60)
    print("  📊 パフォーマンス分析レポート")
    print("=" * 60)
    print(f"  総動画数       : {insights['total_videos']}本")
    print(f"  Shorts平均視聴 : {insights['avg_views_shorts']:,}回")
    print(f"  通常動画平均   : {insights['avg_views_video']:,}回")
    trend_sym = {"up": "📈 上昇中", "down": "📉 下降中", "stable": "➡️  横ばい"}.get(insights["trend"], "")
    print(f"  トレンド       : {trend_sym}")

    if insights.get("top_videos"):
        print("\n  🏆 上位動画:")
        for i, v in enumerate(insights["top_videos"], 1):
            label = "Shorts" if v["type"] == "shorts" else "通常"
            print(f"    {i}. [{label}] {v['title'][:30]}  ({v['views']:,}回)")

    if insights.get("high_view_topics"):
        print("\n  🔥 高視聴数トピック Top5:")
        for t in insights["high_view_topics"][:5]:
            print(f"    - {t['topic']}  (平均 {t['avg_views']:,}回)")

    if insights.get("high_view_hooks"):
        print("\n  💡 バズったショートフック:")
        for h in insights["high_view_hooks"][:3]:
            print(f"    - 「{h['hook']}」  ({h['views']:,}回)")
    print("=" * 60)
