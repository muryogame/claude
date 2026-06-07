# IOS/Android Apps — Developer Guide

## 概要

Android向けPWA（Progressive Web App）を3本収録したディレクトリ。
Material Design 3準拠・完全オフライン対応・HTTPS必須。

| アプリ | ジャンル | 収益モデル | ディレクトリ |
|--------|---------|-----------|-------------|
| Number Fusion | パズルゲーム (2048系) | 広告 / プレミアム課金 | `number-fusion/` |
| Hop Dash | エンドレスランナー | 広告 / コスメDLC | `hop-dash/` |
| HabitFlow | 習慣管理アプリ | サブスクリプション ¥300/月 | `habit-flow/` |

---

## ファイル構造

```
IOS/
├── CLAUDE.md                ← このファイル
├── number-fusion/
│   ├── index.html           ← HTML骨格 + セキュリティメタタグのみ
│   ├── manifest.json        ← PWA設定
│   ├── css/
│   │   └── main.css         ← 全スタイル
│   └── js/
│       ├── constants.js     ← タイル色・定数定義
│       ├── game.js          ← ゲームロジック (GameState class)
│       ├── render.js        ← DOM描画 (Renderer class)
│       └── app.js           ← エントリーポイント・イベント・音声
├── hop-dash/
│   ├── index.html
│   ├── manifest.json
│   ├── css/
│   │   └── main.css
│   └── js/
│       ├── entities.js      ← ゲームオブジェクト (Player, Obstacle, Coin, PowerUp, Particle)
│       ├── renderer.js      ← Canvas描画 (Renderer class)
│       └── app.js           ← ゲームループ・イベント・UIステート
└── habit-flow/
    ├── index.html
    ├── manifest.json
    ├── css/
    │   └── main.css
    └── js/
        ├── store.js         ← データモデル・localStorage CRUD・バリデーション
        ├── ui.js            ← 習慣リスト・サマリー描画
        ├── stats.js         ← 統計・ヒートマップ・バッジ
        └── app.js           ← ナビゲーション・シート・イベント・コンフェッティ
```

---

## セキュリティ要件

### 必須 (実装済み)

| 対策 | 実装場所 | 内容 |
|------|---------|------|
| **CSP** | `index.html` `<meta>` | `default-src 'self'`・インラインスクリプト不可・外部リソース不可 |
| **Permissions-Policy** | `index.html` `<meta>` | カメラ・マイク・位置情報・決済を無効化 |
| **Referrer-Policy** | `index.html` `<meta>` | `strict-origin-when-cross-origin` |
| **入力サニタイズ** | `store.js` `sanitizeText()` | HTMLエンコード・長さ制限・型チェック |
| **localStorage検証** | `store.js` `validateHabit()` | スキーマバリデーション・パースエラー捕捉 |
| **XSS防止** | 全JSファイル | ユーザーデータは `textContent` / `createElement` を使用。`innerHTML` にユーザー入力を渡さない |
| **Strict Mode** | 全JSファイル | ES Modules は自動的に strict mode |

### 開発時の注意点

```js
// ❌ 禁止: innerHTML にユーザー入力を直接渡す
element.innerHTML = userInput;

// ✅ 推奨: textContent を使う
element.textContent = userInput;

// ✅ 推奨: createElement で構築する
const el = document.createElement('div');
el.textContent = sanitizeText(userInput);

// ✅ 推奨: サニタイズ関数を通す (store.js から import)
import { sanitizeText } from './store.js';
```

### CSP ポリシー詳細

```
default-src 'self';
script-src  'self';
style-src   'self';
img-src     'self' data: blob:;
font-src    'self';
connect-src 'self';
worker-src  'blob:';
frame-ancestors 'none';
```

> **注意**: Web Audio API・Canvas・Vibration API はCSP対象外のため制限不要。
> Google Fontsなど外部フォントを追加する場合は `font-src` に追記すること。

---

## Android (Material Design 3) 準拠チェックリスト

- [x] タッチターゲット最小サイズ 48×48px
- [x] Roboto / system-ui フォント使用
- [x] `theme-color` メタタグ設定
- [x] `viewport` フィット (`width=device-width, initial-scale=1`)
- [x] `env(safe-area-inset-*)` によるノッチ・ナビゲーションバー対応
- [x] `Vibration API` によるハプティクスフィードバック
- [x] `localStorage` によるオフライン永続化
- [x] PWA manifest（`display: standalone`, `orientation: portrait`）
- [x] Material You カラーシステム（Dynamic Color 準拠）
- [x] Bottom Navigation / FAB / Snackbar / Bottom Sheet コンポーネント

---

## ローカル開発環境

```bash
# ファイルサーバーを起動（file:// では ES Modules が動作しない）
npx serve IOS/
# または
python3 -m http.server 8080 --directory IOS/
```

> ブラウザで `http://localhost:8080/number-fusion/` などにアクセス。

---

## デプロイ要件

- **HTTPS必須** (PWA・Vibration API・Web Audio API の要件)
- `manifest.json` の `start_url` はサイトのルート相対パスで設定
- Service Worker は未実装。追加する場合は `js/sw.js` に配置してください。

---

## 収益化戦略

### Number Fusion
- 無料プレイ可能、2048達成後の「続ける」機能をPro制限
- 広告枠: ゲームオーバー画面にインタースティシャル広告を挿入予定

### Hop Dash
- 無料プレイ可能、コインでスキン解除（将来実装）
- 総コイン数は `localStorage` に累積保存済み

### HabitFlow
- 無料: 習慣5個まで
- Pro (¥300/月): 無制限の習慣・詳細統計・リマインダー
- 7日間無料トライアルフローをUI実装済み（実際の課金は別途実装）

---

## コーディング規約

- ES Modules (`import/export`) を使用、グローバル変数は禁止
- `'use strict'` は ES Modules で自動適用（不要だが明示してもよい）
- `innerHTML` にユーザーデータを渡すことは禁止
- localStorage の読み込みは必ず `try/catch` でラップし、スキーマ検証を行う
- CSS カスタムプロパティ (CSS変数) をデザイントークンとして使用
- コメントはWHY（なぜ）のみ記述、WHAT（何をしているか）は書かない
