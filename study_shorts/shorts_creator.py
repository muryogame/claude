"""
YouTube Shorts 縦型動画を自動生成するモジュール
解像度: 1080x1920（縦型 9:16）、目標60秒
DALL-E 3 で勉強系背景画像を生成してオーバーレイ
"""
import os
import io
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from moviepy import AudioFileClip, ImageClip, concatenate_videoclips
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR, FONT_BOLD, FONT_REG, FONT_FALLBACK, STUDYFLOW_URL
from config import VIDEO_WIDTH as SHORTS_W, VIDEO_HEIGHT as SHORTS_H
from config import BG_COLOR_TOP, BG_COLOR_BOTTOM, TITLE_COLOR, TEXT_COLOR, ACCENT_COLOR

client = OpenAI(api_key=OPENAI_API_KEY)

STUDYFLOW_DOMAIN = "study-tracker-2znl.onrender.com"


def _font(size: int, bold=True):
    path = FONT_BOLD if bold else FONT_REG
    if not os.path.exists(path):
        path = FONT_FALLBACK
    return ImageFont.truetype(path, size)


def generate_bg_image(image_prompt: str, slide_index: int) -> Image.Image | None:
    """DALL-E 3 で勉強系背景画像を生成する。"""
    return None  # DALL-E 無効化（コスト削減）
    try:
        full_prompt = (
            f"{image_prompt}. "
            "Vertical portrait 9:16 orientation, study and learning theme, "
            "deep indigo and purple gradient, glowing books and knowledge symbols, "
            "inspiring motivational atmosphere, high quality digital art, "
            "NO TEXT, no words, no letters."
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
    img = Image.new("RGB", (SHORTS_W, SHORTS_H))
    draw = ImageDraw.Draw(img)
    for y in range(SHORTS_H):
        ratio = y / SHORTS_H
        r = int(BG_COLOR_TOP[0] + (BG_COLOR_BOTTOM[0] - BG_COLOR_TOP[0]) * ratio)
        g = int(BG_COLOR_TOP[1] + (BG_COLOR_BOTTOM[1] - BG_COLOR_TOP[1]) * ratio)
        b = int(BG_COLOR_TOP[2] + (BG_COLOR_BOTTOM[2] - BG_COLOR_TOP[2]) * ratio)
        draw.line([(0, y), (SHORTS_W, y)], fill=(r, g, b))
    return img


def _draw_text_shadow(draw, pos, text, font, fill, shadow=(0, 0, 0, 200), offset=3):
    x, y = pos
    for dx, dy in [(-offset, -offset), (offset, -offset), (-offset, offset), (offset, offset)]:
        draw.text((x + dx, y + dy), text, font=font, fill=shadow)
    draw.text((x, y), text, font=font, fill=fill)


def create_main_slide(script_data: dict, image_prompt: str) -> str:
    """メインスライド: DALL-E背景のみ（テキストなし）。"""
    bg = generate_bg_image(image_prompt, 0)
    if bg is None:
        bg = _make_gradient_bg()
    bg = ImageEnhance.Brightness(bg).enhance(0.85)
    path = os.path.join(OUTPUT_DIR, "shorts_slide_00.png")
    bg.save(path)
    return path


def create_outro_slide(script_data: dict, image_prompt: str) -> str:
    """アウトロスライド: DALL-E背景のみ（テキストなし）。"""
    bg = generate_bg_image(image_prompt, 1)
    if bg is None:
        bg = _make_gradient_bg()
    bg = ImageEnhance.Brightness(bg).enhance(0.85)
    path = os.path.join(OUTPUT_DIR, "shorts_slide_01.png")
    bg.save(path)
    return path


def build_shorts_video(script_data: dict, audio_path: str, output_path: str,
                       max_seconds: float = 60.0) -> str:
    """60秒Shorts動画を生成する（メイン + アウトロの2スライド構成）。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    audio = AudioFileClip(audio_path)
    total_duration = max(audio.duration, max_seconds)

    image_prompt = script_data.get("thumbnail_prompt", script_data.get("image_prompt", ""))

    # メインスライド 80% / アウトロスライド 20%
    main_dur  = total_duration * 0.80
    outro_dur = total_duration * 0.20

    main_path  = create_main_slide(script_data, image_prompt)
    outro_path = create_outro_slide(script_data, image_prompt)

    clips = [
        ImageClip(main_path).with_duration(main_dur),
        ImageClip(outro_path).with_duration(outro_dur),
    ]
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

    print(f"  Shorts動画生成完了: {output_path}")
    return output_path
