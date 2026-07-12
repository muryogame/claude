"""
YouTube Shorts 縦型動画を自動生成するモジュール
解像度: 1080x1920（縦型 9:16）、目標20〜32秒
DALL-E 3 で勉強系背景画像を生成してオーバーレイ
"""
import os
import textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from moviepy import AudioFileClip, VideoClip, concatenate_videoclips, concatenate_audioclips, AudioClip
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


def _flash_intro_clip(text: str, duration: float = 0.35) -> VideoClip | None:
    """冒頭0.3秒、白フラッシュ+黒文字で「オチ・衝撃ワード」を先出しする（スクロール停止率UP狙い）。"""
    text = (text or "").strip()
    if not text:
        return None
    font = _font(110 if len(text) <= 8 else 84)
    img = Image.new("RGB", (SHORTS_W, SHORTS_H), (250, 250, 250))
    draw = ImageDraw.Draw(img)
    wrapped = textwrap.fill(text, width=7)
    lines = wrapped.split("\n")[:3]
    line_h = font.size + 20
    total_h = line_h * len(lines)
    y = (SHORTS_H - total_h) // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        x = (SHORTS_W - (bbox[2] - bbox[0])) // 2
        draw.text((x, y), line, font=font, fill=(15, 15, 15))
        y += line_h
    arr = np.array(img)

    def make_frame(t):
        return arr

    return VideoClip(make_frame, duration=duration)


# ── 字幕合成（カラオケ風・チャンク単位でテンポよく切り替え） ────────────


def _render_subtitle_frame(text: str, w: int = SHORTS_W, h: int = SHORTS_H) -> np.ndarray:
    """字幕チャンクをRGBA numpy配列として描画する（半透明の角丸背景 + アウトライン文字）。"""
    font_main = _font(58)
    font_small = _font(46)
    font = font_main if len(text) <= 12 else font_small

    wrapped = textwrap.fill(text, width=10)
    lines = wrapped.split("\n")

    line_h = font.size + 14
    box_h = line_h * len(lines) + 44
    box_w = w - 60

    img = Image.new("RGBA", (w, box_h + 20), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, box_w, box_h - 1], radius=22, fill=(10, 8, 26, 195))

    stroke_w = 3
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        x = (box_w - tw) // 2
        y = 22 + i * line_h
        for dx, dy in [(-stroke_w, -stroke_w), (0, -stroke_w), (stroke_w, -stroke_w),
                       (-stroke_w, 0), (stroke_w, 0),
                       (-stroke_w, stroke_w), (0, stroke_w), (stroke_w, stroke_w)]:
            draw.text((x + dx, y + dy), line, font=font, fill=(0, 0, 0, 255))
        draw.text((x, y), line, font=font, fill=(255, 220, 100, 255))

    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    y_pos = h - box_h - 130
    x_pos = (w - box_w) // 2
    canvas.paste(img.crop((0, 0, box_w, box_h)), (x_pos, y_pos))
    return np.array(canvas)


def _chunk_text(text: str, target_len: int = 9) -> list[str]:
    """字幕を読みやすい短いチャンク（目安9文字前後）に分割する（句読点優先、無ければ固定長）。"""
    text = (text or "").strip()
    if not text:
        return []
    chunks = []
    current = ""
    for ch in text:
        if ch == "\n":
            if current.strip():
                chunks.append(current.strip())
            current = ""
            continue
        current += ch
        if ch in "、。！？":
            if current.strip():
                chunks.append(current.strip())
            current = ""
        elif len(current) >= target_len:
            chunks.append(current.strip())
            current = ""
    if current.strip():
        chunks.append(current.strip())
    return chunks


def _chunk_windows(chunks: list[str], total_duration: float) -> list[tuple[str, float, float]]:
    total_chars = sum(len(c) for c in chunks) or 1
    windows = []
    t = 0.0
    for c in chunks:
        dur = max(0.25, total_duration * (len(c) / total_chars))
        windows.append((c, t, t + dur))
        t += dur
    return windows


