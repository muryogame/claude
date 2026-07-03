"""
StudyFlow チャンネル分析モジュール
- 自チャンネル動画の視聴数追跡
- 競合（バズり学習系Shorts/BGM）のリサーチ
- インサイト生成
"""
import json
import os
import requests
from datetime import datetime
from config import YOUTUBE_API_KEY, DATA_DIR

LEARNING_DB_FILE  = os.path.join(DATA_DIR, "learning_db.json")
COMPETITOR_FILE   = os.path.join(DATA_DIR, "competitor_research.json")


# ─── DB I/O ───────────────────────────────────────────

def _load_db() -> dict:
    if os.path.exists(LEARNING_DB_FILE):
        with open(LEARNING_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"videos": [], "last_stats_update": None}


def _save_db(db: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(LEARNING_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


# ─── 自チャンネル記録 ──────────────────────────────────

def record_video(video_id: str, script_data: dict, video_type: str = "shorts"):
    """投稿した動画を学習DBに記録する。"""
    if not video_id:
        return
    db = _load_db()
    if any(v["video_id"] == video_id for v in db["videos"]):
        return
    db["videos"].append({
        "video_id":        video_id,
        "type":            video_type,
        "title":           script_data.get("title", ""),
        "genre":           script_data.get("genre", ""),
        "tags":            script_data.get("tags", []),
        "hook":            script_data.get("hook", ""),
        "uploaded_at":     datetime.now().isoformat(),
        "stats_updated_at": None,
        "views": 0, "likes": 0, "comments": 0,
    })
    _save_db(db)
    print(f"  📊 学習DB記録: {video_type} video_id={video_id}")


def fetch_and_update_stats():
    """YouTube API で自チャンネル全動画の統計を更新する。"""
    if not YOUTUBE_API_KEY:
        return
    db = _load_db()
    video_ids = [v["video_id"] for v in db["videos"] if v.get("video_id")]
    if not video_ids:
        return
    updated = 0
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i+50]
        try:
            resp = requests.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={"part": "statistics", "id": ",".join(batch), "key": YOUTUBE_API_KEY},
                timeout=15,
            )
            resp.raise_for_status()
            for item in resp.json().get("items", []):
                s = item.get("statistics", {})
                for v in db["videos"]:
                    if v["video_id"] == item["id"]:
                        v["views"]    = int(s.get("viewCount", 0))
                        v["likes"]    = int(s.get("likeCount", 0))
                        v["comments"] = int(s.get("commentCount", 0))
                        v["stats_updated_at"] = datetime.now().isoformat()
                        updated += 1
        except Exception as e:
            print(f"  ⚠️  統計取得エラー: {e}")
    db["last_stats_update"] = datetime.now().isoformat()
    _save_db(db)
    print(f"  📊 統計更新: {updated}件")


# ─── 競合リサーチ ──────────────────────────────────────

SEARCH_QUERIES = [
    # 学習Shorts
    ("勉強法 shorts", "shorts"),
    ("記憶術 暗記法 shorts", "shorts"),
    ("集中力 勉強 shorts", "shorts"),
    ("study tips shorts 日本語", "shorts"),
    ("試験対策 shorts", "shorts"),
    # 学習BGM
    ("勉強 集中 BGM 30分", "bgm"),
    ("作業用 BGM 集中 lofi", "bgm"),
    ("study music 集中 バイノーラル", "bgm"),
]


def _search_videos(query: str, max_results: int = 10) -> list[str]:
    """YouTube Search API でクエリを検索し video_id リストを返す。"""
    try:
        resp = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part":       "id",
                "q":          query,
                "type":       "video",
                "order":      "viewCount",
                "maxResults": max_results,
                "key":        YOUTUBE_API_KEY,
                "regionCode": "JP",
                "relevanceLanguage": "ja",
            },
            timeout=15,
        )
        resp.raise_for_status()
        return [item["id"]["videoId"] for item in resp.json().get("items", [])
                if item.get("id", {}).get("videoId")]
    except Exception as e:
        print(f"  ⚠️  検索エラー ({query}): {e}")
        return []


def _fetch_video_details(video_ids: list[str]) -> list[dict]:
    """video_id リストの詳細（タイトル・統計・タグ）を取得する。"""
    if not video_ids:
        return []
    try:
        resp = requests.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={
                "part": "snippet,statistics,contentDetails",
                "id":   ",".join(video_ids),
                "key":  YOUTUBE_API_KEY,
            },
            timeout=15,
        )
        resp.raise_for_status()
        results = []
        for item in resp.json().get("items", []):
            sn = item.get("snippet", {})
            st = item.get("statistics", {})
            cd = item.get("contentDetails", {})
            results.append({
                "video_id":    item["id"],
                "title":       sn.get("title", ""),
                "description": sn.get("description", "")[:300],
                "tags":        sn.get("tags", [])[:15],
                "channel":     sn.get("channelTitle", ""),
                "published":   sn.get("publishedAt", ""),
                "duration":    cd.get("duration", ""),
                "views":       int(st.get("viewCount", 0)),
                "likes":       int(st.get("likeCount", 0)),
                "comments":    int(st.get("commentCount", 0)),
            })
        return results
    except Exception as e:
        print(f"  ⚠️  動画詳細取得エラー: {e}")
        return []


