"""
YouTube Shorts 縦型60秒動画を自動生成するモジュール
解像度: 1080x1920（縦型 9:16）、目標60秒
DALL-E 3でアニメ・萌え系の背景画像を生成してオーバーレイ
"""
import os
import io
import textwrap
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from moviepy import AudioFileClip, ImageClip, concatenate_videoclips
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR, FONT_BOLD, FONT_REG, FONT_FALLBACK
from config import VIDEO_WIDTH as SHORTS_W, VIDEO_HEIGHT as SHORTS_H
from config import BG_COLOR_TOP, BG_COLOR_BOTTOM, TITLE_COLOR, TEXT_COLOR, ACCENT_COLOR

client = OpenAI(api_key=OPENAI_API_KEY)


def _font(size: int, bold=True):
    path = FONT_BOLD if bold else FONT_REG
    if not os.path.exists(path):
        path = FONT_FALLBACK
    return ImageFont.truetype(path, size)


def generate_bg_image(image_prompt: str, slide_index: int) -> Image.Image | None:
    """DALL-E 3でアニメ・萌え系背景画像を生成する。"""
    return None  # DALL-E 無効化（コスト削減）
    try:
        full_prompt = (
            f"{image_prompt}. "
            "Vertical portrait 9:16 orientation, anime illustration style, "
            "vibrant colors, soft warm lighting, rose petals, sparkles, "
            "dreamy romantic atmosphere, high quality digital art, no text overlays, "
            "safe for work, fully clothed characters only."
        )
        print(f"  DALL-E 画像生成中（スライド{slide_index + 1}）...")
        resp = client.images.generate(
            model="dall-e-3",
            prompt=full_prompt,
            size="1024x1792",
            quality="standard",
            n=1,
        )
        url = resp.data[0].url
        img_data = requests.get(url, timeout=30).content
        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        img = img.resize((SHORTS_W, SHORTS_H), Image.LANCZOS)
        return img
    except Exception as e:
        print(f"  DALL-E生成スキップ（グラデーション背景使用）: {e}")
        return None


def _make_gradient_bg() -> Image.Image:
    """ピンク・パープル系グラデーション背景を作成する。"""
    img = Image.new("RGB", (SHORTS_W, SHORTS_H))
    draw = ImageDraw.Draw(img)
    for y in range(SHORTS_H):
        ratio = y / SHORTS_H
        r = int(BG_COLOR_TOP[0] + (BG_COLOR_BOTTOM[0] - BG_COLOR_TOP[0]) * ratio)
        g = int(BG_COLOR_TOP[1] + (BG_COLOR_BOTTOM[1] - BG_COLOR_TOP[1]) * ratio)
        b = int(BG_COLOR_TOP[2] + (BG_COLOR_BOTTOM[2] - BG_COLOR_TOP[2]) * ratio)
        draw.line([(0, y), (SHORTS_W, y)], fill=(r, g, b))
    return img


