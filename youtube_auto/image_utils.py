"""
DALL-E 3 背景画像生成の共通ユーティリティ
video_creator / shorts_creator / thumbnail_creator から共有される
"""
import io
import random
import numpy as np
import requests
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from openai import OpenAI
from config import OPENAI_API_KEY, USE_DALLE, DALLE_QUALITY

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_dalle_bg(
    prompt: str,
    width: int,
    height: int,
    brightness: float = 0.45,
    blur_radius: float = 1.5,
) -> Image.Image | None:
    """
    DALL-E 3 で背景画像を生成し、指定サイズにリサイズして返す。
    USE_DALLE=False または失敗時は None を返す（呼び出し側がグラデーションにフォールバック）。
    """
    if not USE_DALLE:
        return None

    aspect = width / height
    if aspect >= 1.5:
        dalle_size = "1792x1024"
    elif aspect <= 0.7:
        dalle_size = "1024x1792"
    else:
        dalle_size = "1024x1024"

    try:
        full_prompt = (
            f"{prompt}. "
            "Vivid dramatic colors, cinematic lighting, highly detailed digital art, "
            "no text, no letters, no watermark."
        )
        resp = client.images.generate(
            model="dall-e-3",
            prompt=full_prompt,
            size=dalle_size,
            quality=DALLE_QUALITY,
            n=1,
        )
        url = resp.data[0].url
        img_data = requests.get(url, timeout=30).content
        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        img = img.resize((width, height), Image.LANCZOS)
        img = ImageEnhance.Brightness(img).enhance(brightness)
        if blur_radius > 0:
            img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        return img
    except Exception as e:
        print(f"  ⚠️  DALL-E 生成スキップ: {e}")
        return None


def _make_vignette(width: int, height: int, strength: float = 0.45) -> Image.Image:
    """ビネット（周辺減光）オーバーレイを生成する。"""
    cx, cy = width / 2, height / 2
    y_arr, x_arr = np.ogrid[:height, :width]
    dist = np.sqrt(((x_arr - cx) / cx) ** 2 + ((y_arr - cy) / cy) ** 2)
    alpha = np.clip(dist ** 2.2 * strength * 255, 0, 220).astype(np.uint8)
    mask = np.zeros((height, width, 4), dtype=np.uint8)
    mask[:, :, 3] = alpha
    return Image.fromarray(mask, "RGBA")


def make_gradient_bg(
    width: int,
    height: int,
    color1=(10, 10, 40),
    color2=(40, 10, 80),
) -> Image.Image:
    """グラデーション背景を生成する（グロー・フィルムグレイン・ビネット付き）。"""
    # ── 1. 3ストップグラデーション ──────────────────────────────
    mid_color = (
        min(255, max(0, (color1[0] + color2[0]) // 2 + random.randint(-15, 15))),
        min(255, max(0, (color1[1] + color2[1]) // 2 + random.randint(5, 40))),
        min(255, max(0, (color1[2] + color2[2]) // 2 + random.randint(-10, 20))),
    )

    arr = np.zeros((height, width, 3), dtype=np.float32)
    t_vals = np.linspace(0, 1, height)
    for c in range(3):
        lower = np.where(t_vals < 0.5,
                         color1[c] + (mid_color[c] - color1[c]) * (t_vals * 2),
                         mid_color[c] + (color2[c] - mid_color[c]) * ((t_vals - 0.5) * 2))
        arr[:, :, c] = lower[:, np.newaxis]

    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    # ── 2. ラジアルグロー（ボケた光源）──────────────────────────
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)

    glow_palettes = [
        (60, 30, 140),   # 紫
        (20, 60, 180),   # 青
        (140, 20, 100),  # マゼンタ
        (20, 100, 140),  # シアン
        (160, 60, 20),   # オレンジ
        (80, 20, 160),   # インディゴ
    ]
    for _ in range(random.randint(2, 4)):
        cx = random.randint(width // 5, 4 * width // 5)
        cy = random.randint(height // 8, height // 2)
        radius = random.randint(width // 4, 2 * width // 3)
        hue = random.choice(glow_palettes)
        step = max(1, radius // 50)
        for r in range(radius, 0, -step):
            ratio = r / radius
            alpha = int(55 * (1 - ratio) ** 2)
            gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*hue, alpha))

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=max(width // 20, 8)))
    img = Image.alpha_composite(img, glow_layer)

    # ── 3. フィルムグレイン（テクスチャ感）────────────────────────
    base = np.array(img)[:, :, :3].astype(np.int16)
    grain = np.random.normal(0, 7, (height, width, 3)).astype(np.int16)
    base = np.clip(base + grain, 0, 255).astype(np.uint8)
    img = Image.fromarray(base, "RGB").convert("RGBA")

    # ── 4. ビネット ───────────────────────────────────────────────
    vignette = _make_vignette(width, height, strength=0.4)
    img = Image.alpha_composite(img, vignette)

    return img.convert("RGB")
