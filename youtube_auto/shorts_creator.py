"""
YouTube Shorts用の縦型ショート動画を自動生成するモジュール
解像度: 1080x1920（縦型）、目標20〜35秒
- Ken Burns効果（ズーム・パン）
- Pexels フリー素材動画背景（APIキーがあれば優先使用）
- テキストアニメーション（字幕オーバーレイ）
"""
import os
import json
import random
import textwrap
from datetime import date
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import AudioFileClip, VideoClip, VideoFileClip, concatenate_videoclips
from moviepy import vfx
from openai import OpenAI
from config import OPENAI_API_KEY, OUTPUT_DIR, USE_SORA, SORA_MODEL, SORA_SECONDS
from image_utils import generate_dalle_bg, make_gradient_bg
import budget

client = OpenAI(api_key=OPENAI_API_KEY)

SHORTS_W = 1080
SHORTS_H = 1920
FONT_PATH = "/home/takah/.local/share/fonts/NotoSansCJKjp-Bold.otf"
FONT_PATH_FALLBACK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
MOTION_TYPES = ["zoom_in", "zoom_out", "pan_left", "pan_right", "diagonal_in", "diagonal_out"]


# ── テキストアニメーション ───────────────────────────────────────


def _get_font(size: int) -> ImageFont.FreeTypeFont:
    for path in [FONT_PATH, FONT_PATH_FALLBACK]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _flash_intro_clip(text: str, duration: float = 0.35) -> VideoClip:
    """冒頭0.3秒、白フラッシュ+黒文字で「オチ・衝撃ワード」を先出しする。
    バズるトリビア系Shortsは冒頭1〜2秒に視覚的なクライマックスを置く傾向が強く、
    通常のKen Burns開始より前にこのフラッシュを挟むことでスクロール停止率を上げる狙い。
    """
    text = (text or "").strip()
    if not text:
        return None
    font = _get_font(110 if len(text) <= 8 else 84)
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


