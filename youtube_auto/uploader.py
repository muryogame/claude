"""
YouTube動画アップロードモジュール
OAuth 2.0 認証を使って動画を投稿する
ローカル実行: token.json ファイルを使用
GitHub Actions: YOUTUBE_TOKEN_JSON / YOUTUBE_CLIENT_SECRET_JSON 環境変数を使用
"""
import os
import json
from datetime import datetime
from config import (YOUTUBE_CLIENT_SECRET_FILE, YOUTUBE_TOKEN_FILE,
                    YOUTUBE_CHANNEL_ID)

SCOPES = ["https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube"]


def get_authenticated_service():
    """YouTube APIの認証済みサービスを返す。"""
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    creds = None

    # 環境変数からトークンを読み込む（GitHub Actions用）
    token_json_env = os.environ.get("YOUTUBE_TOKEN_JSON")
    if token_json_env:
        creds = Credentials.from_authorized_user_info(json.loads(token_json_env), SCOPES)
    # ファイルからトークンを読み込む（ローカル用）
    elif os.path.exists(YOUTUBE_TOKEN_FILE):
        with open(YOUTUBE_TOKEN_FILE, "r", encoding="utf-8") as f:
            creds = Credentials.from_authorized_user_info(json.load(f), SCOPES)

    # トークンが無効か期限切れなら再取得
    if not creds or not creds.valid:
        needs_new_flow = True
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                _save_token(creds)
                needs_new_flow = False
            except Exception:
                print("  トークンの更新に失敗しました。再認証を行います...")
                if os.path.exists(YOUTUBE_TOKEN_FILE):
                    os.remove(YOUTUBE_TOKEN_FILE)

        if needs_new_flow:
            # client_secret.json を環境変数から書き出す（GitHub Actions用）
            client_secret_env = os.environ.get("YOUTUBE_CLIENT_SECRET_JSON")
            if client_secret_env and not os.path.exists(YOUTUBE_CLIENT_SECRET_FILE):
                with open(YOUTUBE_CLIENT_SECRET_FILE, "w", encoding="utf-8") as f:
                    f.write(client_secret_env)

            if not os.path.exists(YOUTUBE_CLIENT_SECRET_FILE):
                raise FileNotFoundError(
                    f"client_secret.json が見つかりません: {YOUTUBE_CLIENT_SECRET_FILE}\n"
                    "Google Cloud Console から OAuth 2.0 認証情報をダウンロードして配置してください。"
                )
            flow = InstalledAppFlow.from_client_secrets_file(
                YOUTUBE_CLIENT_SECRET_FILE, SCOPES
            )
            try:
                creds = flow.run_local_server(port=8080)
            except Exception:
                creds = flow.run_console()
            _save_token(creds)

    return build("youtube", "v3", credentials=creds)


def _save_token(creds):
    """トークンを JSON ファイルに保存する。"""
    token_data = json.loads(creds.to_json())
    with open(YOUTUBE_TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(token_data, f, ensure_ascii=False, indent=2)
    print(f"  トークンを保存しました: {YOUTUBE_TOKEN_FILE}")


def upload_video(video_path: str, thumbnail_path: str, script_data: dict) -> str:
    """動画をYouTubeにアップロードする。"""
    from googleapiclient.http import MediaFileUpload

    title = script_data.get("title", "雑学まとめ")
    description = script_data.get("description", "")
    tags = script_data.get("tags", ["雑学", "豆知識", "面白い話"])

    # 説明文にフッターを追加
    full_description = f"""🤖 この動画はAI（人工知能）が自動で作成しています。
スクリプト・ナレーション・映像・サムネイルすべてAI生成です。

{description}

━━━━━━━━━━━━━━━━━━━━━
🤖 AI自動生成チャンネル「毎日雑学」
📌 毎日AIが雑学をお届けしています！
チャンネル登録・高評価よろしくお願いします！
━━━━━━━━━━━━━━━━━━━━━

#雑学 #豆知識 #面白い話 #知識 #AI生成 #AI動画 #{' #'.join(tags[:3])}

投稿日時: {datetime.now().strftime('%Y年%m月%d日')}
※本動画はAIが自動生成したコンテンツです。"""

    print(f"  YouTube にアップロード中: 「{title}」")
    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title[:100],
            "description": full_description[:5000],
            "tags": tags + ["雑学", "豆知識", "面白い話", "知識", "AI生成", "AI動画", "人工知能"],
            "categoryId": "27",  # Education カテゴリ
            "defaultLanguage": "ja",
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(video_path, mimetype="video/mp4",
                            resumable=True, chunksize=1024 * 1024 * 10)

    request = youtube.videos().insert(part=",".join(body.keys()),
                                      body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  アップロード進捗: {int(status.progress() * 100)}%")

    video_id = response["id"]
    print(f"  アップロード完了！ Video ID: {video_id}")

    # サムネイルをアップロード（チャンネル認証済みの場合のみ可能）
    if os.path.exists(thumbnail_path):
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(thumbnail_path)
            ).execute()
            print("  サムネイルをアップロードしました。")
        except Exception as e:
            print(f"  ⚠️  サムネイル設定スキップ（チャンネルの電話番号認証が必要）: {e}")

    video_url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"  動画URL: {video_url}")
    return video_url, video_id


def upload_shorts(video_path: str, script_data: dict) -> str:
    """Shorts動画をYouTubeにアップロードする。"""
    from googleapiclient.http import MediaFileUpload

    title = script_data.get("title", "#Shorts 今日の雑学")
    if "#Shorts" not in title:
        title = title + " #Shorts"

    description = f"""🤖 この動画はAIが自動生成しています。

{script_data.get('hook', '')}

{script_data.get('body', '')}

━━━━━━━━━━━━━━━━━━━━━
🤖 AI自動生成チャンネル「毎日雑学」
📌 毎日AIが雑学をお届け！チャンネル登録よろしくお願いします！
━━━━━━━━━━━━━━━━━━━━━

#Shorts #雑学 #豆知識 #面白い話 #AI生成 #AI動画

投稿日時: {datetime.now().strftime('%Y年%m月%d日')}
※本動画はAIが自動生成したコンテンツです。"""

    print(f"  Shorts アップロード中: 「{title}」")
    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": ["Shorts", "雑学", "豆知識", "面白い話", "AI生成", "AI動画", "人工知能"],
            "categoryId": "27",
            "defaultLanguage": "ja",
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True)
    request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  Shortsアップロード進捗: {int(status.progress() * 100)}%")

    video_id = response["id"]
    url = f"https://www.youtube.com/shorts/{video_id}"
    print(f"  Shorts完了: {url}")
    return url, video_id


def check_credentials_ready() -> bool:
    """認証情報が準備できているか確認する。"""
    return os.path.exists(YOUTUBE_CLIENT_SECRET_FILE)
