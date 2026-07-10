"""
サムネイル自動生成モジュール
DALL-E 3 背景 + 高コントラストなタイトル文字オーバーレイ（1280x720）
"""
import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from config import OUTPUT_DIR, FONT_BOLD, FONT_FALLBACK, HOT_COLOR, GOLD_COLOR
from image_utils import generate_dalle_bg, make_gradient_bg

THUMB_W, THUMB_H = 1280, 720


def _font(size: int):
    path = FONT_BOLD if os.path.exists(FONT_BOLD) else FONT_FALLBACK
    return ImageFont.truetype(path, size)


def _centered_x(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return (THUMB_W - (bbox[2] - bbox[0])) // 2


def _outline_text(draw, x, y, text, font, fill, outline, width=3):
    for dx, dy in [(-width, -width), (width, -width), (-width, width), (width, width),
                   (0, -width), (0, width), (-width, 0), (width, 0)]:
        draw.text((x + dx, y + dy), text, font=font, fill=outline)
    draw.text((x, y), text, font=font, fill=fill)


def create_thumbnail(title: str, genre_label: str = "",
                     thumbnail_prompt: str = "", output_path: str = None) -> str:
    """DALL-E 3 背景 + 派手なタイトル文字オーバーレイでサムネイルを生成する。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if output_path is None:
        output_path = os.path.join(OUTPUT_DIR, "thumbnail.jpg")

    image_prompt = (
        f"{thumbnail_prompt or title}. "
        "Dramatic cinematic scene about studying and learning, glowing books, "
        "shocking impactful visual, bold saturated colors, high contrast, "
        "professional YouTube thumbnail style, wide landscape orientation, no text."
    )

    print("  サムネイル背景を DALL-E 3 で生成中...")
    bg = generate_dalle_bg(image_prompt, THUMB_W, THUMB_H, brightness=0.4, blur_radius=0.6)
    if bg is None:
        bg = make_gradient_bg(THUMB_W, THUMB_H)

    draw = ImageDraw.Draw(bg, "RGBA")

    # ── 左上：衝撃度バッジ ──
    badge_text = genre_label or "保存版"
    f_label = _font(40)
    bbox = draw.textbbox((0, 0), badge_text, font=f_label)
    bw, bh = bbox[2] - bbox[0] + 46, bbox[3] - bbox[1] + 26
    draw.rounded_rectangle([18, 14, 18 + bw, 14 + bh], radius=10, fill=HOT_COLOR)
    draw.text((18 + 23, 14 + 10), badge_text, font=f_label, fill=(255, 255, 255))

    # ── 中央タイトルエリア（暗幕）──
    draw.rectangle([0, 90, THUMB_W, THUMB_H - 90], fill=(0, 0, 0, 140))

    f_title = _font(88)
    wrapped = textwrap.wrap(title.strip(), width=12)
    total_h = len(wrapped[:3]) * 108
    y = max(110, (THUMB_H - total_h) // 2 - 10)
    for line in wrapped[:3]:
        x = _centered_x(draw, line, f_title)
        _outline_text(draw, x, y, line, f_title, fill=(255, 255, 255), outline=GOLD_COLOR, width=4)
        y += 108

    # ── 下部バー ──
    draw.rectangle([0, THUMB_H - 64, THUMB_W, THUMB_H], fill=(0, 0, 0, 215))
    f_bottom = _font(32)
    draw.text((40, THUMB_H - 52), "🔥 チャンネル登録で毎日お届け！  #勉強法 #StudyFlow",
              font=f_bottom, fill=(220, 220, 220))

    bg.save(output_path, "JPEG", quality=95)
    print(f"  サムネイル生成完了: {output_path}")
    return output_path
