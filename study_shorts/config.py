import os

def _load_env():
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

_load_env()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# YouTube設定
YOUTUBE_CHANNEL_ID         = os.environ.get("STUDY_YOUTUBE_CHANNEL_ID", "")
YOUTUBE_API_KEY            = os.environ.get("YOUTUBE_API_KEY", "")
YOUTUBE_CLIENT_SECRET_FILE = os.path.join(os.path.dirname(__file__), "client_secret.json")
YOUTUBE_TOKEN_FILE         = os.path.join(os.path.dirname(__file__), "token.json")

# 宣伝URL
STUDYFLOW_URL = "https://study-tracker-2znl.onrender.com/"

# ショート動画設定（2026年のShortsアルゴリズムは20〜35秒・完視聴率重視のため短尺化）
SHORTS_TARGET_SECONDS = 32
DAILY_POST_COUNT      = 5

# コンテンツジャンル
CONTENT_GENRES = [
    "study_tips",      # 勉強法・学習Tips
    "memory_hacks",    # 記憶術・暗記法
    "study_science",   # 学習科学・研究データ
    "concentration",   # 集中力・作業効率UP
    "exam_strategy",   # 試験対策・資格勉強法
]

# ファイルパス
BASE_DIR   = os.path.dirname(__file__)
DATA_DIR   = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

# 動画スペック（縦型 Shorts 9:16）
VIDEO_WIDTH  = 1080
VIDEO_HEIGHT = 1920
VIDEO_FPS    = 30

# フォント
FONT_BOLD     = "/home/takah/.local/share/fonts/NotoSansCJKjp-Bold.otf"
FONT_REG      = "/home/takah/.local/share/fonts/NotoSansCJKjp-Regular.otf"
FONT_FALLBACK = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# カラーテーマ（StudyFlow のインディゴ×パープル）
BG_COLOR_TOP    = (8,  13,  26)     # 濃い紺
BG_COLOR_BOTTOM = (30, 20,  60)     # 深い紫
TITLE_COLOR     = (180, 185, 255)   # 薄いインディゴ
ACCENT_COLOR    = (99,  102, 241)   # インディゴ
TEXT_COLOR      = (240, 242, 255)   # ほぼ白
HOT_COLOR       = (255, 90, 60)     # 衝撃バッジ用ホットレッド
GOLD_COLOR      = (255, 210, 60)    # 強調テキスト用ゴールド

# gpt-image-1 画像生成（Trueにすると画質が大幅向上するがAPIコストが増加する。旧dall-e-3はAPI廃止済み）
# 1本のShortsで2枚生成
USE_DALLE = True
DALLE_QUALITY = "medium"
