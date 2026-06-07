# HabitFlow - 習慣トラッカー

PWA（Progressive Web App）として動作する習慣管理アプリ。  
親ディレクトリの共通ルールは [../CLAUDE.md](../CLAUDE.md) を参照。

## 概要

- **ジャンル**: 生産性 / ライフスタイル
- **収益モデル**: フリーミアム（無料5習慣まで、Pro ¥300/月で無制限）
- **テーマカラー**: `#1B6B3A`（緑系）、背景 `#F6FBF4`

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `index.html` | HTML骨格・CSP/セキュリティメタタグ |
| `manifest.json` | PWA設定（Share Target対応） |
| `css/main.css` | 全スタイル・CSS変数によるデザイントークン |
| `js/store.js` | データ層：localStorage CRUD・バリデーション・サニタイズ |
| `js/ui.js` | 習慣リスト・サマリーのDOM描画 |
| `js/stats.js` | 統計・ヒートマップ・バッジ（アチーブメント）ロジック |
| `js/constants.js` | カテゴリ・時間帯・絵文字などの定数 |
| `js/companion.js` | コンパニオンキャラクター（励ましメッセージ） |
| `js/app.js` | エントリーポイント・ナビゲーション・Bottom Sheet・コンフェッティ |

## データモデル

```js
// 習慣オブジェクト (store.js)
{
  id: number,           // Date.now()
  name: string,         // sanitizeText() 済み、最大30文字
  emoji: string,        // 1-8文字のみ
  cat: string,          // 'health'|'mind'|'learn'|'life'|'social'
  time: string,         // 'morning'|'afternoon'|'evening'|''
  createdAt: string,    // YYYY-MM-DD
  completedDates: string[], // YYYY-MM-DD の配列
}
```

**localStorage キー**:
- `hf_habits` — 習慣配列
- `hf_achiev` — アンロック済みアチーブメントIDの配列

## 主要な関数 (store.js)

| 関数 | 説明 |
|------|------|
| `loadHabits()` | localStorage読み込み＋スキーマ検証 |
| `saveHabits(habits)` | localStorage書き込み（quota超過は無視） |
| `buildHabit({name,emoji,cat,time})` | 新習慣オブジェクト生成 |
| `isDone(habit, date?)` | 指定日に完了しているか |
| `getStreak(habit)` | 現在の連続日数 |
| `getLongestStreak(habit)` | 過去最長の連続日数 |
| `getCompletionRate(habit)` | 達成率（%） |
| `getGlobalStreak(habits)` | 全習慣の完璧達成連続日数 |
| `sanitizeText(input)` | XSS対策テキストサニタイズ |

## Pro制限

- 無料: 習慣5個まで（`FREE_LIMIT = 5`）
- 超過時: Proアップグレードシートを表示
- 実際の課金処理は未実装（UIフローのみ）

## 注意事項

- `innerHTML` にユーザー入力を渡すことは禁止。`textContent` または `createElement` を使う
- localStorage 読み込みは必ず `try/catch` でラップし、`validateHabit()` を通す
- 新しいカテゴリを追加する場合は `VALID_CATS` セットと `constants.js` の両方を更新する
- ストリーク計算は端末のローカル日付に依存するため、タイムゾーンをまたぐ利用には注意
