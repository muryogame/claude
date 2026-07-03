#!/usr/bin/env python3
"""WSL環境用 YouTube OAuth認証（コンソールモード）"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))

from config import YOUTUBE_CLIENT_SECRET_FILE, YOUTUBE_TOKEN_FILE

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]

from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

flow = InstalledAppFlow.from_client_secrets_file(YOUTUBE_CLIENT_SECRET_FILE, SCOPES)

print("\n以下のURLをWindowsのブラウザで開いてGoogleアカウントを認証してください：\n")
creds = flow.run_local_server(port=8081, open_browser=False)

token_data = {
    "token":         creds.token,
    "refresh_token": creds.refresh_token,
    "token_uri":     creds.token_uri,
    "client_id":     creds.client_id,
    "client_secret": creds.client_secret,
    "scopes":        list(creds.scopes) if creds.scopes else list(SCOPES),
}
with open(YOUTUBE_TOKEN_FILE, "w", encoding="utf-8") as f:
    json.dump(token_data, f, indent=2)

print(f"\n✅ token.json を保存しました: {YOUTUBE_TOKEN_FILE}")

youtube = build("youtube", "v3", credentials=creds)
resp = youtube.channels().list(part="snippet", mine=True).execute()
for ch in resp.get("items", []):
    print(f"   チャンネル名: {ch['snippet']['title']}")
    print(f"   チャンネルID: {ch['id']}")
print("\n認証完了！投稿を開始できます。")
