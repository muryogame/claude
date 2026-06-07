# Google Play Store 公開マニュアル

## 全体の流れ（所要時間の目安）

```
STEP 1  Googleアカウント & 開発者登録    ─── 1日 ($25)
STEP 2  HTTPSホスティングへデプロイ      ─── 2〜3時間 (無料)
STEP 3  PWABuilder でAPK/AAB生成        ─── 30分 (無料)
STEP 4  Play Console でアプリ登録       ─── 2〜3時間
STEP 5  審査 & 公開                     ─── 3〜7日
```

---

## STEP 1 — Google Play Developer 登録

### 1-1. 登録ページへアクセス
```
https://play.google.com/console/
```

### 1-2. 必要なもの
- Googleアカウント
- クレジットカード / デビットカード
- 登録料 **$25（約3,800円、生涯1回のみ）**

### 1-3. 個人 vs 組織の選択
| 区分 | 特徴 |
|------|------|
| **個人** | 本名が公開される。小規模ならOK |
| **組織（法人）** | 法人名が表示。D-U-N-S番号が必要（無料取得に14日かかる場合あり） |

### 1-4. 本人確認
- 住所、電話番号（SMS認証）
- 2024年以降は身分証明書提出が必要な場合あり

---

## STEP 2 — HTTPSでアプリを公開（必須）

**Play StoreのTWAはHTTPS URLが必要です。**

### 推奨ホスティング（無料）

#### オプションA: Netlify（最も簡単）
```bash
# 1. https://www.netlify.com/ でアカウント作成
# 2. Drag & Drop デプロイ

# ドラッグするフォルダ構成:
IOS/
  number-fusion/   ← ここを丸ごとドラッグ
    index.html
    css/
    js/
    sw.js
    manifest.json
```
→ 自動で `https://xxxx.netlify.app/` のURLが発行される

#### オプションB: GitHub Pages（無料・おすすめ）
```bash
# 1. GitHubリポジトリ作成
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_NAME/your-app.git
git push -u origin main

# 2. Settings → Pages → Branch: main / root を選択
# → https://YOUR_NAME.github.io/your-app/ で公開
```

#### オプションC: Firebase Hosting（Google公式）
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: IOS/number-fusion
firebase deploy
# → https://your-project.web.app/
```

### デプロイ後の確認チェックリスト
```
□ HTTPSでアクセスできる
□ manifest.json が読み込まれている
□ Service Worker が動いている (DevTools → Application → Service Workers)
□ モバイルで動作確認
□ Lighthouseスコアを確認 (PWA: 100点が理想)
```

---

## STEP 3 — PWABuilder で APK/AAB を生成

### 3-1. PWABuilder にアクセス
```
https://www.pwabuilder.com/
```

### 3-2. URLを入力してスキャン
```
あなたのアプリURL例:
https://your-name.github.io/number-fusion/
```

### 3-3. スコア確認
PWABuilderが以下をチェックする:
```
✅ HTTPS ─────────────── 必須
✅ manifest.json ──────── 必須 (name, icons, start_url など)
✅ Service Worker ─────── 必須
✅ Icons 512x512 ──────── 必須
⚠️ アイコン画像 ──────── 実画像が必要 (今はSVG/data: URI)
```

### 3-4. アイコン画像の準備（重要）

**現在の manifest.json は SVG / data: URI を使っているため、Play Store用に PNG画像が必要です。**

```
必要なサイズ:
- 512×512 px (Play Store必須)
- 192×192 px (PWA必須)
- 形式: PNG