def _render_subtitle_frame(text: str, alpha: float, w: int = SHORTS_W, h: int = SHORTS_H) -> np.ndarray:
    """字幕テキストをRGBA numpy配列として描画する（アウトライン + グラデーション背景付き）。"""
    font_main = _get_font(66)
    font_small = _get_font(52)
    font = font_main if len(text) <= 20 else font_small

    wrapped = textwrap.fill(text, width=15)
    lines = wrapped.split("\n")

    line_h = font.size + 16
    box_h = line_h * len(lines) + 48
    box_w = w - 60

    img = Image.new("RGBA", (w, box_h + 20), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # グラデーション背景バー（上部が少し明るい）
    bg_alpha = int(195 * alpha)
    for row in range(box_h):
        ratio = row / box_h
        brightness = int(25 * (1 - ratio))
        draw.line([(0, row), (box_w, row)],
                  fill=(brightness + 8, brightness + 8, brightness + 8, bg_alpha))
    draw.rounded_rectangle([0, 0, box_w, box_h - 1], radius=24,
                            fill=None, outline=(255, 255, 255, int(60 * alpha)), width=2)

    text_alpha = int(255 * alpha)
    stroke_w = 3
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        x = (box_w - tw) // 2
        y = 24 + i * line_h

        # 8方向アウトライン（黒）
        for dx, dy in [(-stroke_w, -stroke_w), (0, -stroke_w), (stroke_w, -stroke_w),
                       (-stroke_w, 0), (stroke_w, 0),
                       (-stroke_w, stroke_w), (0, stroke_w), (stroke_w, stroke_w)]:
            draw.text((x + dx, y + dy), line, font=font,
                      fill=(0, 0, 0, text_alpha))
        # 本文（白 + わずかに黄色がかる）
        draw.text((x, y), line, font=font, fill=(255, 252, 220, text_alpha))

    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    y_pos = h - box_h - 140
    x_pos = (w - box_w) // 2
    canvas.paste(img.crop((0, 0, box_w, box_h)), (x_pos, y_pos))
    return np.array(canvas)


def _split_script_to_scenes(script_data: dict, num_scenes: int) -> list[str]:
    """スクリプトをシーン数に合わせて分割する。"""
    hook = script_data.get("hook", "")
    body = script_data.get("body", "")
    outro = script_data.get("outro", "")

    if num_scenes == 1:
        return [hook]
    if num_scenes == 2:
        return [hook, outro]

    # 3シーン: hook / body前半 / body後半+outro
    mid = len(body) // 2
    split_pos = body.find("。", mid)
    if split_pos == -1:
        split_pos = mid
    else:
        split_pos += 1

    return [hook, body[:split_pos].strip(), (body[split_pos:] + outro).strip()]


# ── 字幕合成（カラオケ風・チャンク単位でテンポよく切り替え） ────────────


def _chunk_text(text: str, target_len: int = 9) -> list[str]:
    """字幕を読みやすい短いチャンク（目安9文字前後）に分割する。
    日本語は単語間にスペースがないため、句読点優先で区切り、無ければ固定長で分割する。
    プロ品質の字幕は「1〜2行の短いフレーズが高速に切り替わる」形式が主流のため、
    従来の段落ベタ表示から変更した。
    """
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
    """各チャンクの表示文字数に比例して表示時間を配分する（発話速度にほぼ比例）。"""
    total_chars = sum(len(c) for c in chunks) or 1
    windows = []
    t = 0.0
    for c in chunks:
        dur = max(0.25, total_duration * (len(c) / total_chars))
        windows.append((c, t, t + dur))
        t += dur
    return windows


def _composite_subtitle(frame: np.ndarray, subtitle_rgba: np.ndarray, t: float, duration: float) -> np.ndarray:
    """字幕チャンクを登場時ポップ（拡大→等倍）で合成する。
    以前はチャンクごとにアルファのフェードイン/アウトも行っていたが、チャンクが短い
    （0.3〜1.5秒程度）ため境界のたびに一瞬透明になり「チカチカ消える」不具合になっていた。
    シーン自体のフェードは呼び出し側のKen Burnsクリップに既にかかっているため、
    チャンク単位では不透明のまま切り替え、ポップだけで登場感を出す。
    """
    overlay = subtitle_rgba.copy()
    ov = Image.fromarray(overlay, "RGBA")

    pop_dur = min(0.1, duration * 0.3)
    if pop_dur > 0 and t < pop_dur:
        scale_pop = 0.75 + 0.25 * (t / pop_dur)
        ys, xs = np.nonzero(overlay[:, :, 3])
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
    """字幕テキストをチャンク分割し、各チャンクのRGBA画像と表示区間をまとめて返す。"""
    chunks = _chunk_text(subtitle_text)
    if not chunks:
        return []
    windows = _chunk_windows(chunks, duration)
    return [(_render_subtitle_frame(c, 1.0), start, end) for c, start, end in windows]


def _apply_chunk_subtitles(frame: np.ndarray, chunk_cache: list, t: float) -> np.ndarray:
    """現在時刻tに該当する字幕チャンクを合成する。"""
    if not chunk_cache:
        return frame
    for rgba, start, end in chunk_cache:
        is_last = (start, end) == (chunk_cache[-1][1], chunk_cache[-1][2])
        if start <= t < end or (is_last and t >= end):
            return _composite_subtitle(frame, rgba, t - start, end - start)
    return frame


def _ease_in_out(p: float) -> float:
    """滑らかな加減速カーブ（線形移動だと機械的で安っぽく見えるため）。"""
    p = max(0.0, min(1.0, p))
    return p * p * (3 - 2 * p)


# ── Ken Burns効果 ──────────────────────────────────────────────


def ken_burns_clip(image_path: str, duration: float, motion_type: str = None,
                   subtitle_text: str = "") -> VideoClip:
    """Ken Burns効果＋テキストアニメーション付きビデオクリップを生成する。"""
    if motion_type is None:
        motion_type = random.choice(MOTION_TYPES)

    img = Image.open(image_path).convert("RGB").resize((SHORTS_W, SHORTS_H), Image.LANCZOS)
    img_arr = np.array(img)

    # 字幕をチャンク単位（カラオケ風）でキャッシュ
    chunk_cache = _render_chunk_cache(subtitle_text, duration)

    def make_frame(t):
        progress = _ease_in_out(t / max(duration, 0.001))

        if motion_type == "zoom_in":
            scale, ox, oy = 1.0 + 0.32 * progress, 0.5, 0.5
        elif motion_type == "zoom_out":
            scale, ox, oy = 1.32 - 0.32 * progress, 0.5, 0.5
        elif motion_type == "pan_left":
            scale, ox, oy = 1.22, 0.3 + 0.7 * progress, 0.5
        elif motion_type == "pan_right":
            scale, ox, oy = 1.22, 1.0 - 0.7 * progress, 0.5
        elif motion_type == "diagonal_in":
            scale = 1.0 + 0.26 * progress
            ox, oy = 0.25 + 0.25 * progress, 0.25 + 0.25 * progress
        else:  # diagonal_out
            scale = 1.26 - 0.26 * progress
            ox, oy = 0.75 - 0.25 * progress, 0.75 - 0.25 * progress

        new_w = int(SHORTS_W * scale)
        new_h = int(SHORTS_H * scale)
        resized = np.array(Image.fromarray(img_arr).resize((new_w, new_h), Image.LANCZOS))
        x = max(0, min(int((new_w - SHORTS_W) * ox), new_w - SHORTS_W))
        y = max(0, min(int((new_h - SHORTS_H) * oy), new_h - SHORTS_H))
        frame = resized[y:y + SHORTS_H, x:x + SHORTS_W].copy()

        # カラオケ風チャンク字幕（短いフレーズがテンポよく切り替わる）
        frame = _apply_chunk_subtitles(frame, chunk_cache, t)

        return frame

    return VideoClip(make_frame, duration=duration)


# ── Sora動画クリップ（冒頭シーンのみ・コスト重視でトライ→失敗時は静止画にフォールバック）──


def _generate_sora_video(prompt: str) -> str | None:
    """Sora 2 で短い動画クリップを生成し、ローカルmp4のパスを返す（失敗時はNone）。"""
    if not USE_SORA:
        return None
    try:
        full_prompt = (
            f"{prompt}. Photorealistic cinematic video, natural human motion, "
            "subtle handheld camera movement, realistic lighting, vertical 9:16 framing, "
            "no text, no captions, no watermark."
        )
        video = client.videos.create_and_poll(
            model=SORA_MODEL,
            prompt=full_prompt,
            seconds=SORA_SECONDS,
            size="720x1280",
        )
        if getattr(video, "status", None) != "completed":
            print(f"  ⚠️  Sora生成が完了しませんでした（status={getattr(video, 'status', None)}）")
            return None
        content = client.videos.download_content(video.id, variant="video")
        path = os.path.join(OUTPUT_DIR, f"sora_clip_{video.id}.mp4")
        content.write_to_file(path)
        budget.add_cost(budget.COST_SORA_PER_SEC * float(SORA_SECONDS))
        return path
    except Exception as e:
        print(f"  ⚠️  Sora生成スキップ: {e}")
        return None


def _sora_bg_clip(sora_path: str, duration: float, subtitle_text: str = "") -> VideoClip:
    """Sora動画クリップを目標尺に合わせてループ/トリムし、字幕を合成したクリップを返す。"""
    raw = VideoFileClip(sora_path).resized((SHORTS_W, SHORTS_H))

    if raw.duration < duration:
        loops = int(duration / raw.duration) + 1
        from moviepy import concatenate_videoclips as cv
        raw = cv([raw] * loops).subclipped(0, duration)
    else:
        raw = raw.subclipped(0, duration)

    if not subtitle_text:
        return raw

    chunk_cache = _render_chunk_cache(subtitle_text, duration)

    def add_subtitle(get_frame, t):
        frame = get_frame(t).copy()
        return _apply_chunk_subtitles(frame, chunk_cache, t)

    return raw.transform(add_subtitle, apply_to="video")


# ── Pexels背景動画 ─────────────────────────────────────────────


def _pexels_bg_clip(stock_path: str, duration: float, subtitle_text: str = "") -> VideoClip:
    """Pexels素材を縦型にクロップし字幕を合成したクリップを返す。"""
    raw = VideoFileClip(stock_path)

    # 縦型クロップ: 9:16になるようにセンタークロップ
    src_w, src_h = raw.size
    target_w = int(src_h * 9 / 16)
    if target_w <= src_w:
        x1 = (src_w - target_w) // 2
        raw = raw.cropped(x1=x1, x2=x1 + target_w)
    raw = raw.resized((SHORTS_W, SHORTS_H))

    # ループして必要尺を確保
    if raw.duration < duration:
        loops = int(duration / raw.duration) + 1
        from moviepy import concatenate_videoclips as cv
        raw = cv([raw] * loops).subclipped(0, duration)
    else:
        raw = raw.subclipped(0, duration)

    if not subtitle_text:
        return raw

    chunk_cache = _render_chunk_cache(subtitle_text, duration)

    def add_subtitle(get_frame, t):
        frame = get_frame(t).copy()
        return _apply_chunk_subtitles(frame, chunk_cache, t)

    return raw.transform(add_subtitle, apply_to="video")


# ── スクリプト生成 ─────────────────────────────────────────────


def _load_strategy() -> dict:
    """strategy.json から今日の戦略を読み込む。"""
    try:
        from strategy import load_strategy
        return load_strategy()
    except Exception:
        return {}


# バズ実績に基づいたジャンルローテーション（視聴数順）
# relevance_hint: 視聴者自身の人生・日常に引きつける一言。実績データを見ると、
# 恋愛心理学など「自分ごと化」しやすいジャンルは平均視聴数が高く（1000〜2000再生台が多発）、
# 純粋な雑学・歴史ネタは同じ「衝撃」演出でも視聴数のばらつきが大きく低迷しがちだったため、
# personal relevance を明示的にプロンプトへ足す
PROVEN_GENRES = [
    {
        "genre": "love_psychology",
        "theme": "恋愛心理学・脳科学",
        "desc": "恋愛初期のドキドキ・惚れる仕組み・モテる心理など、恋愛に関する脳科学・心理学の衝撃事実",
        "title_prefix": "知らなきゃ損！恋愛の",
        "pexels": "romantic couple heart",
    },
    {
        "genre": "history",
        "theme": "歴史の衝撃的な真実",
        "desc": "教科書に載らない日本史・世界史の驚愕事実。戦国時代・江戸時代・歴史上の偉人の意外な一面",
        "title_prefix": "【衝撃】歴史の",
        "pexels": "ancient history samurai",
        "relevance_hint": "遠い昔の話で終わらせず、「実は今の私たちの常識・習慣にも繋がっている」と一言で結びつける",
    },
    {
        "genre": "animal",
        "theme": "動物・生物の驚き",
        "desc": "コアラの驚く事実・深海生物の能力・動物の信じられない行動など、知られざる生物の秘密",
        "title_prefix": "え？マジで？",
        "pexels": "wildlife nature animal",
        "relevance_hint": "単なる豆知識で終わらせず、「これを知ると人間である自分の見方がどう変わるか」に一言触れる",
    },
    {
        "genre": "human_body",
        "theme": "人体の不思議",
        "desc": "人間の体に隠された驚くべき機能・脳の限界・健康の常識が実は嘘だった事実",
        "title_prefix": "え？マジで？人体の",
        "pexels": "human body science",
    },
    {
        "genre": "school_truth",
        "theme": "学校で教えない真実",
        "desc": "学校・教科書では絶対教えてくれなかった日本・世界の常識を覆す衝撃事実",
        "title_prefix": "【衝撃】学校で",
        "pexels": "knowledge truth shocking",
        "relevance_hint": "「なぜ学校教育では教えられなかったのか」に触れ、視聴者自身が損してきたと感じさせる",
    },
    {
        "genre": "space",
        "theme": "宇宙の衝撃事実（具体的）",
        "desc": "ブラックホール・宇宙の終わり・宇宙人の可能性など、具体的な天体・宇宙の驚愕事実（汎用的な「宇宙の謎」は禁止）",
        "title_prefix": "知ってた？宇宙の",
        "pexels": "space galaxy cosmos",
        "relevance_hint": "壮大な話で終わらせず、「この事実を知った今日から夜空の見方がどう変わるか」など視聴者自身の体験に引きつける",
    },
    {
        "genre": "psychology",
        "theme": "心理学・行動経済学",
        "desc": "99%の人が知らない人間の心理の盲点・操作されている無意識の行動・行動経済学の法則",
        "title_prefix": "【衝撃】心理学が証明！",
        "pexels": "psychology mind brain",
    },
    {
        "genre": "japan_mystery",
        "theme": "日本の知られざる秘密",
        "desc": "日本にしかない文化・制度・習慣の意外な理由。日本人でも知らない日本の常識",
        "title_prefix": "日本人なのに知らない！",
        "pexels": "japan tokyo traditional",
        "relevance_hint": "視聴者自身が普段何気なく接しているものだと気づかせ、「あなたも今日から見え方が変わる」と結ぶ",
    },
    {
        "genre": "food_trivia",
        "theme": "食べ物・グルメの衝撃雑学",
        "desc": "身近な食べ物・飲み物・コンビニ商品に隠された知られざる歴史や科学的な事実",
        "title_prefix": "え？マジで？食べ物の",
        "pexels": "food cooking delicious",
        "relevance_hint": "「次にそれを食べる/飲む時に見え方がどう変わるか」に触れて自分ごと化する",
    },
    {
        "genre": "money_trivia",
        "theme": "お金・経済の衝撃雑学",
        "desc": "お金の歴史・経済の仕組み・億万長者の意外な習慣など、知らないと損するお金にまつわる衝撃事実",
        "title_prefix": "知らなきゃ損！お金の",
        "pexels": "money finance wealth",
    },
    {
        "genre": "mystery_legend",
        "theme": "都市伝説・世界のミステリー",
        "desc": "世界各地の都市伝説・未解明現象・古代の謎に隠された衝撃的な事実（実在の事件の被害者・関係者を扱う扇情的な内容は禁止）",
        "title_prefix": "【衝撃】世界のミステリー、",
        "pexels": "mystery fog night",
    },
    {
        "genre": "tech_trivia",
        "theme": "テクノロジー・AIの衝撃雑学",
        "desc": "AI・スマホ・インターネットの裏側にある知られざる事実。身近なテクノロジーの意外な起源や仕組み",
        "title_prefix": "知ってた？テクノロジーの",
        "pexels": "technology computer digital",
        "relevance_hint": "普段使っているスマホやAIが実は今日の話とどう繋がるかに触れる",
    },
    {
        "genre": "world_geography",
        "theme": "世界の国々の意外な事実",
        "desc": "世界各国の変わった法律・文化・地理にまつわる驚きの事実。日本人が知らない世界の常識",
        "title_prefix": "世界には、",
        "pexels": "world travel countries",
        "relevance_hint": "日本の当たり前と比較し、視聴者自身の常識がどう覆るかに触れる",
    },
]

# 実績データに基づく重み付け（平均視聴数が高いジャンルほど出現頻度を上げる）。
# ジャンル数を増やした分、上位ジャンルの比重は以前より抑えて偏りすぎないようにしている。
# 0にはせず全ジャンルが一定頻度で出るようにし、内容の偏りは avoid_titles で別途防ぐ
GENRE_WEIGHTS = {
    "love_psychology": 2,
    "psychology": 2,
    "human_body": 2,
}
# ラウンドロビンで並べる（同じジャンルをまとめて並べると、1日1本投稿の場合に
# 2日連続で同じジャンルになりやすいため、重複分はできるだけ間隔を空けて配置する）
_max_weight = max(GENRE_WEIGHTS.get(cfg["genre"], 1) for cfg in PROVEN_GENRES)
WEIGHTED_GENRE_SEQUENCE = [
    cfg
    for round_i in range(_max_weight)
    for cfg in PROVEN_GENRES
    if round_i < GENRE_WEIGHTS.get(cfg["genre"], 1)
]

# 使用済みトピック追跡ファイル
USED_TOPICS_FILE = os.path.join(
    os.path.dirname(__file__), "data", "used_short_topics.json"
)

# ジャンルごとの直近タイトル追跡ファイル（同じジャンルが連続した際の切り口重複を防ぐ）
USED_TITLES_BY_GENRE_FILE = os.path.join(
    os.path.dirname(__file__), "data", "used_titles_by_genre.json"
)
TITLES_PER_GENRE_KEPT = 8


def _load_used_topics() -> set:
    if os.path.exists(USED_TOPICS_FILE):
        with open(USED_TOPICS_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def _save_used_topic(topic: str):
    used = _load_used_topics()
    used.add(topic)
    # 最大200件保持
    used_list = list(used)[-200:]
    os.makedirs(os.path.dirname(USED_TOPICS_FILE), exist_ok=True)
    with open(USED_TOPICS_FILE, "w", encoding="utf-8") as f:
        json.dump(used_list, f, ensure_ascii=False)


def _load_genre_titles() -> dict:
    if os.path.exists(USED_TITLES_BY_GENRE_FILE):
        with open(USED_TITLES_BY_GENRE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_genre_title(genre: str, title: str):
    data = _load_genre_titles()
    lst = data.get(genre, [])
    lst.append(title)
    data[genre] = lst[-TITLES_PER_GENRE_KEPT:]
    os.makedirs(os.path.dirname(USED_TITLES_BY_GENRE_FILE), exist_ok=True)
    with open(USED_TITLES_BY_GENRE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def generate_shorts_script(topics: list[str], slot: int = 1) -> dict:
    """20〜35秒ショート用スクリプトを生成する。バズ実績ジャンルを強制ローテーション。

    ジャンルは「日付 + スロット番号」から決定論的に算出する（ファイルに保存した
    ローテーション状態には依存しない）。GitHub Actions は毎回まっさらな環境で実行され、
    data/ 以下は .gitignore 対象で実行間で引き継がれないため、状態ファイル方式だと
    毎回インデックス0＝同じジャンルに固定されてしまう不具合があった。
    """
    day_offset = date.today().toordinal() % len(WEIGHTED_GENRE_SEQUENCE)
    genre_idx = (day_offset + (slot - 1)) % len(WEIGHTED_GENRE_SEQUENCE)
    genre_cfg = WEIGHTED_GENRE_SEQUENCE[genre_idx]

    # 使用済みトピックを除外してユニークな題材を確保
    used = _load_used_topics()
    fresh_topics = [t for t in topics if t not in used]
    topic_list_src = fresh_topics[:3] if fresh_topics else topics[:3]
    topic_list = "\n".join(f"- {t}" for t in topic_list_src)

    # 戦略・アナリティクスヒント
    strategy = _load_strategy()
    top_hooks = strategy.get("hook_templates", [])
    avoid_patterns = strategy.get("avoid_patterns", [])

    strategy_hint = ""
    if top_hooks:
        strategy_hint = "\n【実績あり・参考フックパターン（これを超える表現で）】\n"
        strategy_hint += "\n".join(f'- 「{h}」' for h in top_hooks[:3])
    if avoid_patterns:
        strategy_hint += "\n【NGパターン（絶対に使わない）】\n"
        strategy_hint += "\n".join(f"- {p}" for p in avoid_patterns[:3])

    relevance_hint = genre_cfg.get("relevance_hint", "")
    if relevance_hint:
        strategy_hint += f"\n【自分ごと化のコツ（視聴維持率に直結・必ず入れる）】\n- {relevance_hint}"

    # フック書き出しバリエーション（"知ってた？"と"え？"の独占を防ぐ）
    hook_starters = [
        "ちょっと待って！",
        "これ、マジでヤバい。",
        "信じられないんだけど、",
        "実は全部嘘だった。",
        "絶対知らないでしょ？",
        "これ知ったら人生変わる。",
        "学校で教えてくれなかった、",
        "99%の人が勘違いしてる。",
    ]
    hook_starter = random.choice(hook_starters)

    # 本文中盤の「二段目フック」例（単一の固定フレーズだとGPTが毎回同じ文言をコピーしてしまうため複数用意）
    mini_hook_examples = [
        "え、実はここからが本題で",
        "ここだけの話、本当にヤバいのは",
        "でも実際に効くのはここから",
        "多くの人が見落とすのがここで",
        "ここでようやく核心なんですが",
    ]
    mini_hook_example = random.choice(mini_hook_examples)

    # 同じジャンルの直近タイトルを除外リストとして提示（連日同ジャンルが続いた場合の量産防止）
    recent_titles = _load_genre_titles().get(genre_cfg["genre"], [])
    avoid_titles_hint = ""
    if recent_titles:
        avoid_titles_hint = (
            "\n【このジャンルで直近使用済みのタイトル（同じ切り口・似た言い回しは絶対に避けること）】\n"
            + "\n".join(f"- {t}" for t in recent_titles)
        )

    prompt = f"""あなたはTikTok・YouTube Shortsで毎回100万再生を出すトップバズクリエイターです。

【今回のジャンル】{genre_cfg['theme']}
【ジャンル詳細】{genre_cfg['desc']}
【参考トピック（1つ選ぶか、より面白いアイデアに昇華してよい）】
{topic_list}
{strategy_hint}
{avoid_titles_hint}

【冒頭フックの書き出し（必ずこの言葉から始める）】「{hook_starter}」

【絶対に守るバズShortsの法則（2026年のShortsアルゴリズムは20〜35秒・完視聴率80%超の動画を最優先で拡散する）】
1. フック（hook）: 「{hook_starter}」から始め、40文字以内で視聴者を最初の3秒で止める。「〇〇が実は〇〇だった」「え？これ常識じゃなかったの？」「知らないと一生損する」など数字や断言を使った強烈な反転を使う
2. 本文（body）: 90〜130文字。要点を1つだけに絞り、ダラダラ説明しない。「事実の提示 → 驚きの深掘り」で完結させる。本文の中盤あたりに「{mini_hook_example}」のような（丸写しではなく自分の言葉で作った）二段目のミニフックを1つ挟んで離脱を防ぐ
3. 締め（outro）: 35文字以内。「保存して後で見返してね！」「友達にもシェアして教えてあげて！」など"保存・シェア"を促す一言を必ず入れる（コメントより保存・シェアの方がアルゴリズム評価が高い）。可能なら冒頭フックに軽く触れてループ再生を誘発する終わり方にする
4. タイトル: 「{genre_cfg['title_prefix']}」を活かしつつ、クリックせずにはいられない具体的なタイトル（25文字以内・#Shorts含む）。直近使用済みタイトルと似た表現・似たテーマの使い回しは禁止
5. 汎用的・抽象的なテーマ（「宇宙の謎」「動物の秘密」など）は禁止。必ず具体的な1つの事実を深掘りする
6. 動画全体は20〜35秒でテンポよく完結させる設計にすること。長々と話さず、要点を凝縮する
7. flash_text: この動画で一番衝撃的な「オチ」を6〜8文字程度の超短フレーズで先出しする（例:「脳が9割嘘」「記憶は毎回捏造」）。動画冒頭0.3秒に白フラッシュで一瞬だけ表示し、視聴者の指を止めるために使う

以下のJSON形式で出力:
{{
  "title": "タイトル（25文字以内、#Shorts含む、具体的で強烈）",
  "hook": "冒頭フック（「{hook_starter}」から始める・40文字以内）",
  "body": "本文（90〜130文字・中盤に二段目のミニフックを含める）",
  "outro": "締め（35文字以内・保存＋シェア訴求＋ループ誘発）",
  "full_text": "hook＋body＋outroを全部まとめた全文（160〜220文字程度・省略禁止）",
  "main_topic": "このShortsのメインテーマ（20文字以内・重複防止用）",
  "flash_text": "冒頭フラッシュ用の超短い衝撃ワード（6〜8文字程度）",
  "image_prompts": [
    "Scene 1 photo prompt: photorealistic photograph, dramatic real-world scene, vertical 9:16, natural lighting, no text (40 words)",
    "Scene 2 photo prompt: photorealistic close-up photograph, vertical 9:16, shallow depth of field, no text (40 words)",
    "Scene 3 photo prompt: photorealistic photograph, emotional reveal, vertical 9:16, natural atmosphere, no text (40 words)"
  ],
  "pexels_keywords": "{genre_cfg['pexels']}"
}}"""

    for attempt in range(3):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=1600,
        )
        data = json.loads(response.choices[0].message.content)

        full_text = data.get("full_text", "")
        if len(full_text) < 140:
            full_text = "\n\n".join(filter(None, [
                data.get("hook", ""),
                data.get("body", ""),
                data.get("outro", ""),
            ]))
            data["full_text"] = full_text

        if 140 <= len(full_text) <= 260:
            break
        if attempt < 2:
            print(f"  ⚠️  台本の尺が目標範囲外です（{len(full_text)}文字）。再生成中（{attempt + 2}/3）...")

    # 使用トピックを記録（重複防止）
    main_topic = data.get("main_topic", data.get("title", ""))
    if main_topic:
        _save_used_topic(main_topic)
    if data.get("title"):
        _save_genre_title(genre_cfg["genre"], data["title"])

    print(f"  Shortsスクリプト生成完了 [{genre_cfg['theme']}]: 「{data['title']}」({len(data.get('full_text', ''))}文字)")
    return data


def create_shorts_slide(slide_num: int, image_prompt: str = "") -> str:
    """DALL-E 3 背景のみの縦型スライド画像を生成する（テキストなし）。"""
    print(f"  DALL-E 画像生成中（シーン{slide_num + 1}）...")
    bg = generate_dalle_bg(image_prompt, SHORTS_W, SHORTS_H, brightness=1.0, blur_radius=0)
    if bg is None:
        bg = make_gradient_bg(SHORTS_W, SHORTS_H, color1=(10, 10, 40), color2=(60, 10, 80))
    path = os.path.join(OUTPUT_DIR, f"shorts_slide_{slide_num:02d}.png")
    bg.save(path)
    return path


# ── メイン動画生成 ─────────────────────────────────────────────


def build_shorts_video(script_data: dict, audio_path: str, output_path: str) -> str:
    """Shorts動画を生成する（Pexels背景 or Ken Burns + 字幕アニメーション）。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    audio = AudioFileClip(audio_path)
    total_duration = max(audio.duration, 20.0)

    image_prompts = script_data.get("image_prompts")
    if not image_prompts:
        fallback = script_data.get("image_prompt", script_data.get("hook", "dramatic cinematic scene"))
        image_prompts = [fallback, fallback, fallback]

    num_scenes = len(image_prompts)
    section_duration = total_duration / num_scenes
    subtitles = _split_script_to_scenes(script_data, num_scenes)

    # ── Pexels素材を試みる ──────────────────────────────────────
    stock_path = None
    try:
        from stock_video import get_stock_video
        pexels_kw = script_data.get("pexels_keywords", "")
        if pexels_kw:
            script_data_with_kw = dict(script_data)
        stock_path = get_stock_video(script_data)
        if stock_path:
            print(f"  Pexels素材を使用: {os.path.basename(stock_path)}")
    except Exception as e:
        print(f"  ⚠️  Pexels取得スキップ: {e}")

    clips = []
    motions = random.sample(MOTION_TYPES, min(num_scenes, len(MOTION_TYPES)))

    for i in range(num_scenes):
        sub_text = subtitles[i] if i < len(subtitles) else ""
        motion = motions[i % len(motions)]
        clip = None

        # 冒頭シーンのみSora 2で実際に動く映像を試みる（コスト重視で1シーンだけ・失敗時は下にフォールバック）
        if i == 0 and USE_SORA:
            print("  Sora動画クリップを生成中（冒頭シーン、数分かかることがあります）...")
            sora_path = _generate_sora_video(image_prompts[i])
            if sora_path:
                print(f"  Sora背景 + 字幕生成中（シーン{i + 1}）...")
                clip = _sora_bg_clip(sora_path, section_duration, subtitle_text=sub_text)

        if clip is None and stock_path:
            # Pexels素材を等分してシーンごとに使う
            print(f"  Pexels背景 + 字幕生成中（シーン{i + 1}）...")
            clip = _pexels_bg_clip(stock_path, section_duration, subtitle_text=sub_text)
        elif clip is None:
            # DALL-E + Ken Burns
            img_path = create_shorts_slide(i, image_prompt=image_prompts[i])
            print(f"  Ken Burns効果 + 字幕適用中（シーン{i + 1}: {motion}）...")
            clip = ken_burns_clip(img_path, section_duration,
                                  motion_type=motion, subtitle_text=sub_text)
            clip = clip.with_effects([vfx.FadeIn(0.4), vfx.FadeOut(0.4)])

        clips.append(clip)

    # 冒頭の衝撃フラッシュ（あれば先頭に挿入。音声はその分だけ無音を前に足して同期させる）
    flash_clip = _flash_intro_clip(script_data.get("flash_text", ""))
    flash_dur = flash_clip.duration if flash_clip else 0.0
    all_clips = ([flash_clip] if flash_clip else []) + clips

    final = concatenate_videoclips(all_clips, method="compose")

    from moviepy import concatenate_audioclips, AudioClip
    audio_parts = []
    if flash_dur > 0:
        audio_parts.append(AudioClip(lambda t: [0, 0], duration=flash_dur, fps=44100))
    audio_parts.append(audio if audio.duration <= total_duration else audio.subclipped(0, total_duration))
    if audio.duration < total_duration:
        audio_parts.append(AudioClip(lambda t: [0, 0], duration=total_duration - audio.duration, fps=44100))
    final = final.with_audio(concatenate_audioclips(audio_parts))

    final = final.with_fps(30)
    final.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        bitrate="8000k",
        ffmpeg_params=["-crf", "20", "-preset", "medium"],
        logger=None,
    )

    import glob
    for f in glob.glob(os.path.join(OUTPUT_DIR, "shorts_slide_*.png")):
        os.remove(f)
    for f in glob.glob(os.path.join(OUTPUT_DIR, "sora_clip_*.mp4")):
        os.remove(f)

    mode = "Pexels背景" if stock_path else "Ken Burns"
    print(f"  Shorts動画生成完了（{mode} + 字幕アニメーション）: {output_path}")
    return output_path
