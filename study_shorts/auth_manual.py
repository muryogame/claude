#!/usr/bin/env python3
"""WSL環境用 YouTube OAuth認証（手動コード入力方式）"""
import sys, os, json, secrets, hashlib, base64, urllib.parse
import requests

sys.path.insert(0, os.path.dirname(__file__))
from config import YOUTUBE_CLIENT_SECRET_FILE, YOUTUBE_TOKEN_FILE

with open(YOUTUBE_CLIENT_SECRET_FILE) as f:
    client_info = json.load(f)["installed"]

CLIENT_ID     = client_info["client_id"]
CLIENT_SECRET = client_info["client_secret"]
TOKEN_URI     = client_info["token_uri"]
AUTH_URI      = client_info["auth_uri"]
REDIRECT_URI  = "http://localhost"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]

# PKCE
code_verifier  = secrets.token_urlsafe(64)
code_challenge = base64.urlsafe_b64encode(
    hashlib.sha256(code_verifier.encode()).digest()
).rstrip(b"=").decode()
state = secrets.token_urlsafe(16)

params = {
    "response_type":         "code",
    "client_id":             CLIENT_ID,
    "redirect_uri":          REDIRECT_URI,
    "scope":                 " ".join(SCOPES),
    "state":                 state,
    "code_challenge":        code_challenge,
    "code_challenge_method": "S256",
    "access_type":           "offline",
    "prompt":                "consent",
}
auth_url = AUTH_URI + "?" + urllib.parse.urlencode(params)

print("\n" + "=" * 60)
print("  YouTube OAuth2.0 再認証")
print("=" * 60)
print("\n【手順】")
print("1. 以下のURLをWindowsのブラウザで開く")
print("2. Googleアカウントを選択して認証を許可")
print("3. ブラウザが 'localhost に接続できない' ページを表示する")
print("4. そのページのURLをすべてコピーしてここに貼り付ける\n")
print("認証URL：")
print(auth_url)
print()

redirected_url = input("→ リダイレクト後のURLを貼り付けてください: ").strip()

# URLからcodeとstateを抽出
parsed = urllib.parse.urlparse(redirected_url)
qs = urllib.parse.parse_qs(parsed.query)
code  = qs.get("code", [None])[0]
got_state = qs.get("state", [None])[0]

if not code:
    # URLではなくcodeだけ貼った場合に対応
    code = redirected_url
    got_state = state  # stateチェックをスキップ

if got_state and got_state != state:
    print(f"⚠️  stateが一致しません（期待: {state}、取得: {got_state}）")
    print("   続行しますか？ (y/n): ", end="")
    if input().strip().lower() != "y":
        sys.exit(1)

# コードをトークンに交換
resp = requests.post(TOKEN_URI, data={
    "code":          code,
    "client_id":     CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "redirect_uri":  REDIRECT_URI,
    "grant_type":    "authorization_code",
    "code_verifier": code_verifier,
})

if resp.status_code != 200:
    print(f"❌ トークン取得失敗: {resp.json()}")
    sys.exit(1)

raw = resp.json()
print(f"\nトークン取得成功: {list(raw.keys())}")

token_data = {
    "token":         raw.get("access_token"),
    "refresh_token": raw.get("refresh_token"),
    "token_uri":     TOKEN_URI,
    "client_id":     CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "scopes":        SCOPES,
}

# study_shorts の token.json に保存
with open(YOUTUBE_TOKEN_FILE, "w", encoding="utf-8") as f:
    json.dump(token_data, f, indent=2)
print(f"✅ study_shorts/token.json を保存しました")

# youtube_auto の token.json にもコピー
youtube_auto_token = os.path.join(os.path.dirname(__file__), "..", "youtube_auto", "token.json")
with open(youtube_auto_token, "w", encoding="utf-8") as f:
    json.dump(token_data, f, indent=2)
print(f"✅ youtube_auto/token.json も更新しました")

# 認証確認
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
creds = Credentials(
    token=token_data["token"],
    refresh_token=token_data["refresh_token"],
    token_uri=TOKEN_URI,
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    scopes=SCOPES,
)
youtube = build("youtube", "v3", credentials=creds)
r = youtube.channels().list(part="snippet", mine=True).execute()
for ch in r.get("items", []):
    print(f"\n   チャンネル名: {ch['snippet']['title']}")
    print(f"   チャンネルID: {ch['id']}")
print("\n認証完了！両チャンネルへの投稿が可能です。")