作成ツール (無料):
- https://app.haikei.app/     (背景デザイン)
- https://favicon.io/          (絵文字→PNG変換)
- https://realfavicongenerator.net/
```

#### favicon.io でアイコンを作る例
```
1. https://favicon.io/favicon-emoji/ にアクセス
2. 絵文字を入力: 🔮 (Number Fusion の場合)
3. 背景色: #6750A4
4. Download ZIP
5. PNG を 512×512 にリサイズ
```

### 3-5. manifest.json のアイコンを更新

```json
// manifest.json の icons を実ファイルに変更
{
  "icons": [
    {
      "src": "./icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "./icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

### 3-6. Android パッケージを生成
```
PWABuilder → Package for Stores → Android → Generate

設定項目:
- Package ID: com.yourname.numberfusion  (逆ドメイン記法)
- App name: Number Fusion
- Version: 1.0.0
- Start URL: https://your-app-url.com/

→ AAB ファイル (.aab) がダウンロードされる
```

---

## STEP 4 — Google Play Console でアプリ登録

### 4-1. アプリを作成
```
Play Console → アプリを作成
  - アプリ名: Number Fusion
  - デフォルト言語: 日本語
  - アプリまたはゲーム: ゲーム / アプリ
  - 無料または有料: 無料
```

### 4-2. 必要な提出物（全部用意する）

#### ストアの掲載情報
```
① アプリ名           ─ 最大30文字
   例: "Number Fusion - 数字合体パズル"

② 簡単な説明         ─ 最大80文字
   例: "スワイプで数字を合体！2048を目指す戦略パズルゲーム。デイリーチャレンジで毎日遊べる！"

③ 詳細な説明         ─ 最大4,000文字
   例: (下記のサンプルを参照)

④ スクリーンショット  ─ 2〜8枚、最小320×480px
   作成方法: Chrome DevTools → モバイル表示 → スクリーンショット

⑤ フィーチャーグラフィック ─ 1024×500px (必須)
   Canvaで無料作成可: https://www.canva.com/

⑥ アプリアイコン     ─ 512×512px PNG (STEP 3で作成済み)
```

#### 説明文サンプル（コピー可）

```
【Number Fusion】

◆ 概要
シンプルなルールで奥深い戦略パズル！
同じ数字のタイルをスワイプで合体させて、2048を目指そう！

◆ 特徴
🔮 デイリーチャレンジ
毎日全プレイヤー共通の盤面！友達と競争できる！

📤 結果シェア
Wordle形式の絵文字グリッドでSNSに自慢しよう！

🔊 サウンドフィードバック
合体のたびに気持ちよい音が鳴る！

💾 自動セーブ
途中でアプリを閉じても続きから遊べる！

◆ 遊び方
・スワイプで全タイルが同じ方向に動く
・同じ数字のタイルが合体して数字が大きくなる
・2048のタイルを作ったら勝ち！

◆ こんな人におすすめ
✓ 毎日少しずつ楽しめるゲームが欲しい
✓ 頭を使うパズルゲームが好き
✓ オフラインでも遊びたい
```

### 4-3. コンテンツレーティング（審査）
```
Play Console → コンテンツのレーティング → アンケート開始

ゲームの場合の典型的な回答:
- 暴力: なし
- 性的コンテンツ: なし
- 言語: なし
- 恐怖: なし
→ 「全ユーザー対象 (E)」が付与される
```

### 4-4. ターゲット層
```
- 対象年齢: 13歳以上 (HabitFlowなら18歳以上も選択肢)
- 子供向けか: いいえ（ゲームは yes も可）
```

### 4-5. データ安全性（重要・必須）
```
Play Console → データの安全性

現在のアプリが収集するデータ:
┌─────────────────────────────────────┐
│ localStorage のみ使用               │
│ → 外部送信なし                      │
│ → サーバー側データなし              │
└─────────────────────────────────────┘

回答例:
- データを収集・共有するか: いいえ
- セキュリティのプラクティス: 暗号化あり (HTTPS)
```

### 4-6. 価格と販売地域
```
- 価格: 無料
- 販売国: 全地域 または 日本のみ から選択
- インアプリ課金: あり (将来的に追加可能)
```

### 4-7. AABをアップロード
```
Play Console → リリース → 内部テスト → 新しいリリースを作成
  → AABファイルをアップロード
  → リリースノートを入力
  → 保存 → 内部テストに公開
```

---

## STEP 5 — テスト & 本番公開

### 5-1. テストのフロー（推奨）
```
内部テスト (自分だけ) 
    ↓ 1〜2日
クローズドテスト / アルファ (友人10〜20人)
    ↓ 数日
オープンテスト / ベータ (一般公開、自由参加)
    ↓ 2週間
本番 (Production) ─ 全ユーザーに公開
```

### 5-2. 審査期間
```
初回: 3〜7日（長い場合は2週間）
更新: 数時間〜2日
```

### 5-3. よくある却下理由と対策
| 却下理由 | 対策 |
|----------|------|
| アイコンが低品質 | 512×512の高解像度PNGを用意 |
| スクリーンショットがない | 最低2枚は用意 |
| プライバシーポリシーがない | 無料テンプレートで作成 |
| データ安全フォームが不完全 | 詳細に回答 |
| HTTPS未対応 | ホスティングを確認 |

---

## プライバシーポリシーの作成（必須）

**外部データを収集しないアプリでもポリシーページが必要です。**

### 無料テンプレートサービス
```
https://www.privacypolicygenerator.info/
https://app-privacy-policy-generator.nisrulz.com/
```

### 最低限の内容例
```markdown
# プライバシーポリシー

本アプリ「Number Fusion」はユーザーの個人情報を収集しません。

## データの収集について
- すべてのデータはお使いのデバイス内（localStorage）にのみ保存されます
- 外部サーバーへのデータ送信は行いません
- 広告SDKは使用していません

## お問い合わせ
your-email@example.com

最終更新: 2025年XX月XX日
```

→ GitHub Pages や Netlify でホストしてURLを取得する

---

## 費用まとめ

| 項目 | 費用 |
|------|------|
| Google Play 開発者登録 | **$25（生涯1回）** |
| Netlify / GitHub Pages ホスティング | **無料** |
| PWABuilder | **無料** |
| Canva（グラフィック作成） | **無料（有料プランもあり）** |
| **合計** | **約3,800円〜** |

---

## 代替: より本格的なネイティブアプリにしたい場合

### Capacitor（PWA → ネイティブAPK）
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Number Fusion" "com.yourname.numberfusion"
npx cap add android
npx cap sync
npx cap open android
# → Android Studio が開く → Build → Generate Signed Bundle/APK
```

### 主な違い
| 方式 | メリット | デメリット |
|------|---------|-----------|
| **TWA (PWABuilder)** | 簡単・維持管理がWeb側だけ | 一部ネイティブ機能が使えない |
| **Capacitor** | ネイティブ機能フル活用 | Android Studio が必要 |
| **ネイティブKotlin** | 最高のパフォーマンス | 全て書き直し |

---

## チェックリスト（公開前の最終確認）

```
□ HTTPSでアクセスできる
□ Service Worker が登録されている
□ manifest.json に実PNG画像のアイコンがある
□ 512×512 PNGアイコンがある
□ スクリーンショット 2枚以上
□ フィーチャーグラフィック (1024×500px)
□ 簡単な説明 (80文字以内)
□ 詳細な説明 (500文字以上推奨)
□ プライバシーポリシーURLがある
□ コンテンツレーティング回答済み
□ データ安全フォーム回答済み
□ 内部テストで動作確認済み
```
