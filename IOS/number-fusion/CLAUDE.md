# Number Fusion - Merge Puzzle

PWA（Progressive Web App）として動作する2048系マージパズルゲーム。  
親ディレクトリの共通ルールは [../CLAUDE.md](../CLAUDE.md) を参照。

## 概要

- **ジャンル**: パズルゲーム（2048スタイル）
- **収益モデル**: 広告 / プレミアム（2048達成後の「続ける」機能を制限予定）
- **テーマカラー**: `#6750A4`（パープル系）、背景 `#FFFBFE`

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `index.html` | HTML骨格・CSPメタタグ |
| `manifest.json` | PWA設定（Edge Side Panel対応 `preferred_width: 400`） |
| `css/main.css` | グリッドレイアウト・タイルアニメーション・CSS変数 |
| `js/constants.js` | タイルの見た目定義（`TILE_STYLES`）・グリッド定数 |
| `js/game.js` | ゲームロジック（`GameState` クラス） |
| `js/render.js` | DOM描画（`Renderer` クラス） |
| `js/daily.js` | デイリーチャレンジロジック |
| `js/app.js` | エントリーポイント・イベント・Web Audio音声 |

## グリッド定数 (constants.js)

```js
GRID = 4   // 4×4グリッド
GAP  = 10  // px — CSS --gap と一致させること
PAD  = 10  // px — CSS --pad と一致させること
```

> **注意**: `GAP` と `PAD` はCSSカスタムプロパティと同じ値でなければならない。  
> 片方だけ変更するとタイル位置がズレる。

## タイルスタイル (constants.js)

`TILE_STYLES` に値 → `{bg, c, glow}` のマッピングを定義。  
2〜2048まで定義済み。2048以上の値は `TILE_STYLE_DEFAULT`（赤系）にフォールバック。

| 値 | グロー効果 |
|----|-----------|
| 2〜256 | なし |
| 512 | 青緑グロー |
| 1024 | ピンクグロー |
| 2048 | ゴールドグロー（強） |

## ゲームロジック (game.js)

`GameState` クラスが状態を管理。  
盤面は `board[row][col]` の2次元配列（値0は空セル）。

**主要メソッド:**
- `move(dir)` — `'up'|'down'|'left'|'right'` でスライド＆マージ
- `isGameOver()` — 有効な手が残っているか判定
- `save()` / `load()` — localStorage で局面を永続化

## 収益化（予定）

- 無料: 2048達成まで通常プレイ可能
- Pro制限: 2048達成後に「続ける」ボタン（より高い数値を目指す機能）
- 実装時は `GameState` に `isPro` フラグを追加して制御する

## 注意事項

- CSSの `--gap` と `--pad` を変更する場合は `constants.js` の `GAP`/`PAD` も同時に更新する
- 新しいタイル値（4096など）を追加する場合は `TILE_STYLES` に追加する（なければ `TILE_STYLE_DEFAULT` が使われる）
- Web Audio APIはCSP対象外だが、外部URLからのオーディオファイル読み込みは `connect-src 'self'` に抵触するので注意
