"""
YouTube Shorts用の縦型1分動画を自動生成するモジュール
解像度: 1080x1920（縦型）、最大60秒
- Ken Burns効果（ズーム・パン）
- Pexels フリー素材動画背景（APIキーがあれば優先使用）
- テキストアニメーション（字幕オーバーレイ）
"""
import os
import json
import random
import textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import AudioFileClip, VideoClip, VideoFileClip, concatenate_videoclips
from moviepy import vfx
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR
from image_utils import generate_dalle_bg, make_gradient_bg

client = OpenAI(api_key=OPENAI_API_KEY)

SHORTS_W = 1080
SHORTS_H = 1920
FONT_PATH = "/home/takah/.local/share/fonts/NotoSansCJKjp-Bold.otf"
FONT_PATH_FALLBACK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
MOTION_TYPES = ["zoom_in", "zoom_out", "pan_left", "pan_right", "diagonal_in", "diagonal_out"]


# ── テキストアニメーション ───────────────────────────────────────


def _get_font(size: int) -> ImageFont.FreeTypeFont:
    for path in [FONT_PATH, FONT_PATH_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _render_subtitle_frame(text: str, alpha: float, w: int = SHORTS_W, h: int = SHORTS_H) -> np.ndarray:
    """字幕テキストをRGBA numpy配列として描画する（背景付き）。"""
    font_main = _get_font(58)
    font_small = _get_font(44)
    font = font_main if len(text) <= 20 else font_small

    # テキストを折り返す
    wrapped = textwrap.fill(text, width=16)
    lines = wrapped.split("\n")

    line_h = font.size + 12
    box_h = line_h * len(lines) + 40
    box_w = w - 80

    # 半透明黒背景 + テキスト
    img = Image.new("RGBA", (w, box_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    bg_alpha = int(180 * alpha)
    draw.rounded_rectangle([0, 0, box_w, box_h - 1], radius=20,
                            fill=(10, 10, 10, bg_alpha))

    text_alpha = int(255 * alpha)
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        x = (box_w - tw) // 2
        y = 20 + i * line_h
        # 影
        draw.text((x + 3, y + 3), line, font=font, fill=(0, 0, 0, int(text_alpha * 0.6)))
        # 本文（白）
        draw.text((x, y), line, font=font, fill=(255, 255, 255, text_alpha))

    # キャンバス中央下に配置
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    y_pos = h - box_h - 120
    x_pos = (w - box_w) // 2
    canvas.paste(img.crop((0, 0, box_w, box_h)), (x_pos, y_pos))
    return np.array(canvas)


def _split_script_to_scenes(script_data: dict, num_scenes: int) -> list[str]:
    """スクリプトをシーン数に合わせて分割する。"""
    hook = script_data.get("hook", "")
    body = script_data.get("body", "")
    outro = script_data.get("outro", "")

    if num_scenes == 1:
        return [hook]
    if num_scenes == 2:
        return [hook, outro]

    # 3シーン: hook / body前半 / body後半+outro
    mid = len(body) // 2
    split_pos = body.find("。", mid)
    if split_pos == -1:
        split_pos = mid
    else:
        split_pos += 1

    return [hook, body[:split_pos].strip(), (body[split_pos:] + outro).strip()]


# ── Ken Burns効果 ──────────────────────────────────────────────


def ken_burns_clip(image_path: str, duration: float, motion_type: str = None,
                   subtitle_text: str = "") -> VideoClip:
    """Ken Burns効果＋テキストアニメーション付きビデオクリップを生成する。"""
    if motion_type is None:
        motion_type = random.choice(MOTION_TYPES)

    img = Image.open(image_path).convert("RGB").resize((SHORTS_W, SHORTS_H), Image.LANCZOS)
    img_arr = np.array(img)

    # 字幕フレームをキャッシュ（alpha=1.0固定で準備）
    subtitle_rgba = _render_subtitle_frame(subtitle_text, 1.0) if subtitle_text else None

    def make_frame(t):
        progress = t / max(duration, 0.001)

        if motion_type == "zoom_in":
            scale, ox, oy = 1.0 + 0.18 * progress, 0.5, 0.5
        elif motion_type == "zoom_out":
            scale, ox, oy = 1.18 - 0.18 * progress, 0.5, 0.5
        elif motion_type == "pan_left":
            scale, ox, oy = 1.12, 0.5 + 0.5 * progress, 0.5
        elif motion_type == "pan_right":
            scale, ox, oy = 1.12, 1.0 - 0.5 * progress, 0.5
        elif motion_type == "diagonal_in":
            scale = 1.0 + 0.15 * progress
            ox, oy = 0.3 + 0.2 * progress, 0.3 + 0.2 * progress
        else:  # diagonal_out
            scale = 1.15 - 0.15 * progress
            ox, oy = 0.7 - 0.2 * progress, 0.7 - 0.2 * progress

        new_w = int(SHORTS_W * scale)
        new_h = int(SHORTS_H * scale)
        resized = np.array(Image.fromarray(img_arr).resize((new_w, new_h), Image.LANCZOS))
        x = max(0, min(int((new_w - SHORTS_W) * ox), new_w - SHORTS_W))
        y = max(0, min(int((new_h - SHORTS_H) * oy), new_h - SHORTS_H))
        frame = resized[y:y + SHORTS_H, x:x + SHORTS_W].copy()

        # テキストオーバーレイ（フェードイン0.5秒 → 表示 → フェードアウト0.5秒）
        if subtitle_rgba is not None:
            fade = 0.5
            if t < fade:
                alpha = t / fade
            elif t > duration - fade:
                alpha = (duration - t) / fade
            else:
                alpha = 1.0
            alpha = max(0.0, min(1.0, alpha))

            overlay = subtitle_rgba.copy()
            overlay[:, :, 3] = (overlay[:, :, 3] * alpha).astype(np.uint8)

            bg = Image.fromarray(frame, "RGB")
            ov = Image.fromarray(overlay, "RGBA")
            bg.paste(ov, (0, 0), ov)
            frame = np.array(bg)

        return frame

    return VideoClip(make_frame, duration=duration)


# ── Pexels背景動画 ─────────────────────────────────────────────


def _pexels_bg_clip(stock_path: str, duration: float, subtitle_text: str = "") -> VideoClip:
    """Pexels素材を縦型にクロップし字幕を合成したクリップを返す。"""
    raw = VideoFileClip(stock_path)

    # 縦型クロップ: 9:16になるようにセンタークロップ
    src_w, src_h = raw.size
    target_w = int(src_h * 9 / 16)
    if target_w <= src_w:
        x1 = (src_w - target_w) // 2
        raw = raw.cropped(x1=x1, x2=x1 + target_w)
    raw = raw.resized((SHORTS_W, SHORTS_H))

    # ループして必要尺を確保
    if raw.duration < duration:
        loops = int(duration / raw.duration) + 1
        from moviepy import concatenate_videoclips as cv
        raw = cv([raw] * loops).subclipped(0, duration)
    else:
        raw = raw.subclipped(0, duration)

    if not subtitle_text:
        return raw

    subtitle_rgba = _render_subtitle_frame(subtitle_text, 1.0)

    def add_subtitle(get_frame, t):
        frame = get_frame(t).copy()
        fade = 0.5
        if t < fade:
            alpha = t / fade
        elif t > duration - fade:
            alpha = (duration - t) / fade
        else:
            alpha = 1.0
        alpha = max(0.0, min(1.0, alpha))

        overlay = subtitle_rgba.copy()
        overlay[:, :, 3] = (overlay[:, :, 3] * alpha).astype(np.uint8)
        bg = Image.fromarray(frame, "RGB")
        ov = Image.fromarray(overlay, "RGBA")
        bg.paste(ov, (0, 0), ov)
        return np.array(bg)

    return raw.transform(add_subtitle, apply_to="video")


# ── スクリプト生成 ─────────────────────────────────────────────


def _load_strategy() -> dict:
    """strategy.json から今日の戦略を読み込む。"""
    try:
        from strategy import load_strategy
        return load_strategy()
    except Exception:
        return {}


# バズ実績に基づいたジャンルローテーション（視聴数順）
PROVEN_GENRES = [
    {
        "genre": "love_psychology",
        "theme": "恋愛心理学・脳科学",
        "desc": "恋愛初期のドキドキ・惚れる仕組み・モテる心理など、恋愛に関する脳科学・心理学の衝撃事実",
        "title_prefix": "知らなきゃ損！恋愛の",
        "pexels": "romantic couple heart",
    },
    {
        "genre": "history",
        "theme": "歴史の衝撃的な真実",
        "desc": "教科書に載らない日本史・世界史の驚愕事実。戦国時代・江戸時代・歴史上の偉人の意外な一面",
        "title_prefix": "【衝撃】歴史の",
        "pexels": "ancient history samurai",
    },
    {
        "genre": "animal",
        "theme": "動物・生物の驚き",
        "desc": "コアラの驚く事実・深海生物の能力・動物の信じられない行動など、知られざる生物の秘密",
        "title_prefix": "え？マジで？",
        "pexels": "wildlife nature animal",
    },
    {
        "genre": "human_body",
        "theme": "人体の不思議",
        "desc": "人間の体に隠された驚くべき機能・脳の限界・健康の常識が実は嘘だった事実",
        "title_prefix": "え？マジで？人体の",
        "pexels": "human body science",
    },
    {
        "genre": "school_truth",
        "theme": "学校で教えない真実",
        "desc": "学校・教科書では絶対教えてくれなかった日本・世界の常識を覆す衝撃事実",
        "title_prefix": "【衝撃】学校で",
        "pexels": "knowledge truth shocking",
    },
    {
        "genre": "space",
        "theme": "宇宙の衝撃事実（具体的）",
        "desc": "ブラックホール・宇宙の終わり・宇宙人の可能性など、具体的な天体・宇宙の驚愕事実（汎用的な「宇宙の謎」は禁止）",
        "title_prefix": "知ってた？宇宙の",
        "pexels": "space galaxy cosmos",
    },
    {
        "genre": "psychology",
        "theme": "心理学・行動経済学",
        "desc": "99%の人が知らない人間の心理の盲点・操作されている無意識の行動・行動経済学の法則",
        "title_prefix": "【衝撃】心理学が証明！",
        "pexels": "psychology mind brain",
    },
    {
        "genre": "japan_mystery",
        "theme": "日本の知られざる秘密",
        "desc": "日本にしかない文化・制度・習慣の意外な理由。日本人でも知らない日本の常識",
        "title_prefix": "日本人なのに知らない！",
        "pexels": "japan tokyo traditional",
    },
]

GENRE_ROTATION_FILE = os.path.join(
    os.path.dirname(__file__), "data", "shorts_genre_rotation.json"
)

# 使用済みトピック追跡ファイル
USED_TOPICS_FILE = os.path.join(
    os.path.dirname(__file__), "data", "used_short_topics.json"
)


def _load_genre_index() -> int:
    if os.path.exists(GENRE_ROTATION_FILE):
        with open(GENRE_ROTATION_FILE, "r") as f:
            return json.load(f).get("index", 0)
    return 0


def _save_genre_index(index: int):
    os.makedirs(os.path.dirname(GENRE_ROTATION_FILE), exist_ok=True)
    with open(GENRE_ROTATION_FILE, "w") as f:
        json.dump({"index": index}, f)


def _load_used_topics() -> set:
    if os.path.exists(USED_TOPICS_FILE):
        with open(USED_TOPICS_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def _save_used_topic(topic: str):
    used = _load_used_topics()
    used.add(topic)
    # 最大200件保持
    used_list = list(used)[-200:]
    os.makedirs(os.path.dirname(USED_TOPICS_FILE), exist_ok=True)
    with open(USED_TOPICS_FILE, "w", encoding="utf-8") as f:
        json.dump(used_list, f, ensure_ascii=False)


def generate_shorts_script(topics: list[str]) -> dict:
    """60秒ショート用スクリプトを生成する。バズ実績ジャンルを強制ローテーション。"""
    # ジャンルをローテーション
    genre_idx = _load_genre_index()
    genre_cfg = PROVEN_GENRES[genre_idx % len(PROVEN_GENRES)]
    next_idx = (genre_idx + 1) % len(PROVEN_GENRES)
    _save_genre_index(next_idx)

    # 使用済みトピックを除外してユニークな題材を確保
    used = _load_used_topics()
    fresh_topics = [t for t in topics if t not in used]
    topic_list_src = fresh_topics[:3] if fresh_topics else topics[:3]
    topic_list = "\n".join(f"- {t}" for t in topic_list_src)

    # 戦略・アナリティクスヒント
    strategy = _load_strategy()
    top_hooks = strategy.get("hook_templates", [])
    avoid_patterns = strategy.get("avoid_patterns", [])

    strategy_hint = ""
    if top_hooks:
        strategy_hint = "\n【実績あり・参考フックパターン（これを超える表現で）】\n"
        strategy_hint += "\n".join(f'- 「{h}」' for h in top_hooks[:3])
    if avoid_patterns:
        strategy_hint += "\n【NGパターン（絶対に使わない）】\n"
        strategy_hint += "\n".join(f"- {p}" for p in avoid_patterns[:3])

    # フック書き出しバリエーション（"知ってた？"と"え？"の独占を防ぐ）
    hook_starters = [
        "ちょっと待って！",
        "これ、マジでヤバい。",
        "信じられないんだけど、",
        "実は全部嘘だった。",
        "絶対知らないでしょ？",
        "これ知ったら人生変わる。",
        "学校で教えてくれなかった、",
        "99%の人が勘違いしてる。",
    ]
    hook_starter = random.choice(hook_starters)

    prompt = f"""あなたはTikTok・YouTube Shortsで毎回100万再生を出すトップバズクリエイターです。

【今回のジャンル】{genre_cfg['theme']}
【ジャンル詳細】{genre_cfg['desc']}
【参考トピック（1つ選ぶか、より面白いアイデアに昇華してよい）】
{topic_list}
{strategy_hint}

【冒頭フックの書き出し（必ずこの言葉から始める）】「{hook_starter}」

【絶対に守るバズShortsの法則】
1. フック（hook）: 「{hook_starter}」から始め、50文字以内で視聴者を0秒で止める。「〇〇が実は〇〇だった」「え？これ常識じゃなかったの？」「知らないと一生損する」などの強烈な反転を使う
2. 本文（body）: 220文字以上。「事実の提示 → 驚きの深掘り → "つまりこういうことなんです" → コメント誘導」の流れを守る。コメント誘導は「これ知ってた人はコメントで"知ってた"って教えて！」で締める
3. 締め（outro）: 50文字以上。「こういう衝撃の話が毎日届くのでチャンネル登録してね！次もヤバいから絶対見てよ！」
4. タイトル: 「{genre_cfg['title_prefix']}」を活かしつつ、クリックせずにはいられない具体的なタイトル（25文字以内・#Shorts含む）
5. 汎用的・抽象的なテーマ（「宇宙の謎」「動物の秘密」など）は禁止。必ず具体的な1つの事実を深掘りする

以下のJSON形式で出力:
{{
  "title": "タイトル（25文字以内、#Shorts含む、具体的で強烈）",
  "hook": "冒頭フック（「{hook_starter}」から始める・50文字以内）",
  "body": "本文（220文字以上・コメント誘導まで全文書く）",
  "outro": "締め（50文字以上・チャンネル登録誘導）",
  "full_text": "hook＋body＋outroを全部まとめた全文（330文字以上・省略禁止）",
  "main_topic": "このShortsのメインテーマ（20文字以内・重複防止用）",
  "image_prompts": [
    "Scene 1 DALL-E prompt: dramatic vertical 9:16, vivid cinematic colors, no text (40 words)",
    "Scene 2 DALL-E prompt: intense close-up, vertical 9:16, high contrast, no text (40 words)",
    "Scene 3 DALL-E prompt: emotional reveal, vertical 9:16, dramatic atmosphere, no text (40 words)"
  ],
  "pexels_keywords": "{genre_cfg['pexels']}"
}}"""

    for attempt in range(3):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=1600,
        )
        data = json.loads(response.choices[0].message.content)

        full_text = data.get("full_text", "")
        if len(full_text) < 300:
            full_text = "\n\n".join(filter(None, [
                data.get("hook", ""),
                data.get("body", ""),
                data.get("outro", ""),
            ]))
            data["full_text"] = full_text

        if len(full_text) >= 250:
            break
        if attempt < 2:
            print(f"  ⚠️  台本が短すぎます（{len(full_text)}文字）。再生成中（{attempt + 2}/3）...")

    # 使用トピックを記録（重複防止）
    main_topic = data.get("main_topic", data.get("title", ""))
    if main_topic:
        _save_used_topic(main_topic)

    print(f"  Shortsスクリプト生成完了 [{genre_cfg['theme']}]: 「{data['title']}」({len(data.get('full_text', ''))}文字)")
    return data


def create_shorts_slide(slide_num: int, image_prompt: str = "") -> str:
    """DALL-E 3 背景のみの縦型スライド画像を生成する（テキストなし）。"""
    print(f"  DALL-E 画像生成中（シーン{slide_num + 1}）...")
    bg = generate_dalle_bg(image_prompt, SHORTS_W, SHORTS_H, brightness=1.0, blur_radius=0)
    if bg is None:
        bg = make_gradient_bg(SHORTS_W, SHORTS_H, color1=(10, 10, 40), color2=(60, 10, 80))
    path = os.path.join(OUTPUT_DIR, f"shorts_slide_{slide_num:02d}.png")
    bg.save(path)
    return path


# ── メイン動画生成 ─────────────────────────────────────────────


def build_shorts_video(script_data: dict, audio_path: str, output_path: str) -> str:
    """Shorts動画を生成する（Pexels背景 or Ken Burns + 字幕アニメーション）。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    audio = AudioFileClip(audio_path)
    total_duration = max(audio.duration, 60.0)

    image_prompts = script_data.get("image_prompts")
    if not image_prompts:
        fallback = script_data.get("image_prompt", script_data.get("hook", "dramatic cinematic scene"))
        image_prompts = [fallback, fallback, fallback]

    num_scenes = len(image_prompts)
    section_duration = total_duration / num_scenes
    subtitles = _split_script_to_scenes(script_data, num_scenes)

    # ── Pexels素材を試みる ──────────────────────────────────────
    stock_path = None
    try:
        from stock_video import get_stock_video
        pexels_kw = script_data.get("pexels_keywords", "")
        if pexels_kw:
            script_data_with_kw = dict(script_data)
        stock_path = get_stock_video(script_data)
        if stock_path:
            print(f"  Pexels素材を使用: {os.path.basename(stock_path)}")
    except Exception as e:
        print(f"  ⚠️  Pexels取得スキップ: {e}")

    clips = []
    motions = random.sample(MOTION_TYPES, min(num_scenes, len(MOTION_TYPES)))

    for i in range(num_scenes):
        sub_text = subtitles[i] if i < len(subtitles) else ""
        motion = motions[i % len(motions)]

        if stock_path:
            # Pexels素材を等分してシーンごとに使う
            print(f"  Pexels背景 + 字幕生成中（シーン{i + 1}）...")
            clip = _pexels_bg_clip(stock_path, section_duration, subtitle_text=sub_text)
        else:
            # DALL-E + Ken Burns
            img_path = create_shorts_slide(i, image_prompt=image_prompts[i])
            print(f"  Ken Burns効果 + 字幕適用中（シーン{i + 1}: {motion}）...")
            clip = ken_burns_clip(img_path, section_duration,
                                  motion_type=motion, subtitle_text=sub_text)
            clip = clip.with_effects([vfx.FadeIn(0.4), vfx.FadeOut(0.4)])

        clips.append(clip)

    final = concatenate_videoclips(clips, method="compose")

    if audio.duration < total_duration:
        from moviepy import concatenate_audioclips, AudioClip
        silence = AudioClip(lambda t: [0, 0], duration=total_duration - audio.duration, fps=44100)
        audio_padded = concatenate_audioclips([audio, silence])
        final = final.with_audio(audio_padded)
    else:
        final = final.with_audio(audio.subclipped(0, total_duration))

    final = final.with_fps(30)
    final.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)

    import glob
    for f in glob.glob(os.path.join(OUTPUT_DIR, "shorts_slide_*.png")):
        os.remove(f)

    mode = "Pexels背景" if stock_path else "Ken Burns"
    print(f"  Shorts動画生成完了（{mode} + 字幕アニメーション）: {output_path}")
    return output_path
