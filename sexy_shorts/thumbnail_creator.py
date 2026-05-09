"""
サムネイル自動生成モジュール
DALL-E 3でアニメ・萌え系の背景画像を生成し、
キャッチーなテキストをオーバーレイして視聴者を引きつけるサムネイルを作成する
"""
import os
import io
import textwrap
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR, FONT_BOLD, FONT_FALLBACK
from config import BG_COLOR_TOP, BG_COLOR_BOTTOM, TITLE_COLOR, TEXT_COLOR, ACCENT_COLOR

client = OpenAI(api_key=OPENAI_API_KEY)

THUMB_W = 1280
THUMB_H = 720


def get_font(size: int):
    for path in [FONT_BOLD, FONT_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def generate_thumbnail_image(prompt: str) -> Image.Image | None:
    """DALL-E 3でサムネイル用の目を引くアニメ画像を生成する。"""
    return None  # DALL-E 無効化（コスト削減）
    try:
        full_prompt = (
            f"{prompt}. "
            "Horizontal 16:9 thumbnail composition, anime illustration style, "
            "vibrant saturated colors, dramatic lighting, "
            "eye-catching composition, high detail, no text, "
            "safe for work, fully clothed characters only."
        )
        print("  DALL-E サムネイル画像生成中...")
        resp = client.images.generate(
            model="dall-e-3",
            prompt=full_prompt,
            size="1792x1024",   # 16:9 横型
            quality="standard",
            n=1,
        )
        url = resp.data[0].url
        img_data = requests.get(url, timeout=30).content
        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        img = img.resize((THUMB_W, THUMB_H), Image.LANCZOS)
        return img
    except Exception as e:
        print(f"  DALL-Eサムネイルスキップ（グラデーション使用）: {e}")
        return None


def _make_gradient_bg() -> Image.Image:
    """ピンク・パープル系グラデーション背景を作成する。"""
    img = Image.new("RGB", (THUMB_W, THUMB_H))
    draw = ImageDraw.Draw(img)
    for y in range(THUMB_H):
        ratio = y / THUMB_H
        r = int(BG_COLOR_TOP[0] + (BG_COLOR_BOTTOM[0] - BG_COLOR_TOP[0]) * ratio)
        g = int(BG_COLOR_TOP[1] + (BG_COLOR_BOTTOM[1] - BG_COLOR_TOP[1]) * ratio)
        b = int(BG_COLOR_TOP[2] + (BG_COLOR_BOTTOM[2] - BG_COLOR_TOP[2]) * ratio)
        draw.line([(0, y), (THUMB_W, y)], fill=(r, g, b))
    return img


def create_thumbnail(title: str, genre_label: str = "エッチな雑学",
                     thumbnail_prompt: str = "", output_path: str = None) -> str:
    """サムネイルを生成して保存する。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if output_path is None:
        output_path = os.path.join(OUTPUT_DIR, "thumbnail.jpg")

    # DALL-E で背景画像生成（失敗時はグラデーション）
    img = generate_thumbnail_image(thumbnail_prompt) if thumbnail_prompt else None
    if img is None:
        img = _make_gradient_bg()

    # 少し暗くして文字を読みやすく
    img = ImageEnhance.Brightness(img).enhance(0.55)

    draw = ImageDraw.Draw(img, "RGBA")

    # ━━ 上部 左側ラベル ━━
    f_label = get_font(44)
    label_bg_w = len(genre_label) * 26 + 30
    draw.rectangle([40, 30, 40 + label_bg_w, 88], fill=(200, 20, 80))
    draw.text((55, 38), genre_label, font=f_label, fill=(255, 255, 255))

    # ━━ 上部 右側 AIバッジ ━━
    f_ai = get_font(36)
    draw.rectangle([THUMB_W - 200, 30, THUMB_W - 40, 85], fill=(120, 0, 180))
    draw.text((THUMB_W - 190, 40), "AI生成", font=f_ai, fill=(255, 255, 255))

    # ━━ メインタイトル（中央・大文字・黒縁） ━━
    f_title = get_font(88)
    wrapped = textwrap.wrap(title.replace("【AI生成】", ""), width=12)

    # タイトル背景
    title_block_h = len(wrapped[:3]) * 100 + 20
    title_y_start = (THUMB_H - title_block_h) // 2 - 20
    draw.rectangle([30, title_y_start - 10, THUMB_W - 30, title_y_start + title_block_h + 10],
                   fill=(0, 0, 0, 155))

    y = title_y_start + 10
    for line in wrapped[:3]:
        bbox = draw.textbbox((0, 0), line, font=f_title)
        w = bbox[2] - bbox[0]
        x = (THUMB_W - w) // 2
        # 黒縁（多方向シャドウ）
        for dx, dy in [(-4, -4), (4, -4), (-4, 4), (4, 4), (0, 5), (5, 0)]:
            draw.text((x + dx, y + dy), line, font=f_title, fill=(0, 0, 0, 200))
        draw.text((x, y), line, font=f_title, fill=TITLE_COLOR)
        y += 100

    # ━━ 下部: キャッチコピー帯 ━━
    f_catch = get_font(48)
    catch_phrases = {
        "少しエッチな雑学": "知らなかった！思わずドキドキ…",
        "少しエッチな話": "ちょっとドキドキ…大人の話",
        "少しエッチな漫画・アニメの話": "あの名シーン！思い出した？",
    }
    catch = catch_phrases.get(genre_label, "思わずドキドキ！")
    draw.rectangle([0, THUMB_H - 72, THUMB_W, THUMB_H], fill=(180, 20, 80, 220))
    bbox = draw.textbbox((0, 0), catch, font=f_catch)
    cw = bbox[2] - bbox[0]
    draw.text(((THUMB_W - cw) // 2, THUMB_H - 62), catch, font=f_catch, fill=(255, 255, 255))

    img.save(output_path, "JPEG", quality=95)
    print(f"  サムネイル生成完了: {output_path}")
    return output_path
