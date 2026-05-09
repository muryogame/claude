"""
OpenAI APIを使って10分間の雑学動画スクリプトを自動生成する
"""
import json
import random
from openai import OpenAI
from config import OPENAI_API_KEY
from collector import load_collected_topics

client = OpenAI(api_key=OPENAI_API_KEY)

TARGET_WORDS = 2000  # 10分 ≒ 2000字


def _load_strategy() -> dict:
    """strategy.json から今日の戦略を読み込む。"""
    try:
        from strategy import load_strategy
        return load_strategy()
    except Exception:
        return {}


def pick_topics(n: int = 5) -> list[str]:
    """蓄積トピックからランダムにn件選ぶ。高視聴数トピックを優先する。"""
    topics = load_collected_topics()
    if not topics:
        return ["宇宙の不思議", "人体の謎", "歴史の裏側", "動物の秘密", "食べ物の雑学"]

    # 学習インサイトから高視聴数トピックを取得
    try:
        from analytics import get_learning_insights
        insights = get_learning_insights()
        high_view_topics = [t["topic"] for t in insights.get("high_view_topics", [])[:5]]
    except Exception:
        high_view_topics = []

    # 高視聴数トピックをリストに変換して優先的に選出
    collected_titles = [t.get("title", t.get("description", "")) for t in topics]
    preferred = [t for t in collected_titles if t in high_view_topics]
    others = [t for t in collected_titles if t not in high_view_topics]

    # 高視聴数トピックを最大2件、残りをランダムで補完
    n_preferred = min(2, len(preferred))
    n_random = n - n_preferred
    selected = (
        random.sample(preferred, n_preferred) if preferred else []
    ) + random.sample(others, min(n_random, len(others)))
    return selected[:n] if selected else ["宇宙の不思議", "人体の謎", "歴史の裏側", "動物の秘密", "食べ物の雑学"]


def generate_script(topics: list[str] | None = None) -> dict:
    """
    スクリプトを生成して返す。
    返り値: {title, description, tags, sections: [{heading, content}], full_text}
    """
    if topics is None:
        topics = pick_topics(5)

    topic_list = "\n".join(f"- {t}" for t in topics)

    # 学習インサイトをプロンプトに組み込む
    learning_hint = ""
    try:
        from analytics import get_learning_insights
        insights = get_learning_insights()
        if insights.get("top_videos"):
            top_titles = [v["title"] for v in insights["top_videos"]]
            learning_hint = f"""
【過去の高視聴数動画（参考）】
{chr(10).join(f'- {t}' for t in top_titles)}
→ これらのタイトルや構成を参考に、同様の訴求力を持つ台本を作ってください。
"""
        if insights.get("high_view_tags"):
            top_tags = [t["tag"] for t in insights["high_view_tags"][:5]]
            learning_hint += f"\n【視聴数が伸びやすいタグ】: {', '.join(top_tags)}\n"
    except Exception:
        pass

    # 戦略JSONから今日の推奨ジャンル・キーワードを取得
    strategy = _load_strategy()
    recommended_genres = strategy.get("recommended_genres", [])
    top_keywords = strategy.get("top_keywords", [])
    title_patterns = strategy.get("title_patterns", [])
    avoid_patterns = strategy.get("avoid_patterns", [])

    # 推奨ジャンルがあればそこからランダム選択、なければデフォルト
    default_genres = [
        "学校では絶対教えてくれない歴史の衝撃的な真実",
        "知らないと一生損するお金・投資の雑学",
        "科学者も驚く自然・宇宙の信じられない事実",
        "99%の人が誤解している体・健康の常識",
        "心理学者が明かす人間の行動の不思議な真実",
        "世界のヤバい生き物・深海生物の衝撃的な能力",
        "歴史上の人物の誰も知らない意外すぎる一面",
        "日本の常識が実は世界では非常識だった話",
        "億万長者だけが知っているお金の使い方の真実",
        "脳科学が解明した記憶・集中力の驚くべき仕組み",
    ]
    genre_pool = recommended_genres if recommended_genres else default_genres
    genre_hint = random.choice(genre_pool)

    # 戦略に基づいた追加指示を構築
    strategy_hint = ""
    if title_patterns:
        strategy_hint += f"\n【分析に基づく推奨タイトルパターン（この形式を参考に）】\n"
        strategy_hint += "\n".join(f"- {p}" for p in title_patterns[:3])
    if top_keywords:
        strategy_hint += f"\n\n【バズが確認されているキーワード（積極的に使う）】\n"
        strategy_hint += "、".join(top_keywords[:6])
    if avoid_patterns:
        strategy_hint += f"\n\n【NGパターン（使わないこと）】\n"
        strategy_hint += "\n".join(f"- {p}" for p in avoid_patterns[:2])

    prompt = f"""あなたはYouTube登録者100万人超のトップクリエイターです。
日本で今バズっているジャンル「{genre_hint}」を軸に、以下のテーマを参考にした約10分間（約{TARGET_WORDS}文字）の台本を作成してください。

参考テーマ:
{topic_list}
{learning_hint}{strategy_hint}

【バズる動画の絶対条件】
- タイトル：「学校で教えてくれなかった」「知らないと一生損する」「99%の人が知らない」「実は〇〇だった」「衝撃的な真実」など強烈な言葉を使う（クリック率命）
- 冒頭15秒：「実はこれ、全部嘘だったんです」「〇〇を知った瞬間、人生観が変わりました」のように視聴者を引きつける
- 構成：事実の提示 → 意外な深掘り → 「つまりどういうこと？」の解説 → 日常生活への影響
- 視聴者への問いかけを3回以上（例：「あなたはこれ知ってましたか？コメントで教えてください！」）
- 「えっ、マジで？」と思わせる意外性・反転ネタを必ず2つ以上含める
- テンポよく、口語で、途中で「ちょっと待って、これ本当にヤバいんですよ」などの盛り上げフレーズを入れる
- 締め（30秒）：「次の動画もヤバいので絶対見てください！チャンネル登録もお願いします！」

以下のJSON形式で出力してください：
{{
  "title": "動画タイトル（32文字以内、強烈な好奇心を刺激する表現）",
  "description": "YouTube概要欄（200文字程度、最初の1文で「え、何これ？」と思わせる）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5", "タグ6", "タグ7"],
  "sections": [
    {{"heading": "セクション名（短くインパクトのある見出し）", "content": "セクションの台本内容（各400文字以上）"}},
    ...
  ]
}}"""

    print("  スクリプトを生成中...")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=4000,
    )

    raw = response.choices[0].message.content
    data = json.loads(raw)

    # full_text を結合
    full_text = "\n\n".join(
        f"【{s['heading']}】\n{s['content']}"
        for s in data.get("sections", [])
    )
    data["full_text"] = full_text
    data["topics_used"] = topics

    print(f"  スクリプト生成完了: 「{data['title']}」({len(full_text)}文字)")
    return data
