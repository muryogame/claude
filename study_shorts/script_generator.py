"""
OpenAI API を使って学習Tips系60秒ショート動画スクリプトを自動生成する
ジャンル: 勉強法 / 記憶術 / 学習科学 / 集中力 / 試験対策
"""
import json
import random
from openai import OpenAI
from config import OPENAI_API_KEY, CONTENT_GENRES, SHORTS_TARGET_SECONDS, STUDYFLOW_URL
from collector import load_topics_by_genre, _get_sample_topics

client = OpenAI(api_key=OPENAI_API_KEY)

TARGET_CHARS = 300  # 約60秒 (日本語TTS: 約4.5文字/秒)

PROMO_TEXT = f"学習時間を記録したい方は、無料アプリ StudyFlow をチェック！{STUDYFLOW_URL}"


def _load_strategy_hints() -> dict:
    """strategy.json からフック・キーワードを取得する（失敗しても続行）。"""
    try:
        from strategy import load_strategy
        s = load_strategy()
        return {
            "hooks":    s.get("hook_templates", []),
            "keywords": s.get("hot_keywords", []),
            "patterns": s.get("title_patterns", []),
        }
    except Exception:
        return {}

GENRE_PROMPTS = {
    "study_tips": {
        "label": "勉強法・学習Tips",
        "system": (
            "あなたはYouTube Shortsで「効率的な勉強法・学習Tips」を発信する人気教育クリエイターです。"
            "科学的根拠に基づいた勉強法を、わかりやすく実践的に紹介します。"
            "視聴者がすぐに試したくなる具体的なTipsを提供します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、最低60秒（約300文字）の学習Tipsショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 「実は〇〇するだけで勉強効率が上がる！」形式でつかみ（20文字以内）\n"
            "- 本文: 具体的なTipsを3ステップで説明（220文字以内）\n"
            "- 締め: 「チャンネル登録でもっと学習法を学ぼう！」（30文字以内）\n"
        ),
        "image_style": "focused student studying at clean modern desk, soft blue and purple lighting, books and laptop, motivational atmosphere, anime illustration style, bright and inspiring",
        "thumbnail_prompt": "determined student with glowing eyes studying hard, clean modern workspace, indigo and purple gradient background, motivational energy, high quality digital art",
    },
    "memory_hacks": {
        "label": "記憶術・暗記法",
        "system": (
            "あなたはYouTube Shortsで「記憶術・暗記法」を専門に発信する記憶の専門家です。"
            "科学的に証明された暗記テクニックを、誰でもすぐ実践できる形で紹介します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、最低60秒（約300文字）の記憶術ショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 「この方法で記憶力が○倍になる！」形式でつかみ（20文字以内）\n"
            "- 本文: 記憶術の具体的な手順を実践的に説明（220文字以内）\n"
            "- 締め: 「今すぐ試して、成績アップを目指そう！」（30文字以内）\n"
        ),
        "image_style": "brain with glowing neural connections, knowledge symbols floating, indigo and purple color scheme, futuristic science illustration, anime style",
        "thumbnail_prompt": "glowing brain with memory connections, books and knowledge symbols, deep indigo and purple gradient, futuristic educational theme, anime digital art style",
    },
    "study_science": {
        "label": "学習科学・研究データ",
        "system": (
            "あなたはYouTube Shortsで「学習科学の最新研究」を発信するサイエンスライターです。"
            "脳科学・認知科学の研究結果を、面白くわかりやすく紹介します。"
            "「なるほど！」と思わせる驚きの研究データを提供します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、最低60秒（約300文字）の学習科学ショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 「研究で判明！〇〇すると記憶力が○%アップ！」形式でつかみ（25文字以内）\n"
            "- 本文: 研究の内容と実践的な応用方法を説明（210文字以内）\n"
            "- 締め: 「科学的な学習法でライバルに差をつけよう！」（30文字以内）\n"
        ),
        "image_style": "scientist studying brain activity, data charts and graphs, modern laboratory, indigo purple glow, anime style educational illustration",
        "thumbnail_prompt": "scientific study visualization, brain scan with glowing data, research charts, deep blue and purple atmosphere, modern educational anime art style",
    },
    "concentration": {
        "label": "集中力・作業効率UP",
        "system": (
            "あなたはYouTube Shortsで「集中力アップ・作業効率化」を発信する生産性コーチです。"
            "深い集中状態（フロー）に入るための具体的な方法を紹介します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、最低60秒（約300文字）の集中力アップショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 「集中できない人必見！〇〇するだけで2時間集中できる！」形式でつかみ（25文字以内）\n"
            "- 本文: 集中力アップの具体的なテクニック（210文字以内）\n"
            "- 締め: 「今日からデキる人の集中習慣を手に入れよう！」（30文字以内）\n"
        ),
        "image_style": "person in deep focus zone, clock and productivity symbols, calm blue purple atmosphere, zen study environment, anime illustration style",
        "thumbnail_prompt": "focused person in flow state, time symbols and productivity aura, indigo purple glowing background, zen concentration theme, anime art style",
    },
    "exam_strategy": {
        "label": "試験対策・資格勉強法",
        "system": (
            "あなたはYouTube Shortsで「試験対策・資格勉強法」を発信する試験攻略のプロです。"
            "合格者が実践している勉強法を具体的に紹介し、視聴者の合格をサポートします。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、最低60秒（約300文字）の試験対策ショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 「合格者だけが知っている○○試験の攻略法！」形式でつかみ（25文字以内）\n"
            "- 本文: 試験対策の具体的な戦略とテクニック（210文字以内）\n"
            "- 締め: 「一緒に合格を目指そう！チャンネル登録お願いします！」（30文字以内）\n"
        ),
        "image_style": "student celebrating exam success, certificate and trophy, bright motivational colors, indigo and gold, achievement atmosphere, anime art style",
        "thumbnail_prompt": "triumphant student passing exam, diploma and achievement symbols, gold and indigo gradient, success and motivation theme, anime digital illustration",
    },
}


