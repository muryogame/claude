"""
AI背景画像生成の共通ユーティリティ（gpt-image-1使用）
shorts_creator / thumbnail_creator から共有される
"""
import io
import base64
import random
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from openai import OpenAI
from config import OPENAI_API_KEY, USE_DALLE, DALLE_QUALITY

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_dalle_bg(
    prompt: str,
    width: int,
    height: int,
    brightness: float = 0.45,
    blur_radius: float = 1.0,
) -> Image.Image | None:
    """
    gpt-image-1 で背景画像を生成し、指定サイズにリサイズして返す（旧dall-e-3はAPIから廃止済み）。
    USE_DALLE=False または失敗時は None を返す（呼び出し側がグラデーションにフォールバック）。
    """
    if not USE_DALLE:
        return None

    aspect = width / height
    if aspect >= 1.3:
        gen_size = "1536x1024"
    elif aspect <= 0.77:
        gen_size = "1024x1536"
    else:
        gen_size = "1024x1024"

    try:
        full_prompt = (
            f"{prompt}. "
            "Extremely vivid dramatic colors, glowing neon accents, cinematic lighting, "
            "high contrast, highly detailed digital art, no text, no letters, no watermark."
        )
        resp = client.images.generate(
            model="gpt-image-1",
            prompt=full_prompt,
            size=gen_size,
            quality=DALLE_QUALITY,
            n=1,
        )
        img_data = base64.b64decode(resp.data[0].b64_json)
        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        img = img.resize((width, height), Image.LANCZOS)
        img = ImageEnhance.Color(img).enhance(1.25)
        img = ImageEnhance.Brightness(img).enhance(brightness)
        if blur_radius > 0:
            img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        return img
    except Exception as e:
        print(f"  ⚠️  DALL-E 生成スキップ: {e}")
        return None


def _make_vignette(width: int, height: int, strength: float = 0.4) -> Image.Image:
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
    color1=(8, 13, 26),
    color2=(30, 20, 60),
) -> Image.Image:
    """グラデーション背景を生成する（ネオングロー・フィルムグレイン・ビネット付き）。"""
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

    # ラジアルグロー（インディゴ×パープル×ゴールドのネオン光源）
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)

    glow_palettes = [
        (99, 102, 241),   # インディゴ
        (140, 20, 220),   # パープル
        (255, 210, 60),   # ゴールド
        (20, 160, 220),   # シアン
        (255, 90, 60),    # ホットレッド
    ]
    for _ in range(random.randint(3, 5)):
        cx = random.randint(width // 5, 4 * width // 5)
        cy = random.randint(height // 8, height // 2)
        radius = random.randint(width // 4, 2 * width // 3)
        hue = random.choice(glow_palettes)
        step = max(1, radius // 50)
        for r in range(radius, 0, -step):
            ratio = r / radius
            alpha = int(65 * (1 - ratio) ** 2)
            gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*hue, alpha))

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=max(width // 20, 8)))
    img = Image.alpha_composite(img, glow_layer)

    # フィルムグレイン
    base = np.array(img)[:, :, :3].astype(np.int16)
    grain = np.random.normal(0, 7, (height, width, 3)).astype(np.int16)
    base = np.clip(base + grain, 0, 255).astype(np.uint8)
    img = Image.fromarray(base, "RGB").convert("RGBA")

    # ビネット
    vignette = _make_vignette(width, height, strength=0.4)
    img = Image.alpha_composite(img, vignette)

    return img.convert("RGB")
