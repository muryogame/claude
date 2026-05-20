#!/usr/bin/env python3
"""GitHub Secret YOUTUBE_TOKEN_JSON を token.json の内容で更新する"""
import os, json, base64, urllib.request, urllib.error

pat = os.environ.get("GH_PAT", "").strip()
if not pat:
    pat = input("GitHub PAT を入力してください: ").strip()

repo        = "muryogame/claude"
secret_name = "YOUTUBE_TOKEN_JSON"
token_path  = os.path.join(os.path.dirname(__file__), "token.json")

if not os.path.exists(token_path):
    print(f"❌ token.json が見つかりません: {token_path}")
    raise SystemExit(1)

with open(token_path) as f:
    secret_value = f.read().strip()

headers = {
    "Authorization": f"Bearer {pat}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

req = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/actions/secrets/public-key",
    headers=headers,
)
try:
    with urllib.request.urlopen(req) as r:
        pk_data = json.loads(r.read())
except urllib.error.HTTPError as e:
    print(f"❌ 公開鍵取得失敗 HTTP {e.code}: {e.read().decode()}")
    raise SystemExit(1)

print(f"公開鍵取得成功 (key_id: {pk_data['key_id']})")

from nacl import encoding, public as nacl_public
pk  = nacl_public.PublicKey(pk_data["key"].encode(), encoding.Base64Encoder())
box = nacl_public.SealedBox(pk)
encrypted = base64.b64encode(box.encrypt(secret_value.encode())).decode()

body = json.dumps({"encrypted_value": encrypted, "key_id": pk_data["key_id"]}).encode()
req2 = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}",
    data=body,
    headers={**headers, "Content-Type": "application/json"},
    method="PUT",
)
try:
    with urllib.request.urlopen(req2) as r:
        print(f"✅ {secret_name} の更新成功 (HTTP {r.status})")
except urllib.error.HTTPError as e:
    print(f"❌ Secret 更新失敗 HTTP {e.code}: {e.read().decode()}")
    raise SystemExit(1)
