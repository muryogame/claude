#!/usr/bin/env python3
"""
YouTube OAuth認証のセットアップスクリプト（StudyFlow チャンネル用）
初回のみ実行が必要
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

TARGET_CHANNEL_ID = "UCXlATa9z8MkQUe3N0deRbhA"  # StudyFlow
TARGET_CHANNEL_NAME = "学習効率化チャンネル StudyFlow"

print(f"""
========================================================
  StudyFlow チャンネル OAuth2.0 認証セットアップ
========================================================

⚠️  重要: ブランドアカウント（StudyFlow）への認証手順

ブラウザで認証画面が開いたら、以下の手順で操作してください：

【チャンネルの切り替え方法】
  1. Google アカウントにログイン（または選択）
  2. 「このアプリを許可しますか？」の前に
     画面左上にアカウント切替ボタンが表示されます
  3. 「アカウントを切り替える」→「{TARGET_CHANNEL_NAME}」を選択
  4. StudyFlow が表示されていることを確認してから「許可」をクリック

  ※ 切替が見つからない場合は、ブラウザで
     https://studio.youtube.com → チャンネル切替 → StudyFlow
     に切り替えてから、このスクリプトを再実行してください。

対象チャンネルID: {TARGET_CHANNEL_ID}
========================================================
""")

# 既存トークンを削除して強制的に再認証
token_file = os.path.join(os.path.dirname(__file__), "token.json")
if os.path.exists(token_file):
    os.remove(token_file)
    print("  既存のトークンを削除しました。新しく認証します。\n")

from config import YOUTUBE_CLIENT_SECRET_FILE

if not os.path.exists(YOUTUBE_CLIENT_SECRET_FILE):
    print(f"⚠️  client_secret.json が見つかりません: {YOUTUBE_CLIENT_SECRET_FILE}")
    sys.exit(1)

print("client_secret.json を検出しました。認証フローを開始します...")
print("  ブラウザが開きます。上記の手順で StudyFlow を選択してください。\n")

from uploader import get_authenticated_service

try:
    youtube = get_authenticated_service()
    response = youtube.channels().list(part="snippet", mine=True).execute()
    items = response.get("items", [])
    if not items:
        print("❌ チャンネル情報を取得できませんでした。")
        sys.exit(1)

    ch = items[0]
    ch_name = ch["snippet"]["title"]
    ch_id   = ch["id"]

    print(f"\n認証されたチャンネル:")
    print(f"   チャンネル名: {ch_name}")
    print(f"   チャンネルID: {ch_id}")

    if ch_id == TARGET_CHANNEL_ID:
        print(f"\n✅ 正しい！StudyFlow チャンネルに認証されました。")
        print("   token.json が保存されました。GitHub Secret も更新してください。\n")
        print("GitHub Secret 更新コマンド:")
        print("  gh secret set STUDY_YOUTUBE_TOKEN_JSON \\")
        print(f"    --body \"$(cat {token_file})\" \\")
        print("    --repo muryogame/claude\n")
    else:
        print(f"\n❌ 間違ったチャンネルです！")
        print(f"   期待: {TARGET_CHANNEL_NAME} ({TARGET_CHANNEL_ID})")
        print(f"   実際: {ch_name} ({ch_id})")
        print("\n再度実行して、ブランドアカウント「StudyFlow」を選択してください。")
        # 間違ったトークンを削除
        if os.path.exists(token_file):
            os.remove(token_file)
        sys.exit(1)

except Exception as e:
    print(f"❌ エラー: {e}")
    sys.exit(1)