def run_competitor_research() -> dict:
    """
    バズっている学習系Shorts・BGM動画を検索・分析してファイルに保存する。
    戻り値: {"shorts": [...], "bgm": [...], "updated_at": "..."}
    """
    if not YOUTUBE_API_KEY:
        print("  ⚠️  YouTube API Key 未設定。競合リサーチをスキップ。")
        return {}

    print("\n  🔍 競合リサーチ開始...")
    shorts_videos: list[dict] = []
    bgm_videos:    list[dict] = []

    for query, category in SEARCH_QUERIES:
        print(f"    検索: 「{query}」")
        ids     = _search_videos(query, max_results=8)
        details = _fetch_video_details(ids)
        if category == "shorts":
            shorts_videos.extend(details)
        else:
            bgm_videos.extend(details)

    # 重複除去 & 視聴数ソート
    def dedup_sort(lst):
        seen, out = set(), []
        for v in sorted(lst, key=lambda x: x["views"], reverse=True):
            if v["video_id"] not in seen:
                seen.add(v["video_id"])
                out.append(v)
        return out[:30]

    research = {
        "shorts":     dedup_sort(shorts_videos),
        "bgm":        dedup_sort(bgm_videos),
        "updated_at": datetime.now().isoformat(),
    }

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(COMPETITOR_FILE, "w", encoding="utf-8") as f:
        json.dump(research, f, ensure_ascii=False, indent=2)

    print(f"  🔍 競合リサーチ完了: Shorts {len(research['shorts'])}本 / BGM {len(research['bgm'])}本")
    _print_competitor_summary(research)
    return research


def load_competitor_research() -> dict:
    if os.path.exists(COMPETITOR_FILE):
        with open(COMPETITOR_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _print_competitor_summary(research: dict):
    print("\n  📊 競合 Shorts Top5:")
    for v in research["shorts"][:5]:
        print(f"    [{v['views']:>8,}回] {v['title'][:45]}")
    print("\n  📊 競合 BGM Top5:")
    for v in research["bgm"][:5]:
        print(f"    [{v['views']:>8,}回] {v['title'][:45]}")


# ─── 自チャンネルインサイト ────────────────────────────

def get_own_insights() -> dict:
    db = _load_db()
    videos = db.get("videos", [])
    if not videos:
        return {}

    shorts = [v for v in videos if v["type"] == "shorts"]
    bgm    = [v for v in videos if v["type"] == "bgm"]

    def avg(lst): return round(sum(v["views"] for v in lst) / len(lst)) if lst else 0

    by_date   = sorted(videos, key=lambda x: x.get("uploaded_at", ""))
    recent7   = by_date[-7:]
    prev7     = by_date[-14:-7] if len(by_date) >= 14 else []
    trend_pct = 0
    if prev7:
        r_avg = avg(recent7)
        p_avg = avg(prev7)
        trend_pct = round((r_avg - p_avg) / max(p_avg, 1) * 100)

    top_shorts = sorted(shorts, key=lambda x: x["views"], reverse=True)[:5]

    return {
        "total": len(videos),
        "shorts_count": len(shorts),
        "bgm_count": len(bgm),
        "avg_views_shorts": avg(shorts),
        "avg_views_bgm":    avg(bgm),
        "trend_pct":  trend_pct,
        "top_shorts": [{"title": v["title"], "views": v["views"], "genre": v.get("genre","")} for v in top_shorts],
    }


def print_analytics_report():
    ins = get_own_insights()
    if not ins:
        print("  📊 データなし（投稿後に蓄積されます）")
        return
    print("\n" + "=" * 60)
    print("  📊 StudyFlow チャンネル分析レポート")
    print("=" * 60)
    print(f"  総動画数   : {ins['total']}本（Shorts: {ins['shorts_count']} / BGM: {ins['bgm_count']}）")
    print(f"  Shorts平均 : {ins['avg_views_shorts']:,}回")
    print(f"  BGM平均    : {ins['avg_views_bgm']:,}回")
    trend_sym = "📈 上昇中" if ins["trend_pct"] > 10 else ("📉 下降中" if ins["trend_pct"] < -10 else "➡️  横ばい")
    print(f"  トレンド   : {trend_sym}（前週比 {ins['trend_pct']:+}%）")
    if ins.get("top_shorts"):
        print("\n  🏆 上位Shorts:")
        for i, v in enumerate(ins["top_shorts"], 1):
            print(f"    {i}. {v['title'][:35]}  ({v['views']:,}回)")
    print("=" * 60)
