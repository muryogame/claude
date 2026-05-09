"""
サムネイル自動生成モジュール
DALL-E 3 で生成した画像をそのままサムネイルとして使う（テキストオーバーレイなし）
"""
import os
import io
import requests
from PIL import Image, ImageEnhance
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR
from config import BG_COLOR_TOP, BG_COLOR_BOTTOM

client = OpenAI(api_key=OPENAI_API_KEY)

THUMB_W, THUMB_H = 1280, 720


def _make_gradient_bg() -> Image.Image:
    from PIL import ImageDraw
    img = Image.new("RGB", (THUMB_W, THUMB_H))
    draw = ImageDraw.Draw(img)
    for y in range(THUMB_H):
        ratio = y / THUMB_H
        r = int(BG_COLOR_TOP[0] + (BG_COLOR_BOTTOM[0] - BG_COLOR_TOP[0]) * ratio)
        g = int(BG_COLOR_TOP[1] + (BG_COLOR_BOTTOM[1] - BG_COLOR_TOP[1]) * ratio)
        b = int(BG_COLOR_TOP[2] + (BG_COLOR_BOTTOM[2] - BG_COLOR_TOP[2]) * ratio)
        draw.line([(0, y), (THUMB_W, y)], fill=(r, g, b))
    return img


def create_thumbnail(title: str, genre_label: str = "",
                     thumbnail_prompt: str = "", output_path: str = None) -> str:
    """DALL-E 3 でサムネイル画像を生成する（テキストなし）。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if output_path is None:
        output_path = os.path.join(OUTPUT_DIR, "thumbnail.jpg")

    img = None
    if False:  # DALL-E 無効化（コスト削減）
        try:
            full_prompt = (
                f"{thumbnail_prompt}. "
                "Horizontal 16:9 YouTube thumbnail, study and learning theme, "
                "inspiring and motivational atmosphere, deep indigo and purple tones, "
                "glowing books, brain, knowledge symbols, "
                "cinematic lighting, high quality digital art, NO TEXT, no words, no letters."
            )
            print("  DALL-E サムネイル画像生成中...")
            resp = client.images.generate(
                model="dall-e-3",
                prompt=full_prompt,
                size="1792x1024",
                quality="standard",
                n=1,
            )
            url = resp.data[0].url
            img_data = requests.get(url, timeout=30).content
            img = Image.open(io.BytesIO(img_data)).convert("RGB")
            img = img.resize((THUMB_W, THUMB_H), Image.LANCZOS)
        except Exception as e:
            print(f"  DALL-Eスキップ（グラデーション使用）: {e}")

    if img is None:
        img = _make_gradient_bg()

    img.save(output_path, "JPEG", quality=95)
    print(f"  サムネイル生成完了: {output_path}")
    return output_path
