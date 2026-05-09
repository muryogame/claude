"""
DALL-E 3 背景画像生成の共通ユーティリティ
video_creator / shorts_creator / thumbnail_creator から共有される
"""
import io
import requests
from PIL import Image, ImageEnhance, ImageFilter
from openai import OpenAI
from config import OPENAI_API_KEY

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
    失敗時は None を返す（呼び出し側でグラデーション等にフォールバック）。

    Args:
        prompt: 英語プロンプト
        width / height: 出力サイズ
        brightness: 暗くしてテキストを読みやすくする係数（0.0〜1.0）
        blur_radius: ぼかし半径
    """
    # DALL-E 無効化（コスト削減）→ 呼び出し側がグラデーションにフォールバック
    return None
    # アスペクト比に合わせて DALL-E のサイズを選択
    aspect = width / height
    if aspect >= 1.5:
        dalle_size = "1792x1024"  # 横長（通常動画・サムネ用）
    elif aspect <= 0.7:
        dalle_size = "1024x1792"  # 縦長（Shorts用）
    else:
        dalle_size = "1024x1024"  # 正方形

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
            quality="standard",
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


def make_gradient_bg(
    width: int,
    height: int,
    color1=(10, 10, 40),
    color2=(40, 10, 80),
) -> Image.Image:
    """グラデーション背景を生成する（DALL-E フォールバック用）。"""
    img = Image.new("RGB", (width, height))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    for y in range(height):
        ratio = y / height
        r = int(color1[0] + (color2[0] - color1[0]) * ratio)
        g = int(color1[1] + (color2[1] - color1[1]) * ratio)
        b = int(color1[2] + (color2[2] - color1[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return img
