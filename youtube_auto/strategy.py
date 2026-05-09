"""
毎日の動画パフォーマンスを分析してコンテンツ戦略を自動更新するモジュール。
analytics.py の統計データを GPT-4o で解析し、翌日の動画生成に使う戦略JSONを生成する。
"""
import json
import os
import re
from collections import Counter
from datetime import datetime
from openai import OpenAI
from config import OPENAI_API_KEY, DATA_DIR

client = OpenAI(api_key=OPENAI_API_KEY)

STRATEGY_FILE = os.path.join(DATA_DIR, "strategy.json")
LEARNING_DB_FILE = os.path.join(DATA_DIR, "learning_db.json")

# データが少ない段階でも動くデフォルト戦略
DEFAULT_STRATEGY = {
    "generated_at": None,
    "title_patterns": [
        "学校では教えてくれなかった〇〇の真実",
        "99%の人が知らない〇〇の衝撃的な事実",
        "知らないと一生損する〇〇の話",
        "実は全部嘘だった！〇〇の常識を覆す",
        "え？〇〇ってこんなにヤバかったの？",
    ],
    "recommended_genres": [
        "学校で教えてくれない歴史・社会の衝撃的な真実",
        "知らないと一生損するお金・投資の雑学",
        "99%の人が誤解している体・健康の常識",
        "心理学者が明かす人間の行動の不思議な真実",
        "世界のヤバい生き物・深海生物の衝撃的な能力",
    ],
    "hook_templates": [
        "ちょっと待って、これ知ってる人いる？実は〇〇なんだよ！",
        "え？マジで？これ全部嘘だったって知ってた？",
        "これ、学校で絶対教えてくれなかったやつ。",
        "99%の人が知らない衝撃の事実、教えます。",
        "これを知ったら人生観が変わるかもしれない。",
    ],
    "avoid_patterns": [],
    "strategy_note": "初期デフォルト戦略（データ蓄積後に自動更新されます）",
    "top_keywords": ["衝撃", "真実", "知らなかった", "ヤバい", "学校で教えない"],
}


