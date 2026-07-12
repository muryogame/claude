"""
OpenAI API を使って学習Tips系20〜32秒ショート動画スクリプトを自動生成する
ジャンル: 勉強法 / 記憶術 / 学習科学 / 集中力 / 試験対策
"""
import json
import os
import random
from openai import OpenAI
from config import OPENAI_API_KEY, CONTENT_GENRES, SHORTS_TARGET_SECONDS, STUDYFLOW_URL, BASE_DIR
from collector import load_topics_by_genre, _get_sample_topics

client = OpenAI(api_key=OPENAI_API_KEY)

TARGET_CHARS = 150  # 約32秒 (日本語TTS: 約4.5文字/秒) — 2026年のShorts最適尺(20〜35秒)に合わせて短尺化
MIN_CHARS = 100

PROMO_TEXT = f"学習時間を記録したい方は、無料アプリ StudyFlow をチェック！{STUDYFLOW_URL}"

# ジャンルごとの直近使用タイトル追跡ファイル（同じ切り口の量産を防ぐ）
USED_TITLES_FILE = os.path.join(BASE_DIR, "data", "used_short_titles.json")
TITLES_PER_GENRE_KEPT = 8


def _load_used_titles() -> dict:
    if os.path.exists(USED_TITLES_FILE):
        with open(USED_TITLES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_used_title(genre: str, title: str):
    used = _load_used_titles()
    lst = used.get(genre, [])
    lst.append(title)
    used[genre] = lst[-TITLES_PER_GENRE_KEPT:]
    os.makedirs(os.path.dirname(USED_TITLES_FILE), exist_ok=True)
    with open(USED_TITLES_FILE, "w", encoding="utf-8") as f:
        json.dump(used, f, ensure_ascii=False)


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

# ジャンルごとの冒頭フック例（複数持たせて毎回ランダムに1つだけ提示する。
# 単一の固定フレーズだとGPTがほぼ同じ文言を毎回生成してしまい、投稿が量産型の
# 「99%の人が知らない○○法」ばかりになる問題があったため）
HOOK_TEMPLATES = {
    "study_tips": [
        "実は〇〇するだけで勉強効率が上がる！",
        "その勉強法、実は逆効果かも！？",
        "○分の習慣を変えるだけで成績が変わる",
        "多くの人がハマる勉強の落とし穴とは",
        "この順番を変えるだけで効率が倍に",
    ],
    "memory_hacks": [
        "この方法で記憶力が○倍になる！",
        "覚えられないのは才能じゃなく○○のせい",
        "たった○秒で記憶に定着する裏技",
        "脳が勝手に覚えてしまう暗記法",
        "テスト前日にやってはいけない暗記NG行動",
    ],
    "study_science": [
        "研究で判明！〇〇すると記憶力が○%アップ！",
        "科学が証明した、勉強の常識のウソ",
        "○○の研究でわかった衝撃の事実",
        "脳科学的に正しい休憩の取り方とは",
        "睡眠と記憶力の知られざる関係",
    ],
    "concentration": [
        "集中できない人必見！〇〇するだけで2時間集中できる！",
        "集中力が続かないのは意志の弱さじゃない",
        "○分作業→○分休憩が最強な科学的理由",
        "スマホを見てしまう本当の原因とは",
        "集中力が切れる前兆、気づいてる？",
    ],
    "exam_strategy": [
        "合格者だけが知っている○○試験の攻略法！",
        "不合格者に共通するNG勉強法とは",
        "本番○日前からやるべきこと",
        "○○点台から一気に伸びた勉強法",
        "過去問だけで受かるは本当か？",
    ],
}

# 本文中盤の「二段目フック」例。単一の固定フレーズだとGPTがほぼ毎回同じ文言
# （「え、実はここからが本題で」）をコピーしてしまい、AI量産感が出るため複数用意する
MINI_HOOK_EXAMPLES = [
    "え、実はここからが本題で",
    "ここだけの話、本当にヤバいのは",
    "でも実際に効くのはここから",
    "多くの人が見落とすのがここで",
    "ここでようやく核心なんですが",
]

GENRE_PROMPTS = {
    "study_tips": {
        "label": "勉強法・学習Tips",
        "system": (
            "あなたはYouTube Shortsで「効率的な勉強法・学習Tips」を発信する人気教育クリエイターです。"
            "科学的根拠に基づいた勉強法を、わかりやすく実践的に紹介します。"
            "視聴者がすぐに試したくなる具体的なTipsを提供します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、20〜32秒程度（約100〜150文字）でテンポよく完結する学習Tipsショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 下記の「フック例」はあくまで1つの型。同じ言い回しの丸写しはせず、具体的な数字や意外性を変えて最初の3秒でつかむ（20文字以内）\n"
            "- 本文: 具体的なTipsを1つだけに絞って説明。中盤に下記の「中盤フック例」のような（丸写しではなく自分の言葉で作った）二段目のミニフックを入れる（60〜90文字）\n"
            "- 締め: 「保存して後で見返してね！」など保存・シェアを促す一言を優先し、冒頭に軽く触れてループを誘発する（25文字以内）\n"
            "- タイトル: 具体的な数字・固有名詞（試験名・手法名など）を必ず1つ入れる。「集中力アップ法」のような抽象的なタイトルの丸写しは禁止（過去の実績データでは、抽象的なタイトルほど再生数が伸び悩む傾向が出ている）\n"
        ),
        "image_style": "photorealistic photograph of a focused student studying at a clean modern desk, soft blue and purple ambient lighting, books and laptop, natural cinematic lighting, shallow depth of field, motivational atmosphere",
        "thumbnail_prompt": "photorealistic photograph of a determined student studying hard, clean modern workspace, indigo and purple ambient lighting, natural cinematic lighting, shallow depth of field, motivational energy",
    },
    "memory_hacks": {
        "label": "記憶術・暗記法",
        "system": (
            "あなたはYouTube Shortsで「記憶術・暗記法」を専門に発信する記憶の専門家です。"
            "科学的に証明された暗記テクニックを、誰でもすぐ実践できる形で紹介します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、20〜32秒程度（約100〜150文字）でテンポよく完結する記憶術ショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 下記の「フック例」はあくまで1つの型。同じ言い回しの丸写しはせず、具体的な数字や意外性を変えて最初の3秒でつかむ（20文字以内）\n"
            "- 本文: 記憶術の具体的な手順を1つだけに絞って説明。中盤に下記の「中盤フック例」のような（丸写しではなく自分の言葉で作った）二段目のミニフックを入れる（60〜90文字）\n"
            "- 締め: 「保存して後で見返してね！」など保存・シェアを促す一言を優先し、冒頭に軽く触れてループを誘発する（25文字以内）\n"
            "- タイトル: 具体的な数字・固有名詞（試験名・手法名など）を必ず1つ入れる。「集中力アップ法」のような抽象的なタイトルの丸写しは禁止（過去の実績データでは、抽象的なタイトルほど再生数が伸び悩む傾向が出ている）\n"
        ),
        "image_style": "photorealistic macro photograph evoking a brain with glowing neural connections, indigo and purple ambient lighting, natural cinematic lighting, shallow depth of field, scientific atmosphere",
        "thumbnail_prompt": "photorealistic photograph evoking glowing brain connections, books and knowledge symbols, deep indigo and purple ambient lighting, natural cinematic lighting, shallow depth of field",
    },
    "study_science": {
        "label": "学習科学・研究データ",
        "system": (
            "あなたはYouTube Shortsで「学習科学の最新研究」を発信するサイエンスライターです。"
            "脳科学・認知科学の研究結果を、面白くわかりやすく紹介します。"
            "「なるほど！」と思わせる驚きの研究データを提供します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、20〜32秒程度（約100〜150文字）でテンポよく完結する学習科学ショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 下記の「フック例」はあくまで1つの型。同じ言い回しの丸写しはせず、具体的な数字や意外性を変えて最初の3秒でつかむ（25文字以内）\n"
            "- 本文: 研究の内容を1つだけに絞って説明。中盤に下記の「中盤フック例」のような（丸写しではなく自分の言葉で作った）二段目のミニフックを入れる（60〜90文字）\n"
            "- 締め: 「保存して後で見返してね！」など保存・シェアを促す一言を優先し、冒頭に軽く触れてループを誘発する（25文字以内）\n"
            "- タイトル: 具体的な数字・固有名詞（試験名・手法名など）を必ず1つ入れる。「集中力アップ法」のような抽象的なタイトルの丸写しは禁止（過去の実績データでは、抽象的なタイトルほど再生数が伸び悩む傾向が出ている）\n"
        ),
        "image_style": "photorealistic photograph of a scientist studying brain activity data on screens, modern laboratory, indigo purple ambient lighting, natural cinematic lighting, shallow depth of field",
        "thumbnail_prompt": "photorealistic photograph of a scientific brain scan display, research charts, deep blue and purple ambient lighting, natural cinematic lighting, shallow depth of field",
    },
    "concentration": {
        "label": "集中力・作業効率UP",
        "system": (
            "あなたはYouTube Shortsで「集中力アップ・作業効率化」を発信する生産性コーチです。"
            "深い集中状態（フロー）に入るための具体的な方法を紹介します。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、20〜32秒程度（約100〜150文字）でテンポよく完結する集中力アップショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 下記の「フック例」はあくまで1つの型。同じ言い回しの丸写しはせず、具体的な数字や意外性を変えて最初の3秒でつかむ（25文字以内）\n"
            "- 本文: 集中力アップのテクニックを1つだけに絞って説明。中盤に下記の「中盤フック例」のような（丸写しではなく自分の言葉で作った）二段目のミニフックを入れる（60〜90文字）\n"
            "- 締め: 「保存して後で見返してね！」など保存・シェアを促す一言を優先し、冒頭に軽く触れてループを誘発する（25文字以内）\n"
            "- タイトル: 具体的な数字・固有名詞（試験名・手法名など）を必ず1つ入れる。「集中力アップ法」のような抽象的なタイトルの丸写しは禁止（過去の実績データでは、抽象的なタイトルほど再生数が伸び悩む傾向が出ている）\n"
        ),
        "image_style": "photorealistic photograph of a person in deep focus at a desk, clock nearby, calm blue purple ambient lighting, natural cinematic lighting, shallow depth of field, zen study environment",
        "thumbnail_prompt": "photorealistic photograph of a focused person in a flow state, indigo purple ambient lighting, natural cinematic lighting, shallow depth of field, zen concentration theme",
    },
    "exam_strategy": {
        "label": "試験対策・資格勉強法",
        "system": (
            "あなたはYouTube Shortsで「試験対策・資格勉強法」を発信する試験攻略のプロです。"
            "合格者が実践している勉強法を具体的に紹介し、視聴者の合格をサポートします。"
        ),
        "instruction": (
            "以下のテーマから1つ選び、20〜32秒程度（約100〜150文字）でテンポよく完結する試験対策ショート動画台本を作成してください。\n"
            "要件:\n"
            "- 冒頭: 下記の「フック例」はあくまで1つの型。同じ言い回しの丸写しはせず、具体的な数字や意外性を変えて最初の3秒でつかむ（25文字以内）\n"
            "- 本文: 試験対策の戦略を1つだけに絞って説明。中盤に下記の「中盤フック例」のような（丸写しではなく自分の言葉で作った）二段目のミニフックを入れる（60〜90文字）\n"
            "- 締め: 「保存して後で見返してね！」など保存・シェアを促す一言を優先し、冒頭に軽く触れてループを誘発する（25文字以内）\n"
            "- タイトル: 具体的な数字・固有名詞（試験名・手法名など）を必ず1つ入れる。「集中力アップ法」のような抽象的なタイトルの丸写しは禁止（過去の実績データでは、抽象的なタイトルほど再生数が伸び悩む傾向が出ている）\n"
        ),
        "image_style": "photorealistic photograph of a student celebrating exam success, certificate nearby, bright motivational indigo and gold ambient lighting, natural cinematic lighting, shallow depth of field",
        "thumbnail_prompt": "photorealistic photograph of a triumphant student holding a diploma, gold and indigo ambient lighting, natural cinematic lighting, shallow depth of field, success and motivation theme",
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

    # フック例は毎回ランダムに1つだけ提示（固定文言の量産を防ぐ）
    hook_example = random.choice(HOOK_TEMPLATES.get(genre, [""]))
    mini_hook_example = random.choice(MINI_HOOK_EXAMPLES)

    # 直近使用したタイトルを除外リストとして提示（同じ切り口の重複投稿を防ぐ）
    used_titles = _load_used_titles().get(genre, [])
    avoid_text = ""
    if used_titles:
        avoid_text = (
            "\n直近このジャンルで使用済みのタイトル（同じ切り口・似た言い回しは絶対に避けること）:\n"
            + "\n".join(f"- {t}" for t in used_titles)
        )

    user_prompt = (
        f"{prompt_cfg['instruction']}\n\n"
        f"フック例（あくまで型の一例。この通りに書かず自分の言葉で作る）: {hook_example}\n"
        f"中盤フック例（あくまで型の一例。この通りに書かず自分の言葉で作る）: {mini_hook_example}\n"
        f"参考トピック（このまま使わず参考にするだけ）:\n{topic_text}\n"
        f"{hint_text}"
        f"{avoid_text}\n\n"
        f"flash_text: この動画の一番の「オチ・結論」を6〜8文字程度の超短フレーズで（動画冒頭0.3秒の白フラッシュに一瞬だけ表示し、指を止めるために使う）\n\n"
        f"台本をJSON形式で返してください:\n"
        '{"title": "タイトル(40文字以内)", "hook": "つかみ文", "body": "本文", '
        '"cta": "CTA文", "full_text": "hook+body+cta を繋げた完全台本", '
        '"flash_text": "冒頭フラッシュ用の超短い衝撃ワード（6〜8文字程度）", '
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

    # 短すぎる場合のみ一度だけ補う（同じ文言の繰り返しループはテンポを崩すため避ける）
    if len(script.get("full_text", "")) < MIN_CHARS:
        script["full_text"] = "\n\n".join(filter(None, [
            script.get("hook", ""), script.get("body", ""), script.get("cta", ""),
        ]))

    # StudyFlow 宣伝文を full_text 末尾に追加
    script["full_text"] = script["full_text"].rstrip("！。") + f"。{PROMO_TEXT}"

    script["genre"]              = genre
    script["genre_label"]        = prompt_cfg["label"]
    script["image_style"]        = prompt_cfg["image_style"]
    script["thumbnail_prompt"]   = prompt_cfg["thumbnail_prompt"]
    script["studyflow_url"]      = STUDYFLOW_URL

    if script.get("title"):
        _save_used_title(genre, script["title"])

    return script
