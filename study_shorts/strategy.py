"""
競合リサーチ + 自チャンネルデータを GPT-4o で分析して
StudyFlow チャンネルの成長戦略を生成するモジュール。
"""
import json
import os
from collections import Counter
from datetime import datetime
from openai import OpenAI
from config import OPENAI_API_KEY, DATA_DIR
from analytics import get_own_insights, load_competitor_research

client = OpenAI(api_key=OPENAI_API_KEY)

STRATEGY_FILE = os.path.join(DATA_DIR, "strategy.json")

DEFAULT_STRATEGY = {
    "generated_at": None,
    "title_patterns": [
        "99%の人が知らない〇〇勉強法",
        "これだけで記憶力が〇倍になる！",
        "東大生が実践する〇〇テクニック",
        "〇〇分でマスターできる最強暗記法",
        "試験前日でも間に合う！〇〇攻略法",
    ],
    "hook_templates": [
        "ちょっと待って！この勉強法、知ってる？",
        "え、マジ？これやるだけで成績上がるって！",
        "東大合格者が全員やってる、あの方法。",
        "記憶力を上げたい人だけ見てください。",
        "勉強してるのに覚えられない人へ。",
    ],
    "recommended_genres": [
        "study_tips", "memory_hacks", "study_science",
        "concentration", "exam_strategy",
    ],
    "hot_keywords": ["記憶力", "効率", "東大", "合格", "集中力", "暗記", "勉強法"],
    "bgm_title_patterns": [
        "【〇〇分 集中BGM】勉強・作業用 バイノーラルビート",
        "【作業用BGM】〇〇分 深い集中 アルファ波",
        "受験生・資格勉強用 〇〇分集中BGM",
    ],
    "strategy_note": "デフォルト戦略（データ蓄積後に自動更新）",
}


def load_strategy() -> dict:
    if os.path.exists(STRATEGY_FILE):
        with open(STRATEGY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return DEFAULT_STRATEGY.copy()


def _save_strategy(s: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(STRATEGY_FILE, "w", encoding="utf-8") as f:
        json.dump(s, f, ensure_ascii=False, indent=2)


def _summarize_competitor(videos: list, label: str) -> str:
    if not videos:
        return f"{label}: データなし"
    lines = [f"{label} バズ動画 Top10（視聴数順）:"]
    for v in videos[:10]:
        tags = ", ".join(v.get("tags", [])[:5])
        lines.append(f"  [{v['views']:,}回] {v['title'][:50]}")
        if tags:
            lines.append(f"    タグ: {tags}")
    all_tags = [t for v in videos[:20] for t in v.get("tags", [])]
    top_tags = [t for t, _ in Counter(all_tags).most_common(10)]
    lines.append(f"  人気タグ: {', '.join(top_tags)}")
    return "\n".join(lines)


def generate_daily_strategy() -> dict:
    """競合データ + 自チャンネルデータから翌日の戦略を生成する。"""
    print("\n" + "=" * 60)
    print("  🧠 StudyFlow 戦略分析エンジン 起動")
    print("=" * 60)

    own  = get_own_insights()
    comp = load_competitor_research()

    shorts_summary = _summarize_competitor(comp.get("shorts", []), "学習Shorts")
    bgm_summary    = _summarize_competitor(comp.get("bgm", []),    "集中BGM")

    own_summary = (
        f"総動画数: {own.get('total',0)}本 / "
        f"Shorts平均: {own.get('avg_views_shorts',0):,}回 / "
        f"BGM平均: {own.get('avg_views_bgm',0):,}回 / "
        f"トレンド: 前週比 {own.get('trend_pct',0):+}%"
    )

    prompt = f"""あなたはYouTube教育チャンネルのトップ戦略コンサルタントです。
以下のデータを分析し、StudyFlow（勉強法・学習効率化チャンネル）が
日本のYouTubeでバズるための具体的な戦略をJSONで作成してください。

【自チャンネル実績】
{own_summary}
上位Shorts: {', '.join(v['title'] for v in own.get('top_shorts',[])[:3]) or 'まだデータなし'}

【競合リサーチ結果】
{shorts_summary}

{bgm_summary}

【分析指示】
1. 競合バズ動画のタイトル・タグパターンから成功法則を抽出する
2. 日本の学習系YouTubeトレンド（東大生/受験/資格/脳科学/効率化）を考慮する
3. Shortsは「最初の1秒でつかむフック」「意外性・驚き」が重要
4. BGMは「何分」「何のための集中」をタイトルに具体的に入れることが重要

以下のJSON形式で出力してください:
{{
  "title_patterns": ["パターン1（〇〇は変数）", "パターン2", "パターン3", "パターン4", "パターン5"],
  "hook_templates": ["フック1", "フック2", "フック3", "フック4", "フック5"],
  "recommended_genres": ["study_tips", "memory_hacks", "study_science", "concentration", "exam_strategy"],
  "hot_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7"],
  "bgm_title_patterns": ["BGMタイトルパターン1", "パターン2", "パターン3"],
  "competitor_insights": "競合分析から得たバズのポイント（200文字以内）",
  "strategy_note": "今週の戦略まとめ・改善アクション（200文字以内）"
}}"""

    print("  GPT-4o-mini で戦略を生成中...")
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=2000,
        )
        strategy_data = json.loads(resp.choices[0].message.content)
    except Exception as e:
        print(f"  ⚠️  戦略生成エラー: {e}")
        strategy_data = DEFAULT_STRATEGY.copy()

    strategy = {"generated_at": datetime.now().isoformat(), **strategy_data}
    _save_strategy(strategy)
    _print_strategy_report(strategy)
    return strategy


def _print_strategy_report(s: dict):
    print("\n" + "─" * 60)
    print("  📋 StudyFlow 成長戦略レポート")
    print("─" * 60)
    if s.get("strategy_note"):
        print(f"  戦略: {s['strategy_note']}")
    if s.get("competitor_insights"):
        print(f"  競合分析: {s['competitor_insights']}")
    print("\n  【バズるタイトルパターン】")
    for i, p in enumerate(s.get("title_patterns", [])[:5], 1):
        print(f"    {i}. {p}")
    print("\n  【BGMタイトルパターン】")
    for p in s.get("bgm_title_patterns", [])[:3]:
        print(f"    - {p}")
    print("\n  【Shortsフックテンプレート】")
    for i, h in enumerate(s.get("hook_templates", [])[:3], 1):
        print(f"    {i}. {h}")
    print(f"\n  【注目キーワード】: {', '.join(s.get('hot_keywords', [])[:7])}")
    print("─" * 60)