def load_strategy() -> dict:
    """保存済み戦略を読み込む。なければデフォルトを返す。"""
    if os.path.exists(STRATEGY_FILE):
        with open(STRATEGY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return DEFAULT_STRATEGY.copy()


def _save_strategy(strategy: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(STRATEGY_FILE, "w", encoding="utf-8") as f:
        json.dump(strategy, f, ensure_ascii=False, indent=2)


def _load_db() -> dict:
    if os.path.exists(LEARNING_DB_FILE):
        with open(LEARNING_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"videos": []}


# ─────────────────────────────────────────────────────
# 分析ロジック
# ─────────────────────────────────────────────────────

def _analyze_title_patterns(videos: list[dict]) -> dict:
    """タイトルから高視聴数ワードを抽出する。"""
    if not videos:
        return {"high": [], "low": []}

    avg = sum(v["views"] for v in videos) / len(videos)
    high = [v for v in videos if v["views"] >= avg * 1.5]
    low = [v for v in videos if v["views"] < avg * 0.5]

    def extract_words(vlist):
        words = []
        for v in vlist:
            title = v.get("title", "")
            # 記号を除いた単語トークン（2文字以上）
            tokens = re.findall(r'[ぁ-んァ-ン一-龥a-zA-Z]{2,}', title)
            words.extend(tokens)
        return [w for w, _ in Counter(words).most_common(10)]

    return {
        "high": extract_words(high),
        "low": extract_words(low),
        "high_titles": [v["title"] for v in sorted(high, key=lambda x: x["views"], reverse=True)[:5]],
        "low_titles": [v["title"] for v in sorted(low, key=lambda x: x["views"])[:5]],
    }


def _analyze_timing(videos: list[dict]) -> dict:
    """投稿時刻別の平均視聴数を分析する。"""
    hour_views: dict[int, list[int]] = {}
    for v in videos:
        uploaded = v.get("uploaded_at", "")
        if not uploaded:
            continue
        try:
            hour = datetime.fromisoformat(uploaded).hour
            hour_views.setdefault(hour, []).append(v["views"])
        except Exception:
            pass

    if not hour_views:
        return {}

    return {
        h: round(sum(vs) / len(vs))
        for h, vs in sorted(hour_views.items(), key=lambda x: -sum(x[1]) / len(x[1]))
    }


def _analyze_hooks(shorts: list[dict]) -> list[dict]:
    """Shortsのフックと視聴数の関係を分析する。"""
    scored = sorted(
        [{"hook": v.get("hook", ""), "views": v["views"], "title": v.get("title", "")}
         for v in shorts if v.get("hook")],
        key=lambda x: x["views"], reverse=True,
    )
    return scored[:8]


def _compute_metrics(videos: list[dict]) -> dict:
    """基本指標を計算する。"""
    if not videos:
        return {}

    shorts = [v for v in videos if v["type"] == "shorts"]
    normal = [v for v in videos if v["type"] == "video"]

    def safe_avg(lst):
        return round(sum(v["views"] for v in lst) / len(lst)) if lst else 0

    # 週ごとのトレンド（直近7本 vs その前7本）
    by_date = sorted(videos, key=lambda x: x.get("uploaded_at", ""))
    recent7 = by_date[-7:] if len(by_date) >= 7 else by_date
    prev7 = by_date[-14:-7] if len(by_date) >= 14 else []
    recent_avg = safe_avg(recent7)
    prev_avg = safe_avg(prev7) if prev7 else recent_avg

    trend_pct = round((recent_avg - prev_avg) / max(prev_avg, 1) * 100)

    return {
        "total_videos": len(videos),
        "shorts_count": len(shorts),
        "video_count": len(normal),
        "avg_views_shorts": safe_avg(shorts),
        "avg_views_video": safe_avg(normal),
        "max_views_shorts": max((v["views"] for v in shorts), default=0),
        "max_views_video": max((v["views"] for v in normal), default=0),
        "recent7_avg": recent_avg,
        "prev7_avg": prev_avg,
        "trend_pct": trend_pct,
    }


# ─────────────────────────────────────────────────────
# GPT-4o による戦略生成
# ─────────────────────────────────────────────────────

def _generate_strategy_with_gpt(metrics: dict, title_analysis: dict,
                                  top_hooks: list, timing: dict) -> dict:
    """分析データをGPT-4oに渡して戦略JSONを生成する。"""

    analysis_text = f"""
【チャンネル実績サマリー】
- 総動画数: {metrics.get('total_videos', 0)}本（Shorts: {metrics.get('shorts_count', 0)} / 通常動画: {metrics.get('video_count', 0)}）
- Shorts平均視聴数: {metrics.get('avg_views_shorts', 0):,}回（最高: {metrics.get('max_views_shorts', 0):,}回）
- 通常動画平均視聴数: {metrics.get('avg_views_video', 0):,}回（最高: {metrics.get('max_views_video', 0):,}回）
- 直近7本平均: {metrics.get('recent7_avg', 0):,}回（前週比: {metrics.get('trend_pct', 0):+}%）

【高視聴数タイトルで使われているワード】
{', '.join(title_analysis.get('high', [])[:8]) or 'データ不足'}

【低視聴数タイトルで使われているワード】
{', '.join(title_analysis.get('low', [])[:8]) or 'データ不足'}

【バズったタイトル（上位5本）】
{chr(10).join(f'- {t}' for t in title_analysis.get('high_titles', [])) or 'データ不足'}

【伸びなかったタイトル（下位5本）】
{chr(10).join(f'- {t}' for t in title_analysis.get('low_titles', [])) or 'データ不足'}

【バズったShortsフック（上位5件）】
{chr(10).join(f'- [{h["views"]:,}回] 「{h["hook"]}」' for h in top_hooks[:5]) or 'データ不足'}

【投稿時刻別平均視聴数（高い順）】
{chr(10).join(f'- {h}時: {v:,}回' for h, v in list(timing.items())[:5]) or 'データ不足'}
"""

    prompt = f"""あなたはYouTubeチャンネルの成長を専門とするトップストラテジストです。
以下のチャンネル分析データをもとに、明日から使う最適なコンテンツ戦略をJSON形式で作成してください。

{analysis_text}

【指示】
- 上記データから「何がバズり、何がバズらなかったか」を分析する
- 日本のYouTubeで今バズっているトレンド（歴史の真実、お金の知識、心理学、深海生物、衝撃の事実など）も考慮する
- データが少ない場合は、視聴数の多い雑学YouTubeチャンネルのベストプラクティスを参考にする
- 戦略は具体的・実践的に（「衝撃的なタイトルを使う」ではなく「〇〇という言葉を含むタイトルを使う」レベルで）

以下のJSON形式で出力してください:
{{
  "title_patterns": [
    "バズるタイトルパターン1（〇〇は変数プレースホルダ）",
    "バズるタイトルパターン2",
    "バズるタイトルパターン3",
    "バズるタイトルパターン4",
    "バズるタイトルパターン5"
  ],
  "recommended_genres": [
    "明日おすすめのジャンル・テーマ1（具体的に）",
    "明日おすすめのジャンル・テーマ2",
    "明日おすすめのジャンル・テーマ3",
    "明日おすすめのジャンル・テーマ4",
    "明日おすすめのジャンル・テーマ5"
  ],
  "hook_templates": [
    "Shortsで使うべきフックテンプレート1",
    "Shortsで使うべきフックテンプレート2",
    "Shortsで使うべきフックテンプレート3",
    "Shortsで使うべきフックテンプレート4",
    "Shortsで使うべきフックテンプレート5"
  ],
  "avoid_patterns": [
    "避けるべきタイトルパターン・NGワード1",
    "避けるべきタイトルパターン・NGワード2"
  ],
  "top_keywords": ["必ず入れるべきキーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"],
  "strategy_note": "今週の総括と来週の戦略（200文字以内）"
}}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=1500,
    )
    return json.loads(response.choices[0].message.content)


# ─────────────────────────────────────────────────────
# メイン
# ─────────────────────────────────────────────────────

def generate_daily_strategy() -> dict:
    """
    毎日の分析を実行して strategy.json を更新する。
    main.py から毎日6:00に呼ばれる。
    """
    print("\n" + "=" * 60)
    print("  🧠 戦略分析エンジン 起動")
    print("=" * 60)

    db = _load_db()
    videos = db.get("videos", [])
    shorts = [v for v in videos if v["type"] == "shorts"]

    if len(videos) < 3:
        print("  ⚠️  動画データが3本未満のためデフォルト戦略を維持します")
        strategy = DEFAULT_STRATEGY.copy()
        strategy["generated_at"] = datetime.now().isoformat()
        _save_strategy(strategy)
        return strategy

    print(f"  📊 分析対象: {len(videos)}本（Shorts: {len(shorts)}本）")

    metrics = _compute_metrics(videos)
    title_analysis = _analyze_title_patterns(videos)
    top_hooks = _analyze_hooks(shorts)
    timing = _analyze_timing(videos)

    print(f"  直近7本平均視聴数: {metrics.get('recent7_avg', 0):,}回（前週比: {metrics.get('trend_pct', 0):+}%）")
    print("  GPT-4o で戦略を生成中...")

    try:
        strategy_data = _generate_strategy_with_gpt(metrics, title_analysis, top_hooks, timing)
    except Exception as e:
        print(f"  ⚠️  GPT-4o 戦略生成エラー: {e}。デフォルト戦略を維持します。")
        strategy_data = DEFAULT_STRATEGY.copy()

    strategy = {
        "generated_at": datetime.now().isoformat(),
        "metrics": metrics,
        **strategy_data,
    }

    _save_strategy(strategy)
    _print_strategy_report(strategy)
    return strategy


def _print_strategy_report(strategy: dict):
    """戦略レポートをコンソールに表示する。"""
    print("\n" + "─" * 60)
    print("  📋 本日の戦略レポート")
    print("─" * 60)

    if strategy.get("strategy_note"):
        print(f"  戦略メモ: {strategy['strategy_note']}")

    print("\n  【明日使うタイトルパターン】")
    for i, p in enumerate(strategy.get("title_patterns", [])[:5], 1):
        print(f"    {i}. {p}")

    print("\n  【推奨ジャンル】")
    for i, g in enumerate(strategy.get("recommended_genres", [])[:5], 1):
        print(f"    {i}. {g}")

    print("\n  【Shortsフックテンプレート】")
    for i, h in enumerate(strategy.get("hook_templates", [])[:3], 1):
        print(f"    {i}. {h}")

    if strategy.get("avoid_patterns"):
        print("\n  【NGパターン（避けること）】")
        for p in strategy.get("avoid_patterns", [])[:3]:
            print(f"    ✕ {p}")

    print("─" * 60)
