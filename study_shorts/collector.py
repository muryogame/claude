"""
情報収集モジュール
YouTube Data API v3 で学習・勉強法コンテンツ情報を収集する
"""
import json
import os
import time
import requests
from datetime import datetime
from config import YOUTUBE_API_KEY, DATA_DIR

COLLECTED_FILE   = os.path.join(DATA_DIR, "collected_topics.json")
QUERY_INDEX_FILE = os.path.join(DATA_DIR, "query_index.json")
MAX_RESULTS_PER_SEARCH = 50
MAX_STORED_TOPICS      = 3000

# ジャンル別検索キーワード
SEARCH_QUERIES = {
    "study_tips": [
        "勉強法 効率", "学習法 おすすめ", "勉強 コツ", "成績アップ 方法",
        "勉強時間 増やす", "効率的 勉強法", "勉強 習慣化", "学習 継続",
        "勉強 モチベーション", "自己学習 方法", "独学 コツ", "勉強 集中",
        "学習効率 上げる", "勉強 スケジュール", "学習計画 立て方",
        "勉強 継続 コツ", "毎日 勉強 習慣", "社会人 勉強法",
        "資格 勉強法", "勉強 ルーティン",
    ],
    "memory_hacks": [
        "記憶術 勉強", "暗記 コツ", "記憶力 上げる", "暗記法 効果的",
        "忘れない 勉強法", "記憶 定着", "スペーシング効果", "分散学習",
        "フラッシュカード 暗記", "記憶の宮殿", "語呂合わせ 暗記",
        "長期記憶 方法", "暗記 早くなる", "記憶術 英語",
        "試験前 暗記 コツ", "復習 タイミング", "エビングハウス 忘却曲線",
        "暗記 睡眠", "記憶力 訓練", "覚える コツ",
    ],
    "study_science": [
        "学習科学 研究", "勉強 脳科学", "記憶 仕組み 脳",
        "学習 認知科学", "アクティブラーニング 効果", "ポモドーロ 効果",
        "睡眠 記憶 関係", "運動 勉強 効果", "音楽 勉強 効果",
        "マインドマップ 効果", "フォーカス 勉強 科学",
        "間隔反復 科学", "テスト効果 学習", "想起練習 効果",
        "勉強 科学的 方法", "学習 最新研究", "脳 学習 最適化",
        "集中力 科学", "勉強 習慣 科学", "認知負荷 学習",
    ],
    "concentration": [
        "集中力 上げる", "集中力 続かない 対策", "深い集中 方法",
        "フロー状態 入り方", "集中力 鍛える", "ディープワーク",
        "集中できない 理由", "スマホ 誘惑 断つ", "集中 環境 整える",
        "作業効率 上げる", "集中力 食事", "集中力 朝", "午前中 集中",
        "集中力 音楽", "ノイズキャンセル 集中", "集中 続く 時間",
        "休憩 集中力", "目標 集中", "集中力 子供 大人",
        "タスク管理 集中",
    ],
    "exam_strategy": [
        "試験 勉強法", "資格試験 対策", "TOEIC 勉強法",
        "英語 勉強法", "数学 勉強法", "大学受験 勉強法",
        "公務員試験 勉強", "簿記 勉強法", "宅建 勉強法",
        "FP 勉強法", "IT資格 勉強", "過去問 勉強法",
        "試験直前 対策", "模試 活用法", "弱点克服 勉強",
        "試験 メンタル", "本番 緊張しない", "マークシート コツ",
        "試験前日 過ごし方", "合格 勉強法",
    ],
}


def _load_topics() -> list:
    if os.path.exists(COLLECTED_FILE):
        with open(COLLECTED_FILE, encoding="utf-8") as f:
            return json.load(f)
    return []


def _save_topics(topics: list):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(COLLECTED_FILE, "w", encoding="utf-8") as f:
        json.dump(topics[-MAX_STORED_TOPICS:], f, ensure_ascii=False, indent=2)


def _load_query_index() -> dict:
    if os.path.exists(QUERY_INDEX_FILE):
        with open(QUERY_INDEX_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_query_index(idx: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(QUERY_INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(idx, f, ensure_ascii=False, indent=2)


def collect_once():
    """全ジャンルから1サイクル分の情報を収集する。"""
    if not YOUTUBE_API_KEY:
        print("[collector] YOUTUBE_API_KEY が未設定。収集スキップ。")
        return

    topics   = _load_topics()
    q_index  = _load_query_index()
    existing = {t["video_id"] for t in topics if "video_id" in t}
    added    = 0

    for genre, queries in SEARCH_QUERIES.items():
        idx = q_index.get(genre, 0) % len(queries)
        query = queries[idx]
        q_index[genre] = (idx + 1) % len(queries)

        try:
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet", "q": query, "type": "video",
                "maxResults": MAX_RESULTS_PER_SEARCH,
                "order": "viewCount", "regionCode": "JP",
                "relevanceLanguage": "ja", "key": YOUTUBE_API_KEY,
            }
            res  = requests.get(url, params=params, timeout=15)
            data = res.json()
            for item in data.get("items", []):
                vid = item["id"].get("videoId")
                if vid and vid not in existing:
                    topics.append({
                        "video_id":    vid,
                        "title":       item["snippet"]["title"],
                        "description": item["snippet"].get("description", ""),
                        "genre":       genre,
                        "collected_at": datetime.now().isoformat(),
                    })
                    existing.add(vid)
                    added += 1
            print(f"[collector] {genre} / '{query}': +{len(data.get('items',[]))} 件")
            time.sleep(1)
        except Exception as e:
            print(f"[collector] 収集エラー ({genre}): {e}")

    _save_topics(topics)
    _save_query_index(q_index)
    print(f"[collector] 収集完了: 追加 {added} 件 / 合計 {len(topics)} 件")


def collect_continuously(interval_minutes: int = 30, stop_event=None):
    """バックグラウンドで定期収集を続ける。"""
    import threading
    _stop = stop_event or threading.Event()
    while not _stop.is_set():
        collect_once()
        _stop.wait(interval_minutes * 60)


def load_topics_by_genre(genre: str) -> list:
    return [t for t in _load_topics() if t.get("genre") == genre]


def _get_sample_topics(genre: str) -> list[str]:
    """収集データがないときのフォールバック用サンプル。"""
    SAMPLES = {
        "study_tips":    ["ポモドーロ・テクニックの効果", "朝型勉強法のメリット", "勉強習慣の作り方"],
        "memory_hacks":  ["エビングハウスの忘却曲線", "間隔反復学習法", "記憶の宮殿テクニック"],
        "study_science": ["睡眠と記憶定着の科学", "運動が学習効率を上げる理由", "アクティブリコールの効果"],
        "concentration": ["ディープワーク状態の入り方", "デジタルデトックスで集中力回復", "フロー状態の科学"],
        "exam_strategy": ["過去問を使った効率的な試験対策", "試験前日の最適な過ごし方", "弱点克服の勉強法"],
    }
    return SAMPLES.get(genre, ["効率的な学習方法"])
