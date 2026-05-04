#!/usr/bin/env python3
"""
チャンネルアイコン・バナー画像を生成するスクリプト
- アイコン: 800x800px (PNG)
- バナー: 2560x1440px (PNG)
"""
import os
import io
import sys
import textwrap
import requests
sys.path.insert(0, os.path.dirname(__file__))

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR, FONT_BOLD, FONT_FALLBACK

client = OpenAI(api_key=OPENAI_API_KEY)


def get_font(size):
    for path in [FONT_BOLD, FONT_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def generate_dalle_image(prompt: str, size: str) -> Image.Image | None:
    try:
        resp = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size=size,
            quality="standard",
            n=1,
        )
        url = resp.data[0].url
        img_data = requests.get(url, timeout=30).content
        return Image.open(io.BytesIO(img_data)).convert("RGB")
    except Exception as e:
        print(f"  DALL-E生成失敗: {e}")
        return None


def create_icon():
    """チャンネルアイコン (800x800) を生成する。"""
    print("アイコン生成中...")

    prompt = (
        "Minimalist study icon: glowing open book with light rays, floating geometric shapes "
        "representing knowledge (stars, atoms, math symbols), deep indigo and purple gradient background, "
        "modern flat design with neon accents, square composition, no text, clean professional look."
    )

    img = generate_dalle_image(prompt, "1024x1024")

    if img is None:
        img = Image.new("RGB", (800, 800), (8, 13, 26))
        draw = ImageDraw.Draw(img)
        for y in range(800):
            ratio = y / 800
            r = int(8 + 22 * ratio)
            g = int(13 + 7 * ratio)
            b = int(26 + 34 * ratio)
            draw.line([(0, y), (800, y)], fill=(r, g, b))
    else:
        img = img.resize((800, 800), Image.LANCZOS)

    draw = ImageDraw.Draw(img, "RGBA")
    draw.rectangle([0, 660, 800, 800], fill=(0, 0, 0, 160))
    f = get_font(52)
    text = "StudyFlow"
    bbox = draw.textbbox((0, 0), text, font=f)
    w = bbox[2] - bbox[0]
    draw.text(((800 - w) // 2, 700), text, font=f, fill=(180, 185, 255))

    path = os.path.join(OUTPUT_DIR, "channel_icon.png")
    img.save(path, "PNG")
    print(f"  アイコン保存: {path}")
    return path


def create_banner():
    """チャンネルバナー (2560x1440) を生成する。"""
    print("バナー画像生成中...")

    prompt = (
        "Wide YouTube banner for a study tips channel. Deep indigo and purple gradient background, "
        "floating glowing books, brain, lightbulb, math formulas and star particles, "
        "modern futuristic design, cinematic wide composition, no text, clean professional look."
    )

    img = generate_dalle_image(prompt, "1792x1024")

    if img is None:
        img = Image.new("RGB", (2560, 1440), (8, 13, 26))
        draw_bg = ImageDraw.Draw(img)
        for y in range(1440):
            ratio = y / 1440
            r = int(8 + 22 * ratio)
            g = int(13 + 7 * ratio)
            b = int(26 + 34 * ratio)
            draw_bg.line([(0, y), (2560, y)], fill=(r, g, b))
    else:
        img = img.resize((2560, 1440), Image.LANCZOS)

    draw = ImageDraw.Draw(img, "RGBA")

    draw.rectangle([0, 550, 2560, 890], fill=(0, 0, 0, 150))

    f_title = get_font(160)
    title = "StudyFlow / 勉強法ショート"
    bbox = draw.textbbox((0, 0), title, font=f_title)
    w = bbox[2] - bbox[0]
    for dx, dy in [(-4, -4), (4, 4), (-4, 4), (4, -4)]:
        draw.text(((2560 - w) // 2 + dx, 580 + dy), title, font=f_title, fill=(0, 0, 0, 180))
    draw.text(((2560 - w) // 2, 580), title, font=f_title, fill=(180, 185, 255))

    f_sub = get_font(80)
    sub = "毎日5本 科学的な勉強法・記憶術・集中力UPをお届け！"
    bbox2 = draw.textbbox((0, 0), sub, font=f_sub)
    w2 = bbox2[2] - bbox2[0]
    draw.text(((2560 - w2) // 2, 780), sub, font=f_sub, fill=(220, 222, 255))

    draw.rectangle([0, 1320, 2560, 1440], fill=(99, 102, 241, 220))
    f_sch = get_font(64)
    sch = "📅 毎日 7:00 / 10:00 / 13:00 / 17:00 / 21:00 投稿"
    bbox3 = draw.textbbox((0, 0), sch, font=f_sch)
    w3 = bbox3[2] - bbox3[0]
    draw.text(((2560 - w3) // 2, 1352), sch, font=f_sch, fill=(255, 255, 255))

    path = os.path.join(OUTPUT_DIR, "channel_banner.png")
    img.save(path, "PNG")
    print(f"  バナー保存: {path}")
    return path


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    icon_path  = create_icon()
    banner_path = create_banner()
    print("\n✅ 完了！")
    print(f"  アイコン : {icon_path}")
    print(f"  バナー   : {banner_path}")
