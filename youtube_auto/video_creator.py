"""
スクリプト + 音声 から動画を生成するモジュール
DALL-E 3 背景 + クロスフェード
テキストオーバーレイなし（ナレーション音声が内容を伝える）
"""
import os
import glob
from moviepy import AudioFileClip, ImageClip, concatenate_videoclips
from moviepy import vfx
from config import OUTPUT_DIR, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS
from image_utils import generate_dalle_bg, make_gradient_bg

FADE_DURATION = 0.5


def create_slide_image(heading: str, slide_num: int, image_prompt: str = "") -> str:
    """DALL-E 3 背景のみのスライド画像を生成する（テキストなし）。"""
    prompt = image_prompt or f"{heading}, knowledge trivia, educational illustration"
    bg = generate_dalle_bg(prompt, VIDEO_WIDTH, VIDEO_HEIGHT,
                           brightness=1.0, blur_radius=0)
    if bg is None:
        bg = make_gradient_bg(VIDEO_WIDTH, VIDEO_HEIGHT,
                              color1=(10, 10, 40), color2=(40, 10, 80))

    path = os.path.join(OUTPUT_DIR, f"slide_{slide_num:02d}.png")
    bg.save(path, quality=95)
    return path


def create_title_slide() -> str:
    """タイトルスライドを DALL-E 背景のみで生成する（テキストなし）。"""
    prompt = "dramatic cinematic background representing trivia knowledge, mystical universe"
    bg = generate_dalle_bg(prompt, VIDEO_WIDTH, VIDEO_HEIGHT,
                           brightness=1.0, blur_radius=0)
    if bg is None:
        bg = make_gradient_bg(VIDEO_WIDTH, VIDEO_HEIGHT,
                              color1=(5, 5, 25), color2=(30, 5, 60))

    path = os.path.join(OUTPUT_DIR, "slide_00.png")
    bg.save(path, quality=95)
    return path


def build_video(script_data: dict, audio_path: str, output_path: str) -> str:
    """スクリプトと音声からクロスフェード付き動画を生成する。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sections = script_data.get("sections", [])
    title = script_data.get("title", "雑学まとめ")

    audio = AudioFileClip(audio_path)
    total_duration = audio.duration

    title_duration = 5.0
    section_duration = (total_duration - title_duration) / max(len(sections), 1)

    print(f"  動画生成中: {len(sections)}セクション, {total_duration:.0f}秒")

    clips = []

    # タイトルスライド
    title_path = create_title_slide()
    print(f"  タイトルスライド生成完了")
    clips.append(
        ImageClip(title_path)
        .with_duration(title_duration)
        .with_effects([vfx.FadeIn(FADE_DURATION)])
    )

    # セクションスライド
    for i, section in enumerate(sections, 1):
        heading = section.get("heading", "")
        image_prompt = f"Japanese trivia about {heading}, educational dramatic illustration"
        print(f"  スライド {i}/{len(sections)} 生成中: {heading}")
        slide_path = create_slide_image(heading, i, image_prompt)
        clip = (
            ImageClip(slide_path)
            .with_duration(section_duration)
            .with_effects([vfx.FadeIn(FADE_DURATION), vfx.FadeOut(FADE_DURATION)])
        )
        clips.append(clip)

    final = concatenate_videoclips(clips, method="compose")
    final = final.with_audio(audio)
    final = final.with_fps(VIDEO_FPS)

    final.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        bitrate="8000k",
        ffmpeg_params=["-crf", "18", "-preset", "medium"],
        logger=None,
    )

    for f in glob.glob(os.path.join(OUTPUT_DIR, "slide_*.png")):
        os.remove(f)

    print(f"  動画生成完了: {output_path}")
    return output_path
