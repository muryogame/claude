#!/usr/bin/env python3
"""
30分 集中BGM 動画生成モジュール
- 音声: バイノーラルビート (alpha波 12Hz) + ピンクノイズ
- 映像: インディゴ系グラデーション + パーティクルアニメ (1920x1080 / 30分)
"""
import os
import math
import wave
import random
import struct
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from moviepy import ImageSequenceClip, AudioFileClip, concatenate_videoclips
from config import OUTPUT_DIR, FONT_BOLD, FONT_FALLBACK

BGM_DURATION   = 1800   # 30分
LOOP_DURATION  = 60     # ループ単位（秒）
LOOP_FPS       = 1      # フレームレート（アンビエント映像は1fpsで十分）
VIDEO_W, VIDEO_H = 1920, 1080

PARTICLE_COUNT = 60
random.seed(42)
PARTICLES = [
    {
        "x": random.uniform(0, VIDEO_W),
        "y": random.uniform(0, VIDEO_H),
        "r": random.uniform(1.5, 4.0),
        "speed": random.uniform(0.3, 1.2),
        "phase": random.uniform(0, math.tau),
    }
    for _ in range(PARTICLE_COUNT)
]


def _font(size):
    for path in [FONT_BOLD, FONT_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


# ────────── 音声生成 ──────────

def generate_bgm_wav(output_path: str, duration: int = BGM_DURATION, sample_rate: int = 44100):
    """バイノーラルビート (アルファ波 12Hz) + ピンクノイズ WAV を生成する。"""
    print("  BGM音声生成中...")
    n = int(duration * sample_rate)
    t = np.linspace(0, duration, n, endpoint=False, dtype=np.float32)

    # バイノーラルビート: 左 440Hz / 右 452Hz → 差分 12Hz = アルファ波
    left  = 0.45 * np.sin(2 * np.pi * 440.0 * t)
    right = 0.45 * np.sin(2 * np.pi * 452.0 * t)

    # 1オクターブ下のサブトーン（温もり感）
    left  += 0.12 * np.sin(2 * np.pi * 220.0 * t)
    right += 0.12 * np.sin(2 * np.pi * 226.0 * t)

    # ピンクノイズ（1/f: 白ノイズをローパス的に平均化で近似）
    white = np.random.default_rng(0).standard_normal(n).astype(np.float32)
    # 簡易ローパス: 累積和 → スケール
    pink = np.cumsum(white)
    pink -= pink.mean()
    pink /= np.max(np.abs(pink)) + 1e-9
    noise = 0.06 * pink

    left  = left  + noise
    right = right + noise

    # フェードイン・フェードアウト (30秒、ただし全体の1/4以内)
    fade = min(int(30 * sample_rate), n // 4)
    ramp = np.linspace(0, 1, fade, dtype=np.float32)
    left[:fade]   *= ramp;  right[:fade]   *= ramp
    left[-fade:]  *= ramp[::-1]; right[-fade:] *= ramp[::-1]

    # 正規化 → int16
    peak = max(np.max(np.abs(left)), np.max(np.abs(right))) + 1e-9
    left  = (left  / peak * 32767).astype(np.int16)
    right = (right / peak * 32767).astype(np.int16)

    stereo = np.empty(n * 2, dtype=np.int16)
    stereo[0::2] = left
    stereo[1::2] = right

    with wave.open(output_path, "w") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(stereo.tobytes())

    print(f"  BGM音声保存: {output_path}  ({duration//60}分 {duration%60}秒)")


# ────────── 映像生成 ──────────

def _gradient_frame(t_loop: float) -> Image.Image:
    """t_loop: 0〜LOOP_DURATION のアニメーション時刻"""
    img = Image.new("RGB", (VIDEO_W, VIDEO_H))
    draw = ImageDraw.Draw(img)

    phase = (t_loop / LOOP_DURATION) * math.tau  # 0 → 2π (1周/ループ)

    for y in range(0, VIDEO_H, 2):          # 2px ステップで高速化
        ratio = y / VIDEO_H
        wave_ = 0.08 * math.sin(phase + ratio * math.pi * 2)

        r = max(0, min(255, int(10 + 30 * ratio + wave_ * 15)))
        g = max(0, min(255, int(14 + 15 * ratio)))
        b = max(0, min(255, int(30 + 50 * ratio + wave_ * 25)))
        draw.rectangle([(0, y), (VIDEO_W, y + 1)], fill=(r, g, b))

    # パーティクル
    for p in PARTICLES:
        px = (p["x"] + p["speed"] * t_loop * 15) % VIDEO_W
        py = p["y"] + 20 * math.sin(p["phase"] + t_loop * 0.5)
        alpha = int(180 + 60 * math.sin(p["phase"] + t_loop))
        r_px = int(p["r"])
        draw.ellipse(
            [(px - r_px, py - r_px), (px + r_px, py + r_px)],
            fill=(max(0, min(255, 140 + alpha // 4)),
                  max(0, min(255, 150 + alpha // 4)),
                  255),
        )

    # テキストオーバーレイ
    draw_overlay(draw, t_loop)

    return img


def draw_overlay(draw: ImageDraw.ImageDraw, t_loop: float):
    # 中央上部: チャンネル名
    f_ch = _font(44)
    ch_text = "StudyFlow / 勉強法ショート"
    bb = draw.textbbox((0, 0), ch_text, font=f_ch)
    w = bb[2] - bb[0]
    draw.text(((VIDEO_W - w) // 2, 40), ch_text, font=f_ch, fill=(160, 165, 240, 200))

    # 中央: メインタイトル
    f_main = _font(110)
    main_text = "30分 集中BGM"
    bb = draw.textbbox((0, 0), main_text, font=f_main)
    w = bb[2] - bb[0]
    # シャドウ
    for dx, dy in [(-3, -3), (3, 3)]:
        draw.text(((VIDEO_W - w) // 2 + dx, VIDEO_H // 2 - 120 + dy),
                  main_text, font=f_main, fill=(0, 0, 0, 150))
    draw.text(((VIDEO_W - w) // 2, VIDEO_H // 2 - 120),
              main_text, font=f_main, fill=(200, 205, 255))

    # サブタイトル
    f_sub = _font(58)
    sub_text = "Study Focus BGM ✦ Alpha Wave Binaural Beat"
    bb = draw.textbbox((0, 0), sub_text, font=f_sub)
    w = bb[2] - bb[0]
    draw.text(((VIDEO_W - w) // 2, VIDEO_H // 2 + 10),
              sub_text, font=f_sub, fill=(160, 165, 220))

    # 下部説明
    f_note = _font(38)
    note_text = "🎧 イヤフォン推奨  ✦  音量を少し下げて使うと効果的"
    bb = draw.textbbox((0, 0), note_text, font=f_note)
    w = bb[2] - bb[0]
    draw.text(((VIDEO_W - w) // 2, VIDEO_H - 80),
              note_text, font=f_note, fill=(130, 135, 200))


def generate_loop_frames() -> list[np.ndarray]:
    """60秒 × 1fps = 60フレームのループ映像を生成する。"""
    print("  ループ映像フレーム生成中...")
    frames = []
    total = LOOP_DURATION * LOOP_FPS
    for i in range(total):
        t_loop = i / LOOP_FPS
        frame = _gradient_frame(t_loop)
        frames.append(np.array(frame))
        if (i + 1) % 10 == 0:
            print(f"    フレーム {i+1}/{total}")
    return frames


# ────────── メイン ──────────

def create_bgm_video(output_path: str, audio_path: str | None = None) -> str:
    """30分 集中BGM 動画を生成して output_path に保存する。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    wav_path = audio_path or os.path.join(OUTPUT_DIR, "_bgm_temp.wav")
    generate_bgm_wav(wav_path)

    print("  映像クリップ生成中...")
    frames = generate_loop_frames()
    loop_clip = ImageSequenceClip(frames, fps=LOOP_FPS)

    repeat = BGM_DURATION // LOOP_DURATION       # 30回
    video  = concatenate_videoclips([loop_clip] * repeat)

    print("  音声を合成中...")
    audio = AudioFileClip(wav_path).with_duration(BGM_DURATION)
    video = video.with_audio(audio)

    print(f"  動画書き出し中: {output_path}")
    video.write_videofile(
        output_path,
        fps=LOOP_FPS,
        codec="libx264",
        audio_codec="aac",
        preset="ultrafast",
        ffmpeg_params=["-crf", "28"],
        logger=None,
    )

    if not audio_path:
        os.remove(wav_path)

    print(f"  ✅ BGM動画保存完了: {output_path}")
    return output_path


if __name__ == "__main__":
    from datetime import datetime
    date_str = datetime.now().strftime("%Y%m%d")
    out = os.path.join(OUTPUT_DIR, f"bgm_{date_str}.mp4")
    create_bgm_video(out)
