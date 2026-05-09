#!/usr/bin/env python3
"""
30分 集中BGM 動画生成モジュール
- 音楽: Lofi ピアノ（Dマイナー調）+ ベース + ドラム + α波バイノーラル
- 映像: 1920x1080 コージースタディルーム風アニメーション
- 分析: 競合Top（lofi hip hop 6.4億回 / 波の音×オルゴール 8700万回）を参考
"""
import os
import io
import math
import wave
import random
import struct
import requests
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from moviepy import ImageSequenceClip, AudioFileClip, concatenate_videoclips, ImageClip
from openai import OpenAI
from config import OUTPUT_DIR, FONT_BOLD, FONT_FALLBACK, OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

BGM_DURATION   = 1800   # 30分
SAMPLE_RATE    = 44100
BPM            = 82     # lofiの定番テンポ
VIDEO_W, VIDEO_H = 1920, 1080
LOOP_FPS       = 1


# ══════════════════════════════════════════
#  音楽シンセサイザー
# ══════════════════════════════════════════

def _midi_to_freq(midi: int) -> float:
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def _piano(freq: float, dur: float, vel: float = 0.7) -> np.ndarray:
    """ピアノ音：倍音 + ADSRエンベロープ"""
    n  = int(dur * SAMPLE_RATE)
    t  = np.linspace(0, dur, n, endpoint=False, dtype=np.float32)
    # 基音 + 倍音でピアノらしい音色
    w  = (0.55 * np.sin(2*np.pi*freq*t)
        + 0.22 * np.sin(2*np.pi*2*freq*t)
        + 0.12 * np.sin(2*np.pi*3*freq*t)
        + 0.06 * np.sin(2*np.pi*4*freq*t)
        + 0.03 * np.sin(2*np.pi*5*freq*t)
        + 0.04 * np.sin(2*np.pi*(freq*1.004)*t))  # ちょっとデチューン
    # ADSR
    a = max(1, int(0.008 * SAMPLE_RATE))
    d = max(1, int(0.10  * SAMPLE_RATE))
    r = max(1, min(int(0.35 * SAMPLE_RATE), n // 3))
    sl = 0.38
    env = np.full(n, sl, dtype=np.float32)
    env[:a]        = np.linspace(0, 1,  a)
    env[a:a+d]     = np.linspace(1, sl, d)
    env[max(0, n-r):] = np.linspace(sl, 0, min(r, n))
    return w * env * vel


def _bass(freq: float, dur: float, vel: float = 0.55) -> np.ndarray:
    """ベース音：太めの音色"""
    n = int(dur * SAMPLE_RATE)
    t = np.linspace(0, dur, n, endpoint=False, dtype=np.float32)
    w = (0.65 * np.sin(2*np.pi*freq*t)
       + 0.25 * np.sin(2*np.pi*2*freq*t)
       + 0.10 * np.sin(2*np.pi*3*freq*t))
    a = max(1, int(0.005 * SAMPLE_RATE))
    d = max(1, int(0.12  * SAMPLE_RATE))
    r = max(1, min(int(0.18 * SAMPLE_RATE), n // 3))
    sl = 0.30
    env = np.full(n, sl, dtype=np.float32)
    env[:a]           = np.linspace(0, 1,  a)
    env[a:a+d]        = np.linspace(1, sl, d)
    env[max(0,n-r):]  = np.linspace(sl, 0, min(r, n))
    return w * env * vel


def _kick() -> np.ndarray:
    """キックドラム：ピッチ落下 + ボディ感"""
    dur = 0.20
    n   = int(dur * SAMPLE_RATE)
    t   = np.linspace(0, dur, n, endpoint=False, dtype=np.float32)
    freq_env = 160 * np.exp(-35 * t) + 40
    phase    = 2 * np.pi * np.cumsum(freq_env) / SAMPLE_RATE
    w    = np.sin(phase)
    body = 0.3 * np.sin(2 * np.pi * 55 * t)
    env  = np.exp(-18 * t)
    return (w + body) * env * 0.75


def _snare() -> np.ndarray:
    """スネア：トーン + ノイズ"""
    dur = 0.18
    n   = int(dur * SAMPLE_RATE)
    t   = np.linspace(0, dur, n, endpoint=False, dtype=np.float32)
    tone  = 0.35 * np.sin(2*np.pi*185*t) + 0.15 * np.sin(2*np.pi*310*t)
    noise = np.random.default_rng(1).standard_normal(n).astype(np.float32) * 0.55
    env   = np.exp(-22 * t)
    return (tone + noise) * env * 0.28


def _hihat(open_=False) -> np.ndarray:
    """ハイハット：フィルタードノイズ"""
    dur = 0.06 if not open_ else 0.18
    n   = int(dur * SAMPLE_RATE)
    rng = np.random.default_rng(2)
    noise = rng.standard_normal(n).astype(np.float32)
    # 簡易ハイパスフィルタ（差分）
    filtered = np.diff(noise, prepend=noise[0])
    env = np.exp(-30 * np.linspace(0, 1, n))
    return filtered * env * 0.12


def _vinyl_crackle(n: int) -> np.ndarray:
    """レコードのチリチリノイズ（lofi質感）"""
    rng   = np.random.default_rng(42)
    noise = rng.standard_normal(n).astype(np.float32)
    # まばらなスパイク
    spikes = rng.integers(0, n, size=int(n * 0.0003))
    noise[spikes] *= 8
    return np.clip(noise, -1, 1) * 0.018


def _alpha_binaural(n: int) -> tuple[np.ndarray, np.ndarray]:
    """α波バイノーラルビート（10Hz差分）を極小音量で追加"""
    t = np.linspace(0, n / SAMPLE_RATE, n, endpoint=False, dtype=np.float32)
    L = 0.04 * np.sin(2 * np.pi * 200.0 * t)
    R = 0.04 * np.sin(2 * np.pi * 210.0 * t)
    return L, R


def _mix_into(buf: np.ndarray, src: np.ndarray, pos: int):
    end = min(pos + len(src), len(buf))
    if end > pos:
        buf[pos:end] += src[:end - pos]


# ── コード進行（Dマイナー Lofi）──────────────────
# Dm7 → Bbmaj7 → Gm7 → A7  (各2小節)
_CHORDS_MIDI = [
    [50, 53, 57, 60],   # Dm7:   D3 F3 A3 C4
    [46, 50, 53, 57],   # Bbmaj7: Bb2 D3 F3 A3
    [43, 46, 50, 53],   # Gm7:   G2 Bb2 D3 F3
    [45, 49, 52, 55],   # A7:    A2 C#3 E3 G3
]
_BASS_MIDI = [38, 34, 31, 33]   # D2, Bb1, G1, A1


def _compose_loop() -> tuple[np.ndarray, np.ndarray]:
    """8小節（約23.4秒）の lofi ループを生成する。"""
    beat   = 60.0 / BPM          # 1拍の長さ(秒)
    bar    = beat * 4            # 1小節(秒)
    n_bars = 8
    loop_sec = bar * n_bars
    n        = int(loop_sec * SAMPLE_RATE)

    left  = np.zeros(n, dtype=np.float32)
    right = np.zeros(n, dtype=np.float32)

    kick_s   = _kick()
    snare_s  = _snare()
    hihat_s  = _hihat()
    hihat_o  = _hihat(open_=True)

    rng = np.random.default_rng(0)

    for bar_i in range(n_bars):
        chord_idx = (bar_i // 2) % len(_CHORDS_MIDI)
        bar_start = bar_i * bar

        # ── ドラムパターン ──
        for beat_i in range(4):
            bt = bar_start + beat_i * beat
            pos = int(bt * SAMPLE_RATE)
            # キック（1,3拍）
            if beat_i in (0, 2):
                _mix_into(left,  kick_s * 0.9, pos)
                _mix_into(right, kick_s * 0.9, pos)
            # スネア（2,4拍）わずかにスウィング
            if beat_i in (1, 3):
                swing = rng.uniform(-0.02, 0.02) * beat
                sp = int((bt + swing) * SAMPLE_RATE)
                _mix_into(left,  snare_s, sp)
                _mix_into(right, snare_s, sp)
            # ハイハット（8分音符）
            for eighth in range(2):
                ht = bt + eighth * beat * 0.5
                # lofi スウィング
                if eighth == 1:
                    ht += beat * rng.uniform(0.02, 0.06)
                hp = int(ht * SAMPLE_RATE)
                hh = hihat_o if (beat_i == 3 and eighth == 1) else hihat_s
                _mix_into(left,  hh * 0.8, hp)
                _mix_into(right, hh * 0.8, hp)

        # ── ピアノ アルペジオ ──
        notes_midi = _CHORDS_MIDI[chord_idx]
        arp_times  = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]  # 8分音符
        for step, arp_beat in enumerate(arp_times):
            note_idx = step % len(notes_midi)
            # 高音部で音を上に重ねる
            if step >= 4:
                note_idx = (len(notes_midi) - 1 - (step % len(notes_midi)))
            midi = notes_midi[note_idx]
            freq = _midi_to_freq(midi)
            vel  = rng.uniform(0.50, 0.70)
            dur  = beat * 0.75
            pn   = _piano(freq, dur, vel)
            pt   = bar_start + arp_beat * beat
            pp   = int(pt * SAMPLE_RATE)
            pan_l = rng.uniform(0.55, 0.80)
            pan_r = 1.0 - pan_l + 0.20
            _mix_into(left,  pn * pan_l, pp)
            _mix_into(right, pn * pan_r, pp)

        # ── ベース（1拍目と3拍目）──
        bass_midi = _BASS_MIDI[chord_idx]
        bass_freq = _midi_to_freq(bass_midi)
        for beat_i in (0, 2):
            bt  = bar_start + beat_i * beat
            bp  = int(bt * SAMPLE_RATE)
            bn  = _bass(bass_freq, beat * 1.8)
            _mix_into(left,  bn * 0.55, bp)
            _mix_into(right, bn * 0.55, bp)

    # ── ヴァイナルクラックル ──
    crackle = _vinyl_crackle(n)
    left  += crackle
    right += crackle

    # ── α波バイノーラル（極小音量）──
    al, ar = _alpha_binaural(n)
    left  += al
    right += ar

    # フェードイン/アウト
    fade = int(0.5 * SAMPLE_RATE)
    ramp = np.linspace(0, 1, fade, dtype=np.float32)
    left[:fade]   *= ramp;  right[:fade]   *= ramp
    left[-fade:]  *= ramp[::-1]; right[-fade:] *= ramp[::-1]

    return left, right


def generate_bgm_wav(output_path: str, duration: int = BGM_DURATION):
    """lofi ピアノループを繰り返して30分WAVを生成する。"""
    print("  BGM音楽生成中（lofi ピアノ + ドラム）...")
    loop_L, loop_R = _compose_loop()
    loop_samples   = len(loop_L)
    total_samples  = duration * SAMPLE_RATE
    repeats        = math.ceil(total_samples / loop_samples)

    # ピーク正規化
    peak = max(np.max(np.abs(loop_L)), np.max(np.abs(loop_R))) + 1e-9
    loop_L = (loop_L / peak * 0.88).astype(np.float32)
    loop_R = (loop_R / peak * 0.88).astype(np.float32)

    with wave.open(output_path, "w") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        written = 0
        for i in range(repeats):
            remaining = total_samples - written
            chunk_L = loop_L[:remaining]
            chunk_R = loop_R[:remaining]
            stereo = np.empty(len(chunk_L) * 2, dtype=np.int16)
            stereo[0::2] = (chunk_L * 32767).astype(np.int16)
            stereo[1::2] = (chunk_R * 32767).astype(np.int16)
            wf.writeframes(stereo.tobytes())
            written += len(chunk_L)
            if written >= total_samples:
                break
        # フェードアウト（最後の3秒）
        # ※ WAV書き込み後なので実用上は前処理で対応済み

    print(f"  BGM音楽保存: {output_path}  ({duration//60}分)")


# ══════════════════════════════════════════
#  映像生成（コージースタディルーム風）
# ══════════════════════════════════════════

def _font(size):
    for path in [FONT_BOLD, FONT_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _generate_bg_dalle() -> Image.Image | None:
    """DALL-E 3 でコージーな勉強部屋の背景を生成する。"""
    return None  # DALL-E 無効化（コスト削減）
    try:
        prompt = (
            "Cozy aesthetic study room at night, warm lamp light, "
            "desk with open books and plants, rain outside the window, "
            "soft purple and indigo color palette, lofi aesthetic, "
            "cinematic wide shot 16:9, NO TEXT, no letters, no words, "
            "high quality digital art illustration."
        )
        print("  DALL-E 背景画像生成中...")
        resp = client.images.generate(
            model="dall-e-3", prompt=prompt,
            size="1792x1024", quality="standard", n=1,
        )
        url = resp.data[0].url
        data = requests.get(url, timeout=30).content
        img  = Image.open(io.BytesIO(data)).convert("RGB")
        return img.resize((VIDEO_W, VIDEO_H), Image.LANCZOS)
    except Exception as e:
        print(f"  DALL-E スキップ: {e}")
        return None


def _make_gradient_bg() -> Image.Image:
    img  = Image.new("RGB", (VIDEO_W, VIDEO_H))
    draw = ImageDraw.Draw(img)
    for y in range(VIDEO_H):
        r = int(8  + (y / VIDEO_H) * 22)
        g = int(13 + (y / VIDEO_H) * 7)
        b = int(26 + (y / VIDEO_H) * 34)
        draw.line([(0, y), (VIDEO_W, y)], fill=(r, g, b))
    return img


def _make_frame(base_img: Image.Image, t: float, total: float) -> np.ndarray:
    """アニメーションフレームを生成する（t: 経過秒）。"""
    # ゆっくりした明度揺らぎ（キャンドル感）
    brightness = 1.0 + 0.04 * math.sin(t * 0.2)
    frame = ImageEnhance.Brightness(base_img).enhance(brightness)
    frame = frame.copy()
    draw  = ImageDraw.Draw(frame, "RGBA")

    # ── 上部半透明帯 ──
    draw.rectangle([0, 0, VIDEO_W, 90], fill=(0, 0, 0, 140))

    # チャンネル名
    f_ch  = _font(38)
    ch_tx = "StudyFlow / 勉強法ショート"
    bb = draw.textbbox((0, 0), ch_tx, font=f_ch)
    draw.text(((VIDEO_W - (bb[2]-bb[0])) // 2, 22), ch_tx, font=f_ch, fill=(180, 185, 255, 220))

    # ── 中央タイトル ──
    draw.rectangle([0, VIDEO_H//2 - 110, VIDEO_W, VIDEO_H//2 + 160], fill=(0, 0, 0, 155))

    f_main = _font(108)
    main_tx = "30分 集中BGM"
    bb = draw.textbbox((0, 0), main_tx, font=f_main)
    w  = bb[2] - bb[0]
    # シャドウ
    for dx, dy in [(-3,-3),(3,3),(-3,3),(3,-3)]:
        draw.text(((VIDEO_W-w)//2+dx, VIDEO_H//2-100+dy), main_tx, font=f_main, fill=(0,0,0,160))
    draw.text(((VIDEO_W-w)//2, VIDEO_H//2-100), main_tx, font=f_main, fill=(200, 205, 255, 255))

    f_sub = _font(52)
    sub_tx = "Lofi Piano × Study Focus × α Wave"
    bb = draw.textbbox((0, 0), sub_tx, font=f_sub)
    draw.text(((VIDEO_W-(bb[2]-bb[0]))//2, VIDEO_H//2+30), sub_tx, font=f_sub, fill=(155, 165, 215, 220))

    # ── 経過時間 ──
    elapsed_min = int(t // 60)
    elapsed_sec = int(t % 60)
    remain_min  = int((total - t) // 60)
    remain_sec  = int((total - t) % 60)
    f_time = _font(44)
    time_tx = f"⏱ {elapsed_min:02d}:{elapsed_sec:02d}  /  残り {remain_min:02d}:{remain_sec:02d}"
    bb = draw.textbbox((0, 0), time_tx, font=f_time)
    draw.text(((VIDEO_W-(bb[2]-bb[0]))//2, VIDEO_H//2+100), time_tx, font=f_time, fill=(140,150,200,200))

    # ── 下部帯 ──
    draw.rectangle([0, VIDEO_H-90, VIDEO_W, VIDEO_H], fill=(99, 102, 241, 200))
    f_note = _font(36)
    note_tx = "🎧 イヤフォン推奨  ✦  学習時間の記録は StudyFlow アプリ：study-tracker-2znl.onrender.com"
    bb = draw.textbbox((0, 0), note_tx, font=f_note)
    draw.text(((VIDEO_W-(bb[2]-bb[0]))//2, VIDEO_H-68), note_tx, font=f_note, fill=(230, 232, 255, 240))

    return np.array(frame)


def _generate_video_frames(base_img: Image.Image, duration: int) -> list[np.ndarray]:
    """1fps × LOOP_DURATION フレームのループ映像を生成する。"""
    loop_sec = 60
    print(f"  映像フレーム生成中（{loop_sec}秒ループ）...")
    frames = []
    for i in range(loop_sec * LOOP_FPS):
        t = i / LOOP_FPS
        frames.append(_make_frame(base_img, t, duration))
        if (i+1) % 10 == 0:
            print(f"    {i+1}/{loop_sec*LOOP_FPS}")
    return frames


# ══════════════════════════════════════════
#  メイン
# ══════════════════════════════════════════

def create_bgm_video(output_path: str, audio_path: str | None = None) -> str:
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    wav_path = audio_path or os.path.join(OUTPUT_DIR, "_bgm_tmp.wav")
    generate_bgm_wav(wav_path, duration=BGM_DURATION)

    # 背景画像
    bg = _generate_bg_dalle() or _make_gradient_bg()
    bg = ImageEnhance.Brightness(bg).enhance(0.72)

    # 映像クリップ（ループ × 30回）
    frames    = _generate_video_frames(bg, BGM_DURATION)
    loop_clip = ImageSequenceClip(frames, fps=LOOP_FPS)
    repeat    = BGM_DURATION // 60
    video     = concatenate_videoclips([loop_clip] * repeat)

    # 音声合成
    print("  音声を映像に合成中...")
    audio = AudioFileClip(wav_path).with_duration(BGM_DURATION)
    video = video.with_audio(audio)

    print(f"  動画書き出し中: {output_path}")
    video.write_videofile(
        output_path, fps=LOOP_FPS,
        codec="libx264", audio_codec="aac",
        preset="ultrafast", ffmpeg_params=["-crf", "26"],
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
