"""
YouTube Shorts 縦型動画を自動生成するモジュール
解像度: 1080x1920（縦型 9:16）、目標20〜32秒
DALL-E 3 で勉強系背景画像を生成してオーバーレイ
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from moviepy import AudioFileClip, VideoClip, concatenate_videoclips
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR, FONT_BOLD, FONT_REG, FONT_FALLBACK, STUDYFLOW_URL
from config import VIDEO_WIDTH as SHORTS_W, VIDEO_HEIGHT as SHORTS_H
from config import BG_COLOR_TOP, BG_COLOR_BOTTOM, TITLE_COLOR, TEXT_COLOR, ACCENT_COLOR, HOT_COLOR, GOLD_COLOR
from image_utils import generate_dalle_bg, make_gradient_bg

client = OpenAI(api_key=OPENAI_API_KEY)

STUDYFLOW_DOMAIN = "study-tracker-2znl.onrender.com"


def _font(size: int, bold=True):
    path = FONT_BOLD if bold else FONT_REG
    if not os.path.exists(path):
        path = FONT_FALLBACK
    return ImageFont.truetype(path, size)


def generate_bg_image(image_prompt: str, slide_index: int) -> Image.Image | None:
    """DALL-E 3 で勉強系背景画像を生成する。"""
    full_prompt = (
        f"{image_prompt}. "
        "Vertical portrait 9:16 orientation, study and learning theme, "
        "dramatic glowing books and knowledge symbols, shocking impactful visual, "
        "bold saturated indigo purple and gold colors, cinematic lighting, "
        "high quality digital art."
    )
    print(f"  DALL-E 画像生成中（スライド{slide_index + 1}）...")
    return generate_dalle_bg(full_prompt, SHORTS_W, SHORTS_H, brightness=0.5, blur_radius=0.4)


def _make_gradient_bg() -> Image.Image:
    return make_gradient_bg(SHORTS_W, SHORTS_H, color1=BG_COLOR_TOP, color2=BG_COLOR_BOTTOM)


def _zoom_clip(image_path: str, duration: float, zoom_amount: float = 0.12) -> VideoClip:
    """スライド画像にゆっくりとしたズームイン効果を付けたクリップを返す（動きで視聴維持率UP）。"""
    img = Image.open(image_path).convert("RGB").resize((SHORTS_W, SHORTS_H), Image.LANCZOS)
    img_arr = np.array(img)

    def make_frame(t):
        progress = t / max(duration, 0.001)
        scale = 1.0 + zoom_amount * progress
        new_w, new_h = int(SHORTS_W * scale), int(SHORTS_H * scale)
        resized = np.array(Image.fromarray(img_arr).resize((new_w, new_h), Image.LANCZOS))
        x = (new_w - SHORTS_W) // 2
        y = (new_h - SHORTS_H) // 2
        return resized[y:y + SHORTS_H, x:x + SHORTS_W].copy()

    return VideoClip(make_frame, duration=duration)


def _draw_text_shadow(draw, pos, text, font, fill, shadow=(0, 0, 0, 200), offset=3):
    x, y = pos
    for dx, dy in [(-offset, -offset), (offset, -offset), (-offset, offset), (offset, offset)]:
        draw.text((x + dx, y + dy), text, font=font, fill=shadow)
    draw.text((x, y), text, font=font, fill=fill)


def _wrap_text(draw, text: str, font, max_width: int) -> list[str]:
    """テキストを指定幅で折り返す（日本語対応）。"""
    lines = []
    current = ""
    for char in text:
        test = current + char
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] > max_width and current:
            lines.append(current)
            current = char
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def _draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.ellipse([x0, y0, x0 + radius * 2, y0 + radius * 2], fill=fill)
    draw.ellipse([x1 - radius * 2, y0, x1, y0 + radius * 2], fill=fill)
    draw.ellipse([x0, y1 - radius * 2, x0 + radius * 2, y1], fill=fill)
    draw.ellipse([x1 - radius * 2, y1 - radius * 2, x1, y1], fill=fill)


def create_main_slide(script_data: dict, image_prompt: str) -> str:
    """メインスライド: グラデーション背景 + タイトル・本文テキスト。"""
    bg = generate_bg_image(image_prompt, 0)
    if bg is None:
        bg = _make_gradient_bg()
    bg = ImageEnhance.Brightness(bg).enhance(0.7)

    img = bg.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    pad = 70
    text_w = SHORTS_W - pad * 2
    cx = SHORTS_W // 2

    # ジャンルバッジ
    genre_label = script_data.get("genre_label", "学習Tips")
    font_badge = _font(38)
    bbox = draw.textbbox((0, 0), genre_label, font=font_badge)
    bw, bh = bbox[2] - bbox[0] + 50, bbox[3] - bbox[1] + 24
    bx = (SHORTS_W - bw) // 2
    by = 130
    _draw_rounded_rect(draw, (bx, by, bx + bw, by + bh), 20, (*HOT_COLOR, 230))
    draw.text((bx + 25, by + 12), genre_label, font=font_badge, fill=(255, 255, 255, 255))

    # タイトル
    title = script_data.get("title", "効率的な勉強法")
    font_title = _font(72)
    title_lines = _wrap_text(draw, title, font_title, text_w)
    ty = 240
    for line in title_lines:
        tb = draw.textbbox((0, 0), line, font=font_title)
        tx = (SHORTS_W - (tb[2] - tb[0])) // 2
        _draw_text_shadow(draw, (tx, ty), line, font_title, fill=(180, 185, 255, 255), offset=4)
        ty += tb[3] - tb[1] + 16

    # アクセントライン
    ty += 20
    draw.rectangle([pad, ty, SHORTS_W - pad, ty + 5], fill=(99, 102, 241, 200))
    ty += 35

    # フック文
    hook = script_data.get("hook", "")
    if hook:
        font_hook = _font(54)
        hook_lines = _wrap_text(draw, hook, font_hook, text_w)
        for line in hook_lines:
            tb = draw.textbbox((0, 0), line, font=font_hook)
            tx = (SHORTS_W - (tb[2] - tb[0])) // 2
            _draw_text_shadow(draw, (tx, ty), line, font_hook, fill=(255, 220, 100, 255), offset=3)
            ty += tb[3] - tb[1] + 12
        ty += 30

    # 本文
    body = script_data.get("body", "")
    if body:
        font_body = _font(44, bold=False)
        body_lines = _wrap_text(draw, body, font_body, text_w)
        for line in body_lines[:12]:
            tb = draw.textbbox((0, 0), line, font=font_body)
            tx = (SHORTS_W - (tb[2] - tb[0])) // 2
            _draw_text_shadow(draw, (tx, ty), line, font_body, fill=(235, 238, 255, 255), offset=2)
            ty += tb[3] - tb[1] + 10

    # StudyFlow URL バッジ（下部）
    url_text = "StudyFlow - " + STUDYFLOW_DOMAIN
    font_url = _font(34)
    ub = draw.textbbox((0, 0), url_text, font=font_url)
    uw, uh = ub[2] - ub[0] + 50, ub[3] - ub[1] + 22
    ux = (SHORTS_W - uw) // 2
    uy = SHORTS_H - 120
    _draw_rounded_rect(draw, (ux, uy, ux + uw, uy + uh), 16, (30, 20, 60, 210))
    draw.text((ux + 25, uy + 11), url_text, font=font_url, fill=(180, 185, 255, 255))

    result = Image.alpha_composite(img, overlay).convert("RGB")
    path = os.path.join(OUTPUT_DIR, "shorts_slide_00.png")
    result.save(path)
    return path


def create_outro_slide(script_data: dict, image_prompt: str) -> str:
    """アウトロスライド: グラデーション背景 + CTA・チャンネル登録テキスト。"""
    bg = generate_bg_image(image_prompt, 1)
    if bg is None:
        bg = _make_gradient_bg()
    bg = ImageEnhance.Brightness(bg).enhance(0.6)

    img = bg.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    pad = 70
    text_w = SHORTS_W - pad * 2
    cx = SHORTS_W // 2

    # 中央エリアの半透明パネル
    panel_y0, panel_y1 = 500, 1420
    panel = Image.new("RGBA", (SHORTS_W - pad * 2, panel_y1 - panel_y0), (10, 8, 30, 180))
    overlay.paste(panel, (pad, panel_y0), panel)

    ty = 560

    # CTA テキスト
    cta = script_data.get("cta", "チャンネル登録でもっと学習法を学ぼう！")
    font_cta = _font(60)
    cta_lines = _wrap_text(draw, cta, font_cta, text_w - 40)
    for line in cta_lines:
        tb = draw.textbbox((0, 0), line, font=font_cta)
        tx = (SHORTS_W - (tb[2] - tb[0])) // 2
        _draw_text_shadow(draw, (tx, ty), line, font_cta, fill=(255, 220, 100, 255), offset=4)
        ty += tb[3] - tb[1] + 18
    ty += 50

    # チャンネル登録ボタン風
    btn_text = "▶ チャンネル登録"
    font_btn = _font(56)
    bb = draw.textbbox((0, 0), btn_text, font=font_btn)
    bw, bh = bb[2] - bb[0] + 80, bb[3] - bb[1] + 36
    bx = (SHORTS_W - bw) // 2
    _draw_rounded_rect(draw, (bx, ty, bx + bw, ty + bh), 24, (220, 50, 50, 230))
    draw.text((bx + 40, ty + 18), btn_text, font=font_btn, fill=(255, 255, 255, 255))
    ty += bh + 50

    # いいね・共有
    sub_text = "いいね & シェアも嬉しいです！"
    font_sub = _font(44, bold=False)
    sb = draw.textbbox((0, 0), sub_text, font=font_sub)
    sx = (SHORTS_W - (sb[2] - sb[0])) // 2
    draw.text((sx, ty), sub_text, font=font_sub, fill=(200, 205, 255, 200))
    ty += sb[3] - sb[1] + 40

    # StudyFlow アプリ紹介
    app_line1 = "学習時間を記録するなら"
    app_line2 = "無料アプリ StudyFlow"
    font_app = _font(46)
    for line in [app_line1, app_line2]:
        lb = draw.textbbox((0, 0), line, font=font_app)
        lx = (SHORTS_W - (lb[2] - lb[0])) // 2
        _draw_text_shadow(draw, (lx, ty), line, font_app, fill=(180, 185, 255, 255), offset=2)
        ty += lb[3] - lb[1] + 14

    # URL バッジ
    font_url = _font(36)
    ub = draw.textbbox((0, 0), STUDYFLOW_DOMAIN, font=font_url)
    uw, uh = ub[2] - ub[0] + 50, ub[3] - ub[1] + 22
    ux = (SHORTS_W - uw) // 2
    uy = SHORTS_H - 120
    _draw_rounded_rect(draw, (ux, uy, ux + uw, uy + uh), 16, (99, 102, 241, 220))
    draw.text((ux + 25, uy + 11), STUDYFLOW_DOMAIN, font=font_url, fill=(255, 255, 255, 255))

    result = Image.alpha_composite(img, overlay).convert("RGB")
    path = os.path.join(OUTPUT_DIR, "shorts_slide_01.png")
    result.save(path)
    return path


def build_shorts_video(script_data: dict, audio_path: str, output_path: str,
                       max_seconds: float = 60.0) -> str:
    """20〜32秒Shorts動画を生成する（メイン + アウトロの2スライド構成）。"""
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
        _zoom_clip(main_path, main_dur, zoom_amount=0.14),
        _zoom_clip(outro_path, outro_dur, zoom_amount=0.08),
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
