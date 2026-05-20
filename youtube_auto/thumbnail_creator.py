"""
サムネイル自動生成モジュール
DALL-E 3 背景 + 高コントラストテキストオーバーレイ（1280x720）
"""
import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from config import OUTPUT_DIR
from image_utils import generate_dalle_bg, make_gradient_bg

THUMB_W = 1280
THUMB_H = 720
FONT_PATH = "/home/takah/.local/share/fonts/NotoSansCJKjp-Bold.otf"
FONT_PATH_FALLBACK = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def _font(size: int):
    for path in [FONT_PATH, FONT_PATH_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _centered_x(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return (THUMB_W - (bbox[2] - bbox[0])) // 2


def _shadow_text(draw, x, y, text, font, fill, shadow_offset=4):
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font,
              fill=(0, 0, 0, 200))
    draw.text((x, y), text, font=font, fill=fill)


def create_thumbnail(title: str, subtitle: str = "知らないと損する！",
                     output_path: str = None) -> str:
    """DALL-E 3 背景 + テキストオーバーレイでサムネイルを生成する。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if output_path is None:
        output_path = os.path.join(OUTPUT_DIR, "thumbnail.jpg")

    # タイトルから背景プロンプトを生成
    clean_title = title.strip()
    topic_hint = clean_title[:30]
    image_prompt = (
        f"Dramatic cinematic scene representing: {topic_hint}. "
        "Extremely bold vivid colors, high contrast, shocking visual, "
        "professional YouTube thumbnail style, wide landscape orientation, no text."
    )

    print(f"  サムネイル背景を DALL-E 3 で生成中...")
    bg = generate_dalle_bg(image_prompt, THUMB_W, THUMB_H,
                           brightness=0.35, blur_radius=0.6)
    if bg is None:
        bg = make_gradient_bg(THUMB_W, THUMB_H,
                              color1=(20, 0, 0), color2=(100, 10, 10))

    draw = ImageDraw.Draw(bg, "RGBA")

    # ── 左上：衝撃度バッジ（赤） ──
    f_label = _font(44)
    draw.rectangle([20, 16, 260, 72], fill=(220, 20, 20))
    draw.rectangle([18, 14, 258, 70], fill=(0, 0, 0, 0))   # アウトライン
    draw.rounded_rectangle([18, 14, 262, 72], radius=8, fill=(220, 20, 20))
    draw.text((32, 22), "衝撃の真実", font=f_label, fill=(255, 255, 255))

    # ── 中央タイトルエリア ──
    draw.rectangle([0, 90, THUMB_W, THUMB_H - 90], fill=(0, 0, 0, 130))

    f_title = _font(92)
    wrapped = textwrap.wrap(clean_title, width=12)

    total_h = len(wrapped[:3]) * 112
    y = max(100, (THUMB_H - total_h) // 2 - 20)
    for line in wrapped[:3]:
        x = _centered_x(draw, line, f_title)
        # 黄色アウトライン + 白文字で最大視認性
        for dx, dy in [(-3, -3), (3, -3), (-3, 3), (3, 3)]:
            draw.text((x + dx, y + dy), line, font=f_title, fill=(255, 200, 0))
        draw.text((x, y), line, font=f_title, fill=(255, 255, 255))
        y += 112

    # ── サブタイトル ──
    f_sub = _font(56)
    sub_lines = textwrap.wrap(subtitle, width=22)
    for line in sub_lines[:1]:
        x = _centered_x(draw, line, f_sub)
        _shadow_text(draw, x, y + 8, line, f_sub, fill=(255, 80, 80))

    # ── 下部バー（シンプル） ──
    draw.rectangle([0, THUMB_H - 64, THUMB_W, THUMB_H], fill=(0, 0, 0, 210))
    f_bottom = _font(34)
    bottom_text = "🔔 チャンネル登録で毎日お届け！  #雑学 #豆知識 #衝撃"
    draw.text((40, THUMB_H - 52), bottom_text, font=f_bottom, fill=(220, 220, 220))

    bg.save(output_path, "JPEG", quality=95)
    print(f"  サムネイル生成完了: {output_path}")
    return output_path
