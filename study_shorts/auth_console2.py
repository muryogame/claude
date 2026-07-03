#!/usr/bin/env python3
"""WSL環境用 YouTube OAuth認証（localhost:9090 コールバック方式）"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))

from config import YOUTUBE_CLIENT_SECRET_FILE, YOUTUBE_TOKEN_FILE

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]

from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

flow = InstalledAppFlow.from_client_secrets_file(
    YOUTUBE_CLIENT_SECRET_FILE,
    SCOPES,
)

print("\n" + "=" * 60)
print("  YouTube OAuth2.0 再認証（ポート9090）")
print("=" * 60)
print("\nブラウザが開かない場合は、以下のURLを手動でWindowsブラウザで開いてください。")
print("認証後、ブラウザが自動で localhost:9090 にリダイレクトされます。\n")

creds = flow.run_local_server(port=9090, open_browser=False)

token_data = json.loads(creds.to_json())

# study_shorts の token.json に保存
with open(YOUTUBE_TOKEN_FILE, "w", encoding="utf-8") as f:
    json.dump(token_data, f, indent=2)
print(f"\n✅ study_shorts/token.json を保存しました")

# youtube_auto の token.json にもコピー
youtube_auto_token = os.path.join(os.path.dirname(__file__), "..", "youtube_auto", "token.json")
with open(youtube_auto_token, "w", encoding="utf-8") as f:
    json.dump(token_data, f, indent=2)
print(f"✅ youtube_auto/token.json も更新しました")

# 認証確認
youtube = build("youtube", "v3", credentials=creds)
resp = youtube.channels().list(part="snippet", mine=True).execute()
for ch in resp.get("items", []):
    print(f"\n   チャンネル名: {ch['snippet']['title']}")
    print(f"   チャンネルID: {ch['id']}")
print("\n認証完了！両チャンネルへの投稿が可能です。")