def _composite_subtitle(frame: np.ndarray, subtitle_rgba: np.ndarray, t: float, duration: float) -> np.ndarray:
    """字幕チャンクを登場時ポップ（拡大→等倍）で合成する（チャンク間はフェードなしで即切り替え）。"""
    ov = Image.fromarray(subtitle_rgba, "RGBA")

    pop_dur = min(0.1, duration * 0.3)
    if pop_dur > 0 and t < pop_dur:
        scale_pop = 0.75 + 0.25 * (t / pop_dur)
        ys, xs = np.nonzero(subtitle_rgba[:, :, 3])
        if len(ys):
            y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
            cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
            box = ov.crop((x0, y0, x1 + 1, y1 + 1))
            new_w = max(1, int(box.width * scale_pop))
            new_h = max(1, int(box.height * scale_pop))
            box = box.resize((new_w, new_h), Image.LANCZOS)
            popped = Image.new("RGBA", ov.size, (0, 0, 0, 0))
            popped.paste(box, (cx - new_w // 2, cy - new_h // 2), box)
            ov = popped

    bg = Image.fromarray(frame, "RGB")
    bg.paste(ov, (0, 0), ov)
    return np.array(bg)


def _render_chunk_cache(subtitle_text: str, duration: float) -> list[tuple[np.ndarray, float, float]]:
    chunks = _chunk_text(subtitle_text)
    if not chunks:
        return []
    windows = _chunk_windows(chunks, duration)
    return [(_render_subtitle_frame(c), start, end) for c, start, end in windows]


def _apply_chunk_subtitles(frame: np.ndarray, chunk_cache: list, t: float) -> np.ndarray:
    if not chunk_cache:
        return frame
    for rgba, start, end in chunk_cache:
        is_last = (start, end) == (chunk_cache[-1][1], chunk_cache[-1][2])
        if start <= t < end or (is_last and t >= end):
            return _composite_subtitle(frame, rgba, t - start, end - start)
    return frame


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


def _ease_in_out(p: float) -> float:
    """滑らかな加減速カーブ（線形移動だと機械的で安っぽく見えるため）。"""
    p = max(0.0, min(1.0, p))
    return p * p * (3 - 2 * p)


def _zoom_clip(image_path: str, duration: float, zoom_amount: float = 0.12,
              subtitle_text: str = "") -> VideoClip:
    """スライド画像にゆっくりとしたズームイン効果 + カラオケ風字幕を付けたクリップを返す。"""
    img = Image.open(image_path).convert("RGB").resize((SHORTS_W, SHORTS_H), Image.LANCZOS)
    img_arr = np.array(img)
    chunk_cache = _render_chunk_cache(subtitle_text, duration) if subtitle_text else []

    def make_frame(t):
        progress = _ease_in_out(t / max(duration, 0.001))
        scale = 1.0 + zoom_amount * progress
        new_w, new_h = int(SHORTS_W * scale), int(SHORTS_H * scale)
        resized = np.array(Image.fromarray(img_arr).resize((new_w, new_h), Image.LANCZOS))
        x = (new_w - SHORTS_W) // 2
        y = (new_h - SHORTS_H) // 2
        frame = resized[y:y + SHORTS_H, x:x + SHORTS_W].copy()
        frame = _apply_chunk_subtitles(frame, chunk_cache, t)
        return frame

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

    # アクセントライン（この下は音声同期のカラオケ風字幕が表示されるため空けておく）
    ty += 20
    draw.rectangle([pad, ty, SHORTS_W - pad, ty + 5], fill=(99, 102, 241, 200))

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

    # CTA本文は音声同期のカラオケ風字幕で表示するため、ここでは装飾のみ配置
    ty = 620

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

    main_caption = "\n".join(filter(None, [script_data.get("hook", ""), script_data.get("body", "")]))
    outro_caption = script_data.get("cta", "")

    clips = [
        _zoom_clip(main_path, main_dur, zoom_amount=0.14, subtitle_text=main_caption),
        _zoom_clip(outro_path, outro_dur, zoom_amount=0.08, subtitle_text=outro_caption),
    ]

    # 冒頭の衝撃フラッシュ（あれば先頭に挿入。音声はその分だけ無音を前に足して同期させる）
    flash_clip = _flash_intro_clip(script_data.get("flash_text", ""))
    flash_dur = flash_clip.duration if flash_clip else 0.0
    all_clips = ([flash_clip] if flash_clip else []) + clips
    final = concatenate_videoclips(all_clips, method="compose")

    audio_parts = []
    if flash_dur > 0:
        audio_parts.append(AudioClip(lambda t: [0, 0], duration=flash_dur, fps=44100))
    audio_parts.append(audio if audio.duration <= total_duration else audio.subclipped(0, total_duration))
    if audio.duration < total_duration:
        audio_parts.append(AudioClip(lambda t: [0, 0], duration=total_duration - audio.duration, fps=44100))
    final = final.with_audio(concatenate_audioclips(audio_parts))

    final = final.with_fps(30)
    final.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)

    import glob
    for f in glob.glob(os.path.join(OUTPUT_DIR, "shorts_slide_*.png")):
        os.remove(f)

    print(f"  Shorts動画生成完了: {output_path}")
    return output_path