def create_shorts_slide(text: str, heading: str, slide_num: int, total: int,
                        image_prompt: str = "", genre_label: str = "") -> str:
    """縦型スライド画像を生成する（DALL-E背景 + テキストオーバーレイ）。"""

    bg = generate_bg_image(image_prompt or heading, slide_num)
    if bg is None:
        bg = _make_gradient_bg()

    # 少し暗くして文字を読みやすく
    bg = ImageEnhance.Brightness(bg).enhance(0.5)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=1.2))

    draw = ImageDraw.Draw(bg, "RGBA")

    # ━━ 上部バー ━━
    draw.rectangle([0, 0, SHORTS_W, 140], fill=(0, 0, 0, 170))

    # ジャンルラベル（左上）
    f_label = _font(46)
    label_text = genre_label or "#Shorts"
    draw.rectangle([28, 28, 28 + len(label_text) * 30 + 20, 105], fill=(200, 30, 100))
    draw.text((40, 38), label_text, font=f_label, fill=(255, 255, 255))

    # AIバッジ（右上）
    f_ai = _font(40)
    draw.rectangle([SHORTS_W - 220, 32, SHORTS_W - 30, 100], fill=(130, 0, 200))
    draw.text((SHORTS_W - 210, 42), "AI生成", font=f_ai, fill=(255, 255, 255))

    # ━━ 見出しエリア ━━
    f_head = _font(86, bold=True)
    wrapped_head = textwrap.wrap(heading, width=9)[:2]
    head_h = len(wrapped_head) * 105 + 20
    draw.rectangle([0, 180, SHORTS_W, 180 + head_h + 20], fill=(0, 0, 0, 130))
    y = 195
    for line in wrapped_head:
        bbox = draw.textbbox((0, 0), line, font=f_head)
        w = bbox[2] - bbox[0]
        # シャドウ
        draw.text(((SHORTS_W - w) // 2 + 3, y + 3), line, font=f_head, fill=(0, 0, 0, 210))
        draw.text(((SHORTS_W - w) // 2, y), line, font=f_head, fill=TITLE_COLOR)
        y += 108

    # ━━ 本文エリア（下半分） ━━
    text_area_top = SHORTS_H // 2 + 80
    draw.rectangle([0, text_area_top, SHORTS_W, SHORTS_H - 150], fill=(0, 0, 0, 185))

    f_body = _font(52, bold=False)
    wrapped = []
    for para in text.split("\n"):
        wrapped.extend(textwrap.wrap(para, width=15) or [""])

    y = text_area_top + 28
    line_h = 70
    for line in wrapped:
        if y + line_h > SHORTS_H - 170:
            break
        draw.text((50, y), line, font=f_body, fill=TEXT_COLOR)
        y += line_h

    # ━━ CTA バー（最下部） ━━
    draw.rectangle([0, SHORTS_H - 145, SHORTS_W, SHORTS_H], fill=(180, 20, 80, 235))
    f_cta = _font(50, bold=True)
    cta = "❤ チャンネル登録お願いします！"
    bbox = draw.textbbox((0, 0), cta, font=f_cta)
    w = bbox[2] - bbox[0]
    draw.text(((SHORTS_W - w) // 2, SHORTS_H - 112), cta, font=f_cta, fill=(255, 255, 255))

    path = os.path.join(OUTPUT_DIR, f"shorts_slide_{slide_num:02d}.png")
    bg.save(path)
    return path


def build_shorts_video(script_data: dict, audio_path: str, output_path: str,
                       max_seconds: float = 60.0) -> str:
    """60秒Shorts動画を生成する。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    audio = AudioFileClip(audio_path)
    # 最低60秒: 音声が短い場合は最低max_secondsまで映像を伸ばす
    total_duration = max(audio.duration, max_seconds)

    image_prompt = script_data.get("image_prompt", "")
    genre_label = script_data.get("genre_label", "#Shorts")

    # フック + 本文スライド、アウトロスライドの2枚構成
    sections = [
        {
            "heading": "今日のエッチ知識",
            "content": script_data.get("hook", "") + "\n\n" + script_data.get("body", ""),
            "image_prompt": image_prompt,
        },
        {
            "heading": "まとめ",
            "content": script_data.get("outro", "チャンネル登録してね！"),
            "image_prompt": image_prompt,
        },
    ]

    section_duration = total_duration / len(sections)
    clips = []

    for i, sec in enumerate(sections):
        path = create_shorts_slide(
            sec["content"], sec["heading"], i, len(sections),
            image_prompt=sec["image_prompt"],
            genre_label=genre_label,
        )
        clips.append(ImageClip(path).with_duration(section_duration))

    final = concatenate_videoclips(clips, method="compose")

    # 音声が映像より短い場合: 音声の末尾を無音で埋めて映像尺に合わせる
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

    print(f"  Shorts動画生成完了: {output_path}")
    return output_path