def pick_genre(index: int) -> str:
    return CONTENT_GENRES[index % len(CONTENT_GENRES)]


def generate_shorts_script(genre: str = "study_tips") -> dict:
    """指定ジャンルの学習Tipsスクリプトを生成して返す。"""
    prompt_cfg = GENRE_PROMPTS.get(genre, GENRE_PROMPTS["study_tips"])

    # トピック収集
    topics = load_topics_by_genre(genre)
    if topics:
        sample = random.sample(topics, min(5, len(topics)))
        topic_text = "\n".join(f"- {t['title']}" for t in sample)
    else:
        samples = _get_sample_topics(genre)
        topic_text = "\n".join(f"- {s}" for s in samples)

    hints = _load_strategy_hints()
    hint_text = ""
    if hints.get("hooks"):
        sample_hooks = random.sample(hints["hooks"], min(2, len(hints["hooks"])))
        hint_text += f"\n参考フック例（アレンジして使うこと）:\n" + "\n".join(f"- {h}" for h in sample_hooks)
    if hints.get("keywords"):
        hint_text += f"\n注目キーワード（タイトル・タグに活用）: {', '.join(hints['keywords'][:5])}"
    if hints.get("patterns"):
        hint_text += f"\nバズるタイトルパターン例: {hints['patterns'][0]}"

    user_prompt = (
        f"{prompt_cfg['instruction']}\n\n"
        f"参考トピック（このまま使わず参考にするだけ）:\n{topic_text}\n"
        f"{hint_text}\n\n"
        f"台本をJSON形式で返してください:\n"
        '{"title": "タイトル(40文字以内)", "hook": "つかみ文", "body": "本文", '
        '"cta": "CTA文", "full_text": "hook+body+cta を繋げた完全台本", '
        '"tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"]}'
    )

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system",  "content": prompt_cfg["system"]},
            {"role": "user",    "content": user_prompt},
        ],
        temperature=0.85,
        response_format={"type": "json_object"},
    )

    script = json.loads(resp.choices[0].message.content)

    # 60秒確保
    while len(script.get("full_text", "")) < TARGET_CHARS:
        script["full_text"] = script.get("full_text", "") + "　ぜひチャンネル登録して、毎日の学習に役立てください！"

    # StudyFlow 宣伝文を full_text 末尾に追加
    script["full_text"] = script["full_text"].rstrip("！。") + f"。{PROMO_TEXT}"

    script["genre"]              = genre
    script["genre_label"]        = prompt_cfg["label"]
    script["image_style"]        = prompt_cfg["image_style"]
    script["thumbnail_prompt"]   = prompt_cfg["thumbnail_prompt"]
    script["studyflow_url"]      = STUDYFLOW_URL

    return script
