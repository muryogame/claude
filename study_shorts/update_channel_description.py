#!/usr/bin/env python3
"""
YouTubeチャンネルの概要欄（About）を更新するスクリプト
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from uploader import get_authenticated_service

CHANNEL_DESCRIPTION = """毎日5本！勉強法・記憶術・集中力UPのコツをショート動画でお届け！
科学的に証明された学習テクニックや試験対策を、わかりやすく厳選してご紹介します。

📅 投稿スケジュール
・ショート動画：毎日 7:00 / 10:00 / 13:00 / 17:00 / 21:00（1日5本）

#勉強法 #記憶術 #学習 #集中力 #資格勉強 #shorts"""


def update_channel_description():
    youtube = get_authenticated_service()

    # 現在のチャンネル情報を取得
    channels = youtube.channels().list(
        part="brandingSettings",
        mine=True,
    ).execute()

    if not channels.get("items"):
        print("チャンネルが見つかりません。")
        return

    channel_id = channels["items"][0]["id"]
    branding = channels["items"][0].get("brandingSettings", {})
    channel_settings = branding.get("channel", {})
    channel_settings["description"] = CHANNEL_DESCRIPTION

    youtube.channels().update(
        part="brandingSettings",
        body={
            "id": channel_id,
            "brandingSettings": {
                "channel": channel_settings,
            },
        },
    ).execute()

    print(f"✅ チャンネル概要欄を更新しました（チャンネルID: {channel_id}）")
    print("\n--- 設定した概要欄 ---")
    print(CHANNEL_DESCRIPTION)


if __name__ == "__main__":
    update_channel_description()
