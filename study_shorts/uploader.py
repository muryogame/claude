"""
YouTube動画アップロードモジュール（study_shorts チャンネル用）
OAuth 2.0 認証を使って動画を投稿する
"""
import os
import json
from datetime import datetime
from config import YOUTUBE_CLIENT_SECRET_FILE, YOUTUBE_TOKEN_FILE, STUDYFLOW_URL

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]

CHANNEL_NAME = "学習効率化チャンネル StudyFlow"


def get_authenticated_service():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    creds = None

    token_json_env = os.environ.get("YOUTUBE_TOKEN_JSON")
    if token_json_env:
        creds = Credentials.from_authorized_user_info(json.loads(token_json_env), SCOPES)
    elif os.path.exists(YOUTUBE_TOKEN_FILE):
        with open(YOUTUBE_TOKEN_FILE, "r", encoding="utf-8") as f:
            creds = Credentials.from_authorized_user_info(json.load(f), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            _save_token(creds)
        else:
            client_secret_env = os.environ.get("YOUTUBE_CLIENT_SECRET_JSON")
            if client_secret_env and not os.path.exists(YOUTUBE_CLIENT_SECRET_FILE):
                with open(YOUTUBE_CLIENT_SECRET_FILE, "w", encoding="utf-8") as f:
                    f.write(client_secret_env)

            if not os.path.exists(YOUTUBE_CLIENT_SECRET_FILE):
                raise FileNotFoundError(
                    f"client_secret.json が見つかりません: {YOUTUBE_CLIENT_SECRET_FILE}\n"
                    "Google Cloud Console からOAuth 2.0認証情報をダウンロードして配置してください。"
                )
            flow = InstalledAppFlow.from_client_secrets_file(
                YOUTUBE_CLIENT_SECRET_FILE, SCOPES
            )
            try:
                creds = flow.run_local_server(port=8081)
            except Exception:
                creds = flow.run_console()
            _save_token(creds)

    return build("youtube", "v3", credentials=creds)


def _save_token(creds):
    token_data = json.loads(creds.to_json())
    with open(YOUTUBE_TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(token_data, f, ensure_ascii=False, indent=2)
    print(f"  トークンを保存しました: {YOUTUBE_TOKEN_FILE}")


def _build_description(script_data: dict) -> str:
    hook  = script_data.get("hook",  "")
    body  = script_data.get("body",  "")
    cta   = script_data.get("cta",   "")
    genre = script_data.get("genre_label", "学習Tips")
    tags  = " ".join(f"#{t}" for t in script_data.get("tags", []))

    return f"""📚 {genre} — 毎日の学習に役立つTipsをお届け！

{hook}

{body}

{cta}

━━━━━━━━━━━━━━━━━━━━━
⏱️ 学習時間の記録には無料アプリ【StudyFlow】が便利！
タッチひとつで学習時間を計測・カレンダーで記録できます。
👉 {STUDYFLOW_URL}
━━━━━━━━━━━━━━━━━━━━━

📅 毎日 7:00 / 10:00 / 13:00 / 17:00 / 21:00 投稿

{tags}
#勉強法 #学習Tips #Shorts

投稿日時: {datetime.now().strftime('%Y年%m月%d日')}"""


def _genre_tags(genre: str) -> list[str]:
    base = ["Shorts", "勉強法", "学習Tips", "StudyFlow", "AI生成"]
    extra = {
        "study_tips":    ["効率学習", "勉強習慣", "学習法", "自己成長", "生産性向上"],
        "memory_hacks":  ["記憶術", "暗記法", "記憶力UP", "試験対策", "脳トレ"],
        "study_science": ["学習科学", "脳科学", "認知科学", "科学的勉強法", "記憶の科学"],
        "concentration": ["集中力", "フロー状態", "深い作業", "生産性", "ディープワーク"],
        "exam_strategy": ["試験対策", "資格勉強", "受験", "合格法", "過去問"],
    }
    return base + extra.get(genre, [])


def upload_shorts(video_path: str, thumbnail_path: str, script_data: dict) -> tuple[str, str]:
    from googleapiclient.http import MediaFileUpload

    title = script_data.get("title", "効率的な勉強法")
    if "#Shorts" not in title:
        title += " #Shorts"

    genre       = script_data.get("genre", "study_tips")
    description = _build_description(script_data)
    tags        = _genre_tags(genre)

    print(f"  Shorts アップロード中: 「{title}」")
    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title":           title[:100],
            "description":     description[:5000],
            "tags":            tags,
            "categoryId":      "27",   # Education
            "defaultLanguage": "ja",
        },
        "status": {
            "privacyStatus":           "public",
            "selfDeclaredMadeForKids": False,
        },
    }

    media   = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True)
    request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  アップロード進捗: {int(status.progress() * 100)}%")

    video_id = response["id"]

    if thumbnail_path and os.path.exists(thumbnail_path):
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(thumbnail_path),
            ).execute()
            print("  サムネイルをアップロードしました。")
        except Exception as e:
            print(f"  ⚠️  サムネイル設定スキップ: {e}")

    url = f"https://www.youtube.com/shorts/{video_id}"
    print(f"  Shorts完了: {url}")
    return url, video_id


def upload_bgm(video_path: str, date_str: str) -> tuple[str, str]:
    """30分 集中BGM 動画を通常動画としてアップロードする。"""
    from googleapiclient.http import MediaFileUpload

    title = f"【30分 集中BGM】勉強・作業用 アルファ波バイノーラルビート {date_str}"
    description = f"""📚 勉強・作業・読書に最適な30分間の集中BGMです。

🎧 バイノーラルビートについて
・アルファ波（12Hz）を使用した科学的アプローチ
・左耳440Hz / 右耳452Hz の差分がアルファ波を誘発
・集中力・リラックス・学習効率UPに効果的
・イヤフォン・ヘッドフォンでお聴きください

⏱️ タイムライン
00:00 フェードイン
00:30 集中モード突入
29:30 フェードアウト

━━━━━━━━━━━━━━━━━━━━━
⏱️ 学習時間の記録には無料アプリ【StudyFlow】が便利！
👉 {STUDYFLOW_URL}
━━━━━━━━━━━━━━━━━━━━━

📅 毎日 7:00 / 10:00 / 13:00 / 17:00 / 21:00 ショート動画も投稿中！

#集中BGM #勉強BGM #作業用BGM #バイノーラルビート #アルファ波
#StudyFlow #勉強法 #集中力 #受験勉強 #資格勉強

投稿日: {date_str}"""

    tags = [
        "集中BGM", "勉強BGM", "作業用BGM", "バイノーラルビート", "アルファ波",
        "StudyFlow", "勉強法", "集中力", "受験勉強", "資格勉強",
        "lofi", "study music", "focus music", "binaural beats",
    ]

    print(f"  BGM動画アップロード中: 「{title}」")
    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title":           title[:100],
            "description":     description[:5000],
            "tags":            tags,
            "categoryId":      "27",   # Education
            "defaultLanguage": "ja",
        },
        "status": {
            "privacyStatus":           "public",
            "selfDeclaredMadeForKids": False,
        },
    }

    media   = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True, chunksize=10 * 1024 * 1024)
    request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  アップロード進捗: {int(status.progress() * 100)}%")

    video_id = response["id"]
    url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"  BGM動画完了: {url}")
    return url, video_id


def check_credentials_ready() -> bool:
    return os.path.exists(YOUTUBE_CLIENT_SECRET_FILE)
