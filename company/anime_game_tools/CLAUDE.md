# anime_game_tools — アニメキャラ性格診断 ＋ ゲームプレイ時間記録

## 概要
20問の質問で自分に似たアニメキャラを診断するツールと、ゲームプレイ時間の記録・グラフ可視化ツール。
純静的HTML/CSS/JS（サーバー不要）。日本語・英語の2言語対応。

## ファイル構成
```
anime_game_tools/
├── index.html          # メインHTML（2タブ構成）
├── style.css           # スタイル（パープル・ピンク基調）
├── app.js              # 診断ロジック + ゲーム記録 + Chart.js グラフ
└── add_characters.py   # キャラクターデータを一括追加するユーティリティスクリプト
```

## データ規模
| データ | 件数 |
|--------|------|
| アニメ作品（`ANIME_LIST`） | 340作品 |
| 診断キャラクター（`CHARACTERS`） | 1141キャラクター |

## 機能
| タブ | 内容 |
|------|------|
| アニメ性格診断 | 20問 → E/I/T/F/N/S/J/P スコア集計 → キャラにマッチング、レーダーチャート表示、Xシェア |
| ゲーム時間記録 | タイトル・ジャンル・プレイ時間を記録、日別棒グラフ・ゲーム別円グラフ・ジャンル別横棒グラフ |

## app.js 主要定数
| 定数 | 行番号 | 内容 |
|------|--------|------|
| `ANIME_LIST` | L114–L488 | U-NEXT 人気アニメ一覧（340作品） |
| `CHARACTERS` | L743–L3062 | 診断キャラクターデータ（1141件） |
| `QUESTIONS` | — | 20問の診断質問（E/I/T/F/N/S/J/P 軸） |

## キャラクターデータ構造（CHARACTERS 配列）
```js
{
  id: 'naruto_nrt',
  icon: '🍥',
  name: { ja: 'うずまきナルト', en: 'Naruto Uzumaki' },
  series: { ja: 'NARUTO', en: 'NARUTO' },
  type: { ja: '熱血主人公 (ENFP)', en: 'Hot-Blooded Hero (ENFP)' },
  profile: { E:4, N:4, F:3, P:4 },
  desc: { ja: '...', en: '...' },
  traits: { ja: [...], en: [...] },
  radar: [行動力, 共感力, 社交性, 論理性, 責任感, 純粋さ]  // 0–100
}
```

## キャラクター追加方法
```bash
# add_characters.py で CHARACTERS 配列末尾にデータを一括追加
python3 add_characters.py
```

## データ永続化
- LocalStorage キー: `game_records_v1`
- サーバー送信なし・ログイン不要

## 起動方法（ローカル確認）
```bash
cd /home/takah/claude/company
python3 -m http.server 8090
# → http://localhost:8090/anime_game_tools/
```

## ターゲットキーワード
- アニメキャラ 性格診断
- MBTI アニメ
- ゲームプレイ時間 記録
- アニメ 性格テスト 無料
- ゲーム時間 グラフ 管理

## 収益化
- Google AdSense 広告枠（`.ad-box`）
- dアニメ・ABEMAプレミアム・Crunchyroll アフィリエイトリンク
- Steam・ニンテンドー・PS Store リンク
- 競合スコア: 高（日本語特化で外国勢が弱いニッチ）
