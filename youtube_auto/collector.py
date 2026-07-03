"""
YouTube動画情報収集モジュール
YouTube Data API v3 を使って「雑学」動画の情報を収集する
API keyがない場合はサンプルデータを使用する
"""
import json
import os
import time
import requests
from datetime import datetime
from config import YOUTUBE_API_KEY, SEARCH_QUERY, DATA_DIR

COLLECTED_FILE = os.path.join(DATA_DIR, "collected_topics.json")
QUERY_INDEX_FILE = os.path.join(DATA_DIR, "query_index.json")
MAX_RESULTS_PER_SEARCH = 50
MAX_STORED_TOPICS = 2000

# 収集に使うキーワード一覧（バズジャンル特化・ローテーション）
SEARCH_QUERIES = [
    # 定番雑学
    "雑学", "豆知識", "面白い雑学", "驚きの雑学", "衝撃の真実",
    "知らないと損する", "学校で教えてくれなかった", "99%の人が知らない",
    # 歴史・社会
    "歴史の真実", "歴史の裏側", "日本史の衝撃", "世界史の謎", "歴史 ヤバい",
    # お金・経済
    "お金の雑学", "節約 知らなかった", "投資 知識", "お金持ちの習慣",
    # 科学・宇宙
    "宇宙の謎", "科学の不思議", "量子力学 わかりやすい", "宇宙 ヤバい事実",
    # 生物・自然
    "生き物の不思議", "深海生物", "動物の秘密", "植物の驚き", "昆虫 ヤバい",
    # 人体・健康
    "人体の謎", "脳科学 驚き", "健康の常識 嘘", "睡眠の真実",
    # 心理
    "心理学 面白い", "行動心理 雑学", "人間の心理 不思議",
    # Shorts特化
    "雑学 shorts", "豆知識 shorts", "衝撃 真実 shorts", "知らなかった shorts",
    "歴史 ヤバい shorts", "お金 雑学 shorts",
]


def search_youtube_videos(query: str = SEARCH_QUERY, max_results: int = MAX_RESULTS_PER_SEARCH) -> list[dict]:
    """YouTube Data APIで動画を検索する。"""
    if not YOUTUBE_API_KEY:
        print("  YouTube API Keyが未設定のため、サンプル雑学データを使用します。")
        return _get_sample_topics()

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "relevanceLanguage": "ja",
        "order": "viewCount",   # 視聴数の多い順で収集
        "key": YOUTUBE_API_KEY,
    }
    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        topics = []
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            topics.append({
                "video_id": item["id"].get("videoId", ""),
                "title": snippet.get("title", ""),
                "description": snippet.get("description", "")[:500],
                "channel": snippet.get("channelTitle", ""),
                "published_at": snippet.get("publishedAt", ""),
                "collected_at": datetime.now().isoformat(),
            })
        return topics
    except Exception as e:
        print(f"  YouTube API エラー: {e}")
        return _get_sample_topics()


def _get_sample_topics() -> list[dict]:
    """YouTube API keyなしで使えるサンプル雑学トピック集。"""
    return [
        {"title": "人間の体の不思議な秘密10選", "description": "人体に関する驚くべき事実。脳、心臓、骨など各器官の知られざる能力について。"},
        {"title": "世界の動物の驚きの生態", "description": "タコの知能、ミツバチの言語、クモの糸など驚異の動物世界。"},
        {"title": "歴史の中の面白い出来事", "description": "教科書には載らない歴史の裏側。偉人たちの意外な一面。"},
        {"title": "宇宙の不思議な真実", "description": "ブラックホール、星の一生、宇宙の大きさなど宇宙の謎。"},
        {"title": "食べ物にまつわる驚きの雑学", "description": "身近な食品の意外な歴史と栄養の真実。"},
        {"title": "日本語の面白い語源と歴史", "description": "普段使う言葉の意外な由来と歴史的背景。"},
        {"title": "科学の不思議な現象10選", "description": "日常に隠れた科学の神秘。光、重力、電磁気の驚きの事実。"},
        {"title": "世界の奇妙な法律と文化", "description": "国によって全く異なる常識。世界各地のユニークなルール。"},
        {"title": "心理学の面白い実験と発見", "description": "人間の心の不思議。錯覚、記憶、行動心理の驚くべき研究。"},
        {"title": "植物の驚くべき生存戦略", "description": "植物が動物に劣らない知性を持つ証拠。コミュニケーション能力や防衛機能。"},
        {"title": "数学の美しいパターンと謎", "description": "フィボナッチ数列、素数の謎、無限の概念など数学の神秘。"},
        {"title": "音楽と脳の不思議な関係", "description": "音楽が人間の脳と感情に与える科学的な影響。"},
        {"title": "海の深海に潜む生物たち", "description": "人類未踏の深海に生きる奇妙な生き物たちの生態。"},
        {"title": "建築の驚くべき技術と歴史", "description": "ピラミッド、長城、現代超高層ビルに使われた驚異の技術。"},
        {"title": "色と心理の不思議な関係", "description": "色が人間の感情、行動、判断に与える心理的効果。"},
    ]


def load_collected_topics() -> list[dict]:
    """保存済みトピックを読み込む。"""
    if os.path.exists(COLLECTED_FILE):
        with open(COLLECTED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_topics(topics: list[dict]):
    """トピックを保存する（重複除去、最大件数制限）。"""
    os.makedirs(DATA_DIR, exist_ok=True)
    existing = load_collected_topics()

    # 既存タイトルのセット
    existing_titles = {t.get("title", "") for t in existing}
    new_topics = [t for t in topics if t.get("title", "") not in existing_titles]

    combined = existing + new_topics
    # 最大件数を超えたら古いものを削除
    if len(combined) > MAX_STORED_TOPICS:
        combined = combined[-MAX_STORED_TOPICS:]

    with open(COLLECTED_FILE, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)

    return len(new_topics)


def _load_query_index() -> int:
    if os.path.exists(QUERY_INDEX_FILE):
        with open(QUERY_INDEX_FILE, "r") as f:
            return json.load(f).get("index", 0)
    return 0


def _save_query_index(index: int):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(QUERY_INDEX_FILE, "w") as f:
        json.dump({"index": index}, f)


def collect_once():
    """1回分の情報収集を実行する（状態ファイルでキーワードをローテーション）。"""
    query_index = _load_query_index()
    query = SEARCH_QUERIES[query_index % len(SEARCH_QUERIES)]

    print(f"  [{datetime.now().strftime('%H:%M:%S')}] 情報収集中: '{query}'")
    topics = search_youtube_videos(query=query)
    added = save_topics(topics)
    total = len(load_collected_topics())

    # 毎回必ず次のキーワードへ進む
    next_index = (query_index + 1) % len(SEARCH_QUERIES)
    _save_query_index(next_index)
    print(f"  新規追加: {added}件 / 合計蓄積: {total}件 / 次キーワード: '{SEARCH_QUERIES[next_index]}'")
    return topics


def collect_continuously(interval_minutes: int = 30, stop_event=None):
    """定期的に情報収集を繰り返す（動画投稿時以外）。"""
    while True:
        collect_once()
        for _ in range(interval_minutes * 60):
            if stop_event and stop_event.is_set():
                return
            time.sleep(1)
