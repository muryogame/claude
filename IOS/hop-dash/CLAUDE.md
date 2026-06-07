# Hop Dash - Endless Runner

PWA（Progressive Web App）として動作するエンドレスランナーゲーム。  
親ディレクトリの共通ルールは [../CLAUDE.md](../CLAUDE.md) を参照。

## 概要

- **ジャンル**: アクションゲーム（エンドレスランナー）
- **収益モデル**: 広告 / コスメDLC（スキン解除）※課金実装は予定
- **テーマカラー**: `#0061A4`（青系）、背景 `#001D36`

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `index.html` | HTML骨格・Canvas要素・CSPメタタグ |
| `manifest.json` | PWA設定 |
| `css/main.css` | UI（スコア表示・画面遷移）のスタイル |
| `js/entities.js` | ゲームオブジェクトのファクトリ＆更新関数（DOM/Canvas不使用） |
| `js/renderer.js` | Canvas描画ロジック（`Renderer` クラス） |
| `js/app.js` | ゲームループ・UIステート管理・イベントハンドラ |

## アーキテクチャ

`entities.js` はDOM/Canvas操作を一切行わない純粋なロジック層。  
描画はすべて `renderer.js` に委譲する設計。

```
app.js (ゲームループ・入力)
  ├── entities.js (物理・当たり判定・エンティティ更新)
  └── renderer.js (Canvas描画)
```

## エンティティ (entities.js)

### Player
```js
{
  x, y, w: 42, h: 56,
  vy,            // 垂直速度
  onGround,      // 着地判定
  jumpCount,     // 2段ジャンプカウンタ (最大2)
  squashX, squashY, // 着地・ジャンプスクワッシュ
  invincible,    // 無敵フレーム残り
  dead,
}
```

**ジャンプ仕様**: 最大2段ジャンプ。2段目は速度にペナルティあり（`-1.5`）

### 障害物タイプ
| タイプ | 説明 |
|--------|------|
| `cactus` | 低い単体障害物 |
| `tall` | 高い単体障害物 |
| `double` | 間隔のある2連障害物 |

### パワーアップ
- `shield` — 一度だけ障害物を無効化
- `magnet` — コインを引き寄せる

## 難易度スケーリング

| パラメータ | 初期値 | スコアによる変化 |
|-----------|--------|----------------|
| 障害物間隔 | 80フレーム | スコア40ごとに-4（最小48） |
| コイン間隔 | 35フレーム | スコア100ごとに-1（最小22） |
| コイン浮遊確率 | 0% | `min(40%, score/500)` |

## パーティクル

| 関数 | 発生タイミング |
|------|---------------|
| `makeJumpParticles` | ジャンプ時（青系8粒） |
| `makeLandParticles` | 着地時（緑系10粒） |
| `makeDeathParticles` | 死亡時（20粒、star:true） |
| `makeCoinBurst` | コイン取得時（金色5粒） |

## 収益化

- コインは `localStorage` に累積保存（将来のスキン購入に使用）
- ゲームオーバー画面にインタースティシャル広告を挿入予定
- スキンシステムは未実装（UIのみ準備）

## 注意事項

- ゲームループは `requestAnimationFrame` で駆動。`setInterval` は使わない
- Canvas解像度は `devicePixelRatio` でRetina対応すること
- `groundY` は Canvas高さから動的に算出されるため、エンティティに直接ハードコードしない
