'use strict';

// ══════════════════════════════════════════════════════════════
// 言語設定 / Language Setting
// ══════════════════════════════════════════════════════════════
let lang = localStorage.getItem('animeToolLang') || 'ja';

const I18N = {
  ja: {
    logo: '🎮 エンタメツール',
    tagline: 'アニメ性格診断 ＋ ゲーム時間記録 — 完全無料',
    tab_anime: '✨ アニメ性格診断',
    tab_game: '🎮 ゲーム時間記録',
    quiz_title: '✨ あなたはどのアニメキャラ？',
    quiz_desc: '20問の質問に答えて、あなたにそっくりなアニメキャラクターを見つけよう。所要時間: 約3分',
    start_btn: '✨ 診断スタート！',
    q_progress: (c, t) => `${c} / ${t}問`,
    result_similar: '🎭 似ているキャラクター',
    share_x: '𝕏 Xでシェア',
    retry: '🔄 もう一度診断する',
    radar_labels: ['行動力','共感力','社交性','論理性','責任感','純粋さ'],
    type_chips: ['🔥 主人公系','🧠 知略派','❤️ 癒し系','⚔️ 熱血漢','🌙 クール系','🎭 ムードメーカー','🛡️ 守り人','🌸 純粋派'],
    popular_anime: '🎌 U-NEXT 人気アニメ',
    anime_watch: '📺 アニメを見るなら',
    game_add_title: '🎮 プレイ記録を追加',
    g_date: '日付',
    g_title_label: 'ゲームタイトル',
    g_hours: 'プレイ時間（時間）',
    g_genre_label: 'ジャンル',
    g_mood: '気分・評価',
    g_note: 'メモ（クリア・イベント等）',
    g_save: '🎮 記録を保存',
    g_search_ph: 'ゲーム名で絞り込み',
    g_all_genre: 'すべてのジャンル',
    k_total: '総プレイ時間',
    k_top: '最多プレイゲーム',
    k_days: '記録日数',
    k_avg: '1日平均',
    log_title: '📋 プレイ履歴',
    clear_btn: '🗑️ 全記録を削除',
    clear_confirm: '全ての記録を削除しますか？',
    del_confirm: 'この記録を削除しますか？',
    no_record: '記録が見つかりません',
    game_tips: '🎮 適正プレイ時間の目安',
    game_find: '🕹️ ゲームを探すなら',
    footer: 'エンタメツール — アニメ性格診断・ゲーム時間記録（完全無料・ログイン不要）',
    footer_note: '※ 診断結果はエンタメ目的のものです。',
    chart_daily: 'プレイ時間(h)',
    chart_by_game: 'ゲーム別プレイ時間',
    chart_by_genre: 'ジャンル別プレイ時間',
    moods: [
      { v:'5', t:'最高！🔥' }, { v:'4', t:'楽しかった😊' }, { v:'3', t:'普通🙂' },
      { v:'2', t:'微妙😐' }, { v:'1', t:'つまらなかった😑' },
    ],
    genres: ['RPG','アクション','FPS/TPS','シミュレーション','格闘','レーシング','パズル','スポーツ','ADV/ノベル','その他'],
    tips_play: ['子ども（〜12歳）: 1日1時間まで','中高生: 1日2時間まで','成人: 健康的には3時間以内','週40時間超は「ゲーム障害」の注意域'],
    mood_map: { '5':'🔥','4':'😊','3':'🙂','2':'😐','1':'😑' },
  },
  en: {
    logo: '🎮 Entertainment Tools',
    tagline: 'Anime Character Quiz + Game Time Tracker — Free',
    tab_anime: '✨ Anime Character Quiz',
    tab_game: '🎮 Game Time Tracker',
    quiz_title: '✨ Which anime character are you?',
    quiz_desc: 'Answer 20 questions to discover the anime character that matches your personality! Takes about 3 minutes.',
    start_btn: '✨ Start Quiz!',
    q_progress: (c, t) => `${c} / ${t}`,
    result_similar: '🎭 Similar Characters',
    share_x: '𝕏 Share on X',
    retry: '🔄 Take Quiz Again',
    radar_labels: ['Action','Empathy','Sociability','Logic','Responsibility','Purity'],
    type_chips: ['🔥 Hero Type','🧠 Strategist','❤️ Healer','⚔️ Hot-Blooded','🌙 Cool Type','🎭 Mood Maker','🛡️ Protector','🌸 Pure Heart'],
    popular_anime: '🎌 Popular Anime on U-NEXT',
    anime_watch: '📺 Watch Anime',
    game_add_title: '🎮 Add Play Record',
    g_date: 'Date',
    g_title_label: 'Game Title',
    g_hours: 'Play Time (hours)',
    g_genre_label: 'Genre',
    g_mood: 'Mood / Rating',
    g_note: 'Note (clear, event, etc.)',
    g_save: '🎮 Save Record',
    g_search_ph: 'Filter by game name',
    g_all_genre: 'All Genres',
    k_total: 'Total Play Time',
    k_top: 'Most Played',
    k_days: 'Days Recorded',
    k_avg: 'Daily Average',
    log_title: '📋 Play History',
    clear_btn: '🗑️ Delete All Records',
    clear_confirm: 'Delete all records?',
    del_confirm: 'Delete this record?',
    no_record: 'No records found',
    game_tips: '🎮 Healthy Play Time Guide',
    game_find: '🕹️ Find Games',
    footer: 'Entertainment Tools — Anime Quiz & Game Tracker (Free, No Login)',
    footer_note: '* Quiz results are for entertainment purposes only.',
    chart_daily: 'Play Time (h)',
    chart_by_game: 'By Game',
    chart_by_genre: 'By Genre',
    moods: [
      { v:'5', t:'Amazing! 🔥' }, { v:'4', t:'Fun 😊' }, { v:'3', t:'Okay 🙂' },
      { v:'2', t:'Meh 😐' }, { v:'1', t:'Boring 😑' },
    ],
    genres: ['RPG','Action','FPS/TPS','Simulation','Fighting','Racing','Puzzle','Sports','Visual Novel','Other'],
    tips_play: ['Children (≤12): up to 1h/day','Teens: up to 2h/day','Adults: ideally under 3h/day','40h+/week is problem gaming range'],
    mood_map: { '5':'🔥','4':'😊','3':'🙂','2':'😐','1':'😑' },
  },
};

// ══════════════════════════════════════════════════════════════
// U-NEXT 人気アニメリスト / Popular Anime List
// ══════════════════════════════════════════════════════════════
const ANIME_LIST = [
  // 2025 注目・ランキング上位
  { ja:'薬屋のひとりごと',                          en:'The Apothecary Diaries' },
  { ja:'SAKAMOTO DAYS',                              en:'Sakamoto Days' },
  { ja:'ダンダダン',                                  en:'Dandadan' },
  { ja:'葬送のフリーレン',                            en:"Frieren: Beyond Journey's End" },
  { ja:'俺だけレベルアップな件',                     en:'Solo Leveling' },
  // バトル・アクション
  { ja:'鬼滅の刃',                                    en:'Demon Slayer' },
  { ja:'呪術廻戦',                                    en:'Jujutsu Kaisen' },
  { ja:'進撃の巨人',                                  en:'Attack on Titan' },
  { ja:'チェンソーマン',                              en:'Chainsaw Man' },
  { ja:'僕のヒーローアカデミア',                     en:'My Hero Academia' },
  { ja:'ブルーロック',                                en:'Blue Lock' },
  { ja:'ワンピース',                                  en:'One Piece' },
  { ja:'NARUTO -ナルト-',                            en:'Naruto' },
  { ja:'HUNTER×HUNTER',                             en:'Hunter x Hunter' },
  { ja:'ブリーチ 千年血戦篇',                        en:'Bleach: Thousand-Year Blood War' },
  { ja:'ブラッククローバー',                          en:'Black Clover' },
  { ja:'怪獣8号',                                    en:'Kaiju No. 8' },
  // ファンタジー・異世界
  { ja:'ダンジョン飯',                                en:'Delicious in Dungeon' },
  { ja:'転生したらスライムだった件',                 en:'That Time I Got Reincarnated as a Slime' },
  { ja:'Re:ゼロから始める異世界生活',               en:'Re:Zero' },
  { ja:'無職転生 〜異世界行ったら本気だす〜',       en:'Mushoku Tensei' },
  { ja:'マッシュル-MASHLE-',                         en:'Mashle: Magic and Muscles' },
  { ja:'キングダム',                                  en:'Kingdom' },
  { ja:'Fate/stay night',                            en:'Fate/stay night' },
  // ラブコメ・日常
  { ja:'かぐや様は告らせたい',                       en:'Kaguya-sama: Love Is War' },
  { ja:'五等分の花嫁',                                en:'The Quintessential Quintuplets' },
  { ja:'推しの子',                                    en:'Oshi no Ko' },
  { ja:'ぼっち・ざ・ろっく！',                       en:'Bocchi the Rock!' },
  { ja:'スキップとローファー',                       en:'Skip and Loafer' },
  { ja:'SPY×FAMILY',                                 en:'SPY×FAMILY' },
  { ja:'やはり俺の青春ラブコメはまちがっている',   en:'My Teen Romantic Comedy SNAFU' },
  // SF・心理・ミステリー
  { ja:'シュタインズ・ゲート',                       en:'Steins;Gate' },
  { ja:'デスノート',                                  en:'Death Note' },
  { ja:'コードギアス 反逆のルルーシュ',              en:'Code Geass' },
  { ja:'新世紀エヴァンゲリオン',                     en:'Neon Genesis Evangelion' },
  { ja:'文豪ストレイドッグス',                       en:'Bungo Stray Dogs' },
  { ja:'約束のネバーランド',                          en:'The Promised Neverland' },
  // スポーツ
  { ja:'ハイキュー!!',                               en:'Haikyu!!' },
  // 名作・クラシック
  { ja:'鋼の錬金術師 BROTHERHOOD',                   en:'Fullmetal Alchemist: Brotherhood' },
  { ja:'ヴァイオレット・エヴァーガーデン',           en:'Violet Evergarden' },
  { ja:'ジョジョの奇妙な冒険',                       en:"JoJo's Bizarre Adventure" },
  { ja:'ゴールデンカムイ',                            en:'Golden Kamuy' },
  { ja:'ドラゴンボール超',                            en:'Dragon Ball Super' },
  { ja:'ソードアート・オンライン',                   en:'Sword Art Online' },
  // 心理・ディストピア
  { ja:'PSYCHO-PASS サイコパス',                      en:'Psycho-Pass' },
  { ja:'魔法少女まどか☆マギカ',                      en:'Puella Magi Madoka Magica' },
  { ja:'モブサイコ100',                               en:'Mob Psycho 100' },
  // 冒険・ダーク
  { ja:'メイドインアビス',                            en:'Made in Abyss' },
  { ja:'ヴィンランド・サガ',                          en:'Vinland Saga' },
  { ja:'86―エイティシックス―',                      en:'86 EIGHTY-SIX' },
  { ja:'オッドタクシー',                              en:'Odd Taxi' },
  { ja:'王様ランキング',                              en:'Ranking of Kings' },
  // 高校・日常
  { ja:'ようこそ実力至上主義の教室へ',                en:'Classroom of the Elite' },
  { ja:'リコリス・リコイル',                          en:'Lycoris Recoil' },
  // ミステリー・心理
  { ja:'サマータイムレンダ',                          en:'Summer Time Rendering' },
  { ja:'天国大魔境',                                  en:'Heavenly Delusion' },
  { ja:'BANANA FISH',                                 en:'Banana Fish' },
  // 名作・クラシック追加
  { ja:'COWBOY BEBOP',                                en:'Cowboy Bebop' },
  { ja:'夏目友人帳',                                  en:"Natsume's Book of Friends" },
  { ja:'宝石の国',                                    en:'Land of the Lustrous' },
  { ja:'Dr.STONE',                                    en:'Dr. Stone' },
  { ja:'とんがり帽子のアトリエ',                      en:'Witch Hat Atelier' },
  // ミステリー・心理追加
  { ja:'東京喰種トーキョーグール',                   en:'Tokyo Ghoul' },
  { ja:'亜人',                                        en:'Ajin: Demi-Human' },
  { ja:'DARKER THAN BLACK',                           en:'Darker Than Black' },
  { ja:'PSYCHO-PASS サイコパス 3',                    en:'Psycho-Pass 3' },
  // ラブコメ・学園追加
  { ja:'ニセコイ',                                    en:'Nisekoi' },
  { ja:'彼女、お借りします',                          en:'Rent-a-Girlfriend' },
  { ja:'ヲタクに恋は難しい',                          en:'Wotakoi' },
  { ja:'月がきれい',                                  en:'Tsuki ga Kirei' },
  { ja:'四月は君の嘘',                                en:'Your Lie in April' },
  { ja:'CLANNAD',                                     en:'Clannad' },
  { ja:'Angel Beats!',                                en:'Angel Beats!' },
  { ja:'Charlotte',                                   en:'Charlotte' },
  { ja:'涼宮ハルヒの憂鬱',                            en:'The Melancholy of Haruhi Suzumiya' },
  { ja:'氷菓',                                        en:'Hyouka' },
  { ja:'3月のライオン',                               en:'March Comes in Like a Lion' },
  { ja:'ピアノの森',                                  en:'Piano Forest' },
  { ja:'四畳半神話大系',                              en:'The Tatami Galaxy' },
  { ja:'映像研には手を出すな！',                     en:'Keep Your Hands Off Eizouken!' },
  { ja:'スキップとローファー',                        en:'Skip and Loafer' },
  // 異世界・ファンタジー追加
  { ja:'オーバーロード',                              en:'Overlord' },
  { ja:'この素晴らしい世界に祝福を！',               en:"KonoSuba: God's Blessing" },
  { ja:'盾の勇者の成り上がり',                        en:'The Rising of the Shield Hero' },
  { ja:'幼女戦記',                                    en:'The Saga of Tanya the Evil' },
  { ja:'はたらく魔王様！',                            en:'The Devil Is a Part-Timer!' },
  { ja:'ゴブリンスレイヤー',                          en:'Goblin Slayer' },
  { ja:'本好きの下剋上',                              en:'Ascendance of a Bookworm' },
  { ja:'ログ・ホライズン',                            en:'Log Horizon' },
  { ja:'乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…', en:"My Next Life as a Villainess" },
  { ja:'魔王学院の不適合者',                          en:'The Misfit of Demon King Academy' },
  { ja:'蜘蛛ですが、なにか？',                        en:"So I'm a Spider, So What?" },
  { ja:'陰の実力者になりたくて！',                    en:'The Eminence in Shadow' },
  { ja:'異世界おじさん',                              en:'Uncle from Another World' },
  { ja:'最弱テイマーはゴミ拾いの旅を始めました。',   en:'The Weakest Tamer Began a Journey' },
  // スポーツ追加
  { ja:'スラムダンク',                                en:'Slam Dunk' },
  { ja:'テニスの王子様',                              en:'The Prince of Tennis' },
  { ja:'弱虫ペダル',                                  en:'Yowamushi Pedal' },
  { ja:'ダイヤのA',                                   en:'Ace of Diamond' },
  { ja:'ちはやふる',                                  en:'Chihayafuru' },
  { ja:'おおきくふりかぶって',                        en:'Big Windup!' },
  { ja:'あひるの空',                                  en:'Ahiru no Sora' },
  { ja:'ブルーロック（続編）',                        en:'Blue Lock II' },
  // 長寿・国民的アニメ
  { ja:'名探偵コナン',                                en:'Detective Conan' },
  { ja:'銀魂',                                        en:'Gintama' },
  { ja:'ポケットモンスター',                          en:'Pokémon' },
  { ja:'デジモンアドベンチャー',                      en:'Digimon Adventure' },
  { ja:'カードキャプターさくら',                      en:'Cardcaptor Sakura' },
  { ja:'美少女戦士セーラームーン',                    en:'Sailor Moon' },
  { ja:'おジャ魔女どれみ',                            en:'Ojamajo Doremi' },
  { ja:'アイカツ！',                                  en:'Aikatsu!' },
  { ja:'ラブライブ！',                                en:'Love Live!' },
  // メカ・SF追加
  { ja:'機動戦士ガンダムSEED',                       en:'Mobile Suit Gundam SEED' },
  { ja:'天元突破グレンラガン',                        en:'Gurren Lagann' },
  { ja:'マクロスΔ',                                   en:'Macross Delta' },
  { ja:'コードギアス 亡国のアキト',                   en:'Code Geass: Akito the Exiled' },
  { ja:'攻殻機動隊 STAND ALONE COMPLEX',             en:'Ghost in the Shell: SAC' },
  { ja:'serial experiments lain',                    en:'Serial Experiments Lain' },
  { ja:'カウボーイビバップ',                          en:'Cowboy Bebop' },
  // 感動・日常系追加
  { ja:'あの日見た花の名前を僕達はまだ知らない。',   en:"AnoHana: The Flower We Saw That Day" },
  { ja:'心が叫びたがってるんだ。',                    en:'The Anthem of the Heart' },
  { ja:'白い砂のアクアトープ',                        en:'The White Sand Aquatope' },
  { ja:'花咲くいろは',                                en:'Hanasaku Iroha' },
  { ja:'響け！ユーフォニアム',                        en:'Sound! Euphonium' },
  { ja:'けいおん！',                                  en:'K-On!' },
  { ja:'のんのんびより',                              en:'Non Non Biyori' },
  { ja:'ご注文はうさぎですか？',                      en:'Is the Order a Rabbit?' },
  { ja:'ゆるキャン△',                                en:'Laid-Back Camp' },
  { ja:'スーパーカブ',                                en:'Super Cub' },
  // ダーク・サスペンス追加
  { ja:'不滅のあなたへ',                              en:'To Your Eternity' },
  { ja:'東京リベンジャーズ',                          en:'Tokyo Revengers' },
  { ja:'ZOMBIE LAND SAGA',                            en:'Zombie Land Saga' },
  { ja:'フルーツバスケット',                          en:'Fruits Basket' },
  { ja:'ブルーピリオド',                              en:'Blue Period' },
  { ja:'平家物語',                                    en:'The Heike Story' },
  { ja:'平穏世代の韋駄天達',                          en:'Heion Sedai no Idaten-tachi' },
  { ja:'見える子ちゃん',                              en:'Mieruko-chan' },
  { ja:'地獄楽',                                      en:'Hell\'s Paradise' },
  { ja:'BEASTARS',                                    en:'Beastars' },
  { ja:'亜獣譚',                                      en:'Ajouttan' },
  // 注目新作
  { ja:'逃げ上手の若君',                              en:'The Elusive Samurai' },
  { ja:'アストラム',                                  en:'Astrum' },
  { ja:'ぬるぬるしたくない！',                        en:'Nuru Nuru Shitakunai!' },
  { ja:'魔入りました！入間くん',                      en:'Welcome to Demon School! Iruma-kun' },
  { ja:'ようこそ実力至上主義の教室へ Season3',        en:'Classroom of the Elite Season 3' },
  { ja:'無職転生II ～異世界行ったら本気だす～',       en:'Mushoku Tensei II' },
  { ja:'Re:ゼロから始める異世界生活 3rd season',      en:'Re:Zero 3rd Season' },
  { ja:'転生したらスライムだった件 第3期',            en:'TenSura Season 3' },
  { ja:'俺だけレベルアップな件 Season 2',             en:'Solo Leveling Season 2' },
  { ja:'WIND BREAKER',                                en:'Wind Breaker' },
  { ja:'烏は主を選ばない',                            en:'A Crow Without A Master' },
  { ja:'ガールズバンドクライ',                        en:'Girls Band Cry' },
  { ja:'シンカリオン',                                en:'Shinkansen Henkei Robo Shinkalion' },
  { ja:'マッシュル-MASHLE- 第2期',                   en:'Mashle Season 2' },
  { ja:'チェンソーマン 第2期',                        en:'Chainsaw Man Season 2' },
  { ja:'ダンダダン 第2期',                            en:'Dandadan Season 2' },
  { ja:'葬送のフリーレン 第2期',                      en:"Frieren Season 2" },
  // クラシック名作追加
  { ja:'魔法使いの嫁',                                en:'The Ancient Magus Bride' },
  { ja:'昭和元禄落語心中',                            en:'Showa Genroku Rakugo Shinju' },
  { ja:'さよならの朝に約束の花をかざろう',            en:'Maquia: When the Promised Flower Blooms' },
  { ja:'宇宙よりも遠い場所',                          en:'A Place Further Than the Universe' },
  { ja:'彼方のアストラ',                              en:'Astra Lost in Space' },
  { ja:'サマータイムレンダ 全話',                     en:'Summer Time Rendering Complete' },
  { ja:'王様ランキング 勇気の宝箱',                   en:'Ranking of Kings: Treasure Chest of Courage' },
  { ja:'スキップとローファー OVA',                    en:'Skip and Loafer OVA' },
  // その他注目
  // バトル・アクション追加2
  { ja:'七つの大罪',                                  en:'The Seven Deadly Sins' },
  { ja:'テイルズ オブ ゼスティリア ザ クロス',       en:'Tales of Zestiria the X' },
  { ja:'ソードアート・オンライン アリシゼーション',   en:'SAO Alicization' },
  { ja:'アクセル・ワールド',                          en:'Accel World' },
  { ja:'デート・ア・ライブ',                          en:'Date A Live' },
  { ja:'IS〈インフィニット・ストラトス〉',            en:'Infinite Stratos' },
  { ja:'魔法科高校の劣等生',                          en:'The Irregular at Magic High School' },
  { ja:'艦隊これくしょん -艦これ-',                  en:'Kantai Collection' },
  { ja:'ガーリー・エアフォース',                      en:'Girly Air Force' },
  { ja:'グランブルーファンタジー ザ・アニメーション',en:'Granblue Fantasy The Animation' },
  { ja:'ペルソナ5 ザ・アニメーション',               en:'Persona 5 The Animation' },
  { ja:'ペルソナ4 ザ・アニメーション',               en:'Persona 4 The Animation' },
  { ja:'テイルズ オブ ベルセリア',                   en:'Tales of Berseria' },
  // 音楽・アイドル追加
  { ja:'アイドルマスター',                            en:'The iDOLM@STER' },
  { ja:'うたの☆プリンスさまっ♪',                    en:'Uta no Prince-sama' },
  { ja:'プリティーリズム・オーロラドリーム',          en:'Pretty Rhythm Aurora Dream' },
  { ja:'キラッとプリ☆チャン',                        en:'Kiratto Pri Chan' },
  { ja:'ラブライブ！スーパースター!!',                en:'Love Live! Superstar!!' },
  { ja:'BanG Dream!',                                 en:'BanG Dream!' },
  { ja:'D4DJ First Mix',                              en:'D4DJ First Mix' },
  { ja:'ワールドダイスター',                          en:'World Dai Star' },
  // 異世界追加3
  { ja:'賢者の弟子を名乗る賢者',                     en:'The Sage Who Transcended Samsara' },
  { ja:'無職転生 ～異世界行ったら本気だす～ II',     en:'Mushoku Tensei II: Jobless Reincarnation' },
  { ja:'最強の魔導師のスラム出身者',                  en:'The Strongest Mage' },
  { ja:'スライム倒して300年、知らないうちにレベルMAXになってました', en:'Slime 300 Years' },
  { ja:'テイマーは異世界も余裕で生き抜きます！',     en:'The Tamer Survives' },
  { ja:'神達に拾われた男',                            en:'By the Grace of the Gods' },
  { ja:'蜘蛛ですが、なにか？',                        en:"So I'm a Spider So What" },
  { ja:'転生賢者の異世界ライフ',                      en:'My Isekai Life' },
  { ja:'ありふれた職業で世界最強',                    en:'Arifureta: From Commonplace to Strongest' },
  { ja:'進化の実〜知らないうちに勝ち組人生〜',       en:'The Fruit of Evolution' },
  { ja:'現代社会で乙女ゲームの悪役令嬢をするのはちょっと大変',en:'Little Apocalypse' },
  { ja:'ブレイブウィッチーズ',                        en:'Brave Witches' },
  { ja:'ストライクウィッチーズ',                      en:'Strike Witches' },
  { ja:'異世界はスマートフォンとともに。',            en:'In Another World With My Smartphone' },
  { ja:'この勇者が俺TUEEEくせに慎重すぎる',          en:'Cautious Hero' },
  { ja:'ダンジョンに出会いを求めるのは間違っているだろうか', en:'Is It Wrong to Try to Pick Up Girls in a Dungeon?' },
  { ja:'まちカドまぞく',                              en:'The Demon Girl Next Door' },
  // 学園・日常追加
  { ja:'やが君（やがて君になる）',                    en:'Bloom Into You' },
  { ja:'citrus',                                      en:'Citrus' },
  { ja:'恋は雨上がりのように',                        en:'After the Rain' },
  { ja:'俺の彼女と幼なじみが修羅場すぎる',           en:'My Girlfriend and Childhood Friend Fight Too Much' },
  { ja:'中二病でも恋がしたい！',                      en:'Love Chunibyo & Other Delusions!' },
  { ja:'有頂天家族',                                  en:'The Eccentric Family' },
  { ja:'干物妹！うまるちゃん',                        en:"Himouto! Umaru-chan" },
  { ja:'小林さんちのメイドラゴン',                    en:"Miss Kobayashi's Dragon Maid" },
  { ja:'ヤマノススメ',                                en:'Encouragement of Climb' },
  { ja:'ゆるゆり',                                    en:'YuruYuri' },
  { ja:'この美術部には問題がある！',                  en:'This Art Club Has a Problem!' },
  { ja:'NEW GAME！',                                  en:'New Game!' },
  // SF・近未来追加
  { ja:'VIVY -Fluorite Eye\'s Song-',                 en:'Vivy: Fluorite Eye\'s Song' },
  { ja:'ID：INVADED',                                 en:'ID:INVADED' },
  { ja:'スター☆トゥインクルプリキュア',               en:'Star Twinkle Pretty Cure' },
  { ja:'カビルの部屋',                                en:'Kabiru no Heya' },
  { ja:'ひぐらしのなく頃に',                          en:'When They Cry' },
  { ja:'うみねこのなく頃に',                          en:'Umineko When They Cry' },
  { ja:'CHAOS;CHILD',                                 en:'Chaos;Child' },
  { ja:'ReLIFE',                                      en:'ReLIFE' },
  { ja:'サカサマのパテマ',                            en:'Patema Inverted' },
  { ja:'楽園追放 -Expelled from Paradise-',           en:'Expelled from Paradise' },
  // 格闘・バトル追加3
  { ja:'ハイスコアガール',                            en:'High Score Girl' },
  { ja:'WORKING!!',                                   en:'Working!!' },
  { ja:'ゴールデンカムイ（続編）',                    en:'Golden Kamuy Continued' },
  { ja:'ヒナまつり',                                  en:'Hinamatsuri' },
  { ja:'かくしごと',                                  en:'Kakushigoto' },
  { ja:'荒ぶる季節の乙女どもよ。',                    en:'O Maidens in Your Savage Season' },
  { ja:'あそびあそばせ',                              en:'Asobi Asobase' },
  { ja:'アニメガタリズ',                              en:'Anime-Gataris' },
  // 話題・注目追加
  { ja:'骸骨騎士様、只今異世界へお出掛け中',         en:'Skeleton Knight in Another World' },
  { ja:'勤務は魔族です。',                            en:'The Demon Is a Corporate Slave' },
  { ja:'継母の連れ子が元カノだった',                  en:'My Stepmom\'s Daughter Is My Ex' },
  { ja:'連れカノ',                                    en:'Renai Flops' },
  { ja:'シャドーハウス',                              en:'Shadows House' },
  { ja:'サクガン',                                    en:'Sakugan' },
  { ja:'大正オトメ御伽話',                            en:'Taisho Otome Fairy Tale' },
  { ja:'古見さんは、コミュ症です。',                  en:'Komi Can\'t Communicate' },
  { ja:'明日ちゃんのセーラー服',                      en:'Akebi\'s Sailor Uniform' },
  { ja:'リアデイルの大地にて',                        en:'In the Land of Leadale' },
  { ja:'スローループ',                                en:'Slow Loop' },
  { ja:'その着せ替え人形は恋をする',                  en:'My Dress-Up Darling' },
  { ja:'劣等上位の原点使い',                          en:'The Strongest Sage' },
  { ja:'であいもん',                                  en:'Deaimon' },
  { ja:'パリピ孔明',                                  en:'Ya Boy Kongming!' },
  { ja:'転生したら剣でした',                          en:'Reincarnated as a Sword' },
  { ja:'便利屋斎藤さん、異世界に行く',               en:'Handyman Saitou in Another World' },
  { ja:'お兄ちゃんはおしまい！',                      en:'My Brother\'s Husband' },
  { ja:'おにまい（お兄ちゃんはおしまい！）',          en:'Onimai' },
  { ja:'Buddy Daddies',                               en:'Buddy Daddies' },
  { ja:'ヴィンランド・サガ Season2',                  en:'Vinland Saga Season 2' },
  { ja:'アニメ『ドロヘドロ』シーズン2',               en:'Dorohedoro Season 2' },
  { ja:'ぼっち・ざ・ろっく！ 映画',                   en:'Bocchi the Rock! Movie' },
  // チ。、メダリスト、忘却バッテリー等
  { ja:'チ。-地球の運動について-',                   en:'Chi: About the Movement of Earth' },
  { ja:'メダリスト',                                  en:'Medalist' },
  { ja:'忘却バッテリー',                              en:'Oblivion Battery' },
  { ja:'来世は他人がいい',                            en:'My Next Life as a Stranger' },
  { ja:'小市民シリーズ',                              en:'Shoushimin Series' },
  { ja:'ルックバック',                                en:'Look Back' },
  // 追加ラスト38本
  { ja:'モンスター',                                  en:'Monster' },
  { ja:'MONSTER（浦沢直樹）',                         en:'Monster (Naoki Urasawa)' },
  { ja:'20世紀少年',                                  en:'20th Century Boys' },
  { ja:'PLUTO',                                       en:'Pluto' },
  { ja:'フルメタル・パニック！',                      en:'Full Metal Panic!' },
  { ja:'シャーマンキング',                            en:'Shaman King' },
  { ja:'銀魂。（新作）',                              en:'Gintama New Series' },
  { ja:'るろうに剣心 -明治剣客浪漫譚-',               en:'Rurouni Kenshin' },
  { ja:'SLAM DUNK（映画）',                           en:'The First Slam Dunk' },
  { ja:'ヘルクマン（仮）',                            en:'Helck' },
  { ja:'Helck',                                       en:'Helck' },
  { ja:'葬送のフリーレン 劇場版',                     en:"Frieren Movie" },
  { ja:'薬屋のひとりごと 第3期',                      en:'The Apothecary Diaries Season 3' },
  { ja:'俺だけレベルアップな件 第3期',                en:'Solo Leveling Season 3' },
  { ja:'鬼滅の刃 無限城編',                           en:'Demon Slayer: Infinity Castle' },
  { ja:'呪術廻戦 第4期',                              en:'Jujutsu Kaisen Season 4' },
  { ja:'ワンピース エッグヘッド編',                   en:'One Piece: Egghead Arc' },
  { ja:'NARUTO 新世代編',                             en:'Boruto: Naruto Next Generations' },
  { ja:'ドラゴンボールDAIMA',                         en:'Dragon Ball Daima' },
  { ja:'僕のヒーローアカデミア 映画',                 en:'My Hero Academia Movie' },
  { ja:'進撃の巨人 完結編',                           en:'Attack on Titan: The Final Chapters' },
  { ja:'SPY×FAMILY Season 3',                         en:'SPY×FAMILY Season 3' },
  { ja:'推しの子 第3期',                              en:'Oshi no Ko Season 3' },
  { ja:'かぐや様は告らせたい 第4期',                  en:'Kaguya-sama Season 4' },
  { ja:'ダンジョン飯 第2期',                          en:'Delicious in Dungeon Season 2' },
  { ja:'モブサイコ100 IV',                            en:'Mob Psycho 100 IV' },
  { ja:'転スラ映画',                                  en:'TenSura Movie' },
  { ja:'無職転生 第3期',                              en:'Mushoku Tensei Season 3' },
  { ja:'盾の勇者の成り上がり 第3期',                  en:'Rising of the Shield Hero Season 3' },
  { ja:'オーバーロード 第5期',                        en:'Overlord Season 5' },
  { ja:'このすば 第4期',                              en:'KonoSuba Season 4' },
  { ja:'Re:ゼロ 第4期',                               en:'Re:Zero Season 4' },
  { ja:'ブルーロック Episode Nagi',                   en:'Blue Lock: Episode Nagi' },
  { ja:'キングダム 第6期',                            en:'Kingdom Season 6' },
  { ja:'ヴィンランド・サガ 第3期',                    en:'Vinland Saga Season 3' },
  { ja:'チェンソーマン 第2期',                        en:'Chainsaw Man Season 2' },
  { ja:'ジョジョの奇妙な冒険 ストーンオーシャン',     en:"JoJo's Stone Ocean" },
  { ja:'マッシュル-MASHLE-',                          en:'Mashle: Magic and Muscles' },
  // U-NEXT 2025〜2026 注目・ランキング上位
  { ja:'アオのハコ',                                   en:'Blue Box' },
  { ja:'異修羅',                                       en:'Ishura' },
  { ja:'ちいかわ',                                     en:'Chiikawa' },
  { ja:'正反対な君と僕',                               en:'You and I Are Polar Opposites' },
  { ja:'違国日記',                                     en:"A Stranger's Diary" },
  { ja:'僕だけがいない街',                             en:'ERASED' },
  { ja:'ドロヘドロ',                                   en:'Dorohedoro' },
  { ja:'義妹生活',                                     en:'Gimai Seikatsu' },
  { ja:'夜のクラゲは泳げない',                         en:"Night's Jellyfish Can\'t Swim" },
  { ja:'時々ボソッとロシア語でデレる隣のアーリャさん', en:'Sometimes the Alya Next Door Drops Russian' },
  { ja:'ギャグマンガ日和GO',                           en:'Gag Manga Biyori GO' },
  { ja:'機動戦士Gundam GQuuuuuuX',                     en:'Gundam GQuuuuuuX' },
  { ja:'ウマ娘 プリティーダービー',                    en:'Uma Musume Pretty Derby' },
  { ja:'ウマ娘 シンデレラグレイ',                      en:'Uma Musume: Cinderella Gray' },
  { ja:'WIND BREAKER Season 2',                        en:'Wind Breaker Season 2' },
  { ja:'完璧すぎて可愛げがないと婚約破棄された聖女は隣国に売られる', en:'The Saint Who Was Sold' },
  { ja:'最強の王様、二度目の人生は何をする？',          en:'The Strongest King: What to Do in Your Second Life?' },
  { ja:'新米オッサン冒険者、最強パーティに死ぬほど鍛えられて無敵になる。', en:'Rookie Adventurer Trained to Death by the Strongest Party' },
  { ja:'没落予定の貴族だけど、暇だったから魔法を極めてみた', en:'Fallen Noble Who Mastered Magic Out of Boredom' },
  { ja:'ギルドの受付嬢ですが、残業は嫌なのでボスをソロ討伐しようと思います', en:'Guild Receptionist Who Solo-Kills the Boss to Avoid Overtime' },
  { ja:'悪役令嬢転生おじさん',                         en:'Middle-Aged Man Reincarnated as a Villainess' },
  { ja:'ダンジョンの中のひと',                         en:'Dungeon People' },
  { ja:'転スラ日記',                                   en:'TenSura Diary' },
  { ja:'魔法少女にあこがれて',                         en:'Witch and Mercenary' },
  { ja:'ひとりぼっちの異世界攻略',                     en:'Hitoribocchi no Isekai Kouryaku' },
  { ja:'八男って、それはないでしょう！',               en:"I'm the Villainess, So I\'m Taming the Final Boss" },
  { ja:'怪物事変',                                     en:'Monster Incidents' },
  { ja:'見える子ちゃん Season 2',                      en:'Mieruko-chan Season 2' },
  { ja:'葬送のフリーレン 劇場版',                      en:'Frieren: The Movie' },
  { ja:'鬼滅の刃 無限城編（後編）',                    en:'Demon Slayer: Infinity Castle Part 2' },
  { ja:'SAKAMOTO DAYS Season 2',                       en:'Sakamoto Days Season 2' },
  { ja:'ダンダダン Season 2',                          en:'Dandadan Season 2' },
  { ja:'薬屋のひとりごと 第3期',                       en:'The Apothecary Diaries Season 3' },
  { ja:'アオのハコ Season 2',                          en:'Blue Box Season 2' },
  { ja:'逃げ上手の若君',                               en:'The Elusive Samurai' },
  { ja:'スナックバス江',                               en:'Snack Basue' },
  { ja:'花は咲く、修羅の如く',                         en:'A Flower Blooms Like a Demon' },
  { ja:'ポーション頼みで生き延びます！',               en:'Survival Through Potion!' },
  { ja:'もふもふを知る者は世界を制す',                 en:'One Who Knows Fluffiness Rules the World' },
  { ja:'転生貴族の異世界冒険録',                       en:'Isekai Adventures of a Reincarnated Noble' },
];

// ══════════════════════════════════════════════════════════════
// 質問データ / Questions
// ══════════════════════════════════════════════════════════════
const QUESTIONS = {
  ja: [
    { text: '知らない人ばかりのパーティー。あなたはどうする？', opts: [
      { text: '率先して話しかけまくる！', axes: {E:3} },
      { text: '気が合いそうな人を探してゆっくり話す', axes: {E:1,I:1} },
      { text: '誰かが話しかけてくれるのを待つ', axes: {I:2} },
      { text: 'こっそり早めに退散する', axes: {I:3} },
    ]},
    { text: '問題が起きたとき、まず最初にすることは？', opts: [
      { text: '論理的に原因を分析する', axes: {T:3} },
      { text: '仲間と一緒にアイデアを出し合う', axes: {F:1,E:1} },
      { text: '直感を信じてすぐ動く', axes: {N:2,P:1} },
      { text: '過去の経験から最善策を探す', axes: {S:2,J:1} },
    ]},
    { text: '旅行の計画を立てるとしたら？', opts: [
      { text: '分刻みのスケジュールを事前に作る', axes: {J:3} },
      { text: '大まかに決めてあとは現地任せ', axes: {P:2} },
      { text: '行き当たりばったりが最高！', axes: {P:3} },
      { text: '行きたい場所リストだけ作る', axes: {J:1,N:1} },
    ]},
    { text: 'あなたが最もやる気が出るのは？', opts: [
      { text: '仲間が全力で頑張っているのを見たとき', axes: {F:2,E:1} },
      { text: '強敵や大きな壁が立ちはだかったとき', axes: {E:2,T:1} },
      { text: '誰かの役に立てると感じたとき', axes: {F:3} },
      { text: '面白いアイデアや可能性を発見したとき', axes: {N:3} },
    ]},
    { text: '友達に悩みを相談されたら？', opts: [
      { text: '解決策をズバッと教える', axes: {T:3} },
      { text: 'まずとにかく話を全部聞く', axes: {F:3} },
      { text: '一緒に泣いたり怒ったりする', axes: {F:2,E:1} },
      { text: '根本的な原因を一緒に分析する', axes: {T:1,N:1} },
    ]},
    { text: '理想の休日の過ごし方は？', opts: [
      { text: '大人数でワイワイ遊ぶ', axes: {E:3} },
      { text: '仲のいい友達と少人数でまったり', axes: {I:1,F:1} },
      { text: 'ひとりで趣味・ゲーム・読書に没頭', axes: {I:3} },
      { text: '気分でその日に決める', axes: {P:2} },
    ]},
    { text: 'あなたが最も大切にしていることは？', opts: [
      { text: '仲間・絆・信頼', axes: {F:2,E:1} },
      { text: '正義・信念・目標', axes: {T:1,J:2} },
      { text: '自由・好奇心・冒険', axes: {N:2,P:1} },
      { text: '安定・平和・居心地の良さ', axes: {S:2,I:1} },
    ]},
    { text: '自分の最大の短所に近いのは？', opts: [
      { text: '考えすぎてなかなか行動できない', axes: {I:2,T:1} },
      { text: '感情的になりすぎる', axes: {F:2} },
      { text: '飽き性でなかなか続かない', axes: {P:2,N:1} },
      { text: '頑固で融通が効かない', axes: {J:2,T:1} },
    ]},
    { text: 'チームで何かをするとき、あなたの役割は？', opts: [
      { text: 'リーダー・まとめ役', axes: {E:2,J:1} },
      { text: 'アイデア出し担当', axes: {N:2,E:1} },
      { text: '縁の下の力持ち・サポート', axes: {F:2,I:1} },
      { text: '黙々と実行する担当', axes: {S:1,T:1,I:1} },
    ]},
    { text: '感情表現について、最も当てはまるのは？', opts: [
      { text: '感情がすぐ顔や態度に出る', axes: {F:2,E:1} },
      { text: 'クールに見えるが内心は熱い', axes: {I:2,T:1} },
      { text: '基本ポジティブで明るい', axes: {E:2,F:1} },
      { text: '感情はあまり外に出さない', axes: {I:3,T:1} },
    ]},
    { text: '未来についてのあなたのスタンスは？', opts: [
      { text: 'しっかり計画を立てて着実に進む', axes: {J:3,S:1} },
      { text: '夢は大きく、まず動いてみる', axes: {N:2,E:1} },
      { text: 'なるようになる、今を楽しむ', axes: {P:3} },
      { text: '最悪ケースも考えながら慎重に進む', axes: {T:2,J:1} },
    ]},
    { text: '好きなアニメのジャンルは？', opts: [
      { text: '友情・努力・熱血バトル', axes: {E:1,F:1} },
      { text: 'ミステリー・頭脳戦・謀略', axes: {N:2,T:2} },
      { text: '日常・恋愛・心温まる話', axes: {F:2,S:1} },
      { text: 'ファンタジー・SF・深い世界観', axes: {N:3} },
    ]},
    { text: '人間関係で最も大切にしているのは？', opts: [
      { text: '正直さ・裏表がないこと', axes: {T:2,J:1} },
      { text: '温かさ・思いやり', axes: {F:3} },
      { text: '信頼・長続きする縁', axes: {J:1,F:1} },
      { text: '刺激・新しい出会い', axes: {E:2,N:1} },
    ]},
    { text: '失敗したとき、あなたはどうする？', opts: [
      { text: 'すぐ原因を分析して改善策を考える', axes: {T:2,J:1} },
      { text: 'しばらく落ち込むが、また立ち上がる', axes: {F:2,I:1} },
      { text: '「次こそ！」と気持ちを切り替える', axes: {E:2,P:1} },
      { text: '誰かに話してすっきりしたい', axes: {F:1,E:2} },
    ]},
    { text: '秘密を打ち明けられたら？', opts: [
      { text: 'どんなことがあっても絶対守る', axes: {F:2,J:1} },
      { text: '本人のためになるなら打ち明けることもある', axes: {T:1,J:1} },
      { text: '重すぎる秘密は正直つらい', axes: {I:1,P:1} },
      { text: '秘密を共有してもらえることが嬉しい', axes: {F:1,E:1} },
    ]},
    { text: 'ゲームでよく選ぶキャラ・職業は？', opts: [
      { text: '前線で戦う剣士・アタッカー', axes: {E:1,S:1} },
      { text: '頭脳派の魔法使い・策士', axes: {N:1,T:2} },
      { text: '仲間を回復するヒーラー', axes: {F:3} },
      { text: '遠距離から狙う弓使い・スナイパー', axes: {I:2,T:1} },
    ]},
    { text: 'やる気が出ないときどうやって乗り越える？', opts: [
      { text: '仲間や推しに元気をもらう', axes: {F:2,E:1} },
      { text: '「絶対やってやる！」と自分を鼓舞する', axes: {T:1,J:1} },
      { text: 'ひとまず休んで気分転換する', axes: {I:2,P:1} },
      { text: '目標を再確認して計画を立て直す', axes: {J:2,N:1} },
    ]},
    { text: '理想のヒーロー像は？', opts: [
      { text: '傷ついても守り続ける不屈のヒーロー', axes: {F:1,J:1,E:1} },
      { text: '知略で敵を翻弄する天才', axes: {N:2,T:2} },
      { text: '皆を笑顔にするムードメーカー', axes: {E:3,F:1} },
      { text: '陰から世界を支えるサポーター', axes: {I:2,F:2} },
    ]},
    { text: '自分の強みといえば？', opts: [
      { text: '誰とでも仲良くなれるコミュ力', axes: {E:3} },
      { text: '冷静な分析力と判断力', axes: {T:3} },
      { text: '人の気持ちに寄り添う共感力', axes: {F:3} },
      { text: '独創的な発想力', axes: {N:3} },
    ]},
    { text: '最終的に一番惹かれるのは？', opts: [
      { text: '熱くて仲間思いな主人公タイプ', axes: {E:2,F:2} },
      { text: '頭脳で世界を動かす天才タイプ', axes: {T:2,N:2} },
      { text: '穏やかで誰からも愛される癒し系', axes: {F:2,I:1} },
      { text: '自由に生きる風来坊タイプ', axes: {P:2,N:2} },
    ]},
  ],
  en: [
    { text: "You're at a party full of strangers. What do you do?", opts: [
      { text: 'Jump in and start talking to everyone!', axes: {E:3} },
      { text: 'Find someone interesting and chat one-on-one', axes: {E:1,I:1} },
      { text: 'Wait for someone to approach you', axes: {I:2} },
      { text: 'Sneak out early', axes: {I:3} },
    ]},
    { text: 'When a problem arises, what do you do first?', opts: [
      { text: 'Analyze the root cause logically', axes: {T:3} },
      { text: 'Brainstorm with your team', axes: {F:1,E:1} },
      { text: 'Trust your gut and act immediately', axes: {N:2,P:1} },
      { text: 'Draw from past experience', axes: {S:2,J:1} },
    ]},
    { text: 'How do you plan a trip?', opts: [
      { text: 'Detailed minute-by-minute itinerary in advance', axes: {J:3} },
      { text: 'Rough plan, figure the rest out on arrival', axes: {P:2} },
      { text: 'No plan at all — go with the flow!', axes: {P:3} },
      { text: 'Just a list of must-see places', axes: {J:1,N:1} },
    ]},
    { text: 'What motivates you the most?', opts: [
      { text: 'Seeing your teammates give it their all', axes: {F:2,E:1} },
      { text: 'Facing a powerful challenge or strong opponent', axes: {E:2,T:1} },
      { text: 'Knowing you made a real difference for someone', axes: {F:3} },
      { text: 'Discovering an exciting new idea or possibility', axes: {N:3} },
    ]},
    { text: 'A friend comes to you with a problem. You...', opts: [
      { text: 'Give them direct, practical advice', axes: {T:3} },
      { text: 'Listen to everything carefully first', axes: {F:3} },
      { text: 'Share their emotions — cry or get upset together', axes: {F:2,E:1} },
      { text: 'Help analyze the root cause together', axes: {T:1,N:1} },
    ]},
    { text: "What's your ideal day off?", opts: [
      { text: 'Going out with a big group of friends', axes: {E:3} },
      { text: 'Chilling with a few close friends', axes: {I:1,F:1} },
      { text: 'Alone, lost in a hobby, game, or book', axes: {I:3} },
      { text: 'Decide depending on mood that day', axes: {P:2} },
    ]},
    { text: 'What do you value most?', opts: [
      { text: 'Bonds, friendship, and trust', axes: {F:2,E:1} },
      { text: 'Justice, conviction, and goals', axes: {T:1,J:2} },
      { text: 'Freedom, curiosity, and adventure', axes: {N:2,P:1} },
      { text: 'Stability, peace, and comfort', axes: {S:2,I:1} },
    ]},
    { text: "What's your biggest weakness?", opts: [
      { text: 'Overthinking before acting', axes: {I:2,T:1} },
      { text: 'Getting too emotional', axes: {F:2} },
      { text: 'Getting bored and giving up', axes: {P:2,N:1} },
      { text: 'Being stubborn and inflexible', axes: {J:2,T:1} },
    ]},
    { text: 'What role do you usually take in a group?', opts: [
      { text: 'Leader / organizer', axes: {E:2,J:1} },
      { text: 'Idea generator', axes: {N:2,E:1} },
      { text: 'Quiet supporter behind the scenes', axes: {F:2,I:1} },
      { text: 'Silent executor who gets things done', axes: {S:1,T:1,I:1} },
    ]},
    { text: 'How do you express emotions?', opts: [
      { text: 'Feelings show immediately on my face', axes: {F:2,E:1} },
      { text: 'Look cool on outside, burning inside', axes: {I:2,T:1} },
      { text: 'Generally upbeat and positive', axes: {E:2,F:1} },
      { text: 'Rarely show emotions outwardly', axes: {I:3,T:1} },
    ]},
    { text: "What's your stance on the future?", opts: [
      { text: 'Make a solid plan and execute steadily', axes: {J:3,S:1} },
      { text: 'Dream big and start moving', axes: {N:2,E:1} },
      { text: 'Whatever will be, enjoy the now', axes: {P:3} },
      { text: 'Plan carefully, anticipating worst cases', axes: {T:2,J:1} },
    ]},
    { text: 'What kind of anime do you like most?', opts: [
      { text: 'Friendship, effort, hot-blooded battles', axes: {E:1,F:1} },
      { text: 'Mystery, mind games, strategy', axes: {N:2,T:2} },
      { text: 'Slice-of-life, romance, heartwarming', axes: {F:2,S:1} },
      { text: 'Fantasy, sci-fi, deep world-building', axes: {N:3} },
    ]},
    { text: 'What matters most in relationships?', opts: [
      { text: 'Honesty and no pretense', axes: {T:2,J:1} },
      { text: 'Warmth and compassion', axes: {F:3} },
      { text: 'Trust and long-lasting bonds', axes: {J:1,F:1} },
      { text: 'Excitement and new connections', axes: {E:2,N:1} },
    ]},
    { text: 'When you fail, you...', opts: [
      { text: 'Immediately analyze what went wrong', axes: {T:2,J:1} },
      { text: 'Feel down for a while, then rise again', axes: {F:2,I:1} },
      { text: 'Quickly switch gears: "Next time!"', axes: {E:2,P:1} },
      { text: 'Talk to someone to feel better', axes: {F:1,E:2} },
    ]},
    { text: "Someone tells you their secret. You...", opts: [
      { text: 'Keep it no matter what', axes: {F:2,J:1} },
      { text: "Might tell if it's truly for their benefit", axes: {T:1,J:1} },
      { text: 'Feel a bit burdened by heavy secrets', axes: {I:1,P:1} },
      { text: "Feel happy that they trust you", axes: {F:1,E:1} },
    ]},
    { text: 'What character/class do you pick in games?', opts: [
      { text: 'Front-line warrior / attacker', axes: {E:1,S:1} },
      { text: 'Tactical mage / strategist', axes: {N:1,T:2} },
      { text: 'Party healer / support', axes: {F:3} },
      { text: 'Ranged archer / sniper', axes: {I:2,T:1} },
    ]},
    { text: "How do you overcome a slump?", opts: [
      { text: 'Get energy from friends or your favorite things', axes: {F:2,E:1} },
      { text: "Pump yourself up: \"I'll definitely do it!\"", axes: {T:1,J:1} },
      { text: 'Rest and change the scenery first', axes: {I:2,P:1} },
      { text: 'Revisit your goals and rebuild your plan', axes: {J:2,N:1} },
    ]},
    { text: "What's your ideal hero?", opts: [
      { text: 'An indomitable hero who protects no matter what', axes: {F:1,J:1,E:1} },
      { text: 'A genius who outsmarts every opponent', axes: {N:2,T:2} },
      { text: 'A mood-maker who brings smiles everywhere', axes: {E:3,F:1} },
      { text: 'A silent supporter who holds things together', axes: {I:2,F:2} },
    ]},
    { text: "Your greatest strength is?", opts: [
      { text: 'Social skills — I can befriend anyone', axes: {E:3} },
      { text: 'Calm analytical thinking and judgment', axes: {T:3} },
      { text: 'Deep empathy and understanding others', axes: {F:3} },
      { text: 'Creative and original thinking', axes: {N:3} },
    ]},
    { text: "Ultimately, which personality appeals to you most?", opts: [
      { text: 'Passionate, loyal protagonist type', axes: {E:2,F:2} },
      { text: 'Genius who moves the world with intellect', axes: {T:2,N:2} },
      { text: 'Gentle, beloved healer type', axes: {F:2,I:1} },
      { text: 'Free-spirited wanderer type', axes: {P:2,N:2} },
    ]},
  ],
};

// ══════════════════════════════════════════════════════════════
// キャラクターデータ / Characters (20 — research-based)
// ══════════════════════════════════════════════════════════════
const CHARACTERS = [
  {
    id:'naruto', icon:'🍥',
    name:  {ja:'うずまきナルト',       en:'Naruto Uzumaki'},
    series:{ja:'NARUTO -ナルト-',      en:'Naruto'},
    type:  {ja:'熱血主人公 (ENFP)',    en:'Hot-Blooded Hero (ENFP)'},
    profile:{E:4,F:4,N:2,P:3},
    desc:{
      ja:'どんな逆境でも諦めない信念と、仲間への深い愛情を持つ熱血主人公タイプ。空元気でなく本物の熱さで周りを引っ張る存在。誰に対しても正直で、その純粋さが人の心を動かします。',
      en:'A hot-blooded hero who never gives up regardless of adversity, driven by genuine passion and deep bonds with friends. Your honesty and pure spirit move those around you.',
    },
    traits:{
      ja:['熱血漢','諦めない','仲間思い','情熱的','正直'],
      en:['Hot-Blooded','Never Gives Up','Loyal','Passionate','Honest'],
    },
    radar:[90,60,85,70,40,80],
  },
  {
    id:'lelouch', icon:'♟️',
    name:  {ja:'ルルーシュ・ランペルージ',en:'Lelouch Lamperouge'},
    series:{ja:'コードギアス',           en:'Code Geass'},
    type:  {ja:'知略の天才 (INTJ)',      en:'Strategic Genius (INTJ)'},
    profile:{I:3,T:4,N:4,J:4},
    desc:{
      ja:'卓越した知性と戦略眼で物事を動かす天才タイプ。感情を表に出さないが、深いところに強い信念と目的を持ちます。チェスの如く先を読み、周囲より数手先に存在しています。',
      en:"A strategic genius who moves events with razor-sharp intellect. Calm on the surface but burning with conviction inside. Always several moves ahead — like a chess grandmaster.",
    },
    traits:{
      ja:['知略派','冷静','カリスマ','強い意志','完璧主義'],
      en:['Strategist','Composed','Charismatic','Iron Will','Perfectionist'],
    },
    radar:[95,50,40,90,85,60],
  },
  {
    id:'violet', icon:'✉️',
    name:  {ja:'ヴァイオレット・エヴァーガーデン',en:'Violet Evergarden'},
    series:{ja:'ヴァイオレット・エヴァーガーデン',en:'Violet Evergarden'},
    type:  {ja:'純粋な成長型 (ISFJ)',  en:'Earnest Grower (ISFJ)'},
    profile:{I:3,F:4,S:2,J:3},
    desc:{
      ja:'人の感情を一生懸命理解しようとする純粋さと、深い共感力を持つタイプ。誠実で真摯な態度が多くの人の心を動かします。言葉の重さを誰よりも知っている存在。',
      en:'Someone who earnestly strives to understand human emotions with deep sincerity. Your honest, devoted nature touches people profoundly. You understand the weight of words better than anyone.',
    },
    traits:{
      ja:['誠実','純粋','共感力','努力家','繊細'],
      en:['Sincere','Pure','Empathetic','Hard Worker','Sensitive'],
    },
    radar:[70,90,55,65,75,85],
  },
  {
    id:'killua', icon:'⚡',
    name:  {ja:'キルア・ゾルディック',en:'Killua Zoldyck'},
    series:{ja:'HUNTER×HUNTER',      en:'Hunter x Hunter'},
    type:  {ja:'クールな実力者 (ISTP)',en:'Cool Prodigy (ISTP)'},
    profile:{I:3,T:3,N:2,P:3},
    desc:{
      ja:'天才的な才能を持ちながら飄々としているクールタイプ。普段は感情を見せないが、心を許した人への忠誠心は絶対的。自由を愛し、縛られることを嫌います。',
      en:"A gifted prodigy who stays cool and nonchalant. Rarely shows emotions, but shows absolute loyalty to those they trust. Loves freedom and hates being constrained.",
    },
    traits:{
      ja:['クール','天才肌','情に厚い（隠れ）','速い判断','自由人'],
      en:['Cool','Prodigy','Secretly Warm','Quick Judgment','Free Spirit'],
    },
    radar:[85,55,65,80,60,50],
  },
  {
    id:'anya', icon:'🥜',
    name:  {ja:'アーニャ・フォージャー',en:'Anya Forger'},
    series:{ja:'SPY×FAMILY',           en:'SPY×FAMILY'},
    type:  {ja:'ムードメーカー (ESFP)', en:'Mood Maker (ESFP)'},
    profile:{E:4,F:2,S:3,P:4},
    desc:{
      ja:'どこにいても場を和ませる天才的なムードメーカー。予測不能な行動で周りを笑顔にします。好奇心旺盛で新しいことが大好き。空気を読みながら場を楽しみます。',
      en:'A natural mood maker who brightens any room. Unpredictable actions bring smiles everywhere. Overflowing with curiosity and thrives on new experiences.',
    },
    traits:{
      ja:['ムードメーカー','好奇心旺盛','天真爛漫','行動力','人懐っこい'],
      en:['Mood Maker','Curious','Carefree','Action-Oriented','Friendly'],
    },
    radar:[60,75,90,45,50,92],
  },
  {
    id:'levi', icon:'⚔️',
    name:  {ja:'リヴァイ・アッカーマン',en:'Levi Ackerman'},
    series:{ja:'進撃の巨人',            en:'Attack on Titan'},
    type:  {ja:'孤高の守護者 (ISTP)',   en:'Lone Guardian (ISTP)'},
    profile:{I:3,T:4,S:3,J:4},
    desc:{
      ja:'無口で厳しいが、仲間を守るためなら全てを犠牲にする孤高の存在。高い実力と責任感、冷静な判断力の持ち主。本音を隠すほど仲間への愛情は深い。',
      en:'Quiet and stern, but will sacrifice everything to protect those under their care. Exceptional ability combined with responsibility and calm judgment.',
    },
    traits:{
      ja:['寡黙','高い実力','責任感','仲間を守る','完璧主義'],
      en:['Quiet','Highly Skilled','Responsible','Protective','Perfectionist'],
    },
    radar:[95,40,50,88,90,40],
  },
  {
    id:'tanjiro', icon:'🌊',
    name:  {ja:'竈門炭治郎',  en:'Tanjiro Kamado'},
    series:{ja:'鬼滅の刃',    en:'Demon Slayer'},
    type:  {ja:'優しき戦士 (ENFJ)',en:'Gentle Warrior (ENFJ)'},
    profile:{E:2,F:4,S:2,J:3},
    desc:{
      ja:'優しさと強さを両立させた理想の人物。誰に対しても誠実で、傷ついた敵にさえ寄り添える深い共感力と信念の強さがあります。温かい心が最大の武器。',
      en:'The ideal balance of kindness and strength. Sincere to everyone, even capable of compassion toward wounded enemies. Your warm heart is your greatest weapon.',
    },
    traits:{
      ja:['優しさ','誠実','信念','共感力','努力家'],
      en:['Kind','Sincere','Conviction','Empathetic','Hard Worker'],
    },
    radar:[80,95,75,75,70,88],
  },
  {
    id:'loid', icon:'🕵️',
    name:  {ja:'ロイド・フォージャー',  en:'Loid Forger'},
    series:{ja:'SPY×FAMILY',            en:'SPY×FAMILY'},
    type:  {ja:'万能の隠れ守り人 (INTJ)',en:'All-Rounder Protector (INTJ)'},
    profile:{I:2,T:3,N:3,J:4},
    desc:{
      ja:'完璧な計画と冷静な実行力で任務をこなすプロ。表向きはクールだが、内心は家族や大切な人への深い愛情を持つ意外と情の深いタイプ。',
      en:'A professional who executes perfect plans with calm precision. Cool on the outside, but deeply loving toward family and those who matter.',
    },
    traits:{
      ja:['計画的','冷静','責任感','情に厚い（隠れ）','マルチタスク'],
      en:['Methodical','Composed','Responsible','Secretly Warm','Multi-Tasker'],
    },
    radar:[88,65,60,85,80,68],
  },
  {
    id:'gon', icon:'🌿',
    name:  {ja:'ゴン・フリークス', en:'Gon Freecss'},
    series:{ja:'HUNTER×HUNTER', en:'Hunter x Hunter'},
    type:  {ja:'純粋な冒険者 (ENFP)',en:'Pure Adventurer (ENFP)'},
    profile:{E:3,N:3,F:2,P:4},
    desc:{
      ja:'純粋な好奇心と圧倒的な行動力で冒険する自由人。物事の本質を直感でつかみ、どんな困難も楽しみに変えてしまう天性の冒険者。',
      en:'A free spirit driven by pure curiosity and unstoppable drive. Grasps the essence of things by intuition and turns every challenge into an exciting adventure.',
    },
    traits:{
      ja:['好奇心','行動力','純粋','直感','楽観的'],
      en:['Curious','Driven','Pure','Intuitive','Optimistic'],
    },
    radar:[75,70,80,65,45,92],
  },
  {
    id:'gojo', icon:'🔵',
    name:  {ja:'五条悟',         en:'Satoru Gojo'},
    series:{ja:'呪術廻戦',       en:'Jujutsu Kaisen'},
    type:  {ja:'無敵のカリスマ (ENTP)',en:'Invincible Charisma (ENTP)'},
    profile:{E:4,N:4,T:3,P:2},
    desc:{
      ja:'圧倒的な実力と自信を持ちながら飄々としているカリスマ。頭の回転が速く、どんな状況でも余裕を見せます。強さの中に遊び心があり、人を惹きつけます。',
      en:"Overwhelming power meets breezy confidence. Lightning-fast thinker who stays relaxed in any situation. Mixes strength with playfulness in a way that draws everyone in.",
    },
    traits:{
      ja:['自信家','頭脳明晰','カリスマ','遊び心','圧倒的実力'],
      en:['Confident','Sharp Mind','Charismatic','Playful','Overwhelmingly Strong'],
    },
    radar:[92,50,88,85,65,55],
  },
  {
    id:'light', icon:'📓',
    name:  {ja:'夜神月',      en:'Light Yagami'},
    series:{ja:'デスノート',  en:'Death Note'},
    type:  {ja:'完璧主義の策士 (INTJ)',en:'Perfectionist Schemer (INTJ)'},
    profile:{I:3,T:4,N:3,J:4},
    desc:{
      ja:'完璧な頭脳と強い信念で世界を変えようとするタイプ。論理的で目標に向かってぶれない意志の強さを持ちます。高い理想と周到な計画が特徴。',
      en:'Driven to change the world with a perfect mind and unshakeable conviction. Logical, goal-focused, and never wavers. Known for lofty ideals and meticulous planning.',
    },
    traits:{
      ja:['高知能','強い意志','計画的','完璧主義','信念'],
      en:['High Intelligence','Iron Will','Methodical','Perfectionist','Conviction'],
    },
    radar:[88,35,45,95,90,55],
  },
  {
    id:'L', icon:'🍰',
    name:  {ja:'L・ローライト', en:'L Lawliet'},
    series:{ja:'デスノート',    en:'Death Note'},
    type:  {ja:'天才探偵 (INTP)',en:'Genius Detective (INTP)'},
    profile:{I:4,T:4,N:3,P:3},
    desc:{
      ja:'世界最高の探偵にして独特の思考回路を持つ天才。純粋な論理と直感の融合で不可能な謎を解きます。見た目は独特でも、内面は誠実な謎解き人間。',
      en:"The world's greatest detective with a uniquely wired mind. Solves the impossible by fusing pure logic with intuition. Eccentric on the outside, sincere on the inside.",
    },
    traits:{
      ja:['天才','論理的','独創的','観察眼','謎解き'],
      en:['Genius','Logical','Original','Keen Observer','Problem Solver'],
    },
    radar:[70,45,40,98,75,62],
  },
  {
    id:'edward', icon:'⚗️',
    name:  {ja:'エドワード・エルリック',en:'Edward Elric'},
    series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},
    type:  {ja:'情熱の天才 (ESTP)',    en:'Passionate Prodigy (ESTP)'},
    profile:{E:3,T:3,S:2,P:2},
    desc:{
      ja:'天才錬金術師でありながら血気盛んな熱血漢。知識と行動力を兼ね備え、失っても諦めずに前へ進みます。本質的には仲間思いの優しさを持っています。',
      en:'A genius alchemist with explosive energy and action. Combines knowledge with drive, and never stops moving forward no matter what is lost.',
    },
    traits:{
      ja:['天才','行動力','諦めない','仲間思い','熱血'],
      en:['Genius','Action-Oriented','Never Gives Up','Caring','Hot-Blooded'],
    },
    radar:[88,60,78,82,65,72],
  },
  {
    id:'shinobu', icon:'🦋',
    name:  {ja:'胡蝶しのぶ',  en:'Shinobu Kocho'},
    series:{ja:'鬼滅の刃',    en:'Demon Slayer'},
    type:  {ja:'静かな炎 (INFJ)',en:'Quiet Flame (INFJ)'},
    profile:{I:3,F:3,N:3,J:3},
    desc:{
      ja:'常に微笑みを絶やさないが、その奥には燃えるような信念と悲しみを秘めているタイプ。クールな見た目と深い情熱のギャップが魅力。',
      en:'Always smiling, yet concealing burning conviction and deep sorrow beneath the surface. The gap between cool exterior and fierce passion is the essence of your appeal.',
    },
    traits:{
      ja:['冷静','深い感情','信念','気配り','芯が強い'],
      en:['Composed','Deep Emotions','Conviction','Considerate','Inner Strength'],
    },
    radar:[78,82,58,80,78,76],
  },
  {
    id:'rohan', icon:'🖊️',
    name:  {ja:'岸辺露伴',             en:'Rohan Kishibe'},
    series:{ja:'ジョジョの奇妙な冒険', en:"JoJo's Bizarre Adventure"},
    type:  {ja:'孤高の芸術家 (INTJ)',   en:'Solitary Artist (INTJ)'},
    profile:{I:4,T:3,N:4,J:3},
    desc:{
      ja:'自分の芸術と信念に絶対の自信を持つ孤高の天才。知的好奇心が極めて強く、面白いもののためなら何でもする。プライドは高いが本質的には真摯。',
      en:'A solitary genius with absolute confidence in their art and convictions. Driven by insatiable intellectual curiosity. Proud but fundamentally sincere.',
    },
    traits:{
      ja:['孤高','高いプライド','創造的','知的好奇心','信念'],
      en:['Solitary','High Pride','Creative','Intellectually Curious','Principled'],
    },
    radar:[80,48,42,88,82,65],
  },
  {
    id:'yuji', icon:'💪',
    name:  {ja:'虎杖悠仁',  en:'Yuji Itadori'},
    series:{ja:'呪術廻戦',  en:'Jujutsu Kaisen'},
    type:  {ja:'明るき戦士 (ESFP)',en:'Cheerful Fighter (ESFP)'},
    profile:{E:2,F:3,S:3,P:3},
    desc:{
      ja:'明るく素直で、人の死に際に寄り添うことを信念とする熱い心の持ち主。運動神経抜群で行動力もあるが、本質は優しさと義理堅さ。',
      en:'Bright, honest, and committed to the belief that no one should die alone. Athletically gifted, but defined at the core by kindness and loyalty.',
    },
    traits:{
      ja:['明るい','優しい','正義感','行動力','義理堅い'],
      en:['Cheerful','Kind','Justice-Driven','Action-Oriented','Loyal'],
    },
    radar:[78,80,82,70,68,85],
  },
  {
    id:'mikasa', icon:'🎀',
    name:  {ja:'ミカサ・アッカーマン',en:'Mikasa Ackerman'},
    series:{ja:'進撃の巨人',          en:'Attack on Titan'},
    type:  {ja:'静かなる守り人 (ISTJ)',en:'Silent Protector (ISTJ)'},
    profile:{I:4,T:3,S:4,J:4},
    desc:{
      ja:'無口で感情表現は少ないが、守ると決めた人への献身は絶対的。高い実力と強い意志を持ちながら、誰よりも深く人を愛せるタイプ。',
      en:'Quiet with few words, but absolute in devotion to those they decide to protect. Exceptional ability and iron will, combined with the capacity to love more deeply than anyone.',
    },
    traits:{
      ja:['寡黙','献身的','高い実力','強い意志','深い愛情'],
      en:['Quiet','Devoted','Highly Skilled','Iron Will','Deep Love'],
    },
    radar:[95,60,42,85,92,65],
  },
  {
    id:'rimuru', icon:'💧',
    name:  {ja:'リムル・テンペスト',       en:'Rimuru Tempest'},
    series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},
    type:  {ja:'柔軟なリーダー (ENFP)',    en:'Flexible Leader (ENFP)'},
    profile:{E:3,F:3,N:3,P:4},
    desc:{
      ja:'柔軟な発想と誰とでも仲良くなれる親和力で仲間を増やしていくリーダータイプ。のんきそうに見えて実は大局を見抜く眼力を持っています。',
      en:'A leader who gathers allies through flexible thinking and natural approachability. Looks easygoing but sees the big picture clearly.',
    },
    traits:{
      ja:['柔軟','親和力','リーダー','楽観的','大局観'],
      en:['Flexible','Approachable','Leader','Optimistic','Big-Picture Thinker'],
    },
    radar:[72,78,85,70,72,88],
  },
  {
    id:'hachiman', icon:'🐟',
    name:  {ja:'比企谷八幡',               en:'Hachiman Hikigaya'},
    series:{ja:'やはり俺の青春ラブコメはまちがっている',en:'My Teen Romantic Comedy SNAFU'},
    type:  {ja:'独自の観察者 (INTP)',       en:'Lone Observer (INTP)'},
    profile:{I:4,T:4,N:3,P:2},
    desc:{
      ja:'ひねくれているように見えて、実は誰よりも鋭く本質を見抜く観察眼の持ち主。自己犠牲も厭わずに問題を解決しますが、「本物」を求める姿勢は誰にも負けません。',
      en:"Appears cynical, but actually possesses sharper insight into people's true nature than anyone. Solves problems through self-sacrifice and has an unmatched pursuit of what is \"genuine.\"",
    },
    traits:{
      ja:['観察眼','論理的','独自の価値観','本物を追求','自己犠牲'],
      en:['Observant','Logical','Unique Values','Seeks Genuineness','Self-Sacrificing'],
    },
    radar:[65,68,40,92,72,75],
  },
  {
    id:'zenitsu', icon:'🌩️',
    name:  {ja:'我妻善逸', en:'Zenitsu Agatsuma'},
    series:{ja:'鬼滅の刃', en:'Demon Slayer'},
    type:  {ja:'意外な実力者 (ESFP)',en:'Surprising Achiever (ESFP)'},
    profile:{E:3,F:4,S:3,P:3},
    desc:{
      ja:'普段は泣き虫で臆病に見えるが、大切な人を守るときは誰よりも勇敢になれるタイプ。感情豊かで人の優しさや悪意を瞬時に感じ取れる高い共感力を持っています。',
      en:'Usually appears cowardly, but becomes braver than anyone when protecting someone important. Emotionally rich with high empathy — instantly senses kindness and malice in others.',
    },
    traits:{
      ja:['感情豊か','共感力','本番で輝く','人想い','実は強い'],
      en:['Emotional','Empathetic','Shines When It Counts','Caring','Surprisingly Strong'],
    },
    radar:[65,88,78,58,60,90],
  },
  {
    id:'deku', icon:'🥦',
    name:  {ja:'緑谷出久（デク）',      en:'Izuku Midoriya (Deku)'},
    series:{ja:'僕のヒーローアカデミア', en:'My Hero Academia'},
    type:  {ja:'理想を追う英雄 (INFJ)',  en:'Idealist Hero (INFJ)'},
    profile:{I:2,F:4,N:4,J:3},
    desc:{
      ja:'強い共感力と未来への洞察力を持つ理想主義的な英雄候補。誰かが傷ついている姿を見ると放っておけない純粋な優しさと、圧倒的な分析力・行動力が共存しています。',
      en:'An idealistic hero-in-training with deep empathy and visionary insight. Cannot ignore someone in pain — combines extraordinary compassion with sharp analytical ability and drive.',
    },
    traits:{
      ja:['共感力','理想主義','分析力','献身的','成長志向'],
      en:['Empathetic','Idealistic','Analytical','Devoted','Growth-Minded'],
    },
    radar:[72,88,65,80,78,85],
  },
  {
    id:'bakugo', icon:'💥',
    name:  {ja:'爆豪勝己',              en:'Katsuki Bakugo'},
    series:{ja:'僕のヒーローアカデミア', en:'My Hero Academia'},
    type:  {ja:'爆発的リーダー (ENTJ)', en:'Explosive Leader (ENTJ)'},
    profile:{E:3,T:4,N:3,J:4},
    desc:{
      ja:'誰よりも高い目標を掲げ、妥協を一切許さない爆発的な意志の持ち主。口は悪く強引に見えるが、勝利への執念と仲間への責任感は人一倍強い。',
      en:'Sets higher goals than anyone and never compromises. Rough around the edges, but his obsession with victory and deep sense of responsibility make him a born leader.',
    },
    traits:{
      ja:['強い意志','競争心','リーダー','責任感','負けず嫌い'],
      en:['Iron Will','Competitive','Natural Leader','Responsible','Never Settles'],
    },
    radar:[92,45,72,85,80,50],
  },
  {
    id:'eren', icon:'🦅',
    name:  {ja:'エレン・イェーガー',  en:'Eren Yeager'},
    series:{ja:'進撃の巨人',          en:'Attack on Titan'},
    type:  {ja:'自由を渇望する者 (INFP)', en:'Freedom Seeker (INFP)'},
    profile:{I:2,F:3,N:4,P:3},
    desc:{
      ja:'自由への強烈な渇望と深い信念を持つ理想主義者。感情豊かで思いやりがあるが、目標のためには全てを犠牲にする側面も。その純粋さと激しさが多くの人を惹きつけます。',
      en:'An intense idealist with a burning desire for freedom and deep personal conviction. Emotional and compassionate, yet willing to sacrifice everything for a goal. Pure intensity draws others in.',
    },
    traits:{
      ja:['自由への渇望','強い信念','感情的','理想主義','行動力'],
      en:['Craves Freedom','Deep Conviction','Emotional','Idealistic','Driven'],
    },
    radar:[80,70,65,72,65,78],
  },
  {
    id:'frieren', icon:'🧙',
    name:  {ja:'フリーレン',       en:'Frieren'},
    series:{ja:'葬送のフリーレン', en:"Frieren: Beyond Journey's End"},
    type:  {ja:'千年の魔法使い (INTP)', en:'Millennial Mage (INTP)'},
    profile:{I:4,T:4,N:4,P:3},
    desc:{
      ja:'千年を生きた魔法使いとして、物事を淡々と観察し続ける分析家。感情表現は苦手だが、人間の心を理解しようと静かに努力し続ける姿が多くの人の共感を呼びます。',
      en:'A millennium-old mage who calmly observes the world with analytical eyes. Struggles to express emotion, but quietly keeps trying to understand the human heart — a journey many find deeply relatable.',
    },
    traits:{
      ja:['分析的','淡々','魔法研究','長命','静かな成長'],
      en:['Analytical','Calm','Magic Research','Ageless','Quiet Growth'],
    },
    radar:[60,65,42,95,72,80],
  },
  {
    id:'bocchi', icon:'🎸',
    name:  {ja:'後藤ひとり（ぼっち）', en:'Hitori Goto (Bocchi)'},
    series:{ja:'ぼっち・ざ・ろっく！',  en:'Bocchi the Rock!'},
    type:  {ja:'孤独な天才 (ISFP)',     en:'Solitary Genius (ISFP)'},
    profile:{I:4,F:3,S:2,P:3},
    desc:{
      ja:'極度の人見知りと強烈な内向性を持ちながら、ギターへの情熱は誰にも負けない天才肌。一人でいることを好むが、音楽を通じて心の底にある感情を爆発させます。',
      en:'Cripplingly shy and deeply introverted, yet a guitar genius with unmatched passion. Prefers solitude, but explodes with raw emotion through music.',
    },
    traits:{
      ja:['内向的','音楽の天才','繊細','創造的','真剣'],
      en:['Introverted','Guitar Genius','Sensitive','Creative','Earnest'],
    },
    radar:[35,75,28,68,62,90],
  },
  {
    id:'laios', icon:'🐉',
    name:  {ja:'ライオス・タンデン', en:'Laios Touden'},
    series:{ja:'ダンジョン飯',       en:'Delicious in Dungeon'},
    type:  {ja:'型破りな探究者 (ENTP)', en:'Unconventional Explorer (ENTP)'},
    profile:{E:2,T:3,N:4,P:4},
    desc:{
      ja:'モンスター愛と食への好奇心が融合した独創的な探求者。常識にとらわれず、誰も思いつかないアイデアで難局を乗り越えます。周りを巻き込む不思議なカリスマを持っています。',
      en:'A unique explorer where monster love and culinary curiosity collide. Ignores convention and overcomes challenges with ideas nobody else would think of. Has a strange charisma that draws people in.',
    },
    traits:{
      ja:['好奇心旺盛','独創的','型破り','行動力','モンスターオタク'],
      en:['Curious','Original','Unconventional','Action-Oriented','Monster Enthusiast'],
    },
    radar:[65,58,72,80,55,82],
  },
  {
    id:'maomao', icon:'🌿',
    name:  {ja:'猫猫（マオマオ）',  en:'Maomao'},
    series:{ja:'薬屋のひとりごと', en:'The Apothecary Diaries'},
    type:  {ja:'冷静な薬学者 (INTP)', en:'Calm Pharmacist (INTP)'},
    profile:{I:3,T:4,N:3,P:3},
    desc:{
      ja:'感情に流されず論理と知識で謎を解く薬師。毒と薬の知識は天才的で、好奇心旺盛ながらも常に冷静。鋭い観察眼と分析力で周囲を驚かせ続けます。',
      en:'A pharmacist who solves mysteries with logic and knowledge, unmoved by emotion. Genius with poisons and medicines; curious yet always calm. Sharp observation and analysis constantly surprises those around her.',
    },
    traits:{
      ja:['論理的','観察眼','薬学知識','冷静','好奇心'],
      en:['Logical','Keen Observer','Pharmacology Expert','Calm','Curious'],
    },
    radar:[58,55,42,92,70,75],
  },
  {
    id:'shirogane', icon:'👑',
    name:  {ja:'白銀御行',                  en:'Miyuki Shirogane'},
    series:{ja:'かぐや様は告らせたい',      en:'Kaguya-sama: Love Is War'},
    type:  {ja:'努力の王者 (ESTJ)',          en:'King of Effort (ESTJ)'},
    profile:{E:2,T:3,S:3,J:4},
    desc:{
      ja:'才能よりも圧倒的な努力で頂点を目指すエリート生徒会長。高い責任感とリーダーシップで周囲を牽引します。内心はロマンチックで不器用ながら、その努力量は誰にも負けません。',
      en:'An elite student council president who reaches the top through sheer effort rather than natural talent. High responsibility and strong leadership. Secretly romantic and clumsy, but his work ethic is unmatched.',
    },
    traits:{
      ja:['努力家','リーダー','責任感','完璧主義','ロマンチスト（隠れ）'],
      en:['Hard Worker','Leader','Responsible','Perfectionist','Secret Romantic'],
    },
    radar:[80,62,78,82,88,68],
  },
  {
    id:'rem', icon:'💙',
    name:  {ja:'レム',                       en:'Rem'},
    series:{ja:'Re:ゼロから始める異世界生活', en:'Re:Zero'},
    type:  {ja:'絶対的な守り人 (ISFJ)',       en:'Absolute Protector (ISFJ)'},
    profile:{I:2,F:4,S:3,J:4},
    desc:{
      ja:'献身と愛の化身とも言える存在。大切な人のためなら命も惜しまない深い忠誠心と誰よりも強い意志を持っています。鬼の力で戦う姿と内なる優しさのギャップが魅力。',
      en:'The embodiment of devotion and love. Absolute loyalty to those she cares about — willing to give her life without hesitation. The contrast between her power in battle and her inner gentleness defines her charm.',
    },
    traits:{
      ja:['献身的','深い愛情','強さ','忠誠心','純粋'],
      en:['Devoted','Deep Love','Strength','Loyal','Pure'],
    },
    radar:[80,95,65,72,85,88],
  },
  {
    id:'denji', icon:'🪚',
    name:  {ja:'デンジ',        en:'Denji'},
    series:{ja:'チェンソーマン', en:'Chainsaw Man'},
    type:  {ja:'衝動的な野生児 (ESTP)', en:'Impulsive Wild Card (ESTP)'},
    profile:{E:3,T:2,S:4,P:4},
    desc:{
      ja:'シンプルな欲望に正直に生きる衝動的な少年。深く考えず今この瞬間を最大限に生きます。荒削りで不器用だが、その純粋さと捨て身の行動力が周囲の心を動かします。',
      en:"A boy who lives honestly according to simple desires. Doesn't think deeply — just maximizes the present moment. Rough and clumsy, but his raw honesty and all-or-nothing drive moves those around him.",
    },
    traits:{
      ja:['衝動的','正直','今を生きる','行動力','純粋'],
      en:['Impulsive','Honest','Lives in the Now','Action-Oriented','Pure'],
    },
    radar:[78,55,72,62,42,85],
  },
  {
    id:'nezuko', icon:'🌸',
    name:  {ja:'竈門禰豆子',  en:'Nezuko Kamado'},
    series:{ja:'鬼滅の刃',    en:'Demon Slayer'},
    type:  {ja:'家族想いの守護者 (ESFJ)', en:'Family Guardian (ESFJ)'},
    profile:{E:2,F:4,S:4,J:3},
    desc:{
      ja:'言葉を持たずとも、行動と表情で深い愛情を示す存在。家族と大切な人を守るためなら全力を尽くす献身的な性格で、周りの人を自然と温かく包み込みます。',
      en:'Expresses deep love through actions and expressions without words. Utterly devoted to protecting family and loved ones, she naturally wraps those around her in warmth.',
    },
    traits:{
      ja:['家族想い','献身的','温かさ','強さ','純粋'],
      en:['Family-Oriented','Devoted','Warmth','Strong','Pure'],
    },
    radar:[72,92,78,55,80,95],
  },
  {
    id:'rengoku', icon:'🔥',
    name:  {ja:'煉獄杏寿郎',  en:'Kyojuro Rengoku'},
    series:{ja:'鬼滅の刃',    en:'Demon Slayer'},
    type:  {ja:'燃える柱 (ENFJ)', en:'Blazing Pillar (ENFJ)'},
    profile:{E:4,F:3,N:2,J:4},
    desc:{
      ja:'炎のような情熱と揺るぎない信念で周囲を鼓舞する炎柱。弱者を守ることを使命とし、どんな困難も笑顔で正面から受け止める不動の精神力の持ち主。',
      en:'Inspires everyone around him with flame-like passion and unshakeable conviction. Takes the protection of the weak as his mission and faces every difficulty head-on with a smile.',
    },
    traits:{
      ja:['情熱的','鼓舞する','強い信念','正義','明るさ'],
      en:['Passionate','Inspiring','Strong Conviction','Just','Bright Spirit'],
    },
    radar:[90,78,85,75,88,80],
  },
  {
    id:'luffy', icon:'⛵',
    name:  {ja:'モンキー・D・ルフィ', en:'Monkey D. Luffy'},
    series:{ja:'ワンピース',          en:'One Piece'},
    type:  {ja:'自由の船長 (ESFP)',   en:'Captain of Freedom (ESFP)'},
    profile:{E:4,F:3,S:4,P:4},
    desc:{
      ja:'計画も打算もなく、ただ自由と仲間のために突き進む天性のカリスマ。今この瞬間を全力で生きる姿が自然と人を惹きつけ、海賊王の座を目指す旅に誰もが巻き込まれていきます。',
      en:'A natural charisma who charges ahead for freedom and friends with no plan or calculation. Lives this moment with everything he has — people are naturally drawn in and swept along on the journey to become King of the Pirates.',
    },
    traits:{
      ja:['自由奔放','仲間思い','行動力','直感','無計画'],
      en:['Free-Spirited','Loyal to Crew','Action-Driven','Instinctive','Unplanned'],
    },
    radar:[88,80,95,58,55,95],
  },
  {
    id:'fushiguro', icon:'🐾',
    name:  {ja:'伏黒恵',    en:'Megumi Fushiguro'},
    series:{ja:'呪術廻戦', en:'Jujutsu Kaisen'},
    type:  {ja:'冷徹な術師 (ISTJ)', en:'Ruthless Sorcerer (ISTJ)'},
    profile:{I:3,T:4,S:3,J:4},
    desc:{
      ja:'感情より理性・ルールを優先し、常に冷静に状況を分析する実力派術師。「ふさわしい人間を助ける」という独自の価値観と、圧倒的な戦術眼を持っています。',
      en:"A highly capable sorcerer who prioritizes reason and rules over emotion, always calmly analyzing the situation. Holds a unique philosophy of 'helping those who deserve it' backed by extraordinary tactical vision.",
    },
    traits:{
      ja:['冷静','論理的','独自の価値観','実力主義','責任感'],
      en:['Calm','Logical','Unique Values','Meritocratic','Responsible'],
    },
    radar:[80,45,42,88,85,55],
  },
  {
    id:'rin', icon:'🔵',
    name:  {ja:'糸師凛',    en:'Rin Itoshi'},
    series:{ja:'ブルーロック', en:'Blue Lock'},
    type:  {ja:'孤高のエゴイスト (INTJ)', en:'Solitary Egoist (INTJ)'},
    profile:{I:4,T:4,N:3,J:4},
    desc:{
      ja:'兄への強烈なライバル心と冷徹な分析力で世界一のストライカーを目指す孤高の天才。感情を排除した超合理的な思考と、圧倒的な技術の研鑽が特徴。',
      en:'A solitary genius aiming to become the world\'s best striker, fueled by intense rivalry with his brother and cold analytical thinking. Defined by hyper-rational thought that eliminates emotion and relentless technical refinement.',
    },
    traits:{
      ja:['孤高','冷徹','高い実力','ライバル意識','完璧主義'],
      en:['Solitary','Cold','Highly Skilled','Rival-Driven','Perfectionist'],
    },
    radar:[88,38,42,92,88,58],
  },
  {
    id:'zoro', icon:'⚔️',
    name:  {ja:'ロロノア・ゾロ', en:'Roronoa Zoro'},
    series:{ja:'ワンピース',     en:'One Piece'},
    type:  {ja:'孤高の剣士 (ISTP)', en:'Lone Swordsman (ISTP)'},
    profile:{I:4,T:4,S:4,P:2},
    desc:{
      ja:'口数少なく、ただ剣の道を極めることだけに人生を捧げる孤高の剣士。仲間との絆は深いが、感情を表に出さず、圧倒的な実力と行動で示す。目標に対してはどこまでも一途。',
      en:'A solitary swordsman of few words, dedicating his life entirely to mastering the blade. Deep bonds with crewmates but shows it through overwhelming strength and action rather than words. Utterly single-minded toward his goal.',
    },
    traits:{
      ja:['寡黙','高い実力','一途','行動重視','強い意志'],
      en:['Quiet','Highly Skilled','Single-Minded','Action-Focused','Iron Will'],
    },
    radar:[92,42,50,85,90,55],
  },
  {
    id:'goku', icon:'⭐',
    name:  {ja:'孫悟空',         en:'Son Goku'},
    series:{ja:'ドラゴンボール超', en:'Dragon Ball Super'},
    type:  {ja:'純粋なる戦士 (ESFP)', en:'Pure-Hearted Fighter (ESFP)'},
    profile:{E:3,F:2,S:4,P:4},
    desc:{
      ja:'強い相手と戦うことだけが生きがいの純粋な戦闘狂。計画もなく今この瞬間の強さへの本能で動く天才。家族や仲間への愛情は本物だが、それより強敵との戦いを優先してしまう不思議な魅力。',
      en:'A pure-hearted battle enthusiast who lives for fighting strong opponents. Moves purely on instinct toward strength in this moment with no plans. Genuine love for family and friends, but somehow always prioritizes the next great fight.',
    },
    traits:{
      ja:['純粋','行動力','戦闘本能','楽観的','天才肌'],
      en:['Pure-Hearted','Action-Oriented','Battle Instinct','Optimistic','Natural Genius'],
    },
    radar:[95,55,82,65,50,95],
  },
  {
    id:'mitsuri', icon:'💚',
    name:  {ja:'甘露寺蜜璃',  en:'Mitsuri Kanroji'},
    series:{ja:'鬼滅の刃',    en:'Demon Slayer'},
    type:  {ja:'愛の柱 (ESFJ)', en:'Pillar of Love (ESFJ)'},
    profile:{E:3,F:4,S:3,J:3},
    desc:{
      ja:'誰に対しても全力で愛情を注ぐ恋柱。明るく感情豊かで、仲間を思いやる優しさは誰にも負けません。しなやかな剣技と天性の愛情深さで周囲を守ります。',
      en:'The Love Pillar who pours everything into caring for others. Bright, emotionally rich, with unmatched warmth and consideration for her allies. Protects those around her with graceful swordsmanship and boundless love.',
    },
    traits:{
      ja:['愛情深い','感情豊か','仲間想い','明るさ','献身的'],
      en:['Loving','Emotionally Rich','Caring','Cheerful','Devoted'],
    },
    radar:[75,95,88,55,72,90],
  },
  {
    id:'natsume', icon:'📖',
    name:  {ja:'夏目貴志',  en:'Takashi Natsume'},
    series:{ja:'夏目友人帳', en:"Natsume's Book of Friends"},
    type:  {ja:'孤独な共感者 (INFP)', en:'Solitary Empath (INFP)'},
    profile:{I:3,F:4,N:3,P:3},
    desc:{
      ja:'妖怪が見える孤独な少年が、妖怪たちと心を通わせる中で少しずつ成長していく。繊細で傷つきやすいが、深い共感力と優しさで妖怪も人間も受け入れる温かい心の持ち主。',
      en:'A lonely boy who can see spirits gradually grows through connecting with them. Sensitive and easily hurt, but possesses deep empathy and warmth that accepts both spirits and humans alike.',
    },
    traits:{
      ja:['繊細','共感力','内向的','温かさ','優しさ'],
      en:['Sensitive','Empathetic','Introverted','Warmth','Kind'],
    },
    radar:[55,90,45,72,65,88],
  },
  {
    id:'mob', icon:'👤',
    name:  {ja:'影山茂夫（モブ）', en:'Shigeo Kageyama (Mob)'},
    series:{ja:'モブサイコ100',     en:'Mob Psycho 100'},
    type:  {ja:'静かなる超能力者 (INFJ)', en:'Silent Esper (INFJ)'},
    profile:{I:4,F:3,N:3,J:2},
    desc:{
      ja:'圧倒的な超能力を持ちながら、人に頼られることより自分自身の成長を望む内向的な少年。感情を抑圧するほど内側に強い意志を秘めており、爆発した瞬間のカタルシスが圧巻。',
      en:'A boy with overwhelming psychic power who desires personal growth more than being relied on. The more he suppresses his emotions, the stronger his inner conviction grows — making the moment of release truly breathtaking.',
    },
    traits:{
      ja:['内向的','強い意志','感情抑圧','成長志向','純粋'],
      en:['Introverted','Inner Strength','Emotional Restraint','Growth-Oriented','Pure'],
    },
    radar:[55,82,48,78,68,88],
  },

  // ── NARUTO ───────────────────────────────────────────────────
  {id:'sasuke',icon:'🔥',name:{ja:'うちはサスケ',en:'Sasuke Uchiha'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'孤高の天才 (INTJ)',en:'Lone Genius (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'復讐を誓い孤独な道を歩む天才。冷静な判断力と圧倒的な実力を持ち、心の奥に秘めた感情は誰よりも深い。',en:'A genius who walks a solitary path of revenge. Calm judgment and overwhelming power hide deeper emotions than anyone.'},traits:{ja:['孤高','天才','復讐心','冷静','強い意志'],en:['Lone Wolf','Genius','Vengeful','Calm','Iron Will']},radar:[88,42,38,95,90,52]},
  {id:'sakura',icon:'🌸',name:{ja:'春野サクラ',en:'Sakura Haruno'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'医療忍者の鑑 (ENFJ)',en:'Model Medical Ninja (ENFJ)'},profile:{E:2,F:3,N:2,J:3},desc:{ja:'感情豊かで仲間想い、自分を超えるために絶え間なく努力し続ける成長型の忍者。医療忍術の天才として周囲を支える力を持っている。',en:'Emotional, caring, and constantly striving to surpass herself. A medical jutsu genius whose strength lies in supporting those around her.'},traits:{ja:['感情的','成長志向','医療の天才','仲間想い','粘り強い'],en:['Emotional','Growth-Oriented','Medical Genius','Caring','Tenacious']},radar:[65,85,72,68,70,72]},
  {id:'kakashi',icon:'📖',name:{ja:'はたけカカシ',en:'Kakashi Hatake'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'天才コピー忍者 (INTP)',en:'Copy Ninja (INTP)'},profile:{I:3,T:3,N:3,P:2},desc:{ja:'千の術をコピーした天才忍者。飄々とした態度の裏に深い洞察力と過去の傷を持ち、弟子たちを陰から支える。',en:'A genius ninja who copied 1,000 techniques. Behind his easygoing demeanor lies deep insight and past wounds, always supporting his students from the shadows.'},traits:{ja:['天才','飄々','洞察力','慎重','師匠気質'],en:['Genius','Easygoing','Perceptive','Cautious','Mentor Type']},radar:[88,62,68,92,80,70]},
  {id:'hinata',icon:'💜',name:{ja:'日向ヒナタ',en:'Hinata Hyuga'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'静かな決意 (ISFJ)',en:'Quiet Determination (ISFJ)'},profile:{I:3,F:4,S:2,J:3},desc:{ja:'引っ込み思案だが心の奥には強い決意を秘めている。大切な人のためなら自分を犠牲にできる献身的な愛情と、白眼の使い手としての実力を持つ。',en:'Shy on the outside but with deep inner resolve. Capable of self-sacrifice for those she loves, with formidable skill as a Byakugan user.'},traits:{ja:['内向的','献身的','強い決意','優しさ','成長'],en:['Introverted','Devoted','Inner Resolve','Kind','Growth']},radar:[60,90,50,72,75,88]},
  {id:'gaara',icon:'🏜️',name:{ja:'我愛羅',en:'Gaara'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'孤独から愛へ (INFJ)',en:'From Solitude to Love (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'孤独の中で砂を操り生きてきた男が、絆の力を知り風影へと成長する。静かなカリスマ性と深い洞察力で砂の里を率いる。',en:'A man who lived manipulating sand in solitude discovers the power of bonds and grows into the Kazekage. Leads the Sand Village with quiet charisma and deep insight.'},traits:{ja:['孤独','成長','静かなカリスマ','深い洞察','保護者'],en:['Solitary','Growth','Quiet Charisma','Deep Insight','Protector']},radar:[78,70,55,88,82,65]},
  {id:'rock_lee',icon:'💥',name:{ja:'ロック・リー',en:'Rock Lee'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'努力の天才 (ESFJ)',en:'Genius of Hard Work (ESFJ)'},profile:{E:3,F:3,S:4,J:4},desc:{ja:'忍術も幻術も使えないが、体術だけで天才たちに挑む不屈の努力家。情熱と根性は誰にも負けず、仲間への思いやりも深い。',en:'Unable to use ninjutsu or genjutsu, yet challenges geniuses with taijutsu alone. Unmatched passion and grit, with deep care for those around him.'},traits:{ja:['努力家','不屈','熱血','仲間想い','根性'],en:['Hard Worker','Indomitable','Hot-Blooded','Caring','Guts']},radar:[88,75,85,55,78,90]},
  {id:'itachi',icon:'🪶',name:{ja:'うちはイタチ',en:'Itachi Uchiha'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'静かなる英雄 (INFJ)',en:'Silent Hero (INFJ)'},profile:{I:4,F:3,N:4,J:4},desc:{ja:'一族を滅ぼした罪を一人で背負いながら、弟を守るため汚名に甘んじた真の英雄。深い洞察力と計算された行動の裏に、誰も知らない深い愛情がある。',en:'A true hero who bore the crime of destroying his clan alone to protect his brother. Behind deep insight and calculated actions lies a love that no one knew.'},traits:{ja:['自己犠牲','深謀','静かな愛','孤独','英雄'],en:['Self-Sacrificing','Deep Strategist','Silent Love','Solitary','Hero']},radar:[82,68,42,98,92,65]},
  {id:'jiraiya',icon:'📚',name:{ja:'自来也',en:'Jiraiya'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'伝説の三忍 (ENFP)',en:'Legendary Sannin (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'カエルを使い小説を書く豪快な忍者。見た目は軽薄だが、教え子への愛情と平和への願いは本物。ナルトにとって最も大切な師匠の一人。',en:'A flamboyant ninja who uses frogs and writes novels. Beneath the carefree exterior lies genuine love for his students and a sincere desire for peace.'},traits:{ja:['豪快','愛情深い','自由人','平和主義','師匠'],en:['Flamboyant','Deeply Caring','Free Spirit','Pacifist','Mentor']},radar:[72,80,82,65,55,85]},
  {id:'minato',icon:'⚡',name:{ja:'波風ミナト',en:'Minato Namikaze'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'黄色い閃光 (INFJ)',en:'Yellow Flash (INFJ)'},profile:{I:2,F:3,N:3,J:4},desc:{ja:'木の葉最速の天才にして四代目火影。穏やかで思いやり深く、息子と里を守るために命を捧げた真の英雄。静かな強さと深い愛情の持ち主。',en:"Konoha's fastest genius and the Fourth Hokage. Gentle and caring, a true hero who gave his life to protect his son and village. Possesses quiet strength and deep love."},traits:{ja:['天才','穏やか','自己犠牲','深い愛','守護者'],en:['Genius','Gentle','Self-Sacrificing','Deep Love','Protector']},radar:[88,78,58,95,90,80]},

  // ── ONE PIECE ────────────────────────────────────────────────
  {id:'nami',icon:'🗺️',name:{ja:'ナミ',en:'Nami'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'航海士の女帝 (ENTJ)',en:'Navigator Empress (ENTJ)'},profile:{E:3,T:3,N:2,J:4},desc:{ja:'お金と仲間を誰より大切にする天才航海士。計算高く現実主義に見えるが、仲間のためなら命を張る情熱を内に秘めている。',en:'A genius navigator who values money and crew above all. Appears calculating and pragmatic, but carries fierce passion for her crew when it matters.'},traits:{ja:['現実主義','天才航海士','計算高い','情熱的','仲間想い'],en:['Pragmatic','Navigation Genius','Calculating','Passionate','Crew-Loyal']},radar:[68,72,80,85,75,68]},
  {id:'usopp',icon:'🎯',name:{ja:'ウソップ',en:'Usopp'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'嘘つきの勇者 (INFP)',en:'Lying Hero (INFP)'},profile:{I:2,F:3,N:3,P:3},desc:{ja:'臆病で嘘つきのくせに、いざというときは誰より勇敢に戦うムードメーカー。仲間への愛と夢への情熱は本物で、狙撃の腕は超一流。',en:'A coward and liar who fights braver than anyone when it counts. Genuine love for his crew and passion for his dream, with world-class sharpshooting skill.'},traits:{ja:['臆病','夢追い','隠れた勇気','仲間愛','創造的'],en:['Cowardly','Dream Chaser','Hidden Courage','Crew Love','Creative']},radar:[55,72,68,58,50,85]},
  {id:'sanji',icon:'🍳',name:{ja:'サンジ',en:'Sanji'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'炎の料理人 (ENFP)',en:'Flaming Chef (ENFP)'},profile:{E:3,F:3,N:2,P:3},desc:{ja:'料理への情熱と女性への騎士道精神を持つ蹴り技の達人。ユーモラスで情熱的だが、仲間のためなら夢も誇りも捨てられる。',en:'A master of kicks with passion for cooking and chivalry toward women. Humorous and passionate, yet willing to abandon even dreams and pride for his crew.'},traits:{ja:['紳士','料理への情熱','義侠心','ユーモア','仲間想い'],en:['Chivalrous','Cooking Passion','Gallant','Humorous','Crew-First']},radar:[82,70,80,68,62,78]},
  {id:'chopper',icon:'🦌',name:{ja:'トニートニー・チョッパー',en:'Tony Tony Chopper'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'医者を夢見る心 (ESFJ)',en:'Aspiring Doctor (ESFJ)'},profile:{E:2,F:4,S:3,J:2},desc:{ja:'人間に憧れる小さなトナカイ医者。純粋で感情豊かで、患者を必ず治すという強い使命感を持つ。仲間の優しさをまっすぐに受け止める素直な心が魅力。',en:'A small reindeer doctor who admires humans. Pure, emotionally rich, with a strong mission to always cure patients. His straightforward heart that receives kindness openly is charming.'},traits:{ja:['純粋','医者志望','感情豊か','仲間思い','成長志向'],en:['Pure','Aspiring Doctor','Emotional','Caring','Growth-Oriented']},radar:[60,88,70,62,72,92]},
  {id:'robin',icon:'🌸',name:{ja:'ニコ・ロビン',en:'Nico Robin'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'歴史の本文 (INTJ)',en:'Poneglyph Scholar (INTJ)'},profile:{I:3,T:3,N:4,J:3},desc:{ja:'歴史の本文を解読できる唯一の考古学者。クールで知性的だが、心を開いた仲間への愛情は深い。過去の孤独を乗り越えて生きる強さを持つ。',en:'The only archaeologist who can read the Poneglyphs. Cool and intellectual, but deeply loving toward those she has opened up to. Has the strength to overcome a lonely past.'},traits:{ja:['知性的','冷静','孤独の克服','歴史家','深い愛情'],en:['Intellectual','Cool','Overcame Loneliness','Historian','Deep Love']},radar:[72,78,52,92,82,68]},
  {id:'ace',icon:'🔥',name:{ja:'ポートガス・D・エース',en:'Portgas D. Ace'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'炎の兄貴 (ENFP)',en:'Flame Brother (ENFP)'},profile:{E:3,F:3,N:2,P:3},desc:{ja:'炎を操る海賊で、弟ルフィを誰より大切にする熱き兄。自由で豪快なキャラクターの奥に、自分の存在を問い続けた深い苦しみを秘めている。',en:'A fire-wielding pirate who treasures his brother Luffy above all. Behind his free-spirited, bold character lies deep anguish from constantly questioning his own existence.'},traits:{ja:['熱き兄','自由','豪快','弟愛','存在を問う'],en:['Caring Brother','Free','Bold','Brother Love','Questions Existence']},radar:[88,72,82,72,62,85]},
  {id:'law',icon:'⚕️',name:{ja:'トラファルガー・ロー',en:'Trafalgar Law'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'死の外科医 (INTJ)',en:'Surgeon of Death (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'冷静で計算高い外科医海賊。感情を出さないが、コラソンへの思いと仲間への信頼は本物。長期的な戦略を重視し、常に一手先を読んで動く。',en:'A calm, calculating surgeon-pirate. Shows little emotion, but his feelings for Corazon and trust in allies are genuine. Always plays the long game, thinking several moves ahead.'},traits:{ja:['冷静','戦略家','外科医','計算高い','義理堅い'],en:['Calm','Strategist','Surgeon','Calculating','Principled']},radar:[80,55,52,92,82,60]},
  {id:'shanks',icon:'⚓',name:{ja:'シャンクス',en:'Shanks'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'伝説の海賊 (ENFJ)',en:'Legendary Pirate (ENFJ)'},profile:{E:3,F:3,N:3,J:3},desc:{ja:'四皇にして最も気さくな大海賊。威圧的な強さを持ちながら人情味があふれ、ルフィの夢を支えた存在。笑いと涙が共存する人間的な魅力の持ち主。',en:'A Yonko yet the most approachable great pirate. Overwhelmingly powerful yet full of humanity, the one who supported Luffy\'s dream. A man where laughter and tears coexist.'},traits:{ja:['器の大きさ','人情','伝説','余裕','ルフィの師'],en:['Big-Hearted','Humane','Legendary','Composure',"Luffy's Mentor"]},radar:[92,82,88,80,78,75]},

  // ── DRAGON BALL ──────────────────────────────────────────────
  {id:'vegeta',icon:'👑',name:{ja:'ベジータ',en:'Vegeta'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'サイヤ人の王子 (INTJ)',en:'Saiyan Prince (INTJ)'},profile:{I:2,T:4,N:3,J:4},desc:{ja:'プライドと強さへの執念で生きるサイヤ人の王子。ライバルへの対抗心を原動力に絶えず成長し続ける。冷酷に見えるが家族への愛情は確かに存在する。',en:'A Saiyan prince who lives by pride and obsession with strength. Fueled by rivalry to keep growing. Appears cold but genuine love for family definitely exists.'},traits:{ja:['プライド','強さへの執念','ライバル心','家族愛（隠れ）','成長'],en:['Pride','Obsession with Strength','Rivalry','Hidden Family Love','Growth']},radar:[95,48,55,92,88,50]},
  {id:'piccolo',icon:'💚',name:{ja:'ピッコロ',en:'Piccolo'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'厳格な師匠 (INFJ)',en:'Stern Mentor (INFJ)'},profile:{I:3,F:3,N:3,J:4},desc:{ja:'かつての敵から悟空の仲間、そして悟飯の師匠へ。厳しい指導の裏に深い愛情を隠し、孤独でも信念を貫く強さを持つ。',en:'From former enemy to ally, to Gohan\'s mentor. Hides deep affection behind strict guidance, with the strength to hold to his beliefs even alone.'},traits:{ja:['厳格','師匠気質','成長支援','孤独','深い愛情'],en:['Stern','Mentor Type','Growth Support','Solitary','Deep Affection']},radar:[85,70,50,90,85,62]},
  {id:'bulma',icon:'💡',name:{ja:'ブルマ',en:'Bulma'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'天才科学者 (ENTP)',en:'Genius Scientist (ENTP)'},profile:{E:3,T:3,N:4,P:3},desc:{ja:'ドラゴンボールを探して旅を始めた天才女性科学者。好奇心旺盛で自信家、自分の頭脳を最大限に活かして困難を突破する。情熱的な性格と知識欲は誰にも負けない。',en:'A genius female scientist who started her journey searching for Dragon Balls. Curious and self-confident, she uses her intellect to overcome challenges. Her passion and thirst for knowledge are unmatched.'},traits:{ja:['天才','自信家','好奇心','リーダー気質','情熱的'],en:['Genius','Self-Confident','Curious','Natural Leader','Passionate']},radar:[65,58,80,95,68,72]},
  {id:'gohan',icon:'📚',name:{ja:'孫悟飯',en:'Son Gohan'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'秘めたる力 (INFJ)',en:'Hidden Potential (INFJ)'},profile:{I:2,F:3,N:3,J:3},desc:{ja:'父の血を受け継ぐ戦士でありながら、学者の道を歩む平和主義者。追い詰められたとき覚醒する底知れない潜在能力と、優しさが共存する。',en:'A warrior with his father\'s blood who walks the path of a scholar, a pacifist at heart. Boundless hidden potential that awakens under pressure coexists with gentle kindness.'},traits:{ja:['平和主義','隠れた実力','学者','優しさ','潜在能力'],en:['Pacifist','Hidden Strength','Scholar','Kindness','Hidden Potential']},radar:[80,78,60,88,82,80]},
  {id:'android18',icon:'🤖',name:{ja:'人造人間18号',en:'Android 18'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'クールな戦士 (ISTJ)',en:'Cool Warrior (ISTJ)'},profile:{I:3,T:3,S:3,J:4},desc:{ja:'冷静でクールな人造人間でありながら、クリリンと家族を深く愛する。強さと現実主義を兼ね備え、感情を表に出さないが愛情は行動で示す。',en:'A cool, calm android who deeply loves Krillin and her family. Combines strength and pragmatism, rarely showing emotion but demonstrating love through actions.'},traits:{ja:['クール','現実主義','家族愛','強さ','行動重視'],en:['Cool','Pragmatic','Family Love','Strength','Action-Oriented']},radar:[88,52,48,82,80,55]},

  // ── 僕のヒーローアカデミア ───────────────────────────────────
  {id:'todoroki',icon:'🌓',name:{ja:'轟焦凍',en:'Shoto Todoroki'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'氷炎の二重性 (INTJ)',en:'Dual Ice-Flame (INTJ)'},profile:{I:3,T:3,N:3,J:3},desc:{ja:'氷と炎の二つの個性を持ちながら、父への反発から片方を封印していた孤高のヒーロー候補。感情表現は苦手だが、友の言葉で殻を破り成長していく。',en:'A hero candidate with two quirks — ice and fire — who sealed one in rebellion against his father. Poor at expressing emotion, but gradually breaks out of his shell through the words of friends.'},traits:{ja:['孤高','氷炎','感情表現苦手','成長','強い意志'],en:['Solitary','Ice and Flame','Poor at Expression','Growth','Iron Will']},radar:[88,48,42,90,85,65]},
  {id:'ochako',icon:'🌸',name:{ja:'麗日お茶子',en:'Ochako Uraraka'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'重力の天使 (ESFJ)',en:'Gravity Angel (ESFJ)'},profile:{E:3,F:4,S:3,J:3},desc:{ja:'家族のためにヒーローになることを志す明るく前向きな少女。感情豊かで人情深く、仲間を大切にする心が強み。浮遊を使った戦闘スタイルも個性的。',en:'A bright, forward-thinking girl who aspires to become a hero for her family. Emotionally rich and people-oriented, with a kind heart that cherishes her friends.'},traits:{ja:['明るい','家族想い','仲間愛','感情豊か','努力家'],en:['Cheerful','Family-Oriented','Crew Love','Emotional','Hard Worker']},radar:[70,88,80,65,72,88]},
  {id:'iida',icon:'🏃',name:{ja:'飯田天哉',en:'Tenya Iida'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'正義の委員長 (ESTJ)',en:'Justice Class Rep (ESTJ)'},profile:{E:3,T:3,S:3,J:4},desc:{ja:'規則を守り正義を貫く生真面目な優等生。高い責任感と体育会系の精神で学級委員長を務める。兄への思いが絡むと感情的な側面も見せる。',en:'An earnest honor student who upholds rules and justice. Serves as class representative with high responsibility and an athletic spirit. Shows emotional sides when his feelings for his brother are involved.'},traits:{ja:['規則重視','責任感','正義','真面目','成長'],en:['Rule-Respecting','Responsible','Justice','Earnest','Growth']},radar:[78,62,78,82,88,68]},
  {id:'allmight',icon:'💪',name:{ja:'オールマイト',en:'All Might'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'平和の象徴 (ENFJ)',en:'Symbol of Peace (ENFJ)'},profile:{E:4,F:3,N:2,J:4},desc:{ja:'世界最強のヒーローにして平和の象徴。誰をも笑顔にする存在感と揺るぎない正義感、デクへの深い愛情を持つ。限界を超えてもあきらめない姿勢が多くの人を鼓舞する。',en:'The world\'s strongest hero and Symbol of Peace. His presence makes everyone smile, combined with unshakeable justice and deep love for Deku. His refusal to give up even past his limit inspires all.'},traits:{ja:['平和の象徴','カリスマ','正義','師匠','限界突破'],en:['Symbol of Peace','Charisma','Justice','Mentor','Exceeds Limits']},radar:[95,88,95,80,90,85]},
  {id:'hawks',icon:'🦅',name:{ja:'タカミ・キュウキョク（ホークス）',en:'Hawks'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'飄々の二面性 (ENTP)',en:'Carefree Dual Nature (ENTP)'},profile:{E:3,T:3,N:4,P:3},desc:{ja:'飄々とした態度の裏に鋭い知性と使命感を持つナンバー2ヒーロー。羽根を武器にした独自の戦闘スタイルと、状況を素早く分析して動く頭脳で社会を守る。',en:'The No.2 hero with sharp intelligence and mission behind a carefree attitude. Protects society with a unique feather-fighting style and rapid situational analysis.'},traits:{ja:['飄々','知性','使命感','素早い判断','二面性'],en:['Carefree','Intelligent','Driven','Quick Judgment','Dual Nature']},radar:[85,60,80,88,72,68]},
  {id:'aizawa',icon:'😪',name:{ja:'相澤消太（イレイザーヘッド）',en:'Shota Aizawa (Eraserhead)'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'地味な最強 (ISTJ)',en:'Quietly Strongest (ISTJ)'},profile:{I:3,T:3,S:3,J:4},desc:{ja:'個性を消す能力を持つ地味なヒーローかつ教師。感情を表に出さず厳しい指導をするが、生徒への愛情は誰にも負けない。合理的な判断で最善を尽くす現実主義者。',en:'A quiet hero-teacher with the ability to erase quirks. Stern instruction with no outward emotion, but love for students unmatched by anyone. A pragmatist who gives his best with rational judgment.'},traits:{ja:['地味','現実主義','生徒愛','合理的','不眠不休'],en:['Low-Key','Pragmatic','Student Love','Rational','Tireless']},radar:[82,45,52,88,80,58]},

  // ── 進撃の巨人 ──────────────────────────────────────────────
  {id:'armin',icon:'💡',name:{ja:'アルミン・アルレルト',en:'Armin Arlert'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'戦略の天才 (INTP)',en:'Strategic Genius (INTP)'},profile:{I:3,T:3,N:4,P:2},desc:{ja:'戦闘力は低くても卓越した戦略眼と洞察力で仲間を導く知性派。夢と現実の間で葛藤しながら、大局を見抜く力で進撃の巨人世界を動かす存在。',en:'Low combat ability but leads allies with outstanding tactical vision and insight. A thinker who moves the AoT world by seeing the big picture while struggling between dreams and reality.'},traits:{ja:['戦略家','知性','洞察力','葛藤','成長'],en:['Strategist','Intelligent','Perceptive','Inner Conflict','Growth']},radar:[58,72,50,92,78,72]},
  {id:'hange',icon:'🔬',name:{ja:'ハンジ・ゾエ',en:'Hange Zoe'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'巨人研究家 (ENTP)',en:'Titan Researcher (ENTP)'},profile:{E:3,T:3,N:4,P:3},desc:{ja:'巨人への異常な熱意を持つ研究者。型破りな発想と実験への情熱で巨人の秘密を解き明かし、調査兵団を率いるリーダーシップも持つ。',en:'A researcher with extraordinary enthusiasm for Titans. Unconventional thinking and passion for experiments unravel Titan secrets, combined with leadership to command the Survey Corps.'},traits:{ja:['研究者','型破り','情熱','創造的','リーダー'],en:['Researcher','Unconventional','Passionate','Creative','Leader']},radar:[72,58,78,88,70,75]},
  {id:'erwin',icon:'⚔️',name:{ja:'エルヴィン・スミス',en:'Erwin Smith'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'調査兵団団長 (INTJ)',en:'Survey Corps Commander (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'真実を知るために全てを犠牲にする覚悟を持つ調査兵団長。冷徹に見えるが、仲間への敬意と人類への使命感は誰にも負けない。',en:'The Survey Corps commander prepared to sacrifice everything for the truth. Appears cold but his respect for comrades and sense of mission for humanity are unmatched.'},traits:{ja:['使命感','決断力','冷徹','人類への愛','自己犠牲'],en:['Sense of Mission','Decisive','Cold','Love for Humanity','Self-Sacrificing']},radar:[88,55,48,95,90,55]},
  {id:'reiner',icon:'🛡️',name:{ja:'ライナー・ブラウン',en:'Reiner Braun'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'矛盾を生きる者 (ENFJ)',en:'Living Contradiction (ENFJ)'},profile:{E:2,F:3,N:2,J:3},desc:{ja:'二つのアイデンティティの間で苦しむ戦士。仲間に慕われるリーダーでありながら、使命と絆の間で引き裂かれ続ける苦悩が人間的な魅力。',en:'A warrior tormented between two identities. Respected as a leader by comrades, yet continually torn between mission and bonds — a human struggle that defines his appeal.'},traits:{ja:['二面性','苦悩','使命','仲間愛','責任感'],en:['Dual Identity','Anguish','Mission','Crew Love','Responsibility']},radar:[75,72,70,72,78,65]},
  {id:'sasha',icon:'🍖',name:{ja:'サシャ・ブラウス',en:'Sasha Blouse'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'食いしん坊の狩人 (ESFP)',en:'Hungry Hunter (ESFP)'},profile:{E:3,F:3,S:4,P:4},desc:{ja:'食べることが大好きな天才弓使い。明るく天然で場の空気を和ませる存在。狩人の家で育った野生の勘と弓の腕は超一流。',en:'A genius archer who loves eating. Bright and natural, she lightens the mood around her. Raised in a hunter family, her wild instincts and archery are top-class.'},traits:{ja:['食いしん坊','天然','弓の天才','明るい','野生の勘'],en:['Foodie','Natural','Archery Genius','Bright','Wild Instincts']},radar:[70,78,80,58,52,90]},

  // ── 呪術廻戦 ─────────────────────────────────────────────────
  {id:'nobara',icon:'🔨',name:{ja:'釘崎野薔薇',en:'Nobara Kugisaki'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'最強の女 (ESTJ)',en:'Strongest Woman (ESTJ)'},profile:{E:3,T:3,S:3,J:3},desc:{ja:'自分の強さと信念に絶対的な自信を持つ女呪術師。「自分を好きでいること」を信条に、折れることなく戦い続ける。男女関係なく実力主義を貫く姿が魅力。',en:'A female jujutsu sorcerer with absolute confidence in her strength and convictions. Fights without breaking, with the creed of "loving myself." Her meritocratic stance regardless of gender is appealing.'},traits:{ja:['自信家','強さ','信念','実力主義','独立心'],en:['Self-Confident','Strong','Conviction','Meritocratic','Independent']},radar:[82,58,72,85,80,72]},
  {id:'nanami',icon:'💼',name:{ja:'七海建人',en:'Kento Nanami'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'残業許さない術師 (ISTJ)',en:'No Overtime Sorcerer (ISTJ)'},profile:{I:3,T:4,S:3,J:4},desc:{ja:'残業を嫌い合理的に仕事をこなすベテラン呪術師。感情を抑えて冷静に判断するが、若い術師への深い気遣いと使命感は本物。',en:'A veteran sorcerer who hates overtime and works rationally. Suppresses emotion and judges calmly, but his genuine concern for young sorcerers and sense of mission are real.'},traits:{ja:['合理的','残業拒否','冷静','使命感','若者への気遣い'],en:['Rational','Anti-Overtime','Calm','Sense of Mission','Caring for Youth']},radar:[82,48,45,88,85,55]},
  {id:'sukuna',icon:'👹',name:{ja:'両面宿儺',en:'Ryomen Sukuna'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'呪いの王 (ESTP)',en:'King of Curses (ESTP)'},profile:{E:3,T:4,S:4,P:3},desc:{ja:'人類最強の呪霊にして「呪いの王」。圧倒的な実力と傲慢さで全てを見下すが、強者と戦うことへの純粋な歓喜を持つ。善悪の概念を超えた存在。',en:'The strongest cursed spirit and "King of Curses." Looks down on all with overwhelming power and arrogance, but possesses pure joy in fighting the strong. A being beyond concepts of good and evil.'},traits:{ja:['最強','傲慢','純粋な強者への歓喜','超越','王'],en:['Strongest','Arrogant','Pure Joy of Battle','Transcendent','King']},radar:[100,28,30,100,95,40]},
  {id:'geto',icon:'🌀',name:{ja:'夏油傑',en:'Suguru Geto'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'歪んだ理想主義者 (INFJ)',en:'Twisted Idealist (INFJ)'},profile:{I:3,F:3,N:4,J:4},desc:{ja:'術師と一般人の分離という歪んだ理想を掲げる元呪術師。深い洞察力と強いカリスマで信者を束ね、五条悟の親友だった過去がある。',en:'A former sorcerer with the twisted ideal of separating sorcerers and non-sorcerers. Gathers followers with deep insight and strong charisma, and was once Gojo\'s closest friend.'},traits:{ja:['歪んだ理想','強いカリスマ','深い洞察','孤独','かつての親友'],en:['Twisted Ideal','Strong Charisma','Deep Insight','Solitary','Former Friend']},radar:[72,45,42,92,85,52]},
  {id:'toji',icon:'💀',name:{ja:'伏黒甚爾',en:'Toji Fushiguro'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'天敵の怪物 (ISTP)',en:'Natural Enemy (ISTP)'},profile:{I:3,T:4,S:4,P:3},desc:{ja:'呪力ゼロにして呪術界最強レベルの身体能力を持つ「術師殺し」。感情を排した純粋な戦闘のプロとして生きながら、息子への複雑な感情を持つ。',en:'The "Sorcerer Killer" with zero cursed energy yet physical ability at the top of the jujutsu world. A pure battle professional who lives with emotions excluded, yet has complex feelings for his son.'},traits:{ja:['術師殺し','圧倒的身体能力','感情排除','孤独','複雑な父親'],en:['Sorcerer Killer','Overwhelming Physicality','Emotionless','Solitary','Complex Father']},radar:[95,32,38,98,85,42]},

  // ── 鬼滅の刃（追加）────────────────────────────────────────
  {id:'inosuke',icon:'🐗',name:{ja:'嘴平伊之助',en:'Inosuke Hashibira'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'猪突猛進 (ESTP)',en:'Full Speed Ahead (ESTP)'},profile:{E:3,T:3,S:4,P:4},desc:{ja:'猪に育てられた野生児で猪の面をかぶった剣士。考えるより先に体が動く本能型の戦士だが、仲間への愛情が芽生えることで人間として成長していく。',en:'A wild child raised by boars who fights wearing a boar mask. An instinct-driven warrior whose body moves before thinking, but grows as a human as affection for his comrades develops.'},traits:{ja:['猪突猛進','野生','本能','成長','仲間愛'],en:['Reckless','Wild','Instinctive','Growth','Crew Love']},radar:[88,55,80,55,42,85]},
  {id:'giyu',icon:'🌊',name:{ja:'冨岡義勇',en:'Giyu Tomioka'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'寡黙な水柱 (ISTJ)',en:'Quiet Water Pillar (ISTJ)'},profile:{I:4,T:3,S:3,J:4},desc:{ja:'感情を表に出さず寡黙な水の呼吸使い。ルールに厳格に見えるが、炭治郎と禰豆子を見逃した行動が示すように、本質は深い正義感と情の持ち主。',en:'A quiet Water Breathing user who shows no emotion on the surface. Appears rigid about rules, but letting Tanjiro and Nezuko go shows his core is deep justice and genuine feeling.'},traits:{ja:['寡黙','水の呼吸','正義感','深い情','孤独'],en:['Quiet','Water Breathing','Sense of Justice','Deep Feeling','Solitary']},radar:[88,45,45,90,88,52]},
  {id:'tengen',icon:'💎',name:{ja:'宇髄天元',en:'Tengen Uzui'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'派手な音柱 (ESFP)',en:'Flashy Sound Pillar (ESFP)'},profile:{E:4,F:2,S:4,P:3},desc:{ja:'派手を信条とする元忍の音柱。大きな体と派手な外見の裏に、忍として培った冷静な判断力と家族への深い愛情を持つ。',en:'The Sound Pillar, a former ninja who lives by the motto "Be flashy." Behind his large body and flashy appearance lies calm judgment cultivated as a ninja and deep love for family.'},traits:{ja:['派手','忍','家族愛','冷静な判断','カリスマ'],en:['Flashy','Ninja','Family Love','Calm Judgment','Charisma']},radar:[85,72,80,70,68,78]},
  {id:'gyomei',icon:'🪨',name:{ja:'悲鳴嶼行冥',en:'Gyomei Himejima'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'最強の岩柱 (INFJ)',en:'Strongest Stone Pillar (INFJ)'},profile:{I:4,F:4,N:2,J:4},desc:{ja:'柱最強の盲目の剣士。常に念珠を持ち神に祈りを捧げる敬虔な人物で、孤児たちの父親的存在でもあった過去を持つ。深い悲しみと強さが共存する。',en:'The strongest Pillar, a blind swordsman. A pious person who always holds prayer beads, and once served as a father figure to orphans. Deep sorrow and strength coexist.'},traits:{ja:['最強','信仰深い','深い悲しみ','父親的','孤独'],en:['Strongest','Deeply Faithful','Deep Sorrow','Fatherly','Solitary']},radar:[95,90,45,92,95,72]},

  // ── BLEACH ───────────────────────────────────────────────────
  {id:'ichigo',icon:'🌙',name:{ja:'黒崎一護',en:'Ichigo Kurosaki'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'代行死神 (ISTP)',en:'Substitute Soul Reaper (ISTP)'},profile:{I:2,T:3,S:4,P:3},desc:{ja:'強さより大切な人を守ることを優先する代行死神。素直さを嫌うツンデレな外面の裏に、誰かを守るためなら限界を超える純粋な意志を持つ。',en:'A substitute Soul Reaper who prioritizes protecting loved ones over strength. Behind his tsundere exterior that hates being straightforward lies pure will to exceed limits for the sake of others.'},traits:{ja:['代行死神','ツンデレ','守護','限界突破','成長'],en:['Sub Soul Reaper','Tsundere','Protector','Limit Breaker','Growth']},radar:[88,62,68,82,72,78]},
  {id:'rukia',icon:'🌸',name:{ja:'朽木ルキア',en:'Rukia Kuchiki'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'矜持の死神 (INTJ)',en:'Proud Soul Reaper (INTJ)'},profile:{I:3,T:3,N:3,J:3},desc:{ja:'貴族の誇りを持ちながら、一護に力を与えた純粋な死神。厳しい環境でも誇りを失わず、兄への複雑な感情と一護への友情が人間的な魅力。',en:'A soul reaper with noble pride who gave power to Ichigo. Never losing pride in harsh circumstances, her complex feelings for her brother and friendship with Ichigo define her human appeal.'},traits:{ja:['誇り高き','使命感','兄への感情','友情','成長'],en:['Prideful','Sense of Mission','Complex Feelings','Friendship','Growth']},radar:[75,70,52,88,80,68]},
  {id:'orihime',icon:'🌺',name:{ja:'井上織姫',en:'Orihime Inoue'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'愛の拒絶 (ESFJ)',en:'Rejection of the Loved (ESFJ)'},profile:{E:3,F:4,S:3,J:2},desc:{ja:'天真爛漫で明るい少女でありながら、一護への深い愛情と使命感を秘める。拒絶という形で何でも押し返せる能力は、愛の力そのものを体現している。',en:'A bright, innocent girl who secretly harbors deep love for Ichigo and a sense of mission. Her ability to reject anything embodies the very power of love.'},traits:{ja:['天真爛漫','深い愛情','使命感','優しさ','夢見がち'],en:['Innocent','Deep Love','Sense of Mission','Kind','Dreamy']},radar:[65,90,78,55,62,88]},
  {id:'aizen',icon:'🌸',name:{ja:'藍染惣右介',en:'Sosuke Aizen'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'完全な支配者 (INTJ)',en:'Perfect Ruler (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'完全な幻覚能力と高い知性で全てを支配してきた至高の存在。常に一手先を読み、感情を完全にコントロールする。反乱の真の動機は深いところに隠されている。',en:'A supreme being who has controlled everything with perfect illusion and high intelligence. Always reads one step ahead and completely controls emotions. The true motive for his rebellion is hidden deep inside.'},traits:{ja:['完全な支配','高い知性','幻覚能力','超越','謎の動機'],en:['Perfect Control','High Intelligence','Illusion Power','Transcendent','Mysterious Motive']},radar:[70,42,35,100,98,45]},
  {id:'byakuya',icon:'🌸',name:{ja:'朽木白哉',en:'Byakuya Kuchiki'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'誇り高き貴族 (ISTJ)',en:'Proud Noble (ISTJ)'},profile:{I:4,T:4,S:3,J:4},desc:{ja:'貴族の誇りとルールを何より重んじる六番隊隊長。感情を表に出さず冷酷に見えるが、妹ルキアへの深い愛情が行動の根底にある。',en:'The captain of Squad 6 who values noble pride and rules above all. Appears cold and emotionless, but deep love for his sister Rukia lies at the root of his actions.'},traits:{ja:['誇り高き','ルール重視','貴族','感情抑制','深い愛情'],en:['Proud','Rule-Respecting','Noble','Suppressed Emotion','Deep Love']},radar:[88,48,42,95,90,50]},

  // ── HUNTER×HUNTER ───────────────────────────────────────────
  {id:'kurapika',icon:'🔗',name:{ja:'クラピカ',en:'Kurapika'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'孤独な復讐者 (INFJ)',en:'Solitary Avenger (INFJ)'},profile:{I:3,F:3,N:4,J:4},desc:{ja:'一族の復讐を誓う孤独な戦士。冷静で知性的だが、復讐への強い意志が感情を抑圧する。制約と誓約を使った念能力は彼の意志の強さを体現する。',en:'A solitary warrior sworn to avenge his clan. Cool and intellectual, but a strong will for revenge suppresses emotion. His nen ability using Limitations and Vows embodies his iron will.'},traits:{ja:['復讐','孤独','強い意志','知性','制約と誓約'],en:['Vengeance','Solitary','Iron Will','Intelligence','Limitations and Vows']},radar:[75,65,45,92,85,58]},
  {id:'leorio',icon:'💊',name:{ja:'レオリオ',en:'Leorio Paradinight'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'医者を夢見る熱血 (ENFP)',en:'Hot-Blooded Aspiring Doctor (ENFP)'},profile:{E:3,F:3,N:2,P:3},desc:{ja:'医者になって貧乏人を無料で救いたいという夢を持つ熱血漢。口は悪く単純に見えるが、友人のためなら命をかけて戦える情の深さを持っている。',en:'A hot-blooded man with the dream of becoming a doctor to treat poor patients for free. Rough-mouthed and seemingly simple, but will stake his life in battle for friends.'},traits:{ja:['熱血','医者志望','情の深さ','口の悪さ','成長'],en:['Hot-Blooded','Aspiring Doctor','Deep Feeling','Rough-Mouthed','Growth']},radar:[65,78,78,62,55,85]},
  {id:'hisoka',icon:'🃏',name:{ja:'ヒソカ',en:'Hisoka Morow'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'血を求める道化 (ENTP)',en:'Blood-Seeking Jester (ENTP)'},profile:{E:3,T:3,N:4,P:4},desc:{ja:'強者との戦いのみを求め生きる謎の奇術師。善悪の概念を超え、ただ強敵を育てて戦うことに喜びを見出す。予測不能な行動と卓越した戦闘センスが特徴。',en:'A mysterious magician who lives only seeking battle with the strong. Beyond good and evil, finds joy in cultivating and fighting worthy opponents. Known for unpredictable actions and outstanding battle sense.'},traits:{ja:['強者志向','予測不能','奇術師','歓喜','道化'],en:['Strength-Seeking','Unpredictable','Magician','Joyful','Jester']},radar:[90,40,65,92,80,55]},

  // ── 鋼の錬金術師 ────────────────────────────────────────────
  {id:'alphonse',icon:'🛡️',name:{ja:'アルフォンス・エルリック',en:'Alphonse Elric'},series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'鎧の中の優しさ (ISFJ)',en:'Kindness in Armor (ISFJ)'},profile:{I:2,F:4,S:3,J:3},desc:{ja:'魂を鎧に縛られながらも純粋な心を失わない少年。兄エドを支え、仲間を思いやる深い優しさと、全ての命を大切にする哲学を持つ。',en:'A boy who never loses his pure heart despite his soul being bound to armor. Supports his brother Ed and possesses deep kindness toward friends, with a philosophy that values all life.'},traits:{ja:['純粋','優しさ','兄を支える','命の尊重','成長'],en:['Pure','Kind','Brother Support','Respect for Life','Growth']},radar:[65,92,68,72,72,90]},
  {id:'roy',icon:'🔥',name:{ja:'ロイ・マスタング',en:'Roy Mustang'},series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'炎の錬金術師 (INTJ)',en:'Flame Alchemist (INTJ)'},profile:{I:2,T:3,N:3,J:4},desc:{ja:'国家の頂点を目指す野望と、仲間を守る強い使命感を持つ炎の錬金術師。表向きは野心家に見えるが、誰より仲間を大切にする気持ちを胸に秘めている。',en:'The Flame Alchemist with ambitions to reach the top of the nation and a strong mission to protect comrades. Appears ambitious on the surface but secretly cherishes his comrades more than anyone.'},traits:{ja:['野心','仲間愛','炎の使い手','指導力','使命感'],en:['Ambitious','Crew Love','Fire User','Leadership','Sense of Mission']},radar:[82,65,58,90,82,65]},
  {id:'riza',icon:'🎯',name:{ja:'リザ・ホークアイ',en:'Riza Hawkeye'},series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'忠実な狙撃手 (ISTJ)',en:'Loyal Sharpshooter (ISTJ)'},profile:{I:3,T:3,S:4,J:4},desc:{ja:'マスタング大佐への絶対的な忠誠と、狙撃の天才的な腕前を持つ軍人。感情を抑制した合理的な行動と、見えないところでの深い献身が特徴。',en:'A military officer with absolute loyalty to Colonel Mustang and genius marksmanship. Known for rational action that suppresses emotion, and deep dedication in unseen places.'},traits:{ja:['忠誠心','狙撃天才','合理的','使命感','感情抑制'],en:['Loyal','Sharpshooting Genius','Rational','Sense of Mission','Emotional Restraint']},radar:[80,52,45,88,88,55]},

  // ── コードギアス ─────────────────────────────────────────────
  {id:'kallen',icon:'❤️',name:{ja:'紅月カレン',en:'Kallen Kozuki'},series:{ja:'コードギアス 反逆のルルーシュ',en:'Code Geass'},type:{ja:'黒の騎士団の心臓 (ENFJ)',en:'Heart of the Black Knights (ENFJ)'},profile:{E:3,F:3,N:2,J:3},desc:{ja:'日本人の血を誇り、祖国解放のために戦う熱き女性パイロット。ルルーシュへの複雑な感情を持ちながら、信念に従って戦い続ける強さを持つ。',en:'A passionate female pilot who is proud of her Japanese blood and fights for the liberation of her homeland. Holds complex feelings for Lelouch, yet has the strength to keep fighting according to her convictions.'},traits:{ja:['情熱','愛国心','強さ','信念','複雑な感情'],en:['Passionate','Patriotic','Strong','Conviction','Complex Feelings']},radar:[82,72,80,72,72,78]},
  {id:'cc',icon:'🍕',name:{ja:'C.C.',en:'C.C.'},series:{ja:'コードギアス 反逆のルルーシュ',en:'Code Geass'},type:{ja:'不死の魔女 (INTJ)',en:'Immortal Witch (INTJ)'},profile:{I:3,T:3,N:4,J:3},desc:{ja:'永遠の命を持つ謎の少女。感情を表に出さず、ルルーシュに力を与えた真の意図を長い間隠し続ける。孤独と静けさの中に深い哲学を持つ。',en:'A mysterious girl with immortal life. Never shows emotions, and long conceals her true intent in giving power to Lelouch. Holds deep philosophy within solitude and stillness.'},traits:{ja:['不死','謎','孤独','哲学','深い意図'],en:['Immortal','Mysterious','Solitary','Philosophical','Deep Intent']},radar:[68,55,38,88,85,60]},

  // ── チェンソーマン ───────────────────────────────────────────
  {id:'makima',icon:'👁️',name:{ja:'マキマ',en:'Makima'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'支配の悪魔 (INTJ)',en:'Control Devil (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'完全な支配と計画で全てを操る謎の組織のトップ。表面上は穏やかだが、その笑顔の裏に全てを計算し尽くした冷酷な知性が潜む。',en:'The mysterious organization\'s top who manipulates everything with total control and planning. Outwardly serene, but behind that smile lies ruthless intelligence that has calculated everything.'},traits:{ja:['支配','計算高い','謎','冷酷','完璧な計画'],en:['Control','Calculating','Mysterious','Ruthless','Perfect Planning']},radar:[62,35,35,98,98,38]},
  {id:'power',icon:'🩸',name:{ja:'パワー',en:'Power'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'血の悪魔 (ESTP)',en:'Blood Devil (ESTP)'},profile:{E:4,T:2,S:4,P:4},desc:{ja:'自己中心的で欲望に正直な血の悪魔。デンジに対して時に友情のような感情を見せる。単純明快でエネルギッシュ、本能のままに生きるキャラクター。',en:'A self-centered Blood Devil who is honest about her desires. Shows something resembling friendship toward Denji at times. Simple, energetic, living purely by instinct.'},traits:{ja:['自己中心的','エネルギッシュ','本能','友情（時々）','欲望正直'],en:['Self-Centered','Energetic','Instinctive','Occasional Friendship','Honest Desires']},radar:[80,48,75,60,40,85]},
  {id:'aki',icon:'🗡️',name:{ja:'早川アキ',en:'Aki Hayakawa'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'誓いの公安官 (ISTJ)',en:'Sworn Public Safety Officer (ISTJ)'},profile:{I:3,T:3,S:3,J:4},desc:{ja:'家族の仇を討つことを生きがいとする誠実な公安官。感情を内に秘めながら使命に忠実で、デンジとパワーへの不器用な愛情が印象的。',en:'A sincere public safety officer who lives to avenge his family. Faithful to his mission while suppressing emotion, with clumsy affection for Denji and Power that is memorable.'},traits:{ja:['誠実','使命感','感情抑制','家族への誓い','不器用な愛情'],en:['Sincere','Sense of Mission','Suppressed Emotion','Family Oath','Clumsy Affection']},radar:[75,52,48,82,82,58]},

  // ── エヴァンゲリオン ─────────────────────────────────────────
  {id:'shinji',icon:'🎵',name:{ja:'碇シンジ',en:'Shinji Ikari'},series:{ja:'新世紀エヴァンゲリオン',en:'Neon Genesis Evangelion'},type:{ja:'逃げない少年 (INFP)',en:'Boy Who Won\'t Run (INFP)'},profile:{I:4,F:4,N:3,P:3},desc:{ja:'「逃げちゃダメだ」と言い聞かせながら戦う繊細な少年。自己否定と承認欲求の間で揺れる内面は多くの人の共感を呼ぶ。傷つきやすいが深い感受性を持つ。',en:'A sensitive boy who fights while telling himself "I mustn\'t run away." His inner struggle between self-denial and need for approval resonates with many. Easily hurt but possesses deep sensitivity.'},traits:{ja:['繊細','承認欲求','逃げない','深い感受性','成長'],en:['Sensitive','Need for Approval','Won\'t Run','Deep Sensitivity','Growth']},radar:[42,78,45,65,58,80]},
  {id:'rei',icon:'💙',name:{ja:'綾波レイ',en:'Rei Ayanami'},series:{ja:'新世紀エヴァンゲリオン',en:'Neon Genesis Evangelion'},type:{ja:'謎の無口な少女 (INTP)',en:'Mysterious Silent Girl (INTP)'},profile:{I:4,T:3,N:4,P:3},desc:{ja:'感情を持たないように見えるが、その内面には人への静かな関心がある。システム化された存在でありながら、人間としての感情を少しずつ学んでいく。',en:'Appears to have no emotions, yet inside holds quiet interest in people. While a systematized existence, gradually learns human emotion little by little.'},traits:{ja:['無口','謎','感情学習','静かな関心','存在の問い'],en:['Quiet','Mysterious','Learning Emotion','Quiet Interest','Existential Question']},radar:[42,62,35,88,72,70]},
  {id:'asuka',icon:'🔴',name:{ja:'惣流・アスカ・ラングレー',en:'Asuka Langley Soryu'},series:{ja:'新世紀エヴァンゲリオン',en:'Neon Genesis Evangelion'},type:{ja:'誇り高き天才少女 (ENTJ)',en:'Proud Genius Girl (ENTJ)'},profile:{E:3,T:3,N:3,J:3},desc:{ja:'エリート意識の高い天才エヴァパイロット。強気な外面の裏に深い孤独と傷を抱え、承認を必死に求めながらも素直になれない。',en:'An elite, genius EVA pilot. Behind her strong-willed exterior hides deep loneliness and wounds, desperately seeking approval while unable to be honest about it.'},traits:{ja:['天才','エリート意識','孤独','傷つきやすさ','強気'],en:['Genius','Elite Awareness','Loneliness','Vulnerability','Strong-Willed']},radar:[82,45,62,85,75,60]},

  // ── ソードアート・オンライン ──────────────────────────────────
  {id:'kirito',icon:'⚔️',name:{ja:'キリト',en:'Kirito'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'黒の剣士 (ISTP)',en:'Black Swordsman (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'孤独を好む最強のSAOプレイヤー。大切な人のためなら限界を超えて戦う。',en:'The top SAO player who prefers solitude but fights beyond limits for those he cares about.'},traits:{ja:['孤独','最強','守護','成長','クール'],en:['Solitary','Strongest','Protector','Growth','Cool']},radar:[90,60,55,82,70,65]},
  {id:'asuna_sao',icon:'🌸',name:{ja:'アスナ',en:'Asuna'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'閃光の剣士 (ESFJ)',en:'Lightning Flash (ESFJ)'},profile:{E:3,F:4,S:3,J:3},desc:{ja:'「閃光」の異名を持つ女性プレイヤー。強さと優しさを兼ね備えリーダーとして仲間を守る。',en:'A female player known as "Lightning Flash" who leads front lines with both strength and kindness.'},traits:{ja:['強さ','優しさ','リーダー','献身','愛'],en:['Strong','Kind','Leader','Devoted','Love']},radar:[82,88,82,72,85,90]},
  {id:'sinon',icon:'🎯',name:{ja:'シノン',en:'Sinon'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'狙撃の女王 (INTJ)',en:'Sniper Queen (INTJ)'},profile:{I:3,T:3,N:3,J:3},desc:{ja:'銃への恐怖を克服するためGGOに参戦した凄腕スナイパー。冷静で分析的だが心の傷と戦い続ける。',en:'A skilled sniper who entered GGO to overcome her fear of guns. Calm and analytical but continually battles inner wounds.'},traits:{ja:['冷静','狙撃','克服','傷','強さ'],en:['Calm','Sniper','Overcome','Wounded','Strong']},radar:[62,58,48,85,75,65]},
  {id:'alice_sao',icon:'🏰',name:{ja:'アリス・ツーベルク',en:'Alice Zuberg'},series:{ja:'ソードアート・オンライン アリシゼーション',en:'SAO Alicization'},type:{ja:'整合騎士 (ISTJ)',en:'Integrity Knight (ISTJ)'},profile:{I:3,T:3,S:4,J:4},desc:{ja:'絶対なる掟に従う整合騎士。忠誠と誇りで戦いながら次第に自分の意志に目覚めていく。',en:'An Integrity Knight who follows absolute laws. Fights with loyalty and pride while gradually awakening to her own will.'},traits:{ja:['忠誠','誇り','目覚め','勇敢','成長'],en:['Loyal','Proud','Awakening','Brave','Growth']},radar:[78,70,60,82,90,72]},
  {id:'eugeo',icon:'🌿',name:{ja:'ユージオ',en:'Eugeo'},series:{ja:'ソードアート・オンライン アリシゼーション',en:'SAO Alicization'},type:{ja:'純粋な意志の剣士 (ISFJ)',en:'Sword of Pure Will (ISFJ)'},profile:{I:3,F:3,S:3,J:3},desc:{ja:'優しさと純粋さで仲間を支える剣士。アリスを取り戻すという一途な想いで限界を超え続ける。',en:'A swordsman who supports companions with gentleness and purity. Continuously surpasses limits driven by singular devotion to retrieving Alice.'},traits:{ja:['純粋','優しさ','一途','友情','成長'],en:['Pure','Gentle','Devoted','Friendship','Growth']},radar:[65,85,65,70,78,92]},

  // ── Re:ゼロ ──────────────────────────────────────────────────
  {id:'subaru',icon:'🔁',name:{ja:'ナツキ・スバル',en:'Natsuki Subaru'},series:{ja:'Re:ゼロ',en:'Re:Zero'},type:{ja:'死に戻りの英雄 (ENFP)',en:'Return by Death Hero (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'死に戻りの力で何度でも立ち上がる普通の少年。傷つきながらも大切な人を守るために諦めない。',en:'An ordinary boy who rises every time using Return by Death. Never gives up protecting loved ones despite repeated wounds.'},traits:{ja:['不屈','愛','成長','死に戻り','普通の少年'],en:['Indomitable','Love','Growth','Return by Death','Ordinary Boy']},radar:[78,82,72,62,68,80]},
  {id:'emilia',icon:'❄️',name:{ja:'エミリア',en:'Emilia'},series:{ja:'Re:ゼロ',en:'Re:Zero'},type:{ja:'純粋な半エルフ (ISFJ)',en:'Pure Half-Elf (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'偏見と戦いながら王位選択候補として懸命に戦う半エルフ。純粋で誰にでも真剣に向き合う姿が尊い。',en:'A half-elf who earnestly fights as a royal selection candidate while combating prejudice. Her purity and sincerity toward everyone is precious.'},traits:{ja:['純粋','誠実','優しさ','王選','成長'],en:['Pure','Sincere','Gentle','Royal Selection','Growth']},radar:[60,88,65,60,72,92]},
  {id:'beatrice',icon:'📚',name:{ja:'ベアトリス',en:'Beatrice'},series:{ja:'Re:ゼロ',en:'Re:Zero'},type:{ja:'孤独の魔女っ子 (INTJ)',en:'Lonely Witch Girl (INTJ)'},profile:{I:4,T:3,N:3,J:3},desc:{ja:'長年図書室に籠もり孤独に過ごしてきた精霊。ツンデレな言動の裏に深い孤独と友を求める心がある。',en:'A spirit who spent long years alone in a library. Behind tsundere speech lies deep loneliness and longing for a friend.'},traits:{ja:['ツンデレ','孤独','精霊','知識','成長'],en:['Tsundere','Lonely','Spirit','Knowledge','Growth']},radar:[48,65,40,88,72,68]},

  // ── このすば ──────────────────────────────────────────────────
  {id:'kazuma',icon:'😏',name:{ja:'佐藤和真',en:'Kazuma Sato'},series:{ja:'この素晴らしい世界に祝福を！',en:'KonoSuba'},type:{ja:'ダメ勇者 (ENTP)',en:'Useless Hero (ENTP)'},profile:{E:3,T:3,N:3,P:4},desc:{ja:'実は知略に長けた普通の高校生が転生した勇者。仲間に振り回されながら賢く立ち回る。',en:'An ordinary high schooler reincarnated as a hero with hidden tactical brilliance. Smartly navigates chaos caused by companions.'},traits:{ja:['策士','ダメ人間','腹黒','適応力','リアリスト'],en:['Tactician','Slacker','Cunning','Adaptable','Realist']},radar:[72,55,75,82,55,60]},
  {id:'aqua_konosuba',icon:'💧',name:{ja:'アクア',en:'Aqua'},series:{ja:'この素晴らしい世界に祝福を！',en:'KonoSuba'},type:{ja:'役立たず女神 (ESFP)',en:'Useless Goddess (ESFP)'},profile:{E:4,F:3,S:3,P:4},desc:{ja:'元女神なのに現実では役立たず。明るく自由奔放で自制心ゼロだが仲間思いな面も持つ。',en:'A former goddess who is practically useless in the real world. Bright and free-spirited with zero self-control but cares for companions.'},traits:{ja:['明るい','自由奔放','役立たず','女神','仲間思い'],en:['Bright','Free-Spirited','Useless','Goddess','Caring']},radar:[58,72,90,35,40,80]},
  {id:'megumin',icon:'💥',name:{ja:'めぐみん',en:'Megumin'},series:{ja:'この素晴らしい世界に祝福を！',en:'KonoSuba'},type:{ja:'爆裂魔法師 (ENTP)',en:'Explosion Mage (ENTP)'},profile:{E:3,T:2,N:4,P:3},desc:{ja:'爆裂魔法だけに命を懸ける紅魔族の魔法使い。1日1回の爆裂魔法後は倒れるが絶対に他の魔法は覚えない。',en:'A Crimson Demon mage devoted only to Explosion magic. Collapses after one daily explosion cast but absolutely refuses to learn other magic.'},traits:{ja:['爆裂魔法','こだわり','個性的','情熱','成長'],en:['Explosion Magic','Stubborn','Unique','Passionate','Growth']},radar:[68,62,78,72,55,85]},
  {id:'darkness',icon:'🛡️',name:{ja:'ダクネス',en:'Darkness'},series:{ja:'この素晴らしい世界に祝福を！',en:'KonoSuba'},type:{ja:'M系騎士 (ISFJ)',en:'Masochist Knight (ISFJ)'},profile:{I:2,F:4,S:4,J:3},desc:{ja:'攻撃が全く当たらないのに前線を守るドMな騎士。実は貴族の令嬢で仲間への献身は本物。',en:'A masochist knight who protects the front lines despite never landing hits. Actually a noble lady whose devotion to companions is genuine.'},traits:{ja:['献身','ドM','騎士','貴族','純粋'],en:['Devoted','Masochist','Knight','Noble','Pure']},radar:[65,82,62,45,85,78]},

  // ── FAIRY TAIL ───────────────────────────────────────────────
  {id:'natsu_ft',icon:'🔥',name:{ja:'ナツ・ドラグニル',en:'Natsu Dragneel'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'炎の竜殺し (ENFP)',en:'Fire Dragon Slayer (ENFP)'},profile:{E:4,F:3,N:2,P:3},desc:{ja:'炎の竜殺し魔法を使う元気な魔法使い。仲間への強い絆と圧倒的な情熱で強敵を倒し続ける。',en:'An energetic fire dragon slayer with strong bonds to companions and overwhelming passion to defeat powerful enemies.'},traits:{ja:['熱血','仲間','炎','ドラゴン','不屈'],en:['Hot-Blooded','Comrades','Fire','Dragon','Indomitable']},radar:[88,80,90,52,65,85]},
  {id:'lucy_ft',icon:'✨',name:{ja:'ルーシィ・ハートフィリア',en:'Lucy Heartfilia'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'星霊魔法使い (ENFJ)',en:'Celestial Spirit Mage (ENFJ)'},profile:{E:3,F:4,N:3,J:2},desc:{ja:'星霊魔法を使う明るい女性魔法使い。小説家の夢を持ちながら仲間を大切にし成長し続ける。',en:'A cheerful female celestial spirit mage who cherishes her comrades and keeps growing while chasing her dream of becoming a novelist.'},traits:{ja:['星霊魔法','夢追い','成長','仲間','明るさ'],en:['Celestial Magic','Dream Chaser','Growth','Comrades','Cheerful']},radar:[72,85,82,62,68,85]},
  {id:'erza',icon:'⚔️',name:{ja:'エルザ・スカーレット',en:'Erza Scarlett'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'妖精女王 (ESTJ)',en:'Fairy Queen (ESTJ)'},profile:{E:3,T:3,S:4,J:4},desc:{ja:'フェアリーテイル最強の女性魔法使い。厳格さと仲間への深い愛情を兼ね備え「妖精女王」と呼ばれる。',en:'The strongest female mage in Fairy Tail with strict rules and deep love for companions, known as the "Fairy Queen."'},traits:{ja:['最強','厳格','仲間愛','誠実','カリスマ'],en:['Strongest','Strict','Comrade Love','Sincere','Charismatic']},radar:[92,72,72,85,92,78]},
  {id:'gray_ft',icon:'❄️',name:{ja:'グレイ・フルバスター',en:'Gray Fullbuster'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'氷の造形魔法使い (ISTP)',en:'Ice Make Mage (ISTP)'},profile:{I:2,T:3,S:4,P:3},desc:{ja:'氷の造形魔法を使うクールな魔法使い。無意識に服を脱いでしまう癖があるが仲間のためには命を懸ける。',en:'A cool ice make mage. Has an unconscious habit of stripping but risks his life for companions.'},traits:{ja:['クール','氷','脱ぐ癖','仲間','ライバル'],en:['Cool','Ice','Stripping Habit','Comrades','Rival']},radar:[80,65,72,78,72,68]},

  // ── ワンパンマン ─────────────────────────────────────────────
  {id:'saitama',icon:'👊',name:{ja:'サイタマ',en:'Saitama'},series:{ja:'ワンパンマン',en:'One Punch Man'},type:{ja:'最強の退屈者 (INTP)',en:'Bored Strongest (INTP)'},profile:{I:3,T:3,N:2,P:4},desc:{ja:'どんな敵も一撃で倒せる最強のヒーロー。その強さゆえに戦いに感動を覚えられず日々退屈を感じている。',en:'The strongest hero who defeats any enemy in one punch. His very strength means no excitement in battle and daily boredom.'},traits:{ja:['最強','退屈','一撃','真面目','謙虚'],en:['Strongest','Bored','One Punch','Serious','Humble']},radar:[95,55,55,75,70,60]},
  {id:'genos',icon:'🤖',name:{ja:'ジェノス',en:'Genos'},series:{ja:'ワンパンマン',en:'One Punch Man'},type:{ja:'改造サイボーグ (ISFJ)',en:'Modified Cyborg (ISFJ)'},profile:{I:2,F:3,S:4,J:4},desc:{ja:'サイタマを師と仰ぐ改造サイボーグ。師への深い献身と仇討ちへの使命感で常に限界を超えて戦う。',en:'A modified cyborg who reveres Saitama as master. With deep devotion and a mission of vengeance, always fights beyond limits.'},traits:{ja:['師弟','献身','改造','使命','強さ'],en:['Discipleship','Devoted','Modified','Mission','Strong']},radar:[85,72,60,82,85,72]},
  {id:'tatsumaki',icon:'🌪️',name:{ja:'タツマキ',en:'Tatsumaki'},series:{ja:'ワンパンマン',en:'One Punch Man'},type:{ja:'竜巻のS級ヒーロー (ENTJ)',en:'Tornado S-Class Hero (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'Sクラス2位の超能力者ヒーロー。傲慢に見えるが妹思いで圧倒的な力で敵を制圧する。',en:'An esper S-class hero ranked 2nd. Appears arrogant but cares for her sister, overwhelming enemies with absolute power.'},traits:{ja:['超能力','傲慢','妹愛','最強','S級'],en:['Esper','Arrogant','Sister Love','Strongest','S-Class']},radar:[88,55,62,85,82,58]},

  // ── ハイキュー!! ─────────────────────────────────────────────
  {id:'hinata_hq',icon:'🏐',name:{ja:'日向翔陽',en:'Shoyo Hinata'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'小さな巨人 (ENFP)',en:'Little Giant (ENFP)'},profile:{E:4,F:3,N:2,P:3},desc:{ja:'低身長を乗り越えてバレーに情熱を燃やす少年。コートで「小さな巨人」として無限の可能性を示す。',en:'A boy who burns with volleyball passion despite short stature. Shows unlimited potential as the "Little Giant" on the court.'},traits:{ja:['情熱','成長','小さな巨人','スピード','明るさ'],en:['Passion','Growth','Little Giant','Speed','Cheerful']},radar:[85,75,88,55,72,90]},
  {id:'kageyama',icon:'👑',name:{ja:'影山飛雄',en:'Tobio Kageyama'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'コートの王様 (INTJ)',en:'King of the Court (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'完璧なトスで相手を圧倒するセッター。「コートの王様」という過去を乗り越えチームのために力を発揮する。',en:'A setter who overwhelms opponents with perfect tosses. Overcomes his "King of the Court" past to use his power for the team.'},traits:{ja:['完璧主義','天才','成長','チーム','トス'],en:['Perfectionist','Genius','Growth','Team','Setting']},radar:[82,55,52,92,85,65]},
  {id:'tsukishima',icon:'🦕',name:{ja:'月島蛍',en:'Kei Tsukishima'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'皮肉なブロッカー (ENTP)',en:'Sarcastic Blocker (ENTP)'},profile:{E:2,T:4,N:3,P:2},desc:{ja:'冷笑的な態度で毒舌を放つが、バレーへの情熱が少しずつ芽生えていく。分析力と高身長を活かしたブロックが武器。',en:'Delivers sarcastic jabs but gradually develops passion for volleyball. Uses analytical thinking and tall stature for effective blocks.'},traits:{ja:['皮肉','ブロック','成長','分析','クール'],en:['Sarcastic','Blocking','Growth','Analytical','Cool']},radar:[72,48,65,88,72,55]},
  {id:'oikawa',icon:'🌟',name:{ja:'及川徹',en:'Toru Oikawa'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'天才的セッター (ENFJ)',en:'Genius Setter (ENFJ)'},profile:{E:4,F:3,N:3,J:3},desc:{ja:'チームを最大限に引き出す完璧なセッター。天才への嫉妬を努力で超え頂点を目指す。',en:'A perfect setter who maximizes his team. Aims for the top not through genius but effort despite jealousy toward natural talent.'},traits:{ja:['カリスマ','努力','嫉妬','リーダー','完璧'],en:['Charismatic','Effort','Jealousy','Leader','Perfect']},radar:[82,72,88,82,78,72]},
  {id:'kenma',icon:'🎮',name:{ja:'孤爪研磨',en:'Kenma Kozume'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'猫又の司令塔 (INTP)',en:'Nekoma Strategist (INTP)'},profile:{I:4,T:4,N:3,P:3},desc:{ja:'ゲームが好きな分析型セッター。感情を表に出さないが友人への絆は深く、自分なりにバレーを楽しむ。',en:'An analytical setter who loves games. Emotionally reserved but holds deep bonds with friends and enjoys volleyball his own way.'},traits:{ja:['分析型','ゲーム好き','クール','友情','戦術'],en:['Analytical','Gamer','Cool','Friendship','Tactical']},radar:[60,65,42,92,72,55]},
  {id:'bokuto',icon:'🦉',name:{ja:'木兎光太郎',en:'Kotaro Bokuto'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'天才エース (ESFP)',en:'Ace of Aces (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'メンタルの波は激しいがトップレベルの実力を持つエース。仲間の声援で爆発的な力を発揮する。',en:'An ace with top-level ability but intense mental swings. Unleashes explosive power from his teammates support.'},traits:{ja:['天才','メンタル','エース','元気','仲間'],en:['Genius','Mental Swings','Ace','Energetic','Teammates']},radar:[90,80,92,55,55,82]},

  // ── 黒子のバスケ ─────────────────────────────────────────────
  {id:'kuroko_basket',icon:'🏀',name:{ja:'黒子テツヤ',en:'Tetsuya Kuroko'},series:{ja:'黒子のバスケ',en:"Kuroko's Basketball"},type:{ja:'幻の6人目 (INFP)',en:'Phantom Sixth Man (INFP)'},profile:{I:4,F:3,N:3,P:3},desc:{ja:'存在感の薄さを武器にするパッサー。「影」として「光」を輝かせるために戦い、バスケへの純粋な愛がある。',en:'A passer who weaponizes his low presence. Fights as the "shadow" to make the "light" shine with pure love for basketball.'},traits:{ja:['無存在感','パッサー','影','純粋','チーム'],en:['Low Presence','Passer','Shadow','Pure','Team']},radar:[55,72,40,78,72,88]},
  {id:'kagami_basket',icon:'🔥',name:{ja:'火神大我',en:'Taiga Kagami'},series:{ja:'黒子のバスケ',en:"Kuroko's Basketball"},type:{ja:'虎の本能 (ESTP)',en:'Tiger Instinct (ESTP)'},profile:{E:4,T:3,S:4,P:3},desc:{ja:'バスケへの本能的な情熱を持つアメリカ帰りの高校生。キセキの世代に対抗できる希少な存在として成長する。',en:'A high schooler returned from America with instinctive basketball passion. Grows as a rare existence who can rival the Generation of Miracles.'},traits:{ja:['本能','情熱','成長','ライバル','天才'],en:['Instinct','Passion','Growth','Rival','Genius']},radar:[90,62,80,68,68,72]},
  {id:'aomine_basket',icon:'🌊',name:{ja:'青峰大輝',en:'Daiki Aomine'},series:{ja:'黒子のバスケ',en:"Kuroko's Basketball"},type:{ja:'天才の孤独 (ISTP)',en:"Genius's Solitude (ISTP)"},profile:{I:3,T:3,S:4,P:3},desc:{ja:'「俺を倒せる奴は俺だけだ」と言い放つ無敗の天才。その圧倒的な実力ゆえに孤独になった悲しい天才。',en:'An undefeated genius who declares "Only I can beat me." A sad genius made lonely by his overwhelming talent.'},traits:{ja:['天才','孤独','最強','本能','傲慢'],en:['Genius','Lonely','Strongest','Instinct','Arrogant']},radar:[95,45,58,75,55,50]},

  // ── Fate ─────────────────────────────────────────────────────
  {id:'shirou_fate',icon:'🔧',name:{ja:'衛宮士郎',en:'Emiya Shirou'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'正義の味方 (ENFJ)',en:'Ally of Justice (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'「正義の味方」を目指す少年。自己犠牲も厭わない強い意志で戦い続ける頑固さと純粋さが魅力。',en:'A boy who aims to become an "Ally of Justice." His stubbornness and purity while fighting with strong will regardless of self-sacrifice are charming.'},traits:{ja:['正義','自己犠牲','成長','頑固','純粋'],en:['Justice','Self-Sacrifice','Growth','Stubborn','Pure']},radar:[78,82,72,72,85,88]},
  {id:'rin_fate',icon:'💎',name:{ja:'遠坂凛',en:'Rin Tohsaka'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'優等生の魔術師 (ESTJ)',en:'Honor Student Mage (ESTJ)'},profile:{E:3,T:4,S:3,J:4},desc:{ja:'完璧主義な優等生で本物の魔術師。厳しい外見の裏に優しさを隠し目標のために妥協しない。',en:'A perfectionist honor student with genuine skill as a mage. Hides kindness behind a strict exterior and never compromises on goals.'},traits:{ja:['完璧主義','魔術師','ツンデレ','努力','誠実'],en:['Perfectionist','Mage','Tsundere','Effort','Sincere']},radar:[78,65,70,90,88,68]},
  {id:'saber_fate',icon:'🗡️',name:{ja:'セイバー（アルトリア）',en:'Saber (Altria)'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'騎士王 (ISTJ)',en:'King of Knights (ISTJ)'},profile:{I:3,T:3,S:4,J:4},desc:{ja:'王として全ての責任を背負い戦い続けた騎士王。感情より義務を優先し完璧な騎士道を体現する。',en:'The King of Knights who fought bearing all responsibilities as a ruler. Prioritizes duty over emotion and embodies perfect chivalry.'},traits:{ja:['騎士道','義務','誠実','プライド','成長'],en:['Chivalry','Duty','Sincere','Pride','Growth']},radar:[85,65,60,82,92,70]},
  {id:'gilgamesh_fate',icon:'👑',name:{ja:'ギルガメッシュ',en:'Gilgamesh'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'英雄王 (ENTJ)',en:'King of Heroes (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'全ての宝具の原典を持つ英雄王。傲慢の極みだが真実のみを語り世界で唯一の存在としての誇りを持つ。',en:'The King of Heroes who possesses all prototypes of Noble Phantasms. The pinnacle of arrogance yet speaks only truth with pride as the only being of his kind.'},traits:{ja:['英雄王','傲慢','最強','誇り','真実'],en:['King of Heroes','Arrogant','Strongest','Pride','Truth']},radar:[98,38,55,98,95,48]},

  // ── シュタインズ・ゲート ─────────────────────────────────────
  {id:'okabe',icon:'🧪',name:{ja:'岡部倫太郎',en:'Rintaro Okabe'},series:{ja:'シュタインズ・ゲート',en:'Steins;Gate'},type:{ja:'狂気のマッドサイエンティスト (ENTP)',en:'Mad Scientist (ENTP)'},profile:{E:3,T:3,N:4,P:3},desc:{ja:'「鳳凰院凶真」を自称するが実際は仲間思いで繊細な青年。タイムリープで大切な人を守るために戦う。',en:'Self-styled "Hououin Kyouma" yet actually a sensitive young man who cares for companions. Fights through time leaps to protect those precious to him.'},traits:{ja:['厨二病','タイムリープ','仲間','繊細','天才'],en:['Chuunibyou','Time Leap','Comrades','Sensitive','Genius']},radar:[75,78,80,88,68,72]},
  {id:'makise_kurisu',icon:'🔬',name:{ja:'牧瀬紅莉栖',en:'Kurisu Makise'},series:{ja:'シュタインズ・ゲート',en:'Steins;Gate'},type:{ja:'天才科学者 (INTJ)',en:'Genius Scientist (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'18歳で論文を発表した天才科学者。理論的でクールだがオカベとのやり取りで見せるツンデレが魅力。',en:'A genius scientist who published papers at 18. Logical and cool but the tsundere side shown in interactions with Okabe is charming.'},traits:{ja:['天才','科学','ツンデレ','理論','成長'],en:['Genius','Science','Tsundere','Logic','Growth']},radar:[55,72,52,98,85,62]},

  // ── かぐや様 ─────────────────────────────────────────────────
  {id:'kaguya_sama',icon:'💮',name:{ja:'四宮かぐや',en:'Kaguya Shinomiya'},series:{ja:'かぐや様は告らせたい',en:'Kaguya-sama: Love is War'},type:{ja:'高嶺の花のプライド (INTJ)',en:'Prideful Genius (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'高いプライドと知性で愛を認めまいとする生徒会副会長。告白させる恋愛作戦と素直になれない愛おしさが魅力。',en:'The vice president whose high pride and intelligence prevent admitting love. The charm of her love campaign to make him confess while unable to be honest.'},traits:{ja:['プライド','天才','恋愛作戦','ツンデレ','成長'],en:['Pride','Genius','Love Tactics','Tsundere','Growth']},radar:[60,72,52,95,82,65]},
  {id:'chika',icon:'🎀',name:{ja:'藤原千花',en:'Chika Fujiwara'},series:{ja:'かぐや様は告らせたい',en:'Kaguya-sama: Love is War'},type:{ja:'無邪気なカオス (ESFP)',en:'Innocent Chaos (ESFP)'},profile:{E:4,F:3,S:3,P:4},desc:{ja:'天然で無邪気だが意外と空気を読める書記。二人の恋愛作戦をことごとく崩す「フジワラテロ」が名物。',en:'The secretary who is naturally innocent yet surprisingly reads the room. The "Fujiwara Terror" of crashing their love tactics is legendary.'},traits:{ja:['無邪気','天然','混沌','愛らしさ','秘密'],en:['Innocent','Natural','Chaotic','Adorable','Secrets']},radar:[55,78,95,48,52,92]},

  // ── ぼっち・ざ・ろっく！（追加） ────────────────────────────
  {id:'nijika',icon:'🥁',name:{ja:'伊地知虹夏',en:'Nijika Ijichi'},series:{ja:'ぼっち・ざ・ろっく！',en:'Bocchi the Rock!'},type:{ja:'バンドのリーダー (ENFJ)',en:'Band Leader (ENFJ)'},profile:{E:3,F:4,N:2,J:3},desc:{ja:'結束バンドをまとめる明るいドラマー。ぼっちをバンドに誘い、みんなをつなぐ大切な存在。',en:'The cheerful drummer who holds Kessoku Band together. She invited Bocchi and connects everyone as an essential presence.'},traits:{ja:['リーダー','ドラム','明るさ','仲間思い','まとめ役'],en:['Leader','Drums','Cheerful','Caring','Organizer']},radar:[75,88,85,65,80,82]},
  {id:'ryou_kessoku',icon:'🎸',name:{ja:'喜多郁代',en:'Ikuyo Kita'},series:{ja:'ぼっち・ざ・ろっく！',en:'Bocchi the Rock!'},type:{ja:'アイドル志望ギタリスト (ESFJ)',en:'Idol-Aspiring Guitarist (ESFJ)'},profile:{E:4,F:3,S:3,J:2},desc:{ja:'アイドル志望からバンド参加したギタリスト。明るく社交的でぼっちとは対照的な存在として輝く。',en:'A guitarist who joined the band from idol aspirations. Bright and social, she shines as the contrast to Bocchi.'},traits:{ja:['明るい','社交的','アイドル志望','ギター','成長'],en:['Bright','Social','Idol Aspirations','Guitar','Growth']},radar:[72,82,90,58,65,80]},

  // ── 推しの子 ─────────────────────────────────────────────────
  {id:'aqua_onk',icon:'⭐',name:{ja:'アクア（天童寺星野）',en:'Aqua (Hoshino)'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'復讐の転生者 (INTJ)',en:'Reincarnated Avenger (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'母の死の真相を追う転生者。俳優として活躍しながら復讐計画を進める複雑な内面を持つ。',en:'A reincarnated person pursuing the truth behind his mother\'s death. Has a complex inner world advancing a revenge plan while succeeding as an actor.'},traits:{ja:['復讐','転生','俳優','計算','愛'],en:['Revenge','Reincarnated','Actor','Calculating','Love']},radar:[68,65,62,92,82,55]},
  {id:'ruby_onk',icon:'💫',name:{ja:'ルビー（有馬かな）',en:'Ruby (Ai reborn)'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'アイドルの夢 (ENFP)',en:'Idol Dream (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'アイに憧れてアイドルを目指す転生者。無邪気な笑顔の裏に強い意志を持ち夢に向かってひた走る。',en:'A reincarnated person who aims to be an idol inspired by Ai. Behind an innocent smile lies strong will sprinting toward her dream.'},traits:{ja:['夢','アイドル','転生','笑顔','情熱'],en:['Dream','Idol','Reincarnated','Smile','Passionate']},radar:[78,80,90,58,68,92]},
  {id:'kana_onk',icon:'🎭',name:{ja:'有馬かな',en:'Kana Arima'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'元天才子役 (ENFJ)',en:'Former Child Prodigy (ENFJ)'},profile:{E:3,F:3,N:3,J:3},desc:{ja:'元天才子役として輝いた女優。スランプを乗り越えて再び輝こうとするその姿が視聴者を魅了する。',en:'An actress who shone as a former child prodigy. Her effort to overcome slumps and shine again captivates viewers.'},traits:{ja:['女優','天才','スランプ','成長','プライド'],en:['Actress','Genius','Slump','Growth','Pride']},radar:[72,72,78,72,68,75]},

  // ── 東京リベンジャーズ ────────────────────────────────────────
  {id:'takemichi',icon:'😭',name:{ja:'花垣武道',en:'Takemichi Hanagaki'},series:{ja:'東京リベンジャーズ',en:'Tokyo Revengers'},type:{ja:'泣き虫の英雄 (ENFJ)',en:'Crybaby Hero (ENFJ)'},profile:{E:3,F:4,N:2,J:2},desc:{ja:'過去に戻って仲間を救う「タイムリーパー」。泣き虫だが仲間のためなら限界を超える純粋さが周りを動かす。',en:'A "time leaper" who returns to the past to save companions. A crybaby who exceeds limits for friends — his purity moves those around him.'},traits:{ja:['タイムリーパー','泣き虫','純粋','成長','仲間'],en:['Time Leaper','Crybaby','Pure','Growth','Comrades']},radar:[68,88,72,52,65,88]},
  {id:'mikey',icon:'🌸',name:{ja:'佐野万次郎（マイキー）',en:'Manjiro Sano (Mikey)'},series:{ja:'東京リベンジャーズ',en:'Tokyo Revengers'},type:{ja:'最強の無敵将軍 (ENFP)',en:'Invincible Commander (ENFP)'},profile:{E:3,F:3,N:3,P:4},desc:{ja:'東京卍會の総長にして最強の不良。小柄だが無類の強さを誇り仲間への深い愛情を持つ複雑なキャラ。',en:'The captain and strongest delinquent of Tokyo Manji Gang. Small but possesses matchless strength and deep love for companions — complex character.'},traits:{ja:['最強','リーダー','仲間愛','複雑','成長'],en:['Strongest','Leader','Comrade Love','Complex','Growth']},radar:[90,72,82,65,75,78]},
  {id:'draken_tr',icon:'🐉',name:{ja:'龍宮寺堅（ドラケン）',en:'Ken Ryuguji (Draken)'},series:{ja:'東京リベンジャーズ',en:'Tokyo Revengers'},type:{ja:'副将の仁義 (ISTJ)',en:'Vice-Captain Honor (ISTJ)'},profile:{I:2,T:3,S:4,J:4},desc:{ja:'マイキーの幼馴染にして東京卍會の副将。誠実さと強さで仲間を守り続ける頼れるリーダー。',en:'Mikey\'s childhood friend and vice-captain of Tokyo Manji Gang. A reliable leader who keeps protecting companions with sincerity and strength.'},traits:{ja:['誠実','副将','仲間','義理','強さ'],en:['Sincere','Vice-Captain','Comrades','Honor','Strong']},radar:[85,72,70,72,88,75]},

  // ── 暗殺教室 ─────────────────────────────────────────────────
  {id:'koro_sensei',icon:'🐙',name:{ja:'殺せんせー',en:'Koro-sensei'},series:{ja:'暗殺教室',en:'Assassination Classroom'},type:{ja:'最高の先生 (ENFJ)',en:'Greatest Teacher (ENFJ)'},profile:{E:4,F:4,N:3,J:2},desc:{ja:'生徒たちに本気で向き合う「殺すことのできない先生」。生徒への愛情が深く人生を懸けて彼らを導く。',en:'The "unkillable teacher" who confronts students seriously. Has deep love for students and guides them risking his life.'},traits:{ja:['師弟愛','最強','導き','愛情','犠牲'],en:['Teacher Bond','Strongest','Guidance','Love','Sacrifice']},radar:[85,95,90,88,85,92]},
  {id:'karma_ac',icon:'😈',name:{ja:'赤羽業',en:'Karma Akabane'},series:{ja:'暗殺教室',en:'Assassination Classroom'},type:{ja:'天才の悪童 (ENTP)',en:'Genius Delinquent (ENTP)'},profile:{E:3,T:4,N:4,P:3},desc:{ja:'天才的な頭脳を持ちながら問題児として通る生徒。反骨心と鋭い洞察力で殺せんせーに真剣に向き合う。',en:'A student who passes as a delinquent despite genius intellect. Confronts Koro-sensei seriously with rebellious spirit and sharp insight.'},traits:{ja:['天才','反骨','洞察','悪童','成長'],en:['Genius','Rebellious','Insightful','Delinquent','Growth']},radar:[80,58,72,95,68,62]},
  {id:'nagisa_ac',icon:'🎯',name:{ja:'潮田渚',en:'Nagisa Shiota'},series:{ja:'暗殺教室',en:'Assassination Classroom'},type:{ja:'静かなる暗殺者 (INFP)',en:'Silent Assassin (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'外見の可愛らしさに反して天性の暗殺センスを持つ少年。人を観察し相手に溶け込む能力が卓越している。',en:'A boy with natural assassination instinct despite cute appearance. Excels at observing and blending into targets.'},traits:{ja:['天性','暗殺','観察','優しさ','成長'],en:['Natural Talent','Assassination','Observation','Gentleness','Growth']},radar:[72,75,65,78,70,72]},

  // ── Dr.STONE ─────────────────────────────────────────────────
  {id:'senku',icon:'🧬',name:{ja:'石神千空',en:'Senku Ishigami'},series:{ja:'Dr.STONE',en:'Dr. Stone'},type:{ja:'科学の天才 (ENTP)',en:'Science Genius (ENTP)'},profile:{E:3,T:4,N:4,P:3},desc:{ja:'「10億%」の科学力で石化した世界を復活させる天才。どんな問題も科学で解決し人類文明を再建する。',en:'A genius who revives the petrified world with "one billion percent" scientific power. Solves any problem with science and rebuilds human civilization.'},traits:{ja:['科学','天才','革命','知識','リーダー'],en:['Science','Genius','Revolution','Knowledge','Leader']},radar:[78,58,82,98,82,68]},
  {id:'kohaku_ds',icon:'🌿',name:{ja:'コハク',en:'Kohaku'},series:{ja:'Dr.STONE',en:'Dr. Stone'},type:{ja:'戦士の娘 (ESTJ)',en:'Warrior Daughter (ESTJ)'},profile:{E:3,T:3,S:4,J:3},desc:{ja:'石の世界で育った戦士。父を救うために自ら戦い続ける強い女性で仲間への忠誠心が高い。',en:'A warrior raised in the stone world. A strong woman who fights alone to save her father with high loyalty to companions.'},traits:{ja:['戦士','強さ','忠誠','姉妹愛','成長'],en:['Warrior','Strong','Loyal','Sisterly Love','Growth']},radar:[85,72,75,72,82,80]},

  // ── 約束のネバーランド ────────────────────────────────────────
  {id:'emma_tpn',icon:'🌿',name:{ja:'エマ',en:'Emma'},series:{ja:'約束のネバーランド',en:'The Promised Neverland'},type:{ja:'諦めない希望 (ENFP)',en:'Unwavering Hope (ENFP)'},profile:{E:4,F:4,N:3,P:3},desc:{ja:'誰一人置いていかないという強い信念で脱出を目指す少女。限界を超える行動力と愛情が仲間を引っ張る。',en:'A girl who aims to escape with the conviction of leaving no one behind. Her action beyond limits and love pulls companions forward.'},traits:{ja:['希望','諦めない','仲間','愛情','成長'],en:['Hope','Never Gives Up','Comrades','Love','Growth']},radar:[82,92,85,70,75,92]},
  {id:'ray_tpn',icon:'📚',name:{ja:'レイ',en:'Ray'},series:{ja:'約束のネバーランド',en:'The Promised Neverland'},type:{ja:'冷静な戦略家 (INTJ)',en:'Cool Strategist (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'感情より論理を優先するクールな少年。全てを計算した上でエマの夢を守ろうとする。',en:'A cool boy who prioritizes logic over emotion. Having calculated everything, he tries to protect Emma\'s dream.'},traits:{ja:['論理','計算','守護','クール','忠誠'],en:['Logic','Calculation','Protector','Cool','Loyal']},radar:[60,65,48,95,85,65]},
  {id:'norman_tpn',icon:'🔍',name:{ja:'ノーマン',en:'Norman'},series:{ja:'約束のネバーランド',en:'The Promised Neverland'},type:{ja:'天才の仁者 (INFJ)',en:'Genius Benevolent (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'感情と論理の両方に優れた天才少年。仲間への深い愛情を胸に最善の道を探し続ける。',en:'A genius boy superior in both emotion and logic. Continuously searching for the best path with deep love for companions.'},traits:{ja:['天才','愛情','計算','仲間','犠牲'],en:['Genius','Love','Calculation','Comrades','Sacrifice']},radar:[72,82,62,98,85,88]},

  // ── 進撃の巨人（追加） ───────────────────────────────────────
  {id:'historia_aot',icon:'👑',name:{ja:'ヒストリア・レイス',en:'Historia Reiss'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'真の女王 (ISFJ)',en:'True Queen (ISFJ)'},profile:{I:2,F:4,S:3,J:3},desc:{ja:'弱さを認めながら真の強さへと成長した女王。「世界で一番素敵な女の子」という言葉が象徴する。',en:'A queen who grows to true strength while acknowledging weakness. Symbolized by "the most wonderful girl in the world."'},traits:{ja:['成長','女王','強さ','純粋','仲間'],en:['Growth','Queen','Strong','Pure','Comrades']},radar:[65,88,72,65,78,90]},
  {id:'jean_aot',icon:'🐴',name:{ja:'ジャン・キルシュタイン',en:'Jean Kirstein'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'現実主義のリーダー (ENTJ)',en:'Realist Leader (ENTJ)'},profile:{E:3,T:3,N:3,J:3},desc:{ja:'本音を言う現実主義者。最初は内地を目指すが仲間の死で本当のリーダーとして成長する。',en:'A frank realist. Initially aims for the interior but grows into a true leader through the deaths of companions.'},traits:{ja:['現実主義','成長','リーダー','正直','仲間'],en:['Realist','Growth','Leader','Honest','Comrades']},radar:[75,68,70,75,78,72]},

  // ── ブリーチ（追加） ─────────────────────────────────────────
  {id:'ulquiorra',icon:'🌑',name:{ja:'ウルキオラ・シファー',en:'Ulquiorra Cifer'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'虚無の十刃 (INTJ)',en:'Nihilistic Espada (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'感情を持たないと言いながら最後に「心」の意味を問い続けた十刃。哲学的な孤独が魅力。',en:'An Espada who claimed to have no emotions yet kept asking the meaning of "heart" until the end. Philosophical solitude is charming.'},traits:{ja:['虚無','哲学','孤独','十刃','成長'],en:['Nihilism','Philosophy','Solitude','Espada','Growth']},radar:[55,42,35,95,88,38]},
  {id:'yoruichi',icon:'⚡',name:{ja:'四楓院夜一',en:'Yoruichi Shihoin'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'閃光の大貴族 (ENTP)',en:'Flash Goddess (ENTP)'},profile:{E:3,T:3,N:4,P:4},desc:{ja:'「神速」を操る元護廷十三隊二番隊隊長。自由奔放で明るいがその実力は真剣な戦いで輝く。',en:'The former 2nd Division Captain who controls "Flash." Free-spirited and bright, but her true abilities shine in serious battle.'},traits:{ja:['神速','自由','実力者','明るさ','神秘'],en:['Flash','Freedom','Skilled','Cheerful','Mysterious']},radar:[90,65,82,75,72,72]},
  {id:'kenpachi_zaraki',icon:'⚔️',name:{ja:'更木剣八',en:'Kenpachi Zaraki'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'戦闘狂の鬼神 (ESTP)',en:'Battle-Maniac War God (ESTP)'},profile:{E:4,T:3,S:4,P:4},desc:{ja:'戦いを心底愛する護廷十三隊十一番隊隊長。どんな相手でも真正面から挑む圧倒的な戦闘センスを持つ。',en:'The 11th Division Captain who loves battle from the bottom of his heart. Possesses overwhelming fighting instinct that challenges any opponent head-on.'},traits:{ja:['戦闘狂','最強','本能','豪快','成長'],en:['Battle Maniac','Strongest','Instinct','Boisterous','Growth']},radar:[98,45,80,52,65,58]},

  // ── ブラッククローバー ────────────────────────────────────────
  {id:'asta_bc',icon:'🍀',name:{ja:'アスタ',en:'Asta'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'魔力ゼロの魔法騎士 (ENFP)',en:'Zero-Magic Knight (ENFP)'},profile:{E:4,F:3,N:2,P:3},desc:{ja:'魔力ゼロなのに魔法騎士団最高位を目指す少年。どんな壁も諦めない不屈の精神で仲間を鼓舞する。',en:'A boy who aims for the highest magic knight rank despite zero magic power. His indomitable spirit that never gives up inspires companions.'},traits:{ja:['不屈','魔力ゼロ','努力','仲間','情熱'],en:['Indomitable','Zero Magic','Effort','Comrades','Passionate']},radar:[88,78,90,55,75,85]},
  {id:'yuno_bc',icon:'🌟',name:{ja:'ユノ',en:'Yuno'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'天才の魔法騎士 (INTJ)',en:'Genius Magic Knight (INTJ)'},profile:{I:3,T:3,N:4,J:3},desc:{ja:'天性の魔力を持つアスタのライバル。クールで寡黙だがアスタへの強い絆と魔法帝への野心を持つ。',en:'Asta\'s rival with natural magical talent. Cool and reticent but holds strong bonds with Asta and ambition for the Wizard King position.'},traits:{ja:['天才','クール','ライバル','野心','絆'],en:['Genius','Cool','Rival','Ambitious','Bond']},radar:[85,55,55,88,82,65]},

  // ── オーバーロード ────────────────────────────────────────────
  {id:'ainz',icon:'💀',name:{ja:'アインズ・ウール・ゴウン',en:'Ainz Ooal Gown'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'至高の魔法詠唱者 (INTJ)',en:'Supreme Overlord (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'最強のアンデッドとして君臨する元サラリーマン。内心は不安だらけだが外見上は完璧な支配者として振る舞う。',en:'A former salaryman who reigns as the most powerful undead. Internally full of anxiety but outwardly acts as a perfect ruler.'},traits:{ja:['最強','計算','謎','支配','成長'],en:['Strongest','Calculating','Mysterious','Domination','Growth']},radar:[65,55,52,98,92,55]},
  {id:'albedo_ol',icon:'🖤',name:{ja:'アルベド',en:'Albedo'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'守護統括の忠誠 (ESFJ)',en:'Loyal Guardian Overseer (ESFJ)'},profile:{E:3,F:4,S:3,J:4},desc:{ja:'ナザリックの守護統括でアインズへの絶対的な愛情を持つ。愛故にときに暴走するが忠誠心は本物。',en:'The Guardian Overseer of Nazarick with absolute love for Ainz. Sometimes acts rashly from love but loyalty is genuine.'},traits:{ja:['忠誠','愛情','守護','暴走','誠実'],en:['Loyal','Love','Guardian','Impulsive','Sincere']},radar:[75,85,65,72,82,82]},

  // ── キルラキル ────────────────────────────────────────────────
  {id:'ryuko',icon:'🩸',name:{ja:'纏流子',en:'Ryuko Matoi'},series:{ja:'キルラキル',en:'Kill la Kill'},type:{ja:'反逆の剣士 (ESTP)',en:'Rebel Swordswoman (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'父の仇を追う反骨精神の塊。感情任せに戦うが仲間の力で本当の自分を取り戻す。',en:'A bundle of rebellious spirit pursuing her father\'s killer. Fights driven by emotion but regains her true self through companions\' power.'},traits:{ja:['反骨','情熱','成長','仲間','強さ'],en:['Rebellious','Passionate','Growth','Comrades','Strong']},radar:[85,65,80,65,65,80]},
  {id:'satsuki_klk',icon:'🏯',name:{ja:'鬼龍院皐月',en:'Satsuki Kiryuin'},series:{ja:'キルラキル',en:'Kill la Kill'},type:{ja:'鋼鉄の意志 (INTJ)',en:'Iron Will (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'絶対的な支配者として君臨する生徒会長。傲慢さの裏に人類救済のための深謀遠慮を隠す。',en:'A student council president who reigns as an absolute ruler. Hides deep schemes for saving humanity behind her arrogance.'},traits:{ja:['支配','意志','謀略','傲慢','救済'],en:['Domination','Will','Scheming','Arrogant','Salvation']},radar:[82,52,62,95,95,58]},

  // ── 天元突破グレンラガン ─────────────────────────────────────
  {id:'simon_gl',icon:'🌀',name:{ja:'シモン',en:'Simon'},series:{ja:'天元突破グレンラガン',en:'Gurren Lagann'},type:{ja:'螺旋の王 (INFP→ENFP)',en:'Spiral King (INFP→ENFP)'},profile:{I:2,F:3,N:4,P:3},desc:{ja:'「掘り進む」事しかできない少年がカミナの死を乗り越えて宇宙をも超える。成長の物語の頂点。',en:'A boy who could only "dig forward" overcomes Kamina\'s death to surpass the universe itself. The pinnacle of a growth story.'},traits:{ja:['成長','螺旋','信念','仲間','不屈'],en:['Growth','Spiral','Conviction','Comrades','Indomitable']},radar:[72,78,78,72,75,88]},
  {id:'kamina_gl',icon:'🔥',name:{ja:'カミナ',en:'Kamina'},series:{ja:'天元突破グレンラガン',en:'Gurren Lagann'},type:{ja:'天元突破の魂 (ENFP)',en:'Heaven-Breaking Soul (ENFP)'},profile:{E:4,F:3,N:4,P:4},desc:{ja:'「俺を信じるな！俺が信じるお前を信じろ！」の名言で知られる。その精神はシモンと視聴者の心に永遠に生き続ける。',en:'Known for "Don\'t believe in yourself! Believe in me who believes in you!" His spirit lives forever in Simon and viewers\' hearts.'},traits:{ja:['情熱','信念','カリスマ','仲間','魂'],en:['Passion','Conviction','Charismatic','Comrades','Soul']},radar:[90,82,95,65,72,88]},

  // ── ヴァイオレット・エヴァーガーデン（追加） ─────────────────
  {id:'gilbert',icon:'🎖️',name:{ja:'ギルベルト・ブーゲンビリア',en:'Gilbert Bougainvillea'},series:{ja:'ヴァイオレット・エヴァーガーデン',en:'Violet Evergarden'},type:{ja:'愛を伝えられなかった者 (INFJ)',en:'One Who Struggled to Convey Love (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'最後の言葉「愛している」をヴァイオレットに伝えた少佐。その愛がヴァイオレットの成長の全ての源。',en:'The major who conveyed his final words "I love you" to Violet. That love is the source of all of Violet\'s growth.'},traits:{ja:['愛','少佐','苦悩','成長','犠牲'],en:['Love','Major','Anguish','Growth','Sacrifice']},radar:[60,88,55,72,78,82]},

  // ── コードギアス（追加） ─────────────────────────────────────
  {id:'suzaku',icon:'🌿',name:{ja:'枢木スザク',en:'Suzaku Kururugi'},series:{ja:'コードギアス',en:'Code Geass'},type:{ja:'正義と苦悩の騎士 (ENFJ)',en:'Knight of Justice and Anguish (ENFJ)'},profile:{E:3,F:3,N:3,J:3},desc:{ja:'正しい手段で世界を変えようとするルルーシュのライバル。信念と現実の矛盾に苦しむ姿が人間的で魅力的。',en:'Lelouch\'s rival who aims to change the world through righteous means. His struggle with the contradiction between conviction and reality is humanly charming.'},traits:{ja:['正義','苦悩','ライバル','信念','成長'],en:['Justice','Anguish','Rival','Conviction','Growth']},radar:[78,72,68,72,82,75]},

  // ── SPY×FAMILY（追加） ──────────────────────────────────────
  {id:'bond_dog',icon:'🐕',name:{ja:'ボンド（犬）',en:'Bond (Dog)'},series:{ja:'SPY×FAMILY',en:'SPY×FAMILY'},type:{ja:'未来が見える犬 (ISFJ)',en:'Future-Seeing Dog (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'フォージャー家の一員となった未来予知能力を持つ犬。家族への愛情と使命感で危機を回避する。',en:'A dog with precognitive abilities who becomes part of the Forger family. Averts crises with love for family and sense of mission.'},traits:{ja:['未来予知','家族愛','犬','可愛さ','使命'],en:['Precognition','Family Love','Dog','Cute','Mission']},radar:[55,90,70,55,70,95]},

  // ── ダーリン・イン・ザ・フランキス ──────────────────────────
  {id:'zero_two',icon:'🌸',name:{ja:'ゼロツー',en:'Zero Two'},series:{ja:'ダーリン・イン・ザ・フランキス',en:'Darling in the FranXX'},type:{ja:'鬼の花嫁 (ESTP)',en:'Oni Bride (ESTP)'},profile:{E:4,T:3,S:4,P:3},desc:{ja:'半人半鬼のストライカー。「ダーリン」を一途に想い続け愛のために人間を取り戻す物語が感動的。',en:'A half-human, half-oni striker. The moving story of her unwavering devotion to "Darling" and reclaiming her humanity for love.'},traits:{ja:['鬼','愛','強さ','一途','成長'],en:['Oni','Love','Strong','Devoted','Growth']},radar:[88,72,80,72,68,82]},

  // ── ヴィンランド・サガ ───────────────────────────────────────
  {id:'thorfinn',icon:'⚔️',name:{ja:'トルフィン',en:'Thorfinn'},series:{ja:'ヴィンランド・サガ',en:'Vinland Saga'},type:{ja:'復讐から平和へ (INFP)',en:'From Revenge to Peace (INFP)'},profile:{I:3,F:3,N:4,P:3},desc:{ja:'復讐心から解放され「本当の戦士に剣はいらない」という境地に至る。成長の物語として完成度が高い。',en:'Freed from vengeance to reach the realization "a true warrior needs no sword." Exceptionally complete as a growth story.'},traits:{ja:['復讐','成長','平和','戦士','強さ'],en:['Revenge','Growth','Peace','Warrior','Strong']},radar:[82,68,55,72,75,72]},
  {id:'askeladd',icon:'🗡️',name:{ja:'アシェラッド',en:'Askeladd'},series:{ja:'ヴィンランド・サガ',en:'Vinland Saga'},type:{ja:'詐欺師の王 (INTJ)',en:'King of Deceivers (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'知略で生き延びる傭兵隊長。複雑な動機と深い哲学を持ちヴィンランド・サガで最も人間的な悪役。',en:'A mercenary captain who survives through cunning. With complex motives and deep philosophy, the most human villain of Vinland Saga.'},traits:{ja:['知略','複雑','哲学','指導力','謎'],en:['Cunning','Complex','Philosophy','Leadership','Mysterious']},radar:[75,58,65,95,82,52]},

  // ── ようこそ実力至上主義の教室へ ────────────────────────────
  {id:'ayanokoji',icon:'🃏',name:{ja:'綾小路清隆',en:'Kiyotaka Ayanokoji'},series:{ja:'ようこそ実力至上主義の教室へ',en:'Classroom of the Elite'},type:{ja:'最強の道化師 (INTJ)',en:'Supreme Jester (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'全てを計算し尽くした上で「普通」を演じる最強の高校生。感情を切り離した論理で全てを支配する。',en:'The strongest high schooler who performs "ordinary" after calculating everything. Controls all with logic detached from emotion.'},traits:{ja:['計算','支配','隠れ天才','感情なし','謎'],en:['Calculating','Control','Hidden Genius','No Emotion','Mysterious']},radar:[55,38,42,100,95,35]},

  // ── 美少女戦士セーラームーン ─────────────────────────────────
  {id:'usagi',icon:'🌙',name:{ja:'月野うさぎ（セーラームーン）',en:'Usagi Tsukino (Sailor Moon)'},series:{ja:'美少女戦士セーラームーン',en:'Sailor Moon'},type:{ja:'月の戦士 (ENFP)',en:'Warrior of the Moon (ENFP)'},profile:{E:4,F:4,N:2,P:4},desc:{ja:'泣き虫で食いしん坊だが愛と正義の名のもとに戦う伝説の戦士。その純粋な愛が世界を救う。',en:'A crybaby and glutton but a legendary warrior who fights in the name of love and justice. Her pure love saves the world.'},traits:{ja:['愛','正義','泣き虫','成長','月'],en:['Love','Justice','Crybaby','Growth','Moon']},radar:[72,92,82,52,65,92]},

  // ── フルーツバスケット ───────────────────────────────────────
  {id:'tohru_fb',icon:'🍙',name:{ja:'本田透',en:'Tohru Honda'},series:{ja:'フルーツバスケット',en:'Fruits Basket'},type:{ja:'天使のような少女 (ENFJ)',en:'Angelic Girl (ENFJ)'},profile:{E:3,F:4,N:3,J:2},desc:{ja:'どんな人も受け入れる無限の優しさを持つ少女。草摩家の呪いを解き放ち周りの人々の心を癒す。',en:'A girl with boundless kindness who accepts anyone. Breaks the Soma family\'s curse and heals the hearts of those around her.'},traits:{ja:['優しさ','受容','癒し','成長','愛'],en:['Kindness','Acceptance','Healing','Growth','Love']},radar:[65,98,82,60,75,95]},

  // ── カウボーイビバップ ───────────────────────────────────────
  {id:'spike',icon:'🚀',name:{ja:'スパイク・スピーゲル',en:'Spike Spiegel'},series:{ja:'カウボーイビバップ',en:'Cowboy Bebop'},type:{ja:'過去を引きずる賞金稼ぎ (ISTP)',en:'Haunted Bounty Hunter (ISTP)'},profile:{I:3,T:3,S:4,P:4},desc:{ja:'「どうせ夢だ」と言いながら戦い続ける賞金稼ぎ。過去の呪縛から逃れられない人間の哀しさを体現する。',en:'A bounty hunter who keeps fighting saying "It\'s just a dream anyway." Embodies the sadness of a person unable to escape the curse of the past.'},traits:{ja:['クール','過去','戦闘','孤独','哲学'],en:['Cool','Past','Combat','Solitude','Philosophy']},radar:[88,52,60,78,65,55]},

  // ── CLANNAD ──────────────────────────────────────────────────
  {id:'nagisa_clannad',icon:'🌸',name:{ja:'古河渚',en:'Nagisa Furukawa'},series:{ja:'CLANNAD',en:'Clannad'},type:{ja:'大きな家族の願い (ISFJ)',en:'Wish of One Big Family (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'「大きな家族の物語」を夢見る優しい少女。その純粋さと病気との闘いが多くの涙を誘う。',en:'A gentle girl who dreams of "one big family\'s story." Her purity and battle with illness draws many tears.'},traits:{ja:['優しさ','夢','病気','家族','成長'],en:['Gentle','Dream','Illness','Family','Growth']},radar:[55,92,68,55,72,95]},

  // ── モブサイコ100（追加） ─────────────────────────────────────
  {id:'reigen_mp100',icon:'🌿',name:{ja:'霊幻新隆',en:'Reigen Arataka'},series:{ja:'モブサイコ100',en:'Mob Psycho 100'},type:{ja:'自称超能力者 (ENTP)',en:'Self-Proclaimed Psychic (ENTP)'},profile:{E:4,T:3,N:3,P:3},desc:{ja:'超能力を持たない詐欺師だが、モブへの本物の思いやりと的確なアドバイスで師匠として輝く。',en:'A fraud without psychic powers but shines as a master figure for Mob with genuine compassion and accurate advice.'},traits:{ja:['詐欺師','師匠','弁舌','思いやり','カリスマ'],en:['Fraud','Master','Eloquence','Compassion','Charismatic']},radar:[65,75,88,75,65,72]},

  // ── 機動戦士ガンダム ─────────────────────────────────────────
  {id:'amuro_gundam',icon:'🤖',name:{ja:'アムロ・レイ',en:'Amuro Ray'},series:{ja:'機動戦士ガンダム',en:'Mobile Suit Gundam'},type:{ja:'ニュータイプの天才 (INTP)',en:'Newtype Genius (INTP)'},profile:{I:4,T:3,N:4,P:3},desc:{ja:'天才的なモビルスーツ操縦能力を持つ普通の少年。戦争の中で傷つきながらも成長し続ける。',en:'An ordinary boy with genius mobile suit piloting ability. Continues growing while being wounded within war.'},traits:{ja:['天才','成長','戦争','傷','ニュータイプ'],en:['Genius','Growth','War','Wounded','Newtype']},radar:[72,68,52,88,65,65]},

  // ── ノーゲーム・ノーライフ ───────────────────────────────────
  {id:'sora_ngnl',icon:'♟️',name:{ja:'空',en:'Sora'},series:{ja:'ノーゲーム・ノーライフ',en:'No Game No Life'},type:{ja:'ゲームの神 (ENTP)',en:'God of Games (ENTP)'},profile:{E:3,T:4,N:4,P:3},desc:{ja:'ゲームでは無敵の天才兄。妹シロと二人合わせて「空白」として世界最強のゲーマーとなる。',en:'An invincible genius brother in games. Together with sister Shiro as "Blank," they become the world\'s strongest gamers.'},traits:{ja:['天才','ゲーム','兄妹','戦略','無敵'],en:['Genius','Games','Siblings','Strategy','Invincible']},radar:[75,65,75,95,72,65]},
  {id:'shiro_ngnl',icon:'🧩',name:{ja:'白',en:'Shiro'},series:{ja:'ノーゲーム・ノーライフ',en:'No Game No Life'},type:{ja:'計算の天才 (INTP)',en:'Calculation Genius (INTP)'},profile:{I:4,T:4,N:4,P:3},desc:{ja:'11言語を習得し人工知能を超える計算力を持つ天才少女。兄空と共に「空白」として無敵を誇る。',en:'A genius girl who mastered 11 languages with calculation ability exceeding artificial intelligence. Invincible as "Blank" with brother Sora.'},traits:{ja:['天才','計算','無敵','引きこもり','兄妹'],en:['Genius','Calculation','Invincible','Shut-In','Siblings']},radar:[55,52,40,100,72,60]},

  // ── 化物語 ───────────────────────────────────────────────────
  {id:'araragi',icon:'📚',name:{ja:'阿良々木暦',en:'Koyomi Araragi'},series:{ja:'化物語',en:'Bakemonogatari'},type:{ja:'怪異と戦う高校生 (INFJ)',en:'Aberration-Fighting Student (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'吸血鬼の力を持ちながら普通の高校生として生きる少年。仲間の「怪異」を解決するために奔走する。',en:'A boy who lives as an ordinary high schooler while possessing vampire powers. Runs about solving companions\' aberrations.'},traits:{ja:['怪異','吸血鬼','仲間','知識','成長'],en:['Aberration','Vampire','Comrades','Knowledge','Growth']},radar:[65,78,65,82,72,72]},

  // ── とらドラ ─────────────────────────────────────────────────
  {id:'taiga',icon:'🐯',name:{ja:'逢坂大河',en:'Taiga Aisaka'},series:{ja:'とらドラ！',en:'Toradora!'},type:{ja:'手乗りタイガー (ESTP)',en:'Palm-Sized Tiger (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'小柄だが気が強い「手乗りタイガー」。頑固な外面の裏に誰よりも傷つきやすい心を持つ。',en:'A small but strong-willed "Palm-Sized Tiger." Behind her stubborn exterior lies a heart more easily wounded than anyone\'s.'},traits:{ja:['気が強い','傷つきやすい','成長','恋愛','小柄'],en:['Strong-Willed','Easily Hurt','Growth','Romance','Small']},radar:[78,72,68,62,62,80]},

  // ── やはり俺の青春ラブコメはまちがっている（追加） ──────────
  {id:'yukino',icon:'❄️',name:{ja:'雪ノ下雪乃',en:'Yukino Yukinoshita'},series:{ja:'やはり俺の青春ラブコメはまちがっている。',en:'My Youth Romantic Comedy Is Wrong As I Expected'},type:{ja:'完璧な氷の女王 (INTJ)',en:'Perfect Ice Queen (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'完璧な成績と美貌を持つが孤独な少女。奉仕部でのやり取りを通じ自分の弱さと向き合い成長する。',en:'A girl with perfect grades and beauty but lonely. Through the Service Club\'s interactions she faces her weaknesses and grows.'},traits:{ja:['完璧主義','氷の女王','孤独','成長','誠実'],en:['Perfectionist','Ice Queen','Lonely','Growth','Sincere']},radar:[55,68,48,92,85,70]},

  // ── 鋼の錬金術師（追加） ─────────────────────────────────────
  {id:'winry_fma',icon:'🔧',name:{ja:'ウィンリィ・ロックベル',en:'Winry Rockbell'},series:{ja:'鋼の錬金術師 FULLMETAL ALCHEMIST',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'機械鎧の天才少女 (ESFJ)',en:'Automail Genius Girl (ESFJ)'},profile:{E:3,F:4,S:3,J:3},desc:{ja:'エドワードの幼馴染で機械鎧の天才メカニック。エドへの愛情と職人への情熱が共存する強い女性。',en:'Edward\'s childhood friend and genius automail mechanic. A strong woman where love for Ed and passion for craftsmanship coexist.'},traits:{ja:['天才','メカニック','幼馴染','愛情','強さ'],en:['Genius','Mechanic','Childhood Friend','Love','Strong']},radar:[72,88,78,72,80,85]},
  {id:'scar_fma',icon:'✝️',name:{ja:'スカー',en:'Scar'},series:{ja:'鋼の錬金術師 FULLMETAL ALCHEMIST',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'復讐の錬金術師殺し (ISTP)',en:'Revenge Alchemist Killer (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'民族の復讐を誓う元イシュヴァール人の修道士。錬金術師を憎む理由の悲劇性と、やがて見せる成長が魅力。',en:'A former Ishvalan monk who swears vengeance for his people. The tragedy behind his hatred of alchemists and eventual growth are charming.'},traits:{ja:['復讐','悲劇','成長','信仰','強さ'],en:['Revenge','Tragedy','Growth','Faith','Strong']},radar:[80,55,52,72,72,60]},

  // ── 呪術廻戦（追加） ─────────────────────────────────────────
  {id:'yuta_jjk',icon:'💠',name:{ja:'乙骨憂太',en:'Yuta Okkotsu'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'最強の二年生 (INFJ)',en:'Strongest 2nd Year (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'かつてリカに呪われていた少年。五条の弟子として成長し「最強の二年生」へと変貌する。',en:'A boy once cursed by Rika. Grows as Gojo\'s student to transform into the "strongest 2nd year student."'},traits:{ja:['成長','最強','優しさ','誓い','進化'],en:['Growth','Strongest','Gentleness','Oath','Evolution']},radar:[82,72,68,82,80,78]},
  {id:'maki_jjk',icon:'💪',name:{ja:'禪院真希',en:'Maki Zenin'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'呪力なき戦士 (ESTJ)',en:'Curseless Warrior (ESTJ)'},profile:{E:3,T:4,S:4,J:3},desc:{ja:'呪力を持たない禪院家の少女。不利な環境を跳ね返す強い意志と身体能力で最強の呪術師を目指す。',en:'A Zenin family girl with no cursed energy. Aims for top jujutsu sorcerer with strong will and physical ability that overcomes her disadvantages.'},traits:{ja:['不屈','戦士','強さ','反骨','成長'],en:['Indomitable','Warrior','Strong','Rebellious','Growth']},radar:[88,55,65,72,82,68]},

  // ── ハンターxハンター（追加） ─────────────────────────────────
  {id:'meruem_hxh',icon:'👑',name:{ja:'メルエム',en:'Meruem'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'蟻の王 (INTJ)',en:'King of Ants (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'生まれながらに最強の蟻の王。コムギとの出会いで初めて人間的な感情を知り、その変化が感動的。',en:'The innately strongest King of Ants. Meeting Komugi brings him his first human emotions — that transformation is moving.'},traits:{ja:['最強','進化','感情学習','プライド','変化'],en:['Strongest','Evolution','Learning Emotion','Pride','Transformation']},radar:[98,55,40,100,90,45]},
  {id:'chrollo_hxh',icon:'🕷️',name:{ja:'クロロ・ルシルフル',en:'Chrollo Lucilfer'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'幻影旅団の首領 (INTJ)',en:'Phantom Troupe Leader (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'幻影旅団を率いるカリスマ的な盗賊の首領。冷酷な悪の首領だがその深い思想と美学が魅力的。',en:'The charismatic bandit leader who leads the Phantom Troupe. A cold-blooded villain leader but his deep thoughts and aesthetics are charming.'},traits:{ja:['カリスマ','盗賊','美学','謎','首領'],en:['Charismatic','Bandit','Aesthetics','Mysterious','Leader']},radar:[72,52,62,95,85,48]},

  // ── 小市魔法使いの下克上 ─────────────────────────────────────
  {id:'akko_lwa',icon:'🌟',name:{ja:'アツコ・カガリ（アッコ）',en:'Akko Kagari'},series:{ja:'リトルウィッチアカデミア',en:'Little Witch Academia'},type:{ja:'魔法への情熱 (ENFP)',en:'Passion for Magic (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'魔法が使えなくても夢を諦めない少女。「信じる心が魔法の力」という精神で不可能を可能にする。',en:'A girl who never gives up her dream even unable to use magic. The spirit "believing heart is the power of magic" makes the impossible possible.'},traits:{ja:['情熱','夢','信念','成長','明るさ'],en:['Passion','Dream','Conviction','Growth','Cheerful']},radar:[78,75,88,52,65,90]},

  // ── サイコパス ────────────────────────────────────────────────
  {id:'akane_pp',icon:'🔍',name:{ja:'常守朱',en:'Akane Tsunemori'},series:{ja:'PSYCHO-PASS',en:'Psycho-Pass'},type:{ja:'正義を問う刑事 (INFJ)',en:'Justice-Questioning Detective (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'シビュラシステムと対峙しながら人間の正義を問い続ける刑事。強い精神と信念で理不尽な世界に挑む。',en:'A detective who keeps questioning human justice while confronting the Sybil System. Challenges an unreasonable world with strong spirit and conviction.'},traits:{ja:['正義','信念','成長','知性','人間性'],en:['Justice','Conviction','Growth','Intellect','Humanity']},radar:[65,78,65,82,80,75]},

  // ── メイドインアビス ─────────────────────────────────────────
  {id:'riko_mia',icon:'⭕',name:{ja:'リコ',en:'Riko'},series:{ja:'メイドインアビス',en:'Made in Abyss'},type:{ja:'アビスへの挑戦者 (ENFP)',en:'Abyss Challenger (ENFP)'},profile:{E:3,F:3,N:4,P:3},desc:{ja:'母を追ってアビスへ向かう少女。どんな危険も諦めない情熱と好奇心で深淵への旅を続ける。',en:'A girl who heads into the Abyss chasing her mother. Continues the journey to the depths with passion and curiosity that never gives up before any danger.'},traits:{ja:['冒険','好奇心','成長','母への愛','強さ'],en:['Adventure','Curiosity','Growth','Mother\'s Love','Strong']},radar:[80,80,78,65,68,85]},

  // ── 無職転生 ─────────────────────────────────────────────────
  {id:'rudeus_mt',icon:'📖',name:{ja:'ルーデウス・グレイラット',en:'Rudeus Greyrat'},series:{ja:'無職転生 ～異世界行ったら本気だす～',en:'Mushoku Tensei'},type:{ja:'生まれ変わった魔術師 (INTP)',en:'Reborn Mage (INTP)'},profile:{I:3,T:3,N:4,P:3},desc:{ja:'前世の失敗を取り返すために転生から本気を出す魔術師。成長の過程で家族愛と仲間の大切さを学ぶ。',en:'A mage who starts for real from reincarnation to make up for previous life failures. Learns the importance of family love and companions through his growth.'},traits:{ja:['転生','成長','魔術','努力','家族'],en:['Reincarnated','Growth','Magic','Effort','Family']},radar:[65,72,55,85,72,72]},

  // ── 盾の勇者の成り上がり ────────────────────────────────────
  {id:'naofumi_tssh',icon:'🛡️',name:{ja:'岩谷尚文',en:'Naofumi Iwatani'},series:{ja:'盾の勇者の成り上がり',en:'The Rising of the Shield Hero'},type:{ja:'不信の盾勇者 (ISTJ)',en:'Distrustful Shield Hero (ISTJ)'},profile:{I:3,T:3,S:4,J:3},desc:{ja:'裏切りと偏見から始まった盾勇者の物語。不信感を持ちながらも仲間と共に成長し本物の英雄へと変貌する。',en:'The story of the Shield Hero who started from betrayal and prejudice. Transforms into a true hero while growing with companions despite distrust.'},traits:{ja:['不信','成長','盾','仲間','英雄'],en:['Distrustful','Growth','Shield','Comrades','Hero']},radar:[72,65,58,75,78,68]},

  // ── ダンジョン飯（追加） ─────────────────────────────────────
  {id:'marcille_dm',icon:'🧝',name:{ja:'マルシル',en:'Marcille'},series:{ja:'ダンジョン飯',en:'Delicious in Dungeon'},type:{ja:'魔法使いの食いしん坊 (ENFJ)',en:'Magical Glutton (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'高エルフの魔法使い。モンスターを食べることに初めは拒否感があるが冒険を通じて成長する。',en:'A high elf mage. Initially repulsed by eating monsters but grows through adventure.'},traits:{ja:['魔法使い','成長','友情','グルメ','感情豊か'],en:['Mage','Growth','Friendship','Foodie','Emotional']},radar:[68,82,72,75,70,78]},

  // ── 薬屋のひとりごと（追加） ─────────────────────────────────
  {id:'jinshi_kh',icon:'🌹',name:{ja:'壬氏',en:'Jinshi'},series:{ja:'薬屋のひとりごと',en:"The Apothecary Diaries"},type:{ja:'謎多き宦官 (INTJ)',en:'Mysterious Eunuch (INTJ)'},profile:{I:3,T:3,N:4,J:3},desc:{ja:'絶世の美男子として知られる宦官。マオマオへの複雑な感情を隠しながら権力の中枢で策を巡らせる。',en:'A eunuch known as an incomparably beautiful man. Hides complex feelings for Maomao while scheming at the center of power.'},traits:{ja:['美男子','謎','権力','感情','策士'],en:['Handsome','Mysterious','Power','Emotion','Tactician']},radar:[68,65,65,85,78,72]},

  // ── 転生したらスライムだった件（追加） ──────────────────────
  {id:'milim_tensura',icon:'👿',name:{ja:'ミリム・ナーヴァ',en:'Milim Nava'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'最強の魔王 (ESFP)',en:'Strongest Demon Lord (ESFP)'},profile:{E:4,F:3,S:4,P:4},desc:{ja:'最強の魔王でありながら子供のように無邪気なキャラ。リムルへの友情は本物で、その天真爛漫さが可愛らしい。',en:'The strongest demon lord yet innocent as a child. Friendship with Rimuru is genuine, and her guileless nature is endearing.'},traits:{ja:['最強','無邪気','友情','魔王','破壊力'],en:['Strongest','Innocent','Friendship','Demon Lord','Destructive']},radar:[95,72,85,55,55,85]},

  // ── Angel Beats! ─────────────────────────────────────────────
  {id:'kanade_ab',icon:'🎵',name:{ja:'立華かなで（天使）',en:'Kanade Tachibana (Angel)'},series:{ja:'Angel Beats!',en:'Angel Beats!'},type:{ja:'静かなる守護者 (ISTJ)',en:'Silent Guardian (ISTJ)'},profile:{I:4,T:3,S:3,J:4},desc:{ja:'SSS団から「天使」と呼ばれる少女。無表情に見えるが料理と友情への純粋な喜びを持つ。',en:'A girl called "Angel" by the SSS. Appears expressionless but has pure joy in cooking and friendship.'},traits:{ja:['守護','静寂','天使','友情','純粋'],en:['Guardian','Silent','Angel','Friendship','Pure']},radar:[65,75,45,78,82,82]},

  // ── 銀魂 ─────────────────────────────────────────────────────
  {id:'gintoki_gintama',icon:'🍭',name:{ja:'坂田銀時',en:'Gintoki Sakata'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'天然パーマの侍 (ENTP)',en:'Natural Perm Samurai (ENTP)'},profile:{E:3,T:3,N:3,P:4},desc:{ja:'ダラダラしているようで実は仲間のために命を懸ける最強の侍。コメディとシリアスのギャップが魅力。',en:'Appears lazy but risks his life for companions as the strongest samurai. The gap between comedy and seriousness is charming.'},traits:{ja:['最強','侍','コメディ','仲間','隠れた深さ'],en:['Strongest','Samurai','Comedy','Comrades','Hidden Depth']},radar:[90,72,85,78,72,72]},

  // ── 銀魂（追加） ─────────────────────────────────────────────
  {id:'kagura_gintama',icon:'🌂',name:{ja:'神楽',en:'Kagura'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'超強力な食いしん坊 (ESFP)',en:'Super-Strong Glutton (ESFP)'},profile:{E:4,F:3,S:4,P:4},desc:{ja:'夜兎族の超強力な少女。食べ物が好きで明るく無邪気だが戦いになれば圧倒的な強さを発揮する。',en:'A super-strong girl of the Yato Clan. Bright and innocent with a love of food, but shows overwhelming strength in battle.'},traits:{ja:['超強力','食いしん坊','無邪気','夜兎族','仲間'],en:['Super-Strong','Glutton','Innocent','Yato Clan','Comrades']},radar:[92,72,88,48,62,85]},
  {id:'shinpachi_gintama',icon:'👓',name:{ja:'志村新八',en:'Shinpachi Shimura'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'眼鏡の常識人 (ESTJ)',en:'Bespectacled Common Sense Man (ESTJ)'},profile:{E:3,T:3,S:3,J:3},desc:{ja:'万事屋の常識担当。仲間のツッコミ役として機能するが、いざとなれば勇気を見せる頼れる存在。',en:'The common sense member of the Yorozuya. Functions as the tsukkomi of companions but shows courage when it matters as a reliable presence.'},traits:{ja:['常識','ツッコミ','成長','誠実','仲間'],en:['Common Sense','Tsukkomi','Growth','Sincere','Comrades']},radar:[65,72,68,72,75,70]},

  // ── ブンゴウストレイドッグス ────────────────────────────────
  {id:'atsushi_bsd',icon:'🐅',name:{ja:'中島敦',en:'Atsushi Nakajima'},series:{ja:'文豪ストレイドッグス',en:'Bungo Stray Dogs'},type:{ja:'白虎の孤児 (INFP)',en:'White Tiger Orphan (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'白虎の異能を持つ元孤児。自己肯定感の低さを乗り越えながら武装探偵社の一員として成長する。',en:'A former orphan with the white tiger ability. Overcomes low self-esteem and grows as a member of the Armed Detective Agency.'},traits:{ja:['白虎','成長','自己否定','優しさ','仲間'],en:['White Tiger','Growth','Self-Doubt','Gentleness','Comrades']},radar:[72,75,62,65,68,78]},
  {id:'dazai_bsd',icon:'🍷',name:{ja:'太宰治',en:'Osamu Dazai'},series:{ja:'文豪ストレイドッグス',en:'Bungo Stray Dogs'},type:{ja:'謎の天才探偵 (ENTP)',en:'Mysterious Genius Detective (ENTP)'},profile:{E:3,T:4,N:4,P:3},desc:{ja:'「無害にして」という異能を持つ謎の探偵。自殺願望を公言しながらも鋭い頭脳で事件を解決する。',en:'A mysterious detective with the ability "No Longer Human." Publicly declares a death wish but solves cases with sharp intellect.'},traits:{ja:['謎','天才','自殺願望','策士','カリスマ'],en:['Mysterious','Genius','Death Wish','Tactician','Charismatic']},radar:[72,65,72,95,75,68]},
  {id:'chuuya_bsd',icon:'🎩',name:{ja:'中也',en:'Chuuya Nakahara'},series:{ja:'文豪ストレイドッグス',en:'Bungo Stray Dogs'},type:{ja:'重力の守護者 (ESTP)',en:'Gravity Guardian (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'重力操作の異能を持つポートマフィアの幹部。戦闘センスに優れプライドが高いが太宰との絆は本物。',en:'A Port Mafia executive with gravity manipulation ability. Excels in combat with high pride but his bond with Dazai is genuine.'},traits:{ja:['重力','プライド','戦闘','絆','カリスマ'],en:['Gravity','Pride','Combat','Bond','Charismatic']},radar:[88,58,72,72,75,68]},

  // ── 進撃の巨人（さらに追加） ────────────────────────────────
  {id:'bertholdt_aot',icon:'💨',name:{ja:'ベルトルト・フーバー',en:'Bertholdt Hoover'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'罪悪感の巨人 (INFJ)',en:'Guilty Titan (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'超大型巨人の力を持つ口下手な少年。罪悪感を抱えながらも使命を果たすために戦い続ける。',en:'A taciturn boy with the power of the Colossal Titan. Continues fighting to fulfill his mission while carrying guilt.'},traits:{ja:['罪悪感','使命','口下手','苦悩','成長'],en:['Guilt','Mission','Inarticulate','Anguish','Growth']},radar:[60,65,48,72,72,58]},
  {id:'annie_aot',icon:'❄️',name:{ja:'アニ・レオンハート',en:'Annie Leonhart'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'氷の女戦士 (ISTJ)',en:'Ice Warrior (ISTJ)'},profile:{I:3,T:3,S:4,J:3},desc:{ja:'感情を表に出さない女型の巨人。冷酷に見えるが内面には父への深い想いがあり人間的な苦悩を抱える。',en:'The Female Titan who shows no emotion. Appears cold but inside holds deep feelings for her father and bears human anguish.'},traits:{ja:['氷の女','使命','孤独','父への愛','苦悩'],en:['Ice Woman','Mission','Solitary','Father\'s Love','Anguish']},radar:[75,52,48,78,78,55]},

  // ── 東京喰種 ─────────────────────────────────────────────────
  {id:'kaneki_tg',icon:'🕷️',name:{ja:'金木研',en:'Ken Kaneki'},series:{ja:'東京喰種',en:'Tokyo Ghoul'},type:{ja:'半喰種の文学青年 (INFP)',en:'Half-Ghoul Literary Youth (INFP)'},profile:{I:4,F:3,N:4,P:3},desc:{ja:'人間と喰種の狭間で苦しむ半喰種。文学を愛する繊細な青年が過酷な現実に翻弄される。',en:'A half-ghoul who suffers between human and ghoul worlds. A sensitive young man who loves literature is buffeted by harsh reality.'},traits:{ja:['半喰種','苦悩','文学','成長','アイデンティティ'],en:['Half-Ghoul','Anguish','Literature','Growth','Identity']},radar:[65,72,52,82,68,68]},

  // ── 盾の勇者（追加） ─────────────────────────────────────────
  {id:'raphtalia_tssh',icon:'🦊',name:{ja:'ラフタリア',en:'Raphtalia'},series:{ja:'盾の勇者の成り上がり',en:'The Rising of the Shield Hero'},type:{ja:'奴隷から英雄へ (ISFJ)',en:'From Slave to Hero (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'元奴隷から尚文の仲間となった亜人族の少女。尚文への深い信頼と愛情が彼女の強さの源。',en:'A demi-human girl who went from slave to Naofumi\'s companion. Deep trust and love for Naofumi is the source of her strength.'},traits:{ja:['信頼','愛情','成長','強さ','義理'],en:['Trust','Love','Growth','Strong','Loyalty']},radar:[72,88,65,68,80,85]},

  // ── 剣道アニメ / スポーツ系 ──────────────────────────────────
  {id:'hanamichi_sd',icon:'🏀',name:{ja:'桜木花道',en:'Hanamichi Sakuragi'},series:{ja:'SLAM DUNK',en:'Slam Dunk'},type:{ja:'天才バスケ部員 (ESFP)',en:'Genius Basketball Player (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'バスケ初心者なのに天才を自称する不良。急速な成長と仲間への絆が多くのファンを魅了した伝説的キャラ。',en:'A delinquent who calls himself a genius despite being a basketball beginner. Legendary character whose rapid growth and bonds with teammates fascinated many fans.'},traits:{ja:['天才','成長','情熱','ライバル','不良'],en:['Genius','Growth','Passion','Rival','Delinquent']},radar:[88,68,82,52,58,82]},
  {id:'rukawa_sd',icon:'🌊',name:{ja:'流川楓',en:'Kaede Rukawa'},series:{ja:'SLAM DUNK',en:'Slam Dunk'},type:{ja:'天才の沈黙 (INTJ)',en:'Silent Genius (INTJ)'},profile:{I:4,T:3,S:4,J:3},desc:{ja:'孤高の天才バスケットプレイヤー。口数が少なくクールだが試合では圧倒的な輝きを放つ。',en:'A solitary genius basketball player. Quiet and cool but radiates overwhelming brilliance in games.'},traits:{ja:['天才','孤高','クール','バスケ','輝き'],en:['Genius','Solitary','Cool','Basketball','Brilliance']},radar:[90,42,48,85,72,62]},

  // ── るろうに剣心 ─────────────────────────────────────────────
  {id:'kenshin_rk',icon:'⚔️',name:{ja:'緋村剣心',en:'Kenshin Himura'},series:{ja:'るろうに剣心',en:'Rurouni Kenshin'},type:{ja:'不殺の剣客 (INFJ)',en:'Non-Killing Swordsman (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'「人斬り抜刀斎」の過去を持ちながら「不殺」を誓う流浪人剣客。その優しさと強さの共存が魅力。',en:'A wandering swordsman who vows "non-killing" despite his past as the "Man-Slayer." The coexistence of his gentleness and strength is charming.'},traits:{ja:['不殺','優しさ','強さ','誓い','放浪'],en:['Non-Killing','Gentle','Strong','Vow','Wandering']},radar:[88,82,68,80,85,78]},
  {id:'sanosuke_rk',icon:'✊',name:{ja:'相楽左之助',en:'Sanosuke Sagara'},series:{ja:'るろうに剣心',en:'Rurouni Kenshin'},type:{ja:'義の男 (ESFP)',en:'Man of Honor (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'正義感が強く体当たりで問題を解決しようとする剣心の仲間。熱い性格と義理人情が魅力。',en:'Kenshin\'s companion with strong sense of justice who tries to solve problems head-on. Hot personality and deep honor are charming.'},traits:{ja:['義理','熱い','仲間','正義','成長'],en:['Honor','Hot-Blooded','Comrades','Justice','Growth']},radar:[85,72,82,52,72,78]},

  // ── トライガン ────────────────────────────────────────────────
  {id:'vash_trigun',icon:'🌹',name:{ja:'ヴァッシュ・ザ・スタンピード',en:'Vash the Stampede'},series:{ja:'TRIGUN STAMPEDE',en:'Trigun Stampede'},type:{ja:'愛と平和の銃士 (ENFP)',en:'Gunman of Love and Peace (ENFP)'},profile:{E:4,F:4,N:3,P:3},desc:{ja:'「愛と平和」を口癖にする最高指名手配の銃士。道化た外見の裏に深い傷と人類への愛を持つ。',en:'The most wanted gunman who has "love and peace" as his catchphrase. Behind the clown exterior hides deep wounds and love for humanity.'},traits:{ja:['愛と平和','道化','最強','隠れた深さ','傷'],en:['Love and Peace','Clown','Strongest','Hidden Depth','Wounded']},radar:[82,88,85,72,68,82]},

  // ── サムライチャンプルー ─────────────────────────────────────
  {id:'mugen_sc',icon:'🌀',name:{ja:'ムゲン',en:'Mugen'},series:{ja:'サムライチャンプルー',en:'Samurai Champloo'},type:{ja:'自由の剣客 (ESTP)',en:'Free Swordsman (ESTP)'},profile:{E:3,T:3,S:4,P:4},desc:{ja:'ブレイクダンスを組み込んだ独自の剣術を持つ自由奔放な侍。過去に縛られつつも前に進む生き様が魅力。',en:'A free-spirited samurai with unique sword style incorporating breakdancing. His way of life moving forward while bound by the past is charming.'},traits:{ja:['自由','独自剣術','豪快','過去','成長'],en:['Freedom','Unique Style','Boisterous','Past','Growth']},radar:[88,52,75,68,55,65]},
  {id:'jin_sc',icon:'🎋',name:{ja:'ジン',en:'Jin'},series:{ja:'サムライチャンプルー',en:'Samurai Champloo'},type:{ja:'静寂の剣士 (ISTJ)',en:'Silent Swordsman (ISTJ)'},profile:{I:4,T:3,S:4,J:3},desc:{ja:'正統派の剣術を持つ静寂の剣士。ムゲンとの対比が面白く、寡黙の中に深い哲学を持つ。',en:'A silent swordsman with orthodox sword style. His contrast with Mugen is interesting, holding deep philosophy within silence.'},traits:{ja:['静寂','正統剣術','哲学','クール','誠実'],en:['Silent','Orthodox Style','Philosophy','Cool','Sincere']},radar:[78,58,48,82,80,55]},

  // ── NARUTO（追加） ───────────────────────────────────────────
  {id:'shikamaru',icon:'☁️',name:{ja:'奈良シカマル',en:'Shikamaru Nara'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'天才の怠け者 (INTP)',en:'Lazy Genius (INTP)'},profile:{I:3,T:4,N:3,P:4},desc:{ja:'IQ200超の天才だが面倒臭がりな忍者。仲間のためなら本気の知略を発揮する。',en:'A ninja with over IQ200 genius but lazy disposition. Displays genuine cunning for companions when it matters.'},traits:{ja:['天才','怠け者','策士','仲間','成長'],en:['Genius','Lazy','Tactician','Comrades','Growth']},radar:[62,65,52,95,72,65]},
  {id:'neji',icon:'🌊',name:{ja:'日向ネジ',en:'Neji Hyuga'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'運命を超えた天才 (INTJ)',en:'Fate-Transcending Genius (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'「才能がない者は永遠に勝てない」という宿命論から脱却する天才忍者。ナルトに敗北して成長した。',en:'A genius ninja who breaks free from fatalism saying "those without talent can never win." Grew from his defeat by Naruto.'},traits:{ja:['天才','運命','成長','誇り','強さ'],en:['Genius','Fate','Growth','Pride','Strong']},radar:[88,55,52,90,82,60]},
  {id:'temari',icon:'🌬️',name:{ja:'テマリ',en:'Temari'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'砂の風忍者 (ESTJ)',en:'Wind Kunoichi of Sand (ESTJ)'},profile:{E:3,T:3,S:3,J:4},desc:{ja:'砂の扇子を使う風の忍者。頼れる実力と強さでシカマルたちと共に行動し、頼れる存在として輝く。',en:'A wind ninja using a sand fan. Shines as a reliable presence acting with Shikamaru and others with dependable ability and strength.'},traits:{ja:['風忍者','強さ','信頼','誠実','成長'],en:['Wind Ninja','Strong','Reliable','Sincere','Growth']},radar:[82,68,70,75,80,72]},

  // ── ワンピース（追加） ────────────────────────────────────────
  {id:'jinbe',icon:'🐳',name:{ja:'ジンベエ',en:'Jinbe'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'義の魚人 (ISTJ)',en:'Righteous Fish-Man (ISTJ)'},profile:{I:3,T:3,S:4,J:4},desc:{ja:'義理と信念を重んじる魚人船長。ルフィへの深い信頼と海の男としての誠実さが魅力。',en:'A fish-man captain who values honor and conviction. Deep trust in Luffy and sincerity as a man of the sea are charming.'},traits:{ja:['義理','誠実','信頼','海の男','強さ'],en:['Honor','Sincere','Trust','Man of the Sea','Strong']},radar:[80,78,65,75,88,75]},
  {id:'brook',icon:'🎸',name:{ja:'ブルック',en:'Brook'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'ガイコツの音楽家 (ENFP)',en:'Skeleton Musician (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'魂の音楽で仲間を鼓舞する骸骨の剣士兼音楽家。おっちゃんギャグの裏に仲間への深い愛情がある。',en:'A skeleton swordsman-musician who inspires companions with soul music. Behind his crude jokes lies deep love for companions.'},traits:{ja:['音楽','ユーモア','孤独','仲間愛','成長'],en:['Music','Humor','Solitude','Comrade Love','Growth']},radar:[72,78,85,60,70,80]},
  {id:'franky',icon:'🤖',name:{ja:'フランキー',en:'Franky'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'スーパー改造人間 (ESFP)',en:'Super Modified Human (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'自分の体を改造したサイボーグの船大工。「スーパー！」が口癖で仲間のために夢の船を作った。',en:'A cyborg shipwright who modified his own body. "Super!" is his catchphrase and he built the dream ship for companions.'},traits:{ja:['改造','スーパー','船大工','仲間','強さ'],en:['Modified','Super','Shipwright','Comrades','Strong']},radar:[85,72,85,65,72,78]},

  // ── ドラゴンボール（追加） ────────────────────────────────────
  {id:'trunks_db',icon:'⚔️',name:{ja:'トランクス（未来）',en:'Future Trunks'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'絶望の戦士 (INFJ)',en:'Warrior of Despair (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'絶望的な未来から来た戦士。人造人間に滅ぼされた世界で仲間を守るために戦い続けた。',en:'A warrior from a desperate future. Kept fighting to protect companions in a world destroyed by androids.'},traits:{ja:['未来','絶望','強さ','成長','希望'],en:['Future','Despair','Strong','Growth','Hope']},radar:[85,72,58,78,80,72]},
  {id:'frieza_db',icon:'❄️',name:{ja:'フリーザ',en:'Frieza'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'宇宙の帝王 (INTJ)',en:'Emperor of the Universe (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'宇宙最強の帝王として君臨する残虐な悪役。長い戦闘シーンと変身シーンで視聴者を熱狂させた伝説的ヴィラン。',en:'A cruel villain who reigns as the strongest emperor in the universe. A legendary villain who thrilled viewers with long battle and transformation scenes.'},traits:{ja:['帝王','残虐','最強','プライド','変身'],en:['Emperor','Cruel','Strongest','Pride','Transformation']},radar:[95,30,55,92,90,38]},

  // ── 僕のヒーローアカデミア（追加） ──────────────────────────
  {id:'tsuyu',icon:'🐸',name:{ja:'蛙吹梅雨',en:'Tsuyu Asui'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'蛙のヒーロー (ISFJ)',en:'Frog Hero (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'思ったことをはっきり言う蛙型の個性を持つ。冷静な判断力と仲間への深い配慮が魅力的なクールな女子。',en:'Has a frog-type quirk and speaks her mind clearly. A cool girl with calm judgment and deep consideration for companions.'},traits:{ja:['率直','蛙','冷静','仲間','誠実'],en:['Frank','Frog','Calm','Comrades','Sincere']},radar:[68,82,65,75,78,80]},
  {id:'tokoyami',icon:'🐦',name:{ja:'常闇踏陰',en:'Fumikage Tokoyami'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'闇の鳥 (INTJ)',en:'Bird of Darkness (INTJ)'},profile:{I:4,T:3,N:4,J:3},desc:{ja:'暗影の個性で闇を操る神秘的なキャラ。内面は意外とロマンチストで厨二病的な言動が愛らしい。',en:'A mysterious character who controls darkness with the Dark Shadow quirk. Unexpectedly a romantic inside, with chuunibyou-esque speech that is endearing.'},traits:{ja:['闇','神秘','個性','内面のロマン','成長'],en:['Darkness','Mysterious','Unique','Inner Romantic','Growth']},radar:[72,62,52,78,72,65]},
  {id:'jirou',icon:'🎸',name:{ja:'耳郎響香',en:'Kyoka Jirou'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'音楽と戦いのヒーロー (ISTP)',en:'Music and Battle Hero (ISTP)'},profile:{I:3,T:3,S:3,P:3},desc:{ja:'音楽を愛するイヤホンジャックの個性を持つクールな女子。戦いでも音楽でも実力を発揮する。',en:'A cool girl with the Earphone Jack quirk who loves music. Demonstrates ability in both battle and music.'},traits:{ja:['音楽','クール','個性','実力','成長'],en:['Music','Cool','Quirky','Skilled','Growth']},radar:[72,65,58,75,72,72]},

  // ── 呪術廻戦（追加） ─────────────────────────────────────────
  {id:'todo_jjk',icon:'🌸',name:{ja:'東堂葵',en:'Aoi Todo'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'ブラザーの親友 (ESFP)',en:'Brother Best Friend (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'「どんな女性が好みか？」で人を判断するユニークな価値観を持つ呪術師。虎杖への深い友情が印象的。',en:'A jujutsu sorcerer with unique values who judges people by "what type of woman do you like?" His deep friendship with Itadori is memorable.'},traits:{ja:['豪快','友情','独自の価値観','強さ','熱い'],en:['Boisterous','Friendship','Unique Values','Strong','Hot-Blooded']},radar:[88,78,82,65,68,80]},

  // ── セーラームーン（追加） ─────────────────────────────────
  {id:'rei_sm',icon:'🔥',name:{ja:'火野レイ（セーラーマーズ）',en:'Rei Hino (Sailor Mars)'},series:{ja:'美少女戦士セーラームーン',en:'Sailor Moon'},type:{ja:'炎の巫女 (INTJ)',en:'Flame Shrine Maiden (INTJ)'},profile:{I:3,T:3,N:3,J:4},desc:{ja:'神社の巫女でセーラーマーズの戦士。プライドが高くうさぎと衝突するが根は仲間思いで強い。',en:'A shrine maiden and Sailor Mars warrior. Has high pride and clashes with Usagi but at heart is a strong companion-minded person.'},traits:{ja:['巫女','プライド','炎','仲間','強さ'],en:['Shrine Maiden','Pride','Flame','Comrades','Strong']},radar:[72,68,65,78,78,72]},
  {id:'ami_sm',icon:'💙',name:{ja:'水野亜美（セーラーマーキュリー）',en:'Ami Mizuno (Sailor Mercury)'},series:{ja:'美少女戦士セーラームーン',en:'Sailor Moon'},type:{ja:'知性の戦士 (INTJ)',en:'Warrior of Intelligence (INTJ)'},profile:{I:4,T:4,N:3,J:3},desc:{ja:'天才的な頭脳を持つセーラーマーキュリー。内気で孤独だったが仲間を得て本当の強さを見つける。',en:'Sailor Mercury with genius intellect. Was shy and lonely but found true strength after gaining companions.'},traits:{ja:['天才','内気','水','成長','仲間'],en:['Genius','Shy','Water','Growth','Comrades']},radar:[55,75,52,92,72,72]},

  // ── カードキャプターさくら ───────────────────────────────────
  {id:'sakura_cc',icon:'🌸',name:{ja:'木之本桜',en:'Sakura Kinomoto'},series:{ja:'カードキャプターさくら',en:'Cardcaptor Sakura'},type:{ja:'魔法の少女 (ENFJ)',en:'Magical Girl (ENFJ)'},profile:{E:3,F:4,N:3,J:2},desc:{ja:'クロウカードを集める明るい魔法少女。仲間への愛情と「ぜったいだいじょうぶだよ！」の精神で困難を乗り越える。',en:'A bright magical girl who collects Clow Cards. Overcomes difficulties with love for companions and the spirit of "Everything will definitely be okay!"'},traits:{ja:['明るさ','魔法少女','愛情','成長','仲間'],en:['Bright','Magical Girl','Love','Growth','Comrades']},radar:[72,88,85,60,72,92]},
  {id:'syaoran_cc',icon:'🌹',name:{ja:'李小狼',en:'Syaoran Li'},series:{ja:'カードキャプターさくら',en:'Cardcaptor Sakura'},type:{ja:'ライバルから仲間へ (ISTJ)',en:'Rival to Companion (ISTJ)'},profile:{I:3,T:3,S:3,J:3},desc:{ja:'最初はライバルだったが桜への愛情で心を開いていく少年。クールな外見の裏に純粋な愛情がある。',en:'A boy who started as a rival but opens his heart through love for Sakura. Behind a cool exterior lies pure affection.'},traits:{ja:['ライバル','ツンデレ','成長','愛情','誠実'],en:['Rival','Tsundere','Growth','Love','Sincere']},radar:[70,72,55,75,78,75]},

  // ── 犬夜叉 ───────────────────────────────────────────────────
  {id:'inuyasha_char',icon:'🐕',name:{ja:'犬夜叉',en:'InuYasha'},series:{ja:'犬夜叉',en:'InuYasha'},type:{ja:'半妖の剣士 (ESTP)',en:'Half-Demon Swordsman (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'半妖として人間と妖怪の狭間で苦しむ剣士。荒々しい外面の裏にかごめへの深い愛情がある。',en:'A swordsman who suffers between human and demon worlds as a half-demon. Behind rough exterior lies deep love for Kagome.'},traits:{ja:['半妖','荒々しさ','愛情','成長','強さ'],en:['Half-Demon','Rough','Love','Growth','Strong']},radar:[85,65,68,65,68,75]},
  {id:'sesshomaru',icon:'🌸',name:{ja:'殺生丸',en:'Sesshomaru'},series:{ja:'犬夜叉',en:'InuYasha'},type:{ja:'孤高の大妖怪 (INTJ)',en:'Solitary Great Demon (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'完全な妖怪として誇りを持つ犬夜叉の兄。冷酷に見えるが林の妹への愛情や成長が人間的な魅力を加える。',en:'InuYasha\'s elder brother who takes pride as a full demon. Appears cold but love for Rin\'s sister and growth add human charm.'},traits:{ja:['孤高','誇り','冷酷','成長','保護'],en:['Solitary','Pride','Cold','Growth','Protector']},radar:[88,45,42,88,82,48]},

  // ── ふしぎ遊戯 / 古典名作 ─────────────────────────────────
  {id:'detective_conan',icon:'🔍',name:{ja:'江戸川コナン',en:'Conan Edogawa'},series:{ja:'名探偵コナン',en:'Detective Conan'},type:{ja:'平成のシャーロック (INTJ)',en:'Heisei Sherlock (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'高校生探偵が子供の姿に縮んだコナン。どんな謎も推理で解く圧倒的な頭脳と正義感を持つ。',en:'High school detective shrunk into a child\'s form. Possesses overwhelming intellect to solve any mystery through deduction and a strong sense of justice.'},traits:{ja:['推理','天才','正義','謎解き','隠れた真実'],en:['Deduction','Genius','Justice','Mystery Solving','Hidden Truth']},radar:[60,68,62,98,85,65]},

  // ── ダンガンロンパ的な ─────────────────────────────────────
  {id:'fern_frieren',icon:'🧙',name:{ja:'フェルン',en:'Fern'},series:{ja:'葬送のフリーレン',en:'Frieren: Beyond Journey\'s End'},type:{ja:'天才魔法使いの弟子 (ISTJ)',en:'Genius Apprentice Mage (ISTJ)'},profile:{I:3,T:3,S:3,J:4},desc:{ja:'フリーレンの弟子として優れた魔法の才能を持つ少女。真面目で感情を表に出さないが師や仲間への愛情は深い。',en:'A girl with outstanding magical talent as Frieren\'s apprentice. Serious and emotionally reserved but has deep affection for her master and companions.'},traits:{ja:['天才','弟子','真面目','成長','愛情'],en:['Genius','Apprentice','Serious','Growth','Love']},radar:[68,72,55,85,82,72]},
  {id:'stark_frieren',icon:'⚔️',name:{ja:'シュタルク',en:'Stark'},series:{ja:'葬送のフリーレン',en:'Frieren: Beyond Journey\'s End'},type:{ja:'臆病な勇者 (ESFP)',en:'Cowardly Hero (ESFP)'},profile:{E:3,F:3,S:4,P:3},desc:{ja:'臆病者を自称するが実際は英雄級の強さを持つ少年。フェルンへの恋心と勇気の成長が見どころ。',en:'A boy who calls himself a coward but actually possesses hero-class strength. His romance for Fern and growing courage are highlights.'},traits:{ja:['臆病','実力','成長','恋愛','勇気'],en:['Cowardly','Skilled','Growth','Romance','Courage']},radar:[85,72,78,55,68,78]},

  // ── アイドルマスター・ラブライブ系 ──────────────────────────
  {id:'honoka_ll',icon:'🌟',name:{ja:'高坂穂乃果',en:'Honoka Kousaka'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'太陽のアイドル (ENFP)',en:'Sun Idol (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'学校を救うためにアイドルを目指した μ\'s のリーダー。情熱と行動力で不可能を可能にする。',en:'The leader of μ\'s who aimed to be an idol to save their school. Makes the impossible possible with passion and action.'},traits:{ja:['情熱','リーダー','アイドル','夢','明るさ'],en:['Passion','Leader','Idol','Dream','Bright']},radar:[80,80,90,58,68,88]},

  // ── その他名作 ────────────────────────────────────────────────
  {id:'nausicaa',icon:'🌿',name:{ja:'ナウシカ',en:'Nausicaa'},series:{ja:'風の谷のナウシカ',en:'Nausicaa of the Valley of the Wind'},type:{ja:'風の谷の王女 (INFJ)',en:'Princess of the Wind Valley (INFJ)'},profile:{I:3,F:4,N:4,J:3},desc:{ja:'腐海と人間の橋渡しをしようとする王女。自然への深い敬意と人間への愛情で世界の真実に迫る。',en:'A princess who tries to bridge the toxic jungle and humanity. Approaches the truth of the world with deep respect for nature and love for people.'},traits:{ja:['自然愛','勇気','知恵','愛','王女'],en:['Nature Love','Courage','Wisdom','Love','Princess']},radar:[72,92,72,78,82,88]},
  {id:'howl',icon:'✨',name:{ja:'ハウル',en:'Howl'},series:{ja:'ハウルの動く城',en:'Howl\'s Moving Castle'},type:{ja:'魔法使いの見栄っ張り (ENFP)',en:'Vain Wizard (ENFP)'},profile:{E:3,F:3,N:4,P:4},desc:{ja:'見た目と力にこだわる魔法使い。自由奔放で脆弱な内面を持ちながらソフィーへの愛で成長する。',en:'A wizard obsessed with appearance and power. Free-spirited with a fragile inner world but grows through love for Sophie.'},traits:{ja:['魔法使い','見栄張り','自由','愛','成長'],en:['Wizard','Vain','Freedom','Love','Growth']},radar:[72,72,78,75,58,72]},
  {id:'porco_rosso',icon:'🐷',name:{ja:'マルコ（紅の豚）',en:'Marco (Porco Rosso)'},series:{ja:'紅の豚',en:'Porco Rosso'},type:{ja:'孤独なエース (ISTP)',en:'Lone Ace (ISTP)'},profile:{I:4,T:3,S:4,P:3},desc:{ja:'豚に変えられた伝説の飛行艇乗り。「飛べない豚はただの豚だ」という哲学と孤独な美学が魅力。',en:'A legendary flying boat pilot turned into a pig. The philosophy "A pig who can\'t fly is just a pig" and solitary aesthetics are charming.'},traits:{ja:['孤独','飛行','哲学','誇り','美学'],en:['Solitary','Flight','Philosophy','Pride','Aesthetics']},radar:[80,52,52,80,72,58]},

  // ── STEINS;GATE（追加） ──────────────────────────────────────
  {id:'mayuri_sg',icon:'🌟',name:{ja:'椎名まゆり',en:'Mayuri Shiina'},series:{ja:'シュタインズ・ゲート',en:'Steins;Gate'},type:{ja:'天真爛漫な少女 (ESFP)',en:'Carefree Girl (ESFP)'},profile:{E:3,F:4,S:3,P:4},desc:{ja:'岡部の幼馴染で温かく純粋な心を持つ少女。「チュートリアル！」の口癖が愛らしく、存在が物語の中心にある。',en:'Okabe\'s childhood friend with a warm and pure heart. Her catchphrase "Tutturu!" is endearing, and her existence is at the center of the story.'},traits:{ja:['純粋','温かさ','幼馴染','愛らしさ','絆'],en:['Pure','Warmth','Childhood Friend','Adorable','Bond']},radar:[55,88,82,45,65,92]},

  // ── ノーゲーム・ノーライフ（追加） ──────────────────────────
  {id:'stephanie_ngnl',icon:'🎀',name:{ja:'ステファニー・ドーラ',en:'Stephanie Dola'},series:{ja:'ノーゲーム・ノーライフ',en:'No Game No Life'},type:{ja:'頑張る王女 (ESFJ)',en:'Hardworking Princess (ESFJ)'},profile:{E:3,F:4,S:3,J:3},desc:{ja:'ゲームは苦手だが正義感が強い王女。空白との関わりで成長し祖国を守るために尽力する。',en:'A princess who is poor at games but has a strong sense of justice. Grows through her relationship with Blank and works to protect her homeland.'},traits:{ja:['正義感','成長','王女','誠実','努力'],en:['Justice','Growth','Princess','Sincere','Effort']},radar:[60,82,72,52,75,78]},

  // ── NARUTO（さらに追加） ─────────────────────────────────────
  {id:'tsunade',icon:'💪',name:{ja:'綱手',en:'Tsunade'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'伝説の三忍 (ENTJ)',en:'Legendary Sannin (ENTJ)'},profile:{E:3,T:3,N:3,J:4},desc:{ja:'木ノ葉の五代目火影にして伝説の三忍の一人。豪快で賭け好きだが医療忍術の達人で仲間を守る強さを持つ。',en:'The 5th Hokage of Konoha and one of the Legendary Sannin. Boisterous and loves gambling but is a master of medical ninjutsu with strength to protect companions.'},traits:{ja:['強さ','医療忍術','賭け好き','リーダー','仲間'],en:['Strong','Medical Ninjutsu','Gambling','Leader','Comrades']},radar:[88,72,72,78,85,70]},
  {id:'orochimaru',icon:'🐍',name:{ja:'大蛇丸',en:'Orochimaru'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'禁術の実験者 (INTJ)',en:'Forbidden Jutsu Experimenter (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'全ての禁術を習得しようとする元木ノ葉の三忍。不死と知識への執着が彼を反社会的な道へ導いた。',en:'A former Konoha Sannin who seeks to master all forbidden jutsu. Obsession with immortality and knowledge led him down an antisocial path.'},traits:{ja:['禁術','不死','知識','実験','謎'],en:['Forbidden Jutsu','Immortality','Knowledge','Experimentation','Mysterious']},radar:[52,35,42,98,82,38]},
  {id:'pain_naruto',icon:'🔱',name:{ja:'ペイン（長門）',en:'Pain (Nagato)'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'神を名乗る者 (INFJ)',en:'One Who Claims Godhood (INFJ)'},profile:{I:3,F:3,N:4,J:4},desc:{ja:'「痛みを知らぬ者に平和は語れない」という信念を持つ長門。深い苦しみから生まれた歪んだ平和への願望が悲劇的。',en:'Nagato with the conviction "one who has not known pain cannot speak of peace." His twisted wish for peace born from deep suffering is tragic.'},traits:{ja:['神','苦痛','平和','悲劇','信念'],en:['God','Pain','Peace','Tragic','Conviction']},radar:[62,65,55,92,88,48]},
  {id:'obito',icon:'🌙',name:{ja:'うちはオビト',en:'Obito Uchiha'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'愛に歪んだ英雄 (INFJ)',en:'Love-Twisted Hero (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'かつてナルトと同じ夢を持ちながら愛する人の死で絶望した忍者。その歪みと後悔が人間的な魅力を生む。',en:'A ninja who once shared the same dream as Naruto but despaired at the death of his beloved. That distortion and regret creates human charm.'},traits:{ja:['絶望','愛','後悔','成長','悲劇'],en:['Despair','Love','Regret','Growth','Tragic']},radar:[65,68,55,85,78,55]},
  {id:'ino',icon:'🌸',name:{ja:'山中いの',en:'Ino Yamanaka'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'花の忍者 (ESFJ)',en:'Flower Ninja (ESFJ)'},profile:{E:4,F:3,S:3,J:3},desc:{ja:'自信家でおしゃれ好きな忍者。医療忍者として成長し、仲間への情報収集で活躍する。',en:'A confident, fashion-loving ninja. Grows as a medical ninja, excelling in information gathering for companions.'},traits:{ja:['自信家','花','成長','情報','仲間'],en:['Confident','Flower','Growth','Information','Comrades']},radar:[72,72,80,68,72,72]},
  {id:'killer_bee',icon:'🎤',name:{ja:'キラービー',en:'Killer B'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'ラップする尾獣使い (ESFP)',en:'Rapping Jinchuriki (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'八尾を制御したユニークな尾獣使い。ラップが口癖で自由奔放だが戦闘では圧倒的な強さを発揮する。',en:'A unique jinchuriki who controls the Eight-Tails. Rap is his habit and he is free-spirited but shows overwhelming strength in battle.'},traits:{ja:['ラップ','尾獣','自由','強さ','仲間'],en:['Rap','Tailed Beast','Freedom','Strong','Comrades']},radar:[88,72,85,65,70,80]},

  // ── ワンピース（さらに追加） ─────────────────────────────────
  {id:'hancock',icon:'🐍',name:{ja:'ボア・ハンコック',en:'Boa Hancock'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'最強の女帝 (ENTJ)',en:'Mightiest Empress (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'女を魅了する絶世の美女でユキュユの実を持つ女帝。冷酷な外見の裏にルフィへの純粋な愛がある。',en:'An empress with the Love-Love Fruit who captivates all women. Behind her cold exterior lies pure love for Luffy.'},traits:{ja:['最強','美女','女帝','プライド','愛'],en:['Strongest','Beautiful','Empress','Pride','Love']},radar:[88,55,65,82,85,68]},
  {id:'whitebeard',icon:'🔱',name:{ja:'白ひげ（エドワード・ニューゲート）',en:'Whitebeard (Edward Newgate)'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'最強の男 (ENFJ)',en:'Strongest Man (ENFJ)'},profile:{E:3,F:4,N:2,J:3},desc:{ja:'「海の父」として仲間を家族と呼んだ最強の男。その死とエースへの愛が頂上戦争最大の感動を生んだ。',en:'The strongest man who called his companions family as "Father of the Sea." His death and love for Ace created the greatest emotion of the Marineford War.'},traits:{ja:['最強','父','仲間','愛','誇り'],en:['Strongest','Father','Comrades','Love','Pride']},radar:[98,85,80,72,88,80]},
  {id:'doflamingo',icon:'🕶️',name:{ja:'ドフラミンゴ',en:'Doflamingo'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'天竜人の堕落者 (ENTJ)',en:'Fallen Celestial Dragon (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'天竜人の出自を持ちながら海賊として君臨する悪役。過去の苦しみから生まれた歪んだ支配欲が彼を悲劇的にする。',en:'A villain who reigns as a pirate despite celestial dragon origins. His distorted desire for control born from past suffering makes him tragic.'},traits:{ja:['支配','過去','天竜人','カリスマ','悲劇'],en:['Control','Past','Celestial Dragon','Charismatic','Tragic']},radar:[88,45,72,92,90,42]},
  {id:'vivi_op',icon:'👑',name:{ja:'ネフェルタリ・ビビ',en:'Nefertari Vivi'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'アラバスタの王女 (ENFJ)',en:'Princess of Alabasta (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'国を守るために麦わら一味と旅した王女。仲間への愛情と国民への責任感を両立する成熟したキャラクター。',en:'A princess who traveled with the Straw Hat Crew to protect her country. A mature character who balances love for companions and responsibility to her people.'},traits:{ja:['王女','責任','愛情','成長','仲間'],en:['Princess','Responsibility','Love','Growth','Comrades']},radar:[72,88,75,72,82,85]},

  // ── ブリーチ（さらに追加） ───────────────────────────────────
  {id:'hitsugaya',icon:'❄️',name:{ja:'日番谷冬獅郎',en:'Toshiro Hitsugaya'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'氷雪の天才 (INTJ)',en:'Ice and Snow Genius (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'最年少で隊長になった天才死神。真面目でプライドが高いが仲間への責任感は誰よりも強い。',en:'The youngest ever to become a captain. Serious with high pride but has stronger sense of responsibility to companions than anyone.'},traits:{ja:['天才','氷雪','プライド','責任','成長'],en:['Genius','Ice','Pride','Responsibility','Growth']},radar:[78,62,52,88,85,62]},
  {id:'matsumoto',icon:'🍷',name:{ja:'松本乱菊',en:'Rangiku Matsumoto'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'自由な副隊長 (ESFP)',en:'Free-Spirited Vice-Captain (ESFP)'},profile:{E:4,F:3,S:3,P:4},desc:{ja:'日番谷の副隊長で酒と怠惰を愛する女性。明るい外面の裏に深い孤独と過去の傷を隠す。',en:'Hitsugaya\'s vice-captain who loves alcohol and laziness. Behind her bright exterior hides deep solitude and past wounds.'},traits:{ja:['自由','酒','副隊長','孤独','仲間'],en:['Freedom','Alcohol','Vice-Captain','Solitude','Comrades']},radar:[72,72,85,55,65,75]},
  {id:'renji_bleach',icon:'🔴',name:{ja:'阿散井恋次',en:'Renji Abarai'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'負けず嫌いの副隊長 (ESTP)',en:'Competitive Vice-Captain (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'ルキアへの幼馴染の絆を持つ副隊長。一護に敗北しながら成長し続ける熱血漢。',en:'A vice-captain with childhood friend bonds with Rukia. A hot-blooded person who keeps growing after defeat by Ichigo.'},traits:{ja:['負けず嫌い','幼馴染','成長','熱血','仲間'],en:['Competitive','Childhood Friend','Growth','Hot-Blooded','Comrades']},radar:[82,65,72,68,72,75]},
  {id:'ishida_uryu',icon:'🏹',name:{ja:'石田雨竜',en:'Uryu Ishida'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'誇り高き弓師 (ISTJ)',en:'Proud Quincy (ISTJ)'},profile:{I:3,T:4,S:3,J:4},desc:{ja:'クインシーとしての誇りを持つ一護の仲間。冷静で分析的だが仲間への強い絆を秘める。',en:'Ichigo\'s companion with pride as a Quincy. Calm and analytical but secretly holds strong bonds with companions.'},traits:{ja:['クインシー','誇り','冷静','仲間','成長'],en:['Quincy','Pride','Calm','Comrades','Growth']},radar:[68,62,52,85,80,65]},

  // ── 進撃の巨人（さらに追加） ─────────────────────────────────
  {id:'zeke_aot',icon:'💀',name:{ja:'ジーク・イェーガー',en:'Zeke Yeager'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'哲学的な獣の巨人 (INTJ)',en:'Philosophical Beast Titan (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'「安楽死計画」を信じる獣の巨人。複雑な過去と哲学的な思想が彼を単純な悪役ではなくする。',en:'The Beast Titan who believes in the "Euthanasia Plan." Complex past and philosophical thoughts prevent him from being a simple villain.'},traits:{ja:['哲学','獣の巨人','計画','父親','悲劇'],en:['Philosophy','Beast Titan','Plan','Father','Tragic']},radar:[62,55,52,92,85,45]},
  {id:'pieck_aot',icon:'🐕',name:{ja:'ピーク・フィンガー',en:'Pieck Finger'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'車力の巨人 (ENFJ)',en:'Cart Titan (ENFJ)'},profile:{E:3,F:3,N:4,J:3},desc:{ja:'車力の巨人として長時間変身できる能力を持つ。クールな判断力と仲間への深い信頼が彼女の魅力。',en:'Possesses the ability to remain transformed for long periods as the Cart Titan. Her cool judgment and deep trust in companions are charming.'},traits:{ja:['車力','冷静','仲間','信頼','成長'],en:['Cart Titan','Calm','Comrades','Trust','Growth']},radar:[72,72,65,80,78,68]},

  // ── 僕のヒーローアカデミア（さらに追加） ────────────────────
  {id:'kaminari',icon:'⚡',name:{ja:'上鳴電気',en:'Denki Kaminari'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'電撃のムードメーカー (ESFP)',en:'Lightning Mood Maker (ESFP)'},profile:{E:4,F:3,S:3,P:3},desc:{ja:'電気の個性を持つクラスのムードメーカー。頭が電撃で吹き飛ぶこともあるが仲間を元気づける存在。',en:'The class mood-maker with an electricity quirk. His head sometimes short-circuits but he energizes companions.'},traits:{ja:['電気','ムードメーカー','明るさ','失敗','成長'],en:['Electricity','Mood Maker','Cheerful','Failure','Growth']},radar:[55,72,88,52,55,82]},
  {id:'mirio',icon:'🌟',name:{ja:'爆豪勝己',en:'Mirio Togata'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'ルミリオンの微笑み (ENFJ)',en:'Lemillion\'s Smile (ENFJ)'},profile:{E:4,F:4,N:3,J:3},desc:{ja:'「100万人を救うヒーロー」を夢見るミリオ。どんな状況でも笑顔を忘れない精神的な強さが魅力。',en:'Mirio who dreams of "a hero who saves a million people." The mental strength of never forgetting to smile in any situation is charming.'},traits:{ja:['笑顔','夢','強さ','精神力','仲間'],en:['Smile','Dream','Strong','Mental Strength','Comrades']},radar:[88,88,88,72,82,92]},

  // ── 鬼滅の刃（さらに追加） ──────────────────────────────────
  {id:'muzan',icon:'🌙',name:{ja:'鬼舞辻無惨',en:'Muzan Kibutsuji'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'鬼の始祖 (INTJ)',en:'First Demon (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'全ての鬼の始祖にして最強の存在。死への恐怖と完璧主義が極端な残虐性を生んだ。',en:'The progenitor of all demons and the strongest existence. Fear of death and perfectionism gave birth to extreme cruelty.'},traits:{ja:['最強','始祖','残虐','完璧主義','恐怖'],en:['Strongest','First Demon','Cruel','Perfectionist','Fear']},radar:[98,28,40,95,92,30]},
  {id:'akaza',icon:'💢',name:{ja:'猗窩座',en:'Akaza'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'強さへの執着 (ISTP)',en:'Obsession with Strength (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'強さのみを信じる上弦の参。過去には守るべき大切な人がいたことが物語に深みを与える。',en:'The Upper Three who believes only in strength. The fact that he once had precious people to protect adds depth to the story.'},traits:{ja:['強さ','執着','過去','変化','悲劇'],en:['Strength','Obsession','Past','Change','Tragic']},radar:[92,45,52,75,72,45]},

  // ── HUNTER×HUNTER（さらに追加） ──────────────────────────────
  {id:'illumi_hxh',icon:'🎯',name:{ja:'イルミ・ゾルディック',en:'Illumi Zoldyck'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'異常な暗殺者 (INTJ)',en:'Aberrant Assassin (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'キルアの兄で極めて歪んだ愛情を持つ暗殺者。キルアへの執着が家族の異常な関係性を象徴する。',en:'Killua\'s brother, an assassin with extremely twisted affection. His obsession with Killua symbolizes the family\'s abnormal relationships.'},traits:{ja:['暗殺者','異常な愛','兄弟','歪み','計算'],en:['Assassin','Twisted Love','Siblings','Distortion','Calculating']},radar:[82,35,40,95,88,32]},
  {id:'komugi_hxh',icon:'🎯',name:{ja:'コムギ',en:'Komugi'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'軍儀の天才 (INFP)',en:'Gungi Genius (INFP)'},profile:{I:4,F:4,N:4,P:3},desc:{ja:'盲目の軍儀世界王者。メルエムの心を開かせた存在で、その純粋さとゲームへの情熱が感動的。',en:'The blind world champion of Gungi. The existence who opened Meruem\'s heart, with purity and passion for the game that is moving.'},traits:{ja:['天才','純粋','盲目','軍儀','感動'],en:['Genius','Pure','Blind','Gungi','Moving']},radar:[40,88,38,100,68,92]},

  // ── ドラゴンボール（さらに追加） ─────────────────────────────
  {id:'gotenks',icon:'🌀',name:{ja:'ゴテンクス',en:'Gotenks'},series:{ja:'ドラゴンボール Z',en:'Dragon Ball Z'},type:{ja:'天才のフュージョン (ESTP)',en:'Genius Fusion (ESTP)'},profile:{E:4,T:2,S:4,P:4},desc:{ja:'悟天とトランクスのフュージョン。天才的な実力を持ちながら調子に乗りやすい性格が愛らしい。',en:'The fusion of Goten and Trunks. Has genius-level ability but an easily overconfident personality that is endearing.'},traits:{ja:['フュージョン','天才','調子乗り','面白い','強さ'],en:['Fusion','Genius','Overconfident','Funny','Strong']},radar:[90,55,82,52,48,72]},
  {id:'cell_db',icon:'🔬',name:{ja:'セル',en:'Cell'},series:{ja:'ドラゴンボール Z',en:'Dragon Ball Z'},type:{ja:'完璧な生命体 (INTJ)',en:'Perfect Life Form (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'全ての生命体のDNAから作られた「完全体」。完璧さへの執着と自信が彼を興味深い悪役にする。',en:'The "Perfect Form" made from all life forms\' DNA. Obsession with perfection and confidence make him an interesting villain.'},traits:{ja:['完全体','完璧','計算','強さ','悪役'],en:['Perfect Form','Perfection','Calculating','Strong','Villain']},radar:[95,38,52,92,88,40]},

  // ── ハイキュー（さらに追加） ─────────────────────────────────
  {id:'daichi_hq',icon:'🏐',name:{ja:'澤村大地',en:'Daichi Sawamura'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'信頼の主将 (ESTJ)',en:'Reliable Captain (ESTJ)'},profile:{E:3,T:3,S:4,J:4},desc:{ja:'烏野高校バレー部のキャプテン。チームの要として仲間を信じ支える頼れるリーダー。',en:'Captain of Karasuno High School volleyball team. The pillar of the team, a reliable leader who trusts and supports companions.'},traits:{ja:['主将','信頼','リーダー','成長','仲間'],en:['Captain','Trust','Leader','Growth','Comrades']},radar:[78,78,78,72,88,75]},
  {id:'nishinoya_hq',icon:'⚡',name:{ja:'西谷夕',en:'Yu Nishinoya'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'リベロの守り神 (ESFP)',en:'Guardian Deity Libero (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'「守り神」と呼ばれるリベロ。小柄だが情熱的でチームのムードを高める存在。',en:'A libero called the "Guardian Deity." Small but passionate, he elevates the team\'s morale.'},traits:{ja:['リベロ','守り神','情熱','小柄','ムードメーカー'],en:['Libero','Guardian','Passion','Small','Mood Maker']},radar:[82,72,88,55,72,85]},
  {id:'kuroo_hq',icon:'🐱',name:{ja:'黒尾鉄朗',en:'Tetsuro Kuroo'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'策略家の主将 (ENTP)',en:'Scheming Captain (ENTP)'},profile:{E:3,T:3,N:4,P:3},desc:{ja:'猫又高校の主将でケンマの幼馴染。策略的な試合運びと鋭い洞察力でチームを引っ張る。',en:'Nekoma\'s captain and Kenma\'s childhood friend. Leads the team with scheming gameplay and sharp insight.'},traits:{ja:['策略家','主将','洞察','幼馴染','知性'],en:['Schemer','Captain','Insight','Childhood Friend','Intelligence']},radar:[78,68,72,85,80,72]},
  {id:'ushijima_hq',icon:'🏐',name:{ja:'牛島若利',en:'Wakatoshi Ushijima'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'最強エース (ISTJ)',en:'Strongest Ace (ISTJ)'},profile:{I:4,T:4,S:4,J:4},desc:{ja:'白鳥沢のエースで高校バレー界最強の選手。無表情で寡黙だが練習への取り組みと実力は圧倒的。',en:'Shiratorizawa\'s ace and the strongest player in high school volleyball. Expressionless and taciturn but his dedication to practice and ability are overwhelming.'},traits:{ja:['最強','エース','寡黙','圧倒的','誠実'],en:['Strongest','Ace','Taciturn','Overwhelming','Sincere']},radar:[95,45,40,88,90,55]},
  {id:'akaashi_hq',icon:'🦉',name:{ja:'赤葦京治',en:'Keiji Akaashi'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'冷静なセッター (INTJ)',en:'Calm Setter (INTJ)'},profile:{I:3,T:4,N:3,J:3},desc:{ja:'梟谷のセッターでボクトのパートナー。冷静に木兎のメンタルを管理しながら戦略的なトスを供給する。',en:'Fukurodani\'s setter and Bokuto\'s partner. Calmly manages Bokuto\'s mentality while delivering strategic tosses.'},traits:{ja:['冷静','セッター','分析','パートナー','知性'],en:['Calm','Setter','Analytical','Partner','Intelligence']},radar:[65,68,55,88,78,65]},

  // ── Your Lie in April ─────────────────────────────────────────
  {id:'kousei_ylia',icon:'🎹',name:{ja:'有馬公生',en:'Kousei Arima'},series:{ja:'四月は君の嘘',en:'Your Lie in April'},type:{ja:'音を失った音楽家 (INFP)',en:'Musician Who Lost Sound (INFP)'},profile:{I:4,F:3,N:4,P:3},desc:{ja:'母の死以来ピアノの音が聞こえなくなった天才ピアニスト。かをりとの出会いで再び音楽の世界に踏み出す。',en:'A genius pianist who stopped hearing piano sounds after his mother\'s death. Kaori\'s encounter leads him to step back into the world of music.'},traits:{ja:['天才','音楽','喪失','成長','感情'],en:['Genius','Music','Loss','Growth','Emotion']},radar:[52,82,52,82,65,85]},
  {id:'kaori_ylia',icon:'🎻',name:{ja:'宮園かをり',en:'Kaori Miyazono'},series:{ja:'四月は君の嘘',en:'Your Lie in April'},type:{ja:'自由な音楽家 (ENFP)',en:'Free Musician (ENFP)'},profile:{E:4,F:4,N:3,P:4},desc:{ja:'自由な音楽で公生を変えたバイオリニスト。秘密を抱えながらも最後まで音楽への情熱を燃やす。',en:'A violinist who changed Kousei with free music. Burns passion for music until the end while carrying a secret.'},traits:{ja:['自由','音楽','情熱','秘密','感動'],en:['Freedom','Music','Passion','Secret','Moving']},radar:[72,88,85,62,68,92]},

  // ── Anohana ───────────────────────────────────────────────────
  {id:'jinta_anohana',icon:'🌻',name:{ja:'宿海仁太（じんたん）',en:'Jinta Yadomi (Jintan)'},series:{ja:'あの日見た花の名前を僕達はまだ知らない。',en:'AnoHana'},type:{ja:'引きこもりの優しさ (INFP)',en:'Shut-In\'s Kindness (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'めんまの死後引きこもりになった少年。彼女の「願いを叶えたい」という想いで再び仲間と向き合う。',en:'A boy who became a shut-in after Menma\'s death. Her wish to "fulfill her wish" makes him face companions again.'},traits:{ja:['引きこもり','成長','友情','願い','感動'],en:['Shut-In','Growth','Friendship','Wish','Moving']},radar:[55,78,52,65,68,80]},
  {id:'menma_anohana',icon:'🌸',name:{ja:'本間芽衣子（めんま）',en:'Meiko Honma (Menma)'},series:{ja:'あの日見た花の名前を僕達はまだ知らない。',en:'AnoHana'},type:{ja:'天使のような幽霊 (ENFJ)',en:'Angelic Ghost (ENFJ)'},profile:{E:3,F:4,N:3,J:2},desc:{ja:'幼くして亡くなった少女の幽霊。仲間の笑顔のために「願い」を叶えようとする純粋さが涙を誘う。',en:'The ghost of a girl who died young. The purity of trying to fulfill a "wish" for her companions\' smiles draws tears.'},traits:{ja:['幽霊','純粋','愛情','願い','感動'],en:['Ghost','Pure','Love','Wish','Moving']},radar:[55,95,72,52,65,98]},

  // ── CLANNAD（追加） ──────────────────────────────────────────
  {id:'tomoya_clannad',icon:'🌸',name:{ja:'岡崎朋也',en:'Tomoya Okazaki'},series:{ja:'CLANNAD',en:'Clannad'},type:{ja:'家族を学ぶ男 (INFJ)',en:'Man Learning Family (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'不良として過ごしていたが渚との出会いで変わる。「家族」の意味を学びながら成長する物語の主人公。',en:'Spent time as a delinquent but changes through meeting Nagisa. The protagonist of a story learning the meaning of "family" while growing.'},traits:{ja:['成長','家族','愛情','過去','変化'],en:['Growth','Family','Love','Past','Change']},radar:[65,80,62,72,75,80]},

  // ── K-ON! ─────────────────────────────────────────────────────
  {id:'yui_kon',icon:'🎸',name:{ja:'平沢唯',en:'Yui Hirasawa'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'天然のギタリスト (ENFP)',en:'Natural Guitarist (ENFP)'},profile:{E:3,F:4,N:3,P:4},desc:{ja:'初心者ながら天才的なギター感覚を持つ軽音部のリーダー。天然で明るくみんなを笑顔にする。',en:'A beginner with genius guitar sense who leads the Light Music Club. Natural and cheerful, she makes everyone smile.'},traits:{ja:['天然','ギター','明るさ','天才','食いしん坊'],en:['Natural','Guitar','Cheerful','Genius','Foodie']},radar:[68,85,90,52,55,92]},
  {id:'mio_kon',icon:'🎸',name:{ja:'秋山澪',en:'Mio Akiyama'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'恥ずかしがりのベーシスト (ISTJ)',en:'Shy Bassist (ISTJ)'},profile:{I:4,F:3,S:3,J:3},desc:{ja:'ベースと作詞が得意だが人見知りで恥ずかしがり。真面目で実力があるが人前に出るのが苦手。',en:'Good at bass and lyrics but shy and introverted. Serious with real ability but uncomfortable being in the spotlight.'},traits:{ja:['ベース','恥ずかしがり','真面目','作詞','成長'],en:['Bass','Shy','Serious','Lyrics','Growth']},radar:[62,72,48,75,78,72]},
  {id:'ritsu_kon',icon:'🥁',name:{ja:'田井中律',en:'Ritsu Tainaka'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'元気なドラマー (ESFP)',en:'Energetic Drummer (ESFP)'},profile:{E:4,F:3,S:3,P:3},desc:{ja:'軽音部の部長でドラム担当。元気いっぱいで天真爛漫、澪へのツッコミが名物。',en:'The club president and drummer of the Light Music Club. Full of energy and carefree, her tsukkomi to Mio is legendary.'},traits:{ja:['ドラム','元気','天真爛漫','ツッコミ','リーダー'],en:['Drums','Energetic','Carefree','Tsukkomi','Leader']},radar:[72,72,88,55,62,85]},

  // ── DURARARA!! ───────────────────────────────────────────────
  {id:'shizuo_drrr',icon:'💪',name:{ja:'平和島静雄',en:'Shizuo Heiwajima'},series:{ja:'デュラララ!!',en:'Durarara!!'},type:{ja:'怪力の番長 (ISTP)',en:'Super-Strength Enforcer (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'人間離れした怪力を持ちながら「平和」を望む男。イザヤへの怒りが物語の重要な軸になる。',en:'A man with superhuman strength who desires "peace." His anger toward Izaya becomes an important axis of the story.'},traits:{ja:['怪力','怒り','平和','誠実','仲間'],en:['Super Strength','Anger','Peace','Sincere','Comrades']},radar:[88,65,65,52,72,72]},
  {id:'izaya_drrr',icon:'🎭',name:{ja:'折原臨也',en:'Izaya Orihara'},series:{ja:'デュラララ!!',en:'Durarara!!'},type:{ja:'人間観察者 (ENTP)',en:'Human Observer (ENTP)'},profile:{E:4,T:4,N:4,P:3},desc:{ja:'人間を愛しながら弄び続ける情報屋。カオスを楽しみ静雄との戦いを愛する複雑な存在。',en:'An information broker who loves yet toys with humans. A complex existence who enjoys chaos and loves battling Shizuo.'},traits:{ja:['人間愛','情報屋','カリスマ','混沌','計算'],en:['Loves Humans','Info Broker','Charismatic','Chaos','Calculating']},radar:[62,42,72,95,72,45]},

  // ── 黒執事 ────────────────────────────────────────────────────
  {id:'sebastian_cb',icon:'🖤',name:{ja:'セバスチャン・ミカエリス',en:'Sebastian Michaelis'},series:{ja:'黒執事',en:'Black Butler'},type:{ja:'完全なる執事 (INTJ)',en:'Perfect Butler (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'悪魔でありながら完全なる執事を演じる存在。「一流の執事とは主人のためにすべてを捧げるもの」という信念を持つ。',en:'A demon who performs the role of a perfect butler. Holds the conviction that "a first-class butler dedicates everything for the master."'},traits:{ja:['完全','悪魔','執事','忠誠','謎'],en:['Perfect','Demon','Butler','Loyal','Mysterious']},radar:[78,55,60,95,92,48]},
  {id:'ciel_cb',icon:'💎',name:{ja:'シエル・ファントムハイヴ',en:'Ciel Phantomhive'},series:{ja:'黒執事',en:'Black Butler'},type:{ja:'復讐の伯爵 (INTJ)',en:'Earl of Revenge (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'両親の死の復讐を誓う幼い伯爵。悪魔と契約しながら表の世界で伯爵として生きる二面性が魅力。',en:'A young earl who swears revenge for his parents\' deaths. The duality of living as an earl in the surface world while contracted with a demon is charming.'},traits:{ja:['復讐','伯爵','契約','プライド','孤独'],en:['Revenge','Earl','Contract','Pride','Solitude']},radar:[62,48,52,90,85,55]},

  // ── 鬼滅の刃（さらに追加） ──────────────────────────────────
  {id:'douma',icon:'🌸',name:{ja:'童磨',en:'Douma'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'愛なき上弦の弐 (ENTP)',en:'Loveless Upper Two (ENTP)'},profile:{E:4,T:4,N:4,P:3},desc:{ja:'感情がないと自ら認める上弦の弐。しのぶの死に関わりカナヲとの決着が印象的な複雑な悪役。',en:'The Upper Two who admits having no emotions. A complex villain whose involvement in Shinobu\'s death and showdown with Kanao are memorable.'},traits:{ja:['感情なし','上弦','複雑','カリスマ','悪役'],en:['No Emotion','Upper Moon','Complex','Charismatic','Villain']},radar:[75,28,62,88,82,32]},

  // ── オーバーロード（さらに追加） ─────────────────────────────
  {id:'demiurge_ol',icon:'😈',name:{ja:'デミウルゴス',en:'Demiurge'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'悪の策謀者 (INTJ)',en:'Evil Schemer (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ナザリックで最も知能が高い守護者。アインズの意図を超えた解釈で計画を進める恐ろしい存在。',en:'The most intelligent guardian of Nazarick. A terrifying existence who advances plans with interpretations that exceed Ainz\'s intentions.'},traits:{ja:['策謀','知性','悪','忠誠','計算'],en:['Scheming','Intelligence','Evil','Loyal','Calculating']},radar:[52,35,38,100,88,32]},
  {id:'shalltear_ol',icon:'🩸',name:{ja:'シャルティア・ブラッドフォールン',en:'Shalltear Bloodfallen'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'吸血鬼の守護者 (ESTJ)',en:'Vampire Guardian (ESTJ)'},profile:{E:3,T:3,S:4,J:4},desc:{ja:'アインズへの崇拝が高いナザリックの守護者。プライドが高く戦闘力は最高クラスの吸血鬼。',en:'A Nazarick guardian with high devotion to Ainz. A vampire with high pride and top-class combat ability.'},traits:{ja:['吸血鬼','プライド','忠誠','最強','崇拝'],en:['Vampire','Pride','Loyal','Strongest','Devout']},radar:[88,45,55,82,85,55]},

  // ── 転生したらスライムだった件（さらに追加） ─────────────────
  {id:'benimaru_tensura',icon:'🔥',name:{ja:'ベニマル',en:'Benimaru'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'鬼族の将軍 (ESTJ)',en:'Ogre General (ESTJ)'},profile:{E:3,T:4,S:4,J:4},desc:{ja:'リムルに忠誠を誓う鬼族の将軍。圧倒的な戦闘能力と仲間への責任感を持つ頼れるリーダー。',en:'An ogre general sworn to loyalty to Rimuru. A reliable leader with overwhelming combat ability and sense of responsibility to companions.'},traits:{ja:['将軍','忠誠','強さ','責任','仲間'],en:['General','Loyal','Strong','Responsibility','Comrades']},radar:[90,65,68,80,88,72]},
  {id:'shuna_tensura',icon:'🌸',name:{ja:'シュナ',en:'Shuna'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'鬼族の姫 (ISFJ)',en:'Ogre Princess (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'リムルへの深い忠誠と愛情を持つ鬼族の姫。魔術の才能と内政の能力で国を支える。',en:'An ogre princess with deep loyalty and love for Rimuru. Supports the nation with magical talent and administrative ability.'},traits:{ja:['姫','忠誠','魔術','愛情','誠実'],en:['Princess','Loyal','Magic','Love','Sincere']},radar:[65,88,65,75,80,85]},

  // ── 五等分の花嫁 ─────────────────────────────────────────────
  {id:'ichika_nakano',icon:'📷',name:{ja:'中野一花',en:'Ichika Nakano'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'長女の気配り (ENFJ)',en:'Eldest Daughter\'s Care (ENFJ)'},profile:{E:3,F:3,N:3,J:3},desc:{ja:'五姉妹の長女で女優を目指す。姉としての責任感と妹たちへの愛情が彼女を魅力的にする。',en:'The eldest of the five sisters who aims to be an actress. Sense of responsibility as an elder sister and love for her younger sisters make her charming.'},traits:{ja:['長女','女優','責任','愛情','成長'],en:['Eldest','Actress','Responsibility','Love','Growth']},radar:[72,80,78,68,78,78]},
  {id:'miku_nakano',icon:'🎧',name:{ja:'中野三玖',en:'Miku Nakano'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'歴史マニアの戦国ヲタク (INFP)',en:'History-Obsessed Sengoku Otaku (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'戦国武将が大好きでヘッドフォンがトレードマークの三女。内気だが想いはまっすぐな純粋な少女。',en:'The third daughter who loves Sengoku warlords and whose trademark is headphones. Shy but with straightforward feelings, a pure girl.'},traits:{ja:['歴史ヲタク','内気','純粋','成長','ヘッドフォン'],en:['History Otaku','Shy','Pure','Growth','Headphones']},radar:[55,78,55,72,68,82]},
  {id:'nino_nakano',icon:'🌹',name:{ja:'中野二乃',en:'Nino Nakano'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'次女の素直な愛 (ESFP)',en:'Second Daughter\'s Direct Love (ESFP)'},profile:{E:3,F:3,S:3,P:3},desc:{ja:'最初は風太郎を嫌うが最も積極的に愛情を示すようになる二女。素直な感情表現が魅力。',en:'The second daughter who initially dislikes Fuutarou but becomes the most proactive in showing love. Direct emotional expression is charming.'},traits:{ja:['素直','愛情','成長','情熱','変化'],en:['Direct','Love','Growth','Passionate','Change']},radar:[72,78,78,65,68,78]},

  // ── 五等分の花嫁（続き） ─────────────────────────────────────
  {id:'yotsuba_nakano',icon:'🍀',name:{ja:'中野四葉',en:'Yotsuba Nakano'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'四女の笑顔 (ESFJ)',en:'Fourth Daughter\'s Smile (ESFJ)'},profile:{E:4,F:4,S:3,J:2},desc:{ja:'いつも明るい笑顔の四女。他の姉妹のために自己犠牲を厭わない優しさが魅力的で深い物語がある。',en:'The fourth daughter with an ever-bright smile. Kindness that does not hesitate in self-sacrifice for other sisters is charming with a deep story.'},traits:{ja:['笑顔','自己犠牲','明るさ','愛情','成長'],en:['Smile','Self-Sacrifice','Cheerful','Love','Growth']},radar:[72,90,88,58,75,90]},
  {id:'itsuki_nakano',icon:'⭐',name:{ja:'中野五月',en:'Itsuki Nakano'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'五女の真面目 (ISTJ)',en:'Fifth Daughter\'s Diligence (ISTJ)'},profile:{I:3,F:3,S:3,J:3},desc:{ja:'五姉妹の末っ子で最も勉強に真面目な五月。プライドが高くフータローに反発するが次第に心を開く。',en:'The youngest of the five sisters and most serious about studying, Itsuki. Has high pride and resists Fuutarou but gradually opens her heart.'},traits:{ja:['真面目','プライド','末っ子','成長','誠実'],en:['Diligent','Pride','Youngest','Growth','Sincere']},radar:[62,72,60,72,78,72]},

  // ── FAIRY TAIL（追加） ────────────────────────────────────────
  {id:'jellal_ft',icon:'🌟',name:{ja:'ジェラール・フェルナンデス',en:'Jellal Fernandes'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'贖罪の魔法使い (INFJ)',en:'Atonement Mage (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'過去の罪を償うために戦い続ける元魔法評議会員。エルザへの愛情と贖罪の苦悩が人間的な魅力を生む。',en:'A former Magic Council member who keeps fighting to atone for past sins. Love for Erza and anguish of atonement create human charm.'},traits:{ja:['贖罪','苦悩','愛情','成長','強さ'],en:['Atonement','Anguish','Love','Growth','Strong']},radar:[72,75,55,82,78,70]},
  {id:'mavis_ft',icon:'👻',name:{ja:'メイビス・ヴァーミリオン',en:'Mavis Vermillion'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'妖精の魔女 (INFP)',en:'Fairy Witch (INFP)'},profile:{I:3,F:4,N:4,P:3},desc:{ja:'フェアリーテイル初代ギルドマスター。不老の呪いに縛られながらもギルドへの愛情は変わらない。',en:'The first Guild Master of Fairy Tail. Bound by an immortality curse but love for the guild never changes.'},traits:{ja:['初代GM','呪い','愛情','知恵','成長'],en:['1st GM','Curse','Love','Wisdom','Growth']},radar:[58,88,65,85,80,88]},
  {id:'zeref_ft',icon:'💀',name:{ja:'ゼレフ・ドラグニル',en:'Zeref Dragneel'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'死の魔法使い (INTJ)',en:'Death Mage (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'死の呪いを持つ400年生きた魔法使い。生きることへの絶望と死への渇望が複雑な悪役像を生む。',en:'A mage who has lived 400 years with a death curse. Despair at living and thirst for death create a complex villain image.'},traits:{ja:['呪い','死','孤独','絶望','成長'],en:['Curse','Death','Solitude','Despair','Growth']},radar:[55,45,38,92,82,38]},
  {id:'juvia_ft',icon:'💧',name:{ja:'ジュビア・ロクサー',en:'Juvia Lockser'},series:{ja:'FAIRY TAIL',en:'Fairy Tail'},type:{ja:'水の愛人 (ESFP)',en:'Water Lover (ESFP)'},profile:{E:3,F:4,S:3,P:3},desc:{ja:'グレイへの一途な愛情で知られる水の魔法使い。愛の表現が独特で仲間からは愛されるキャラ。',en:'A water mage known for unwavering love for Gray. Unique love expressions make her a beloved character among companions.'},traits:{ja:['愛情','一途','水','ユーモア','成長'],en:['Love','Devoted','Water','Humor','Growth']},radar:[68,88,75,55,65,85]},

  // ── 僕のヒーローアカデミア（さらに追加） ────────────────────
  {id:'kirishima',icon:'🔴',name:{ja:'切島鋭児郎',en:'Eijiro Kirishima'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'義のヒーロー (ESFP)',en:'Chivalrous Hero (ESFP)'},profile:{E:4,F:4,S:3,P:3},desc:{ja:'「男の義！」を信条にする硬化の個性を持つ少年。誰にでも真剣に向き合う真っ直ぐさが仲間に愛される。',en:'A boy with a hardening quirk who lives by "manliness!" His directness in confronting anyone seriously is loved by companions.'},traits:{ja:['義','硬化','誠実','成長','仲間'],en:['Chivalry','Hardening','Sincere','Growth','Comrades']},radar:[82,82,82,58,78,85]},
  {id:'shinso',icon:'💜',name:{ja:'心操人使',en:'Hitoshi Shinso'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'洗脳の少年 (INTJ)',en:'Brainwashing Boy (INTJ)'},profile:{I:3,T:4,N:3,J:3},desc:{ja:'洗脳の個性のためにヒーロー科に入れなかった少年。諦めない強い意志と知略でヒーローを目指す。',en:'A boy who could not enter the hero course due to his brainwashing quirk. Aims to be a hero with strong unyielding will and cunning.'},traits:{ja:['洗脳','諦めない','意志','成長','知略'],en:['Brainwashing','Unyielding','Will','Growth','Cunning']},radar:[65,55,52,82,75,60]},

  // ── Re:ゼロ（追加） ─────────────────────────────────────────
  {id:'otto_rezero',icon:'🛒',name:{ja:'オットー・スーウェン',en:'Otto Suwen'},series:{ja:'Re:ゼロ',en:'Re:Zero'},type:{ja:'商人の知恵 (ENTP)',en:'Merchant\'s Wisdom (ENTP)'},profile:{E:3,T:3,N:4,P:3},desc:{ja:'実用的な知恵と商人の経験でスバルを支える仲間。コミカルな外見の裏に本物の友情と勇気を持つ。',en:'A companion who supports Subaru with practical wisdom and merchant experience. Behind a comical appearance lies genuine friendship and courage.'},traits:{ja:['知恵','商人','友情','勇気','ユーモア'],en:['Wisdom','Merchant','Friendship','Courage','Humor']},radar:[62,72,72,75,70,72]},
  {id:'felt_rezero',icon:'🔥',name:{ja:'フェルト',en:'Felt'},series:{ja:'Re:ゼロ',en:'Re:Zero'},type:{ja:'スラム街の生存者 (ESTP)',en:'Slum Survivor (ESTP)'},profile:{E:3,T:3,S:4,P:4},desc:{ja:'スラム街で生きた少女が王選候補となる。荒削りだが純粋な正義感と生命力あふれるキャラクター。',en:'A girl who lived in the slums becomes a royal selection candidate. Raw but with pure sense of justice and vibrant life force character.'},traits:{ja:['生存者','正義','生命力','成長','王選'],en:['Survivor','Justice','Vitality','Growth','Royal Selection']},radar:[78,65,72,60,62,80]},

  // ── ホリミヤ ─────────────────────────────────────────────────
  {id:'miyamura_hori',icon:'🌸',name:{ja:'宮村伊澄',en:'Izumi Miyamura'},series:{ja:'ホリミヤ',en:'Horimiya'},type:{ja:'秘密を持つ少年 (INFP)',en:'Boy with Secrets (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'学校では地味だが家では別の顔を見せる少年。堀との関係を通じて本当の自分を見つけていく。',en:'A boy who appears plain at school but shows a different face at home. Finds his true self through his relationship with Hori.'},traits:{ja:['秘密','成長','恋愛','本物','変化'],en:['Secret','Growth','Romance','Authentic','Change']},radar:[55,75,52,68,65,78]},
  {id:'hori_hori',icon:'🎀',name:{ja:'堀京子',en:'Kyoko Hori'},series:{ja:'ホリミヤ',en:'Horimiya'},type:{ja:'二面性の優等生 (ESFJ)',en:'Two-Faced Honor Student (ESFJ)'},profile:{E:3,F:4,S:3,J:3},desc:{ja:'学校では人気者だが家では家事を一手に担う少女。宮村との出会いで本当の自分を解放する。',en:'Popular at school but single-handedly handles household chores at home. Liberates her true self through meeting Miyamura.'},traits:{ja:['二面性','優等生','家事','愛情','成長'],en:['Two-Faced','Honor Student','Housework','Love','Growth']},radar:[72,82,80,65,78,80]},

  // ── 魔法使いの嫁 ─────────────────────────────────────────────
  {id:'chise_mahou',icon:'🌿',name:{ja:'羽鳥チセ',en:'Chise Hatori'},series:{ja:'魔法使いの嫁',en:'The Ancient Magus\' Bride'},type:{ja:'古代魔法使いの嫁 (INFP)',en:'Ancient Mage\'s Bride (INFP)'},profile:{I:3,F:3,N:4,P:3},desc:{ja:'「メイヘム」として高い魔力を持ちながら自己肯定感が低い少女。エリアスと共に成長し自分の価値を見つける。',en:'A girl with high magical power as a "Sleigh Beggy" but low self-esteem. Grows with Elias and finds her own worth.'},traits:{ja:['魔力','成長','自己肯定','愛情','変化'],en:['Magic Power','Growth','Self-Worth','Love','Change']},radar:[55,78,52,72,65,75]},

  // ── 魔法少女まどか☆マギカ ─────────────────────────────────
  {id:'madoka',icon:'🌸',name:{ja:'鹿目まどか',en:'Madoka Kaname'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'希望の魔法少女 (ENFJ)',en:'Magical Girl of Hope (ENFJ)'},profile:{E:3,F:4,N:4,J:2},desc:{ja:'「全ての魔法少女の絶望を消し去りたい」という願いを叶えた少女。その犠牲と愛情が多くの涙を誘う。',en:'A girl who fulfilled the wish to "eliminate despair from all magical girls." Her sacrifice and love draw many tears.'},traits:{ja:['希望','犠牲','愛情','純粋','神'],en:['Hope','Sacrifice','Love','Pure','God']},radar:[62,95,72,65,78,95]},
  {id:'homura',icon:'🛡️',name:{ja:'暁美ほむら',en:'Homura Akemi'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'時間を超える守護者 (INTJ)',en:'Time-Transcending Guardian (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'まどかを守るために何度も時間を繰り返した少女。その孤独な愛情と強さが多くのファンを魅了した。',en:'A girl who repeatedly looped time to protect Madoka. Her solitary love and strength fascinated many fans.'},traits:{ja:['時間ループ','孤独','愛情','守護','強さ'],en:['Time Loop','Solitude','Love','Guardian','Strong']},radar:[72,58,38,92,90,55]},
  {id:'kyubey',icon:'😶',name:{ja:'キュゥべえ',en:'Kyubey'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'感情なき使魔 (INTP)',en:'Emotionless Familiar (INTP)'},profile:{I:4,T:4,N:4,P:4},desc:{ja:'感情を持たず魔法少女システムを運営するインキュベーター。その論理的な冷酷さが物語に深みを加える。',en:'An Incubator who operates the magical girl system without emotion. Its logical cruelty adds depth to the story.'},traits:{ja:['感情なし','論理','契約','謎','宇宙人'],en:['No Emotion','Logic','Contract','Mysterious','Alien']},radar:[25,20,30,98,85,22]},

  // ── まぐかな様 ────────────────────────────────────────────────
  {id:'ishigami_kag',icon:'📊',name:{ja:'石上優',en:'Yu Ishigami'},series:{ja:'かぐや様は告らせたい',en:'Kaguya-sama: Love is War'},type:{ja:'陰キャの誠実さ (INTP)',en:'Introvert\'s Sincerity (INTP)'},profile:{I:4,T:3,N:3,P:3},desc:{ja:'自己評価が低い会計担当。他者を思いやる純粋な心と不器用な誠実さが成長物語の軸になる。',en:'The treasurer with low self-evaluation. Pure heart considering others and clumsy sincerity become the axis of a growth story.'},traits:{ja:['陰キャ','誠実','成長','思いやり','不器用'],en:['Introvert','Sincere','Growth','Considerate','Clumsy']},radar:[48,72,42,72,68,78]},

  // ── 月姫・Fateシリーズ追加 ─────────────────────────────────
  {id:'lancer_fate',icon:'🏹',name:{ja:'ランサー（クー・フーリン）',en:'Lancer (Cu Chulainn)'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'誇り高き英雄 (ESTP)',en:'Proud Hero (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'誇り高くも気さくな英雄。戦いを楽しみ死を恐れない生き様が魅力的なサーヴァント。',en:'A proud yet friendly hero. A servant whose way of life enjoying battle and not fearing death is charming.'},traits:{ja:['誇り','気さく','戦士','自由','英雄'],en:['Proud','Friendly','Warrior','Freedom','Hero']},radar:[85,65,80,68,72,72]},

  // ── ブルーロック（追加） ─────────────────────────────────────
  {id:'isagi_bl',icon:'⚽',name:{ja:'潔世一',en:'Yoichi Isagi'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'空間認識の天才 (INTJ)',en:'Spatial Awareness Genius (INTJ)'},profile:{I:3,T:3,N:4,J:3},desc:{ja:'空間認識能力で世界一のストライカーを目指す少年。「エゴイスト」として成長しながら仲間との関係を学ぶ。',en:'A boy who aims to be the world\'s best striker with spatial awareness ability. Grows as an "egoist" while learning relationships with companions.'},traits:{ja:['空間認識','エゴ','成長','天才','野心'],en:['Spatial Awareness','Ego','Growth','Genius','Ambitious']},radar:[78,58,55,85,72,65]},
  {id:'bachira_bl',icon:'⚽',name:{ja:'馬狼照英',en:'Reo Mikage'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'本能のドリブラー (ESFP)',en:'Instinct Dribbler (ESFP)'},profile:{E:4,F:3,S:4,P:4},desc:{ja:'本能で動く天才ドリブラー。友人への深い想いと自由なプレースタイルが魅力のユニークなプレイヤー。',en:'A genius dribbler who moves by instinct. A unique player with deep feelings for friends and free playing style.'},traits:{ja:['本能','ドリブル','自由','友情','天才'],en:['Instinct','Dribbling','Freedom','Friendship','Genius']},radar:[85,72,85,58,60,80]},

  // ── よりもい ─────────────────────────────────────────────────
  {id:'shirase_yorimoi',icon:'🌌',name:{ja:'白石結月',en:'Yuzuki Shiraishi'},series:{ja:'宇宙よりも遠い場所',en:'A Place Further Than the Universe'},type:{ja:'南極への意志 (INFJ)',en:'Will Toward Antarctica (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'亡き母を追って南極を目指す少女。強い意志と純粋な行動力で仲間を引っ張る。',en:'A girl who aims for Antarctica chasing her deceased mother. Pulls companions forward with strong will and pure action.'},traits:{ja:['意志','南極','母','成長','勇気'],en:['Will','Antarctica','Mother','Growth','Courage']},radar:[68,78,62,78,80,80]},

  // ── ジョジョの奇妙な冒険 ──────────────────────────────────
  {id:'giorno_jojo',icon:'🌟',name:{ja:'ジョルノ・ジョバァーナ',en:'Giorno Giovanna'},series:{ja:'ジョジョの奇妙な冒険 第5部',en:"JoJo's Bizarre Adventure: Golden Wind"},type:{ja:'黄金の精神 (INFJ)',en:'Golden Spirit (INFJ)'},profile:{I:3,F:3,N:4,J:4},desc:{ja:'マフィアのボスを目指す少年。「夢は終わらせることができない」という信念で困難に立ち向かう。',en:'A boy who aims to become a mafia boss. Faces difficulties with the conviction "a dream is not something you give up on."'},traits:{ja:['黄金の精神','夢','成長','カリスマ','誇り'],en:['Golden Spirit','Dream','Growth','Charismatic','Pride']},radar:[72,72,62,85,82,75]},
  {id:'josuke_jojo',icon:'👑',name:{ja:'東方仗助',en:'Josuke Higashikata'},series:{ja:'ジョジョの奇妙な冒険 第4部',en:"JoJo's Bizarre Adventure: Diamond is Unbreakable"},type:{ja:'ダイヤモンドは砕けない (ESFP)',en:'Diamond is Unbreakable (ESFP)'},profile:{E:3,F:3,S:4,P:3},desc:{ja:'故郷杜王町を守る優しい少年。プロマイドほど大切なものを守る義侠心と温かい心が魅力。',en:'A gentle boy who protects his hometown of Morioh. A sense of justice to protect what matters like his trademark pompadour and warm heart are charming.'},traits:{ja:['義侠','ヘアスタイル','成長','仲間','地元愛'],en:['Chivalry','Hairstyle','Growth','Comrades','Hometown Love']},radar:[80,78,78,65,72,80]},

  // ── スパイファミリー（追加） ──────────────────────────────────
  {id:'fiona_spy',icon:'❄️',name:{ja:'フィオナ・フロスト（夜帷）',en:'Fiona Frost (Nightfall)'},series:{ja:'SPY×FAMILY',en:'SPY×FAMILY'},type:{ja:'任務優先のスパイ (ISTJ)',en:'Mission-First Spy (ISTJ)'},profile:{I:4,T:4,S:3,J:4},desc:{ja:'ロイドへの隠れた恋心を持つスパイ。任務遂行能力は高いが感情表現が苦手で不器用な恋愛観が愛らしい。',en:'A spy with hidden love for Loid. Has high mission execution ability but poor emotional expression with a clumsy romantic view that is endearing.'},traits:{ja:['任務','恋心','不器用','強さ','成長'],en:['Mission','Hidden Love','Clumsy','Strong','Growth']},radar:[72,55,42,85,82,52]},

  // ── ようこそ実力至上主義の教室へ（追加） ────────────────────
  {id:'horikita_cote',icon:'❄️',name:{ja:'堀北鈴音',en:'Suzune Horikita'},series:{ja:'ようこそ実力至上主義の教室へ',en:'Classroom of the Elite'},type:{ja:'孤高の優等生 (INTJ)',en:'Solitary Honor Student (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'Aクラス入りを目指す孤高の少女。人と関わることを避けながら成長し仲間の大切さを学ぶ。',en:'A solitary girl who aims for Class A. Avoids human interaction while growing and learning the importance of companions.'},traits:{ja:['孤高','優等生','成長','誇り','変化'],en:['Solitary','Honor Student','Growth','Pride','Change']},radar:[55,55,42,88,82,58]},

  // ── 灰と幻想のグリムガル ────────────────────────────────────
  {id:'haruhiro_grimgar',icon:'🗡️',name:{ja:'ハルヒロ',en:'Haruhiro'},series:{ja:'灰と幻想のグリムガル',en:'Grimgar: Ashes and Illusions'},type:{ja:'現実の剣士 (INFP)',en:'Reality Swordsman (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'現実的な視点で異世界を生き抜く剣士。仲間の死と向き合いながら成長する物語がリアルで感動的。',en:'A swordsman who survives another world with a realistic perspective. Story of growing while facing companions\' deaths is real and moving.'},traits:{ja:['現実主義','成長','仲間','死との向き合い','強さ'],en:['Realist','Growth','Comrades','Facing Death','Strong']},radar:[60,75,55,65,68,70]},

  // ── アクションヒロイン ─────────────────────────────────────
  {id:'ryo_fma',icon:'✊',name:{ja:'グリード（原作）',en:'Greed (Original)'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'欲望の失われた七罪 (ESTP)',en:'Homunculus of Greed (ESTP)'},profile:{E:4,T:3,S:4,P:3},desc:{ja:'欲望のホムンクルスだが友情と仲間を何より大切にする。「欲しいものはすべて手に入れる」という信念が魅力。',en:'The Homunculus of Greed who values friendship and companions above all. The conviction "I want everything" is charming.'},traits:{ja:['欲望','友情','強さ','カリスマ','成長'],en:['Greed','Friendship','Strong','Charismatic','Growth']},radar:[85,68,80,72,68,72]},

  // ── Magi ─────────────────────────────────────────────────────
  {id:'aladdin_magi',icon:'🔮',name:{ja:'アラジン',en:'Aladdin'},series:{ja:'マギ',en:'Magi: The Labyrinth of Magic'},type:{ja:'マギの少年 (ENFP)',en:'Boy Magi (ENFP)'},profile:{E:4,F:3,N:4,P:3},desc:{ja:'世界の行方を左右するマギの少年。純粋な心と強い力で世界の不条理に立ち向かう。',en:'A boy Magi who influences the fate of the world. Confronts the injustice of the world with pure heart and strong power.'},traits:{ja:['マギ','純粋','成長','友情','世界'],en:['Magi','Pure','Growth','Friendship','World']},radar:[78,82,82,72,72,88]},
  {id:'alibaba_magi',icon:'🔥',name:{ja:'アリババ・サルージャ',en:'Alibaba Saluja'},series:{ja:'マギ',en:'Magi: The Labyrinth of Magic'},type:{ja:'王子の成長物語 (ENFP)',en:'Prince\'s Growth Story (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'元スラム街出身の第三王子。弱さを認めながら仲間と共に成長する姿が多くの共感を呼ぶ。',en:'The third prince from slum origins. His growth alongside companions while acknowledging weakness resonates with many.'},traits:{ja:['成長','弱さ','仲間','王子','勇気'],en:['Growth','Weakness','Comrades','Prince','Courage']},radar:[72,78,70,65,68,78]},
  {id:'morgiana_magi',icon:'🔗',name:{ja:'モルジアナ',en:'Morgiana'},series:{ja:'マギ',en:'Magi: The Labyrinth of Magic'},type:{ja:'解放された奴隷 (ISFJ)',en:'Liberated Slave (ISFJ)'},profile:{I:3,F:3,S:4,J:3},desc:{ja:'奴隷として生まれたがアラジンたちに解放された少女。感情表現は苦手だが仲間への深い絆がある。',en:'A girl born as a slave but liberated by Aladdin and others. Poor at expressing emotions but has deep bonds with companions.'},traits:{ja:['解放','強さ','仲間','成長','不器用'],en:['Liberation','Strong','Comrades','Growth','Clumsy']},radar:[80,65,52,72,78,72]},

  // ── 青の祓魔師 ─────────────────────────────────────────────
  {id:'rin_okumura',icon:'🔥',name:{ja:'奥村燐',en:'Rin Okumura'},series:{ja:'青の祓魔師',en:'Blue Exorcist'},type:{ja:'悪魔の息子 (ENFP)',en:'Devil\'s Son (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'サタンの息子として生まれながら祓魔師を目指す少年。悪魔の血と人間の心の狭間で戦う。',en:'A boy born as Satan\'s son who aims to be an exorcist. Fights between demon blood and human heart.'},traits:{ja:['悪魔の血','熱血','成長','仲間','誓い'],en:['Demon Blood','Hot-Blooded','Growth','Comrades','Oath']},radar:[82,72,78,62,68,80]},
  {id:'yukio_okumura',icon:'📚',name:{ja:'奥村雪男',en:'Yukio Okumura'},series:{ja:'青の祓魔師',en:'Blue Exorcist'},type:{ja:'天才祓魔師 (INTJ)',en:'Genius Exorcist (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'兄燐の双子の弟で天才祓魔師。冷静で優秀だが悪魔の血への複雑な感情を抱える。',en:'Rin\'s twin brother and genius exorcist. Calm and excellent but holds complex feelings about demon blood.'},traits:{ja:['天才','祓魔師','双子','葛藤','成長'],en:['Genius','Exorcist','Twin','Conflict','Growth']},radar:[60,62,52,88,80,60]},

  // ── 東のエデン ────────────────────────────────────────────────
  {id:'takizawa_eden',icon:'📱',name:{ja:'滝沢朗',en:'Akira Takizawa'},series:{ja:'東のエデン',en:'Eden of the East'},type:{ja:'記憶なきセレソン (ENFP)',en:'Amnesiac Selecao (ENFP)'},profile:{E:3,F:3,N:4,P:4},desc:{ja:'記憶を失いながらも日本を救おうとする謎の青年。無邪気な行動力と根底にある使命感が魅力。',en:'A mysterious young man who tries to save Japan while having lost his memory. Innocent action and underlying sense of mission are charming.'},traits:{ja:['記憶喪失','謎','使命','行動力','成長'],en:['Amnesia','Mysterious','Mission','Action','Growth']},radar:[72,72,78,72,68,80]},

  // ── アウトランダー / 長編 ─────────────────────────────────
  {id:'gintoki_takasugi',icon:'🔪',name:{ja:'高杉晋助',en:'Shinsuke Takasugi'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'憎しみの剣士 (INTJ)',en:'Hateful Swordsman (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'銀時の盟友にして宿敵。「世界を滅ぼす」という歪んだ動機の裏に師への深い愛情がある。',en:'Gintoki\'s sworn ally and nemesis. Behind the twisted motive to "destroy the world" lies deep love for his master.'},traits:{ja:['憎しみ','歪み','師への愛','カリスマ','悲劇'],en:['Hate','Distortion','Master Love','Charismatic','Tragic']},radar:[75,55,52,88,82,48]},
  {id:'katsura_gintama',icon:'🌸',name:{ja:'桂小太郎',en:'Kotaro Katsura'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'攘夷志士 (INFJ)',en:'Anti-Foreigner Patriot (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'「攘夷」を掲げながらもどこかズレた志士。「逃げるんじゃない撤退だ！」の名言が有名な銀魂の重要キャラ。',en:'A patriot who advocates "anti-foreignism" but is somehow off-beat. Famous for the quote "I\'m not running, I\'m retreating!" — an important Gintama character.'},traits:{ja:['攘夷','ズレ','仲間','成長','義侠'],en:['Anti-Foreigner','Off-Beat','Comrades','Growth','Chivalry']},radar:[65,65,65,72,72,72]},

  // ── ハイスクール・オブ・ザ・デッド ─────────────────────────
  {id:'miyuki_hs',icon:'🌸',name:{ja:'鹿島三咲',en:'Miyuki Shiba'},series:{ja:'魔法科高校の劣等生',en:'The Irregular at Magic High School'},type:{ja:'完全無欠の妹 (ISTJ)',en:'Perfect Little Sister (ISTJ)'},profile:{I:3,T:4,S:3,J:4},desc:{ja:'兄達也への深い愛情と圧倒的な魔法能力を持つ優等生。「兄への献身」がキャラクターの軸。',en:'An honor student with deep love for brother Tatsuya and overwhelming magical ability. "Devotion to brother" is the axis of the character.'},traits:{ja:['完全','兄への愛','優等生','魔法','成長'],en:['Perfect','Brother Love','Honor Student','Magic','Growth']},radar:[78,85,68,88,90,82]},
  {id:'tatsuya_hs',icon:'💻',name:{ja:'司波達也',en:'Tatsuya Shiba'},series:{ja:'魔法科高校の劣等生',en:'The Irregular at Magic High School'},type:{ja:'劣等生の真実 (INTJ)',en:'Irregular\'s Truth (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'魔法師として「劣等生」と見られながら実際は最強の秘密を持つ少年。感情を排した論理で全てを処理する。',en:'A boy seen as a "defect" as a magic user but actually holds the secret of being the strongest. Processes everything with logic devoid of emotion.'},traits:{ja:['隠れた実力','論理','秘密','無感情','最強'],en:['Hidden Strength','Logic','Secret','No Emotion','Strongest']},radar:[62,42,48,98,90,38]},

  // ── メイドラゴン ──────────────────────────────────────────────
  {id:'tohru_dragon',icon:'🐉',name:{ja:'トール',en:'Tohru'},series:{ja:'小林さんちのメイドラゴン',en:'Miss Kobayashi\'s Dragon Maid'},type:{ja:'ドラゴンメイド (ESFP)',en:'Dragon Maid (ESFP)'},profile:{E:4,F:4,S:4,P:3},desc:{ja:'小林への愛情から人間界で生きるドラゴン。ドラゴンの力とメイドとしての献身を両立する。',en:'A dragon who lives in the human world from love for Kobayashi. Balances dragon power and devotion as a maid.'},traits:{ja:['ドラゴン','メイド','愛情','成長','忠誠'],en:['Dragon','Maid','Love','Growth','Loyal']},radar:[88,88,80,55,75,88]},

  // ── おそ松さん ─────────────────────────────────────────────
  {id:'osomatsu',icon:'😄',name:{ja:'松野おそ松',en:'Osomatsu Matsuno'},series:{ja:'おそ松さん',en:'Mr. Osomatsu'},type:{ja:'長男のダメ人間 (ESFP)',en:'Eldest NEET (ESFP)'},profile:{E:4,F:3,S:3,P:4},desc:{ja:'6つ子の長男でニートの代表格。底抜けに明るく弟たちへの兄心もある。',en:'The eldest of sextuplets and representative NEET. Bottomlessly cheerful with brotherly feelings toward younger siblings.'},traits:{ja:['ニート','長男','明るさ','仲間','自由'],en:['NEET','Eldest','Cheerful','Comrades','Freedom']},radar:[62,68,88,42,52,82]},

  // ── セラフ・オブ・ジ・エンド ──────────────────────────────
  {id:'yuichiro_son',icon:'⚔️',name:{ja:'百夜優一郎',en:'Yuichiro Hyakuya'},series:{ja:'終わりのセラフ',en:'Seraph of the End'},type:{ja:'仲間のための剣士 (ENFP)',en:'Sword for Companions (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'吸血鬼に奪われた家族の復讐を誓う少年。荒々しい外面の裏に仲間への深い愛情がある。',en:'A boy who swears revenge for the family taken by vampires. Behind rough exterior lies deep love for companions.'},traits:{ja:['復讐','熱血','仲間','成長','誓い'],en:['Revenge','Hot-Blooded','Comrades','Growth','Oath']},radar:[82,72,72,60,70,78]},

  // ── 無限の住人 ─────────────────────────────────────────────
  {id:'manji_blade',icon:'⚔️',name:{ja:'万次',en:'Manji'},series:{ja:'無限の住人',en:'Blade of the Immortal'},type:{ja:'不死の剣客 (ISTP)',en:'Immortal Swordsman (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'不死の体を持つ剣客。1000人の悪人を斬ることで贖罪しようとする孤独な物語。',en:'A swordsman with an immortal body. A solitary story of trying to atone by cutting down 1000 evil people.'},traits:{ja:['不死','贖罪','孤独','剣術','強さ'],en:['Immortal','Atonement','Solitary','Swordsmanship','Strong']},radar:[88,52,48,72,72,52]},

  // ── 昭和元禄落語心中 ─────────────────────────────────────
  {id:'yakumo_rakugo',icon:'🎭',name:{ja:'八雲（菊比古）',en:'Yakumo (Kikuhiko)'},series:{ja:'昭和元禄落語心中',en:'Showa & Genroku Era Rakugo Shinju'},type:{ja:'落語の美学 (INTJ)',en:'Rakugo Aesthetics (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'落語一筋に生きた名人。その美学と孤独な生き様が現代アニメ最高傑作の一つとして評価される。',en:'A master who lived solely for rakugo. His aesthetics and solitary way of life are evaluated as one of the greatest modern anime masterpieces.'},traits:{ja:['美学','孤独','落語','誇り','悲劇'],en:['Aesthetics','Solitary','Rakugo','Pride','Tragic']},radar:[55,52,42,92,88,48]},

  // ── ゴブリンスレイヤー ─────────────────────────────────────
  {id:'goblin_slayer',icon:'🛡️',name:{ja:'ゴブリンスレイヤー',en:'Goblin Slayer'},series:{ja:'ゴブリンスレイヤー',en:'Goblin Slayer'},type:{ja:'ゴブリン専門の戦士 (ISTJ)',en:'Goblin-Specialized Warrior (ISTJ)'},profile:{I:4,T:4,S:4,J:4},desc:{ja:'ゴブリン退治以外に興味を持たない孤高の戦士。過去のトラウマから生まれた極端な専門化が特徴的。',en:'A solitary warrior with no interest beyond goblin extermination. Extreme specialization born from past trauma is characteristic.'},traits:{ja:['専門家','孤独','トラウマ','強さ','誠実'],en:['Specialist','Solitary','Trauma','Strong','Sincere']},radar:[82,48,38,88,90,45]},

  // ── 乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…
  {id:'catarina_hamefura',icon:'🌸',name:{ja:'カタリナ・クラエス',en:'Catarina Claes'},series:{ja:'乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…',en:'My Next Life as a Villainess'},type:{ja:'天然の悪役令嬢 (ENFP)',en:'Natural Villainess (ENFP)'},profile:{E:4,F:3,S:3,P:3},desc:{ja:'悪役令嬢に転生したが天然の性格で全員から愛される。「破滅フラグ回避」への執念がコメディを生む。',en:'Reincarnated as a villainess but loved by everyone due to her natural character. Obsession with "avoiding destruction flags" creates comedy.'},traits:{ja:['天然','愛される','転生','コメディ','成長'],en:['Natural','Beloved','Reincarnated','Comedy','Growth']},radar:[72,88,88,52,65,90]},

  // ── 魔法陣グルグル ─────────────────────────────────────────
  {id:'kukuri_guruguru',icon:'✨',name:{ja:'ククリ',en:'Kukuri'},series:{ja:'魔法陣グルグル',en:'Magical Circle Guru Guru'},type:{ja:'古代魔法の少女 (INFP)',en:'Ancient Magic Girl (INFP)'},profile:{I:3,F:4,N:3,P:3},desc:{ja:'グルグル魔法の使い手として運命に選ばれた少女。ニケと共に魔王討伐の旅に出る純粋な魔法少女。',en:'A girl chosen by fate as a user of Guru Guru magic. A pure magical girl who sets out on a journey to defeat the Demon King with Nike.'},traits:{ja:['魔法','純粋','成長','勇気','友情'],en:['Magic','Pure','Growth','Courage','Friendship']},radar:[62,82,68,68,70,85]},

  // ── 彼女お借りします ─────────────────────────────────────
  {id:'kazuya_renta',icon:'📱',name:{ja:'木ノ上和也',en:'Kazuya Kinoshita'},series:{ja:'彼女、お借りします',en:'Rent-a-Girlfriend'},type:{ja:'女心に迷う大学生 (INFP)',en:'College Student Lost in Girls\' Hearts (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'失恋から「レンタル彼女」を借りた大学生。優柔不断だが純粋さと成長の過程が見どころ。',en:'A college student who rented a "rental girlfriend" after a heartbreak. Indecisive but highlights are purity and growth process.'},traits:{ja:['優柔不断','成長','純粋','恋愛','大学生'],en:['Indecisive','Growth','Pure','Romance','College Student']},radar:[48,68,55,55,52,72]},
  {id:'chizuru_renta',icon:'🌸',name:{ja:'水原千鶴',en:'Chizuru Mizuhara'},series:{ja:'彼女、お借りします',en:'Rent-a-Girlfriend'},type:{ja:'女優志望のレンタル彼女 (ISFJ)',en:'Aspiring Actress Rental GF (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'レンタル彼女として働きながら女優を目指す少女。二つの顔の間で揺れながら本当の自分を見せていく。',en:'A girl who aims to be an actress while working as a rental girlfriend. Shows her true self while wavering between two faces.'},traits:{ja:['女優','二面性','成長','誠実','夢'],en:['Actress','Two-Faced','Growth','Sincere','Dream']},radar:[65,75,65,65,72,75]},

  // ── はたらく魔王さま！ ───────────────────────────────────────
  {id:'maou_hataraku',icon:'😈',name:{ja:'真奥貞夫（魔王サタン）',en:'Sadao Maou (Satan)'},series:{ja:'はたらく魔王さま！',en:'The Devil is a Part-Timer!'},type:{ja:'バイトする魔王 (ENTJ)',en:'Part-Timer Devil King (ENTJ)'},profile:{E:3,T:3,N:3,J:3},desc:{ja:'最強の魔王が異世界でバイトする逆転コメディ。責任感が強く仲間を大切にする姿が意外に善人。',en:'The strongest Demon King doing part-time work in another world — a reversal comedy. Surprisingly good-natured with strong sense of responsibility and caring for companions.'},traits:{ja:['魔王','バイト','責任','成長','コメディ'],en:['Demon King','Part-Timer','Responsibility','Growth','Comedy']},radar:[75,72,72,82,80,72]},
  {id:'emi_hataraku',icon:'⚔️',name:{ja:'真奥貞夫（勇者エミリア）',en:'Emi Yusa (Hero Emilia)'},series:{ja:'はたらく魔王さま！',en:'The Devil is a Part-Timer!'},type:{ja:'勇者の日常 (ESTJ)',en:'Hero\'s Everyday Life (ESTJ)'},profile:{E:3,T:3,S:3,J:3},desc:{ja:'魔王を倒すために異世界まで来た勇者。魔王が「普通の人間」として暮らすことへの複雑な気持ちが面白い。',en:'A hero who came to another world to defeat the Demon King. Complex feelings about the Demon King living as an "ordinary human" are interesting.'},traits:{ja:['勇者','正義','複雑','成長','コメディ'],en:['Hero','Justice','Complex','Growth','Comedy']},radar:[78,72,70,75,80,68]},

  // ── ダンジョンに出会いを求めるのは間違っているだろうか ────
  {id:'bell_danmachi',icon:'🐰',name:{ja:'ベル・クラネル',en:'Bell Cranel'},series:{ja:'ダンジョンに出会いを求めるのは間違っているだろうか',en:'Is It Wrong to Try to Pick Up Girls in a Dungeon?'},type:{ja:'成長する冒険者 (ENFP)',en:'Growing Adventurer (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'英雄に憧れてダンジョンを攻略する少年。憧れへの一途な想いが奇跡的な成長を生む。',en:'A boy who attacks the dungeon dreaming of heroes. Unwavering feelings toward his idol create miraculous growth.'},traits:{ja:['憧れ','成長','冒険','純粋','英雄'],en:['Admiration','Growth','Adventure','Pure','Hero']},radar:[78,78,78,62,68,85]},
  {id:'hestia_danmachi',icon:'🔥',name:{ja:'ヘスティア',en:'Hestia'},series:{ja:'ダンジョンに出会いを求めるのは間違っているだろうか',en:'Is It Wrong to Try to Pick Up Girls in a Dungeon?'},type:{ja:'ベルを愛する女神 (ESFJ)',en:'Goddess Who Loves Bell (ESFJ)'},profile:{E:4,F:4,S:3,J:3},desc:{ja:'ベルへの深い愛情でファミリアを支える女神。貧しくても仲間を守ろうとする温かさが魅力。',en:'A goddess who supports the familia with deep love for Bell. Warmth in trying to protect companions even in poverty is charming.'},traits:{ja:['女神','愛情','可愛さ','成長','守護'],en:['Goddess','Love','Cute','Growth','Protector']},radar:[72,88,80,55,70,88]},
  {id:'aiz_danmachi',icon:'⚔️',name:{ja:'アイズ・ヴァレンシュタイン',en:'Aiz Wallenstein'},series:{ja:'ダンジョンに出会いを求めるのは間違っているだろうか',en:'Is It Wrong to Try to Pick Up Girls in a Dungeon?'},type:{ja:'剣姫の孤独 (ISTJ)',en:'Sword Princess Solitude (ISTJ)'},profile:{I:3,T:4,S:4,J:3},desc:{ja:'最強の冒険者「剣姫」。感情表現が苦手だが戦闘への真剣さとベルへの影響が物語の軸。',en:'The strongest adventurer "Sword Princess." Poor at expressing emotions but seriousness in battle and influence on Bell are axes of the story.'},traits:{ja:['最強','孤独','成長','剣姫','純粋'],en:['Strongest','Solitary','Growth','Sword Princess','Pure']},radar:[92,52,48,88,85,58]},

  // ── ログホライズン ────────────────────────────────────────────
  {id:'shiroe_lh',icon:'🎮',name:{ja:'シロエ',en:'Shiroe'},series:{ja:'ログ・ホライズン',en:'Log Horizon'},type:{ja:'謀略のエンチャンター (INTJ)',en:'Scheming Enchanter (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'「ゲームの中に閉じ込められた」世界で社会秩序を作るエンチャンター。その知謀と使命感が物語を動かす。',en:'An enchanter who creates social order in a world "trapped inside a game." His cunning and sense of mission drives the story.'},traits:{ja:['謀略','エンチャンター','社会構築','知恵','成長'],en:['Scheming','Enchanter','Society Building','Wisdom','Growth']},radar:[55,62,52,98,85,60]},
  {id:'akatsuki_lh',icon:'🌸',name:{ja:'暁',en:'Akatsuki'},series:{ja:'ログ・ホライズン',en:'Log Horizon'},type:{ja:'主人様の忍 (ISTJ)',en:'Master\'s Shinobi (ISTJ)'},profile:{I:3,F:3,S:4,J:4},desc:{ja:'シロエを「主人様」と呼び仕える小柄な暗殺者。真剣さと一途さが際立つ独特のキャラクター。',en:'A small assassin who serves Shiroe calling him "my master." Unique character with outstanding seriousness and single-minded devotion.'},traits:{ja:['忍者','忠誠','小柄','真剣','成長'],en:['Ninja','Loyal','Small','Serious','Growth']},radar:[75,68,52,72,78,72]},

  // ── SAOアリシゼーション追加 ─────────────────────────────
  {id:'leafa_sao',icon:'🌿',name:{ja:'リーファ（桐ヶ谷直葉）',en:'Leafa (Suguha Kirigaya)'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'双剣の妹 (ISFJ)',en:'Twin Blade Sister (ISFJ)'},profile:{I:3,F:3,S:4,J:3},desc:{ja:'キリトの義妹でALOでは妖精の剣士。現実での剣道の腕前とゲームでの活躍、そして複雑な感情が魅力。',en:'Kirito\'s stepsister who is a fairy swordsman in ALO. Her kendo skill in reality, achievements in games, and complex emotions are charming.'},traits:{ja:['妹','剣道','妖精','感情','成長'],en:['Sister','Kendo','Fairy','Emotion','Growth']},radar:[78,72,65,65,72,78]},

  // ── エヴァンゲリオン追加 ─────────────────────────────────
  {id:'kaworu_eva',icon:'🌙',name:{ja:'渚カヲル',en:'Kaworu Nagisa'},series:{ja:'新世紀エヴァンゲリオン',en:'Neon Genesis Evangelion'},type:{ja:'天使の少年 (INFP)',en:'Angel Boy (INFP)'},profile:{I:3,F:4,N:4,P:3},desc:{ja:'シンジに心から「好きだ」と言った天使。その短い登場時間と深い感動が多くのファンの心を掴んだ。',en:'The angel who sincerely said "I like you" to Shinji. Short screen time and deep emotion captured the hearts of many fans.'},traits:{ja:['天使','愛','謎','感動','成長'],en:['Angel','Love','Mysterious','Moving','Growth']},radar:[38,88,50,75,65,88]},

  // ── GATE自衛隊 ─────────────────────────────────────────────
  {id:'rory_gate',icon:'⚔️',name:{ja:'ロゥリィ・マーキュリー',en:'Rory Mercury'},series:{ja:'GATE 自衛隊 彼の地にて、斯く戦えり',en:'Gate'},type:{ja:'900歳の半神 (ESTP)',en:'900-Year-Old Demi-God (ESTP)'},profile:{E:4,T:3,S:4,P:3},desc:{ja:'900歳以上の半神として戦場を駆け回る少女。外見は少女だが戦闘力は最高クラス。',en:'A girl who runs through battlefields as a demi-god over 900 years old. Appears as a girl but combat ability is top class.'},traits:{ja:['半神','戦士','年齢','強さ','カリスマ'],en:['Demi-God','Warrior','Age','Strong','Charismatic']},radar:[90,65,80,72,75,72]},

  // ── 転スラ追加 ───────────────────────────────────────────────
  {id:'veldora_tensura',icon:'🐉',name:{ja:'ヴェルドラ・テンペスト',en:'Veldora Tempest'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'嵐龍のダチ (ESTP)',en:'Storm Dragon Buddy (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'世界最強クラスの嵐龍でリムルの親友。長年封印されていたが解放後にリムルと共に行動する。',en:'A top-class Storm Dragon in the world and Rimuru\'s best friend. Sealed for years but after liberation acts alongside Rimuru.'},traits:{ja:['嵐龍','親友','最強','自由','成長'],en:['Storm Dragon','Best Friend','Strongest','Freedom','Growth']},radar:[95,65,75,72,68,72]},
  {id:'diablo_tensura',icon:'😈',name:{ja:'ディアブロ',en:'Diablo'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'忠実な悪魔 (INTJ)',en:'Loyal Devil (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'リムルへの絶対的な忠誠心を持つ原初の悪魔。秘書として働きながらその知謀で国を支える。',en:'A primal demon with absolute loyalty to Rimuru. Works as secretary while supporting the nation with his cunning.'},traits:{ja:['忠誠','悪魔','知謀','最強','礼節'],en:['Loyal','Devil','Cunning','Strongest','Etiquette']},radar:[72,55,55,92,88,48]},

  // ── ダンまち追加 ──────────────────────────────────────────────
  {id:'liliruca_danmachi',icon:'🎒',name:{ja:'リリルカ・アーデ',en:'Lili Arde'},series:{ja:'ダンジョンに出会いを求めるのは間違っているだろうか',en:'Danmachi'},type:{ja:'サポーターの成長 (INFP)',en:'Supporter\'s Growth (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'サポーターとして虐げられてきた少女がベルとの出会いで変わる。信頼を学び成長する物語が感動的。',en:'A girl who had been oppressed as a supporter changes through meeting Bell. The moving story of learning trust and growing.'},traits:{ja:['成長','信頼','サポーター','変化','仲間'],en:['Growth','Trust','Supporter','Change','Comrades']},radar:[62,78,58,68,70,80]},

  // ── 呪術廻戦さらに追加 ──────────────────────────────────────
  {id:'choso_jjk',icon:'🩸',name:{ja:'脹相',en:'Choso'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'兄の愛 (ISFJ)',en:'Brother\'s Love (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'弟たちを守るために戦う死絵師の息子。独特の感性と兄弟愛が魅力の複雑なキャラクター。',en:'The son of a death paintings creator who fights to protect his brothers. A complex character with unique sensibility and brotherly love.'},traits:{ja:['兄弟愛','守護','純粋','成長','変化'],en:['Brotherly Love','Protector','Pure','Growth','Change']},radar:[68,88,52,72,72,80]},

  // ── 磁石の恋 / ロマンス系追加 ──────────────────────────────
  {id:'ryuuji_toradora',icon:'🐉',name:{ja:'高須竜児',en:'Ryuuji Takasu'},series:{ja:'とらドラ！',en:'Toradora!'},type:{ja:'熊なのに優しい男 (ISTJ)',en:'Bear-like but Gentle Guy (ISTJ)'},profile:{I:3,F:3,S:3,J:3},desc:{ja:'顔つきは怖いが誰より家事が得意で優しい少年。大河との関係を通じて成長する恋愛物語の主人公。',en:'A boy with a scary face but more gentle and skilled at housework than anyone. The protagonist of a romance story who grows through his relationship with Taiga.'},traits:{ja:['家事','優しさ','成長','誤解','恋愛'],en:['Housework','Gentle','Growth','Misunderstood','Romance']},radar:[68,80,62,65,75,78]},
  {id:'minori_toradora',icon:'☀️',name:{ja:'櫛枝実乃梨',en:'Minori Kushieda'},series:{ja:'とらドラ！',en:'Toradora!'},type:{ja:'太陽のような少女 (ENFP)',en:'Sun-Like Girl (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'常に明るく元気な竜児の初恋。その明るさの裏に深い感情と思いやりがある。',en:'Ryuuji\'s first love who is always bright and energetic. Behind the brightness lies deep emotion and consideration.'},traits:{ja:['明るさ','初恋','感情','思いやり','成長'],en:['Brightness','First Love','Emotion','Consideration','Growth']},radar:[75,78,88,58,68,80]},

  // ── 月刊少女野崎くん ─────────────────────────────────────────
  {id:'nozaki_mgsnk',icon:'✏️',name:{ja:'野崎梅太郎',en:'Umetaro Nozaki'},series:{ja:'月刊少女野崎くん',en:'Monthly Girls\' Nozaki-kun'},type:{ja:'漫画家の鈍感 (INTP)',en:'Dense Manga Artist (INTP)'},profile:{I:3,T:4,N:4,P:3},desc:{ja:'少女漫画家として活躍する鈍感な高校生。周りのキャラが引き立つコメディの中心的存在。',en:'An insensitive high school student who works as a shojo manga artist. The central figure of a comedy where surrounding characters shine.'},traits:{ja:['漫画家','鈍感','コメディ','真面目','面白い'],en:['Manga Artist','Dense','Comedy','Serious','Funny']},radar:[55,45,55,82,72,65]},
  {id:'chiyo_mgsnk',icon:'🌸',name:{ja:'佐倉千代',en:'Chiyo Sakura'},series:{ja:'月刊少女野崎くん',en:'Monthly Girls\' Nozaki-kun'},type:{ja:'片思いのコメディ主人公 (ENFJ)',en:'Unrequited Love Comedy Heroine (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'野崎に恋する少女が告白したのに漫画のアシスタントにされてしまう主人公。愛らしいリアクションが笑いを生む。',en:'The heroine who falls for Nozaki, confesses but ends up as his manga assistant. Adorable reactions create laughter.'},traits:{ja:['恋愛','コメディ','明るさ','頑張り','愛らしさ'],en:['Romance','Comedy','Cheerful','Effort','Adorable']},radar:[68,82,78,55,68,82]},

  // ── 凪のあすから ─────────────────────────────────────────────
  {id:'hikari_nagisu',icon:'🌊',name:{ja:'向井戸光',en:'Hikari Sakishima'},series:{ja:'凪のあすから',en:'A Lull in the Sea'},type:{ja:'海の少年 (ENFP)',en:'Sea Boy (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'海人の少年が陸の人間との関係で成長する物語。感情的で真っ直ぐな性格が多くの共感を呼ぶ。',en:'A story of a sea person boy growing through relationships with land people. Emotional and direct character resonates with many.'},traits:{ja:['海','感情的','成長','恋愛','純粋'],en:['Sea','Emotional','Growth','Romance','Pure']},radar:[72,78,75,60,65,80]},

  // ── 天気の子 ─────────────────────────────────────────────────
  {id:'hodaka_tenki',icon:'🌤️',name:{ja:'森嶋帆高',en:'Hodaka Morishima'},series:{ja:'天気の子',en:'Weathering With You'},type:{ja:'逃げ出した少年 (INFP)',en:'Runaway Boy (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'島から東京へ家出した少年が晴れ女ひなを守るために世界に抗う。愛のために全てを賭ける物語。',en:'A boy who ran away from his island to Tokyo fights against the world to protect sunshine girl Hina. A story of betting everything for love.'},traits:{ja:['家出','成長','愛','勇気','選択'],en:['Runaway','Growth','Love','Courage','Choice']},radar:[62,78,62,62,65,80]},
  {id:'hina_tenki',icon:'🌤️',name:{ja:'天野陽菜',en:'Hina Amano'},series:{ja:'天気の子',en:'Weathering With You'},type:{ja:'晴れ女の犠牲 (ENFJ)',en:'Sunshine Girl\'s Sacrifice (ENFJ)'},profile:{E:3,F:4,N:3,J:2},desc:{ja:'天気を晴らす能力を持つ少女。誰かのために力を使い続けることへの覚悟が感動的。',en:'A girl with the ability to clear weather. The resolve to keep using her power for others is moving.'},traits:{ja:['晴れ女','犠牲','愛情','成長','覚悟'],en:['Sunshine Girl','Sacrifice','Love','Growth','Resolve']},radar:[68,88,78,60,72,85]},

  // ── 鍵・AIR ──────────────────────────────────────────────────
  {id:'misuzu_air',icon:'🌤️',name:{ja:'鈴木美凪',en:'Misuzu Kamio'},series:{ja:'AIR',en:'Air'},type:{ja:'翼を求める少女 (ENFP)',en:'Girl Seeking Wings (ENFP)'},profile:{E:3,F:4,N:3,P:3},desc:{ja:'翼を持つ少女の転生譚。「ゴール！」の口癖と純粋さが視聴者の涙を誘う泣きゲー原作の名キャラ。',en:'A reincarnation story of a girl with wings. The catchphrase "Goal!" and purity draw viewers\' tears — a famous character from a tearjerker game original.'},traits:{ja:['翼','純粋','転生','笑顔','悲劇'],en:['Wings','Pure','Reincarnation','Smile','Tragic']},radar:[65,90,72,58,62,92]},

  // ── 機動戦士ガンダムSEED ─────────────────────────────────
  {id:'kira_seed',icon:'⚡',name:{ja:'キラ・ヤマト',en:'Kira Yamato'},series:{ja:'機動戦士ガンダムSEED',en:'Gundam SEED'},type:{ja:'究極コーディネイター (INFJ)',en:'Ultimate Coordinator (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'究極コーディネイターとして戦う少年。平和への強い願いと戦いの苦悩が成長物語を形成する。',en:'A boy who fights as the Ultimate Coordinator. Strong wish for peace and anguish of battle form a growth story.'},traits:{ja:['平和','成長','苦悩','天才','守護'],en:['Peace','Growth','Anguish','Genius','Protector']},radar:[75,78,62,85,78,75]},
  {id:'athrun_seed',icon:'💙',name:{ja:'アスラン・ザラ',en:'Athrun Zala'},series:{ja:'機動戦士ガンダムSEED',en:'Gundam SEED'},type:{ja:'ライバルの友人 (INFJ)',en:'Rival Friend (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'キラのかつての親友にして宿敵。信念と友情の間で揺れる苦悩が人間的な魅力を生む。',en:'Kira\'s former best friend and sworn rival. The anguish of wavering between conviction and friendship creates human charm.'},traits:{ja:['友情','苦悩','成長','信念','ライバル'],en:['Friendship','Anguish','Growth','Conviction','Rival']},radar:[68,72,58,78,78,72]},

  // ── 俺ガイル追加 ────────────────────────────────────────────
  {id:'yui_oregairu',icon:'🍞',name:{ja:'由比ヶ浜結衣',en:'Yui Yuigahama'},series:{ja:'やはり俺の青春ラブコメはまちがっている。',en:'My Youth Romantic Comedy Is Wrong As I Expected'},type:{ja:'純粋な思いやり (ESFJ)',en:'Pure Consideration (ESFJ)'},profile:{E:3,F:4,S:3,J:2},desc:{ja:'八幡と雪乃の間で揺れながらも自分の気持ちに正直な少女。その純粋さと思いやりが皆に愛される。',en:'A girl who is honest about her feelings while wavering between Hachiman and Yukino. Her purity and consideration is loved by all.'},traits:{ja:['純粋','思いやり','成長','恋愛','明るさ'],en:['Pure','Consideration','Growth','Romance','Cheerful']},radar:[68,88,80,55,68,85]},

  // ── ブリーチ（さらに追加） ─────────────────────────────────
  {id:'shunsui_bleach',icon:'🌸',name:{ja:'京楽春水',en:'Shunsui Kyoraku'},series:{ja:'ブリーチ 千年血戦篇',en:'Bleach: TYBW'},type:{ja:'温和な総大将 (ENFP)',en:'Gentle Head Captain (ENFP)'},profile:{E:3,F:3,N:4,P:3},desc:{ja:'護廷十三隊の総隊長でのんびりした外見とは裏腹に最高レベルの戦闘力を持つ。',en:'The Commander General of the Gotei 13 whose leisurely appearance belies top-level combat ability.'},traits:{ja:['余裕','最強','桜花','遊び人','謀略'],en:['Composure','Strongest','Cherry Blossom','Playboy','Scheming']},radar:[88,68,75,85,88,65]},

  // ── うたわれるもの ──────────────────────────────────────────
  {id:'hakuoro',icon:'🎭',name:{ja:'ハクオロ',en:'Hakuoro'},series:{ja:'うたわれるもの',en:'Utawarerumono'},type:{ja:'仮面の皇帝 (INFJ)',en:'Masked Emperor (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'仮面を外せない謎の男が国を率いる王となる物語。記憶と正体への謎が物語の核心。',en:'The story of a mysterious man who cannot remove his mask becoming a king who leads a nation. The mystery of memory and true identity is the story\'s core.'},traits:{ja:['謎','仮面','王','守護','悲劇'],en:['Mysterious','Mask','King','Protector','Tragic']},radar:[62,72,55,82,80,72]},

  // ── コードギアス（さらに追加） ──────────────────────────────
  {id:'nunnally',icon:'🌸',name:{ja:'ナナリー・ランペルージ',en:'Nunnally Lamperouge'},series:{ja:'コードギアス',en:'Code Geass'},type:{ja:'平和の象徴 (ISFJ)',en:'Symbol of Peace (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'ルルーシュの妹でその愛情の源。目が不自由ながらも純粋な優しさで周りを癒す存在。',en:'Lelouch\'s sister and the source of his love. Despite being visually impaired, a healing presence with pure kindness.'},traits:{ja:['優しさ','純粋','平和','兄への愛','成長'],en:['Kindness','Pure','Peace','Brother Love','Growth']},radar:[48,95,62,48,72,95]},

  // ── 7つの大罪 ─────────────────────────────────────────────
  {id:'meliodas_7sins',icon:'🐉',name:{ja:'メリオダス',en:'Meliodas'},series:{ja:'七つの大罪',en:'The Seven Deadly Sins'},type:{ja:'憤怒の罪の騎士団長 (ENFP)',en:'Dragon Sin of Wrath Captain (ENFP)'},profile:{E:4,F:3,N:3,P:3},desc:{ja:'七つの大罪の団長でエリザベスへの深い愛情を持つ。明るい外見の裏に数千年の苦悩を抱える。',en:'The captain of the Seven Deadly Sins with deep love for Elizabeth. Behind bright exterior carries thousands of years of anguish.'},traits:{ja:['団長','愛情','強さ','苦悩','成長'],en:['Captain','Love','Strong','Anguish','Growth']},radar:[90,78,85,72,75,82]},
  {id:'ban_7sins',icon:'🍺',name:{ja:'バン',en:'Ban'},series:{ja:'七つの大罪',en:'The Seven Deadly Sins'},type:{ja:'不死の強欲 (ESTP)',en:'Immortal Greed (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'不死の体を持つ強欲の罪。エレインへの愛情と仲間への友情が荒々しい外見に反して温かい。',en:'The Sin of Greed with an immortal body. Love for Elaine and friendship with companions are warm despite rough exterior.'},traits:{ja:['不死','強欲','友情','荒々しさ','愛情'],en:['Immortal','Greed','Friendship','Rough','Love']},radar:[90,72,72,60,65,75]},
  {id:'escanor_7sins',icon:'☀️',name:{ja:'エスカノール',en:'Escanor'},series:{ja:'七つの大罪',en:'The Seven Deadly Sins'},type:{ja:'昼の最強者 (ESTJ)',en:'Daytime Strongest (ESTJ)'},profile:{E:3,T:4,S:4,J:4},desc:{ja:'昼間は最強の自信家、夜は最弱の小心者という極端なキャラ。「俺に敵う者など誰もいない」の傲慢さが魅力。',en:'Extremely confident the strongest during the day, extremely timid the weakest at night. The arrogance of "Who can match me?" is charming.'},traits:{ja:['最強','傲慢','極端','昼夜','愛情'],en:['Strongest','Arrogant','Extreme','Day/Night','Love']},radar:[98,55,65,88,75,65]},

  // ── 魔女の旅々 ─────────────────────────────────────────────
  {id:'elaina_witch',icon:'🧹',name:{ja:'エレイン',en:'Elaina'},series:{ja:'魔女の旅々',en:'The Journey of Elaina'},type:{ja:'旅する魔女 (INTJ)',en:'Traveling Witch (INTJ)'},profile:{I:3,T:3,N:4,J:3},desc:{ja:'美しい旅する魔女。自由な旅先での様々な人々との出会いと別れが彼女を成長させる。',en:'A beautiful traveling witch. Various encounters and farewells with people on her free journey make her grow.'},traits:{ja:['旅','魔女','自由','成長','観察'],en:['Travel','Witch','Freedom','Growth','Observation']},radar:[62,68,62,82,72,72]},

  // ── 86 ────────────────────────────────────────────────────────
  {id:'shinei_86',icon:'💀',name:{ja:'シンエイ・ノウゼン',en:'Shinei Nouzen'},series:{ja:'86 -エイティシックス-',en:'86 - Eighty-Six -'},type:{ja:'死を受け入れた戦士 (ISTP)',en:'Warrior Who Accepted Death (ISTP)'},profile:{I:4,T:3,S:4,P:3},desc:{ja:'死を前提として戦い続ける第86区の戦士。レーナとの出会いで生きる意味を再発見する物語。',en:'A warrior of the 86th District who keeps fighting on the premise of death. A story of rediscovering the meaning of living through meeting Lena.'},traits:{ja:['死','戦士','成長','孤独','再生'],en:['Death','Warrior','Growth','Solitary','Rebirth']},radar:[82,52,42,78,75,55]},
  {id:'lena_86',icon:'🌟',name:{ja:'レーナ（ヴラディレーナ・ミリーゼ）',en:'Lena (Vladilena Milize)'},series:{ja:'86 -エイティシックス-',en:'86 - Eighty-Six -'},type:{ja:'理想の指揮官 (INFJ)',en:'Ideal Commander (INFJ)'},profile:{I:3,F:4,N:4,J:3},desc:{ja:'86区の兵士たちを仲間として尊重する少女。理想と現実の狭間で苦悩しながらも信念を曲げない。',en:'A girl who respects the soldiers of the 86th District as companions. Doesn\'t bend her conviction while anguishing between ideals and reality.'},traits:{ja:['理想','信念','成長','守護','苦悩'],en:['Ideals','Conviction','Growth','Protector','Anguish']},radar:[65,85,68,82,82,80]},

  // ── さようなら竜生、こんにちは人生 ──────────────────────────
  {id:'freya_ragnarok',icon:'⚔️',name:{ja:'エリス（アスコルド）',en:'Eris (Ascord)'},series:{ja:'ダンジョンに出会いを求めるのは間違っているだろうか',en:'Danmachi'},type:{ja:'戦士の剣 (ISTP)',en:'Warrior\'s Sword (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'ダンジョンの中での冒険者として修行する少女剣士。成長に向けた努力と信念が魅力。',en:'A young female swordsman training as an adventurer in the dungeon. The effort toward growth and conviction are charming.'},traits:{ja:['剣士','成長','修行','信念','強さ'],en:['Swordsman','Growth','Training','Conviction','Strong']},radar:[78,65,55,72,72,72]},

  // ── Free! ─────────────────────────────────────────────────────
  {id:'haruka_free',icon:'🏊',name:{ja:'七瀬遙',en:'Haruka Nanase'},series:{ja:'Free! -Iwatobi Swim Club-',en:'Free!'},type:{ja:'水のために泳ぐ (ISTP)',en:'Swimming for Water (ISTP)'},profile:{I:4,T:3,S:4,P:3},desc:{ja:'「水のためだけに泳ぐ」ことを信条とする天才水泳選手。ストイックな姿と仲間への愛情が魅力。',en:'A genius swimmer with the belief of "swimming only for water." Stoic appearance and love for companions are charming.'},traits:{ja:['水泳','水への愛','ストイック','天才','仲間'],en:['Swimming','Love for Water','Stoic','Genius','Comrades']},radar:[85,65,52,78,72,65]},
  {id:'makoto_free',icon:'🌊',name:{ja:'橘真琴',en:'Makoto Tachibana'},series:{ja:'Free! -Iwatobi Swim Club-',en:'Free!'},type:{ja:'優しいキャプテン (ESFJ)',en:'Gentle Captain (ESFJ)'},profile:{E:3,F:4,S:3,J:3},desc:{ja:'遙の幼馴染で水泳部のまとめ役。全員に気を配る優しいキャプテンとして仲間から愛される。',en:'Haruka\'s childhood friend who organizes the swim club. Loved by companions as a gentle captain who pays attention to everyone.'},traits:{ja:['優しさ','キャプテン','幼馴染','成長','仲間'],en:['Gentle','Captain','Childhood Friend','Growth','Comrades']},radar:[72,88,78,65,80,82]},

  // ── 弱虫ペダル ─────────────────────────────────────────────
  {id:'onoda_yp',icon:'🚴',name:{ja:'小野田坂道',en:'Sakamichi Onoda'},series:{ja:'弱虫ペダル',en:'Yowamushi Pedal'},type:{ja:'アキバ系の奇跡 (ENFP)',en:'Akiba-Type Miracle (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'アニメ好きのオタクが自転車の天才として開花する。諦めない気持ちと仲間への愛情が走りの源。',en:'An anime-loving otaku blooms as a bicycle genius. The spirit of never giving up and love for companions are the source of riding.'},traits:{ja:['アニメ好き','成長','天才','チーム','不屈'],en:['Anime Lover','Growth','Genius','Team','Indomitable']},radar:[80,80,82,55,72,85]},

  // ── ゆるキャン ─────────────────────────────────────────────
  {id:'rin_yuru',icon:'⛺',name:{ja:'志摩リン',en:'Rin Shima'},series:{ja:'ゆるキャン△',en:'Laid-Back Camp'},type:{ja:'ソロキャンプ少女 (ISTP)',en:'Solo Camping Girl (ISTP)'},profile:{I:4,T:3,S:3,P:3},desc:{ja:'一人でのキャンプを愛する少女。自由な時間と自然への愛着が魅力的なスローライフキャラ。',en:'A girl who loves camping alone. Love for free time and nature are the charming slow-life character.'},traits:{ja:['ソロキャンプ','自由','自然','マイペース','成長'],en:['Solo Camping','Freedom','Nature','At Own Pace','Growth']},radar:[55,68,52,72,65,72]},
  {id:'nadeshiko_yuru',icon:'⛺',name:{ja:'各務原なでしこ',en:'Nadeshiko Kagamihara'},series:{ja:'ゆるキャン△',en:'Laid-Back Camp'},type:{ja:'キャンプ大好き少女 (ESFP)',en:'Camp-Loving Girl (ESFP)'},profile:{E:4,F:4,S:3,P:3},desc:{ja:'リンのキャンプに衝撃を受けて自分もキャンプを始める元気な少女。食いしん坊で明るい性格が愛らしい。',en:'An energetic girl who starts camping herself after being amazed by Rin\'s camping. Foodie and bright personality is endearing.'},traits:{ja:['キャンプ','食いしん坊','明るさ','友情','成長'],en:['Camping','Foodie','Cheerful','Friendship','Growth']},radar:[72,85,88,52,68,90]},

  // ── ドラえもん ──────────────────────────────────────────────
  {id:'doraemon',icon:'🔵',name:{ja:'ドラえもん',en:'Doraemon'},series:{ja:'ドラえもん',en:'Doraemon'},type:{ja:'22世紀のロボット (ISFJ)',en:'22nd Century Robot (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'のびたを助けるために22世紀から来たネコ型ロボット。四次元ポケットの道具とのびたへの愛情が物語の全て。',en:'A cat-type robot from the 22nd century who came to help Nobita. The four-dimensional pocket tools and love for Nobita are everything of the story.'},traits:{ja:['ロボット','四次元ポケット','友情','優しさ','道具'],en:['Robot','4D Pocket','Friendship','Gentle','Tools']},radar:[62,90,72,68,78,88]},
  {id:'nobita',icon:'😭',name:{ja:'野比のび太',en:'Nobita Nobi'},series:{ja:'ドラえもん',en:'Doraemon'},type:{ja:'頑張る平凡な少年 (INFP)',en:'Striving Ordinary Boy (INFP)'},profile:{I:3,F:3,N:3,P:3},desc:{ja:'成績も運動も苦手だが心は優しい少年。ドラえもんの道具を使いながら成長する永遠の主人公。',en:'A boy poor at studies and sports but with a kind heart. The eternal protagonist who grows while using Doraemon\'s tools.'},traits:{ja:['優しさ','平凡','成長','友情','夢'],en:['Kind','Ordinary','Growth','Friendship','Dream']},radar:[42,82,62,38,55,80]},

  // ── スラムダンク追加 ─────────────────────────────────────────
  {id:'mitsui_sd',icon:'🏀',name:{ja:'三井寿',en:'Hisashi Mitsui'},series:{ja:'SLAM DUNK',en:'Slam Dunk'},type:{ja:'過去を持つベテラン (ISTJ)',en:'Veteran with a Past (ISTJ)'},profile:{I:3,T:3,S:4,J:3},desc:{ja:'中学の天才から不良に転落し再びバスケを目指す少年。「諦めたらそこで試合終了ですよ」の名言の体現者。',en:'A boy who fell from middle school genius to delinquent and aims for basketball again. The embodiment of the famous line "If you give up, that\'s when the game ends."'},traits:{ja:['再起','成長','努力','誠実','天才'],en:['Comeback','Growth','Effort','Sincere','Genius']},radar:[80,65,68,72,78,72]},

  // ── K-ON！追加 ───────────────────────────────────────────────
  {id:'azusa_kon',icon:'🎸',name:{ja:'中野梓',en:'Azusa Nakano'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'真剣なギタリスト (ISTJ)',en:'Serious Guitarist (ISTJ)'},profile:{I:3,T:3,S:3,J:4},desc:{ja:'音楽に真剣なネコ耳が似合うギタリスト。先輩たちのゆるい雰囲気にツッコミを入れながら絆を深める。',en:'A serious guitarist who suits cat ears. Deepens bonds while tsukkomi-ing the loose atmosphere of her seniors.'},traits:{ja:['ギター','真面目','ツッコミ','成長','友情'],en:['Guitar','Serious','Tsukkomi','Growth','Friendship']},radar:[62,75,60,72,75,72]},

  // ── ゴブリンスレイヤー追加 ──────────────────────────────────
  {id:'priestess_gs',icon:'⛪',name:{ja:'女神官',en:'Priestess'},series:{ja:'ゴブリンスレイヤー',en:'Goblin Slayer'},type:{ja:'成長する少女神官 (ISFJ)',en:'Growing Girl Priestess (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'ゴブリンスレイヤーのパーティに加わった若い神官。過酷な冒険の中で成長し強くなる姿が印象的。',en:'A young priestess who joined Goblin Slayer\'s party. Her growth and strengthening in harsh adventure is impressive.'},traits:{ja:['神官','成長','勇気','仲間','信仰'],en:['Priestess','Growth','Courage','Comrades','Faith']},radar:[55,82,58,62,72,80]},

  // ── メイドインアビス追加 ─────────────────────────────────────
  {id:'reg_mia',icon:'🤖',name:{ja:'レグ',en:'Reg'},series:{ja:'メイドインアビス',en:'Made in Abyss'},type:{ja:'謎のロボット少年 (ISTP)',en:'Mysterious Robot Boy (ISTP)'},profile:{I:3,T:3,S:4,P:3},desc:{ja:'アビスの奥から来たロボットの少年。リコを守るために戦い自分の起源を探る旅が物語の核心。',en:'A robot boy who came from deep in the Abyss. The journey to protect Riko and discover his origins is the core of the story.'},traits:{ja:['ロボット','謎','守護','成長','友情'],en:['Robot','Mysterious','Protector','Growth','Friendship']},radar:[72,72,55,72,72,78]},
  {id:'nanachi_mia',icon:'🐰',name:{ja:'ナナチ',en:'Nanachi'},series:{ja:'メイドインアビス',en:'Made in Abyss'},type:{ja:'アビスの賢者 (INTP)',en:'Abyss Sage (INTP)'},profile:{I:3,T:4,N:4,P:3},desc:{ja:'アビスの呪いを受けた元人間。知識と技術でリコたちを助けながら友の死と向き合い続ける。',en:'A former human who received the Abyss\'s curse. Continuously faces a friend\'s death while helping Riko and others with knowledge and technology.'},traits:{ja:['知識','賢者','友情','悲劇','成長'],en:['Knowledge','Sage','Friendship','Tragic','Growth']},radar:[55,72,48,88,72,68]},

  // ── 桜蘭高校ホスト部 ─────────────────────────────────────────
  {id:'tamaki_ouran',icon:'🌹',name:{ja:'須王環',en:'Tamaki Suoh'},series:{ja:'桜蘭高校ホスト部',en:'Ouran High School Host Club'},type:{ja:'ホスト部の王様 (ENFJ)',en:'Host Club King (ENFJ)'},profile:{E:4,F:4,N:3,J:2},desc:{ja:'ホスト部の創設者でお客様を幸せにすることが生きがい。無邪気で情熱的だが繊細さも持つ。',en:'The founder of the Host Club whose purpose is making guests happy. Innocent and passionate but also sensitive.'},traits:{ja:['カリスマ','王様','情熱','純粋','愛情'],en:['Charismatic','King','Passion','Pure','Love']},radar:[82,85,92,72,72,85]},
  {id:'kyoya_ouran',icon:'👓',name:{ja:'鏡夜',en:'Kyoya Ootori'},series:{ja:'桜蘭高校ホスト部',en:'Ouran High School Host Club'},type:{ja:'影の王 (INTJ)',en:'Shadow King (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'ホスト部の影の実力者で全てを計算する副部長。クールな外見の裏に環への友情を隠す。',en:'The shadow powerhouse of the Host Club and vice president who calculates everything. Hides friendship with Tamaki behind a cool exterior.'},traits:{ja:['策略家','影の王','友情','冷静','計算'],en:['Schemer','Shadow King','Friendship','Calm','Calculating']},radar:[58,55,48,95,85,55]},
  {id:'haruhi_ouran',icon:'🌸',name:{ja:'藤岡ハルヒ',en:'Haruhi Fujioka'},series:{ja:'桜蘭高校ホスト部',en:'Ouran High School Host Club'},type:{ja:'天然庶民 (INTP)',en:'Natural Commoner (INTP)'},profile:{I:3,T:3,N:3,P:3},desc:{ja:'貧乏から奨学生としてホスト部に巻き込まれた少女。性別不問で淡々と仕事をこなす異色の存在。',en:'A girl from poverty who gets caught up in the Host Club as a scholarship student. An unusual existence who handles work calmly regardless of gender.'},traits:{ja:['天然','庶民','成長','誠実','個性'],en:['Natural','Commoner','Growth','Sincere','Unique']},radar:[55,68,60,72,72,65]},

  // ── セーラームーン（さらに追加） ─────────────────────────────
  {id:'minako_sm',icon:'💛',name:{ja:'愛野美奈子（セーラーヴィーナス）',en:'Minako Aino (Sailor Venus)'},series:{ja:'美少女戦士セーラームーン',en:'Sailor Moon'},type:{ja:'愛の戦士 (ESFP)',en:'Warrior of Love (ESFP)'},profile:{E:4,F:4,S:3,P:4},desc:{ja:'愛とアイドルを愛する元気な戦士。うさぎと同じ明るさを持ちながらリーダーとしての側面も持つ。',en:'An energetic warrior who loves love and idols. Has the same brightness as Usagi while also having a leader side.'},traits:{ja:['愛','アイドル','元気','リーダー','仲間'],en:['Love','Idol','Energetic','Leader','Comrades']},radar:[78,85,88,58,72,88]},
  {id:'makoto_sm',icon:'⚡',name:{ja:'木野まこと（セーラージュピター）',en:'Makoto Kino (Sailor Jupiter)'},series:{ja:'美少女戦士セーラームーン',en:'Sailor Moon'},type:{ja:'強さの戦士 (ESFJ)',en:'Warrior of Strength (ESFJ)'},profile:{E:3,F:4,S:4,J:3},desc:{ja:'強くて料理が得意な戦士。外見の怖さとは裏腹にロマンチストで仲間思いな一面が魅力。',en:'A strong warrior skilled at cooking. Contrary to intimidating appearance, she is a romantic who cares for companions.'},traits:{ja:['強さ','料理','ロマンチスト','仲間','成長'],en:['Strong','Cooking','Romantic','Comrades','Growth']},radar:[82,82,75,62,80,80]},

  // ── 機動戦士ガンダム（追加） ───────────────────────────────
  {id:'char_gundam',icon:'🎭',name:{ja:'シャア・アズナブル',en:'Char Aznable'},series:{ja:'機動戦士ガンダム',en:'Mobile Suit Gundam'},type:{ja:'赤い彗星 (INTJ)',en:'Red Comet (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'「赤い彗星」の異名を持つ天才パイロット。復讐と理想の間で揺れる複雑な人物像がアムロとの対比を生む。',en:'A genius pilot known as the "Red Comet." Complex persona wavering between revenge and ideals creates contrast with Amuro.'},traits:{ja:['赤い彗星','復讐','カリスマ','謎','戦略'],en:['Red Comet','Revenge','Charismatic','Mysterious','Strategic']},radar:[88,55,62,92,82,48]},

  // ── ラブライブ！（追加） ────────────────────────────────────
  {id:'kotori_ll',icon:'🦢',name:{ja:'南ことり',en:'Kotori Minami'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'天使の歌姫 (ESFJ)',en:'Angel Songstress (ESFJ)'},profile:{E:3,F:4,S:3,J:2},desc:{ja:'穂乃果の幼馴染でμ\'sのメンバー。デザイナーとしての夢を持ちながら仲間との絆を大切にする。',en:'Honoka\'s childhood friend and μ\'s member. Has dreams as a designer while cherishing bonds with companions.'},traits:{ja:['優しさ','デザイン','友情','幼馴染','成長'],en:['Gentle','Design','Friendship','Childhood Friend','Growth']},radar:[65,85,78,62,72,82]},
  {id:'umi_ll',icon:'💙',name:{ja:'園田海未',en:'Umi Sonoda'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'武道家の作詞家 (ISTJ)',en:'Martial Artist Lyricist (ISTJ)'},profile:{I:3,F:3,S:3,J:4},desc:{ja:'厳格な武道家の家系出身で作詞を担当するメンバー。真面目で厳しいが仲間への愛情は深い。',en:'A member from a strict martial arts family who handles lyrics. Serious and strict but deep love for companions.'},traits:{ja:['真面目','武道','作詞','厳格','仲間'],en:['Serious','Martial Arts','Lyrics','Strict','Comrades']},radar:[65,72,62,75,82,72]},
  {id:'nico_ll',icon:'🖤',name:{ja:'矢澤にこ',en:'Nico Yazawa'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'アイドル研究家 (ESTJ)',en:'Idol Researcher (ESTJ)'},profile:{E:3,T:3,S:3,J:4},desc:{ja:'「にこにこにー！」の掛け声が有名なアイドルオタク。厳しい外見の裏に妹たちへの愛情と夢への執着がある。',en:'The idol otaku famous for "Nico Nico Ni!" Her strict exterior hides love for her sisters and obsession with dreams.'},traits:{ja:['アイドル','ニコニコ','妹愛','夢','カリスマ'],en:['Idol','Smile Pose','Sister Love','Dream','Charismatic']},radar:[72,72,80,68,72,78]},

  // ── 刀剣乱舞 ────────────────────────────────────────────────
  {id:'mikazuki_touken',icon:'⚔️',name:{ja:'三日月宗近',en:'Mikazuki Munechika'},series:{ja:'刀剣乱舞-花丸-',en:'Touken Ranbu: Hanamaru'},type:{ja:'最古の刀剣男士 (INFJ)',en:'Oldest Sword Warrior (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'最古の刀剣男士として穏やかな笑顔の裏に深い哲学を持つ。戦いへの覚悟と美しさへのこだわりが魅力。',en:'The oldest sword warrior who holds deep philosophy behind a gentle smile. Resolve in battle and dedication to beauty are charming.'},traits:{ja:['最古','哲学','美','戦い','謎'],en:['Oldest','Philosophy','Beauty','Battle','Mysterious']},radar:[78,68,58,85,82,72]},

  // ── アズールレーン・グランブルーファンタジー系 ────────────
  {id:'gran_gbf',icon:'🌟',name:{ja:'グラン',en:'Gran'},series:{ja:'グランブルーファンタジー THE ANIMATION',en:'Granblue Fantasy The Animation'},type:{ja:'天空の島の冒険者 (ENFP)',en:'Sky Island Adventurer (ENFP)'},profile:{E:3,F:3,N:4,P:3},desc:{ja:'天空の島々を旅しながら仲間と共に成長する主人公。正義感と純粋な心で困難に立ち向かう。',en:'The protagonist who grows with companions while traveling through sky islands. Confronts difficulties with sense of justice and pure heart.'},traits:{ja:['冒険','成長','正義','仲間','空'],en:['Adventure','Growth','Justice','Comrades','Sky']},radar:[75,78,78,65,72,78]},

  // ── とある魔術の禁書目録 / とある科学の超電磁砲 ────────────
  {id:'touma_index',icon:'✋',name:{ja:'上条当麻',en:'Touma Kamijou'},series:{ja:'とある魔術の禁書目録',en:'A Certain Magical Index'},type:{ja:'幻想殺しの少年 (ENFJ)',en:'Imagine Breaker Boy (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'全ての超能力と魔術を打ち消す右手を持つ「不運な少年」。「不幸だー！」が口癖だが人を助けることをやめない。',en:'An "unlucky boy" with a right hand that negates all powers and magic. "What misfortune!" is his catchphrase but he never stops helping people.'},traits:{ja:['幻想殺し','不運','正義','成長','仲間'],en:['Imagine Breaker','Unlucky','Justice','Growth','Comrades']},radar:[75,80,72,65,72,82]},
  {id:'mikoto_railgun',icon:'⚡',name:{ja:'御坂美琴（レールガン）',en:'Mikoto Misaka (Railgun)'},series:{ja:'とある科学の超電磁砲',en:'A Certain Scientific Railgun'},type:{ja:'電撃使いのエース (ESTJ)',en:'Railgun Ace (ESTJ)'},profile:{E:3,T:3,S:4,J:3},desc:{ja:'学園都市の超能力者ランキング3位のエース。プライドが高いが純粋で仲間思いな一面も持つ。',en:'The Level 5 esper ranked 3rd in Academy City. Has high pride but also a pure side that cares for companions.'},traits:{ja:['超電磁砲','プライド','天才','仲間','成長'],en:['Railgun','Pride','Genius','Comrades','Growth']},radar:[82,68,72,82,78,75]},
  {id:'accelerator_index',icon:'💨',name:{ja:'一方通行（アクセラレータ）',en:'Accelerator'},series:{ja:'とある魔術の禁書目録',en:'A Certain Magical Index'},type:{ja:'最強の反英雄 (INTJ)',en:'Strongest Anti-Hero (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'学園都市最強の超能力者。悪と善の間で揺れながら自分の守るべきものを見つけていく複雑なキャラ。',en:'The strongest esper in Academy City. A complex character who finds what to protect while wavering between evil and good.'},traits:{ja:['最強','反英雄','複雑','成長','守護'],en:['Strongest','Anti-Hero','Complex','Growth','Protector']},radar:[95,45,48,98,82,42]},

  // ── シャカリキ / スポーツ追加 ────────────────────────────────
  {id:'midousuji_yp',icon:'🚴',name:{ja:'御堂筋翔',en:'Sho Midousuji'},series:{ja:'弱虫ペダル',en:'Yowamushi Pedal'},type:{ja:'究極の自転車乗り (INTJ)',en:'Ultimate Cyclist (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'「速く」なることだけを追い続ける孤高の自転車乗り。独特の外見と圧倒的な走りが印象的な強敵。',en:'A solitary cyclist who pursues only being "fast." Unique appearance and overwhelming riding make him an impressive rival.'},traits:{ja:['速さ','孤高','独特','強さ','成長'],en:['Speed','Solitary','Unique','Strong','Growth']},radar:[88,35,48,88,82,38]},

  // ── プリキュア ──────────────────────────────────────────────
  {id:'nagisa_precure',icon:'💛',name:{ja:'美墨なぎさ（キュアブラック）',en:'Nagisa Misumi (Cure Black)'},series:{ja:'ふたりはプリキュア',en:'Pretty Cure'},type:{ja:'スポーツ少女の戦士 (ESFP)',en:'Sports Girl Warrior (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'ラクロス部の活発な少女がプリキュアとして覚醒する。ほのかとのコンビで「二人はプリキュア！」と戦う。',en:'An active girl in the lacrosse club who awakens as Pretty Cure. Fights as "We Are Pretty Cure!" duo with Honoka.'},traits:{ja:['活発','スポーツ','友情','成長','戦士'],en:['Active','Sports','Friendship','Growth','Warrior']},radar:[82,72,85,55,72,80]},

  // ── 異世界転生もの追加 ────────────────────────────────────
  {id:'kazuma_konosuba2',icon:'😤',name:{ja:'セバス・チャン',en:'Sebas Tian'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'執事の信義 (ISTJ)',en:'Butler\'s Faithfulness (ISTJ)'},profile:{I:3,T:3,S:4,J:4},desc:{ja:'ナザリックの総執事として頼れる存在。人間への同情心がナザリックの中での葛藤を生む。',en:'A reliable presence as the Chief Butler of Nazarick. Compassion for humans creates conflict within Nazarick.'},traits:{ja:['執事','信義','葛藤','成長','誠実'],en:['Butler','Faithfulness','Conflict','Growth','Sincere']},radar:[72,75,60,72,88,72]},
  {id:'raphtalia2',icon:'🌟',name:{ja:'フィロリアル（フィーロ）',en:'Filo'},series:{ja:'盾の勇者の成り上がり',en:'The Rising of the Shield Hero'},type:{ja:'フィロリアル女王 (ESFP)',en:'Filolial Queen (ESFP)'},profile:{E:4,F:3,S:4,P:4},desc:{ja:'大きなフィロリアルが人型に変身する天真爛漫な少女。食欲と好奇心が旺盛で尚文を「パパ」と呼ぶ。',en:'A carefree girl who transforms from a large filolial to human form. Has hearty appetite and curiosity, calling Naofumi "Papa."'},traits:{ja:['天真爛漫','食欲','フィロリアル','成長','仲間'],en:['Carefree','Appetite','Filolial','Growth','Comrades']},radar:[75,75,88,42,58,90]},

  // ── ゼロの使い魔 ──────────────────────────────────────────────
  {id:'louise_zm',icon:'💥',name:{ja:'ルイズ・フランソワーズ',en:'Louise Françoise'},series:{ja:'ゼロの使い魔',en:'The Familiar of Zero'},type:{ja:'ゼロのツンデレ魔法使い (ESTJ)',en:'Zero Tsundere Mage (ESTJ)'},profile:{E:3,T:3,S:3,J:4},desc:{ja:'魔法が爆発しかしない「ゼロ」の異名を持つ魔法使い。プライドが高いツンデレだが才能への執念と仲間への愛情がある。',en:'A mage nicknamed "Zero" whose magic only explodes. A proud tsundere but has obsession with talent and love for companions.'},traits:{ja:['ゼロ','ツンデレ','爆発','プライド','成長'],en:['Zero','Tsundere','Explosion','Pride','Growth']},radar:[72,68,68,72,75,72]},

  // ── 灼眼のシャナ ─────────────────────────────────────────────
  {id:'shana',icon:'🔥',name:{ja:'シャナ',en:'Shana'},series:{ja:'灼眼のシャナ',en:'Shakugan no Shana'},type:{ja:'炎の少女 (INTJ)',en:'Girl of Flames (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'フレイムヘイズとして戦いに生きてきた少女。悠二との出会いで感情と人間性を学んでいく。',en:'A girl who has lived for battle as a Flame Haze. Learns emotion and humanity through meeting Yuji.'},traits:{ja:['炎','戦士','成長','感情学習','強さ'],en:['Flame','Warrior','Growth','Learning Emotion','Strong']},radar:[82,58,55,82,78,62]},

  // ── 魔法少女リリカルなのは ───────────────────────────────────
  {id:'nanoha_magic',icon:'⭐',name:{ja:'高町なのは',en:'Nanoha Takamachi'},series:{ja:'魔法少女リリカルなのは',en:'Magical Girl Lyrical Nanoha'},type:{ja:'友達にする魔法少女 (ENFJ)',en:'Friendship Magical Girl (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'「砲撃魔法」で敵を友達にする魔法少女。「友達にしてあげる！」は最強の言葉で全てを乗り越える。',en:'A magical girl who makes enemies into friends with "bombardment magic." "I\'ll make you my friend!" is the strongest phrase that overcomes everything.'},traits:{ja:['友達','砲撃','成長','魔法少女','絆'],en:['Friendship','Bombardment','Growth','Magical Girl','Bond']},radar:[78,88,78,72,72,85]},
  {id:'fate_magic',icon:'⚡',name:{ja:'フェイト・テスタロッサ',en:'Fate Testarossa'},series:{ja:'魔法少女リリカルなのは',en:'Magical Girl Lyrical Nanoha'},type:{ja:'母の愛を求めて (INFJ)',en:'Seeking Mother\'s Love (INFJ)'},profile:{I:3,F:3,N:4,J:3},desc:{ja:'母の愛情を得ようと戦い続けた少女。なのはとの友情がその心を解き放つ感動的な成長物語。',en:'A girl who kept fighting to gain her mother\'s love. The touching growth story of Nanoha\'s friendship liberating her heart.'},traits:{ja:['母への愛','孤独','成長','友情','解放'],en:['Mother\'s Love','Solitude','Growth','Friendship','Liberation']},radar:[72,78,52,75,72,80]},

  // ── ゴッドマン / 懐かし系 ─────────────────────────────────
  {id:'lupin_third',icon:'🃏',name:{ja:'ルパン三世',en:'Lupin III'},series:{ja:'ルパン三世',en:'Lupin the Third'},type:{ja:'世界最高の怪盗 (ENTP)',en:'World\'s Greatest Thief (ENTP)'},profile:{E:4,T:3,N:4,P:4},desc:{ja:'「世界最高の怪盗」として縦横無尽に活躍する主人公。ユーモアと機転で困難を乗り越え、ナントカという。',en:'The protagonist who operates freely as the "world\'s greatest thief." Overcomes difficulties with humor and quick thinking.'},traits:{ja:['怪盗','自由','ユーモア','機転','カリスマ'],en:['Thief','Freedom','Humor','Quick Wit','Charismatic']},radar:[78,65,88,82,55,75]},

  // ── 東京リベンジャーズ（追加） ────────────────────────────────
  {id:'baji_tr',icon:'⚡',name:{ja:'場地圭介',en:'Keisuke Baji'},series:{ja:'東京リベンジャーズ',en:'Tokyo Revengers'},type:{ja:'壱番隊隊長の義侠 (ESTP)',en:'1st Division Captain\'s Honor (ESTP)'},profile:{E:3,T:3,S:4,P:3},desc:{ja:'東京卍會壱番隊隊長として義侠心で戦う漢。仲間を守るための行動が感動的な男気を見せる。',en:'A man who fights with a chivalrous spirit as captain of the 1st Division of Tokyo Manji Gang. Actions to protect companions show moving manliness.'},traits:{ja:['義侠','漢気','仲間','成長','強さ'],en:['Chivalry','Manliness','Comrades','Growth','Strong']},radar:[85,72,72,62,72,75]},

  // ── ハイスクールD×D ─────────────────────────────────────────
  {id:'issei_dxd',icon:'🔴',name:{ja:'兵藤一誠',en:'Issei Hyoudou'},series:{ja:'ハイスクールD×D',en:'High School DxD'},type:{ja:'ドラゴン使いの野望 (ESFP)',en:'Dragon-Wielding Dreamer (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'悪魔転生した高校生。「ハーレムの王様になる！」という夢と仲間への真剣な愛情が共存する。',en:'A high schooler who became a devil. The dream of "becoming king of a harem!" and genuine love for companions coexist.'},traits:{ja:['悪魔','ドラゴン','夢','成長','仲間'],en:['Devil','Dragon','Dream','Growth','Comrades']},radar:[78,72,78,55,65,75]},
  {id:'rias_dxd',icon:'🔴',name:{ja:'リアス・グレモリー',en:'Rias Gremory'},series:{ja:'ハイスクールD×D',en:'High School DxD'},type:{ja:'悪魔の上司 (ENTJ)',en:'Devil Superior (ENTJ)'},profile:{E:3,T:3,N:3,J:3},desc:{ja:'グレモリー家次女で上位悪魔のリアス。自分の仲間を大切にするリーダーシップと愛情が魅力。',en:'The second daughter of the Gremory family and high-class devil Rias. Leadership and love for her companions are charming.'},traits:{ja:['上位悪魔','リーダー','愛情','プライド','成長'],en:['High-Class Devil','Leader','Love','Pride','Growth']},radar:[78,78,78,78,82,78]},

  // ── デート・ア・ライブ ─────────────────────────────────────
  {id:'tohka_dal',icon:'🌸',name:{ja:'夜刀神十香',en:'Tohka Yatogami'},series:{ja:'デート・ア・ライブ',en:'Date A Live'},type:{ja:'純粋な精霊 (ENFJ)',en:'Pure Spirit (ENFJ)'},profile:{E:3,F:4,N:2,P:3},desc:{ja:'初めて人間の優しさを知った精霊。士道への純粋な愛情と成長が物語の核心。',en:'A spirit who learned human kindness for the first time. Pure love for Shido and growth are the core of the story.'},traits:{ja:['純粋','精霊','愛情','成長','喜び'],en:['Pure','Spirit','Love','Growth','Joy']},radar:[72,90,75,55,68,92]},
  {id:'kurumi_dal',icon:'🕐',name:{ja:'時崎狂三',en:'Kurumi Tokisaki'},series:{ja:'デート・ア・ライブ',en:'Date A Live'},type:{ja:'時を操る悪夢 (INTJ)',en:'Time-Controlling Nightmare (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'「最悪の精霊」と呼ばれる謎多き存在。表裏一体の性格と目的の複雑さが最も人気の精霊に押し上げる。',en:'A mysterious existence called the "Worst Spirit." The dual personality and complex objectives push her to be the most popular spirit.'},traits:{ja:['謎','時間','二面性','カリスマ','孤独'],en:['Mysterious','Time','Dual','Charismatic','Solitary']},radar:[62,52,62,92,82,55]},

  // ── 龍が如く系 / 物語 ────────────────────────────────────────
  {id:'yuri_angel',icon:'🌟',name:{ja:'ユリッペ（仲村ゆり）',en:'Yuri (Yuri Nakamura)'},series:{ja:'Angel Beats!',en:'Angel Beats!'},type:{ja:'SSS団のリーダー (ENTJ)',en:'SSS Leader (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'神に反抗するためSSS団を率いるリーダー。強い意志と弟妹への後悔が物語の感動を生む。',en:'A leader who leads the SSS to rebel against God. Strong will and regret for younger siblings create the story\'s emotion.'},traits:{ja:['リーダー','反抗','後悔','成長','仲間'],en:['Leader','Rebellion','Regret','Growth','Comrades']},radar:[78,68,72,82,82,72]},
  {id:'otonashi_ab',icon:'🎵',name:{ja:'音無結弦',en:'Yuzuru Otonashi'},series:{ja:'Angel Beats!',en:'Angel Beats!'},type:{ja:'記憶を失った少年 (INFJ)',en:'Boy Who Lost Memory (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'記憶を失いながら後悔のない人生を選択した少年。かなでとの絆が最終話の感動につながる。',en:'A boy who lost his memory and chose a life without regret. The bond with Kanade leads to the final episode\'s emotion.'},traits:{ja:['記憶','成長','後悔','絆','感動'],en:['Memory','Growth','Regret','Bond','Moving']},radar:[65,80,65,72,72,80]},

  // ── 物語シリーズ（追加） ─────────────────────────────────────
  {id:'senjougahara',icon:'📎',name:{ja:'戦場ヶ原ひたぎ',en:'Hitagi Senjougahara'},series:{ja:'化物語',en:'Bakemonogatari'},type:{ja:'ツンデレの文武両道 (INTJ)',en:'Tsundere All-Rounder (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'「迷惑かけます」の名言で知られる怪異の少女。鋭い言葉の裏に阿良々木への深い愛情を隠す。',en:'A girl with aberration known for the quote "I\'ll be a bother." Hides deep love for Araragi behind sharp words.'},traits:{ja:['ツンデレ','言葉','愛情','プライド','成長'],en:['Tsundere','Words','Love','Pride','Growth']},radar:[62,72,52,88,82,72]},
  {id:'shinobu_mono',icon:'🌟',name:{ja:'忍野忍（キスショット）',en:'Shinobu Oshino (Kiss-Shot)'},series:{ja:'化物語',en:'Bakemonogatari'},type:{ja:'元最強の吸血鬼 (INTJ)',en:'Former Strongest Vampire (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'かつて最強の吸血鬼だった存在が少女の姿でアラレと共に生きる。その孤独と誇りが魅力。',en:'A formerly strongest vampire who lives with Araragi in a girl\'s form. Her solitude and pride are charming.'},traits:{ja:['吸血鬼','孤独','誇り','成長','絆'],en:['Vampire','Solitude','Pride','Growth','Bond']},radar:[88,52,42,88,82,55]},

  // ── 屋上の有刺鉄線 / 新シリーズ ─────────────────────────────
  {id:'megumin_konosuba2',icon:'🌸',name:{ja:'ウィズ',en:'Wiz'},series:{ja:'この素晴らしい世界に祝福を！',en:'KonoSuba'},type:{ja:'優しい魔王軍幹部 (ISFJ)',en:'Kind Devil King Executive (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'元魔王軍幹部だが今は魔道具屋を営む善良な魔法使い。不思議な存在感と優しさが愛されるキャラ。',en:'A former Devil King executive who now runs a magic shop — a good-natured mage. Strange presence and kindness make her a beloved character.'},traits:{ja:['元幹部','優しさ','魔法','成長','不思議'],en:['Former Executive','Kindness','Magic','Growth','Strange']},radar:[55,85,62,68,70,80]},

  // ── TIGER & BUNNY ───────────────────────────────────────────
  {id:'kotetsu_tb',icon:'🐯',name:{ja:'鏑木・T・虎徹',en:'Kotetsu T. Kaburagi'},series:{ja:'TIGER & BUNNY',en:'Tiger & Bunny'},type:{ja:'ベテランヒーロー (ENFP)',en:'Veteran Hero (ENFP)'},profile:{E:3,F:4,N:3,P:3},desc:{ja:'過時代のヒーローとして奮闘するベテランの中年ヒーロー。娘への愛情と仲間への信頼が感動的。',en:'A middle-aged veteran hero who struggles as a hero of a past era. Love for his daughter and trust in companions are moving.'},traits:{ja:['ベテラン','娘への愛','仲間','成長','信念'],en:['Veteran','Daughter Love','Comrades','Growth','Conviction']},radar:[78,82,75,62,75,82]},

  // ── 進撃の巨人（細部） ──────────────────────────────────────
  {id:'falco_aot',icon:'🐦',name:{ja:'ファルコ・グライス',en:'Falco Grice'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'純粋な少年の誓い (INFJ)',en:'Pure Boy\'s Oath (INFJ)'},profile:{I:3,F:3,N:3,J:3},desc:{ja:'ガビへの想いを胸に戦士を目指す少年。戦争の中で純粋な心を保ちながら成長する物語。',en:'A boy who aims to be a warrior with feelings for Gabi. A story of growing while maintaining a pure heart in the midst of war.'},traits:{ja:['純粋','誓い','成長','愛情','戦士'],en:['Pure','Oath','Growth','Love','Warrior']},radar:[62,78,58,68,70,80]},

  // ── 探偵はもう、死んでいる ────────────────────────────────────
  {id:'siesta_tanteha',icon:'🎩',name:{ja:'シエスタ',en:'Siesta'},series:{ja:'探偵はもう、死んでいる。',en:'The Detective is Already Dead'},type:{ja:'名探偵のパートナー (INTJ)',en:'Great Detective\'s Partner (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'世界を守った名探偵。死後も物語に影響を与え続ける存在感は圧倒的。',en:'A great detective who protected the world. Overwhelming presence that continues to influence the story after death.'},traits:{ja:['名探偵','謎','成長','影響','哲学'],en:['Great Detective','Mysterious','Growth','Influence','Philosophy']},radar:[68,65,58,88,78,68]},

  // ── ハイキュー最終追加 ─────────────────────────────────────
  {id:'tanaka_hq',icon:'🌪️',name:{ja:'田中龍之介',en:'Ryunosuke Tanaka'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'熱血エース (ESFP)',en:'Hot-Blooded Ace (ESFP)'},profile:{E:4,F:3,S:4,P:3},desc:{ja:'烏野の熱血エース。怖い顔に反して仲間思いで後輩の日向たちを支える頼れる先輩。',en:'Karasuno\'s hot-blooded ace. Despite a scary face, a reliable senior who supports younger members like Hinata despite caring about companions.'},traits:{ja:['熱血','エース','仲間','先輩','成長'],en:['Hot-Blooded','Ace','Comrades','Senior','Growth']},radar:[82,72,80,58,72,78]},
  {id:'sugawara_hq',icon:'🌟',name:{ja:'菅原孝支',en:'Koushi Sugawara'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'支えるセッター (ENFJ)',en:'Supporting Setter (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'影山を支えながら自分の可能性を信じるセッター。チームへの献身と後輩への愛情が魅力。',en:'A setter who supports Kageyama while believing in his own possibilities. Dedication to the team and love for younger members are charming.'},traits:{ja:['支え','セッター','成長','仲間','先輩'],en:['Support','Setter','Growth','Comrades','Senior']},radar:[70,85,75,70,78,82]},

  // ── 推しが武道館いってくれたら死ぬ ───────────────────────
  {id:'eripiyo_oshi',icon:'⭐',name:{ja:'えりぴよ',en:'Eripiyo'},series:{ja:'推しが武道館いってくれたら死ぬ',en:'If My Favorite Pop Idol Made It to the Budokan, I Would Die'},type:{ja:'魂のオタク (INFP)',en:'Soul Otaku (INFP)'},profile:{I:3,F:4,N:3,P:3},desc:{ja:'地下アイドルに魂を捧げる純粋なオタク。その純粋な情熱と応援する姿が共感を呼ぶ。',en:'A pure otaku who dedicates her soul to an underground idol. Her pure passion and supportive figure resonates with viewers.'},traits:{ja:['オタク','純粋','情熱','応援','成長'],en:['Otaku','Pure','Passion','Support','Growth']},radar:[52,82,62,55,65,82]},

  // ── 魔入りました！入間くん ────────────────────────────────────
  {id:'iruma_mairimas',icon:'😈',name:{ja:'鈴木入間',en:'Iruma Suzuki'},series:{ja:'魔入りました！入間くん',en:'Welcome to Demon School, Iruma-kun!'},type:{ja:'天然の魔界一 (ENFP)',en:'Natural Netherworld Best (ENFP)'},profile:{E:3,F:3,N:3,P:3},desc:{ja:'人間が悪魔に売られて魔界の学校に通うコメディ。天然の人の良さで全員から愛される不思議な主人公。',en:'A comedy where a human sold to a devil attends school in the netherworld. A strange protagonist loved by all with natural goodness.'},traits:{ja:['天然','人の良さ','成長','コメディ','才能'],en:['Natural','Good-natured','Growth','Comedy','Talent']},radar:[72,82,82,55,65,85]},

  // ── ノラガミ ────────────────────────────────────────────────
  {id:'yato_noragami',icon:'⚔️',name:{ja:'夜ト',en:'Yato'},series:{ja:'ノラガミ',en:'Noragami'},type:{ja:'野良神の野望 (ENFP)',en:'Stray God\'s Ambition (ENFP)'},profile:{E:3,F:3,N:4,P:3},desc:{ja:'自分の神社を建てることを夢見る野良神。お調子者の外見の裏に深い孤独と信念を持つ。',en:'A stray god who dreams of building his own shrine. Behind his frivolous exterior lies deep solitude and conviction.'},traits:{ja:['野良神','夢','孤独','成長','信念'],en:['Stray God','Dream','Solitude','Growth','Conviction']},radar:[72,68,72,68,65,72]},

  // ── テイルズオブ系（アニメ化） ──────────────────────────────
  {id:'asbel_tales',icon:'⚔️',name:{ja:'ソフィ（テイルズ）',en:'Sophie (Tales)'},series:{ja:'テイルズオブグレイセスf',en:'Tales of Graces'},type:{ja:'命を学ぶ少女 (ISFJ)',en:'Girl Learning Life (ISFJ)'},profile:{I:3,F:4,S:3,J:3},desc:{ja:'人間の感情と命を学んでいく少女型の存在。アスベルたちとの冒険で成長する純粋な物語。',en:'A girl-type existence who learns human emotion and life. Pure story of growing through adventure with Asbel and others.'},traits:{ja:['成長','学習','純粋','命','友情'],en:['Growth','Learning','Pure','Life','Friendship']},radar:[55,82,60,65,70,82]},

  // ── 五等分の追加 ─────────────────────────────────────────────
  {id:'fuutarou_nakano',icon:'📚',name:{ja:'上杉風太郎',en:'Fuutarou Uesugi'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'努力の家庭教師 (ISTJ)',en:'Hardworking Tutor (ISTJ)'},profile:{I:3,T:3,S:3,J:4},desc:{ja:'五姉妹の家庭教師を務める努力家の少年。成績最優秀で奨学金のために必死に働く姿が共感を呼ぶ。',en:'A hardworking boy who serves as tutor to the five sisters. Top grades and desperate effort for a scholarship resonates with viewers.'},traits:{ja:['努力','勉強','成長','誠実','責任'],en:['Effort','Study','Growth','Sincere','Responsibility']},radar:[65,65,55,85,80,65]},

  // ── 月とライカと吸血姫 ──────────────────────────────────────
  {id:'irina_moon',icon:'🧛',name:{ja:'イリナ・ルミネスク',en:'Irina Luminesk'},series:{ja:'月とライカと吸血姫',en:'Scarlet Nexus'},type:{ja:'宇宙に挑む吸血鬼 (ENTJ)',en:'Space-Challenging Vampire (ENTJ)'},profile:{E:3,T:3,N:4,J:3},desc:{ja:'宇宙飛行士訓練に参加した吸血鬼の少女。人間と吸血鬼の間の差別を超えて夢に挑む物語。',en:'A vampire girl who participates in astronaut training. A story of challenging dreams while overcoming discrimination between humans and vampires.'},traits:{ja:['吸血鬼','宇宙','成長','差別','勇気'],en:['Vampire','Space','Growth','Discrimination','Courage']},radar:[78,68,65,78,72,75]},
  // ── チェンソーマン ──
  {id:'denji_csm',icon:'🪚',name:{ja:'デンジ',en:'Denji'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'チェンソーの悪魔人間 (ESFP)',en:'Chainsaw Devil-Human (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'貧困の末にポチタと合体したチェンソーの悪魔人間。シンプルな夢を持ち、食欲と欲望に正直に生きる。',en:'A chainsaw devil-human merged with Pochita after poverty. Lives honestly with simple dreams, driven by hunger and desire.'},traits:{ja:['チェンソー','食欲','正直','悪魔人間','情熱'],en:['Chainsaw','Appetite','Honest','Devil-Human','Passion']},radar:[82,45,70,85,55,60]},
  {id:'makima_csm',icon:'👁️',name:{ja:'マキマ',en:'Makima'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'支配の悪魔 (ENTJ)',en:'Control Devil (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'公安対魔特異4課の上司で支配の悪魔。人類の夢を叶えるため全てを操る謎めいた存在。',en:'The mysterious superior of Public Safety Division 4 and the Control Devil. Manipulates everything to fulfill humanity\'s dreams.'},traits:{ja:['支配','謎','操作','悪魔','統率'],en:['Control','Mystery','Manipulation','Devil','Leadership']},radar:[55,95,90,50,92,85]},
  {id:'power_csm',icon:'🩸',name:{ja:'パワー',en:'Power'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'血の魔人 (ESFP)',en:'Blood Fiend (ESFP)'},profile:{E:4,S:4,F:2,P:4},desc:{ja:'血の魔人で公安対魔特異4課のメンバー。自己中心的で野蛮だが、仲間への情も持つ。',en:'Blood Fiend and member of Division 4. Self-centered and savage, but holds affection for friends.'},traits:{ja:['血液','自己中','野蛮','魔人','成長'],en:['Blood','Selfish','Savage','Fiend','Growth']},radar:[75,35,40,80,45,55]},
  {id:'aki_csm',icon:'🗡️',name:{ja:'早川アキ',en:'Aki Hayakawa'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'誠実な悪魔ハンター (ISTJ)',en:'Sincere Devil Hunter (ISTJ)'},profile:{I:3,S:3,T:3,J:4},desc:{ja:'家族を悪魔に殺されたため悪魔ハンターになった青年。誠実で責任感が強く、仲間を守るために戦う。',en:'A young man who became a devil hunter after demons killed his family. Sincere and responsible, fights to protect his friends.'},traits:{ja:['誠実','責任','悲劇','悪魔ハンター','保護'],en:['Sincere','Responsibility','Tragedy','Devil Hunter','Protection']},radar:[65,75,80,60,78,85]},
  {id:'himeno_csm',icon:'🎭',name:{ja:'姫野',en:'Himeno'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'ベテランハンター (ENFJ)',en:'Veteran Hunter (ENFJ)'},profile:{E:3,F:3,N:3,J:3},desc:{ja:'公安の先輩ハンター。ユーモアがあるが内に深い傷を持つ。仲間のために命を張ることも厭わない。',en:'A veteran Public Safety hunter with humor but deep inner wounds. Not afraid to risk her life for friends.'},traits:{ja:['先輩','犠牲','ユーモア','献身','傷'],en:['Senior','Sacrifice','Humor','Devotion','Wounds']},radar:[70,68,72,72,70,73]},
  {id:'kobeni_csm',icon:'😰',name:{ja:'コベニ',en:'Kobeni'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'臆病だが実力者 (ISFJ)',en:'Timid but Skilled (ISFJ)'},profile:{I:4,S:3,F:3,J:3},desc:{ja:'臆病で泣き虫だが、追い詰められると驚異的な身体能力を発揮する公安ハンター。',en:'A timid and crybaby Public Safety hunter who displays extraordinary physical ability when cornered.'},traits:{ja:['臆病','実力','成長','泣き虫','意外性'],en:['Timid','Skilled','Growth','Crybaby','Surprising']},radar:[55,70,65,60,62,72]},
  // ── 鬼滅の刃 追加 ──
  {id:'zenitsu_ds',icon:'⚡',name:{ja:'我妻善逸',en:'Zenitsu Agatsuma'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'雷の眠り剣士 (ISFJ)',en:'Thunder Sleeping Swordsman (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'臆病で泣き言が多いが、眠ると驚異的な雷の呼吸を発揮する鬼殺隊士。ねずこへの思いも純粋。',en:'A cowardly crybaby demon slayer who displays tremendous Thunder Breathing when asleep. His feelings for Nezuko are pure.'},traits:{ja:['臆病','雷の呼吸','純粋','眠り','成長'],en:['Cowardly','Thunder Breathing','Pure','Sleep','Growth']},radar:[65,62,60,78,55,70]},
  {id:'inosuke_ds',icon:'🐗',name:{ja:'嘴平伊之助',en:'Inosuke Hashibira'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'野生の獣 (ESTP)',en:'Wild Beast (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'猪頭の仮面を被り山育ちの野生児。直感と本能で戦い、負けず嫌いで挑戦を愛する。',en:'A mountain-raised wild child wearing a boar mask. Fights with instinct, hates losing, loves challenges.'},traits:{ja:['野生','猪','本能','負けず嫌い','成長'],en:['Wild','Boar','Instinct','Competitive','Growth']},radar:[82,42,40,78,52,60]},
  {id:'rengoku_ds',icon:'🔥',name:{ja:'煉獄杏寿郎',en:'Kyojuro Rengoku'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'炎の柱 (ENFJ)',en:'Flame Hashira (ENFJ)'},profile:{E:4,F:4,N:3,J:4},desc:{ja:'炎の呼吸の使い手で炎柱。情熱的で熱血漢だが、鬼殺への誇りと弱者への優しさを兼ね備える。',en:'Master of Flame Breathing and Flame Hashira. Passionate and hot-blooded, combining pride as a demon slayer with kindness to the weak.'},traits:{ja:['炎','情熱','熱血','柱','誇り'],en:['Flame','Passion','Hot-blooded','Hashira','Pride']},radar:[85,72,80,90,75,88]},
  {id:'shinobu_ds',icon:'🦋',name:{ja:'胡蝶しのぶ',en:'Shinobu Kocho'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'蟲柱の毒剣士 (INFJ)',en:'Insect Hashira Poisoner (INFJ)'},profile:{I:3,N:3,F:3,J:4},desc:{ja:'蟲柱で毒を使う鬼殺隊士。常に微笑みを見せるが、内には姉の仇への深い怒りを秘めている。',en:'Insect Hashira who uses poison. Always smiling but harbors deep anger toward the one who killed her sister.'},traits:{ja:['毒','微笑み','怒り','蟲','喪失'],en:['Poison','Smile','Anger','Insect','Loss']},radar:[55,88,85,65,82,80]},
  {id:'muichiro_ds',icon:'🌫️',name:{ja:'時透無一郎',en:'Muichiro Tokito'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'霞柱の天才剣士 (ISTJ)',en:'Mist Hashira Prodigy (ISTJ)'},profile:{I:4,S:3,T:4,J:4},desc:{ja:'霞柱で記憶を失った天才剣士。無感情に見えるが、記憶が戻ると温かい本来の姿が現れる。',en:'Mist Hashira, a prodigy swordsman who lost his memories. Appears emotionless, but regaining memories reveals his warm true self.'},traits:{ja:['天才','記憶','霞','冷静','成長'],en:['Prodigy','Memory','Mist','Calm','Growth']},radar:[60,90,82,52,88,85]},
  {id:'tengen_ds',icon:'💎',name:{ja:'宇髄天元',en:'Tengen Uzui'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'派手な音柱 (ESFP)',en:'Flamboyant Sound Hashira (ESFP)'},profile:{E:4,S:4,F:3,P:3},desc:{ja:'音柱で「派手」を信条とする元忍者。三人の妻を持ち、豪快で明るく戦場でも派手さを失わない。',en:'Sound Hashira and former ninja whose creed is "flamboyance." Has three wives, bold and bright, never losing flair even in battle.'},traits:{ja:['派手','音','忍者','豪快','柱'],en:['Flamboyant','Sound','Ninja','Bold','Hashira']},radar:[80,70,68,80,72,75]},
  {id:'mitsuri_ds',icon:'💚',name:{ja:'甘露寺蜜璃',en:'Mitsuri Kanroji'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'恋柱の感情剣士 (ENFJ)',en:'Love Hashira Swordsman (ENFJ)'},profile:{E:4,F:4,N:3,J:3},desc:{ja:'恋柱で豊かな感情を持つ鬼殺隊士。柔軟な筋肉と長い鞭のような刀で独自の戦い方を持つ。',en:'Love Hashira with rich emotions. Has unique fighting style using flexible muscles and a long whip-like sword.'},traits:{ja:['恋','感情','柔軟','優しさ','柱'],en:['Love','Emotion','Flexible','Kindness','Hashira']},radar:[72,68,65,88,62,70]},
  {id:'kanao_ds',icon:'🌸',name:{ja:'栗花落カナヲ',en:'Kanao Tsuyuri'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'静かな成長型 (ISFJ)',en:'Quiet Growth Type (ISFJ)'},profile:{I:4,S:3,F:2,J:3},desc:{ja:'感情を表に出さず、コイントスで決断していた少女。鬼殺隊の中で徐々に感情を取り戻していく。',en:'A girl who hid her emotions and made decisions by coin flip. Gradually regains her emotions within the Demon Slayer Corps.'},traits:{ja:['静か','成長','感情','硬貨投げ','花'],en:['Quiet','Growth','Emotion','Coin Flip','Flower']},radar:[52,78,72,65,75,80]},
  // ── ブリーチ追加 ──
  {id:'byakuya_bl',icon:'🌸',name:{ja:'朽木白哉',en:'Byakuya Kuchiki'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'誇り高き貴族 (INTJ)',en:'Proud Noble (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'護廷十三隊六番隊隊長で四大貴族朽木家の当主。プライドが高く冷静だが、ルキアへの愛情を秘める。',en:'Captain of Squad 6 and head of the noble Kuchiki Clan. Proud and calm, but secretly harbors affection for Rukia.'},traits:{ja:['誇り','桜','貴族','冷静','愛'],en:['Pride','Cherry Blossoms','Noble','Calm','Love']},radar:[55,95,90,48,92,90]},
  {id:'renji_bl',icon:'🐍',name:{ja:'阿散井恋次',en:'Renji Abarai'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'熱血副隊長 (ESTP)',en:'Hot-blooded Vice Captain (ESTP)'},profile:{E:3,S:4,T:3,P:3},desc:{ja:'白哉の副隊長で、ルキアの幼なじみ。荒削りで直情径行だが義理堅く、大切な人を守るため戦う。',en:'Byakuya\'s vice captain and Rukia\'s childhood friend. Rough and direct, but loyal, fighting to protect those he cares about.'},traits:{ja:['義理','熱血','幼なじみ','刺青','成長'],en:['Loyalty','Hot-blooded','Childhood Friend','Tattoos','Growth']},radar:[78,60,55,72,58,68]},
  {id:'yoruichi_bl',icon:'⚡',name:{ja:'四楓院夜一',en:'Yoruichi Shihoin'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'自由な速さの神 (ENTP)',en:'Free God of Speed (ENTP)'},profile:{E:3,N:4,T:3,P:4},desc:{ja:'元護廷十三隊二番隊隊長で神速と呼ばれる瞬歩の使い手。茶目っ気があり自由奔放な性格。',en:'Former Captain of Squad 2, master of Flash Step called the God of Flash. Playful and free-spirited personality.'},traits:{ja:['速さ','自由','猫','瞬歩','茶目っ気'],en:['Speed','Freedom','Cat','Flash Step','Playful']},radar:[65,85,80,70,82,72]},
  {id:'urahara_bl',icon:'🎩',name:{ja:'浦原喜助',en:'Kisuke Urahara'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'隠れた天才商人 (ENTP)',en:'Hidden Genius Merchant (ENTP)'},profile:{E:3,N:4,T:4,P:4},desc:{ja:'うらはら商店の店主で元護廷十三隊十二番隊隊長。飄々とした態度の裏に卓越した頭脳と実力を持つ。',en:'Owner of Urahara Shop and former Captain of Squad 12. Behind his easygoing attitude lies exceptional intellect and ability.'},traits:{ja:['天才','商人','飄々','策略','道化'],en:['Genius','Merchant','Easygoing','Strategy','Jester']},radar:[55,98,92,50,95,80]},
  {id:'grimmjow_bl',icon:'🐱',name:{ja:'グリムジョー',en:'Grimmjow Jaegerjaquez'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'好戦的な破面 (ESTP)',en:'Aggressive Arrancar (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'アランカルで第六十刃。ひたすら戦いを求め、一護を好敵手と認める好戦的な性格。',en:'Arrancar and 6th Espada. Relentlessly seeks battle and recognizes Ichigo as a worthy rival.'},traits:{ja:['戦闘','ライバル','破面','本能','誇り'],en:['Battle','Rival','Arrancar','Instinct','Pride']},radar:[85,45,38,75,45,60]},
  {id:'ulquiorra_bl',icon:'🦇',name:{ja:'ウルキオラ・シファー',en:'Ulquiorra Cifer'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'虚無の破面 (INTJ)',en:'Nihilistic Arrancar (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'第四十刃で「虚無」を特性とするアランカル。冷徹で感情を持たないと思っていたが、最後に心を知る。',en:'4th Espada whose attribute is "Emptiness." Cold and emotionless, but learns what a heart is at the end.'},traits:{ja:['虚無','冷徹','心','破面','変化'],en:['Emptiness','Cold','Heart','Arrancar','Change']},radar:[45,88,88,40,90,85]},
  {id:'toshiro_bl',icon:'❄️',name:{ja:'日番谷冬獅郎',en:'Toshiro Hitsugaya'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'天才冷静隊長 (INTJ)',en:'Genius Cool Captain (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'護廷十三隊十番隊隊長で最年少の天才。氷雪系の卍解を持ち、幼い外見に反して真剣な性格。',en:'Youngest genius captain of Squad 10. Possesses ice-type Bankai; serious personality contrary to his young appearance.'},traits:{ja:['氷','天才','若さ','真剣','誇り'],en:['Ice','Genius','Youth','Serious','Pride']},radar:[55,90,88,52,85,90]},
  {id:'aizen_bl',icon:'👓',name:{ja:'藍染惣右介',en:'Sosuke Aizen'},series:{ja:'BLEACH',en:'BLEACH'},type:{ja:'究極の謀略家 (INTJ)',en:'Ultimate Strategist (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'元護廷十三隊五番隊隊長で最大の敵。完璧な幻術と圧倒的な知性で全てを自分の手の平の上で動かす。',en:'Former Captain of Squad 5 and greatest enemy. Moves everything on his palm with perfect illusions and overwhelming intellect.'},traits:{ja:['謀略','幻術','圧倒的','完璧','反逆'],en:['Strategy','Illusion','Overwhelming','Perfect','Rebellion']},radar:[48,99,98,38,99,95]},
  // ── ワンピース追加 ──
  {id:'ace_op',icon:'🔥',name:{ja:'ポートガス・D・エース',en:'Portgas D. Ace'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'炎の義兄 (ESFP)',en:'Flaming Older Brother (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'白ひげ海賊団二番隊隊長で炎炎実の能力者。ルフィの義兄として愛され、その死が世界を揺るがした。',en:'Commander of Whitebeard Pirates 2nd Division and Flame-Flame Fruit user. Beloved as Luffy\'s older brother, his death shook the world.'},traits:{ja:['炎','義兄弟','白ひげ','自由','悲劇'],en:['Flame','Brotherhood','Whitebeard','Freedom','Tragedy']},radar:[85,65,60,90,62,75]},
  {id:'shanks_op',icon:'🔴',name:{ja:'赤髪のシャンクス',en:'Red-Haired Shanks'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'最強の海賊 (ENFJ)',en:'Greatest Pirate (ENFJ)'},profile:{E:3,F:3,N:4,J:3},desc:{ja:'四皇の一人で赤髪海賊団船長。ルフィにゴムゴムの実と麦わら帽子を渡した伝説の海賊。',en:'One of the Four Emperors and captain of the Red Hair Pirates. The legendary pirate who gave Luffy the Gum-Gum Fruit and straw hat.'},traits:{ja:['四皇','伝説','友情','カリスマ','約束'],en:['Emperor','Legend','Friendship','Charisma','Promise']},radar:[75,88,90,80,85,85]},
  {id:'law_op',icon:'⚔️',name:{ja:'トラファルガー・ロー',en:'Trafalgar Law'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'冷静な外科医 (INTJ)',en:'Cool Surgeon (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'超新星の一人でハートの海賊団船長。オペオペの実の能力者で冷静な頭脳戦を得意とする。',en:'One of the Supernovas and captain of Heart Pirates. Ope-Ope Fruit user who excels at cool-headed strategic battles.'},traits:{ja:['外科医','冷静','策略','超新星','心臓'],en:['Surgeon','Cool','Strategy','Supernova','Heart']},radar:[55,90,88,52,85,82]},
  {id:'boa_op',icon:'🐍',name:{ja:'ボア・ハンコック',en:'Boa Hancock'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'蛇姫の女王 (ENFJ)',en:'Snake Princess Queen (ENFJ)'},profile:{E:3,F:3,N:3,J:4},desc:{ja:'女ヶ島の女王で七武海の一人。絶世の美女で石化の能力を持ち、ルフィに本気で恋している。',en:'Queen of Amazon Lily and one of the Seven Warlords. A peerless beauty with stone power who is genuinely in love with Luffy.'},traits:{ja:['美貌','プライド','石化','女王','恋'],en:['Beauty','Pride','Petrification','Queen','Love']},radar:[72,82,75,72,80,80]},
  {id:'sabo_op',icon:'🎩',name:{ja:'サボ',en:'Sabo'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'革命軍の兄 (ENFJ)',en:'Revolutionary Brother (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'革命軍参謀総長でルフィの義兄。エースの死後にメラメラの実を継承し、革命の精神を胸に戦う。',en:'Revolutionary Army Chief of Staff and Luffy\'s sworn brother. Inherited Ace\'s Flame-Flame Fruit, fighting with revolutionary spirit.'},traits:{ja:['革命','義兄弟','炎','記憶','誓い'],en:['Revolution','Brotherhood','Flame','Memory','Oath']},radar:[80,80,78,82,80,82]},
  {id:'doflamingo_op',icon:'🦩',name:{ja:'ドフラミンゴ',en:'Donquixote Doflamingo'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'天竜人の野望 (ENTJ)',en:'Celestial Dragon Ambition (ENTJ)'},profile:{E:4,T:4,N:3,J:4},desc:{ja:'ドレスローザ国王で元七武海。糸糸の実の能力者で支配欲が強く、カリスマ的だが残酷な悪役。',en:'King of Dressrosa and former Warlord. String-String Fruit user with strong desire for domination; charismatic but cruel villain.'},traits:{ja:['糸','支配','天竜人','カリスマ','残酷'],en:['String','Domination','Celestial Dragon','Charisma','Cruel']},radar:[72,82,80,48,88,85]},
  {id:'vivi_op',icon:'🦆',name:{ja:'ネフェルタリ・ビビ',en:'Nefeltari Vivi'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'祖国を守る王女 (INFJ)',en:'Princess for Homeland (INFJ)'},profile:{I:3,N:3,F:4,J:3},desc:{ja:'アラバスタ王国の王女で元麦わらの一味準メンバー。祖国のために命を懸けて戦った心優しい王女。',en:'Princess of Alabasta Kingdom and former honorary Straw Hat. Kind princess who risked her life for her homeland.'},traits:{ja:['王女','祖国','友情','優しさ','決意'],en:['Princess','Homeland','Friendship','Kindness','Determination']},radar:[60,70,72,85,70,78]},
  {id:'yamato_op',icon:'🔱',name:{ja:'ヤマト',en:'Yamato'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'自由を求めるカイドウの子 (ENFJ)',en:'Freedom-Seeking Child of Kaido (ENFJ)'},profile:{E:4,F:3,N:4,J:3},desc:{ja:'カイドウの子で光月おでんに憧れ自らを「おでん」と称する。自由を愛し、ワノ国解放のために戦う。',en:'Kaido\'s child who admires Kozuki Oden and calls themselves "Oden." Loves freedom, fighting to liberate Wano.'},traits:{ja:['自由','おでん','神の実','反逆','冒険'],en:['Freedom','Oden','Devil Fruit','Rebellion','Adventure']},radar:[82,68,65,80,72,72]},
  // ── ドラゴンボール追加 ──
  {id:'broly_db',icon:'💚',name:{ja:'ブロリー',en:'Broly'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'伝説の超サイヤ人 (ISTP)',en:'Legendary Super Saiyan (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'伝説の超サイヤ人と呼ばれる圧倒的な戦闘力を持つサイヤ人。普段は温厚だが戦闘本能が暴走することも。',en:'A Saiyan with overwhelming power called the Legendary Super Saiyan. Usually gentle but his battle instincts can run wild.'},traits:{ja:['伝説','超サイヤ人','圧倒的','純粋','怒り'],en:['Legendary','Super Saiyan','Overwhelming','Pure','Rage']},radar:[90,45,40,70,38,55]},
  {id:'krillin_db',icon:'😑',name:{ja:'クリリン',en:'Krillin'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'忠実な親友 (ISFJ)',en:'Loyal Best Friend (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'悟空の親友で人間最強の戦士。何度も死を経験しながらも仲間のために戦い続けるド根性の持ち主。',en:'Goku\'s best friend and Earth\'s strongest human. Despite dying multiple times, continues fighting for friends with incredible tenacity.'},traits:{ja:['親友','根性','人間','忠実','愛妻家'],en:['Best Friend','Tenacity','Human','Loyal','Devoted Husband']},radar:[60,68,62,78,60,72]},
  {id:'android18_db',icon:'💛',name:{ja:'人造人間18号',en:'Android 18'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'クールな元人造人間 (ISTJ)',en:'Cool Ex-Android (ISTJ)'},profile:{I:3,S:3,T:3,J:3},desc:{ja:'元人造人間でクリリンの妻。クールで現実的だが、家族への深い愛情を持つ。戦闘力も高い。',en:'Former android and Krillin\'s wife. Cool and pragmatic, but has deep love for family. Also has high combat power.'},traits:{ja:['クール','現実的','家族愛','強さ','元人造人間'],en:['Cool','Pragmatic','Family Love','Strength','Ex-Android']},radar:[72,75,72,68,72,78]},
  {id:'cell_db',icon:'🟢',name:{ja:'セル',en:'Cell'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'完璧主義の人造人間 (ENTJ)',en:'Perfectionist Android (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'Z戦士たちの遺伝子を組み合わせて作られた人造人間。「完全体」を追求し、圧倒的な強さを持つ。',en:'An android created by combining Z Warriors\' genes. Pursues "Perfect Form" with overwhelming power.'},traits:{ja:['完璧','人造人間','吸収','強さ','遺伝子'],en:['Perfect','Android','Absorption','Strength','Genes']},radar:[80,75,72,42,80,82]},
  {id:'majin_buu_db',icon:'🩷',name:{ja:'魔人ブウ',en:'Majin Buu'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'無邪気な魔人 (ESFP)',en:'Innocent Demon (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'魔人ブウは無邪気で子供のような性格だが、邪悪ブウに変身すると最強の敵となる。菓子を愛する。',en:'Majin Buu has an innocent, childlike personality but transforms into Evil Buu to become the strongest enemy. Loves sweets.'},traits:{ja:['無邪気','菓子','変身','魔人','強さ'],en:['Innocent','Sweets','Transform','Demon','Strength']},radar:[78,32,28,70,30,52]},
  {id:'piccolo_db',icon:'💚',name:{ja:'ピッコロ',en:'Piccolo'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'厳格な師匠型ナメック星人 (INTJ)',en:'Strict Mentor Namekian (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'ナメック星人でかつての悟空の敵だったが今は仲間。厳しくも温かく悟飯を育てた師匠的存在。',en:'A Namekian who was once Goku\'s enemy but is now an ally. Stern but warm, a mentor figure who raised Gohan.'},traits:{ja:['ナメック星人','師匠','厳格','成長','仲間'],en:['Namekian','Mentor','Stern','Growth','Comrade']},radar:[65,85,88,60,82,85]},
  // ── HUNTER×HUNTER追加 ──
  {id:'hisoka_hxh',icon:'🃏',name:{ja:'ヒソカ',en:'Hisoka'},series:{ja:'HUNTER×HUNTER',en:'HUNTER×HUNTER'},type:{ja:'狩りを楽しむ道化師 (ENTP)',en:'Playful Hunter Jester (ENTP)'},profile:{E:3,N:4,T:4,P:4},desc:{ja:'幻影旅団の元メンバーで道化師のような外見。強い者を求め、ゴンとキルアの成長を楽しみに待っている。',en:'Former Phantom Troupe member with jester-like appearance. Seeks the strong, eagerly awaiting Gon and Killua\'s growth.'},traits:{ja:['道化師','強さへの渇望','マジック','予測不能','楽しみ'],en:['Jester','Desire for Strength','Magic','Unpredictable','Enjoyment']},radar:[72,80,75,42,85,72]},
  {id:'chrollo_hxh',icon:'📖',name:{ja:'クロロ・ルシルフル',en:'Chrollo Lucilfer'},series:{ja:'HUNTER×HUNTER',en:'HUNTER×HUNTER'},type:{ja:'幻影旅団団長 (INTJ)',en:'Phantom Troupe Leader (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'幻影旅団の団長で盗賊の王。他者の念能力を盗む能力を持ち、カリスマと知性で集団を率いる。',en:'Leader of the Phantom Troupe and king of thieves. Has ability to steal others\' Nen, leading the group with charisma and intellect.'},traits:{ja:['盗賊','団長','知性','カリスマ','盗む'],en:['Thief','Leader','Intellect','Charisma','Steal']},radar:[52,95,92,48,90,88]},
  {id:'meruem_hxh',icon:'👑',name:{ja:'メルエム',en:'Meruem'},series:{ja:'HUNTER×HUNTER',en:'HUNTER×HUNTER'},type:{ja:'蟻の王 (INTJ)',en:'King of Ants (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'キメラアントの王で圧倒的な強さを持つ。軍義を通じてコムギと出会い、人間性に目覚めていく。',en:'King of Chimera Ants with overwhelming power. Meets Komugi through Gungi and awakens to humanity.'},traits:{ja:['王','最強','知性','変化','コムギ'],en:['King','Strongest','Intellect','Change','Komugi']},radar:[52,99,98,45,98,95]},
  {id:'illumi_hxh',icon:'🪡',name:{ja:'イルミ・ゾルディック',en:'Illumi Zoldyck'},series:{ja:'HUNTER×HUNTER',en:'HUNTER×HUNTER'},type:{ja:'冷徹な操り師 (INTJ)',en:'Cold-Blooded Puppeteer (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'ゾルディック家長男でキルアの兄。他者を操る念能力を持ち、キルアを恐怖で支配しようとする。',en:'Eldest son of the Zoldyck family and Killua\'s brother. Has Nen ability to control others, trying to dominate Killua through fear.'},traits:{ja:['操作','冷徹','兄','針','束縛'],en:['Control','Cold','Brother','Needles','Binding']},radar:[42,88,90,32,88,88]},
  {id:'biscuit_hxh',icon:'💎',name:{ja:'ビスケット・クルーガー',en:'Biscuit Krueger'},series:{ja:'HUNTER×HUNTER',en:'HUNTER×HUNTER'},type:{ja:'隠れた実力者 (INFJ)',en:'Hidden Powerhouse (INFJ)'},profile:{I:3,N:3,F:3,J:3},desc:{ja:'プロのハンターで少女の姿をした実力者。ゴンとキルアを鍛え、その成長を見守る師匠的存在。',en:'A professional Hunter who appears as a young girl but is a true powerhouse. Trains Gon and Killua, watching over their growth as a mentor.'},traits:{ja:['変身','師匠','実力','宝石','成長サポート'],en:['Transform','Mentor','Power','Gems','Growth Support']},radar:[58,85,82,65,82,80]},
  // ── 呪術廻戦追加 ──
  {id:'nanami_jjk',icon:'👔',name:{ja:'七海建人',en:'Kento Nanami'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'誠実なサラリーマン術師 (ISTJ)',en:'Sincere Salaryman Sorcerer (ISTJ)'},profile:{I:4,S:3,T:4,J:4},desc:{ja:'元サラリーマンで呪術師に戻った二級術師。「残業は嫌い」が口癖で、誠実に仕事をこなすプロ。',en:'A former salaryman turned jujutsu sorcerer. "I hate overtime" is his motto; a professional who handles work sincerely.'},traits:{ja:['誠実','プロ','サラリーマン','剣','限定解除'],en:['Sincere','Professional','Salaryman','Blade','Restriction Release']},radar:[62,85,88,68,82,90]},
  {id:'nobara_jjk',icon:'🔨',name:{ja:'釘崎野薔薇',en:'Nobara Kugisaki'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'強気な呪術師 (ESTP)',en:'Bold Jujutsu Sorcerer (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'東京都立呪術高専の一年生。釘と藁人形を使う「芻霊呪法」の使い手で、己の美しさと強さに誇りを持つ。',en:'First-year at Tokyo Jujutsu High. Master of "Straw Doll Technique" using nails and straw dolls, proud of her beauty and strength.'},traits:{ja:['強気','美しさ','釘','誇り','勇敢'],en:['Bold','Beauty','Nails','Pride','Brave']},radar:[80,62,58,72,60,72]},
  {id:'sukuna_jjk',icon:'👹',name:{ja:'両面宿儺',en:'Ryomen Sukuna'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'呪いの王 (INTJ)',en:'King of Curses (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'史上最強の呪詛師で「呪いの王」。虎杖の体内に宿り、時折現れては圧倒的な力を見せつける。',en:'The most powerful cursed sorcerer in history, the "King of Curses." Resides in Yuji\'s body, occasionally showing overwhelming power.'},traits:{ja:['最強','呪い','王','残忍','傲慢'],en:['Strongest','Curse','King','Brutal','Arrogant']},radar:[48,99,98,28,99,95]},
  {id:'gojo_jjk',icon:'🔵',name:{ja:'五条悟',en:'Satoru Gojo'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'最強の呪術師 (ENTP)',en:'Strongest Jujutsu Sorcerer (ENTP)'},profile:{E:4,N:4,T:4,P:3},desc:{ja:'現代最強の呪術師で呪術高専の教師。無限と六眼を操り、規格外の実力を誇るが教育への情熱も持つ。',en:'The strongest jujutsu sorcerer of the modern era and teacher at Jujutsu High. Controls Infinity and Six Eyes, passionately dedicated to education.'},traits:{ja:['最強','無限','六眼','教師','遊び'],en:['Strongest','Infinity','Six Eyes','Teacher','Playful']},radar:[72,99,95,62,98,88]},
  // ── 僕のヒーローアカデミア追加 ──
  {id:'hawks_mha',icon:'🦅',name:{ja:'ホークス',en:'Hawks'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'最速のプロヒーロー (ENTP)',en:'Fastest Pro Hero (ENTP)'},profile:{E:4,N:3,T:3,P:4},desc:{ja:'プロヒーローランク2位の翼を持つヒーロー。飄々とした態度だが、内に深い苦悩を隠した複雑な人物。',en:'No. 2 Pro Hero with wings. Easygoing attitude but hides deep anguish within; a complex individual.'},traits:{ja:['翼','速さ','複雑','スパイ','プロ'],en:['Wings','Speed','Complex','Spy','Pro']},radar:[78,75,72,65,80,72]},
  {id:'toga_mha',icon:'💉',name:{ja:'トガヒミコ',en:'Himiko Toga'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'血を愛する変身者 (ESFP)',en:'Blood-Loving Transformer (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'敵連合のメンバーで血を吸って他人に変身できる個性を持つ。異常なほど愛情深く、愛する者の血を求める。',en:'Member of the League of Villains with a Quirk to transform into others by drinking their blood. Abnormally affectionate, seeks blood of those she loves.'},traits:{ja:['血液','変身','愛','敵','狂気'],en:['Blood','Transform','Love','Villain','Madness']},radar:[75,42,38,80,45,55]},
  {id:'shigaraki_mha',icon:'🤚',name:{ja:'死柄木弔',en:'Tomura Shigaraki'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'崩壊する憎しみ (INTJ)',en:'Crumbling Hatred (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'敵連合のリーダーでオール・フォー・ワンの後継者。全てを崩壊させる個性を持ち、社会への憎しみを燃やす。',en:'Leader of the League of Villains and All For One\'s successor. Has a Quirk to decay everything; burns with hatred toward society.'},traits:{ja:['崩壊','憎しみ','破壊','リーダー','成長'],en:['Decay','Hatred','Destruction','Leader','Growth']},radar:[58,75,72,42,80,78]},
  {id:'mirio_mha',icon:'☀️',name:{ja:'百人一首・勝己',en:'Mirio Togata'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'無敵の太陽 (ENFJ)',en:'Invincible Sun (ENFJ)'},profile:{E:4,F:4,N:3,J:3},desc:{ja:'ビッグ3の一人でルミリオンとして活躍。ルミリオンの力を失っても諦めず笑顔で立ち向かい続けた。',en:'One of the Big 3, active as Lemillion. Even after losing his power, he continued to face challenges with a smile without giving up.'},traits:{ja:['笑顔','無敵','諦めない','太陽','ヒーロー'],en:['Smile','Invincible','Never Give Up','Sun','Hero']},radar:[85,72,70,92,72,82]},
  {id:'dabi_mha',icon:'🔥',name:{ja:'荼毘',en:'Dabi'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'冷える青炎 (INTJ)',en:'Cold Blue Flame (INTJ)'},profile:{I:4,T:4,N:3,J:3},desc:{ja:'敵連合のメンバーで青い炎を操る。エンデヴァーへの怒りを燃やす謎の人物で、真の正体は衝撃的。',en:'Member of the League of Villains who controls blue flames. A mysterious figure burning with anger toward Endeavor; his true identity is shocking.'},traits:{ja:['青炎','怒り','秘密','冷酷','家族'],en:['Blue Flame','Anger','Secret','Cold','Family']},radar:[58,68,65,42,72,72]},
  // ── 鋼の錬金術師追加 ──
  {id:'roy_fma',icon:'🔥',name:{ja:'ロイ・マスタング',en:'Roy Mustang'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'炎の錬金術師 (ENTJ)',en:'Flame Alchemist (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'炎の錬金術師の国家錬金術師で、最終的に国家首相を目指す野心家。部下への忠義と国への愛国心を持つ。',en:'A State Alchemist known as the Flame Alchemist, ambitiously aiming to become Führer. Loyal to subordinates and patriotic.'},traits:{ja:['炎','野心','リーダー','忠義','国家'],en:['Flame','Ambition','Leader','Loyalty','State']},radar:[68,88,85,65,88,90]},
  {id:'riza_fma',icon:'🔫',name:{ja:'リザ・ホークアイ',en:'Riza Hawkeye'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'忠実な狙撃手 (ISTJ)',en:'Loyal Sharpshooter (ISTJ)'},profile:{I:4,S:4,T:3,J:4},desc:{ja:'マスタング大佐の副官で優れた射撃の腕を持つ。常に冷静で誠実、大佐への忠誠心は絶対的。',en:'Colonel Mustang\'s adjutant with excellent marksmanship. Always calm and sincere, with absolute loyalty to the Colonel.'},traits:{ja:['狙撃','忠誠','冷静','誠実','保護'],en:['Sharpshooting','Loyalty','Calm','Sincere','Protection']},radar:[55,88,88,60,85,92]},
  {id:'winry_fma',icon:'🔧',name:{ja:'ウィンリィ・ロックベル',en:'Winry Rockbell'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'機械鎧職人 (ESFP)',en:'Automail Engineer (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'エドとアルの幼なじみで優れた機械鎧技師。明るく感情豊かで、エドへの複雑な感情を持つ。',en:'Ed and Al\'s childhood friend and an excellent automail engineer. Bright and emotionally rich, with complex feelings for Ed.'},traits:{ja:['機械鎧','幼なじみ','情熱','技術','愛'],en:['Automail','Childhood Friend','Passion','Skill','Love']},radar:[72,65,58,88,62,72]},
  {id:'scar_fma',icon:'✝️',name:{ja:'スカー',en:'Scar'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'復讐の旅人 (ISTP)',en:'Traveler of Vengeance (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'アメストリス軍への復讐を誓ったイシュヴァール人。国家錬金術師を狩り、最後には和解の道を模索する。',en:'An Ishvalan who swore revenge against the Amestrian military. Hunts State Alchemists, but eventually seeks reconciliation.'},traits:{ja:['復讐','イシュヴァール','信仰','変化','和解'],en:['Vengeance','Ishvalan','Faith','Change','Reconciliation']},radar:[68,65,62,55,65,72]},
  {id:'armstrong_fma',icon:'💪',name:{ja:'アレックス・ルイ・アームストロング',en:'Alex Louis Armstrong'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'剛腕の豪快将軍 (ESFP)',en:'Mighty Jovial General (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'アームストロング一族に伝わる錬金術を誇る大佐。感涙もろく豪快だが、心優しい。',en:'Major who proudly uses alchemy passed down through the Armstrong family. Easily moved to tears and boisterous, but kindhearted.'},traits:{ja:['筋肉','伝統','錬金術','涙','一族'],en:['Muscles','Tradition','Alchemy','Tears','Clan']},radar:[80,58,52,88,55,68]},
  // ── ジョジョの奇妙な冒険追加 ──
  {id:'jotaro_jojo',icon:'🌊',name:{ja:'空条承太郎',en:'Jotaro Kujo'},series:{ja:'ジョジョの奇妙な冒険',en:'JoJo\'s Bizarre Adventure'},type:{ja:'クールなスタンド使い (ISTP)',en:'Cool Stand User (ISTP)'},profile:{I:4,S:4,T:4,P:3},desc:{ja:'第3部主人公でスタープラチナを使うスタンド使い。無口で不良だが、家族への愛情は深く正義感も強い。',en:'Protagonist of Part 3 and Stand user of Star Platinum. Quiet and delinquent, but has deep love for family and a strong sense of justice.'},traits:{ja:['スタープラチナ','無口','正義','家族','やれやれ'],en:['Star Platinum','Quiet','Justice','Family','Good Grief']},radar:[72,85,88,60,82,85]},
  {id:'dio_jojo',icon:'🧛',name:{ja:'DIO',en:'DIO'},series:{ja:'ジョジョの奇妙な冒険',en:'JoJo\'s Bizarre Adventure'},type:{ja:'究極の吸血鬼 (ENTJ)',en:'Ultimate Vampire (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'ジョナサン・ジョースターの宿敵で吸血鬼。「無駄無駄無駄！」で知られる時間停止スタンドを持つ最強の敵。',en:'Jonathan Joestar\'s nemesis and a vampire. The supreme enemy with a time-stopping Stand, known for "Muda Muda Muda!"'},traits:{ja:['吸血鬼','時間停止','カリスマ','支配','最強'],en:['Vampire','Time Stop','Charisma','Domination','Supreme']},radar:[52,98,95,35,98,92]},
  {id:'jonathan_jojo',icon:'🤛',name:{ja:'ジョナサン・ジョースター',en:'Jonathan Joestar'},series:{ja:'ジョジョの奇妙な冒険',en:'JoJo\'s Bizarre Adventure'},type:{ja:'真の紳士 (ISFJ)',en:'True Gentleman (ISFJ)'},profile:{I:3,S:3,F:4,J:4},desc:{ja:'第1部主人公でジョースター家の始祖。純粋で誠実、正義感あふれる英国紳士として全ての困難に立ち向かう。',en:'Protagonist of Part 1 and ancestor of the Joestar family. Pure and sincere, a British gentleman full of justice who faces all hardships.'},traits:{ja:['紳士','正義','純粋','勇気','誠実'],en:['Gentleman','Justice','Pure','Courage','Sincere']},radar:[72,70,72,90,68,85]},
  {id:'yoshikage_jojo',icon:'🤚',name:{ja:'吉良吉影',en:'Yoshikage Kira'},series:{ja:'ジョジョの奇妙な冒険',en:'JoJo\'s Bizarre Adventure'},type:{ja:'平穏を求める殺人鬼 (INTJ)',en:'Peace-Seeking Murderer (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'第4部の敵で「平穏な生活」を求める殺人鬼。キラークイーンで爆破する能力を持つ。',en:'Antagonist of Part 4, a murderer who seeks "a quiet life." Has the ability to detonate things with Killer Queen.'},traits:{ja:['平穏','殺人','爆破','日常','隠蔽'],en:['Quiet Life','Murder','Explosion','Everyday','Concealment']},radar:[38,82,85,25,85,88]},
  // ── ハイキュー!!追加 ──
  {id:'oikawa_hq',icon:'🏐',name:{ja:'及川徹',en:'Toru Oikawa'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'グランドキング (ENTP)',en:'Grand King (ENTP)'},profile:{E:4,N:3,T:3,P:3},desc:{ja:'青葉城西高校のセッターでカリスマ的なキャプテン。努力家で研究熱心、表の自信の裏に努力を惜しまない。',en:'Setter and charismatic captain of Aoba Johsai High. Hard worker and keen researcher; relentless effort hides behind confident appearance.'},traits:{ja:['カリスマ','努力','セッター','ライバル','キャプテン'],en:['Charisma','Effort','Setter','Rival','Captain']},radar:[82,78,72,72,78,80]},
  {id:'bokuto_hq',icon:'🦅',name:{ja:'木兎光太郎',en:'Kotaro Bokuto'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'情緒不安定なエース (ESFP)',en:'Emotionally Unstable Ace (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'梟谷学園のエースでトップ5の選手。「ヘイヘイヘイ！」が口癖で、乗り気の時は圧倒的な実力を見せる。',en:'Ace of Fukurodani Academy and Top 5 player. "Hey hey hey!" is his catchphrase; when motivated, shows overwhelming ability.'},traits:{ja:['エース','感情的','ヘイヘイヘイ','強さ','チームワーク'],en:['Ace','Emotional','Hey Hey Hey','Strength','Teamwork']},radar:[88,52,48,85,55,65]},
  {id:'ushijima_hq',icon:'🐉',name:{ja:'牛島若利',en:'Wakatoshi Ushijima'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'最強エース (INTJ)',en:'Supreme Ace (INTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'白鳥沢学園のエースで全国トップクラス。絶対的な実力と直接的な言動、感情表現が苦手な最強のプレイヤー。',en:'Ace of Shiratorizawa Academy, nationally top-class. Absolute ability, direct speech, and difficulty expressing emotions; the supreme player.'},traits:{ja:['最強','直球','エース','左利き','実力'],en:['Supreme','Direct','Ace','Left-handed','Skill']},radar:[92,70,68,42,72,88]},
  {id:'akaashi_hq',icon:'📝',name:{ja:'赤葦京治',en:'Keiji Akaashi'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'冷静な分析型 (INTJ)',en:'Cool Analyst (INTJ)'},profile:{I:3,N:4,T:4,J:3},desc:{ja:'梟谷学園のセッターで木兎のコンビ。木兎の感情を読み解き、チームをサポートする冷静な知性派。',en:'Setter of Fukurodani Academy and Bokuto\'s partner. Calm intellectual who reads Bokuto\'s emotions and supports the team.'},traits:{ja:['分析','冷静','サポート','知性','セッター'],en:['Analysis','Calm','Support','Intelligence','Setter']},radar:[55,88,88,60,85,82]},
  // ── 黒子のバスケ追加 ──
  {id:'aomine_knb',icon:'🏀',name:{ja:'青峰大輝',en:'Daiki Aomine'},series:{ja:'黒子のバスケ',en:'Kuroko\'s Basketball'},type:{ja:'天才の孤独 (ISTP)',en:'Genius\' Solitude (ISTP)'},profile:{I:4,S:4,T:4,P:3},desc:{ja:'キセキの世代の元センターで最強のプレイヤー。無敗の苦悩から「俺に勝てるのは俺だけだ」と言いきった天才。',en:'Former center of Generation of Miracles and the strongest player. Genius who declared "The only one who can beat me is me" from the anguish of invincibility.'},traits:{ja:['天才','孤独','無敗','バスケ','変化'],en:['Genius','Solitude','Undefeated','Basketball','Change']},radar:[95,62,58,42,60,72]},
  {id:'kise_knb',icon:'✨',name:{ja:'黄瀬涼太',en:'Ryota Kise'},series:{ja:'黒子のバスケ',en:'Kuroko\'s Basketball'},type:{ja:'コピーの天才 (ESFP)',en:'Genius Copier (ESFP)'},profile:{E:4,S:4,F:3,P:3},desc:{ja:'キセキの世代の一人で他者の技をコピーする「コピー」能力を持つ。モデルも兼業する明るいバスケプレイヤー。',en:'One of the Generation of Miracles with "Copy" ability to replicate others\' techniques. A bright basketball player who also works as a model.'},traits:{ja:['コピー','明るさ','モデル','成長','リスペクト'],en:['Copy','Brightness','Model','Growth','Respect']},radar:[85,68,62,80,65,70]},
  {id:'midorima_knb',icon:'🍀',name:{ja:'緑間真太郎',en:'Shintaro Midorima'},series:{ja:'黒子のバスケ',en:'Kuroko\'s Basketball'},type:{ja:'完璧主義のシューター (ISTJ)',en:'Perfectionist Shooter (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'キセキの世代のシューターで100%シュートを決める。占いを信じるルーティン主義者で、誠実な厳格さを持つ。',en:'Shooter of Generation of Miracles who scores 100% shots. A routine-oriented believer in horoscopes with sincere strictness.'},traits:{ja:['完璧','シューター','占い','ルーティン','誠実'],en:['Perfect','Shooter','Horoscope','Routine','Sincere']},radar:[88,75,72,45,78,90]},
  {id:'akashi_knb',icon:'♟️',name:{ja:'赤司征十郎',en:'Seijuro Akashi'},series:{ja:'黒子のバスケ',en:'Kuroko\'s Basketball'},type:{ja:'絶対の皇帝 (INTJ)',en:'Absolute Emperor (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'キセキの世代のキャプテンで帝光中の元主将。「余の命令は絶対だ」と言うほどの絶対的な自信と実力を持つ。',en:'Captain of Generation of Miracles and former captain of Teikou. Has absolute confidence and ability, declaring "My orders are absolute."'},traits:{ja:['皇帝','絶対','カリスマ','知性','二重人格'],en:['Emperor','Absolute','Charisma','Intelligence','Dual Personality']},radar:[55,95,92,48,95,95]},
  // ── NARUTO追加 ──
  {id:'gaara_naruto',icon:'🏜️',name:{ja:'我愛羅',en:'Gaara'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'砂の守護者 (INTJ)',en:'Sand Guardian (INTJ)'},profile:{I:4,T:3,N:3,J:3},desc:{ja:'砂隠れの里の五代目風影。孤独な過去から暗黒の道を歩んだが、ナルトとの出会いで変わった。',en:'Fifth Kazekage of the Hidden Sand. Walked the path of darkness from a lonely past, but was changed by meeting Naruto.'},traits:{ja:['砂','孤独','変化','風影','守護'],en:['Sand','Solitude','Change','Kazekage','Guardian']},radar:[62,80,78,52,78,82]},
  {id:'itachi_naruto',icon:'🌀',name:{ja:'うちはイタチ',en:'Itachi Uchiha'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'真の愛の天才 (INFJ)',en:'Genius of True Love (INFJ)'},profile:{I:4,N:4,F:3,J:4},desc:{ja:'うちは一族を滅ぼした天才忍者だが、真実はサスケと里を守るための苦渋の選択だった。',en:'A genius ninja who wiped out the Uchiha clan, but the truth was an agonizing choice to protect Sasuke and the village.'},traits:{ja:['天才','犠牲','幻術','愛','秘密'],en:['Genius','Sacrifice','Genjutsu','Love','Secret']},radar:[52,97,95,60,95,92]},
  {id:'minato_naruto',icon:'⚡',name:{ja:'波風ミナト',en:'Minato Namikaze'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'四代目火影 (ENFJ)',en:'Fourth Hokage (ENFJ)'},profile:{E:3,N:4,F:4,J:3},desc:{ja:'四代目火影で木の葉最速の忍者。ナルトの父でナルトをイタチのために命を懸けた伝説の忍。',en:'Fourth Hokage and the fastest ninja in the Leaf Village. Naruto\'s father, a legendary ninja who risked his life to seal the Nine-Tails.'},traits:{ja:['四代目','最速','飛雷神','父親','伝説'],en:['Fourth','Fastest','Flying Thunder God','Father','Legend']},radar:[82,90,88,82,88,85]},
  {id:'jiraiya_naruto',icon:'🐸',name:{ja:'自来也',en:'Jiraiya'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'三忍の一人 (ENFP)',en:'One of the Sannin (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'三忍の一人でナルトの師匠。エロい変態忍者の外見の裏に情報収集と弟子への愛情を持つ。',en:'One of the Sannin and Naruto\'s mentor. Behind his perverted appearance hides intelligence gathering and deep affection for his student.'},traits:{ja:['三忍','師匠','変態','強さ','愛情'],en:['Sannin','Mentor','Pervy','Strength','Affection']},radar:[72,78,75,82,75,75]},
  {id:'lee_naruto',icon:'🥊',name:{ja:'ロック・リー',en:'Rock Lee'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'努力の天才 (ESFP)',en:'Genius of Effort (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'幻術も忍術も使えないが体術だけで頂点を目指す。「努力は才能を超える」を証明し続ける熱血忍者。',en:'Cannot use ninjutsu or genjutsu, but aims for the top with taijutsu alone. A passionate ninja who keeps proving "effort surpasses talent."'},traits:{ja:['努力','体術','熱血','根性','師匠'],en:['Effort','Taijutsu','Passionate','Grit','Mentor']},radar:[82,55,48,88,52,75]},
  {id:'pain_naruto',icon:'🔮',name:{ja:'ペイン',en:'Pain'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'神を自認する反逆者 (INTJ)',en:'Self-Declared God Rebel (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'長門の化身で「神」を自認する忍者。苦しみの中に平和を見出す哲学を持ち、ナルトに挑む。',en:'Nagato\'s avatar who declares himself a "god." Has a philosophy of finding peace through suffering, challenges Naruto.'},traits:{ja:['神','苦しみ','哲学','平和','力'],en:['God','Suffering','Philosophy','Peace','Power']},radar:[45,95,92,42,95,88]},
  // ── スパイスと狼 ──
  {id:'holo_sw',icon:'🐺',name:{ja:'ホロ',en:'Holo'},series:{ja:'狼と香辛料',en:'Spice and Wolf'},type:{ja:'賢狼の商人 (ENTP)',en:'Wise Wolf Merchant (ENTP)'},profile:{E:3,N:4,T:3,P:4},desc:{ja:'豊穣の神として祀られた狼の化身。ロレンスと共に旅し、知恵と経済的洞察で旅を彩る。',en:'An incarnation of a wolf worshipped as a harvest goddess. Travels with Lawrence, enriching the journey with wisdom and economic insight.'},traits:{ja:['狼','賢さ','商売','誇り','孤独'],en:['Wolf','Wisdom','Trade','Pride','Lonitude']},radar:[65,88,82,72,85,72]},
  {id:'lawrence_sw',icon:'🛒',name:{ja:'クラフト・ロレンス',en:'Kraft Lawrence'},series:{ja:'狼と香辛料',en:'Spice and Wolf'},type:{ja:'旅する行商人 (ISFJ)',en:'Traveling Merchant (ISFJ)'},profile:{I:3,S:3,T:3,J:3},desc:{ja:'各地を旅する行商人でホロと出会う。誠実で真面目、ホロとの関係で人間的に成長していく。',en:'A traveling merchant who meets Holo. Sincere and serious, grows as a person through his relationship with Holo.'},traits:{ja:['行商人','誠実','経済','旅','成長'],en:['Merchant','Sincere','Economics','Travel','Growth']},radar:[58,72,70,70,68,75]},
  // ── デュラララ!! ──
  {id:'izaya_drr',icon:'🔪',name:{ja:'折原臨也',en:'Izaya Orihara'},series:{ja:'デュラララ!!',en:'Durarara!!'},type:{ja:'人間観察者 (ENTP)',en:'Human Observer (ENTP)'},profile:{E:3,N:4,T:4,P:4},desc:{ja:'情報屋で人間を愛する観察者。自ら混乱を引き起こし、池袋の混沌を楽しむ謎の情報屋。',en:'An information broker who loves observing humans. Deliberately causes chaos, enjoying the turmoil of Ikebukuro as a mysterious broker.'},traits:{ja:['情報','混乱','観察','人間愛','謎'],en:['Information','Chaos','Observation','Love of Humans','Mystery']},radar:[52,90,85,45,90,78]},
  {id:'shizuo_drr',icon:'💪',name:{ja:'平和島静雄',en:'Shizuo Heiwajima'},series:{ja:'デュラララ!!',en:'Durarara!!'},type:{ja:'怒りの怪力男 (ISTP)',en:'Man of Rage and Strength (ISTP)'},profile:{I:3,S:4,T:3,P:3},desc:{ja:'池袋最強の男で超人的な怪力を持つ。怒りっぽいが根は優しく、臨也を憎む様子が印象的。',en:'The strongest man in Ikebukuro with superhuman strength. Quick to anger but kind-hearted; his hatred for Izaya is iconic.'},traits:{ja:['怪力','怒り','優しさ','池袋','強さ'],en:['Superhuman Strength','Anger','Kindness','Ikebukuro','Strength']},radar:[88,52,45,72,48,65]},
  // ── 黒執事 ──
  {id:'sebastian_bb',icon:'🃏',name:{ja:'セバスチャン・ミカエリス',en:'Sebastian Michaelis'},series:{ja:'黒執事',en:'Black Butler'},type:{ja:'悪魔の完璧執事 (INTJ)',en:'Perfect Demonic Butler (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'シエルの執事で悪魔。「私はあくまで執事ですから」と言いながら完璧にこなす万能執事。',en:'Ciel\'s butler and a demon. A perfect all-around butler who says "I am, after all, simply one hell of a butler."'},traits:{ja:['執事','悪魔','完璧','優雅','忠誠'],en:['Butler','Demon','Perfect','Elegant','Loyal']},radar:[55,98,95,48,95,98]},
  {id:'ciel_bb',icon:'👁️',name:{ja:'シエル・ファントムハイヴ',en:'Ciel Phantomhive'},series:{ja:'黒執事',en:'Black Butler'},type:{ja:'復讐の伯爵 (INTJ)',en:'Count of Revenge (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ファントムハイヴ家の当主で女王の番犬。家族の死の復讐のためにセバスチャンと契約した少年伯爵。',en:'Head of the Phantomhive family and Queen\'s guard dog. A young earl who made a contract with Sebastian for revenge over his family\'s death.'},traits:{ja:['復讐','契約','伯爵','誇り','孤独'],en:['Revenge','Contract','Earl','Pride','Solitude']},radar:[45,88,88,38,88,88]},
  // ── 寄生獣 ──
  {id:'shinichi_para',icon:'🧬',name:{ja:'泉新一',en:'Shinichi Izumi'},series:{ja:'寄生獣',en:'Parasyte'},type:{ja:'変化を生きる少年 (INFJ)',en:'Boy Living with Change (INFJ)'},profile:{I:3,N:4,T:3,J:3},desc:{ja:'右手にミギーが寄生した高校生。人間性の喪失と獲得を繰り返し、何が人間かを問い続ける存在。',en:'A high schooler with Migi parasitizing his right hand. Repeatedly loses and gains humanity, constantly questioning what it means to be human.'},traits:{ja:['寄生','変化','人間性','葛藤','成長'],en:['Parasite','Change','Humanity','Conflict','Growth']},radar:[55,80,78,62,78,72]},
  // ── ブラック・ラグーン ──
  {id:'revy_br',icon:'🔫',name:{ja:'レヴィ',en:'Revy'},series:{ja:'ブラック・ラグーン',en:'Black Lagoon'},type:{ja:'二丁拳銃の傭兵 (ESTP)',en:'Two-Gun Mercenary (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'ブラック・ラグーン商会の銃手。暴力的で粗野だが、ロックとの関係で少しずつ変化していく。',en:'Gunwoman of the Black Lagoon Company. Violent and crude, but gradually changes through her relationship with Rock.'},traits:{ja:['二丁拳銃','傭兵','暴力','変化','自由'],en:['Dual Guns','Mercenary','Violence','Change','Freedom']},radar:[85,42,38,52,45,58]},
  // ── 進撃の巨人追加 ──
  {id:'reiner_aot',icon:'🛡️',name:{ja:'ライナー・ブラウン',en:'Reiner Braun'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'鎧の巨人の二重人格 (ISFJ)',en:'Armored Titan\'s Dual Personality (ISFJ)'},profile:{I:3,S:3,F:3,J:4},desc:{ja:'鎧の巨人であり調査兵団に潜入した戦士。二つの使命の間で苦悩し続ける複雑な人物。',en:'The Armored Titan who infiltrated the Survey Corps as a warrior. A complex individual who continuously agonizes between two missions.'},traits:{ja:['鎧','苦悩','使命','友情','戦士'],en:['Armor','Anguish','Mission','Friendship','Warrior']},radar:[68,68,65,65,65,72]},
  {id:'hange_aot',icon:'🔬',name:{ja:'ハンジ・ゾエ',en:'Hange Zoe'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'巨人研究の熱狂者 (ENTP)',en:'Titan Research Enthusiast (ENTP)'},profile:{E:4,N:4,T:3,P:4},desc:{ja:'調査兵団の班長で巨人研究に情熱を注ぐ。変人に見えるが頭脳明晰で、後に兵団長になる。',en:'Section commander of the Survey Corps who pours passion into titan research. Appears eccentric but is sharp-minded; later becomes Commander.'},traits:{ja:['研究','巨人','情熱','知性','変人'],en:['Research','Titan','Passion','Intelligence','Eccentric']},radar:[68,85,82,72,88,78]},
  // ── ゴブリンスレイヤー追加 ──
  {id:'high_elf_gs',icon:'🏹',name:{ja:'妖精弓手',en:'High Elf Archer'},series:{ja:'ゴブリンスレイヤー',en:'Goblin Slayer'},type:{ja:'明るい精霊射手 (ENFP)',en:'Cheerful Elven Archer (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'ゴブリンスレイヤーのパーティメンバーで永遠の命を持つ妖精。明るく活発で多くの冒険を夢見る。',en:'A fairy with eternal life who is a member of Goblin Slayer\'s party. Bright and active, dreaming of many adventures.'},traits:{ja:['妖精','弓','明るさ','冒険','永遠の命'],en:['Fairy','Bow','Brightness','Adventure','Eternal Life']},radar:[75,70,65,82,68,72]},
  // ── ソロ・レベリング ──
  {id:'sung_jinwoo',icon:'⚔️',name:{ja:'成 ジンウ',en:'Sung Jinwoo'},series:{ja:'ソロ・レベリング',en:'Solo Leveling'},type:{ja:'最弱から最強へ (INTJ)',en:'Weakest to Strongest (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'最弱のE級ハンターから始まり、システムを得て最強のハンターへと成長した。孤独に戦い続ける孤高の存在。',en:'Started as the weakest E-rank Hunter and grew into the strongest through a System. A solitary existence who continues fighting alone.'},traits:{ja:['最強','成長','システム','孤独','意志'],en:['Strongest','Growth','System','Solitude','Will']},radar:[65,90,88,58,90,88]},
  // ── リゼロ追加 ──
  {id:'ram_rezero',icon:'🌸',name:{ja:'ラム',en:'Ram'},series:{ja:'Re:ゼロから始める異世界生活',en:'Re:Zero'},type:{ja:'優秀な片翼の鬼 (INTJ)',en:'Excellent One-Winged Oni (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'ロズワール邸のメイドでレムの姉。片翼を失った元天才鬼族で、プライドが高く辛口な性格。',en:'Maid at Roswaal Mansion and Rem\'s older sister. A former genius oni who lost one horn, proud and sharp-tongued.'},traits:{ja:['鬼','プライド','姉','辛口','実力'],en:['Oni','Pride','Sister','Sharp-tongued','Skilled']},radar:[55,82,80,52,80,82]},
  // ── スーパーナチュラル系追加 ──
  {id:'ainz_ov2',icon:'💀',name:{ja:'パンドラズ・アクター',en:'Pandora\'s Actor'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'創造主への忠義 (INFJ)',en:'Loyalty to Creator (INFJ)'},profile:{I:4,N:4,F:4,J:4},desc:{ja:'アインズが創ったエリアガーディアンの長。大げさな演技と仮面の裏に創造主アインズへの純粋な忠義を持つ。',en:'Leader of the Area Guardians created by Ainz. Behind exaggerated acting and a mask lies pure loyalty to his creator Ainz.'},traits:{ja:['変装','忠義','演技','仮面','誠実'],en:['Disguise','Loyalty','Acting','Mask','Sincere']},radar:[55,80,75,72,78,82]},
  // ── ギンタマ追加 ──
  {id:'hijikata_gt',icon:'🗡️',name:{ja:'土方十四郎',en:'Toshiro Hijikata'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'鬼の副長 (ISTJ)',en:'Demon Vice Commander (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'真選組副長でマヨネーズをこよなく愛す。厳しく怖いと評判だが、新選組への誇りと仲間への愛情は本物。',en:'Vice Commander of the Shinsengumi who loves mayonnaise. Known as strict and scary, but his pride in Shinsengumi and love for comrades is genuine.'},traits:{ja:['副長','マヨネーズ','厳格','誇り','真選組'],en:['Vice Commander','Mayonnaise','Strict','Pride','Shinsengumi']},radar:[65,78,82,60,78,88]},
  {id:'okita_gt',icon:'⚔️',name:{ja:'沖田総悟',en:'Sougo Okita'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'サディストの剣士 (ISTP)',en:'Sadistic Swordsman (ISTP)'},profile:{I:4,S:4,T:4,P:3},desc:{ja:'真選組一番隊隊長でサディスト。いつも眠そうな目をしているが剣の腕は一流。土方に対してだけ毒舌を発動。',en:'1st Division Captain of Shinsengumi and a sadist. Always looks sleepy but has first-class swordsmanship. Only uses sharp tongue toward Hijikata.'},traits:{ja:['剣','サディスト','眠そう','実力','毒舌'],en:['Sword','Sadist','Sleepy','Skilled','Sharp Tongue']},radar:[78,68,62,42,68,72]},
  {id:'sakamoto_gt',icon:'😄',name:{ja:'坂本辰馬',en:'Tatsuma Sakamoto'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'宇宙商人 (ESFP)',en:'Space Merchant (ESFP)'},profile:{E:4,S:3,F:4,P:4},desc:{ja:'宇宙で商売をする豪快な商人。ガハハと笑いながら銀時たちの昔の仲間であり続ける自由な魂。',en:'A boisterous merchant who does business in space. A free spirit who laughs "Gahaha" and remains an old friend of Gintoki and others.'},traits:{ja:['商人','宇宙','豪快','仲間','自由'],en:['Merchant','Space','Boisterous','Comrades','Free']},radar:[82,55,50,88,52,62]},
  // ── マギ ──
  {id:'sinbad_magi',icon:'👑',name:{ja:'シンドバッド',en:'Sinbad'},series:{ja:'マギ',en:'Magi'},type:{ja:'七海の覇王 (ENTJ)',en:'King of the Seven Seas (ENTJ)'},profile:{E:4,T:3,N:4,J:4},desc:{ja:'シンドリア王国の王で七海の覇王。複数のダンジョンを攻略した伝説の覇者でカリスマ性抜群。',en:'King of Sindria Kingdom and King of the Seven Seas. A legendary conqueror who cleared multiple dungeons with overwhelming charisma.'},traits:{ja:['王','カリスマ','覇王','ダンジョン','伝説'],en:['King','Charisma','Conqueror','Dungeon','Legend']},radar:[82,85,80,75,88,85]},
  // ── はたらく魔王さま! ──
  {id:'emi_hm',icon:'⚔️',name:{ja:'遊佐恵美',en:'Emi Yusa'},series:{ja:'はたらく魔王さま！',en:'The Devil is a Part-Timer!'},type:{ja:'勇者ヒーロー (ENFJ)',en:'Hero (ENFJ)'},profile:{E:3,N:3,F:4,J:4},desc:{ja:'異世界の勇者で魔王を追って現代日本に来た。正義感が強く真面目だが、日常生活では苦労続き。',en:'A hero from another world who followed the Demon King to modern Japan. Strong sense of justice and serious, but struggles with daily life.'},traits:{ja:['勇者','正義','異世界','苦労','強さ'],en:['Hero','Justice','Another World','Struggle','Strength']},radar:[72,68,70,78,68,75]},
  // ── ダンまち追加 ──
  {id:'welf_dm',icon:'🔨',name:{ja:'ウェルフ・クロッゾ',en:'Welf Crozzo'},series:{ja:'ダンジョンに出会いを求めるのは間違っているだろうか',en:'Is It Wrong to Try to Pick Up Girls in a Dungeon?'},type:{ja:'魔剣を断った鍛冶師 (ISFP)',en:'Blacksmith Who Rejected Magic Swords (ISFP)'},profile:{I:3,S:4,F:3,P:3},desc:{ja:'神の恩恵を受けた一流の鍛冶師。魔剣を作る家系に生まれたが、自らの誇りのために魔剣制作を拒む。',en:'A first-class blacksmith blessed by a god. Born into a family that makes magic swords, but refuses to create them for his own pride.'},traits:{ja:['鍛冶','誇り','魔剣拒否','技術','友情'],en:['Blacksmith','Pride','Reject Magic Sword','Skill','Friendship']},radar:[60,78,72,65,75,80]},
  // ── ヴァイオレット・エヴァーガーデン追加 ──
  {id:'claudia_ve',icon:'🎖️',name:{ja:'クラウディア・ホッジンズ',en:'Claudia Hodgins'},series:{ja:'ヴァイオレット・エヴァーガーデン',en:'Violet Evergarden'},type:{ja:'支える将校 (ENFJ)',en:'Supporting Officer (ENFJ)'},profile:{E:3,N:3,F:4,J:3},desc:{ja:'C.H.郵便社の社長でヴァイオレットを支える元軍人。ギルベルトへの友情とヴァイオレットへの温かいサポートが印象的。',en:'President of C.H. Postal Service and former soldier who supports Violet. Impressive for his friendship with Gilbert and warm support for Violet.'},traits:{ja:['社長','友情','サポート','元軍人','温かさ'],en:['President','Friendship','Support','Ex-Soldier','Warmth']},radar:[65,70,72,78,68,75]},
  // ── フルーツバスケット追加 ──
  {id:'yuki_fb',icon:'🐭',name:{ja:'草摩由希',en:'Yuki Sohma'},series:{ja:'フルーツバスケット',en:'Fruits Basket'},type:{ja:'完璧に見える孤独 (INTJ)',en:'Loneliness Behind Perfection (INTJ)'},profile:{I:4,T:3,N:3,J:4},desc:{ja:'十二支の鼠に憑かれた草摩家の人物。完璧に見えるが孤独を抱え、透に出会って変わっていく。',en:'A member of Sohma family possessed by the Rat of the Zodiac. Appears perfect but carries loneliness, changing after meeting Tohru.'},traits:{ja:['孤独','完璧','変化','十二支','成長'],en:['Solitude','Perfect','Change','Zodiac','Growth']},radar:[55,82,80,58,80,82]},
  {id:'akito_fb',icon:'☁️',name:{ja:'草摩慊人',en:'Akito Sohma'},series:{ja:'フルーツバスケット',en:'Fruits Basket'},type:{ja:'神の孤独 (INTJ)',en:'God\'s Loneliness (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'草摩家の神として君臨する存在。孤独と恐怖から支配するが、その根底には愛されたいという望みがある。',en:'An existence that reigns as the God of Sohma family. Controls through loneliness and fear, but at the root is a desire to be loved.'},traits:{ja:['神','孤独','支配','恐怖','変化'],en:['God','Solitude','Control','Fear','Change']},radar:[42,80,78,42,80,82]},
  // ── 魔法少女まどか☆マギカ追加 ──
  {id:'sayaka_mgk',icon:'🌊',name:{ja:'美樹さやか',en:'Sayaka Miki'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'正義の魔法少女 (ENFJ)',en:'Justice Magical Girl (ENFJ)'},profile:{E:4,N:3,F:4,J:3},desc:{ja:'正義感から魔法少女になった少女。理想と現実のギャップに苦しみながらも誰かのために戦い続ける。',en:'A girl who became a magical girl out of a sense of justice. Continues to fight for others while suffering from the gap between ideals and reality.'},traits:{ja:['正義','友情','悲劇','魔法少女','後悔'],en:['Justice','Friendship','Tragedy','Magical Girl','Regret']},radar:[75,58,55,85,55,65]},
  {id:'mami_mgk',icon:'🌼',name:{ja:'巴マミ',en:'Mami Tomoe'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'先輩魔法少女 (ISFJ)',en:'Senior Magical Girl (ISFJ)'},profile:{I:3,S:3,F:4,J:4},desc:{ja:'ベテランの魔法少女で後輩に希望を見せる存在。孤独を抱えながらも常に強くあろうとする姿が印象的。',en:'A veteran magical girl who shows hope to juniors. Impressive for always trying to appear strong while carrying loneliness.'},traits:{ja:['先輩','孤独','紅茶','大人','悲劇'],en:['Senior','Solitude','Tea','Mature','Tragedy']},radar:[62,72,70,75,68,78]},
  // ── アクエリオン / マクロス系 ──
  {id:'sheryl_mc',icon:'🎤',name:{ja:'シェリル・ノーム',en:'Sheryl Nome'},series:{ja:'マクロスF',en:'Macross Frontier'},type:{ja:'銀河の妖精 (ENFJ)',en:'Galactic Fairy (ENFJ)'},profile:{E:4,N:4,F:4,J:3},desc:{ja:'銀河の妖精と称えられる歌手。プロとしての誇りとオルタナに歌い続ける強い意志を持つ。',en:'A singer praised as the Galactic Fairy. Has professional pride and strong will to keep singing for the future.'},traits:{ja:['歌','銀河','プロ','情熱','強さ'],en:['Song','Galaxy','Pro','Passion','Strength']},radar:[82,75,72,88,75,80]},
  {id:'ranka_mc',icon:'🌸',name:{ja:'ランカ・リー',en:'Ranka Lee'},series:{ja:'マクロスF',en:'Macross Frontier'},type:{ja:'成長する歌姫 (ENFP)',en:'Growing Songstress (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'緑の長髪の歌手志望の少女。天才的な歌声を持ち、夢に向かって成長していく純粋な少女。',en:'A girl with green hair who aspires to be a singer. Has a gifted singing voice and is a pure girl who grows toward her dreams.'},traits:{ja:['歌','成長','純粋','夢','緑髪'],en:['Song','Growth','Pure','Dream','Green Hair']},radar:[72,65,60,88,65,70]},
  // ── 物語シリーズ追加 ──
  {id:'kanbaru_mono',icon:'🏀',name:{ja:'神原駿河',en:'Suruga Kanbaru'},series:{ja:'物語シリーズ',en:'Monogatari Series'},type:{ja:'快活なスポーツ少女 (ESFP)',en:'Energetic Sports Girl (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'阿良々木暦の後輩でバスケが得意。明るく快活で、センパイへの崇拝心も持つ独特な存在感を持つ。',en:'Araragi\'s junior who excels at basketball. Bright and energetic with a unique presence and reverence for her senior.'},traits:{ja:['バスケ','活発','後輩','崇拝','個性'],en:['Basketball','Energetic','Junior','Reverence','Unique']},radar:[82,60,55,82,58,65]},
  {id:'nadeko_mono',icon:'🐍',name:{ja:'千石撫子',en:'Nadeko Sengoku'},series:{ja:'物語シリーズ',en:'Monogatari Series'},type:{ja:'奥底に秘めた少女 (INFP)',en:'Girl with Hidden Depths (INFP)'},profile:{I:4,N:3,F:4,P:3},desc:{ja:'阿良々木の幼なじみで内向的な少女。外見は可愛らしいが内には複雑な感情を抱え、後に意外な成長を見せる。',en:'Araragi\'s childhood friend, an introverted girl. Cute in appearance but holds complex emotions inside; later shows surprising growth.'},traits:{ja:['内向的','幼なじみ','複雑','成長','蛇'],en:['Introverted','Childhood Friend','Complex','Growth','Snake']},radar:[42,68,65,65,65,72]},
  // ── 冴えない彼女の育てかた ──
  {id:'kato_saenai',icon:'📚',name:{ja:'加藤恵',en:'Megumi Kato'},series:{ja:'冴えない彼女の育てかた',en:'Saekano: How to Raise a Boring Girlfriend'},type:{ja:'空気読みの達人 (INFJ)',en:'Master of Reading the Room (INFJ)'},profile:{I:4,N:3,F:3,J:3},desc:{ja:'地味で目立たない少女だが実は場の空気を読む達人。ゲーム制作に協力するうちに存在感が増していく。',en:'A plain, inconspicuous girl who is actually a master at reading the room. Gains presence as she cooperates in game development.'},traits:{ja:['地味','空気読み','成長','存在感','誠実'],en:['Plain','Read the Room','Growth','Presence','Sincere']},radar:[52,78,75,68,75,80]},
  // ── アズールレーン / アークナイツ（ゲームアニメ）──
  {id:'enterprise_al',icon:'⚓',name:{ja:'エンタープライズ',en:'Enterprise'},series:{ja:'アズールレーン',en:'Azur Lane'},type:{ja:'鋼鉄の意志 (INTJ)',en:'Iron Will (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'アズールレーンで最強の重装甲艦艇の擬人化。冷静で強く、仲間を守るために戦い続ける鉄の意志の持ち主。',en:'Personification of the most powerful heavy carrier in Azur Lane. Calm and strong, possessing iron will that keeps fighting to protect allies.'},traits:{ja:['鋼鉄','強さ','冷静','守護','意志'],en:['Steel','Strength','Calm','Guardian','Will']},radar:[62,88,90,55,88,95]},
  // ── 異世界のんびり旅 ──
  {id:'elma_dragon',icon:'🐲',name:{ja:'エルマ',en:'Elma'},series:{ja:'小林さんちのメイドラゴン',en:'Miss Kobayashi\'s Dragon Maid'},type:{ja:'食いしん坊なドラゴン (ESFP)',en:'Glutton Dragon (ESFP)'},profile:{E:3,S:4,F:3,P:3},desc:{ja:'水属性のドラゴンでトールのライバル。食べることが大好きで、現代の料理に目がない。勤勉で真面目な面も。',en:'A water attribute dragon and Tohru\'s rival. Loves eating and can\'t resist modern cuisine. Also has a diligent and serious side.'},traits:{ja:['ドラゴン','食欲','ライバル','水','勤勉'],en:['Dragon','Appetite','Rival','Water','Diligent']},radar:[72,65,60,75,62,70]},
  // ── ログ・ホライズン追加 ──
  {id:'naotsugu_lh',icon:'🛡️',name:{ja:'直継',en:'Naotsugu'},series:{ja:'ログ・ホライズン',en:'Log Horizon'},type:{ja:'前衛ガーディアン (ESFP)',en:'Front Guard (ESFP)'},profile:{E:4,S:4,F:3,P:3},desc:{ja:'シロエの友人でガーディアンのクラス。エロ好きで下ネタ多めだが、仲間を守る責任感の強い前衛型。',en:'Shiroe\'s friend and Guardian class. Loves perverted jokes but has a strong sense of responsibility to protect comrades as a front-liner.'},traits:{ja:['ガーディアン','前衛','友情','下ネタ','責任'],en:['Guardian','Front-line','Friendship','Jokes','Responsibility']},radar:[78,55,50,80,55,72]},
  // ── この素晴らしい世界に祝福を！追加 ──
  {id:'vanir_ks',icon:'👺',name:{ja:'ヴァニル',en:'Vanir'},series:{ja:'この素晴らしい世界に祝福を！',en:'KonoSuba'},type:{ja:'悪魔の商人 (ENTP)',en:'Demon Merchant (ENTP)'},profile:{E:4,N:4,T:4,P:3},desc:{ja:'悪魔のヴァニルで「感情の味」を楽しむ存在。人間の感情、特に敗北感と屈辱を好む。後に商売人になる。',en:'The demon Vanir who enjoys "the taste of emotions." Fond of human emotions, especially defeat and humiliation. Later becomes a merchant.'},traits:{ja:['悪魔','感情','商売','嗜好','ユーモア'],en:['Demon','Emotion','Business','Taste','Humor']},radar:[60,85,82,48,85,72]},
  // ── 彼女お借りします ──
  {id:'sumi_rg',icon:'🌸',name:{ja:'桜沢墨',en:'Sumi Sakurasawa'},series:{ja:'彼女、お借りします',en:'Rent-a-Girlfriend'},type:{ja:'内気な成長型 (ISFJ)',en:'Shy Growth Type (ISFJ)'},profile:{I:4,S:3,F:4,J:3},desc:{ja:'レンカノのメンバーで非常に内気な少女。コミュニケーションが苦手だが、少しずつ成長していく姿が愛らしい。',en:'A member of Rental Girlfriend who is extremely shy. Bad at communication but her gradual growth is endearing.'},traits:{ja:['内気','成長','純粋','コミュ障','努力'],en:['Shy','Growth','Pure','Communication Disorder','Effort']},radar:[38,68,65,75,65,72]},
  // ── 転スラ追加 ──
  {id:'shion_tensura',icon:'🌸',name:{ja:'シオン',en:'Shion'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'忠実な鬼人 (ESFJ)',en:'Loyal Oni (ESFJ)'},profile:{E:3,S:3,F:4,J:4},desc:{ja:'リムルの秘書で忠実な鬼人族。強い戦闘力を持つが、料理だけは致命的に下手。リムルへの忠義は絶対的。',en:'Rimuru\'s secretary and loyal Oni. Has great combat ability, but cooking is fatally bad. Absolute loyalty to Rimuru.'},traits:{ja:['秘書','忠義','強さ','料理下手','鬼人'],en:['Secretary','Loyalty','Strength','Bad Cook','Oni']},radar:[72,65,62,82,65,80]},
  {id:'benimaru_tensura',icon:'🔥',name:{ja:'ベニマル',en:'Benimaru'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'炎の鬼人将軍 (ENTJ)',en:'Flame Oni General (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'リムルの配下で鬼人族の一族。強力な炎の力を持ち、リムルへの忠義と仲間への強いリーダーシップを発揮。',en:'Subordinate to Rimuru and member of the Oni clan. Powerful flame ability; shows loyalty to Rimuru and strong leadership among comrades.'},traits:{ja:['炎','将軍','鬼人','リーダー','忠義'],en:['Flame','General','Oni','Leader','Loyalty']},radar:[82,78,75,68,80,85]},
  // ── 異世界おじさん ──
  {id:'ojisan_ij',icon:'👨',name:{ja:'おじさん',en:'Uncle'},series:{ja:'異世界おじさん',en:'Uncle from Another World'},type:{ja:'セガ信者の異世界帰還者 (ISTP)',en:'Sega Devotee Isekai Returnee (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'異世界から帰ってきたおじさん。セガゲームへの異常な執着と異世界で習得した魔法を持つギャップが笑えるキャラ。',en:'An uncle who returned from another world. The gap between his abnormal obsession with Sega games and magic learned in another world is hilarious.'},traits:{ja:['セガ','魔法','おじさん','ギャップ','異世界'],en:['Sega','Magic','Uncle','Gap','Isekai']},radar:[55,68,65,55,65,68]},
  // ── 怪物事変 ──
  {id:'kabane_kmt',icon:'🐺',name:{ja:'壁根奏羽',en:'Kabane Kusaka'},series:{ja:'怪物事変',en:'Kemono Jihen'},type:{ja:'純粋な半怪物少年 (ISTP)',en:'Pure Half-Monster Boy (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'人里離れた農村育ちの半怪物の少年。感情表現が苦手だが、仲間のために全力で戦う純粋さを持つ。',en:'A half-monster boy raised in a remote village. Bad at expressing emotions, but has the purity to fight with all his might for friends.'},traits:{ja:['怪物','半妖','純粋','仲間','成長'],en:['Monster','Half-Yokai','Pure','Friends','Growth']},radar:[65,68,62,60,65,72]},
  // ── ゾンビランドサガ ──
  {id:'sakura_zls',icon:'🌸',name:{ja:'源さくら',en:'Sakura Minamoto'},series:{ja:'ゾンビランドサガ',en:'Zombieland Saga'},type:{ja:'普通への憧れゾンビ (ISFJ)',en:'Zombie Longing for Normal (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'ゾンビになってもアイドルとして活躍する少女。普通の女の子への憧れを持ちながらも仲間と共に輝く。',en:'A girl who works as an idol even as a zombie. Shines together with friends while longing to be a normal girl.'},traits:{ja:['ゾンビ','アイドル','普通','憧れ','仲間'],en:['Zombie','Idol','Normal','Longing','Friends']},radar:[62,60,58,82,60,70]},
  {id:'ai_zls',icon:'🌙',name:{ja:'水野愛',en:'Ai Mizuno'},series:{ja:'ゾンビランドサガ',en:'Zombieland Saga'},type:{ja:'伝説のアイドル (ENFJ)',en:'Legendary Idol (ENFJ)'},profile:{E:3,N:3,F:4,J:4},desc:{ja:'かつて人気アイドルだったゾンビ。自分への後悔と新しい仲間への愛情の間で成長する元アイドル。',en:'A zombie who was once a popular idol. A former idol who grows between regret for herself and love for new friends.'},traits:{ja:['アイドル','後悔','成長','伝説','友情'],en:['Idol','Regret','Growth','Legend','Friendship']},radar:[72,68,65,80,68,75]},
  // ── ワンダーエッグ・プライオリティ ──
  {id:'ai_wep',icon:'🥚',name:{ja:'大戸アイ',en:'Ai Ohto'},series:{ja:'ワンダーエッグ・プライオリティ',en:'Wonder Egg Priority'},type:{ja:'孤独を抱えた少女 (INFP)',en:'Girl Carrying Loneliness (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'不登校の少女で魔法の卵で友達の死の謎を解こうとする。繊細で感情豊かで、心の傷と向き合う物語。',en:'A girl not attending school who tries to solve the mystery of her friend\'s death through magical eggs. Sensitive and emotionally rich, facing inner wounds.'},traits:{ja:['孤独','繊細','友情','成長','謎'],en:['Solitude','Sensitive','Friendship','Growth','Mystery']},radar:[45,72,68,78,70,68]},
  // ── 盾の勇者の成り上がり追加 ──
  {id:'filo_sh',icon:'🐓',name:{ja:'フィーロ',en:'Filo'},series:{ja:'盾の勇者の成り上がり',en:'The Rising of Shield Hero'},type:{ja:'天真爛漫なフィルリアル (ESFP)',en:'Innocent Filolial (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'ナオフミが育てたフィルリアルの女王。鳥型の魔物だが人型に変身でき、天真爛漫な性格で皆を癒す。',en:'Queen Filolial raised by Naofumi. A bird-type monster who can transform into human form; innocent personality that heals everyone.'},traits:{ja:['フィルリアル','天真爛漫','変身','笑顔','速さ'],en:['Filolial','Innocent','Transform','Smile','Speed']},radar:[82,48,42,92,45,65]},
  // ── ダーリン・イン・ザ・フランキス追加 ──
  {id:'ichigo_dfx',icon:'🍓',name:{ja:'いちご',en:'Ichigo'},series:{ja:'ダーリン・イン・ザ・フランキス',en:'Darling in the FranXX'},type:{ja:'責任感の隊長 (ISTJ)',en:'Responsible Squad Leader (ISTJ)'},profile:{I:3,S:3,T:3,J:4},desc:{ja:'クラスのリーダーで責任感が強い。ヒロへの複雑な感情を抱えながら、隊のためにまとまり続ける。',en:'Class leader with a strong sense of responsibility. Continues to unite the squad while harboring complex feelings for Hiro.'},traits:{ja:['リーダー','責任','複雑','友情','成長'],en:['Leader','Responsibility','Complex','Friendship','Growth']},radar:[60,72,72,65,70,80]},
  // ── ソードアート・オンライン追加 ──
  {id:'eugeo_sao',icon:'🌿',name:{ja:'ユージオ',en:'Eugeo'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'誠実な騎士見習い (ISFJ)',en:'Sincere Knight Squire (ISFJ)'},profile:{I:3,S:3,F:4,J:4},desc:{ja:'キリトの幼なじみでアリスを救うために騎士を目指す。誠実で優しく、友情と使命への純粋な信念を持つ。',en:'Kirito\'s childhood friend who aims to become a knight to save Alice. Sincere and kind, with pure belief in friendship and his mission.'},traits:{ja:['誠実','幼なじみ','騎士','友情','犠牲'],en:['Sincere','Childhood Friend','Knight','Friendship','Sacrifice']},radar:[60,72,70,82,70,78]},
  {id:'alice_sao',icon:'🌟',name:{ja:'アリス・ツーベルク',en:'Alice Zuberg'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'整合騎士の誇り (INTJ)',en:'Integrity Knight Pride (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'整合騎士で人工知能（フラクトライト）の少女。厳格な騎士として生きてきたが、キリトとの出会いで変わる。',en:'Integrity Knight and a girl with artificial intelligence (Fluctlight). Lived as a strict knight, but changed after meeting Kirito.'},traits:{ja:['騎士','誇り','人工知能','変化','金髪'],en:['Knight','Pride','AI','Change','Blonde']},radar:[58,82,82,55,82,88]},
  // ── 無職転生追加 ──
  {id:'roxy_mt',icon:'🧙',name:{ja:'ロキシー・ミグルディア',en:'Roxy Migurdia'},series:{ja:'無職転生〜異世界行ったら本気だす〜',en:'Mushoku Tensei'},type:{ja:'ルーデウスの師匠 (ISTJ)',en:'Rudeus\'s Mentor (ISTJ)'},profile:{I:3,S:3,T:3,J:3},desc:{ja:'ルーデウスに魔法を教えた最初の師匠。小さな体に大きな誇りを持つ、真剣な魔術師。',en:'The first mentor who taught Rudeus magic. A serious mage with a small body but great pride.'},traits:{ja:['師匠','魔法','誇り','誠実','成長サポート'],en:['Mentor','Magic','Pride','Sincere','Growth Support']},radar:[55,82,80,62,80,82]},
  // ── 葬送のフリーレン追加 ──
  {id:'himmel_fr',icon:'⚔️',name:{ja:'ヒンメル',en:'Himmel'},series:{ja:'葬送のフリーレン',en:'Frieren: Beyond Journey\'s End'},type:{ja:'英雄勇者の理想型 (ENFJ)',en:'Ideal Hero Type (ENFJ)'},profile:{E:4,N:4,F:4,J:3},desc:{ja:'魔王を倒した勇者パーティのリーダー。フリーレンから見た人間の命の輝きを象徴する存在。',en:'Leader of the hero party that defeated the Demon King. Embodies the brilliance of human life as seen through Frieren.'},traits:{ja:['英雄','友情','記憶','輝き','人間'],en:['Hero','Friendship','Memory','Brilliance','Human']},radar:[82,78,80,88,78,82]},
  {id:'eisen_fr',icon:'⚒️',name:{ja:'アイゼン',en:'Eisen'},series:{ja:'葬送のフリーレン',en:'Frieren: Beyond Journey\'s End'},type:{ja:'鉄の意志の戦士 (ISTJ)',en:'Iron Will Warrior (ISTJ)'},profile:{I:4,S:4,T:3,J:4},desc:{ja:'勇者パーティの戦士。年老いてもその意志と実力は健在。孫のリヒターへの愛情と厳格な教育が印象的。',en:'Warrior of the hero party. Even aged, his will and ability remain strong. Impressive for his affection for grandson Richter and strict teaching.'},traits:{ja:['戦士','意志','老練','孫','厳格'],en:['Warrior','Will','Veteran','Grandson','Strict']},radar:[68,80,80,68,80,88]},
  // ── ダンジョン飯追加 ──
  {id:'chilchuck_dm',icon:'🔐',name:{ja:'チルチャック',en:'Chilchuck'},series:{ja:'ダンジョン飯',en:'Delicious in Dungeon'},type:{ja:'現実的なハーフフット (ISTJ)',en:'Pragmatic Halffoot (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'トラップ解除の専門家でハーフフット。割り切った仕事観と家族への複雑な感情を持つリアリスト。',en:'Trap disarming specialist and Halffoot. A realist with a pragmatic work ethic and complex feelings toward family.'},traits:{ja:['トラップ','現実的','仕事','ハーフフット','家族'],en:['Trap','Pragmatic','Work','Halffoot','Family']},radar:[52,82,80,55,80,88]},
  {id:'senshi_dm',icon:'🍲',name:{ja:'センシ',en:'Senshi'},series:{ja:'ダンジョン飯',en:'Delicious in Dungeon'},type:{ja:'魔物料理人のドワーフ (ISFP)',en:'Monster Cook Dwarf (ISFP)'},profile:{I:3,S:4,F:3,P:3},desc:{ja:'魔物を料理として調理するドワーフの戦士。長年のダンジョン生活で培った知識と料理への情熱が光る。',en:'A Dwarf warrior who cooks monsters as food. Shines with knowledge cultivated from long dungeon life and passion for cooking.'},traits:{ja:['料理','ドワーフ','魔物','知識','情熱'],en:['Cooking','Dwarf','Monster','Knowledge','Passion']},radar:[62,75,70,72,72,75]},
  // ── 薬屋のひとりごと追加 ──
  {id:'jinshi_ap',icon:'🌙',name:{ja:'壬氏',en:'Jinshi'},series:{ja:'薬屋のひとりごと',en:'The Apothecary Diaries'},type:{ja:'宦官の謎 (INFJ)',en:'Mysterious Eunuch (INFJ)'},profile:{I:3,N:4,T:3,J:3},desc:{ja:'後宮に仕える絶世の美男子で宦官。多くの秘密を抱え、マオマオに翻弄されながら惹かれていく謎多き人物。',en:'An unparalleled handsome eunuch serving in the rear palace. A mysterious figure holding many secrets, gradually drawn to Maomao.'},traits:{ja:['美男子','秘密','宦官','謎','成長'],en:['Handsome','Secrets','Eunuch','Mystery','Growth']},radar:[55,80,78,60,80,78]},
  // ── 魔法少女育成計画 ──
  {id:'snow_white_mgk2',icon:'🍎',name:{ja:'スノーホワイト',en:'Snow White'},series:{ja:'魔法少女育成計画',en:'Magical Girl Raising Project'},type:{ja:'純粋な理想主義者 (INFJ)',en:'Pure Idealist (INFJ)'},profile:{I:3,N:4,F:4,J:3},desc:{ja:'魔法少女になることを夢見てきた少女。過酷なゲームの中でも自分の信念を曲げずに生き抜く。',en:'A girl who dreamed of becoming a magical girl. Survives without bending her beliefs even in the cruel game.'},traits:{ja:['純粋','信念','夢','魔法少女','生存'],en:['Pure','Belief','Dream','Magical Girl','Survival']},radar:[55,72,70,88,70,75]},
  // ── オーバーロード追加 ──
  {id:'demiurge_ov',icon:'😈',name:{ja:'デミウルゴス',en:'Demiurge'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'策士の守護者 (INTJ)',en:'Strategist Guardian (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ナザリック地下大墳墓の第七階層守護者。卓越した知性で複雑な策略を立て、アインズへの忠義は絶対。',en:'Guardian of the 7th floor of the Great Tomb of Nazarick. Plans complex strategies with exceptional intelligence; absolute loyalty to Ainz.'},traits:{ja:['策略','知性','守護者','忠義','悪魔'],en:['Strategy','Intelligence','Guardian','Loyalty','Demon']},radar:[42,98,95,32,98,92]},
  {id:'cocytus_ov',icon:'❄️',name:{ja:'コキュートス',en:'Cocytus'},series:{ja:'オーバーロード',en:'Overlord'},type:{ja:'氷の戦士 (ISTJ)',en:'Ice Warrior (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'ナザリック第五階層守護者の戦士型の守護者。武士道に似た精神を持ち、敵への敬意と忠義を兼ね備える。',en:'Warrior-type guardian of the 5th floor of Nazarick. Has a spirit similar to Bushido, combining respect for enemies with loyalty.'},traits:{ja:['氷','武士道','守護者','忠義','戦士'],en:['Ice','Bushido','Guardian','Loyalty','Warrior']},radar:[72,78,80,62,78,88]},
  // ── ラブライブ! 追加 ──
  {id:'maki_ll',icon:'🎹',name:{ja:'西木野真姫',en:'Maki Nishikino'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'クールなピアノ少女 (INTJ)',en:'Cool Piano Girl (INTJ)'},profile:{I:4,T:3,N:3,J:3},desc:{ja:'お嬢様でツンデレ気味のスクールアイドル。ピアノが得意で楽曲制作を担当する才能あふれる一年生。',en:'A rich girl with tsundere tendencies who is a school idol. Talented first-year who plays piano and is in charge of music composition.'},traits:{ja:['ピアノ','ツンデレ','才能','お嬢様','アイドル'],en:['Piano','Tsundere','Talent','Rich Girl','Idol']},radar:[55,82,80,58,78,82]},
  {id:'eli_ll',icon:'🌟',name:{ja:'絢瀬絵里',en:'Eli Ayase'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'完璧な元生徒会長 (ISTJ)',en:'Perfect Former Student Council President (ISTJ)'},profile:{I:3,S:3,T:4,J:4},desc:{ja:'元生徒会長でバレエ経験者。最初はスクールアイドルに反対していたが、仲間への愛情で加入を決意する。',en:'Former student council president with ballet experience. Initially opposed school idols, but decided to join out of love for her friends.'},traits:{ja:['完璧','バレエ','元生徒会長','変化','リーダー'],en:['Perfect','Ballet','Former President','Change','Leader']},radar:[62,80,80,65,80,85]},
  {id:'nozomi_ll',icon:'⭐',name:{ja:'東條希',en:'Nozomi Tojo'},series:{ja:'ラブライブ！',en:'Love Live!'},type:{ja:'神秘的なオカルト少女 (INFJ)',en:'Mysterious Occult Girl (INFJ)'},profile:{I:3,N:4,F:4,J:3},desc:{ja:'スクールアイドルの精神的支柱。タロットカードや神道への信仰を持つ神秘的な人物で、μ\'sをまとめる。',en:'The spiritual pillar of the school idols. A mysterious person with beliefs in tarot cards and Shinto, who brings μ\'s together.'},traits:{ja:['神秘','タロット','精神的支柱','オカルト','絵里'],en:['Mysterious','Tarot','Spiritual Pillar','Occult','Eli']},radar:[52,78,75,80,78,75]},
  // ── K-ON! 追加 ──
  {id:'yui_kon',icon:'🎸',name:{ja:'平沢唯',en:'Yui Hirasawa'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'天才系マイペース (ESFP)',en:'Genius at Her Own Pace (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'軽音部のギタリストでボーカル。のんびり屋だが音楽の才能は本物。おいしいものと妹の憂が大好き。',en:'Guitarist and vocalist of the Light Music Club. Laid-back but has genuine musical talent. Loves delicious food and her sister Ui.'},traits:{ja:['ギター','のんびり','天才','食いしん坊','妹'],en:['Guitar','Laid-back','Genius','Foodie','Sister']},radar:[82,48,42,92,45,58]},
  {id:'mio_kon',icon:'🎸',name:{ja:'秋山澪',en:'Mio Akiyama'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'恥ずかしがり屋の作詞家 (INFJ)',en:'Bashful Lyricist (INFJ)'},profile:{I:4,N:4,F:4,J:3},desc:{ja:'軽音部のベーシストで作詞担当。恥ずかしがり屋で怖がりだが、音楽への情熱と責任感は強い。',en:'Bassist and lyricist of the Light Music Club. Bashful and easily scared, but has strong passion for music and sense of responsibility.'},traits:{ja:['ベース','作詞','恥ずかしがり','怖がり','文学'],en:['Bass','Lyrics','Bashful','Easily Scared','Literature']},radar:[52,82,78,72,80,78]},
  {id:'ritsu_kon',icon:'🥁',name:{ja:'田井中律',en:'Ritsu Tainaka'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'元気なドラマー部長 (ESTP)',en:'Energetic Drummer Captain (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'軽音部の部長でドラム担当。活発で明るくいたずら好き。澪への一方的なからかいが楽しい。',en:'Captain of Light Music Club and drummer. Active, bright, and mischievous. Enjoys one-sidedly teasing Mio.'},traits:{ja:['ドラム','部長','いたずら','活発','友情'],en:['Drums','Captain','Mischievous','Active','Friendship']},radar:[85,48,42,85,48,60]},
  {id:'tsumugi_kon',icon:'🎹',name:{ja:'琴吹紬',en:'Tsumugi Kotobuki'},series:{ja:'けいおん！',en:'K-ON!'},type:{ja:'上品なお嬢様キーボード (ENFJ)',en:'Refined Rich Girl Keyboardist (ENFJ)'},profile:{E:3,N:3,F:4,J:3},desc:{ja:'軽音部のキーボーディストでお嬢様。穏やかで優しく、皆に差し入れを持ってくる。実は筋肉がすごい。',en:'Keyboardist of Light Music Club and a rich girl. Gentle and kind, always bringing treats. Actually has impressive muscles.'},traits:{ja:['キーボード','お嬢様','優しさ','筋肉','差し入れ'],en:['Keyboard','Rich Girl','Kindness','Muscles','Treats']},radar:[65,68,62,88,65,72]},
  // ── ラッキースター ──
  {id:'konata_ls',icon:'⭐',name:{ja:'泉こなた',en:'Konata Izumi'},series:{ja:'らき☆すた',en:'Lucky Star'},type:{ja:'オタクの達人 (ENTP)',en:'Master Otaku (ENTP)'},profile:{E:3,N:4,T:3,P:4},desc:{ja:'アニメ・ゲーム・漫画を愛するオタクの女子高生。成績はいいが勉強しない。明るく個性的な存在。',en:'A female high schooler who loves anime, games, and manga. Has good grades but doesn\'t study. Bright and unique personality.'},traits:{ja:['オタク','アニメ','明るさ','個性','ゲーム'],en:['Otaku','Anime','Brightness','Unique','Gaming']},radar:[72,75,70,82,72,62]},
  {id:'kagami_ls',icon:'📚',name:{ja:'柊かがみ',en:'Kagami Hiiragi'},series:{ja:'らき☆すた',en:'Lucky Star'},type:{ja:'ツンデレ優等生 (ISTJ)',en:'Tsundere Honor Student (ISTJ)'},profile:{I:3,S:3,T:4,J:4},desc:{ja:'優等生でプライドが高いツンデレ。こなたとは正反対だが親友として付き合い続ける。',en:'An honor student with high pride and tsundere tendencies. Complete opposite of Konata but remains her best friend.'},traits:{ja:['優等生','ツンデレ','プライド','勉強','友情'],en:['Honor Student','Tsundere','Pride','Study','Friendship']},radar:[58,82,80,60,80,82]},
  // ── 氷菓 ──
  {id:'hotaro_hyouka',icon:'🔍',name:{ja:'折木奉太郎',en:'Hotaro Oreki'},series:{ja:'氷菓',en:'Hyouka'},type:{ja:'省エネの推理家 (ISTP)',en:'Energy-Saving Detective (ISTP)'},profile:{I:4,S:3,T:4,P:3},desc:{ja:'「省エネ」を信条とし、やる気のない日常を送る少年。しかし推理の才能があり、えるの依頼に何度も応える。',en:'A boy who lives by "energy-saving" with no motivation. However, he has talent for deduction and responds to Eru\'s requests time and again.'},traits:{ja:['省エネ','推理','才能','変化','日常'],en:['Energy-saving','Deduction','Talent','Change','Everyday']},radar:[52,88,85,48,85,72]},
  {id:'eru_hyouka',icon:'🌼',name:{ja:'千反田える',en:'Eru Chitanda'},series:{ja:'氷菓',en:'Hyouka'},type:{ja:'好奇心の塊 (ENFP)',en:'Bundle of Curiosity (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'「私、気になります！」が口癖の好奇心旺盛な少女。奉太郎の推理能力を引き出す存在であり、田舎の旧家の娘。',en:'A girl full of curiosity whose catchphrase is "I\'m curious!" She brings out Hotaro\'s deduction ability; daughter of an old rural family.'},traits:{ja:['好奇心','農家娘','明るさ','「気になります」','引き出す'],en:['Curiosity','Farmer\'s Daughter','Brightness','Curious','Drawing Out']},radar:[82,72,68,88,70,72]},
  // ── アズマンガ大王 ──
  {id:'chiyo_az',icon:'🎀',name:{ja:'榊原千代',en:'Chiyo Mihama'},series:{ja:'あずまんが大王',en:'Azumanga Daioh'},type:{ja:'天才小さな少女 (ISTJ)',en:'Tiny Genius Girl (ISTJ)'},profile:{I:3,S:3,T:3,J:3},desc:{ja:'10歳で高校に入学した天才少女。可愛らしい外見と大人な思考で周囲に愛される存在。',en:'A genius girl who entered high school at age 10. Loved by everyone for her cute appearance and mature thinking.'},traits:{ja:['天才','可愛さ','努力','小さい','周囲に愛される'],en:['Genius','Cute','Effort','Small','Loved']},radar:[55,85,80,78,82,80]},
  {id:'sakaki_az',icon:'🐱',name:{ja:'榊',en:'Sakaki'},series:{ja:'あずまんが大王',en:'Azumanga Daioh'},type:{ja:'猫好きクールビューティ (INTJ)',en:'Cat-Loving Cool Beauty (INTJ)'},profile:{I:4,T:3,N:3,J:3},desc:{ja:'クールで大人っぽい見た目だが実は猫が大好きなやわらかい心の持ち主。スポーツ万能の学生。',en:'Cool and mature-looking but actually has a soft heart that loves cats. A student skilled in all sports.'},traits:{ja:['猫好き','クール','スポーツ','内心','ギャップ'],en:['Cat Lover','Cool','Sports','Inner Self','Gap']},radar:[62,70,68,72,68,75]},
  // ── ヴァンガード / カードゲーム系 ──
  {id:'kai_vg',icon:'🃏',name:{ja:'カイ',en:'Kai'},series:{ja:'カードファイト!! ヴァンガード',en:'Cardfight!! Vanguard'},type:{ja:'孤高のカードファイター (INTJ)',en:'Solitary Card Fighter (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'カードゲームに絶対的な自信を持つ孤高のファイター。冷静で寡黙だが、かつての仲間への思いがある。',en:'A solitary fighter with absolute confidence in card games. Calm and taciturn, but has feelings for former comrades.'},traits:{ja:['カード','孤高','冷静','実力','友情'],en:['Cards','Solitary','Calm','Skill','Friendship']},radar:[52,85,88,48,85,88]},
  // ── ご注文はうさぎですか? ──
  {id:'cocoa_gochiusa',icon:'☕',name:{ja:'保登心愛',en:'Kokoa Hoto'},series:{ja:'ご注文はうさぎですか？',en:'Is the Order a Rabbit?'},type:{ja:'元気なウサギカフェ店員 (ESFP)',en:'Energetic Rabbit Cafe Worker (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'祖父が経営するカフェでアルバイトをする元気な少女。ちのを妹と思い可愛がる。パン屋の娘。',en:'An energetic girl who works part-time at her grandfather\'s cafe. Treats Chino like a little sister and dotes on her. Daughter of a baker.'},traits:{ja:['元気','カフェ','妹','パン','友情'],en:['Energetic','Cafe','Little Sister','Bread','Friendship']},radar:[88,45,40,95,42,58]},
  {id:'chino_gochiusa',icon:'🐇',name:{ja:'香風智乃',en:'Chino Kafuu'},series:{ja:'ご注文はうさぎですか？',en:'Is the Order a Rabbit?'},type:{ja:'内気なうさぎカフェの看板娘 (ISFJ)',en:'Shy Rabbit Cafe Main Girl (ISFJ)'},profile:{I:4,S:3,F:3,J:3},desc:{ja:'カフェの店長を目指す内気な少女。ウサギのティッピーと共に接客する。ここあを姉のように慕う。',en:'A shy girl aiming to be cafe manager. Serves customers with rabbit Tippy. Looks up to Cocoa like an older sister.'},traits:{ja:['内気','カフェ','ウサギ','成長','お姉ちゃん'],en:['Shy','Cafe','Rabbit','Growth','Big Sister']},radar:[42,68,65,70,65,72]},
  // ── ひぐらしのなく頃に ──
  {id:'rika_higurashi',icon:'🎋',name:{ja:'古手梨花',en:'Rika Furude'},series:{ja:'ひぐらしのなく頃に',en:'Higurashi When They Cry'},type:{ja:'神の証人 (INFJ)',en:'Witness of God (INFJ)'},profile:{I:4,N:4,F:3,J:4},desc:{ja:'綿流し村の神社の娘で「にぱ〜」が口癖。タイムループを繰り返しながら悲劇を打破しようとする存在。',en:'Daughter of the Watanagashi shrine, whose catchphrase is "Nipa~." Exists trying to break the tragedy while repeating time loops.'},traits:{ja:['タイムループ','神','悲劇','「にぱ〜」','強さ'],en:['Time Loop','Shrine','Tragedy','Nipa~','Strength']},radar:[45,85,82,65,85,82]},
  {id:'rena_higurashi',icon:'🔪',name:{ja:'竜宮レナ',en:'Rena Ryugu'},series:{ja:'ひぐらしのなく頃に',en:'Higurashi When They Cry'},type:{ja:'優しき二面性 (ENFJ)',en:'Kind Dual Nature (ENFJ)'},profile:{E:3,N:3,F:4,J:3},desc:{ja:'「持って帰りたい！」が口癖の可愛いもの好きの少女。温かくて優しいが、触れてはいけない暗い面も持つ。',en:'A cute-things-loving girl whose catchphrase is "I want to take it home!" Warm and kind, but also has a dark side that shouldn\'t be touched.'},traits:{ja:['可愛いもの好き','優しさ','二面性','「持って帰りたい」','保護'],en:['Cute Things','Kindness','Dual Nature','Take It Home','Protection']},radar:[75,55,52,82,55,68]},
  // ── うみねこのなく頃に ──
  {id:'battler_umineko',icon:'🦋',name:{ja:'右代宮戦人',en:'Battler Ushiromiya'},series:{ja:'うみねこのなく頃に',en:'Umineko When They Cry'},type:{ja:'不屈の疑問者 (ENFP)',en:'Indomitable Questioner (ENFP)'},profile:{E:4,N:4,T:3,P:4},desc:{ja:'黄金の魔女ベアトリーチェと「悪魔の証明」を巡って戦う少年。魔女の存在を否定し続ける強い意志を持つ。',en:'A boy who battles the Golden Witch Beatrice over the "devil\'s proof." Has a strong will to keep denying the existence of witches.'},traits:{ja:['疑問','不屈','魔女','論理','感情'],en:['Questioning','Indomitable','Witch','Logic','Emotion']},radar:[72,72,68,78,70,72]},
  // ── 進撃追加 ──
  {id:'jean_aot',icon:'🐴',name:{ja:'ジャン・キルシュタイン',en:'Jean Kirstein'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'現実的な成長型 (ISTJ)',en:'Realistic Growth Type (ISTJ)'},profile:{I:3,S:3,T:3,J:3},desc:{ja:'調査兵団メンバーで最初は自己中心的だった。仲間の死を経て真の意味でのリーダーへと成長した。',en:'Survey Corps member who was initially self-centered. Grew into a true leader after experiencing the deaths of comrades.'},traits:{ja:['現実的','成長','リーダー','仲間の死','変化'],en:['Realistic','Growth','Leader','Comrades\' Deaths','Change']},radar:[65,70,68,68,68,75]},
  {id:'ymir_aot',icon:'🍧',name:{ja:'ユミル',en:'Ymir'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'利己的な愛 (ISTP)',en:'Selfish Love (ISTP)'},profile:{I:4,S:4,T:3,P:4},desc:{ja:'諌山創による複雑なキャラクター。自分本位に生きるが、ヒストリアへの愛情は本物の利己的な戦士。',en:'A complex character created by Isayama. Lives selfishly, but her love for Historia is genuine; a selfish warrior.'},traits:{ja:['利己的','愛','秘密','過去','ヒストリア'],en:['Selfish','Love','Secret','Past','Historia']},radar:[62,65,62,65,65,68]},
  // ── 日常系追加 ──
  {id:'hakase_nichijou',icon:'🔬',name:{ja:'博士',en:'Hakase'},series:{ja:'日常',en:'Nichijou'},type:{ja:'天才の子供科学者 (ENTP)',en:'Genius Child Scientist (ENTP)'},profile:{E:4,N:4,T:3,P:4},desc:{ja:'非常に幼い外見の天才科学者でナノの製作者。ロボットのナノとにゃーにゃーとの日常生活が愛らしい。',en:'A genius scientist with very young appearance who created Nano. Endearing daily life with robot Nano and the cat Sakamoto.'},traits:{ja:['天才','科学','子供っぽい','ナノ','にゃーにゃー'],en:['Genius','Science','Childlike','Nano','Cat']},radar:[72,85,78,80,82,62]},
  // ── 鬼灯の冷徹 ──
  {id:'hoozuki_hr',icon:'🏮',name:{ja:'鬼灯',en:'Hoozuki'},series:{ja:'鬼灯の冷徹',en:'Hoozuki\'s Coolheadedness'},type:{ja:'優秀な地獄の副官 (INTJ)',en:'Excellent Hell Vice Officer (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'閻魔大王の筆頭官僚。有能で冷静、趣味は植物育てと読書。地獄の業務を完璧にこなしつつ毒舌も振るう。',en:'Chief bureaucrat of King Yama. Capable and calm; hobbies are growing plants and reading. Perfectly handles hell\'s affairs while being sharp-tongued.'},traits:{ja:['有能','冷静','毒舌','地獄','趣味'],en:['Capable','Calm','Sharp-tongue','Hell','Hobbies']},radar:[52,92,90,42,90,92]},
  // ── アクセル・ワールド ──
  {id:'haru_aw',icon:'🐷',name:{ja:'有田春雪',en:'Haruyuki Arita'},series:{ja:'アクセル・ワールド',en:'Accel World'},type:{ja:'自信のない飛翔者 (INFP)',en:'Unconfident Flier (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'いじめられっ子だったが仮想世界で翼を持つアバターを得た少年。黒雪姫との絆で成長を続ける。',en:'A bullied boy who gained an avatar with wings in the virtual world. Continues to grow through his bond with Kuroyukihime.'},traits:{ja:['成長','翼','仮想世界','コンプレックス','絆'],en:['Growth','Wings','Virtual World','Complex','Bond']},radar:[42,68,65,72,65,68]},
  {id:'kuroyukihime_aw',icon:'🦋',name:{ja:'黒雪姫',en:'Kuroyukihime'},series:{ja:'アクセル・ワールド',en:'Accel World'},type:{ja:'バーストリンカーの女王 (INTJ)',en:'Burst Linker Queen (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'ブレイン・バーストのトッププレイヤーで学校では生徒会長。春雪を見出し、共に頂点を目指す。',en:'Top player of Brain Burst and student council president at school. Discovers Haruyuki and aims for the top together.'},traits:{ja:['生徒会長','トップ','仮想世界','謎','絆'],en:['Student Council President','Top','Virtual World','Mystery','Bond']},radar:[55,90,88,58,88,88]},
  // ── デジモンアドベンチャー ──
  {id:'taichi_digimon',icon:'🥊',name:{ja:'八神太一',en:'Taichi Yagami'},series:{ja:'デジモンアドベンチャー',en:'Digimon Adventure'},type:{ja:'無謀なリーダー (ESTP)',en:'Reckless Leader (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'デジモンアドベンチャーの主人公でアグモンのパートナー。勇気の紋章を持つ天然系のリーダー。',en:'Protagonist of Digimon Adventure and partner of Agumon. Natural leader bearing the Crest of Courage.'},traits:{ja:['勇気','無謀','リーダー','友情','デジモン'],en:['Courage','Reckless','Leader','Friendship','Digimon']},radar:[85,52,48,85,52,65]},
  {id:'yamato_digimon',icon:'🎸',name:{ja:'石田ヤマト',en:'Yamato Ishida'},series:{ja:'デジモンアドベンチャー',en:'Digimon Adventure'},type:{ja:'孤高のロッカー (INTJ)',en:'Solitary Rocker (INTJ)'},profile:{I:4,T:3,N:3,J:3},desc:{ja:'友情の紋章を持つ孤高のバンドマン。弟ガブモンへの愛情と自立への葛藤を抱えながら成長する。',en:'Solitary band member bearing the Crest of Friendship. Grows while carrying affection for brother Gabumon and conflict with independence.'},traits:{ja:['友情','孤高','ロック','弟','成長'],en:['Friendship','Solitary','Rock','Brother','Growth']},radar:[58,72,70,72,70,75]},
  // ── ポケットモンスター ──
  {id:'satoshi_pokemon',icon:'🎒',name:{ja:'サトシ',en:'Ash Ketchum'},series:{ja:'ポケットモンスター',en:'Pokémon'},type:{ja:'ポケモンマスターを目指す少年 (ESFP)',en:'Boy Aiming for Pokemon Master (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'世界チャンピオンを目指してポケモンと旅を続ける少年。諦めない心と仲間への深い絆が武器。',en:'A boy who continues traveling with Pokémon to become world champion. Indomitable spirit and deep bonds with friends are his weapons.'},traits:{ja:['夢','旅','ポケモン','友情','諦めない'],en:['Dream','Journey','Pokémon','Friendship','Never Give Up']},radar:[88,42,38,92,42,65]},
  {id:'pikachu_pokemon',icon:'⚡',name:{ja:'ピカチュウ',en:'Pikachu'},series:{ja:'ポケットモンスター',en:'Pokémon'},type:{ja:'電気ねずみポケモン (ESFP)',en:'Electric Mouse Pokémon (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'サトシの相棒でアイコン的存在。忠実で勇敢、困難に立ち向かう姿が世界中のファンに愛されている。',en:'Ash\'s partner and iconic presence. Loyal and brave; the figure facing difficulties is loved by fans worldwide.'},traits:{ja:['電気','忠実','勇気','相棒','アイコン'],en:['Electric','Loyal','Brave','Partner','Iconic']},radar:[75,38,35,90,38,60]},
  // ── ドラゴンボール GT/超追加 ──
  {id:'goten_db',icon:'💪',name:{ja:'孫悟天',en:'Goten'},series:{ja:'ドラゴンボール',en:'Dragon Ball'},type:{ja:'素直な末っ子 (ESFP)',en:'Honest Youngest Son (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'悟空の次男で超サイヤ人になった最年少記録を持つ。トランクスと共に「ゴテンクス」に合体する。',en:'Goku\'s second son who holds the record for youngest Super Saiyan. Fuses with Trunks into "Gotenks."'},traits:{ja:['純粋','合体','最年少','友情','無邪気'],en:['Pure','Fusion','Youngest','Friendship','Innocent']},radar:[72,42,38,88,42,60]},
  // ── ノーゲーム・ノーライフ追加 ──
  {id:'jibril_ngnl',icon:'📚',name:{ja:'ジブリール',en:'Jibril'},series:{ja:'ノーゲーム・ノーライフ',en:'No Game No Life'},type:{ja:'知識狂の天翼種 (ENTP)',en:'Knowledge-Obsessed Flügel (ENTP)'},profile:{E:3,N:4,T:4,P:4},desc:{ja:'知識を愛する天翼種の最下位。空白兄妹との賭けに負けて彼らに仕えることになる。知性と破壊的な力を持つ。',en:'The lowest-ranked Flügel who loves knowledge. Lost a bet to the Blank siblings and came to serve them. Possesses intellect and destructive power.'},traits:{ja:['知識','天翼種','破壊','賭け','忠誠'],en:['Knowledge','Flügel','Destruction','Bet','Loyalty']},radar:[62,95,90,50,95,82]},
  // ── ヘタリア ──
  {id:'italy_htl',icon:'🍕',name:{ja:'イタリア',en:'Italy'},series:{ja:'ヘタリア',en:'Hetalia'},type:{ja:'陽気なお気楽イタリア (ESFP)',en:'Cheerful Carefree Italy (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'パスタとコルネットを愛する自由奔放なイタリア。白旗を持ってすぐ逃げる姿が印象的な平和主義者。',en:'Freedom-loving Italy who loves pasta and cornets. A pacifist famous for quickly fleeing with a white flag.'},traits:{ja:['パスタ','平和主義','白旗','陽気','食いしん坊'],en:['Pasta','Pacifist','White Flag','Cheerful','Foodie']},radar:[85,35,28,95,32,45]},
  {id:'germany_htl',icon:'🍺',name:{ja:'ドイツ',en:'Germany'},series:{ja:'ヘタリア',en:'Hetalia'},type:{ja:'厳格な努力家 (ISTJ)',en:'Strict Hard Worker (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'マジメで規律を重んじるドイツ。イタリアの世話に苦労しながらも仲間を見捨てることはしない。',en:'Serious Germany who values discipline. Struggles with taking care of Italy but never abandons his comrades.'},traits:{ja:['規律','マジメ','努力','秩序','友情'],en:['Discipline','Serious','Effort','Order','Friendship']},radar:[62,80,80,62,80,88]},
  // ── バクマン ──
  {id:'mashiro_bkm',icon:'✏️',name:{ja:'真城最高',en:'Moritaka Mashiro'},series:{ja:'バクマン。',en:'Bakuman'},type:{ja:'夢を追う漫画家 (ISFP)',en:'Dream-Chasing Manga Artist (ISFP)'},profile:{I:3,S:4,F:4,P:3},desc:{ja:'漫画家を夢見る少年。亜豆美保との約束を胸に、漫画連載を目指して努力し続ける。',en:'A boy who dreams of becoming a manga artist. With his promise to Miho Azuki in his heart, he keeps working toward getting a manga serialized.'},traits:{ja:['漫画','夢','努力','約束','愛'],en:['Manga','Dream','Effort','Promise','Love']},radar:[62,72,68,80,70,75]},
  {id:'takagi_bkm',icon:'✏️',name:{ja:'高木秋人',en:'Akito Takagi'},series:{ja:'バクマン。',en:'Bakuman'},type:{ja:'天才原作者 (ENTP)',en:'Genius Original Author (ENTP)'},profile:{E:3,N:4,T:4,P:3},desc:{ja:'漫画の原作を担当する天才的な文章力を持つ少年。真城とのコンビでジャンプ連載を目指す野心家。',en:'A boy with genius writing ability who handles manga scripts. An ambitious young man aiming for Jump serialization together with Mashiro.'},traits:{ja:['原作','天才','文章','野心','コンビ'],en:['Story','Genius','Writing','Ambition','Duo']},radar:[65,82,80,68,82,80]},
  // ── ヤングジャンプ系 / 花の慶次 ──
  {id:'keiji_kc',icon:'⚔️',name:{ja:'前田慶次',en:'Keiji Maeda'},series:{ja:'花の慶次',en:'Flower of Keiji Maeda'},type:{ja:'戦国の傾奇者 (ESFP)',en:'Eccentric Warring States Hero (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'戦国時代の傾奇者で豪快かつ自由な武将。強さと自由を愛し、縛られることを嫌う。',en:'An eccentric warrior of the Warring States era who is boisterous and free. Loves strength and freedom, hates being restrained.'},traits:{ja:['傾奇者','自由','豪快','強さ','戦国'],en:['Eccentric','Freedom','Boisterous','Strength','Warring States']},radar:[85,62,55,82,58,70]},
  // ── 彼氏彼女の事情 ──
  {id:'yukino_kkk',icon:'📖',name:{ja:'宮沢雪野',en:'Yukino Miyazawa'},series:{ja:'彼氏彼女の事情',en:'His and Her Circumstances'},type:{ja:'完璧主義の二面性 (INTJ)',en:'Perfectionist Dual Nature (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'学校では完璧な優等生のふりをするが、家では本性をさらけ出す。有馬との恋愛で本当の自分に気づく。',en:'Pretends to be a perfect honor student at school, but reveals her true self at home. Discovers her true self through romance with Arima.'},traits:{ja:['二面性','完璧','恋愛','成長','本音'],en:['Dual Nature','Perfect','Romance','Growth','True Self']},radar:[55,82,80,58,80,82]},
  // ── シュタインズ・ゲート追加 ──
  {id:'ruka_sg',icon:'🌸',name:{ja:'桐生萌郁',en:'Moeka Kiryu'},series:{ja:'シュタインズ・ゲート',en:'Steins;Gate'},type:{ja:'静かなSNSの刺客 (INTJ)',en:'Quiet SNS Assassin (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'携帯電話でしかコミュニケーションが取れない謎の少女。その背後にはFBとの繋がりが隠れている。',en:'A mysterious girl who can only communicate through her phone. Behind her lurk connections to FB.'},traits:{ja:['謎','携帯','静か','裏切り','喪失'],en:['Mystery','Phone','Quiet','Betrayal','Loss']},radar:[38,72,70,38,72,72]},
  // ── ベルセルク ──
  {id:'guts_berserk',icon:'⚔️',name:{ja:'ガッツ',en:'Guts'},series:{ja:'ベルセルク',en:'Berserk'},type:{ja:'黒い剣士 (ISTP)',en:'Black Swordsman (ISTP)'},profile:{I:4,S:4,T:4,P:3},desc:{ja:'巨大な鉄塊の剣「ドラゴンころし」を扱う戦士。過酷な運命と戦いながらも前に進み続ける鋼の意志の持ち主。',en:'A warrior who wields the enormous iron sword "Dragonslayer." Has iron will to keep moving forward while fighting a cruel fate.'},traits:{ja:['剣','運命','孤独','意志','復讐'],en:['Sword','Fate','Solitude','Will','Revenge']},radar:[88,55,52,58,55,72]},
  {id:'griffith_berserk',icon:'👑',name:{ja:'グリフィス',en:'Griffith'},series:{ja:'ベルセルク',en:'Berserk'},type:{ja:'夢の化身 (ENTJ)',en:'Incarnation of Dreams (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'白鷹団の団長で夢のために全てを犠牲にした人物。美しい外見と圧倒的なカリスマ、そして裏切りの象徴。',en:'Leader of the Band of the Hawk who sacrificed everything for his dream. Symbol of beautiful appearance, overwhelming charisma, and betrayal.'},traits:{ja:['夢','カリスマ','裏切り','美しさ','野望'],en:['Dream','Charisma','Betrayal','Beauty','Ambition']},radar:[58,95,92,48,95,90]},
  // ── ランマ½ ──
  {id:'ranma_char',icon:'🥋',name:{ja:'早乙女乱馬',en:'Ranma Saotome'},series:{ja:'らんま½',en:'Ranma ½'},type:{ja:'性転換格闘家 (ESTP)',en:'Gender-Bending Martial Artist (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'水に濡れると女になる格闘家。熱血でプライドが高く、アカネへの感情を素直に出せないツンデレ。',en:'A martial artist who turns into a girl when wet. Hot-blooded and proud, unable to honestly express feelings for Akane.'},traits:{ja:['格闘','性転換','ツンデレ','プライド','強さ'],en:['Martial Arts','Gender Swap','Tsundere','Pride','Strength']},radar:[85,58,55,62,58,68]},
  {id:'akane_ranma',icon:'🔨',name:{ja:'天道あかね',en:'Akane Tendo'},series:{ja:'らんま½',en:'Ranma ½'},type:{ja:'乙女な格闘家 (ESFP)',en:'Girly Martial Artist (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'天道道場の娘で格闘家。料理下手で怒りっぽいが心優しい。乱馬への感情は複雑だが本当は好き。',en:'Daughter of Tendo Dojo and martial artist. Bad at cooking and quick to anger, but kind-hearted. Complex feelings for Ranma, but truly likes him.'},traits:{ja:['格闘','短気','料理下手','優しさ','恋'],en:['Martial Arts','Hot-tempered','Bad Cook','Kindness','Love']},radar:[80,52,48,80,52,65]},
  // ── うる星やつら ──
  {id:'lum_uy',icon:'⚡',name:{ja:'ラム',en:'Lum'},series:{ja:'うる星やつら',en:'Urusei Yatsura'},type:{ja:'宇宙人の愛妻 (ENFP)',en:'Alien Loving Wife (ENFP)'},profile:{E:4,N:3,F:4,P:4},desc:{ja:'オニ星人の少女で「だっちゃ」が口癖。あたるを心から愛する純粋な少女で、電撃で攻撃する。',en:'An Oni alien girl whose catchphrase is "Datcha." A pure girl who genuinely loves Ataru, attacking with lightning bolts.'},traits:{ja:['宇宙人','オニ','電撃','純粋','愛'],en:['Alien','Oni','Lightning','Pure','Love']},radar:[88,42,38,96,42,62]},
  {id:'ataru_uy',icon:'💘',name:{ja:'諸星あたる',en:'Ataru Moroboshi'},series:{ja:'うる星やつら',en:'Urusei Yatsura'},type:{ja:'ダメ男の純愛 (ESFP)',en:'Pure Love from a Good-for-Nothing (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'女性を見ると手当たり次第に口説くダメ男だが、実はラムへの深い愛情を持つ。運が良くも悪くも激しい。',en:'A good-for-nothing who chases every woman, but actually has deep love for Lum. Extremely lucky and unlucky.'},traits:{ja:['軟派','ダメ男','幸運','純愛','コメディ'],en:['Womanizer','Good-for-Nothing','Lucky','Pure Love','Comedy']},radar:[75,35,32,80,35,52]},
  // ── シティーハンター ──
  {id:'ryo_ch',icon:'🔫',name:{ja:'冴羽獠',en:'Ryo Saeba'},series:{ja:'シティーハンター',en:'City Hunter'},type:{ja:'腕利きのスケベな探偵 (ESTP)',en:'Skilled Perverted Detective (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'新宿を拠点とする腕利きのスイーパー。女性を見るとモッコリするスケベだが、依頼のためには命を懸ける。',en:'A skilled sweeper based in Shinjuku. Perverted around women, but risked his life for clients.'},traits:{ja:['スイーパー','スケベ','腕利き','信義','孤独'],en:['Sweeper','Perverted','Skilled','Integrity','Solitude']},radar:[82,62,58,72,60,72]},
  // ── 剣心 追加 ──
  {id:'aoshi_kk',icon:'🗡️',name:{ja:'斎藤一',en:'Hajime Saito'},series:{ja:'るろうに剣心',en:'Rurouni Kenshin'},type:{ja:'悪即斬の警察官 (ISTJ)',en:'Brutal Justice Police Officer (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'明治政府の警察官で元新撰組三番隊隊長。「悪・即・斬」の信念のもと、剣心と対立しつつも協力する。',en:'Meiji government police officer and former Captain of Shinsengumi 3rd Division. Based on "Evil must be slain," opposes yet cooperates with Kenshin.'},traits:{ja:['悪即斬','新撰組','信念','冷静','誇り'],en:['Slay Evil','Shinsengumi','Belief','Calm','Pride']},radar:[62,82,85,52,82,92]},
  // ── 封神演義 ──
  {id:'taikobo_fe',icon:'🎣',name:{ja:'太公望',en:'Taikobou'},series:{ja:'封神演義',en:'Soul Hunter'},type:{ja:'だらけた戦略家 (ENTP)',en:'Lazy Strategist (ENTP)'},profile:{E:3,N:4,T:4,P:4},desc:{ja:'封神計画を実行する道士だが釣りが大好き。怠け者に見えて実は非常に優れた戦略家。',en:'A Tao master executing the Investiture of the Gods plan who loves fishing. Appears lazy but is actually an excellent strategist.'},traits:{ja:['怠け者','戦略','釣り','実力','計画'],en:['Lazy','Strategy','Fishing','Skill','Plan']},radar:[55,88,85,55,88,75]},
  // ── 東京グール追加 ──
  {id:'touka_tg',icon:'🐇',name:{ja:'霧嶋董香',en:'Touka Kirishima'},series:{ja:'東京喰種',en:'Tokyo Ghoul'},type:{ja:'強気な喰種少女 (ISTJ)',en:'Bold Ghoul Girl (ISTJ)'},profile:{I:3,S:3,T:3,J:4},desc:{ja:'アンテイクのアルバイトで喰種。最初は敵対的だが、カネキとの関係で人間的な面を見せていく。',en:'Ghoul who works at Anteiku. Initially hostile, but shows a human side through her relationship with Kaneki.'},traits:{ja:['喰種','強気','成長','人間性','愛'],en:['Ghoul','Bold','Growth','Humanity','Love']},radar:[72,68,65,65,68,75]},
  // ── ブルーロック追加 ──
  {id:'isagi2_bl',icon:'⚽',name:{ja:'蜂楽廻',en:'Meguru Bachira'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'怪物的なドリブラー (ESFP)',en:'Monstrous Dribbler (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'心の中に「怪物」を住まわせたドリブラー。直感で動き、サッカーを遊びのように楽しむ天才。',en:'A dribbler who keeps a "monster" inside his heart. Moves by instinct, a genius who enjoys soccer like play.'},traits:{ja:['ドリブル','怪物','直感','楽しさ','才能'],en:['Dribble','Monster','Instinct','Enjoyment','Talent']},radar:[88,45,40,88,48,65]},
  {id:'nagi_bl',icon:'⚽',name:{ja:'糸師凪',en:'Nagi Seishiro'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'無気力の天才 (ISTP)',en:'Lethargic Genius (ISTP)'},profile:{I:4,S:4,T:3,P:4},desc:{ja:'ゲームのような感覚でサッカーをする天才。凄まじいトラップ技術を持つが、基本的に面倒くさがり。',en:'A genius who plays soccer with a game-like sensibility. Has amazing trapping skills, but is basically lazy.'},traits:{ja:['天才','面倒','トラップ','直感','成長'],en:['Genius','Lazy','Trap','Instinct','Growth']},radar:[85,45,40,65,48,60]},
  {id:'rin_bl',icon:'⚽',name:{ja:'糸師凛',en:'Rin Itoshi'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'兄への執念 (INTJ)',en:'Obsession Toward Brother (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'兄・潔の敵として設定された天才選手。冷静で孤高、最強を目指す姿に圧倒的な説得力がある。',en:'A genius player set as an enemy of his brother Isagi. Calm and solitary; there is overwhelming conviction in his pursuit of being the best.'},traits:{ja:['兄','冷静','最強','孤高','執念'],en:['Brother','Calm','Strongest','Solitary','Obsession']},radar:[88,75,72,42,78,85]},
  // ── ヴィンランド・サガ追加 ──
  {id:'askeladd_vs',icon:'⚔️',name:{ja:'アシェラッド',en:'Askeladd'},series:{ja:'ヴィンランド・サガ',en:'Vinland Saga'},type:{ja:'策士の海賊王 (INTJ)',en:'Strategist Pirate King (INTJ)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'デンマークのバイキングの首領で策士。複雑な過去を持ち、トルフィンに対して師匠と宿敵の両面を持つ。',en:'Leader of a Danish Viking band and strategist. Has a complex past; holds both the role of mentor and sworn enemy toward Thorfinn.'},traits:{ja:['策士','バイキング','複雑','師匠','宿敵'],en:['Strategist','Viking','Complex','Mentor','Sworn Enemy']},radar:[55,92,88,45,90,82]},
  {id:'thors_vs',icon:'⚓',name:{ja:'トルズ',en:'Thors'},series:{ja:'ヴィンランド・サガ',en:'Vinland Saga'},type:{ja:'最強の戦士が求める平和 (INFJ)',en:'Strongest Warrior Seeking Peace (INFJ)'},profile:{I:3,S:4,T:3,J:4},desc:{ja:'かつて最強のバイキング戦士だが平和を求め故郷に帰る。トルフィンの父であり、真の戦士とは何かを示す存在。',en:'Once the greatest Viking warrior who returned home seeking peace. Thorfinn\'s father; an existence that shows what a true warrior is.'},traits:{ja:['最強','平和','父親','真の強さ','犠牲'],en:['Strongest','Peace','Father','True Strength','Sacrifice']},radar:[80,78,80,78,80,85]},
  // ── 鋼鉄城のカバネリ ──
  {id:'mumei_kab',icon:'🌸',name:{ja:'無名',en:'Mumei'},series:{ja:'甲鉄城のカバネリ',en:'Kabaneri of the Iron Fortress'},type:{ja:'半カバネの少女 (ISTP)',en:'Half-Kabane Girl (ISTP)'},profile:{I:3,S:4,T:3,P:4},desc:{ja:'半カバネと半人間のカバネリ。戦闘能力が高く兄への献身を持つが、内には人間への複雑な感情がある。',en:'A Kabaneri who is half-Kabane and half-human. High combat ability and devotion to her brother, but harbors complex feelings toward humans.'},traits:{ja:['カバネリ','半人間','戦闘','兄','成長'],en:['Kabaneri','Half-Human','Battle','Brother','Growth']},radar:[80,58,55,70,58,68]},
  // ── ラノベ / 艦これ系 ──
  {id:'fubuki_kc',icon:'⚓',name:{ja:'吹雪',en:'Fubuki'},series:{ja:'艦隊これくしょん',en:'KanColle'},type:{ja:'努力する普通の艦娘 (ISFJ)',en:'Hardworking Normal Ship Girl (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'主人公格の駆逐艦娘で「普通の艦娘」から最強を目指す。努力と仲間への愛情で成長する。',en:'Protagonist destroyer ship girl who aims for the top from being "ordinary." Grows through effort and love for comrades.'},traits:{ja:['普通','努力','成長','友情','意志'],en:['Ordinary','Effort','Growth','Friendship','Will']},radar:[60,65,62,78,62,72]},
  // ── 約束のネバーランド追加 ──
  {id:'phil_tpn',icon:'📚',name:{ja:'フィル',en:'Phil'},series:{ja:'約束のネバーランド',en:'The Promised Neverland'},type:{ja:'賢い幼い秘密の共有者 (INTJ)',en:'Wise Young Secret Keeper (INTJ)'},profile:{I:4,T:3,N:4,J:3},desc:{ja:'グレイス・フィールドハウスの最年少の賢い子供。実は全てを知りながら仲間のために留まる判断をした。',en:'The youngest wise child of Grace Field House. Actually knew everything but decided to stay for the sake of his friends.'},traits:{ja:['賢さ','秘密','信頼','幼さ','強さ'],en:['Wisdom','Secret','Trust','Youth','Strength']},radar:[45,82,80,70,80,78]},
  // ── カードキャプターさくら追加 ──
  {id:'tomoyo_ccs',icon:'🎬',name:{ja:'大道寺知世',en:'Tomoyo Daidoji'},series:{ja:'カードキャプターさくら',en:'Cardcaptor Sakura'},type:{ja:'さくらを愛するカメラ少女 (INFP)',en:'Camera Girl Who Loves Sakura (INFP)'},profile:{I:3,N:4,F:4,P:3},desc:{ja:'さくらの親友でさくらのファン。さくらの衣装を作り動画を撮ることが喜び。さくらへの献身的な愛。',en:'Sakura\'s best friend and fan. Finds joy in making Sakura\'s costumes and filming videos. Devoted love for Sakura.'},traits:{ja:['カメラ','衣装','友情','献身','愛'],en:['Camera','Costume','Friendship','Devotion','Love']},radar:[45,68,65,90,65,72]},
  // ── 魔法使いの嫁追加 ──
  {id:'elias_mab',icon:'🌿',name:{ja:'エリアス・エインズワース',en:'Elias Ainsworth'},series:{ja:'魔法使いの嫁',en:'The Ancient Magus\' Bride'},type:{ja:'感情を学ぶ魔法使い (INTJ)',en:'Mage Learning Emotions (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'骨の頭を持つ古い魔法使い。人間の感情に疎く、チセとの生活の中で感情を学んでいく。',en:'An ancient mage with a skull head. Poor at human emotions, gradually learning them through life with Chise.'},traits:{ja:['魔法','骨','感情学習','古さ','保護'],en:['Magic','Skull','Learning Emotions','Ancient','Protection']},radar:[42,88,85,48,85,80]},
  // ── CLANNAD追加 ──
  {id:'fuko_clannad',icon:'⭐',name:{ja:'一ノ瀬ことみ',en:'Kotomi Ichinose'},series:{ja:'CLANNAD',en:'CLANNAD'},type:{ja:'天才的な孤独の少女 (INFP)',en:'Genius Lonely Girl (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'成績トップの孤独な少女でバイオリンが趣味。親の死という過去の傷を抱えながらも前に進もうとする。',en:'A top-scoring lonely girl who plays violin. Tries to move forward while carrying the wound of her parents\' death.'},traits:{ja:['天才','孤独','バイオリン','過去','成長'],en:['Genius','Solitude','Violin','Past','Growth']},radar:[45,90,85,65,85,75]},
  {id:'kyou_clannad',icon:'🐱',name:{ja:'藤林杏',en:'Kyou Fujibayashi'},series:{ja:'CLANNAD',en:'CLANNAD'},type:{ja:'元気な学級委員長 (ESTP)',en:'Energetic Class Representative (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'活発で気が強い学級委員長。妹の芽依への愛情が深く、時に乱暴な手段も辞さない。',en:'Energetic and strong-willed class representative. Deep love for younger sister Mei, sometimes not hesitating to use rough methods.'},traits:{ja:['元気','気が強い','妹','委員長','感情'],en:['Energetic','Strong-willed','Sister','Class Rep','Emotion']},radar:[82,60,55,80,58,70]},
  // ── エンジェルビーツ追加 ──
  {id:'hinata_ab',icon:'🔔',name:{ja:'日向秀樹',en:'Hideki Hinata'},series:{ja:'Angel Beats!',en:'Angel Beats!'},type:{ja:'誠実な野球少年 (ESFJ)',en:'Sincere Baseball Boy (ESFJ)'},profile:{E:3,S:3,F:4,J:3},desc:{ja:'野球が得意で誠実な青年。現世での後悔を抱えながら、ゆりたちと共に神へ反旗を翻す。',en:'An honest young man who excels at baseball. Bears regrets from life, rebelling against God with Yuri and others.'},traits:{ja:['野球','誠実','後悔','友情','成長'],en:['Baseball','Sincere','Regret','Friendship','Growth']},radar:[72,65,62,80,62,72]},
  {id:'naoi_ab',icon:'📸',name:{ja:'直井文人',en:'Ayato Naoi'},series:{ja:'Angel Beats!',en:'Angel Beats!'},type:{ja:'偽りの神に自虐の画家 (INTJ)',en:'Self-Deprecating Painter as False God (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'自らを神と称した人物。催眠術を使う一方で、写真や芸術への愛情と自分自身への深い傷を持つ。',en:'A person who called himself God. Uses hypnosis while also having love for photography/art and deep wounds toward himself.'},traits:{ja:['神','催眠術','芸術','自虐','成長'],en:['God','Hypnosis','Art','Self-deprecation','Growth']},radar:[42,75,72,45,72,75]},
  // ── No.6 ──
  {id:'shion_n6',icon:'🐭',name:{ja:'紫苑',en:'Shion'},series:{ja:'No.6',en:'No.6'},type:{ja:'純粋な知識人 (INFP)',en:'Pure Intellectual (INFP)'},profile:{I:3,N:4,F:4,P:3},desc:{ja:'管理都市No.6で育った天才少年。ネズミとの出会いで管理社会の歪みに気づき、真実を求めて戦う。',en:'A genius boy raised in controlled city No.6. An encounter with Rat makes him realize the distortions of the controlled society, fighting to seek the truth.'},traits:{ja:['天才','純粋','管理社会','自由','真実'],en:['Genius','Pure','Controlled Society','Freedom','Truth']},radar:[52,80,78,72,78,72]},
  // ── Fate追加 ──
  {id:'cu_chulainn',icon:'🏹',name:{ja:'クー・フーリン',en:'Cu Chulainn'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'戦闘狂の英雄 (ESTP)',en:'Battle-Crazed Hero (ESTP)'},profile:{E:3,S:4,T:4,P:4},desc:{ja:'アイルランドの英雄でランサーのサーヴァント。戦闘を楽しみ、ゲイ・ボルクという必中の槍を使う。',en:'Irish hero and Lancer Servant. Enjoys combat, using the sure-hit spear Gáe Bolg.'},traits:{ja:['戦闘','槍','英雄','アイルランド','楽しむ'],en:['Battle','Spear','Hero','Ireland','Enjoyment']},radar:[85,65,60,75,62,72]},
  {id:'gilgamesh_fate',icon:'⚜️',name:{ja:'ギルガメッシュ',en:'Gilgamesh'},series:{ja:'Fate/stay night',en:'Fate/stay night'},type:{ja:'英雄王の傲慢 (ENTJ)',en:'Arrogance of the King of Heroes (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'全英雄の祖たる英雄王。「雑種」と言い放つ傲慢な態度で全ての財宝を持つが、最強を誇る存在。',en:'The King of Heroes, ancestor of all heroes. Arrogantly calls others "mongrels" while possessing all treasures; proud of being the strongest.'},traits:{ja:['英雄王','傲慢','財宝','最強','孤独'],en:['King of Heroes','Arrogance','Treasure','Strongest','Solitude']},radar:[52,98,90,32,98,92]},
  {id:'scathach_fate',icon:'🌑',name:{ja:'スカサハ',en:'Scathach'},series:{ja:'Fate/Grand Order',en:'Fate/Grand Order'},type:{ja:'不死の武人 (ISTJ)',en:'Immortal Warrior (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'ケルト神話の女王でクー・フーリンの師匠。孤独を愛し、死を求める不老不死の武人。',en:'Celtic mythological queen and Cu Chulainn\'s mentor. A warrior of immortality who loves solitude and seeks death.'},traits:{ja:['不死','師匠','孤独','武人','ケルト'],en:['Immortal','Mentor','Solitude','Warrior','Celtic']},radar:[65,88,88,52,88,90]},
  // ── 異世界追加 ──
  {id:'hajime_ar',icon:'🔫',name:{ja:'南雲ハジメ',en:'Hajime Nagumo'},series:{ja:'ありふれた職業で世界最強',en:'Arifureta'},type:{ja:'奈落の最強者 (INTJ)',en:'Strongest of the Abyss (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'最弱だったが奈落に落とされ最強の錬成師になった。冷酷に見えるが仲間への愛情は本物。',en:'Once weakest but fell into the abyss and became the strongest Synergist. Appears cold but has genuine affection for companions.'},traits:{ja:['最強','奈落','成長','冷酷','愛情'],en:['Strongest','Abyss','Growth','Cold','Affection']},radar:[62,90,88,52,88,85]},
  {id:'yue_ar',icon:'🌙',name:{ja:'ユエ',en:'Yue'},series:{ja:'ありふれた職業で世界最強',en:'Arifureta'},type:{ja:'封印された吸血姫 (INFJ)',en:'Sealed Vampire Princess (INFJ)'},profile:{I:4,N:4,F:3,J:3},desc:{ja:'300年以上封印されていた吸血族の少女。ハジメとの出会いで初めて人を愛することを知る。',en:'A vampire girl sealed for over 300 years. First learns to love a person through her encounter with Hajime.'},traits:{ja:['吸血族','封印','愛','成長','静か'],en:['Vampire','Seal','Love','Growth','Quiet']},radar:[48,82,80,65,80,78]},
  {id:'seiya_ch',icon:'🛡️',name:{ja:'リスタルテ',en:'Listarte'},series:{ja:'慎重勇者',en:'Cautious Hero'},type:{ja:'うろたえる女神 (ENFJ)',en:'Flustered Goddess (ENFJ)'},profile:{E:4,N:3,F:4,J:3},desc:{ja:'世界を救うために勇者を召喚した女神。慎重すぎるセイヤに翻弄されながらも一緒に世界を救う。',en:'A goddess who summoned a hero to save the world. Overwhelmed by the overly cautious Seiya but saves the world together.'},traits:{ja:['女神','おっちょこちょい','奮闘','友情','成長'],en:['Goddess','Clumsy','Struggle','Friendship','Growth']},radar:[72,52,48,82,52,62]},
  {id:'myne_ab',icon:'📚',name:{ja:'マイン',en:'Myne'},series:{ja:'本好きの下剋上',en:'Ascendance of a Bookworm'},type:{ja:'本への愛情 (INTJ)',en:'Love of Books (INTJ)'},profile:{I:4,N:4,F:3,J:4},desc:{ja:'本好きの司書志望だった女性が虚弱体質の少女として転生。あらゆる困難を乗り越えて本を作ろうとする。',en:'A book-loving aspiring librarian reincarnated as a frail girl. Overcomes all difficulties trying to create books.'},traits:{ja:['本','知識','意志','転生','創造'],en:['Books','Knowledge','Will','Reincarnation','Creation']},radar:[42,90,88,55,88,85]},
  // ── アカメが斬る！ ──
  {id:'akame_ag',icon:'🗡️',name:{ja:'アカメ',en:'Akame'},series:{ja:'アカメが斬る！',en:'Akame ga Kill!'},type:{ja:'帝国打倒の暗殺者 (ISTJ)',en:'Empire-Toppling Assassin (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'ナイトレイドの暗殺者でインペリアルアームズ「村雨」を持つ。妹への愛情と使命の間で戦い続ける。',en:'Assassin of Night Raid who holds the Imperial Arms "Murasame." Continues fighting between love for her sister and her mission.'},traits:{ja:['暗殺','剣','使命','妹','無表情'],en:['Assassination','Sword','Mission','Sister','Expressionless']},radar:[72,80,80,60,80,88]},
  {id:'tatsumi_ag',icon:'⚔️',name:{ja:'タツミ',en:'Tatsumi'},series:{ja:'アカメが斬る！',en:'Akame ga Kill!'},type:{ja:'純粋な成長型 (ESFP)',en:'Pure Growth Type (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'田舎から帝都に来た少年で、現実の残酷さに直面しながらナイトレイドに加わる。仲間への愛情で強くなる。',en:'A boy who came from the countryside to the capital; joins Night Raid while facing the cruel reality. Grows stronger through love for comrades.'},traits:{ja:['成長','純粋','仲間','強さ','悲劇'],en:['Growth','Pure','Comrades','Strength','Tragedy']},radar:[75,55,52,85,55,68]},
  {id:'mine_ag',icon:'🎯',name:{ja:'マイン',en:'Mine'},series:{ja:'アカメが斬る！',en:'Akame ga Kill!'},type:{ja:'ツンデレの天才狙撃手 (ESTP)',en:'Tsundere Genius Sniper (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'ナイトレイドのスナイパーでツンデレ。インペリアルアームズ「パーフェクトショット」で長距離狙撃を行う。',en:'Night Raid\'s sniper and tsundere. Performs long-range sniping with the Imperial Arms "Pumpkin."'},traits:{ja:['狙撃','ツンデレ','才能','誇り','愛'],en:['Sniping','Tsundere','Talent','Pride','Love']},radar:[80,65,60,70,62,72]},
  // ── ヘルシング ──
  {id:'alucard_hlz',icon:'🧛',name:{ja:'アーカード',en:'Alucard'},series:{ja:'HELLSING',en:'Hellsing'},type:{ja:'不滅の吸血鬼 (INTJ)',en:'Immortal Vampire (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ヘルシング機関に仕える最強の吸血鬼。圧倒的な実力と死への渇望を持ちながら主人インテグラに仕える。',en:'The strongest vampire serving the Hellsing organization. With overwhelming power and thirst for death, serves master Integra.'},traits:{ja:['吸血鬼','最強','死','主従','圧倒'],en:['Vampire','Strongest','Death','Master-Servant','Overwhelming']},radar:[55,98,95,32,98,88]},
  {id:'seras_hlz',icon:'🔫',name:{ja:'セラス・ヴィクトリア',en:'Seras Victoria'},series:{ja:'HELLSING',en:'Hellsing'},type:{ja:'成長する半吸血鬼 (ISFJ)',en:'Growing Half-Vampire (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'元警察官でアーカードに吸血鬼化された少女。正義感と人間への愛着を持ちながら吸血鬼の力を受け入れる。',en:'Former police officer turned vampire by Alucard. Accepts vampire powers while holding sense of justice and attachment to humans.'},traits:{ja:['半吸血鬼','正義','成長','元警察','愛着'],en:['Half-Vampire','Justice','Growth','Ex-Police','Attachment']},radar:[65,62,58,75,60,70]},
  // ── ガールズ＆パンツァー ──
  {id:'miho_gpz',icon:'🛡️',name:{ja:'西住みほ',en:'Miho Nishizumi'},series:{ja:'ガールズ＆パンツァー',en:'Girls und Panzer'},type:{ja:'仲間思いの戦車道少女 (INFJ)',en:'Friend-Caring Tankery Girl (INFJ)'},profile:{I:3,N:3,F:4,J:3},desc:{ja:'戦車道で異端と呼ばれた少女だが、仲間のために戦車を捨てた過去を持つ。仲間への愛情が強み。',en:'Called a heretic in tankery, but has a past of abandoning her tank for her friends. Love for comrades is her strength.'},traits:{ja:['戦車','友情','異端','愛情','成長'],en:['Tank','Friendship','Heretic','Love','Growth']},radar:[62,72,70,85,70,75]},
  // ── 昭和元禄落語心中 ──
  {id:'kikuhiko_rks',icon:'🎙️',name:{ja:'菊比古',en:'Kikuhiko'},series:{ja:'昭和元禄落語心中',en:'Shouwa Genroku Rakugo Shinjuu'},type:{ja:'落語を生きる孤高の師匠 (INTJ)',en:'Solitary Master Living in Rakugo (INTJ)'},profile:{I:4,T:3,N:4,J:4},desc:{ja:'落語に全てを捧げた孤高の落語家。芸への完璧主義と人生の孤独が絡み合う複雑な人物。',en:'A solitary rakugo performer who devoted everything to the art. A complex individual where perfectionism in art and life\'s loneliness are intertwined.'},traits:{ja:['落語','孤高','芸術','完璧','孤独'],en:['Rakugo','Solitary','Art','Perfect','Solitude']},radar:[42,88,85,48,88,88]},
  // ── ゆるキャン△追加 ──
  {id:'aoi_yc',icon:'🏕️',name:{ja:'大垣千明',en:'Chiaki Ogaki'},series:{ja:'ゆるキャン△',en:'Yuru Camp'},type:{ja:'企画好きなアウトドア部長 (ENFP)',en:'Planning-Loving Outdoor Club President (ENFP)'},profile:{E:4,N:4,F:3,P:4},desc:{ja:'野外活動サークルの部長で積極的にキャンプを企画する。口だけでなく実際に動く情熱家。',en:'President of Outdoor Activities Club who actively plans camping trips. A passionate person who not only talks but actually acts.'},traits:{ja:['キャンプ','企画','積極的','部長','情熱'],en:['Camping','Planning','Proactive','President','Passion']},radar:[82,60,55,82,60,68]},
  // ── 呪術廻戦（追加）──
  {id:'kugisaki2_jjk',icon:'⚔️',name:{ja:'虎杖悠仁',en:'Yuji Itadori'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'肉体派の呪術師 (ESFP)',en:'Physical Jujutsu Sorcerer (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'両面宿儺の器として呪術高専に入学した少年。底なしの体力と正義感で、「正しい死」を人々に与えることを使命とする。',en:'A boy who entered Jujutsu High as the vessel for Ryomen Sukuna. With bottomless stamina and sense of justice, considers his mission to give people "a proper death."'},traits:{ja:['体力','正義','宿儺の器','努力','強さ'],en:['Stamina','Justice','Vessel','Effort','Strength']},radar:[85,52,48,88,52,72]},
  // ── ラブライブ!サンシャイン!! ──
  {id:'chika_lls',icon:'🍊',name:{ja:'高海千歌',en:'Chika Takami'},series:{ja:'ラブライブ！サンシャイン!!',en:'Love Live! Sunshine!!'},type:{ja:'輝きを求めるリーダー (ESFP)',en:'Leader Seeking Radiance (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'Aqoursのリーダーで普通の女の子。μ\'sへの憧れからスクールアイドルを始め、自分たちだけの輝きを見つける。',en:'Leader of Aqours and an ordinary girl. Starts school idols inspired by μ\'s, finding their own unique radiance.'},traits:{ja:['輝き','普通','努力','リーダー','夢'],en:['Radiance','Ordinary','Effort','Leader','Dream']},radar:[85,48,42,95,48,65]},
  {id:'you_lls',icon:'⛵',name:{ja:'渡辺曜',en:'You Watanabe'},series:{ja:'ラブライブ！サンシャイン!!',en:'Love Live! Sunshine!!'},type:{ja:'自由なセーラー少女 (ESFP)',en:'Free Sailor Girl (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'千歌の幼なじみで海と船が好き。セーラー服の衣装デザインを担当し、明るく前向きなムードメーカー。',en:'Chika\'s childhood friend who loves the sea and ships. In charge of sailor uniform costume design; a bright and positive mood-maker.'},traits:{ja:['海','セーラー','幼なじみ','明るさ','デザイン'],en:['Sea','Sailor','Childhood Friend','Brightness','Design']},radar:[82,52,48,90,52,65]},
  {id:'riko_lls',icon:'🎹',name:{ja:'桜内梨子',en:'Riko Sakurauchi'},series:{ja:'ラブライブ！サンシャイン!!',en:'Love Live! Sunshine!!'},type:{ja:'完璧主義のピアニスト (ISFJ)',en:'Perfectionist Pianist (ISFJ)'},profile:{I:3,S:3,T:3,J:4},desc:{ja:'音楽学校出身のピアニスト。完璧主義で悩んでいたが、千歌と出会ってアイドルとしての才能に目覚める。',en:'A pianist from a music school. Was troubled by perfectionism, but meeting Chika awakens her talent as an idol.'},traits:{ja:['ピアノ','完璧主義','才能','成長','音楽'],en:['Piano','Perfectionism','Talent','Growth','Music']},radar:[55,80,78,68,78,82]},
  // ── ブラッククローバー追加 ──
  {id:'yami_bc',icon:'⚔️',name:{ja:'ヤミ・スケヒロ',en:'Yami Sukehiro'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'圧力で導く団長 (ESTP)',en:'Captain Leading with Pressure (ESTP)'},profile:{E:4,S:4,T:4,P:3},desc:{ja:'黒の暴牛団長で異国出身の剣士。「超えろよ！」が口癖で、部下に限界を超えさせる豪快な団長。',en:'Captain of Black Bulls from a foreign land. "Surpass my expectations!" is his motto; a bold captain who makes his subordinates exceed their limits.'},traits:{ja:['団長','超える','剣','豪快','異国'],en:['Captain','Surpass','Sword','Bold','Foreign']},radar:[85,68,62,72,65,80]},
  {id:'charlotte_bc',icon:'🌹',name:{ja:'シャーロット・ローゼイ',en:'Charlotte Roselei'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'バラのツンデレ団長 (ISTJ)',en:'Rose Tsundere Captain (ISTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'蒼のバラ団長で呪いを受けた過去を持つ女性。プライドが高くツンデレだが、ヤミへの恋心は本物。',en:'Captain of Blue Rose with a cursed past. Proud and tsundere, but her love for Yami is genuine.'},traits:{ja:['バラ','ツンデレ','呪い','誇り','恋'],en:['Rose','Tsundere','Curse','Pride','Love']},radar:[55,80,80,58,78,85]},
  {id:'julius_bc',icon:'⭐',name:{ja:'ユリウス・ノヴァクロノ',en:'Julius Novachrono'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'魔法好きの魔法帝 (ENFP)',en:'Magic-Loving Wizard King (ENFP)'},profile:{E:3,N:4,F:3,P:4},desc:{ja:'魔法帝でありながら魔法への純粋な好奇心を持ち続ける人物。時間魔法を操る強者で心優しい王者。',en:'A Wizard King who maintains pure curiosity about magic. A powerful time magic user and kind-hearted ruler.'},traits:{ja:['魔法帝','時間','好奇心','優しさ','最強'],en:['Wizard King','Time','Curiosity','Kindness','Strongest']},radar:[75,82,80,78,82,82]},
  // ── フェアリーテイル追加 ──
  {id:'gajeel_ft',icon:'🔩',name:{ja:'ガジル・レッドフォックス',en:'Gajeel Redfox'},series:{ja:'FAIRY TAIL',en:'FAIRY TAIL'},type:{ja:'鉄の喧嘩師 (ISTP)',en:'Iron Brawler (ISTP)'},profile:{I:3,S:4,T:4,P:3},desc:{ja:'鉄の竜の滅竜魔法を使う竜殺し。最初はフェアリーテイルの敵だったが仲間になる。歌が致命的に下手。',en:'Dragon Slayer who uses Iron Dragon Slayer Magic. Initially Fairy Tail\'s enemy but becomes an ally. Fatally bad at singing.'},traits:{ja:['鉄','竜殺し','不器用','歌下手','誠実'],en:['Iron','Dragon Slayer','Clumsy','Bad Singer','Sincere']},radar:[82,55,50,62,52,68]},
  {id:'wendy_ft',icon:'🌊',name:{ja:'ウェンディ・マーベル',en:'Wendy Marvell'},series:{ja:'FAIRY TAIL',en:'FAIRY TAIL'},type:{ja:'天空の竜殺し (ISFJ)',en:'Sky Dragon Slayer (ISFJ)'},profile:{I:4,S:3,F:4,J:3},desc:{ja:'天空の竜の滅竜魔法を使う最年少の竜殺し。回復魔法を得意とし、仲間思いの優しい少女。',en:'Youngest Dragon Slayer who uses Sky Dragon Slayer Magic. Specializes in recovery magic; a kind girl who thinks of her comrades.'},traits:{ja:['天空','竜殺し','回復','幼さ','成長'],en:['Sky','Dragon Slayer','Recovery','Youth','Growth']},radar:[55,68,65,82,65,72]},
  {id:'laxus_ft',icon:'⚡',name:{ja:'ラクサス・ドレアー',en:'Laxus Dreyar'},series:{ja:'FAIRY TAIL',en:'FAIRY TAIL'},type:{ja:'雷の後継者 (INTJ)',en:'Lightning Heir (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'マカロフの孫でフェアリーテイルの中でも強い魔法師。傲慢だが仲間への愛は深く、最終的に頼れる仲間に。',en:'Makarov\'s grandson and one of the strongest mages in Fairy Tail. Arrogant but has deep love for comrades; ultimately becomes a reliable ally.'},traits:{ja:['雷','孤高','傲慢','成長','仲間'],en:['Lightning','Solitary','Arrogant','Growth','Comrades']},radar:[80,72,70,62,72,80]},
  {id:'mirajane_ft',icon:'😇',name:{ja:'ミラジェーン・ストラウス',en:'Mirajane Strauss'},series:{ja:'FAIRY TAIL',en:'FAIRY TAIL'},type:{ja:'天使の悪魔使い (ENFJ)',en:'Angel Demon Wielder (ENFJ)'},profile:{E:4,F:4,N:3,J:3},desc:{ja:'フェアリーテイルのアイドルで悪魔の力を使う魔法師。外見は天使のように優しいが戦うと悪魔に変身する。',en:'Fairy Tail\'s idol and mage who uses demonic power. Appears angel-like kind but transforms into a demon when fighting.'},traits:{ja:['天使','悪魔','変身','優しさ','強さ'],en:['Angel','Demon','Transform','Kindness','Strength']},radar:[75,70,68,88,68,78]},
  // ── 進撃の巨人追加 ──
  {id:'zeke_aot',icon:'🐒',name:{ja:'ジーク・イェーガー',en:'Zeke Yeager'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'哲学的な獣の巨人 (INTJ)',en:'Philosophical Beast Titan (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'獣の巨人で野球好きのエルディア人。安楽死計画という哲学的な思想を持つエレンの異母兄。',en:'Beast Titan and Eldian who loves baseball. Eldian half-brother of Eren with philosophical ideology of the Euthanasia Plan.'},traits:{ja:['獣の巨人','野球','哲学','安楽死計画','知性'],en:['Beast Titan','Baseball','Philosophy','Euthanasia Plan','Intelligence']},radar:[48,90,88,38,90,85]},
  {id:'gabi_aot',icon:'🏆',name:{ja:'ガビ・ブラウン',en:'Gabi Braun'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'勇士を夢見る少女 (ESTJ)',en:'Girl Dreaming of Warrior (ESTJ)'},profile:{E:4,S:4,T:4,J:4},desc:{ja:'マーレの戦士志望の少女でライナーの従妹。エルディア人を憎んでいたが島で変化していく成長型。',en:'A girl aspiring to be a Marleyan warrior and Reiner\'s cousin. Hated Eldians but gradually changes on the island; a growth type.'},traits:{ja:['勇士','成長','変化','誇り','従妹'],en:['Warrior','Growth','Change','Pride','Cousin']},radar:[72,65,62,65,62,72]},
  // ── 転生貴族の異世界冒険録 ──
  {id:'ciel_isekai',icon:'🌟',name:{ja:'アルス・ローベント',en:'Ars Louvent'},series:{ja:'転生貴族の異世界冒険録',en:'The Reincarnation of the Strongest Exorcist'},type:{ja:'鑑定眼の若き当主 (INTJ)',en:'Young Head with Appraisal Eyes (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'鑑定魔法を持つ貴族の息子。魔法力はないが人の才能を見抜く目でパーティをまとめるリーダー。',en:'Son of a noble with Appraisal magic. Has no magic power but is a leader who unites the party with the ability to see people\'s talents.'},traits:{ja:['鑑定','貴族','リーダー','転生','才能'],en:['Appraisal','Noble','Leader','Reincarnation','Talent']},radar:[42,85,82,58,82,85]},
  // ── 可愛ければ変態でも好きになってくれますか? ──
  {id:'kanade_kg',icon:'🎵',name:{ja:'神城かなで',en:'Kanade Amakusa'},series:{ja:'可愛ければ変態でも好きになってくれますか？',en:'Hensuki'},type:{ja:'優等生の隠れた一面 (INTJ)',en:'Honor Student\'s Hidden Side (INTJ)'},profile:{I:3,T:3,N:3,J:4},desc:{ja:'学校の優等生として知られているが、実は独特の趣味を持つ二面性のキャラクター。',en:'Known as an honor student at school, but actually a dual-natured character with unique hobbies.'},traits:{ja:['優等生','二面性','秘密','趣味','魅力'],en:['Honor Student','Dual Nature','Secret','Hobbies','Charm']},radar:[55,72,70,58,70,72]},
  // ── ダーカー・ザン・ブラック ──
  {id:'hei_dtb',icon:'⚡',name:{ja:'黒 (ヘイ)',en:'Hei'},series:{ja:'DARKER THAN BLACK',en:'DARKER THAN BLACK'},type:{ja:'人工の星を持つ請負人 (ISTP)',en:'Contractor with Artificial Star (ISTP)'},profile:{I:4,S:4,T:4,P:3},desc:{ja:'「中国電撃白書」の異名を持つ契約者。冷酷な暗殺者の顔と人情のある普通の顔を使い分ける。',en:'A Contractor with the alias "Black Reaper." Uses two faces: cold-blooded assassin and ordinary person with humanity.'},traits:{ja:['契約者','暗殺','二面性','電気','謎'],en:['Contractor','Assassin','Dual Nature','Electricity','Mystery']},radar:[65,80,78,52,80,82]},
  // ── ソードアート・オンライン追加 ──
  {id:'yuuki_sao',icon:'⚔️',name:{ja:'結城明日奈',en:'Yuuki'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'最強の剣士と短い命 (ENFP)',en:'Strongest Swordswoman and Short Life (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'SAOで最強の剣士。HIV感染者として現実の体は弱いが、VRの世界では全てを懸けて戦う。',en:'The strongest swordswoman in SAO. Her real body is weak as an HIV patient, but in VR she fights with everything she has.'},traits:{ja:['最強','剣士','病気','夢','強さ'],en:['Strongest','Swordsman','Illness','Dream','Strength']},radar:[88,72,68,90,70,80]},
  {id:'agil_sao',icon:'⚔️',name:{ja:'アギル',en:'Agil'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'頼れるキリト仲間 (ISFJ)',en:'Reliable Friend of Kirito (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'SAOでキリトを助ける頼れる仲間。現実では居酒屋の主人で、誠実で真面目な商人タイプ。',en:'A reliable ally who helps Kirito in SAO. In reality a tavern owner; sincere and serious merchant type.'},traits:{ja:['仲間','誠実','頼れる','商人','強さ'],en:['Comrade','Sincere','Reliable','Merchant','Strength']},radar:[68,65,60,80,62,72]},
  // ── プリキュア追加 ──
  {id:'honoka_pc',icon:'🌊',name:{ja:'雪城ほのか',en:'Honoka Yukishiro'},series:{ja:'ふたりはプリキュア',en:'Pretty Cure'},type:{ja:'科学の天才美少女 (ISTJ)',en:'Genius Science Beautiful Girl (ISTJ)'},profile:{I:3,S:3,T:4,J:4},desc:{ja:'プリキュアのキュアホワイト。学校の優等生で科学部に所属し、理系の才能を持つ落ち着いた少女。',en:'Cure White of Pretty Cure. School honor student in the science club; a calm girl with scientific talent.'},traits:{ja:['科学','優等生','冷静','友情','プリキュア'],en:['Science','Honor Student','Calm','Friendship','Pretty Cure']},radar:[52,85,82,72,82,85]},
  // ── 進撃追加 ──
  {id:'pieck_aot',icon:'🐾',name:{ja:'ピーク・フィンガー',en:'Pieck Finger'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'柔軟な車力の巨人 (INFP)',en:'Flexible Cart Titan (INFP)'},profile:{I:3,N:4,F:3,P:4},desc:{ja:'車力の巨人の使い手で知性派のマーレ戦士。柔軟な思考と状況を正確に把握する分析力が武器。',en:'Cart Titan user and intellectual Marleyan warrior. Flexible thinking and ability to accurately grasp situations are her weapons.'},traits:{ja:['車力','知性','柔軟','分析','忠義'],en:['Cart','Intelligence','Flexible','Analysis','Loyalty']},radar:[52,85,82,60,85,80]},
  // ── ドクターストーン追加 ──
  {id:'kohaku_ds2',icon:'🌸',name:{ja:'コハク',en:'Kohaku'},series:{ja:'Dr.STONE',en:'Dr. Stone'},type:{ja:'石世界の猛女戦士 (ESTP)',en:'Fierce Warrior of Stone World (ESTP)'},profile:{E:4,S:4,F:3,P:3},desc:{ja:'石の世界の戦士でルリとの姉妹関係を持つ。姉を助けるために全力で戦い、センクウたちを助ける。',en:'Warrior of the Stone World who has a sister relationship with Ruri. Fights with all her might to help her sister and aids Senku\'s group.'},traits:{ja:['戦士','姉妹','強さ','誠実','行動力'],en:['Warrior','Sisters','Strength','Sincere','Action']},radar:[82,58,55,82,58,72]},
  {id:'chrome_ds2',icon:'🔬',name:{ja:'クロム',en:'Chrome'},series:{ja:'Dr.STONE',en:'Dr. Stone'},type:{ja:'石世界の科学少年 (ENFP)',en:'Science Boy of Stone World (ENFP)'},profile:{E:4,N:4,F:3,P:4},desc:{ja:'石の世界で独自に科学を学んでいた少年。センクウと出会い科学文明の復興に情熱を燃やす。',en:'A boy who independently studied science in the Stone World. Burns with passion for restoring science civilization after meeting Senku.'},traits:{ja:['科学','好奇心','情熱','発見','成長'],en:['Science','Curiosity','Passion','Discovery','Growth']},radar:[78,68,65,82,68,70]},
  // ── 86追加 ──
  {id:'theo_86',icon:'🛡️',name:{ja:'テオ・コルネリウス',en:'Theo Cornelius'},series:{ja:'86-エイティシックス-',en:'86'},type:{ja:'スピアヘッドのジャガー (ISTP)',en:'Spearhead Jaguar (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'スピアヘッド中隊のメンバー。無口で実力派だが、仲間への信頼は揺るがない。シンエイとの絆が深い。',en:'Member of Spearhead Squadron. Quiet and skilled; his trust in comrades is unshakeable. Has a deep bond with Shinei.'},traits:{ja:['戦士','無口','仲間','信頼','強さ'],en:['Warrior','Quiet','Comrades','Trust','Strength']},radar:[72,68,62,68,62,75]},
  // ── ワールドトリガー ──
  {id:'osamu_wt',icon:'🔫',name:{ja:'三雲修',en:'Osamu Mikumo'},series:{ja:'ワールドトリガー',en:'World Trigger'},type:{ja:'平凡から最強を目指すリーダー (ISTJ)',en:'Leader Aiming for Best from Ordinary (ISTJ)'},profile:{I:3,S:3,T:3,J:4},desc:{ja:'ボーダーの近界民(ネイバー)対策組織の隊員。強さよりも戦術と仲間との連携で道を切り開く。',en:'Member of Border, the Neighbor countermeasure organization. Opens paths through tactics and teamwork with comrades rather than raw strength.'},traits:{ja:['戦術','連携','成長','責任','粘り'],en:['Tactics','Teamwork','Growth','Responsibility','Persistence']},radar:[55,80,78,68,78,82]},
  {id:'yuma_wt',icon:'⭐',name:{ja:'空閑遊真',en:'Yuma Kuga'},series:{ja:'ワールドトリガー',en:'World Trigger'},type:{ja:'強さに素直な戦闘少年 (ISTP)',en:'Honest Battle Boy (ISTP)'},profile:{I:3,S:4,T:4,P:4},desc:{ja:'近界からやってきた強い少年。戦闘経験豊富で常識に縛られないが、仲間には素直な態度を見せる。',en:'A strong boy who came from the Neighborhood. Experienced in combat and unbound by common sense; shows an honest attitude toward comrades.'},traits:{ja:['強さ','正直','戦闘','近界','成長'],en:['Strength','Honest','Battle','Neighborhood','Growth']},radar:[82,65,60,72,62,70]},
  // ── はじめの一歩 ──
  {id:'makunouchi_hji',icon:'🥊',name:{ja:'幕之内一歩',en:'Ippo Makunouchi'},series:{ja:'はじめの一歩',en:'Hajime no Ippo'},type:{ja:'諦めない熱血ボクサー (ESFP)',en:'Never-Give-Up Hot-Blooded Boxer (ESFP)'},profile:{E:3,S:4,F:4,P:3},desc:{ja:'いじめられっ子から這い上がったボクサー。「ガッツ」と「諦めない心」が武器で、強さの意味を問い続ける。',en:'A boxer who rose from being bullied. "Guts" and "Never giving up" are his weapons; constantly questioning the meaning of strength.'},traits:{ja:['ボクシング','諦めない','成長','純粋','ガッツ'],en:['Boxing','Never Give Up','Growth','Pure','Guts']},radar:[78,55,52,88,52,70]},
  // ── 劇場版 / タイバニ追加 ──
  {id:'barnaby_tb',icon:'👓',name:{ja:'バーナビー・ブルックスJr.',en:'Barnaby Brooks Jr.'},series:{ja:'TIGER & BUNNY',en:'Tiger & Bunny'},type:{ja:'孤独な天才ヒーロー (INTJ)',en:'Solitary Genius Hero (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'ヒーローテレビで活躍するバニー。ひとりで行動することを好む完璧主義者だが、コテツとの絆で成長。',en:'Bunny who works in hero TV. A perfectionist who prefers to act alone, but grows through his bond with Kotetsu.'},traits:{ja:['天才','完璧','孤独','成長','バニー'],en:['Genius','Perfect','Solitude','Growth','Bunny']},radar:[58,85,88,52,85,88]},
  // ── SAO オルタナティブ ──
  {id:'pito_sao3',icon:'🎮',name:{ja:'エム',en:'M'},series:{ja:'ソードアート・オンライン オルタナティブ GGO',en:'SAO Alternative: GGO'},type:{ja:'ゲームの鉄壁の盾 (ISTJ)',en:'Ironclad Shield of the Game (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'GGOでレンのパートナーとなるプレイヤー。現実では不思議な人物だが、ゲームでは信頼できる盾役を務める。',en:'A player who becomes Llenn\'s partner in GGO. Mysterious in real life, but serves as a reliable shield in the game.'},traits:{ja:['盾','信頼','謎','ゲーム','パートナー'],en:['Shield','Trust','Mystery','Game','Partner']},radar:[55,75,78,58,75,85]},
  // ── ヴァンパイア騎士 ──
  {id:'zero_vk',icon:'🌙',name:{ja:'錐生零',en:'Zero Kiryu'},series:{ja:'ヴァンパイア騎士',en:'Vampire Knight'},type:{ja:'吸血鬼に成る人間 (ISTP)',en:'Human Becoming Vampire (ISTP)'},profile:{I:4,S:4,T:4,P:3},desc:{ja:'人間の吸血鬼に対するハンターでありながら自身も吸血鬼化していく。ユキへの複雑な感情を抱える。',en:'A hunter against vampires who is himself gradually becoming a vampire. Bears complex feelings toward Yuki.'},traits:{ja:['吸血鬼','ハンター','複雑','葛藤','強さ'],en:['Vampire','Hunter','Complex','Conflict','Strength']},radar:[62,72,70,58,70,75]},
  // ── Reゼロ追加 ──
  {id:'roswaal_rz',icon:'🎭',name:{ja:'ロズワール・L・メザース',en:'Roswaal L. Mathers'},series:{ja:'Re:ゼロから始める異世界生活',en:'Re:Zero'},type:{ja:'策謀の大魔法使い (INTJ)',en:'Scheming Great Mage (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'ロズワール辺境伯領の主人で7色の魔法を操る大魔法使い。長年の計画を持ち、スバルを利用しようとする。',en:'Lord of Roswaal Margrave Domain and great mage who controls 7 colors of magic. Has long-standing plans and tries to use Subaru.'},traits:{ja:['魔法','策謀','計画','大魔法使い','謎'],en:['Magic','Scheming','Plans','Great Mage','Mystery']},radar:[42,92,90,38,92,88]},
  // ── ライアーゲーム ──
  {id:'nao_lg',icon:'🎲',name:{ja:'神崎直',en:'Nao Kanzaki'},series:{ja:'ライアーゲーム',en:'Liar Game'},type:{ja:'誠実すぎる天然 (INFP)',en:'Too Sincere Natural Type (INFP)'},profile:{I:3,N:3,F:4,P:3},desc:{ja:'嘘がつけない超正直な少女がライアーゲームに巻き込まれる。秋山との協力で真実を貫く。',en:'A super-honest girl who cannot lie gets caught up in the Liar Game. Upholds truth with Akiyama\'s cooperation.'},traits:{ja:['正直','純粋','成長','心理戦','真実'],en:['Honest','Pure','Growth','Psychological Battle','Truth']},radar:[45,65,62,85,62,68]},
  // ── 進撃の巨人追加 ──
  {id:'moblit_aot',icon:'🖊️',name:{ja:'リヴァイ班の兵士たち',en:'Levi Squad Members'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'忠実な精鋭兵 (ISTJ)',en:'Loyal Elite Soldier (ISTJ)'},profile:{I:3,S:4,T:3,J:4},desc:{ja:'調査兵団の精鋭でリヴァイ班に属するベテラン。仲間への忠実さと使命感が光る兵士たち。',en:'Elites of the Survey Corps belonging to Levi\'s squad. Soldiers whose loyalty to comrades and sense of mission shine.'},traits:{ja:['忠実','精鋭','使命','仲間','悲劇'],en:['Loyal','Elite','Mission','Comrades','Tragedy']},radar:[62,72,70,72,70,80]},
  // ── 僕は友達が少ない ──
  {id:'kodaka_boku',icon:'📱',name:{ja:'羽瀬川小鷹',en:'Kodaka Hasegawa'},series:{ja:'僕は友達が少ない',en:'Haganai'},type:{ja:'友達を作ろうとする孤独 (ISFP)',en:'Lonely One Trying to Make Friends (ISFP)'},profile:{I:3,S:3,F:3,P:3},desc:{ja:'外見が怖くて友達ができない少年。隣人部に入って友達作りに励む。鈍感で空気が読めない面もある。',en:'A boy whose scary appearance prevents him from making friends. Joins the Neighbors Club to make friends. Also has an oblivious, slow-to-read-the-room side.'},traits:{ja:['孤独','友達','外見','成長','鈍感'],en:['Solitude','Friends','Appearance','Growth','Oblivious']},radar:[55,58,55,65,58,62]},
  {id:'sena_boku',icon:'💻',name:{ja:'三日月夜空',en:'Sena Kashiwazaki'},series:{ja:'僕は友達が少ない',en:'Haganai'},type:{ja:'ゲーム漬けの美少女 (ESTP)',en:'Beautiful Game Addict (ESTP)'},profile:{E:3,S:4,T:3,P:4},desc:{ja:'男性から崇められる美少女だが友達がいない。ゲームとアニメが好きで、外見と内面のギャップが大きい。',en:'A beautiful girl worshipped by boys but has no friends. Loves games and anime; has a large gap between her appearance and personality.'},traits:{ja:['ゲーム','美少女','プライド','ギャップ','孤独'],en:['Games','Beautiful','Pride','Gap','Solitude']},radar:[72,62,58,65,60,68]},
  // ── ダイの大冒険 ──
  {id:'dai_daibouhken',icon:'⚔️',name:{ja:'ダイ',en:'Dai'},series:{ja:'ドラゴンクエスト ダイの大冒険',en:'Dragon Quest: The Adventure of Dai'},type:{ja:'竜の騎士の勇者 (ESFP)',en:'Dragon Knight Hero (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'竜の騎士の血を引く少年で勇者を目指す。純粋な心と強さで魔王軍に立ち向かう。',en:'A boy of Dragon Knight lineage who aims to be a hero. Faces the Demon King\'s Army with pure heart and strength.'},traits:{ja:['竜の騎士','勇者','純粋','強さ','友情'],en:['Dragon Knight','Hero','Pure','Strength','Friendship']},radar:[82,55,52,90,55,70]},
  {id:'popp_daibouhken',icon:'🔮',name:{ja:'ポップ',en:'Pop'},series:{ja:'ドラゴンクエスト ダイの大冒険',en:'Daibouhken'},type:{ja:'臆病者が天才に成る (ENFP)',en:'Coward Becoming Genius (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'最初は臆病で逃げてばかりのダイの仲間。成長を経て大魔道士になる感動的な変化を遂げるキャラ。',en:'Initially a cowardly companion of Dai who always ran away. Undergoes a moving transformation to become a great mage.'},traits:{ja:['成長','臆病','魔法','友情','変化'],en:['Growth','Cowardly','Magic','Friendship','Change']},radar:[68,62,58,82,62,70]},
  // ── ヒロインたるものへ ──
  {id:'iino_kgs',icon:'📜',name:{ja:'伊井野ミコ',en:'Miko Iino'},series:{ja:'かぐや様は告らせたい',en:'Kaguya-sama: Love is War'},type:{ja:'原理主義の生徒会副会長 (ISTJ)',en:'Principled Vice Student Council President (ISTJ)'},profile:{I:4,S:3,T:4,J:4},desc:{ja:'生徒会副会長で規則に厳格。厳しい外見の裏に純粋な心と弱さを持つ。石上との関係が成長を促す。',en:'Vice Student Council President who is strict about rules. Behind a stern appearance hides a pure heart and vulnerability. Relationship with Ishigami promotes growth.'},traits:{ja:['規則','厳格','弱さ','成長','石上'],en:['Rules','Strict','Vulnerability','Growth','Ishigami']},radar:[52,78,80,60,78,85]},
  // ── おそ松さん ──
  {id:'karamatsu_osmt',icon:'😎',name:{ja:'カラ松',en:'Karamatsu'},series:{ja:'おそ松さん',en:'Osomatsu-san'},type:{ja:'イタイ系ナルシスト (ESFP)',en:'Cringeworthy Narcissist (ESFP)'},profile:{E:4,S:4,F:3,P:3},desc:{ja:'6つ子の二番目でかっこつけのナルシスト。痛々しい行動が多いが実は優しさも持つ。',en:'The second of the sextuplets; a narcissist who tries to be cool. Has many cringe-worthy actions but also has kindness.'},traits:{ja:['ナルシスト','かっこつけ','優しさ','六つ子','痛い'],en:['Narcissist','Try-Hard','Kindness','Sextuplets','Cringe']},radar:[82,42,40,72,42,55]},
  // ── 彼女が公爵邸に行った理由 ──
  {id:'ioana_duke',icon:'📚',name:{ja:'アリシア',en:'Alicia'},series:{ja:'公爵邸へようこそ',en:'Welcome to the Duke\'s House'},type:{ja:'異世界転生ヒロイン (INFJ)',en:'Isekai Reincarnated Heroine (INFJ)'},profile:{I:3,N:4,F:4,J:3},desc:{ja:'悪役令嬢として転生した少女。前世の知識を活かしながら乙女ゲームの世界で独自の道を歩む。',en:'A girl reincarnated as a villainess. Uses knowledge from her past life to walk her own path in an otome game world.'},traits:{ja:['悪役令嬢','転生','知識','乙女ゲーム','独自の道'],en:['Villainess','Reincarnation','Knowledge','Otome Game','Own Path']},radar:[50,80,78,70,78,75]},
  // ── NARUTO 追加 ──
  {id:'madara_naruto',icon:'👹',name:{ja:'うちはマダラ',en:'Madara Uchiha'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'最強の幻術師 (INTJ)',en:'Strongest Genjutsu Master (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'うちは一族の最強の忍者で「月の眼計画」を企てた。木の葉創設者の一人で圧倒的な実力を持つ伝説の忍。',en:'The strongest ninja of the Uchiha clan who plotted the "Infinite Tsukuyomi." One of the founders of Konoha; a legendary ninja with overwhelming ability.'},traits:{ja:['最強','幻術','計画','傲慢','伝説'],en:['Strongest','Genjutsu','Plan','Arrogance','Legend']},radar:[52,99,95,38,99,92]},
  {id:'obito_naruto',icon:'🌀',name:{ja:'うちはオビト',en:'Obito Uchiha'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'愛が堕落した者 (INFJ)',en:'One Who Fell from Love (INFJ)'},profile:{I:3,N:4,F:4,J:3},desc:{ja:'かつてナルトのような純粋な少年だったが、リンの死で絶望しマダラの計画に乗った。愛と憎しみが交錯する悲劇。',en:'Once a pure boy like Naruto, but despaired after Rin\'s death and followed Madara\'s plan. A tragedy where love and hatred intersect.'},traits:{ja:['悲劇','愛','堕落','幻術','仮面'],en:['Tragedy','Love','Fall','Genjutsu','Mask']},radar:[48,85,82,52,85,80]},
  {id:'konan_naruto',icon:'📄',name:{ja:'小南',en:'Konan'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'紙の天使 (INFJ)',en:'Paper Angel (INFJ)'},profile:{I:4,N:3,F:4,J:4},desc:{ja:'長門とヤヒコの幼なじみで暁のメンバー。紙を使った術で戦い、最後まで長門の夢を守ろうとした。',en:'Childhood friend of Nagato and Yahiko and Akatsuki member. Fights with paper-based jutsu; tried to protect Nagato\'s dream till the end.'},traits:{ja:['紙','友情','忠誠','夢','悲劇'],en:['Paper','Friendship','Loyalty','Dream','Tragedy']},radar:[48,80,78,72,78,82]},
  {id:'kushina_naruto',icon:'🌸',name:{ja:'うずまきクシナ',en:'Kushina Uzumaki'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'愛する母 (ENFJ)',en:'Loving Mother (ENFJ)'},profile:{E:4,F:4,N:3,J:3},desc:{ja:'ナルトの母でミナトの妻。九尾の人柱力で旋毛の愛情と強さを持ち、ナルトへの母の愛が語り継がれる。',en:'Naruto\'s mother and Minato\'s wife. As the Nine-Tails Jinchuriki, possesses love and strength of the Uzumaki; a mother\'s love for Naruto is passed down.'},traits:{ja:['母親','愛情','九尾','強さ','うずまき'],en:['Mother','Love','Nine-Tails','Strength','Uzumaki']},radar:[78,72,68,95,72,80]},
  {id:'tsunade_naruto',icon:'💊',name:{ja:'綱手',en:'Tsunade'},series:{ja:'NARUTO',en:'NARUTO'},type:{ja:'五代目火影の医療忍者 (ENTJ)',en:'Fifth Hokage Medical Ninja (ENTJ)'},profile:{E:3,T:3,N:3,J:4},desc:{ja:'三忍の一人で五代目火影。医療忍術の第一人者で強さと優しさを兼ね備える。ギャンブルに弱い一面も。',en:'One of the Sannin and Fifth Hokage. A pioneer of medical ninjutsu combining strength and kindness. Also has a weakness for gambling.'},traits:{ja:['医療','五代目','三忍','強さ','ギャンブル'],en:['Medical','Fifth Hokage','Sannin','Strength','Gambling']},radar:[72,78,75,75,78,80]},
  // ── ワンピース追加 ──
  {id:'whitebeard_op',icon:'⚓',name:{ja:'白ひげ',en:'Whitebeard'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'世界最強の男 (ENFJ)',en:'World\'s Strongest Man (ENFJ)'},profile:{E:3,F:4,N:3,J:4},desc:{ja:'白ひげ海賊団の船長で世界最強の男と呼ばれた人物。仲間を「家族」と呼び、その死が海賊時代を変えた。',en:'Captain of the Whitebeard Pirates, called the world\'s strongest man. Called his crew "family"; his death changed the pirate era.'},traits:{ja:['最強','家族','四皇','犠牲','伝説'],en:['Strongest','Family','Emperor','Sacrifice','Legend']},radar:[80,90,88,88,90,88]},
  {id:'rob_lucci_op',icon:'🐆',name:{ja:'ロブ・ルッチ',en:'Rob Lucci'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'正義の極限まで追求する CP9 (INTJ)',en:'CP9 Pursuing Justice to the Extreme (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'CP9の最強エージェント。「徹底的な悪の排除」という歪んだ正義を持つ最強の政府工作員。',en:'The strongest agent of CP9. A government operative with twisted justice of "thoroughly eliminating evil."'},traits:{ja:['CP9','最強','冷徹','正義','鳥'],en:['CP9','Strongest','Cold','Justice','Bird']},radar:[48,92,90,28,92,88]},
  {id:'crocodile_op',icon:'🐊',name:{ja:'クロコダイル',en:'Crocodile'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'砂漠の反逆者 (INTJ)',en:'Desert Rebel (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'元七武海でアラバスタを狙った悪役。スナスナの実の能力者で後にルフィと協力する複雑な人物。',en:'Former Warlord who targeted Alabasta. Logia-type Sand-Sand Fruit user who later cooperates with Luffy; a complex individual.'},traits:{ja:['砂漠','七武海','悪役','変化','実力'],en:['Desert','Warlord','Villain','Change','Skill']},radar:[52,88,85,38,88,85]},
  {id:'katakuri_op',icon:'⬛',name:{ja:'シャーロット・カタクリ',en:'Charlotte Katakuri'},series:{ja:'ONE PIECE',en:'ONE PIECE'},type:{ja:'完璧主義の四皇幹部 (INTJ)',en:'Perfectionist Emperor Executive (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ビッグ・マム海賊団の幹部で完璧主義者。予知能力的な覇気とモチモチの実の能力を持つ最強幹部。',en:'Executive of Big Mom Pirates and perfectionist. The strongest executive with Haki resembling precognition and Mochi-Mochi Fruit ability.'},traits:{ja:['完璧','予知','幹部','ライバル','尊重'],en:['Perfect','Precognition','Executive','Rival','Respect']},radar:[55,95,92,48,95,92]},
  // ── スラムダンク追加 ──
  {id:'akagi_sd',icon:'🏀',name:{ja:'赤木剛憲',en:'Takenori Akagi'},series:{ja:'SLAM DUNK',en:'SLAM DUNK'},type:{ja:'不屈のビッグマン (ISTJ)',en:'Indomitable Big Man (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'湘北高校バスケ部のキャプテンでセンターポジション。諦めない心と厳格なキャプテンシーで全国制覇を目指す。',en:'Captain of Shohoku High Basketball Club and center position. Aims for national championship with indomitable spirit and strict captainship.'},traits:{ja:['キャプテン','センター','諦めない','厳格','夢'],en:['Captain','Center','Never Give Up','Strict','Dream']},radar:[75,75,72,78,72,88]},
  {id:'ryota_sd',icon:'🏀',name:{ja:'宮城リョータ',en:'Ryota Miyagi'},series:{ja:'SLAM DUNK',en:'SLAM DUNK'},type:{ja:'ちびっ子のポイントガード (ESFP)',en:'Tiny Point Guard (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'湘北高校バスケ部のポイントガード。小柄だが素早さと視野の広さが武器で、姉への思いを胸に秘める。',en:'Point guard of Shohoku High Basketball Club. Small but quick; wide field of vision is his weapon, carrying feelings for his sister.'},traits:{ja:['小柄','素早さ','ポイントガード','成長','姉'],en:['Small','Quickness','Point Guard','Growth','Sister']},radar:[75,68,62,78,65,70]},
  {id:'kogure_sd',icon:'👓',name:{ja:'木暮公延',en:'Kiminobu Kogure'},series:{ja:'SLAM DUNK',en:'SLAM DUNK'},type:{ja:'副キャプテンの意志 (ISFJ)',en:'Vice Captain\'s Will (ISFJ)'},profile:{I:3,S:3,F:4,J:4},desc:{ja:'湘北高校バスケ部の副キャプテン。温和で真面目、チームのまとめ役で3年間の情熱を最後に爆発させる。',en:'Vice captain of Shohoku High Basketball Club. Gentle and serious; team organizer who unleashes three years of passion at the end.'},traits:{ja:['副キャプテン','温和','3年間','情熱','友情'],en:['Vice Captain','Gentle','Three Years','Passion','Friendship']},radar:[60,70,68,82,68,80]},
  // ── テニスの王子様 ──
  {id:'ryoma_tenimyu',icon:'🎾',name:{ja:'越前リョーマ',en:'Ryoma Echizen'},series:{ja:'テニスの王子様',en:'The Prince of Tennis'},type:{ja:'自信過剰の天才テニス少年 (ISTP)',en:'Overconfident Genius Tennis Boy (ISTP)'},profile:{I:3,S:4,T:4,P:3},desc:{ja:'テニスの天才で「まだまだだね」が口癖。父を超えることを目指し、独自の試合で実力を磨く。',en:'A tennis genius whose catchphrase is "You still have a long way to go." Aims to surpass his father, honing his skills in unique matches.'},traits:{ja:['天才','テニス','自信','「まだまだだね」','父超え'],en:['Genius','Tennis','Confidence','Still Far to Go','Surpass Father']},radar:[82,72,68,48,72,78]},
  // ── 黒子のバスケ追加 ──
  {id:'murasakibara_knb',icon:'🍭',name:{ja:'紫原敦',en:'Atsushi Murasakibara'},series:{ja:'黒子のバスケ',en:'Kuroko\'s Basketball'},type:{ja:'無気力の天才センター (ISTP)',en:'Lethargic Genius Center (ISTP)'},profile:{I:4,S:4,T:3,P:4},desc:{ja:'キセキの世代のセンターで最大の身長を誇る。バスケへの情熱がない「嫌い」なのに最強という矛盾した天才。',en:'Center of Generation of Miracles with the greatest height. A contradictory genius who is "the strongest despite not liking" basketball.'},traits:{ja:['天才','無気力','食いしん坊','最強','矛盾'],en:['Genius','Lethargic','Foodie','Strongest','Contradictory']},radar:[90,42,38,52,42,58]},
  {id:'momoi_knb',icon:'🍑',name:{ja:'桃井さつき',en:'Satsuki Momoi'},series:{ja:'黒子のバスケ',en:'Kuroko\'s Basketball'},type:{ja:'統計の天才マネージャー (ENFJ)',en:'Statistical Genius Manager (ENFJ)'},profile:{E:4,N:4,F:4,J:3},desc:{ja:'帝光中のマネージャーで青峰の幼なじみ。相手チームのデータ分析で圧倒的な戦略を立てる天才マネージャー。',en:'Manager of Teikou Middle School and Aomine\'s childhood friend. A genius manager who builds overwhelming strategies through opponent team data analysis.'},traits:{ja:['マネージャー','データ分析','幼なじみ','戦略','愛'],en:['Manager','Data Analysis','Childhood Friend','Strategy','Love']},radar:[72,80,75,80,78,75]},
  // ── 鬼灯の冷徹追加 ──
  {id:'peach_maki_hr',icon:'🍑',name:{ja:'白澤',en:'Hakutaku'},series:{ja:'鬼灯の冷徹',en:'Hoozuki\'s Coolheadedness'},type:{ja:'地上界の神 (ENTP)',en:'God of the Upper World (ENTP)'},profile:{E:4,N:4,T:3,P:4},desc:{ja:'地上界を管理する八百万の神の一人。自由奔放な性格で鬼灯とライバル関係にある神。',en:'One of the eight million gods who manage the upper world. A free-spirited god in a rival relationship with Hoozuki.'},traits:{ja:['神','自由','ライバル','地上界','楽しさ'],en:['God','Freedom','Rival','Upper World','Enjoyment']},radar:[75,72,68,78,72,70]},
  // ── 少年探偵モノ ──
  {id:'conan_dc',icon:'🔍',name:{ja:'江戸川コナン',en:'Conan Edogawa'},series:{ja:'名探偵コナン',en:'Detective Conan'},type:{ja:'黒の組織に追う名探偵 (INTJ)',en:'Famous Detective Chasing the Black Org (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'工藤新一が幼児化した名探偵。「真実はいつも一つ！」が信条で、犯罪を解決し続ける。',en:'The famous detective Shinichi Kudo shrunken into a child. "There is only one truth!" is his creed; continues solving crimes.'},traits:{ja:['推理','真実','謎','黒の組織','智謀'],en:['Deduction','Truth','Mystery','Black Org','Wisdom']},radar:[52,98,95,58,98,88]},
  // ── キルラキル追加 ──
  {id:'nonon_kk',icon:'🎵',name:{ja:'蛇崩乃音',en:'Nonon Jakuzure'},series:{ja:'キルラキル',en:'Kill la Kill'},type:{ja:'音楽の独裁者 (ENTJ)',en:'Musical Dictator (ENTJ)'},profile:{E:4,T:4,N:3,J:4},desc:{ja:'生徒会四天王の一人で音楽を武器とする。幼い頃から薩川との友情を持ち、音楽への情熱は本物。',en:'One of the Elite Four who uses music as a weapon. Has been friends with Satsuki since childhood; genuine passion for music.'},traits:{ja:['音楽','四天王','プライド','友情','情熱'],en:['Music','Elite Four','Pride','Friendship','Passion']},radar:[78,72,70,68,72,80]},
  {id:'gamagoori_kk',icon:'💪',name:{ja:'蟇郡苛',en:'Ira Gamagoori'},series:{ja:'キルラキル',en:'Kill la Kill'},type:{ja:'規律の守護者 (ESTJ)',en:'Guardian of Discipline (ESTJ)'},profile:{E:4,S:4,T:4,J:4},desc:{ja:'生徒会四天王の一人で風紀委員長。自己罰の服・縛り上璃を着て戦う巨体の四天王。誠実さが際立つ。',en:'One of the Elite Four and Disciplinary Committee Chair. Battles in bondage clothing that self-punishes; a giant among the Elite Four. Sincerity stands out.'},traits:{ja:['規律','四天王','誠実','巨体','自己罰'],en:['Discipline','Elite Four','Sincere','Giant','Self-Punishment']},radar:[72,65,62,68,62,78]},
  // ── 物語シリーズ追加 ──
  {id:'hanekawa_mono',icon:'📚',name:{ja:'羽川翼',en:'Tsubasa Hanekawa'},series:{ja:'物語シリーズ',en:'Monogatari Series'},type:{ja:'完璧な副委員長の裂傷 (INFJ)',en:'Perfect Vice Rep\'s Fracture (INFJ)'},profile:{I:4,N:4,F:3,J:4},desc:{ja:'成績学校トップの完璧な副委員長。家族問題を抱え、ストレスが猫の神「ブラック羽川」を呼び出す。',en:'Perfect vice representative with top grades at school. Has family issues; stress summons the cat god "Black Hanekawa."'},traits:{ja:['完璧','副委員長','抑圧','猫','家族'],en:['Perfect','Vice Rep','Suppression','Cat','Family']},radar:[48,90,88,52,88,88]},
  // ── 機動戦士ガンダム追加 ──
  {id:'heero_gw',icon:'🎯',name:{ja:'ヒイロ・ユイ',en:'Heero Yuy'},series:{ja:'新機動戦記ガンダムW',en:'Gundam Wing'},type:{ja:'完璧な兵士 (ISTJ)',en:'Perfect Soldier (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'オペレーション・メテオを実行するガンダムパイロット。「死ぬ覚悟はできている」が口癖の完璧な兵士。',en:'Gundam pilot executing Operation Meteor. A perfect soldier whose catchphrase is "I will kill you" or "I\'ll self-destruct."'},traits:{ja:['完璧','兵士','任務','自爆','変化'],en:['Perfect','Soldier','Mission','Self-Destruct','Change']},radar:[58,85,88,42,85,90]},
  {id:'relena_gw',icon:'🕊️',name:{ja:'リリーナ・ドーリアン',en:'Relena Darlian'},series:{ja:'新機動戦記ガンダムW',en:'Gundam Wing'},type:{ja:'平和の追求者 (ENFJ)',en:'Peace Seeker (ENFJ)'},profile:{E:4,N:4,F:4,J:3},desc:{ja:'平和主義の政治家を目指す少女。ヒイロとの関係で変わりながら世界に平和をもたらそうとする。',en:'A girl aiming to be a pacifist politician. Tries to bring peace to the world while changing through her relationship with Heero.'},traits:{ja:['平和','政治','強さ','愛','使命'],en:['Peace','Politics','Strength','Love','Mission']},radar:[65,72,70,80,72,78]},
  {id:'quatre_gw',icon:'🌟',name:{ja:'カトル・ラバーバ・ウィナー',en:'Quatre Raberba Winner'},series:{ja:'新機動戦記ガンダムW',en:'Gundam Wing'},type:{ja:'共感型の天才パイロット (INFJ)',en:'Empathetic Genius Pilot (INFJ)'},profile:{I:3,N:4,F:4,J:3},desc:{ja:'ガンダムWのパイロットで共感力が高い。仲間への思いやりが深く、チームの絆を大切にする。',en:'Gundam Wing pilot with high empathy. Has deep consideration for comrades and values the team\'s bonds.'},traits:{ja:['共感','思いやり','天才','平和','仲間'],en:['Empathy','Consideration','Genius','Peace','Comrades']},radar:[55,78,75,85,78,78]},
  // ── 超電磁砲 / 一方通行追加 ──
  {id:'kuroko_rail',icon:'⚡',name:{ja:'白井黒子',en:'Kuroko Shirai'},series:{ja:'とある科学の超電磁砲',en:'A Certain Scientific Railgun'},type:{ja:'空間移動のツンデレ委員 (ISTJ)',en:'Teleporting Tsundere Committee (ISTJ)'},profile:{I:3,S:4,T:3,J:4},desc:{ja:'御坂美琴の同室でテレポーターの超能力者。御坂への妄想的な愛情と能力は職員委員として発揮される。',en:'Misaka\'s roommate and Teleporter esper. Devotion toward Misaka is obsessive; ability is used as a Judgment member.'},traits:{ja:['テレポート','委員','御坂への愛','ツンデレ','能力'],en:['Teleport','Committee','Love for Misaka','Tsundere','Ability']},radar:[60,72,68,62,70,75]},
  {id:'saten_rail',icon:'📱',name:{ja:'佐天涙子',en:'Ruiko Saten'},series:{ja:'とある科学の超電磁砲',en:'A Certain Scientific Railgun'},type:{ja:'能力なしの普通っ子 (ESFP)',en:'Ordinary Girl Without Ability (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'超能力を持たないレベル0の普通の少女。能力がなくても仲間と共に困難に立ち向かう前向きな存在。',en:'An ordinary Level 0 girl without esper abilities. A positive person who faces difficulties with friends despite having no power.'},traits:{ja:['レベル0','普通','前向き','友情','スカート捲り'],en:['Level 0','Ordinary','Positive','Friendship','Skirt Flip']},radar:[75,45,40,88,45,62]},
  // ── ワールドトリガー追加 ──
  {id:'chika_wt',icon:'🌟',name:{ja:'雨取千佳',en:'Chika Amatori'},series:{ja:'ワールドトリガー',en:'World Trigger'},type:{ja:'膨大なトリオン量の少女 (INFP)',en:'Girl with Enormous Trion (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'圧倒的なトリオン量を持つ少女。引っ込み思案だが仲間への思いやりは深く、成長していく様子が印象的。',en:'A girl with overwhelming amount of Trion. Withdrawn but has deep consideration for comrades; her growth is impressive.'},traits:{ja:['トリオン','引っ込み思案','成長','友情','射撃'],en:['Trion','Withdrawn','Growth','Friendship','Shooting']},radar:[42,68,65,80,65,70]},
  // ── 夏目友人帳 ──
  {id:'natsume_yfh',icon:'📖',name:{ja:'夏目貴志',en:'Takashi Natsume'},series:{ja:'夏目友人帳',en:'Natsume\'s Book of Friends'},type:{ja:'妖怪と共存する少年 (INFP)',en:'Boy Coexisting with Youkai (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'妖怪が見える少年で祖母から「友人帳」を引き継いだ。孤独な過去を持ちながら妖怪たちと優しく接する。',en:'A boy who can see youkai and inherited the "Book of Friends" from his grandmother. Has a lonely past but interacts kindly with youkai.'},traits:{ja:['妖怪','友情','孤独','優しさ','祖母'],en:['Youkai','Friendship','Solitude','Kindness','Grandmother']},radar:[42,72,70,88,70,72]},
  {id:'nyanko_yfh',icon:'🐱',name:{ja:'ニャンコ先生',en:'Nyanko-sensei'},series:{ja:'夏目友人帳',en:'Natsume\'s Book of Friends'},type:{ja:'招き猫の妖怪 (ISTP)',en:'Lucky Cat Youkai (ISTP)'},profile:{I:3,S:4,T:4,P:4},desc:{ja:'招き猫の姿をした強力な妖怪でニャンコ先生の愛称。友人帳目当てだったが夏目を守るようになる。',en:'A powerful youkai in the form of a lucky cat, nicknamed Nyanko-sensei. Originally after the Book of Friends but came to protect Natsume.'},traits:{ja:['猫','妖怪','強さ','照れ屋','保護'],en:['Cat','Youkai','Strength','Bashful','Protection']},radar:[70,68,65,62,65,68]},
  // ── ハイキュー!!追加 ──
  {id:'iwaizumi_hq',icon:'🏐',name:{ja:'岩泉一',en:'Hajime Iwaizumi'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'頼れる副キャプテン (ISTJ)',en:'Reliable Vice Captain (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'青葉城西高校のエースで及川の幼なじみ。実直で頼れる副キャプテンで、及川の天然なわがままを抑制する。',en:'Ace of Aoba Johsai High School and Oikawa\'s childhood friend. Straightforward and reliable vice captain who suppresses Oikawa\'s natural selfishness.'},traits:{ja:['実直','副キャプテン','エース','幼なじみ','信頼'],en:['Straightforward','Vice Captain','Ace','Childhood Friend','Trust']},radar:[78,70,68,72,70,82]},
  {id:'nishinoya_hq',icon:'🛡️',name:{ja:'西谷夕',en:'Yu Nishinoya'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'最強のリベロ (ESFP)',en:'Greatest Libero (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'烏野高校の守護神と呼ばれるリベロ。低身長だが「神速の守護神」として活躍する情熱的な選手。',en:'Libero called the Guardian Deity of Karasuno. Short in stature but works as the "God of Agility Guardian," a passionate player.'},traits:{ja:['リベロ','守護神','情熱','低身長','守り'],en:['Libero','Guardian Deity','Passion','Short','Defense']},radar:[80,60,55,88,58,72]},
  {id:'asahi_hq',icon:'🌙',name:{ja:'東峰旭',en:'Asahi Azumane'},series:{ja:'ハイキュー!!',en:'Haikyuu!!'},type:{ja:'心優しいエースの悩み (ISFP)',en:'Kind-Hearted Ace\'s Worry (ISFP)'},profile:{I:4,S:3,F:4,P:3},desc:{ja:'烏野高校のエースで優しすぎる性格に悩む。外見は怖いが内面は繊細で、精神的な強さを求め続ける。',en:'Ace of Karasuno High who worries about being too kind. Scary in appearance but internally sensitive; continues seeking mental strength.'},traits:{ja:['エース','心優しさ','外見','繊細','成長'],en:['Ace','Kind-Heartedness','Appearance','Sensitive','Growth']},radar:[80,62,60,78,62,72]},
  // ── Free! 追加 ──
  {id:'rin_free',icon:'🦈',name:{ja:'松岡凛',en:'Rin Matsuoka'},series:{ja:'Free!',en:'Free!'},type:{ja:'ライバルからの再会 (INTJ)',en:'Reunion from Rival (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'晴渡たちの幼なじみで遠泳への夢を持つ。オーストラリアから帰国し、ライバルと夢の間で成長する。',en:'Childhood friend of Haruka and others who has a dream of long-distance swimming. Returns from Australia; grows between rivals and dreams.'},traits:{ja:['ライバル','夢','水泳','成長','友情'],en:['Rival','Dream','Swimming','Growth','Friendship']},radar:[65,72,68,72,70,75]},
  {id:'rei_free',icon:'🦋',name:{ja:'竜ヶ崎怜',en:'Rei Ryugazaki'},series:{ja:'Free!',en:'Free!'},type:{ja:'理論派のド下手水泳選手 (INTJ)',en:'Theoretical Swimmer Who Is Bad at It (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'美しさを追求する陸上部出身の水泳部員。理論的に美しい水泳を追求するが体が言うことを聞かない。',en:'Track and field club member who joined the swimming club in pursuit of beauty. Pursues theoretically beautiful swimming but his body doesn\'t cooperate.'},traits:{ja:['理論','美しさ','努力','ド下手','成長'],en:['Theory','Beauty','Effort','Terrible','Growth']},radar:[52,82,80,62,82,78]},
  // ── ユーリ!!! on ICE ──
  {id:'yuuri_yoi',icon:'⛸️',name:{ja:'勝生勇利',en:'Yuuri Katsuki'},series:{ja:'ユーリ!!! on ICE',en:'Yuri!!! on Ice'},type:{ja:'自信のないアイスダンサー (INFP)',en:'Unconfident Ice Dancer (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'フィギュアスケーターでヴィクトルへの憧れからスケートを続ける。不安定だが演技の時に全力を発揮。',en:'A figure skater who continues skating inspired by admiration for Victor. Unstable, but gives full performance during skating.'},traits:{ja:['スケート','不安','成長','憧れ','競技'],en:['Skating','Anxiety','Growth','Admiration','Competition']},radar:[52,70,68,78,68,72]},
  {id:'victor_yoi',icon:'🌟',name:{ja:'ヴィクトル・ニキフォロフ',en:'Victor Nikiforov'},series:{ja:'ユーリ!!! on ICE',en:'Yuri!!! on Ice'},type:{ja:'伝説のスケーター (ENFJ)',en:'Legendary Skater (ENFJ)'},profile:{E:4,N:4,F:4,J:3},desc:{ja:'フィギュアスケート界の伝説的選手。勇利に惹かれてコーチに転身し、共に成長していく。',en:'Legendary figure skater. Drawn to Yuuri, transitions to coaching and grows together with him.'},traits:{ja:['伝説','スケート','コーチ','成長','愛'],en:['Legend','Skating','Coach','Growth','Love']},radar:[85,80,78,85,80,82]},
  // ── 狂気の悪役系 ──
  {id:'junko_dr',icon:'🐻',name:{ja:'江ノ島盾子',en:'Junko Enoshima'},series:{ja:'ダンガンロンパ',en:'Danganronpa'},type:{ja:'絶望を愛する悪役 (ENTJ)',en:'Villain Who Loves Despair (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'超高校級のファッションで希望と絶望の戦いを作り出した。カリスマ的で予測不能な最大の悪役。',en:'Ultimate Fashionista who created the battle between hope and despair. A charismatic and unpredictable supreme villain.'},traits:{ja:['絶望','カリスマ','悪役','予測不能','超高校級'],en:['Despair','Charisma','Villain','Unpredictable','Ultimate']},radar:[58,95,90,32,98,85]},
  {id:'monokuma_dr',icon:'🐻',name:{ja:'モノクマ',en:'Monokuma'},series:{ja:'ダンガンロンパ',en:'Danganronpa'},type:{ja:'裁判長の熊 (ENTJ)',en:'Bear Headmaster (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'デスゲームの司会者として活動するクマのロボット。残酷なルールを楽しみながら進行するカリスマ的な存在。',en:'A bear robot acting as host of the death game. A charismatic presence who enjoys overseeing cruel rules.'},traits:{ja:['司会者','残酷','デスゲーム','カリスマ','ユーモア'],en:['Host','Cruel','Death Game','Charisma','Humor']},radar:[62,90,85,28,90,82]},
  // ── 暗殺教室追加 ──
  {id:'koro_sensei_ac',icon:'🐙',name:{ja:'殺せんせー',en:'Koro-sensei'},series:{ja:'暗殺教室',en:'Assassination Classroom'},type:{ja:'最高の先生 (ENFJ)',en:'Best Teacher (ENFJ)'},profile:{E:4,N:4,F:4,J:3},desc:{ja:'3-E組の担任でタコ型の超生物。生徒たちの暗殺に来られながらも本当に生徒を育てることに情熱を注ぐ。',en:'Homeroom teacher of Class 3-E, a tentacled super-being. Despite students coming to assassinate him, passionately raises students.'},traits:{ja:['先生','育成','タコ','マッハ20','優しさ'],en:['Teacher','Nurturing','Octopus','Mach 20','Kindness']},radar:[75,85,82,92,85,82]},
  // ── ノエイン もう一人の君へ ──
  {id:'zero_ac',icon:'⚔️',name:{ja:'ゼロ',en:'Zero'},series:{ja:'コードギアス 亡国のアキト',en:'Code Geass: Akito the Exiled'},type:{ja:'解放のゼロ (ENTJ)',en:'Liberating Zero (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'仮面の革命家ゼロのシンボル。知略と力でヨーロッパで戦う黒の騎士団員たちを率いる。',en:'Symbol of the masked revolutionary Zero. Leads the Black Knights fighting in Europe with strategy and power.'},traits:{ja:['仮面','革命','知略','ヨーロッパ','解放'],en:['Mask','Revolution','Strategy','Europe','Liberation']},radar:[55,88,85,55,88,85]},
  // ── マガジン系 ──
  {id:'hajime_aot2',icon:'⚔️',name:{ja:'サシャ・ブラウス',en:'Sasha Blouse'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'食いしん坊の弓使い (ESFP)',en:'Foodie Archer (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'調査兵団の弓の名手でじゃがいも大好き。「じゃがいも神」とも呼ばれる食いしん坊な弓使い。',en:'Expert archer of Survey Corps who loves potatoes. A foodie archer also called the "Potato God."'},traits:{ja:['食いしん坊','弓','じゃがいも','愛','明るさ'],en:['Foodie','Bow','Potato','Love','Brightness']},radar:[75,52,48,85,52,68]},
  // ── ライトノベル系 ──
  {id:'kuzuha_rn',icon:'🌸',name:{ja:'シルフィ',en:'Sylphy'},series:{ja:'無職転生〜異世界行ったら本気だす〜',en:'Mushoku Tensei'},type:{ja:'緑の風の精霊使い (ENFJ)',en:'Green Wind Spirit User (ENFJ)'},profile:{E:3,N:3,F:4,J:3},desc:{ja:'ルーデウスと結婚する風の精霊使い。明るくて純粋、幼い頃から好きだった存在への純愛が印象的。',en:'Wind spirit user who marries Rudeus. Bright and pure; impressive pure love for someone she\'s liked since childhood.'},traits:{ja:['風の精霊','純愛','明るさ','成長','愛情'],en:['Wind Spirit','Pure Love','Brightness','Growth','Love']},radar:[72,65,62,88,65,72]},
  // ── ポプテピピック ──
  {id:'popuko_ptp',icon:'🔫',name:{ja:'ポプ子',en:'Popuko'},series:{ja:'ポプテピピック',en:'Pop Team Epic'},type:{ja:'カオスの主役 (ESFP)',en:'Protagonist of Chaos (ESFP)'},profile:{E:4,S:4,F:2,P:4},desc:{ja:'ポプテピピックの主人公の一人。カオスで暴力的だが独自のユーモアセンスを持つ。',en:'One of the protagonists of Pop Team Epic. Chaotic and violent but possesses a unique sense of humor.'},traits:{ja:['カオス','暴力','ユーモア','破滅的','個性'],en:['Chaos','Violence','Humor','Destructive','Unique']},radar:[82,35,28,72,35,50]},
  // ── 乙女ゲーム系 ──
  {id:'enstars_hokuto',icon:'🌟',name:{ja:'天城一夜',en:'Kazuya Amagi'},series:{ja:'俺の家の話',en:'My Family Story'},type:{ja:'伝統と現代の継承者 (INFJ)',en:'Heir of Tradition and Modernity (INFJ)'},profile:{I:3,N:4,F:4,J:4},desc:{ja:'相撲の家の息子でアイドルをやめて家を継ごうとする青年。伝統と個人の夢の狭間で葛藤する物語。',en:'Son of a sumo family trying to quit being an idol to carry on the family business. A story of conflict between tradition and personal dreams.'},traits:{ja:['相撲','伝統','葛藤','成長','家族'],en:['Sumo','Tradition','Conflict','Growth','Family']},radar:[52,72,70,75,70,75]},
  // ── SPY×FAMILY追加 ──
  {id:'becky_spy',icon:'💰',name:{ja:'ベッキー・ブラックベル',en:'Becky Blackbell'},series:{ja:'SPY×FAMILY',en:'SPY×FAMILY'},type:{ja:'セレブのお嬢様 (ESFP)',en:'Celeb Rich Girl (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'イーデン校のアーニャの友達でセレブ一家の娘。外見はお嬢様だが実は親しみやすい性格。',en:'Anya\'s friend at Eden Academy, daughter of a celebrity family. Appears as a rich girl but is actually friendly.'},traits:{ja:['セレブ','友情','お嬢様','アーニャ','成長'],en:['Celebrity','Friendship','Rich Girl','Anya','Growth']},radar:[72,58,55,82,58,68]},
  // ── Re:ゼロ追加 ──
  {id:'garfiel_rz',icon:'🐯',name:{ja:'ガーフィール・ティンゼル',en:'Garfiel Tinzel'},series:{ja:'Re:ゼロから始める異世界生活',en:'Re:Zero'},type:{ja:'虎の守護者 (ESTP)',en:'Tiger Guardian (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'聖域の守護者で虎に変身できる半獣人。最初は敵対的だがスバルとの戦いを経て信頼関係を築く。',en:'Guardian of the Sanctuary who can transform into a tiger. Initially hostile but builds a trust relationship after battling Subaru.'},traits:{ja:['虎','守護','半獣人','成長','信頼'],en:['Tiger','Guardian','Half-Beast','Growth','Trust']},radar:[82,58,55,72,58,70]},
  // ── 新世紀エヴァンゲリオン追加 ──
  {id:'misato_eva',icon:'🍺',name:{ja:'葛城ミサト',en:'Misato Katsuragi'},series:{ja:'新世紀エヴァンゲリオン',en:'Neon Genesis Evangelion'},type:{ja:'シンジの保護者 (ENFJ)',en:'Shinji\'s Guardian (ENFJ)'},profile:{E:4,N:3,F:4,J:3},desc:{ja:'NERV作戦局長でシンジの後見人。内なる傷と使命感の間で葛藤しながら使徒との戦いを指揮する。',en:'NERV Operations Director and Shinji\'s guardian. Directs the battle against Angels while conflicting between inner wounds and sense of mission.'},traits:{ja:['指揮','後見人','ビール','傷','使命'],en:['Command','Guardian','Beer','Wound','Mission']},radar:[72,68,68,78,68,72]},
  {id:'ritsuko_eva',icon:'🔬',name:{ja:'赤木リツコ',en:'Ritsuko Akagi'},series:{ja:'新世紀エヴァンゲリオン',en:'Neon Genesis Evangelion'},type:{ja:'冷静な科学者 (INTJ)',en:'Cool Scientist (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'NERV技術部長でマギシステムの管理者。冷静な科学者だが内には深い葛藤と孤独を抱えている。',en:'NERV Technical Director and administrator of the MAGI system. A cool scientist but internally harbors deep conflict and solitude.'},traits:{ja:['科学','冷静','葛藤','孤独','真実'],en:['Science','Cool','Conflict','Solitude','Truth']},radar:[42,88,88,42,88,85]},
  // ── 新しいアニメ系 ──
  {id:'chisato_lr',icon:'🌸',name:{ja:'錦木千束',en:'Chisato Nishikigi'},series:{ja:'リコリス・リコイル',en:'Lycoris Recoil'},type:{ja:'完璧な射撃少女の裏の秘密 (ENFP)',en:'Hidden Secret of Perfect Shooting Girl (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'DAのナンバーワンリコリスで最強の射撃手。常に笑顔で前向きだが、心臓の問題という深刻な秘密を持つ。',en:'Number one Lycoris of DA and the strongest gunman. Always smiling and positive, but has a serious secret involving a heart condition.'},traits:{ja:['射撃','最強','笑顔','秘密','友情'],en:['Shooting','Strongest','Smile','Secret','Friendship']},radar:[85,75,70,92,72,80]},
  {id:'takina_lr',icon:'🔫',name:{ja:'井ノ上たきな',en:'Takina Inoue'},series:{ja:'リコリス・リコイル',en:'Lycoris Recoil'},type:{ja:'エリートリコリスの成長 (ISTJ)',en:'Elite Lycoris\'s Growth (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'元エリートリコリスで感情表現が苦手。千束との出会いで少しずつ感情を取り戻していく成長型。',en:'Former elite Lycoris who is bad at expressing emotions. A growth type who gradually regains emotions through her encounter with Chisato.'},traits:{ja:['射撃','感情','成長','エリート','友情'],en:['Shooting','Emotion','Growth','Elite','Friendship']},radar:[72,78,78,62,78,82]},
  // ── 推しの子追加 ──
  {id:'aqua_oshinoko',icon:'⭐',name:{ja:'アクア',en:'Aqua'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'復讐を誓う転生アイドル (INTJ)',en:'Reincarnated Idol Swearing Revenge (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'アイドルAIの息子として転生した少年。母の死の真相を追い、芸能界で復讐の機会を狙う複雑な人物。',en:'A boy reincarnated as idol AI\'s son. Pursues the truth of his mother\'s death while targeting revenge opportunities in the entertainment world.'},traits:{ja:['復讐','転生','芸能','冷静','愛'],en:['Revenge','Reincarnation','Entertainment','Cool','Love']},radar:[48,85,85,52,85,85]},
  {id:'ruby_oshinoko',icon:'💎',name:{ja:'ルビー',en:'Ruby'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'前向きなアイドル転生 (ESFP)',en:'Positive Idol Reincarnation (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'アイドルAIの娘として転生した少女。母のようにアイドルとして輝くことを夢見る純粋で情熱的な少女。',en:'A girl reincarnated as idol AI\'s daughter. A pure and passionate girl who dreams of shining as an idol like her mother.'},traits:{ja:['アイドル','夢','情熱','転生','純粋'],en:['Idol','Dream','Passion','Reincarnation','Pure']},radar:[85,52,48,92,52,70]},
  {id:'kana_oshinoko',icon:'🎭',name:{ja:'有馬かな',en:'Kana Arima'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'元天才子役の挫折 (ISFP)',en:'Former Genius Child Actor\'s Setback (ISFP)'},profile:{I:3,S:3,F:4,P:3},desc:{ja:'かつて天才子役と呼ばれたが実力の伸び悩みを経験。ルビーと出会い再び輝くことに情熱を取り戻す。',en:'Once called a genius child actor but experienced stagnation. Meets Ruby and regains passion to shine again.'},traits:{ja:['子役','天才','挫折','成長','ライバル'],en:['Child Actor','Genius','Setback','Growth','Rival']},radar:[75,68,65,72,68,72]},
  // ── ひろがるスカイ!プリキュア ──
  {id:'sorawatching_pc',icon:'☁️',name:{ja:'ソラ・ハレワタール',en:'Sora Harewataru'},series:{ja:'ひろがるスカイ！プリキュア',en:'Hirogaru Sky! Pretty Cure'},type:{ja:'空を目指す勇者見習い (ENFP)',en:'Apprentice Hero Aiming for the Sky (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'スカイランドから来た勇者見習いの少女。勇者に憧れ正義感あふれ、仲間と共に成長していく。',en:'A girl apprentice hero who came from Skyland. Full of admiration for heroes and sense of justice; grows together with friends.'},traits:{ja:['勇者','正義','成長','空','友情'],en:['Hero','Justice','Growth','Sky','Friendship']},radar:[82,58,55,90,58,72]},
  // ── バンドリ!系 ──
  {id:'kasumi_bang',icon:'🎸',name:{ja:'戸山香澄',en:'Kasumi Toyama'},series:{ja:'バンドリ！',en:'BanG Dream!'},type:{ja:'キラキラの追求者 (ENFP)',en:'Seeker of Sparkle (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'ポピパのギタリストで「キラキラどきどき」を求める。無鉄砲だが純粋な情熱でバンドを引っ張る。',en:'Guitarist of Poppin\'Party who seeks "sparkling heart-pounding." Reckless but leads the band with pure passion.'},traits:{ja:['ギター','キラキラ','純粋','情熱','バンド'],en:['Guitar','Sparkle','Pure','Passion','Band']},radar:[88,42,38,95,42,62]},
  // ── 鬼滅の刃追加 ──
  {id:'genya_ds',icon:'🌱',name:{ja:'不死川玄弥',en:'Genya Shinazugawa'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'悲劇の鬼喰い (ISTP)',en:'Tragic Demon Eater (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'鬼を食べることで一時的に鬼の力を得る異質な鬼殺隊士。兄への後悔と憧れを抱え孤独に戦う。',en:'An unusual demon slayer who temporarily gains demon power by eating demons. Fights alone while carrying regret and admiration for his older brother.'},traits:{ja:['鬼喰い','悲劇','兄','孤独','成長'],en:['Demon Eater','Tragedy','Brother','Solitude','Growth']},radar:[72,60,58,62,60,68]},
  {id:'sanemi_ds',icon:'💨',name:{ja:'不死川実弥',en:'Sanemi Shinazugawa'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'荒々しい風柱 (ESTP)',en:'Fierce Wind Hashira (ESTP)'},profile:{E:4,S:4,T:4,P:3},desc:{ja:'風柱で攻撃的な性格。鬼への憎悪は深いが、その裏には弟を守れなかった後悔が隠れている。',en:'Wind Hashira with an aggressive personality. Hatred for demons runs deep, but hidden behind it is regret for not protecting his younger brother.'},traits:{ja:['風','荒々しい','憎悪','後悔','強さ'],en:['Wind','Fierce','Hatred','Regret','Strength']},radar:[85,62,58,52,62,75]},
  {id:'obanai_ds',icon:'🐍',name:{ja:'伊黒小芭内',en:'Obanai Iguro'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'蛇柱の孤高 (INTJ)',en:'Serpent Hashira Solitary (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'蛇柱で厳格な性格。蜜璃への一方的な恋心と自分を縛る過去に葛藤しながら戦う。',en:'Serpent Hashira with a strict personality. Fights while conflicting with one-sided love for Mitsuri and a past that binds him.'},traits:{ja:['蛇','厳格','愛','過去','孤高'],en:['Serpent','Strict','Love','Past','Solitary']},radar:[55,80,80,52,80,85]},
  {id:'gyomei_ds',icon:'🙏',name:{ja:'悲鳴嶼行冥',en:'Gyomei Himejima'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'岩柱の祈り (INFJ)',en:'Stone Hashira Prayer (INFJ)'},profile:{I:4,N:3,F:4,J:4},desc:{ja:'岩柱で最強の剣士と言われる盲目の大男。子供たちを守れなかった過去を背負い、常に祈りを捧げる。',en:'Stone Hashira, a blind giant said to be the strongest swordsman. Always offers prayers while bearing the past of failing to protect children.'},traits:{ja:['岩','祈り','最強','盲目','過去'],en:['Stone','Prayer','Strongest','Blind','Past']},radar:[68,90,88,75,90,92]},
  // ── 少女革命ウテナ ──
  {id:'utena_sr',icon:'🌹',name:{ja:'天上ウテナ',en:'Utena Tenjou'},series:{ja:'少女革命ウテナ',en:'Revolutionary Girl Utena'},type:{ja:'王子様を夢見る少女 (ENFP)',en:'Girl Dreaming of a Prince (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'王子様になることを夢見る少女。バラの花嫁を守るため剣で戦う革命的な少女の成長物語。',en:'A girl who dreams of becoming a prince. A revolutionary growth story of a girl who fights with a sword to protect the Rose Bride.'},traits:{ja:['王子様','剣','革命','成長','バラ'],en:['Prince','Sword','Revolution','Growth','Rose']},radar:[78,65,62,85,65,72]},
  // ── ヴァンパイア系 ──
  {id:'alucard_hn',icon:'🧛',name:{ja:'アル様',en:'Arucard'},series:{ja:'ヘルシング アルティメット',en:'Hellsing Ultimate'},type:{ja:'不滅の神 (INTJ)',en:'Immortal God (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ヘルシング機関最強の存在。全ての怪物の力を吸収した究極の吸血鬼で、戦いを楽しむ謎の存在。',en:'The strongest being in the Hellsing organization. An ultimate vampire who absorbed the power of all monsters; a mysterious being who enjoys battle.'},traits:{ja:['不滅','最強','謎','吸血鬼','楽しみ'],en:['Immortal','Strongest','Mystery','Vampire','Enjoyment']},radar:[52,99,95,28,99,90]},
  // ── 斉木楠雄のΨ難 ──
  {id:'saiki_sk',icon:'💫',name:{ja:'斉木楠雄',en:'Kusuo Saiki'},series:{ja:'斉木楠雄のΨ難',en:'The Disastrous Life of Saiki K.'},type:{ja:'超能力者の普通願望 (INTJ)',en:'Esper Wishing for Normalcy (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'圧倒的な超能力を持ちながら普通の高校生活を望む少年。他者の心が読めるので孤独を好む皮肉な超能力者。',en:'A boy with overwhelming psychic powers who wishes for a normal high school life. A ironic psychic who prefers solitude because he can read others\' minds.'},traits:{ja:['超能力','普通願望','孤独','テレパシー','コーヒーゼリー'],en:['Psychic','Wish for Normalcy','Solitude','Telepathy','Coffee Jelly']},radar:[45,98,95,38,98,88]},
  // ── 王様ランキング ──
  {id:'bojji_kr',icon:'👑',name:{ja:'ボッジ',en:'Bojji'},series:{ja:'王様ランキング',en:'Ranking of Kings'},type:{ja:'聞こえない優しき王子 (INFP)',en:'Deaf Kind Prince (INFP)'},profile:{I:3,N:4,F:4,P:3},desc:{ja:'聞こえず喋れない障害を持つ王子。小さな体で懸命に王を目指す姿が感動的な作品の主人公。',en:'A prince with disabilities of deafness and muteness. The protagonist of a moving work showing a small body earnestly aiming to be king.'},traits:{ja:['優しさ','成長','王子','障害','純粋'],en:['Kindness','Growth','Prince','Disability','Pure']},radar:[55,58,55,92,55,68]},
  {id:'kage_kr',icon:'🌑',name:{ja:'カゲ',en:'Kage'},series:{ja:'王様ランキング',en:'Ranking of Kings'},type:{ja:'影族の友人 (ISTP)',en:'Shadow Tribe Friend (ISTP)'},profile:{I:4,S:4,T:3,P:3},desc:{ja:'ボッジの親友となる影族の少年。最初は利己的だったが、ボッジとの友情で変わっていく。',en:'A shadow tribe boy who becomes Bojji\'s best friend. Initially selfish but changes through friendship with Bojji.'},traits:{ja:['影','友情','成長','利己的','変化'],en:['Shadow','Friendship','Growth','Selfish','Change']},radar:[62,62,58,70,60,68]},
  // ── 魔王城でおやすみ ──
  {id:'syalis_mj',icon:'😴',name:{ja:'スヤリス姫',en:'Princess Syalis'},series:{ja:'魔王城でおやすみ',en:'Sleepy Princess in the Demon Castle'},type:{ja:'眠りを求める姫 (ISTP)',en:'Princess Seeking Sleep (ISTP)'},profile:{I:4,S:4,T:3,P:4},desc:{ja:'魔王城に囚われた姫だが夢中なのは快眠追求。魔物を倒して素材を集め、快適な環境を作るコメディの主人公。',en:'A princess imprisoned in the Demon Castle, but absorbed in pursuing comfortable sleep. Protagonist of a comedy who defeats monsters to collect materials for a comfortable environment.'},traits:{ja:['睡眠','追求','コメディ','姫','無敵'],en:['Sleep','Pursuit','Comedy','Princess','Invincible']},radar:[55,68,65,62,65,65]},
  // ── ゲーム系アニメ ──
  {id:'naofumi2_sh',icon:'🛡️',name:{ja:'クェスト・オブ・ザ・シールド・ヒーロー',en:'Shield Protector'},series:{ja:'盾の勇者の成り上がり',en:'The Rising of Shield Hero'},type:{ja:'最強の盾 (ISTJ)',en:'Strongest Shield (ISTJ)'},profile:{I:3,S:4,T:3,J:4},desc:{ja:'盾の勇者として成長したナオフミの象徴。仲間への信頼と盾による守護戦略で敵を圧倒する。',en:'Symbol of Naofumi grown as the Shield Hero. Overwhelms enemies with trust in comrades and shield-based defensive strategy.'},traits:{ja:['盾','守護','信頼','戦略','成長'],en:['Shield','Guardian','Trust','Strategy','Growth']},radar:[62,82,80,72,80,88]},
  // ── ソードアート・オンライン追加 ──
  {id:'lisbeth_sao',icon:'🔨',name:{ja:'リズベット',en:'Lisbeth'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'鍛冶師の職人 (ISFP)',en:'Blacksmith Craftsman (ISFP)'},profile:{I:3,S:4,F:4,P:3},desc:{ja:'SAOで鍛冶師として活躍するアスナの友人。誇りある職人気質でキリトへの淡い恋心も持つ。',en:'Asuna\'s friend who works as a blacksmith in SAO. A proud craftsman who also has faint romantic feelings for Kirito.'},traits:{ja:['鍛冶','誇り','友情','恋','職人'],en:['Smithing','Pride','Friendship','Love','Craftsman']},radar:[62,72,68,75,70,75]},
  {id:'yuna_sao',icon:'🎤',name:{ja:'ユナ',en:'Yuna'},series:{ja:'ソードアート・オンライン オーディナル・スケール',en:'SAO: Ordinal Scale'},type:{ja:'AIシンガーの記憶 (INFP)',en:'AI Singer\'s Memory (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'AR世界で活躍するバーチャルシンガー。実は消えた人物の記憶から作られた存在で、その真実が切ない。',en:'A virtual singer who works in the AR world. Actually created from the memories of a disappeared person; that truth is heartbreaking.'},traits:{ja:['歌','記憶','AR','切なさ','存在'],en:['Song','Memory','AR','Heartbreak','Existence']},radar:[52,72,70,80,72,72]},
  // ── 悪役令嬢系 ──
  {id:'katarina_vl',icon:'👸',name:{ja:'カタリナ・クラエス',en:'Katarina Claes'},series:{ja:'乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…',en:'My Next Life as a Villainess'},type:{ja:'破滅回避の農業令嬢 (ESFP)',en:'Farming Villainess Avoiding Doom (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'乙女ゲームの悪役令嬢として転生。前世の記憶で破滅エンドを回避しようと奮闘するコメディ主人公。',en:'Reincarnated as a villainess in an otome game. A comedy protagonist who struggles to avoid bad endings using memories from her past life.'},traits:{ja:['悪役令嬢','農業','鈍感','転生','友情'],en:['Villainess','Farming','Oblivious','Reincarnation','Friendship']},radar:[78,42,38,92,42,58]},
  // ── 魔法少女まどか追加 ──
  {id:'nagisa_mgk',icon:'🧀',name:{ja:'美国織莉子',en:'Oriko Mikuni'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'孤独な予知者 (INTJ)',en:'Lonely Seer (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'未来が見える魔法少女で独自の判断で世界を守ろうとする。孤独と犠牲の中に純粋な正義心を持つ。',en:'A magical girl who can see the future, trying to protect the world with her own judgment. Has pure sense of justice amidst solitude and sacrifice.'},traits:{ja:['予知','孤独','正義','判断','犠牲'],en:['Precognition','Solitude','Justice','Judgment','Sacrifice']},radar:[42,85,82,48,85,82]},
  // ── よりもい追加 ──
  {id:'shirase2_ymy',icon:'🌊',name:{ja:'小淵沢報瀬',en:'Shirase Kobuchizawa'},series:{ja:'宇宙よりも遠い場所',en:'A Place Further Than the Universe'},type:{ja:'夢を叶える意志 (INTJ)',en:'Will to Fulfill Dreams (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'南極に消えた母を探しに行くことを決意した少女。夢を笑われても折れない強い意志と行動力を持つ。',en:'A girl who decided to go to Antarctica to find her missing mother. Has strong will and action power that doesn\'t break even when dreams are laughed at.'},traits:{ja:['南極','意志','母','友情','行動力'],en:['Antarctica','Will','Mother','Friendship','Action']},radar:[58,82,80,72,80,82]},
  // ── 五等分の花嫁（追加） ──
  {id:'futaro2_nk',icon:'📚',name:{ja:'中野一花',en:'Ichika Nakano'},series:{ja:'五等分の花嫁',en:'The Quintessential Quintuplets'},type:{ja:'女優志望の長女 (ENFJ)',en:'Aspiring Actress Eldest (ENFJ)'},profile:{E:3,N:3,F:4,J:3},desc:{ja:'中野五姉妹の長女で女優を目指す。明るく大人っぽい雰囲気と姉妹への愛情が印象的。',en:'Eldest of the Nakano quintuplets who aspires to be an actress. Impressive bright and mature atmosphere and love for her sisters.'},traits:{ja:['長女','女優','明るさ','姉妹','恋'],en:['Eldest','Actress','Brightness','Sisters','Love']},radar:[72,65,62,80,65,72]},
  // ── キャプテン翼 ──
  {id:'tsubasa_ct',icon:'⚽',name:{ja:'大空翼',en:'Tsubasa Ozora'},series:{ja:'キャプテン翼',en:'Captain Tsubasa'},type:{ja:'サッカーを愛する主人公 (ENFP)',en:'Soccer-Loving Protagonist (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'「ボールは友達！」が信条のサッカー選手。世界を目指して成長し続ける情熱的なフォワード。',en:'A soccer player whose creed is "The ball is my friend!" A passionate forward who continues growing toward the world stage.'},traits:{ja:['サッカー','情熱','友達','夢','成長'],en:['Soccer','Passion','Friend','Dream','Growth']},radar:[85,55,50,92,55,72]},
  {id:'hyuga_ct',icon:'⚽',name:{ja:'日向小次郎',en:'Kojiro Hyuga'},series:{ja:'キャプテン翼',en:'Captain Tsubasa'},type:{ja:'タイガーショットのエース (ESTP)',en:'Tiger Shot Ace (ESTP)'},profile:{E:4,S:4,T:4,P:3},desc:{ja:'若林にゴールを決めることを生きがいとする不良FW。家族のために戦い、最終的に翼の好敵手に成長。',en:'A delinquent FW who lives to score goals against Wakabayashi. Fights for his family; ultimately grows into Tsubasa\'s worthy rival.'},traits:{ja:['タイガーショット','不良','家族','ライバル','情熱'],en:['Tiger Shot','Delinquent','Family','Rival','Passion']},radar:[88,58,55,78,58,72]},
  // ── 機動警察パトレイバー ──
  {id:'noa_ptl',icon:'🤖',name:{ja:'泉野明',en:'Noa Izumi'},series:{ja:'機動警察パトレイバー',en:'Patlabor'},type:{ja:'レイバーを愛する警察官 (ENFP)',en:'Police Officer Who Loves Labors (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'特車二課一班のパトレイバーパイロットでアルフォンスが大好き。人型ロボットへの愛情が仕事への情熱に直結する。',en:'Patlabor pilot of Special Vehicle Second Division, 1st Unit who loves Alphonse. Love for humanoid robots directly links to work passion.'},traits:{ja:['レイバー','愛情','警察','情熱','女性'],en:['Labor','Love','Police','Passion','Female']},radar:[80,58,55,90,58,68]},
  // ── ガンダム追加 ──
  {id:'setsuna_gnd',icon:'💚',name:{ja:'刹那・F・セイエイ',en:'Setsuna F. Seiei'},series:{ja:'機動戦士ガンダム00',en:'Gundam 00'},type:{ja:'ガンダムになった少年 (INTJ)',en:'Boy Who Became Gundam (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'ガンダムマイスターでガンダムを絶対視する少年。「俺がガンダムだ」という名言で知られる革新。',en:'A Gundam Meister boy who absolutely believes in Gundam. Known for the famous line "I am Gundam"; an Innovator.'},traits:{ja:['ガンダム','革新','孤独','使命','成長'],en:['Gundam','Innovator','Solitude','Mission','Growth']},radar:[45,82,80,42,82,82]},
  {id:'lacus_seed',icon:'🎵',name:{ja:'ラクス・クライン',en:'Lacus Clyne'},series:{ja:'機動戦士ガンダムSEED',en:'Gundam SEED'},type:{ja:'歌姫の平和使者 (INFJ)',en:'Singing Princess of Peace (INFJ)'},profile:{I:3,N:4,F:4,J:3},desc:{ja:'PLANTのアイドル歌手で平和を訴える存在。歌声と言葉で戦争に終止符を打とうとする希望の象徴。',en:'PLANT idol singer who appeals for peace. A symbol of hope trying to put an end to war with song and words.'},traits:{ja:['歌','平和','希望','PLANT','カリスマ'],en:['Song','Peace','Hope','PLANT','Charisma']},radar:[55,80,78,82,78,80]},
  // ── 転スラ追加 ──
  {id:'souei_tensura',icon:'🌑',name:{ja:'ソウエイ',en:'Souei'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'影の忍者 (ISTJ)',en:'Shadow Ninja (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'リムルの配下で諜報担当の鬼人族。寡黙で冷静、情報収集と暗殺を担う影の存在。',en:'Rimuru\'s subordinate responsible for intelligence, a member of the Oni clan. Taciturn and calm; exists in shadow responsible for intelligence gathering and assassination.'},traits:{ja:['影','諜報','冷静','忍者','忠義'],en:['Shadow','Intelligence','Calm','Ninja','Loyalty']},radar:[55,82,80,45,82,88]},
  {id:'shuna_tensura',icon:'🌸',name:{ja:'シュナ',en:'Shuna'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'鬼人族の姫巫女 (INFJ)',en:'Oni Princess Priestess (INFJ)'},profile:{I:3,N:3,F:4,J:3},desc:{ja:'鬼人族の姫でリムルへの忠誠心が深い。妖艶な美しさと高い魔法の実力を持つ癒し系のキャラ。',en:'Princess of the Oni clan with deep loyalty to Rimuru. A healing-type character with bewitching beauty and high magic ability.'},traits:{ja:['姫','巫女','魔法','美しさ','忠義'],en:['Princess','Priestess','Magic','Beauty','Loyalty']},radar:[52,72,70,80,70,78]},
  // ── 俺だけ入れる隠しダンジョン ──
  {id:'noir_dn',icon:'⚔️',name:{ja:'ノワール・スタニッツ',en:'Noir Stanholt'},series:{ja:'俺だけ入れる隠しダンジョン',en:'The Hidden Dungeon Only I Can Enter'},type:{ja:'スキルを習得する底辺貴族 (ISFP)',en:'Bottom Noble Learning Skills (ISFP)'},profile:{I:3,S:3,F:3,P:3},desc:{ja:'最弱の貴族の息子だがダンジョン探索で強力なスキルを得た少年。キスでスキルを習得するユニークな能力を持つ。',en:'Son of the weakest noble who gained powerful skills through dungeon exploration. Has the unique ability to acquire skills through kissing.'},traits:{ja:['成長','ダンジョン','ユニーク','スキル','謙虚'],en:['Growth','Dungeon','Unique','Skills','Humble']},radar:[55,65,62,68,65,68]},
  // ── デート・ア・ライブ追加 ──
  {id:'origami_dal',icon:'🌙',name:{ja:'鳶一折紙',en:'Origami Tobiichi'},series:{ja:'デート・ア・ライブ',en:'Date A Live'},type:{ja:'精霊ハンターから精霊へ (ISTJ)',en:'From Spirit Hunter to Spirit (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'AST隊員で精霊討伐を生きがいとしていた少女。精霊の真実を知り、自身も精霊となった。',en:'An AST member who lived for spirit elimination. Learned the truth about spirits and became one herself.'},traits:{ja:['精霊ハンター','変化','シドーへの恋','強さ','過去'],en:['Spirit Hunter','Change','Love for Shido','Strength','Past']},radar:[55,75,72,52,72,80]},
  {id:'miku_dal',icon:'🎵',name:{ja:'夕弦五河',en:'Miku Izayoi'},series:{ja:'デート・ア・ライブ',en:'Date A Live'},type:{ja:'歌姫の精霊 (ENFJ)',en:'Singer Spirit (ENFJ)'},profile:{E:4,N:3,F:4,J:3},desc:{ja:'歌の力で人々を操ることができる精霊。最初は他者への強い嫌悪を持ったが、シドーとの出会いで変わる。',en:'A spirit who can control people with the power of song. Initially had strong dislike for others, but changed through encountering Shido.'},traits:{ja:['歌','精霊','変化','プライド','友情'],en:['Song','Spirit','Change','Pride','Friendship']},radar:[75,65,62,78,65,72]},
  // ── ノーゲーム追加 ──
  {id:'shiro2_ngnl',icon:'🎮',name:{ja:'ステファニー・ドーラ',en:'Stephanie Dola'},series:{ja:'ノーゲーム・ノーライフ',en:'No Game No Life'},type:{ja:'努力する元王女 (ESFJ)',en:'Hardworking Former Princess (ESFJ)'},profile:{E:4,S:3,F:4,J:3},desc:{ja:'イマニティの元王女でゲームに弱い。空白(ブランク)に振り回されながらも人類のために尽力する。',en:'Former princess of Imanity who is bad at games. Works for humanity\'s sake while being buffeted by Blank.'},traits:{ja:['元王女','努力','ゲーム下手','人類','誠実'],en:['Former Princess','Effort','Bad at Games','Humanity','Sincere']},radar:[65,45,42,82,45,62]},
  // ── キノの旅 ──
  {id:'kino_journey',icon:'🔫',name:{ja:'キノ',en:'Kino'},series:{ja:'キノの旅',en:'Kino\'s Journey'},type:{ja:'世界を旅する銃使い (ISTP)',en:'Gun-Wielding World Traveler (ISTP)'},profile:{I:4,S:4,T:3,P:4},desc:{ja:'モトラドのエルメスと共に世界を旅する少年のような少女。様々な国の文化を観察し、判断を避ける中立の旅人。',en:'A girl who looks like a boy traveling the world with Motorrad Hermes. A neutral traveler who observes various countries\' cultures while avoiding judgment.'},traits:{ja:['旅','銃','中立','観察','成長'],en:['Journey','Gun','Neutral','Observation','Growth']},radar:[52,80,78,58,78,72]},
  // ── 時をかける少女 ──
  {id:'makoto_tts',icon:'⏰',name:{ja:'紺野真琴',en:'Makoto Konno'},series:{ja:'時をかける少女',en:'The Girl Who Leapt Through Time'},type:{ja:'タイムリープする少女 (ESFP)',en:'Time-Leaping Girl (ESFP)'},profile:{E:3,S:4,F:4,P:4},desc:{ja:'タイムリープ能力を得た普通の女子高生。最初は気軽に使っていたが、時間の重さを理解していく。',en:'An ordinary high school girl who gained time-leap ability. Initially used it lightly but gradually understands the weight of time.'},traits:{ja:['タイムリープ','成長','友情','後悔','時間'],en:['Time Leap','Growth','Friendship','Regret','Time']},radar:[72,52,48,82,52,65]},
  // ── サクラ大戦 ──
  {id:'sakura_st',icon:'🌸',name:{ja:'真宮寺さくら',en:'Sakura Shinguji'},series:{ja:'サクラ大戦',en:'Sakura Wars'},type:{ja:'大正の剣士 (ENFJ)',en:'Taisho Era Swordswoman (ENFJ)'},profile:{E:4,N:3,F:4,J:3},desc:{ja:'帝国歌劇団の花組で夢を追う少女。父の意志を継ぎ、帝劇と帝国を守るために戦う純粋な心を持つ。',en:'A girl pursuing dreams in the Teikoku Kagekidan Hana-gumi. Has a pure heart fighting to protect the Imperial Theater and Empire, inheriting her father\'s will.'},traits:{ja:['剣士','大正','歌劇団','純粋','父親'],en:['Swordswoman','Taisho Era','Theater','Pure','Father']},radar:[78,62,58,88,62,72]},
  // ── 月が導く異世界道中 ──
  {id:'makoto_tsuki',icon:'🌙',name:{ja:'深澄真',en:'Makoto Misumi'},series:{ja:'月が導く異世界道中',en:'Tsuki ga Michibiku Isekai Douchuu'},type:{ja:'弓の達人の転生者 (INTJ)',en:'Archery Master Reincarnator (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'日本から転生した弓の使い手。女神に見放された後、月の神に拾われ強大な力を得る。',en:'An archery user reincarnated from Japan. After being abandoned by a goddess, picked up by the Moon God and gains great power.'},traits:{ja:['弓','転生','月','成長','仲間'],en:['Bow','Reincarnation','Moon','Growth','Comrades']},radar:[52,82,80,58,80,80]},
  // ── 古典部追加 ──
  {id:'satoshi_hyouka',icon:'🗓️',name:{ja:'福部里志',en:'Satoshi Fukube'},series:{ja:'氷菓',en:'Hyouka'},type:{ja:'データベースマン (ENTP)',en:'Database Man (ENTP)'},profile:{E:3,N:4,T:3,P:4},desc:{ja:'古典部の情報収集家で奉太郎の親友。博識で明るいがデータを「持っているだけ」と言う謙虚さを持つ。',en:'Information gatherer of the Classics Club and Hotaro\'s best friend. Knowledgeable and bright but has the humility to say he only "holds data."'},traits:{ja:['データ','博識','謙虚','友情','ミステリ'],en:['Data','Knowledgeable','Humble','Friendship','Mystery']},radar:[72,72,68,72,70,70]},
  // ── 普通の女子校生が【ろこどる】やってみた ──
  {id:'nako_rcd',icon:'🎤',name:{ja:'上板橋七子',en:'Nako Kamibayashi'},series:{ja:'普通の女子校生が【ろこどる】やってみた',en:'Locodol'},type:{ja:'普通なローカルアイドル (ISFJ)',en:'Ordinary Local Idol (ISFJ)'},profile:{I:3,S:3,F:4,J:3},desc:{ja:'地元のローカルアイドルとしてデビューした普通の女子校生。臆病だが仲間と共に少しずつ成長していく。',en:'An ordinary high school girl who debuted as a local idol. Timid but gradually grows together with her partner.'},traits:{ja:['ローカル','アイドル','普通','成長','友情'],en:['Local','Idol','Ordinary','Growth','Friendship']},radar:[55,55,52,72,55,65]},
  // ── 地縛少年花子くん ──
  {id:'hanako_jibaku',icon:'🚻',name:{ja:'花子くん',en:'Hanako-kun'},series:{ja:'地縛少年花子くん',en:'Toilet-Bound Hanako-kun'},type:{ja:'トイレの霊の番人 (INFP)',en:'Guardian Spirit of the Toilet (INFP)'},profile:{I:3,N:4,F:4,P:3},desc:{ja:'七不思議の七番目のトイレの花子さん。実は少年の幽霊で噂を管理している。悲しい過去と現在の優しさが交錯。',en:'The 7th of the Seven Mysteries, Hanako-san of the Toilet. Actually a male ghost who manages rumors. Sad past and present kindness intersect.'},traits:{ja:['幽霊','七不思議','トイレ','過去','優しさ'],en:['Ghost','Seven Mysteries','Toilet','Past','Kindness']},radar:[55,72,70,72,72,72]},
  // ── 小林さんちのメイドラゴン追加 ──
  {id:'kobayashi_md',icon:'💻',name:{ja:'小林さん',en:'Miss Kobayashi'},series:{ja:'小林さんちのメイドラゴン',en:'Miss Kobayashi\'s Dragon Maid'},type:{ja:'平凡なドラゴン使いの主人 (ISTJ)',en:'Ordinary Dragon-Employing Master (ISTJ)'},profile:{I:4,S:3,T:4,J:3},desc:{ja:'IT企業に勤めるプログラマーで偶然ドラゴンのトールを雇うことになる。メイドスキルへの執着が印象的。',en:'A programmer working at an IT company who accidentally ends up employing dragon Tohru. Her obsession with maid skills is impressive.'},traits:{ja:['プログラマー','メイド','普通','受け入れ','成長'],en:['Programmer','Maid','Ordinary','Acceptance','Growth']},radar:[52,72,70,68,70,75]},
  // ── 魔入りました!入間くん追加 ──
  {id:'azz_iruma',icon:'👹',name:{ja:'アスモデウス・アリス',en:'Asmodeus Alice'},series:{ja:'魔入りました！入間くん',en:'Welcome to Demon School! Iruma-kun'},type:{ja:'超一流の悪魔 (ENFJ)',en:'Top-Class Demon (ENFJ)'},profile:{E:4,N:3,F:4,J:4},desc:{ja:'悪魔学校でトップクラスの成績を誇る悪魔。入間の最初の友人になり忠誠心が非常に高い。',en:'A demon with top-class grades at the demon school. Becomes Iruma\'s first friend with very high loyalty.'},traits:{ja:['悪魔','優秀','友情','忠誠','美形'],en:['Demon','Excellent','Friendship','Loyalty','Handsome']},radar:[72,72,68,80,70,78]},
  // ── ブラックラグーン追加 ──
  {id:'dutch_br',icon:'⚓',name:{ja:'ダッチ',en:'Dutch'},series:{ja:'ブラック・ラグーン',en:'Black Lagoon'},type:{ja:'ラグーン社の船長 (ISTJ)',en:'Lagoon Company Captain (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'ブラック・ラグーン商会のリーダーで元海兵隊員。冷静な判断力と実行力でチームをまとめる実力者。',en:'Leader of Black Lagoon Company and former Marine. An able person who organizes the team with calm judgment and execution.'},traits:{ja:['船長','元海兵隊','冷静','リーダー','実力'],en:['Captain','Ex-Marine','Calm','Leader','Skill']},radar:[62,78,80,58,78,85]},
  // ── 鋼の錬金術師追加 ──
  {id:'hawkeye2_fma',icon:'🔫',name:{ja:'ファルマン中尉',en:'Lieutenant Falman'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'マスタング班の記憶の達人 (ISTJ)',en:'Mustang Team Memory Expert (ISTJ)'},profile:{I:4,S:4,T:3,J:4},desc:{ja:'マスタング大佐の部下で記憶力が抜群。完璧な記憶で役立つ資料を提供する忠実な部下。',en:'Subordinate of Colonel Mustang with exceptional memory. A loyal subordinate who provides useful materials with perfect memory.'},traits:{ja:['記憶','忠実','実直','部下','マスタング'],en:['Memory','Loyal','Straightforward','Subordinate','Mustang']},radar:[52,78,78,60,78,85]},
  {id:'greed_fma2',icon:'💎',name:{ja:'グリード(2)',en:'Greed (Ling)'},series:{ja:'鋼の錬金術師',en:'Fullmetal Alchemist'},type:{ja:'欲望の哲学者 (ENTP)',en:'Philosopher of Desire (ENTP)'},profile:{E:4,N:4,T:3,P:4},desc:{ja:'リンの体に宿ったグリードとリンの融合体。欲望と人への優しさが混在する複雑なキャラクター。',en:'A fusion of Greed who resides in Ling\'s body and Ling himself. A complex character where desire and kindness toward people coexist.'},traits:{ja:['欲望','融合','複雑','友情','変化'],en:['Desire','Fusion','Complex','Friendship','Change']},radar:[72,65,62,72,65,70]},
  // ── 仮面ライダー系 ──
  {id:'shinji_kr',icon:'🌀',name:{ja:'仮面ライダー龍騎',en:'Kamen Rider Ryuki'},series:{ja:'仮面ライダー龍騎',en:'Kamen Rider Ryuki'},type:{ja:'正義を求める新聞記者 (ENFP)',en:'Journalist Seeking Justice (ENFP)'},profile:{E:4,N:4,F:4,P:3},desc:{ja:'新聞記者でありながら仮面ライダーとなった少年。ライダーバトルに巻き込まれながら正義を追い続ける。',en:'A boy who becomes a Kamen Rider while being a newspaper reporter. Continues pursuing justice while caught up in Rider battles.'},traits:{ja:['正義','新聞記者','仮面ライダー','成長','友情'],en:['Justice','Reporter','Kamen Rider','Growth','Friendship']},radar:[78,58,55,85,58,68]},
  // ── 美少女戦士セーラームーン追加 ──
  {id:'chibiusa_sm',icon:'🌙',name:{ja:'ちびうさ',en:'Chibiusa'},series:{ja:'美少女戦士セーラームーン',en:'Sailor Moon'},type:{ja:'未来の姫 (ENFP)',en:'Princess of the Future (ENFP)'},profile:{E:4,N:3,F:4,P:4},desc:{ja:'未来のうさぎとマモルの娘として現代にやってきた。幼いが強い意志を持ち、成長するセーラー戦士。',en:'Came to the present as the daughter of future Usagi and Mamoru. Young but with a strong will; a growing Sailor Warrior.'},traits:{ja:['未来の姫','成長','意志','愛','月'],en:['Future Princess','Growth','Will','Love','Moon']},radar:[75,48,45,88,48,65]},
  // ── 魔法少女リリカルなのは追加 ──
  {id:'vita_nanoha',icon:'🔨',name:{ja:'ヴィータ',en:'Vita'},series:{ja:'魔法少女リリカルなのは',en:'Magical Girl Lyrical Nanoha'},type:{ja:'鉄槌の騎士 (ISTJ)',en:'Iron Hammer Knight (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'闇の書の守護騎士でシグナムの姉妹。感情的だが仲間への絆は深く、ヘイケ式の鉄槌を振るう。',en:'Guardian Knight of the Book of Darkness and Signum\'s sister. Emotional but with deep bonds to comrades; wields Eisen\'s iron hammer.'},traits:{ja:['鉄槌','騎士','感情','仲間','誠実'],en:['Iron Hammer','Knight','Emotional','Comrades','Sincere']},radar:[72,68,65,72,65,78]},
  {id:'signum_nanoha',icon:'🌺',name:{ja:'シグナム',en:'Signum'},series:{ja:'魔法少女リリカルなのは',en:'Magical Girl Lyrical Nanoha'},type:{ja:'炎剣の将 (ISTJ)',en:'Flame Sword General (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'闇の書の守護騎士でレヴァンティンを持つ剣士。誇り高い武人で主人を守ることに使命感を持つ。',en:'Guardian Knight of the Book of Darkness and swordsman with Laevatein. A proud warrior with a sense of mission to protect her master.'},traits:{ja:['剣','炎','守護騎士','誇り','使命'],en:['Sword','Flame','Guardian Knight','Pride','Mission']},radar:[58,82,85,52,82,90]},
  // ── デジモン追加 ──
  {id:'sora_digimon',icon:'💛',name:{ja:'武之内空',en:'Sora Takenouchi'},series:{ja:'デジモンアドベンチャー',en:'Digimon Adventure'},type:{ja:'愛の紋章の保護者 (ENFJ)',en:'Crest of Love Protector (ENFJ)'},profile:{E:3,F:4,N:3,J:3},desc:{ja:'愛の紋章を持つデジモンアドベンチャーのメンバー。仲間を守ることを優先し、自分を後回しにしがち。',en:'Member of Digimon Adventure bearing the Crest of Love. Prioritizes protecting friends, tending to put herself last.'},traits:{ja:['愛','仲間','保護','自己犠牲','テニス'],en:['Love','Friends','Protection','Self-Sacrifice','Tennis']},radar:[65,68,65,85,65,72]},
  {id:'mimi_digimon',icon:'🌸',name:{ja:'点田ミミ',en:'Mimi Tachikawa'},series:{ja:'デジモンアドベンチャー',en:'Digimon Adventure'},type:{ja:'純粋さの紋章の女の子 (ESFP)',en:'Crest of Sincerity Girl (ESFP)'},profile:{E:4,S:4,F:4,P:4},desc:{ja:'純粋さの紋章を持つお嬢様気質のデジモンアドベンチャーメンバー。最初は甘えん坊だが仲間と共に成長。',en:'Member of Digimon Adventure with Crest of Sincerity and a pampered nature. Initially spoiled but grows together with friends.'},traits:{ja:['純粋','お嬢様','成長','友情','食べること'],en:['Sincerity','Pampered','Growth','Friendship','Food']},radar:[75,42,38,88,42,60]},
  // ── モブサイコ100追加 ──
  {id:'ritsu_mp',icon:'💫',name:{ja:'影山律',en:'Ritsu Kageyama'},series:{ja:'モブサイコ100',en:'Mob Psycho 100'},type:{ja:'超能力への劣等感 (INTJ)',en:'Inferiority Complex Toward Psychic (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'モブの弟で勉強は得意だが超能力がなかった。超能力への憧れと劣等感が複雑に絡み合い成長する。',en:'Mob\'s younger brother who excels at studying but had no psychic powers. Grows with complex entanglement of admiration and inferiority toward psychic powers.'},traits:{ja:['劣等感','成長','弟','勉強','超能力'],en:['Inferiority','Growth','Brother','Study','Psychic']},radar:[48,78,75,52,78,78]},
  // ── ワンパンマン追加 ──
  {id:'king_opm',icon:'👑',name:{ja:'キング',en:'King'},series:{ja:'ワンパンマン',en:'One Punch Man'},type:{ja:'世界最強の男の嘘 (INTJ)',en:'Lie of the World\'s Strongest Man (INTJ)'},profile:{I:4,T:3,N:3,J:3},desc:{ja:'世界最強の英雄として知られるが実は普通の人間。戦いの機会を避けながらも何かと助かる幸運の持ち主。',en:'Known as the world\'s strongest hero but is actually an ordinary human. A lucky person who somehow gets through situations while avoiding battles.'},traits:{ja:['最強の嘘','幸運','ゲーマー','恐れ','コメディ'],en:['Lie of Strongest','Lucky','Gamer','Fear','Comedy']},radar:[28,55,52,40,55,55]},
  {id:'tornado_opm',icon:'🌪️',name:{ja:'竜巻のタツマキ',en:'Tatsumaki'},series:{ja:'ワンパンマン',en:'One Punch Man'},type:{ja:'天才サイキッカー (INTJ)',en:'Genius Psychic (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'最高位のS級ヒーローでESPの達人。幼い外見に反して圧倒的な念力を持つクールなヒーロー。',en:'Highest ranked S-Class hero and master of ESP. A cool hero with overwhelming psychokinesis contrary to her child-like appearance.'},traits:{ja:['念力','S級','幼い外見','実力','姉妹'],en:['Psychokinesis','S-Class','Child Appearance','Skill','Sisters']},radar:[55,90,88,42,90,85]},
  {id:'silverfang_opm',icon:'🥋',name:{ja:'バング',en:'Bang'},series:{ja:'ワンパンマン',en:'One Punch Man'},type:{ja:'流水岩砕拳の師匠 (ISTJ)',en:'Master of Flowing Water Rock Smashing Fist (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'S級3位のヒーローで銀牙流水岩砕拳の使い手。弟子への愛情と正義への信念を持つ老齢の師匠。',en:'S-Class Rank 3 hero and user of Silver Fang\'s Flowing Water Rock Smashing Fist. An elderly master with love for disciples and belief in justice.'},traits:{ja:['武術','師匠','弟子','正義','老齢'],en:['Martial Arts','Master','Disciple','Justice','Elderly']},radar:[65,85,85,72,85,90]},
  // ── カウボーイビバップ追加 ──
  {id:'jet_cb',icon:'⚙️',name:{ja:'ジェット・ブラック',en:'Jet Black'},series:{ja:'カウボーイビバップ',en:'Cowboy Bebop'},type:{ja:'元警官の賞金稼ぎ (ISTJ)',en:'Ex-Cop Bounty Hunter (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'元水星警察の刑事でスパイクのパートナー。義理堅く実直、料理が得意なビバップ号の正式な責任者。',en:'Former Ganymede police detective and Spike\'s partner. Loyal and straightforward; the official person responsible for Bebop who excels at cooking.'},traits:{ja:['元警官','義理','料理','責任','実直'],en:['Ex-Cop','Loyalty','Cooking','Responsibility','Straightforward']},radar:[62,72,70,72,70,80]},
  {id:'ed_cb',icon:'💻',name:{ja:'エドワード・ウォン',en:'Radical Edward'},series:{ja:'カウボーイビバップ',en:'Cowboy Bebop'},type:{ja:'天才ハッカーの自由人 (ENFP)',en:'Genius Hacker Free Spirit (ENFP)'},profile:{E:4,N:4,F:3,P:4},desc:{ja:'天才的なハッカーの少女でビバップ号の一員。自由奔放で予測不能な行動で周囲を驚かせる。',en:'A girl genius hacker who is a member of Bebop. Free-spirited and surprising those around her with unpredictable actions.'},traits:{ja:['ハッカー','天才','自由','予測不能','笑顔'],en:['Hacker','Genius','Free','Unpredictable','Smile']},radar:[82,80,72,85,78,62]},
  // ── Angel Beats追加 ──
  {id:'takamatsu_ab',icon:'💪',name:{ja:'高松',en:'Takamatsu'},series:{ja:'Angel Beats!',en:'Angel Beats!'},type:{ja:'筋肉バカの仲間 (ESFP)',en:'Muscle-Headed Friend (ESFP)'},profile:{E:4,S:4,F:3,P:3},desc:{ja:'SSS団のメンバーで筋肉自慢。眼鏡を外すと別人のようになる。軽い性格だが仲間への思いは本物。',en:'Member of SSS who is proud of his muscles. Becomes like a different person when he takes off his glasses. Lighthearted but genuine feelings for friends.'},traits:{ja:['筋肉','眼鏡','仲間','軽い','ギャップ'],en:['Muscles','Glasses','Friends','Lighthearted','Gap']},radar:[72,42,38,75,42,62]},
  // ── 宝石の国 ──
  {id:'phosphophyllite_hr',icon:'💎',name:{ja:'フォスフォフィライト',en:'Phosphophyllite'},series:{ja:'宝石の国',en:'Land of the Lustrous'},type:{ja:'脆くも変わり続ける宝石 (INFP)',en:'Fragile Yet Ever-Changing Gem (INFP)'},profile:{I:3,N:4,F:4,P:4},desc:{ja:'最も弱い宝石の一つだが変化し続ける存在。記憶と体を失いながらも前に進む姿が印象的な主人公。',en:'One of the weakest gems but an ever-changing existence. An impressive protagonist who keeps moving forward while losing memories and body.'},traits:{ja:['宝石','変化','記憶','脆さ','成長'],en:['Gem','Change','Memory','Fragility','Growth']},radar:[45,72,70,72,72,68]},
  // ── 転生したら第七王子だったので、気ままに魔術を極めます ──
  {id:'lloyd_7th',icon:'📚',name:{ja:'ロイド・バイ・アクファー',en:'Lloyd Bye Acfed'},series:{ja:'転生したら第七王子',en:'Reincarnated as the 7th Prince'},type:{ja:'魔術を極める王子 (INTJ)',en:'Magic-Perfecting Prince (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'転生した王子で魔術の才能を持つ。前世の知識と現世の王族としての立場で自由に魔術を研究する。',en:'A reincarnated prince with magical talent. Freely researches magic with knowledge from his past life and position as current royalty.'},traits:{ja:['転生','魔術','王子','自由','研究'],en:['Reincarnation','Magic','Prince','Freedom','Research']},radar:[42,88,88,52,88,82]},
  // ── 鬼太郎 ──
  {id:'kitaro_gt',icon:'👁️',name:{ja:'鬼太郎',en:'Kitaro'},series:{ja:'ゲゲゲの鬼太郎',en:'GeGeGe no Kitaro'},type:{ja:'妖怪の守護者 (INFJ)',en:'Youkai Guardian (INFJ)'},profile:{I:4,N:3,F:4,J:3},desc:{ja:'妖怪と人間の懸け橋となる半妖怪の少年。人間が妖怪に関わる問題を解決し、共存を目指す。',en:'A half-youkai boy who bridges youkai and humans. Resolves problems where humans get involved with youkai, aiming for coexistence.'},traits:{ja:['妖怪','懸け橋','共存','正義','守護'],en:['Youkai','Bridge','Coexistence','Justice','Guardian']},radar:[52,72,70,80,70,75]},
  // ── タイガー&バニー追加 ──
  {id:'barnaby2_tb',icon:'💚',name:{ja:'ファイヤーエンブレム',en:'Fire Emblem'},series:{ja:'TIGER & BUNNY',en:'Tiger & Bunny'},type:{ja:'プロのLGBTヒーロー (ENFJ)',en:'Professional LGBT Hero (ENFJ)'},profile:{E:4,N:3,F:4,J:3},desc:{ja:'NEXTのヒーローで料理が趣味の陽気なヒーロー。誰に対しても分け隔てなく、プロとしての誇りを持つ。',en:'NEXT hero whose hobby is cooking; a cheerful hero. Makes no distinctions between anyone and has pride as a professional.'},traits:{ja:['ヒーロー','料理','誰にでも優しい','誇り','プロ'],en:['Hero','Cooking','Kind to Everyone','Pride','Professional']},radar:[80,65,62,88,65,75]},
  // ── フルーツバスケット追加 ──
  {id:'shigure_fb',icon:'🐕',name:{ja:'草摩紫呉',en:'Shigure Sohma'},series:{ja:'フルーツバスケット',en:'Fruits Basket'},type:{ja:'戌の文豪策士 (ENTP)',en:'Dog Author Strategist (ENTP)'},profile:{E:3,N:4,T:4,P:4},desc:{ja:'草摩家の戌に憑かれた小説家。表向きはのんびりした文豪だが実は深い計画を持つ策士。',en:'A novelist possessed by the Dog of the Sohma family. Outwardly a laid-back author but actually a strategist with deep plans.'},traits:{ja:['文豪','策士','のんびり','犬','計画'],en:['Author','Strategist','Laid-back','Dog','Plans']},radar:[58,82,80,52,82,78]},
  // ── ローゼンメイデン ──
  {id:'shinku_rm',icon:'🌹',name:{ja:'真紅',en:'Shinku'},series:{ja:'ローゼンメイデン',en:'Rozen Maiden'},type:{ja:'高貴なる人形 (INTJ)',en:'Noble Doll (INTJ)'},profile:{I:4,T:4,N:3,J:4},desc:{ja:'ローゼンメイデンの5番目でプライドが高い人形。ジュンを媒介者に使いアリスゲームで戦う。',en:'The 5th Rozen Maiden, a proud doll. Uses Jun as a medium and fights in the Alice Game.'},traits:{ja:['人形','プライド','高貴','ティー','アリスゲーム'],en:['Doll','Pride','Noble','Tea','Alice Game']},radar:[42,80,80,48,80,85]},
  // ── YOASOBI/音楽系 ──
  {id:'subaru_ra',icon:'⭐',name:{ja:'大宮スバル',en:'Subaru Omiya'},series:{ja:'推しが武道館いってくれたら死ぬ',en:'If My Favorite Pop Idol Made It to the Budokan'},type:{ja:'ガチ恋の熱狂的ファン (ENFP)',en:'Hardcore Fan in Serious Love (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'地下アイドルえりぴよのガチ恋ファン。えりぴよのために財産を使い尽くす熱狂的なファン活動が印象的。',en:'A hardcore fan seriously in love with underground idol Eripiyo. Impressive for spending all savings on fan activities for Eripiyo.'},traits:{ja:['ガチ恋','ファン','熱狂','純粋','応援'],en:['Hardcore Fan','Fan','Enthusiastic','Pure','Support']},radar:[82,42,38,95,42,60]},
  // ── 彼女のじかん ──
  {id:'hori2_hm',icon:'✂️',name:{ja:'宮村みやこ',en:'Miyako Miyamura'},series:{ja:'ホリミヤ',en:'Horimiya'},type:{ja:'刺青の孤独 (INFP)',en:'Tattooed Solitude (INFP)'},profile:{I:4,N:3,F:4,P:3},desc:{ja:'宮村伊澄の彼女で刺青とピアスを持つ外見の少年。家族のために自分を変えた過去を持つ成長型。',en:'Hori\'s boyfriend who is a boy with tattoos and piercings. A growth type with a past of changing himself for his family.'},traits:{ja:['刺青','ピアス','成長','孤独','家族'],en:['Tattoos','Piercing','Growth','Solitude','Family']},radar:[48,68,65,72,65,72]},
  // ── チート薬師のスローライフ ──
  {id:'reiji_cs2',icon:'🌿',name:{ja:'ライリー',en:'Riley'},series:{ja:'チート薬師のスローライフ',en:'The Cheat Code Master Apothecary\'s Slow Life'},type:{ja:'のんびり薬師 (ISFP)',en:'Laid-back Apothecary (ISFP)'},profile:{I:4,S:4,F:3,P:4},desc:{ja:'異世界でスローライフを望む薬師。チートスキルを持つが戦いを好まず、のんびりした生活を愛する。',en:'An apothecary who desires a slow life in another world. Has cheat skills but dislikes fighting and loves a laid-back lifestyle.'},traits:{ja:['薬師','スローライフ','のんびり','チート','癒し'],en:['Apothecary','Slow Life','Laid-back','Cheat','Healing']},radar:[42,65,62,72,62,68]},
  // ── ゴールデンカムイ ──
  {id:'sugimoto_gk',icon:'🐻',name:{ja:'杉元佐一',en:'Saichi Sugimoto'},series:{ja:'ゴールデンカムイ',en:'Golden Kamuy'},type:{ja:'不死身の杉元 (ESTP)',en:'Immortal Sugimoto (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'日露戦争の英雄で「不死身の杉元」の異名を持つ。金塊を求めてアシリパと北海道を旅する。',en:'Hero of the Russo-Japanese War with the alias "Immortal Sugimoto." Travels Hokkaido with Asirpa seeking gold ingots.'},traits:{ja:['不死身','戦闘','金塊','北海道','友情'],en:['Immortal','Combat','Gold','Hokkaido','Friendship']},radar:[88,55,52,78,55,70]},
  {id:'asirpa_gk',icon:'🏹',name:{ja:'アシリパ',en:'Asirpa'},series:{ja:'ゴールデンカムイ',en:'Golden Kamuy'},type:{ja:'アイヌの少女ハンター (ISTP)',en:'Ainu Girl Hunter (ISTP)'},profile:{I:3,S:4,T:3,P:3},desc:{ja:'アイヌの少女で優れたハンター。杉元と共に旅しながらアイヌの文化と知識を活かして戦う。',en:'An Ainu girl and excellent hunter. Travels with Sugimoto while utilizing Ainu culture and knowledge in battles.'},traits:{ja:['アイヌ','ハンター','文化','知識','友情'],en:['Ainu','Hunter','Culture','Knowledge','Friendship']},radar:[65,75,72,72,72,75]},
  // ── スーパーナチュラル系 ──
  {id:'yato2_nr',icon:'🗡️',name:{ja:'ビシャモン',en:'Bishamon'},series:{ja:'ノラガミ',en:'Noragami'},type:{ja:'戦神の慈悲 (ENFJ)',en:'War God\'s Mercy (ENFJ)'},profile:{E:4,N:3,F:4,J:4},desc:{ja:'強力な戦いの神でヤトのかつての敵。多くの神器を抱えることで苦しみながらも仲間を守ろうとする神。',en:'A powerful war god and Yato\'s former enemy. A god who tries to protect comrades while suffering from harboring many Sacred Weapons.'},traits:{ja:['戦神','慈悲','神器','葛藤','守護'],en:['War God','Mercy','Sacred Weapons','Conflict','Protection']},radar:[78,72,70,80,70,78]},
  // ── はたらく細胞 ──
  {id:'red_blood_hataraku',icon:'🔴',name:{ja:'赤血球',en:'Red Blood Cell'},series:{ja:'はたらく細胞',en:'Cells at Work!'},type:{ja:'迷子になる献血細胞 (ESFP)',en:'Lost Errand Blood Cell (ESFP)'},profile:{E:4,S:4,F:4,P:3},desc:{ja:'酸素を運ぶ赤血球の女の子。いつも迷子になるがドジながらも使命感を持って体を守ろうとする。',en:'A red blood cell girl who carries oxygen. Always gets lost but is a klutz with a sense of mission trying to protect the body.'},traits:{ja:['赤血球','迷子','使命','成長','酸素'],en:['Red Blood Cell','Lost','Mission','Growth','Oxygen']},radar:[72,42,38,88,42,62]},
  {id:'white_blood_hataraku',icon:'⚪',name:{ja:'白血球',en:'White Blood Cell'},series:{ja:'はたらく細胞',en:'Cells at Work!'},type:{ja:'細菌を倒す戦士 (ISTJ)',en:'Warrior Defeating Bacteria (ISTJ)'},profile:{I:3,S:4,T:4,J:4},desc:{ja:'細菌やウイルスを倒す白血球の男の子。クールで無表情だが赤血球への思いやりを持つ。',en:'A white blood cell boy who defeats bacteria and viruses. Cool and expressionless but has consideration for the red blood cell.'},traits:{ja:['白血球','戦士','細菌撃破','クール','守護'],en:['White Blood Cell','Warrior','Bacteria Defeat','Cool','Protection']},radar:[65,72,70,60,70,78]},
  // ── クズの本懐 ──
  {id:'hanabi_kuzunohonkai',icon:'💔',name:{ja:'花火',en:'Hanabi'},series:{ja:'クズの本懐',en:'Scum\'s Wish'},type:{ja:'片思いの葛藤 (INFP)',en:'Unrequited Love Conflict (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'好きになれない人を好きだと思い込む少女。複雑な恋愛関係の中で自分の本当の気持ちを探す。',en:'A girl who convinces herself she loves someone she can\'t truly love. Searches for her true feelings in a complex romantic relationship.'},traits:{ja:['片思い','葛藤','成長','複雑','恋愛'],en:['Unrequited Love','Conflict','Growth','Complex','Romance']},radar:[42,68,65,68,65,68]},
  // ── フリクリ ──
  {id:'naota_flcl',icon:'🎸',name:{ja:'立花直太',en:'Naota Nandaba'},series:{ja:'フリクリ',en:'FLCL'},type:{ja:'大人への入り口 (INFP)',en:'Gateway to Adulthood (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'日常に退屈していた少年がハルコとの出会いで非日常に放り込まれる。大人への成長を描く物語の主人公。',en:'A boy bored with everyday life thrown into extraordinary by meeting Haruko. Protagonist of a story depicting growth into adulthood.'},traits:{ja:['成長','退屈','大人','非日常','感情'],en:['Growth','Boredom','Adulthood','Extraordinary','Emotion']},radar:[45,62,60,65,62,65]},
  // ── 甘城ブリリアントパーク ──
  {id:'seiya_akjc',icon:'👑',name:{ja:'可児江西也',en:'Seiya Kanie'},series:{ja:'甘城ブリリアントパーク',en:'Amagi Brilliant Park'},type:{ja:'元天才子役の支配人 (ENTJ)',en:'Former Child Actor Manager (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'かつての天才子役で遊園地支配人になる。プライドが高く効率主義だが仲間への思いやりも育つ。',en:'Former child actor who becomes an amusement park manager. Has high pride and is efficiency-oriented, but also grows in consideration for others.'},traits:{ja:['元子役','支配人','効率','プライド','成長'],en:['Former Child Actor','Manager','Efficiency','Pride','Growth']},radar:[65,80,78,65,80,80]},
  // ── 最終的な締め ──
  {id:'madoka2_mgk',icon:'🌟',name:{ja:'暁美ほむら（悪魔）',en:'Homura Akemi (Demon)'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'愛が悪魔を生む (INTJ)',en:'Love Births a Demon (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'まどかへの愛が究極の形になった存在。ほむらが「悪魔」となりまどかの記憶を書き換えた姿。',en:'An existence where love for Madoka took its ultimate form. The form Homura took becoming a "demon" and rewriting Madoka\'s memories.'},traits:{ja:['愛','悪魔','変容','まどか','孤独'],en:['Love','Demon','Transformation','Madoka','Solitude']},radar:[38,92,90,38,92,88]},
  // ── 彼女が好きなものはホモであって僕ではない ──
  {id:'motoharu_kks',icon:'📱',name:{ja:'三浦誠一郎',en:'Seiichirou Miura'},series:{ja:'彼女が好きなものは',en:'What She Likes is BL'},type:{ja:'BLオタクの親友 (ENFP)',en:'BL Otaku\'s Best Friend (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'BL好きの彼女の親友となる少年。自分の気持ちと社会の期待の間で揺れながら成長する物語。',en:'A boy who becomes best friend of a girlfriend who likes BL. A story of growing while wavering between his feelings and society\'s expectations.'},traits:{ja:['BL','友情','成長','受け入れ','自己'],en:['BL','Friendship','Growth','Acceptance','Self']},radar:[72,58,55,78,58,68]},
  // ── 終わりのセラフ追加 ──
  {id:'mikaela_seraph',icon:'🧛',name:{ja:'百夜ミカエラ',en:'Mikaela Hyakuya'},series:{ja:'終わりのセラフ',en:'Seraph of the End'},type:{ja:'愛が吸血鬼を変える (ISFP)',en:'Love Changes Vampire (ISFP)'},profile:{I:4,S:3,F:4,P:3},desc:{ja:'吸血鬼に変えられたユウイチロウの幼なじみ。吸血鬼としての本能と人間への愛の間で苦しむ複雑な存在。',en:'Yuichiro\'s childhood friend transformed into a vampire. A complex existence suffering between vampire instincts and love for humans.'},traits:{ja:['吸血鬼','幼なじみ','愛','葛藤','変化'],en:['Vampire','Childhood Friend','Love','Conflict','Change']},radar:[48,68,65,75,65,70]},
  // ── のらがみ追加 ──
  {id:'yukine_nr',icon:'⚡',name:{ja:'雪音',en:'Yukine'},series:{ja:'ノラガミ',en:'Noragami'},type:{ja:'神器の少年 (INFP)',en:'Sacred Treasure Boy (INFP)'},profile:{I:3,N:3,F:4,P:3},desc:{ja:'ヤトの神器となった少年の幽霊。人間への嫉妬と神器としての使命の間で成長していく。',en:'The ghost of a boy who became Yato\'s Sacred Treasure. Grows between jealousy toward humans and the mission as a Sacred Treasure.'},traits:{ja:['神器','幽霊','成長','嫉妬','友情'],en:['Sacred Treasure','Ghost','Growth','Jealousy','Friendship']},radar:[48,65,62,70,62,68]},
  // ── U-NEXT 2025〜2026 調査追加キャラ ──
  // 薬屋のひとりごと
  {
    id:'jinshi_apothecary', icon:'🌙',
    name:  {ja:'壬氏',                    en:'Jinshi'},
    series:{ja:'薬屋のひとりごと',         en:'The Apothecary Diaries'},
    type:  {ja:'謎多き美男 (ENTJ)',        en:'Mysterious Beauty (ENTJ)'},
    profile:{E:3,T:4,N:4,J:4},
    desc:{
      ja:'宦官を装う美貌の人物。猫猫に目をかけ裏の顔を持つ。高い観察力と戦略的思考で後宮を支配する。U-NEXT2025年アニメランキング1位作品のキーパーソン。',
      en:'A beautiful figure disguised as a eunuch. Takes a special interest in Maomao while hiding their true identity. Controls the inner palace with keen observation and strategic thinking.',
    },
    traits:{ja:['謎めいた','美形','戦略的','権力','猫猫思い'],en:['Mysterious','Beautiful','Strategic','Powerful','Cares for Maomao']},
    radar:[88,52,48,92,88,65],
  },
  // 葬送のフリーレン
  {
    id:'fern_frieren', icon:'🌸',
    name:  {ja:'フェルン',                en:'Fern'},
    series:{ja:'葬送のフリーレン',         en:"Frieren: Beyond Journey's End"},
    type:  {ja:'優秀な弟子魔法使い (ISTJ)',en:'Gifted Apprentice Mage (ISTJ)'},
    profile:{I:3,S:4,T:4,J:4},
    desc:{
      ja:'フリーレンの弟子で優秀な魔法使い。感情表現は少ないが実力は師匠に迫るほど。真面目で努力家、規律を重んじる完璧主義者。スタルクへの態度が実はツンデレ。',
      en:"Frieren's apprentice and gifted mage. Rarely expresses emotions but her skill approaches her master\'s. Serious, hardworking perfectionist who values discipline. Her attitude toward Stark is secretly tsundere.",
    },
    traits:{ja:['努力家','クール','優秀','規律','ツンデレ'],en:['Hardworking','Cool','Gifted','Disciplined','Tsundere']},
    radar:[75,45,42,90,88,65],
  },
  {
    id:'himmel_frieren', icon:'⚔️',
    name:  {ja:'ヒンメル',               en:'Himmel'},
    series:{ja:'葬送のフリーレン',        en:"Frieren: Beyond Journey's End"},
    type:  {ja:'皆に愛された英雄 (ENFJ)', en:'Hero Beloved by All (ENFJ)'},
    profile:{E:4,F:4,N:3,J:3},
    desc:{
      ja:'魔王を倒した勇者。自分を主人公だと信じて疑わない眩しいほどのポジティブさで仲間を鼓舞する英雄。フリーレンに「人間を知ること」の大切さを教えた存在。',
      en:'The hero who defeated the Demon King. An extraordinarily positive hero who inspires companions with unwavering belief in himself. Taught Frieren the importance of understanding humans.',
    },
    traits:{ja:['英雄','ポジティブ','カリスマ','仲間思い','自己肯定感'],en:['Hero','Positive','Charismatic','Loyal','High Self-Esteem']},
    radar:[80,90,92,65,55,88],
  },
  // SAKAMOTO DAYS
  {
    id:'sakamoto_sd', icon:'🛒',
    name:  {ja:'坂本竜一',                en:'Taro Sakamoto'},
    series:{ja:'SAKAMOTO DAYS',           en:'Sakamoto Days'},
    type:  {ja:'最強を捨てた父 (ISFP)',   en:'Father Who Gave Up Supremacy (ISFP)'},
    profile:{I:3,S:4,F:4,P:3},
    desc:{
      ja:'かつて史上最強の殺し屋だったが、愛する妻との出会いで引退。今は太った駄菓子屋の店主として家族を守る。戦闘能力は衰えていないが、常に平和を選ぶ優しい父。U-NEXT2025年2位作品の主人公。',
      en:'Once the greatest assassin in history but retired after meeting the woman he loved. Now a chubby convenience store owner protecting his family. Fighting ability unchanged, but always chooses peace.',
    },
    traits:{ja:['元最強','父','家族愛','平和主義','駄菓子屋'],en:['Former Best','Father','Family Love','Pacifist','Store Owner']},
    radar:[92,80,78,60,45,85],
  },
  // ダンダダン
  {
    id:'okarun_dd', icon:'👽',
    name:  {ja:'高倉健（オカルン）',       en:'Ken Takakura (Okarun)'},
    series:{ja:'ダンダダン',               en:'Dandadan'},
    type:  {ja:'オカルト好き少年 (INFP)',  en:'Occult-Loving Boy (INFP)'},
    profile:{I:3,N:4,F:4,P:3},
    desc:{
      ja:'霊よりUFOや宇宙人を信じる少年。モモとの掛け合いでオカルトな冒険に巻き込まれる。最初は臆病だが、大切な人を守るため覚醒する純情な少年。',
      en:'A boy who believes in UFOs and aliens rather than spirits. Gets dragged into occult adventures with Momo. Initially timid but awakens to protect those he cares about.',
    },
    traits:{ja:['オカルト','宇宙人','成長','純情','覚醒'],en:['Occult','Aliens','Growth','Pure','Awakening']},
    radar:[55,72,68,78,62,60],
  },
  {
    id:'momo_dd', icon:'🔮',
    name:  {ja:'綾瀬桃（モモ）',          en:'Momo Ayase'},
    series:{ja:'ダンダダン',               en:'Dandadan'},
    type:  {ja:'霊感少女の情熱 (ENFP)',   en:'Spirited Psychic Girl (ENFP)'},
    profile:{E:4,N:4,F:4,P:3},
    desc:{
      ja:'霊が見える体質の少女。宇宙人を信じないが、オカルンとの出会いで次々と霊的事件に巻き込まれる。感情豊かでエネルギッシュ、仲間への愛情が行動力の源。',
      en:"A girl who can see spirits. Doesn't believe in aliens but gets involved in supernatural incidents after meeting Okarun. Emotionally rich and energetic, with love for friends as her driving force.",
    },
    traits:{ja:['霊感','情熱的','エネルギッシュ','仲間思い','直感'],en:['Psychic','Passionate','Energetic','Loyal','Intuitive']},
    radar:[70,85,88,58,52,82],
  },
  // 呪術廻戦
  {
    id:'nanami_jjk', icon:'💼',
    name:  {ja:'七海建人',                en:'Kento Nanami'},
    series:{ja:'呪術廻戦',                en:'Jujutsu Kaisen'},
    type:  {ja:'プロの術師 (ISTJ)',        en:'Professional Sorcerer (ISTJ)'},
    profile:{I:4,T:4,S:3,J:4},
    desc:{
      ja:'時間外労働を断固拒否するプロフェッショナルな術師。感情を表に出さず効率重視で動くが、仲間への思いやりは誰より深い。「残業は嫌いです」の名言で知られる。',
      en:'A professional sorcerer who firmly refuses overtime work. Operates efficiently without showing emotions, but cares for colleagues more than anyone. Famous for "I dislike overtime."',
    },
    traits:{ja:['プロ意識','効率','残業拒否','信頼','冷静'],en:['Professional','Efficient','Anti-Overtime','Trustworthy','Calm']},
    radar:[85,40,38,95,92,50],
  },
  // 東京リベンジャーズ
  {
    id:'mikey_tr', icon:'🏍️',
    name:  {ja:'佐野万次郎（マイキー）',   en:'Manjiro Sano (Mikey)'},
    series:{ja:'東京卍リベンジャーズ',     en:'Tokyo Revengers'},
    type:  {ja:'最強総長のカリスマ (ESTP)',en:'Supreme Leader Charisma (ESTP)'},
    profile:{E:4,S:4,T:3,P:4},
    desc:{
      ja:'東京卍會の総長で「無敵のマイキー」の異名を持つ。生まれ持ったカリスマで誰もが従う存在だが、大切な人を失うたびに心が壊れていく悲しい側面も。',
      en:'Leader of Tokyo Manji Gang with the title "Invincible Mikey." Born charisma that everyone follows, but has a tragic side where his heart breaks each time he loses someone precious.',
    },
    traits:{ja:['カリスマ','総長','無敵','孤独','破壊衝動'],en:['Charismatic','Leader','Invincible','Lonely','Destructive Impulse']},
    radar:[90,55,52,88,45,78],
  },
  // アオのハコ
  {
    id:'taiki_aonobox', icon:'🏸',
    name:  {ja:'大喜多海',                en:'Taiki Inomata'},
    series:{ja:'アオのハコ',               en:'Blue Box'},
    type:  {ja:'バドミントン少年の一途 (INFJ)',en:'Devoted Badminton Boy (INFJ)'},
    profile:{I:3,N:3,F:4,J:3},
    desc:{
      ja:'バスケ部の同居相手に密かに恋するバドミントン部員。努力型で芯が強く、一度決めたことは諦めない。恋愛でも競技でも誠実に向き合う青春真っ只中の少年。',
      en:'A badminton club member secretly in love with his basketball-playing housemate. Hardworking with strong resolve who never gives up once decided. Honest in both love and sports.',
    },
    traits:{ja:['一途','努力','誠実','バドミントン','青春'],en:['Devoted','Hardworking','Sincere','Badminton','Youth']},
    radar:[65,80,78,68,58,82],
  },
  // 逃げ上手の若君
  {
    id:'tokiyuki_ys', icon:'🏃',
    name:  {ja:'北条時行',                en:'Tokiyuki Hojo'},
    series:{ja:'逃げ上手の若君',           en:'The Elusive Samurai'},
    type:  {ja:'逃げることの天才 (INFP)', en:'Genius of Escape (INFP)'},
    profile:{I:4,N:4,F:3,P:4},
    desc:{
      ja:'鎌倉幕府を滅ぼされた北条家の遺児。戦うより逃げることが得意な異色の主人公。しかし逃げる天才的センスで仲間を守り、最終的には逃げながら戦略を立て敵を翻弄する。',
      en:"Orphan of the Hojo clan whose Kamakura shogunate was destroyed. An unusual protagonist better at fleeing than fighting. But uses genius escape sense to protect allies and outmaneuver enemies.",
    },
    traits:{ja:['逃走','天才','生存本能','仲間守り','鎌倉'],en:['Escape','Genius','Survival Instinct','Protector','Kamakura']},
    radar:[42,75,72,82,55,68],
  },
  // 俺だけレベルアップな件
  {
    id:'jinwoo_sl', icon:'🗡️',
    name:  {ja:'成田凌士（ソン・ジヌウ）', en:'Sung Jin-Woo'},
    series:{ja:'俺だけレベルアップな件',   en:'Solo Leveling'},
    type:  {ja:'最弱から最強への成長 (INTJ)',en:'Weakest to Strongest Growth (INTJ)'},
    profile:{I:4,T:4,N:3,J:4},
    desc:{
      ja:'かつてE級の最弱ハンター。謎のシステムを得てただ一人だけレベルアップできる存在になる。無口で冷静だが家族への愛情は深く、強さへの渇望を秘める。',
      en:'Once an E-rank weakest hunter. Gains a mysterious system and becomes the only one who can level up. Quiet and calm but deeply loves family, harboring a hidden thirst for strength.',
    },
    traits:{ja:['最強','成長','ソロ','無口','家族愛'],en:['Strongest','Growth','Solo','Quiet','Family Love']},
    radar:[95,48,45,92,85,55],
  },
  // ブルーロック 追加
  {
    id:'nagi_bl', icon:'😴',
    name:  {ja:'凪誠士郎',                en:'Seishiro Nagi'},
    series:{ja:'ブルーロック',             en:'Blue Lock'},
    type:  {ja:'天才の怠惰 (INTP)',        en:'Genius Laziness (INTP)'},
    profile:{I:4,T:4,N:4,P:4},
    desc:{
      ja:'サッカーを始めてたった1年でブルーロックに選ばれた天才。天与の身体能力で労力を最小化することに全力を注ぐ。唯一無二のトラップ技術を持つが面倒くさがり屋。',
      en:'A genius selected for Blue Lock just one year after starting soccer. Puts full effort into minimizing effort with natural physical ability. Has unique trapping skills but is extremely lazy.',
    },
    traits:{ja:['天才','怠惰','トラップ','最小労力','覚醒'],en:['Genius','Lazy','Trapping','Minimum Effort','Awakening']},
    radar:[88,42,38,90,82,45],
  },
  // チ。-地球の運動について-
  {
    id:'rafal_chi', icon:'📖',
    name:  {ja:'ラファウ',                en:'Rafal'},
    series:{ja:'チ。-地球の運動について-', en:'Chi: About the Movement of Earth'},
    type:  {ja:'真理に賭けた天才 (INTP)', en:'Genius Who Bet on Truth (INTP)'},
    profile:{I:4,T:4,N:4,P:3},
    desc:{
      ja:'15世紀ポーランドの天才学生。異端とされた地動説の真実を命がけで追い求める。知的探求のためなら命すら惜しまない「Cの真理」への執着が圧倒的。',
      en:"A genius student in 15th-century Poland who risks his life pursuing the truth of heliocentrism, deemed heresy. Overwhelmingly obsessed with the 'Truth of C' to the point of sacrificing his life for intellectual pursuit.",
    },
    traits:{ja:['知的','探求','命がけ','地動説','覚悟'],en:['Intellectual','Pursuit','Life-Risking','Heliocentrism','Resolve']},
    radar:[42,88,90,38,90,55],
  },
  // 正反対な君と僕
  {
    id:'hino_muki', icon:'☀️',
    name:  {ja:'日野陽菜',                en:'Hina Hino'},
    series:{ja:'正反対な君と僕',           en:'You and I Are Polar Opposites'},
    type:  {ja:'太陽のような明るさ (ESFP)',en:'Sunshine Brightness (ESFP)'},
    profile:{E:4,S:3,F:4,P:4},
    desc:{
      ja:'クラス一の人気者で誰にでも明るく接する少女。内気な山田くんに積極的に話しかけ、正反対同士の恋愛を引っ張る太陽のような存在。素直さと行動力が魅力。',
      en:"The most popular girl in class who is bright with everyone. Actively talks to shy Yamada-kun, leading a relationship between polar opposites. Charm lies in her honesty and initiative.",
    },
    traits:{ja:['明るい','人気者','積極的','素直','太陽'],en:['Bright','Popular','Proactive','Honest','Sunshine']},
    radar:[78,88,90,55,45,92],
  },
  // はたらく細胞追加（Black）
  {
    id:'white_blood_black', icon:'🩸',
    name:  {ja:'白血球（はたらく細胞BLACK）',en:'White Blood Cell (Cells at Work! BLACK)'},
    series:{ja:'はたらく細胞BLACK',        en:'Cells at Work! BLACK'},
    type:  {ja:'過酷な環境の戦士 (ISTP)', en:'Warrior in Harsh Environment (ISTP)'},
    profile:{I:3,S:4,T:4,P:3},
    desc:{ja:'不健康な身体で働くNK細胞や白血球たち。通常版より過酷な環境でも諦めない職業人魂を持つ戦士。',en:'White blood cells working in an unhealthy body. Warriors with professional spirit who never give up even in harsher environments than normal.'},
    traits:{ja:['戦士','職人','過酷','不屈','細胞'],en:['Warrior','Professional','Harsh','Indomitable','Cell']},
    radar:[78,45,42,88,85,50],
  },

  {id:'nami_op',icon:'🍊',name:{ja:'ナミ',en:'Nami'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'航海士の切れ者 (ESTJ)',en:'Clever Navigator (ESTJ)'},profile:{E:3,T:4,S:3,J:4},desc:{ja:'航海術に長けた麦わらの仲間。お金と村への愛情が行動の原動力。怒ると怖いが仲間思いで頼りになる切れ者。',en:'Skilled navigator of the Straw Hats. Money and love for her village drive her. Scary when angry but reliable and caring for crewmates.'},traits:{ja:['航海士','切れ者','金好き','仲間思い','勇気'],en:['Navigator','Clever','Money-Lover','Loyal','Courageous']},radar:[65,72,78,85,82,50]},
  {id:'sanji_op',icon:'🍽️',name:{ja:'ヴィンスモーク・サンジ',en:'Vinsmoke Sanji'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'愛に生きるコック (ENFP)',en:'Cook Living for Love (ENFP)'},profile:{E:4,F:4,N:3,P:3},desc:{ja:'女性への愛と料理への情熱に生きるコック。蹴り技の達人で戦闘力は一流。ダメなとこもあるがいざとなれば仲間のために全力を尽くす。',en:'A cook living for love of women and passion for cooking. Master of kick techniques with top-tier combat. Has flaws but gives everything for crewmates when it counts.'},traits:{ja:['コック','情熱','女好き','義理','戦闘力'],en:['Cook','Passionate','Lady-Lover','Loyalty','Fighter']},radar:[80,75,82,60,78,55]},
  {id:'chopper_op',icon:'🦌',name:{ja:'トニートニー・チョッパー',en:'Tony Tony Chopper'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'天真爛漫な船医 (ENFP)',en:'Pure-Hearted Doctor (ENFP)'},profile:{E:3,F:4,N:2,P:4},desc:{ja:'ヒトヒトの実で人間の言葉を話せるトナカイ。船医として仲間の命を守る。素直で純粋、ほめられると調子に乗るのが愛らしい。',en:'A reindeer who ate the Human-Human Fruit and can speak human language. Protects crewmates as ship doctor. Straightforward and pure, adorably gets carried away when praised.'},traits:{ja:['純粋','船医','トナカイ','可愛い','勇気'],en:['Pure','Doctor','Reindeer','Cute','Brave']},radar:[55,85,72,70,88,95]},
  {id:'robin_op',icon:'📚',name:{ja:'ニコ・ロビン',en:'Nico Robin'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'静かな歴史家 (INTJ)',en:'Quiet Historian (INTJ)'},profile:{I:4,T:4,N:3,J:3},desc:{ja:'歴史の本文（ポーネグリフ）を読める考古学者。静かで冷静、黒い笑いが怖いが仲間を深く愛する。生きたいと叫んだシーンは屈指の名場面。',en:'An archaeologist who can read the Poneglyphs. Quiet and calm with a dark humor, but deeply loves her crew. Her cry of wanting to live is one of the series finest scenes.'},traits:{ja:['考古学者','冷静','知的','仲間愛','強さ'],en:['Archaeologist','Calm','Intellectual','Love for Crew','Strength']},radar:[70,78,45,90,80,60]},
  {id:'ace_op',icon:'🔥',name:{ja:'ポートガス・D・エース',en:'Portgas D. Ace'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'炎の兄 (ESFP)',en:'Flame Brother (ESFP)'},profile:{E:4,F:4,S:3,P:4},desc:{ja:'メラメラの実の能力者でルフィの兄。炎を自在に操る。仲間と弟を守るために命を懸ける義侠心の塊。白ひげを慕う姿が感動的。',en:'A Flame-Flame Fruit user and older brother of Luffy. Controls fire at will. A man of chivalry who risks his life to protect friends and his brother. His devotion to Whitebeard is moving.'},traits:{ja:['炎','兄','義侠心','白ひげ','カリスマ'],en:['Flame','Brother','Chivalry','Whitebeard','Charisma']},radar:[88,78,85,55,82,75]},
  {id:'shanks_op',icon:'⚔️',name:{ja:'赤髪のシャンクス',en:'Red-Haired Shanks'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'最強の海賊皇帝 (ENTJ)',en:'Greatest Emperor of the Sea (ENTJ)'},profile:{E:4,T:4,N:4,J:3},desc:{ja:'四皇の一人でルフィに麦わら帽子を渡した男。圧倒的な覇気と存在感で戦争を止めた実力者。飄々としているが決断は迅速かつ確実。',en:'One of the Four Emperors who gave Luffy his straw hat. Stopped a war with overwhelming Haki and presence. Easygoing but decisions are swift and certain.'},traits:{ja:['四皇','覇気','カリスマ','英雄','義理'],en:['Emperor','Haki','Charismatic','Heroic','Loyal']},radar:[95,65,78,82,88,60]},
  {id:'hancock_op',icon:'🐍',name:{ja:'ボア・ハンコック',en:'Boa Hancock'},series:{ja:'ワンピース',en:'One Piece'},type:{ja:'天下一美女の女帝 (ENTJ)',en:'Greatest Beauty Empress (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'アマゾン・リリーの女帝で九蛇の支配者。絶世の美女でルフィに一途な恋をする一面も。高慢だが仲間と愛する人には全てを捧げる。',en:'Empress of Amazon Lily and ruler of Kuja. Absolute beauty who falls single-mindedly in love with Luffy. Arrogant but gives everything for her people and the one she loves.'},traits:{ja:['女帝','美女','プライド','ルフィ愛','強さ'],en:['Empress','Beauty','Pride','Love for Luffy','Strength']},radar:[78,60,55,75,85,48]},
  {id:'inosuke_kny',icon:'🐗',name:{ja:'嘴平伊之助',en:'Inosuke Hashibira'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'猪突猛進野生児 (ESTP)',en:'Wild Child Charging Ahead (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'猪の頭をかぶった野生育ちの剣士。考えるより先に体が動く本能型。プライドが高いが炭治郎たちと共に成長していく。',en:'A sword-wielder raised in the wild wearing a boar head. Body moves before thinking, pure instinct type. High pride but grows alongside Tanjiro and the others.'},traits:{ja:['野生','本能','猪突','プライド','成長'],en:['Wild','Instinct','Charging','Pride','Growth']},radar:[88,40,55,35,60,78]},
  {id:'uzui_kny',icon:'💎',name:{ja:'宇髄天元',en:'Tengen Uzui'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'派手な音柱 (ESTP)',en:'Flamboyant Sound Hashira (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'音の呼吸を使う派手好きな元忍の柱。「派手に行くぜ！」が口癖。妻3人への愛情と仲間への義理堅さが魅力。',en:'A Pillar who uses Sound Breathing, a flashy former ninja. Let\'s do this flashy! is his catchphrase. Charm lies in love for his three wives and loyalty to crewmates.'},traits:{ja:['派手','音柱','忍者','義理','愛妻家'],en:['Flamboyant','Sound Pillar','Ninja','Loyal','Devoted Husband']},radar:[82,60,85,55,75,65]},
  {id:'muichiro_kny',icon:'💨',name:{ja:'時透無一郎',en:'Muichiro Tokito'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'天才霞柱 (ISTP)',en:'Genius Mist Hashira (ISTP)'},profile:{I:4,S:3,T:4,P:3},desc:{ja:'霞の呼吸の使い手で最年少の柱。記憶を失い感情が薄かったが、仲間との交流で心を取り戻す。天才的な剣の才能を持つ。',en:'Mist Breathing user and youngest Pillar. Lost memories and had thin emotions but regains heart through bonds with allies. Has genius sword talent.'},traits:{ja:['天才','最年少','霞','記憶','感情'],en:['Genius','Youngest','Mist','Memory','Emotions']},radar:[85,45,35,70,75,58]},
  {id:'sanemi_kny',icon:'⚡',name:{ja:'不死川実弥',en:'Sanemi Shinazugawa'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'傷だらけの風柱 (ISTP)',en:'Scarred Wind Pillar (ISTP)'},profile:{I:3,T:4,S:4,J:4},desc:{ja:'風の呼吸の使い手。鬼への憎悪は人一倍強く粗野に見えるが、弟を思う涙が本当の姿。体中の傷は全て仲間を守った証。',en:'Wind Breathing user. Hatred for demons is stronger than anyone\'s and appears rough, but tears for his brother show his true self. Every scar on his body proves protecting others.'},traits:{ja:['粗野','強さ','鬼憎悪','弟愛','傷'],en:['Rough','Strong','Demon Hatred','Brother Love','Scars']},radar:[90,48,40,65,85,42]},
  {id:'tomioka_kny',icon:'🌊',name:{ja:'冨岡義勇',en:'Giyu Tomioka'},series:{ja:'鬼滅の刃',en:'Demon Slayer'},type:{ja:'無口な水柱 (ISTJ)',en:'Silent Water Pillar (ISTJ)'},profile:{I:4,T:4,S:3,J:4},desc:{ja:'水の呼吸の使い手で口数が少ない。禰豆子を庇い炭治郎の可能性を見抜いた人物。感情を表に出さないが誰より深く人を思っている。',en:'Water Breathing user of few words. Protected Nezuko and saw Tanjiro\'s potential. Doesn\'t show emotions but thinks about people more deeply than anyone.'},traits:{ja:['無口','水柱','誠実','見極め','孤高'],en:['Silent','Water Pillar','Sincere','Discerning','Solitary']},radar:[88,52,28,72,90,55]},
  {id:'nobara_jjk',icon:'🔨',name:{ja:'釘崎野薔薇',en:'Nobara Kugisaki'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'自分スタイルの術師 (ESTP)',en:'My-Style Sorcerer (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'釘と藁人形を使う術師。自分のスタイルを曲げない強い信念と、都会への憧れを持つ田舎育ちの少女。強くてかっこよく可愛い。',en:'A sorcerer who uses nails and straw dolls. Has strong conviction in her style and rural upbringing with longing for the city. Strong, cool, and cute all at once.'},traits:{ja:['自分スタイル','田舎','強さ','オシャレ','根性'],en:['My-Style','Rural','Strong','Fashionable','Grit']},radar:[80,60,72,55,78,65]},
  {id:'yuta_jjk',icon:'💍',name:{ja:'乙骨憂太',en:'Yuta Okkotsu'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'最強の特級術師 (INFJ)',en:'Strongest Special Grade (INFJ)'},profile:{I:4,N:4,F:4,J:3},desc:{ja:'リカへの愛と罪悪感を抱える特級術師。内向的で自信がなかったが、五条の指導のもと最強の術師に成長する。愛の力が呪力の源。',en:'A special grade sorcerer carrying love and guilt for Rika. Introverted and lacking confidence but grows into the strongest sorcerer under Gojo\'s guidance. Love is the source of cursed energy.'},traits:{ja:['特級','愛','成長','罪悪感','最強'],en:['Special Grade','Love','Growth','Guilt','Strongest']},radar:[88,88,45,78,80,80]},
  {id:'geto_jjk',icon:'🌀',name:{ja:'夏油傑',en:'Suguru Geto'},series:{ja:'呪術廻戦',en:'Jujutsu Kaisen'},type:{ja:'理想を貫く反逆者 (INTJ)',en:'Idealist Rebel (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'かつて五条の親友だった術師。非術師への絶望から理想の世界を作ろうとする。強い信念と知性を持つが、道を踏み外した悲劇の人物。',en:'Once Gojo\'s best friend. Becomes disillusioned with non-sorcerers and tries to create an ideal world. Has strong conviction and intelligence but a tragic figure who strayed from his path.'},traits:{ja:['元親友','理想','反逆','知性','悲劇'],en:['Former Best Friend','Idealism','Rebellion','Intelligence','Tragedy']},radar:[75,42,55,88,82,38]},
  {id:'uraraka_mha',icon:'🌸',name:{ja:'麗日お茶子',en:'Ochaco Uraraka'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'丸くて強い笑顔 (ESFJ)',en:'Round Strong Smile (ESFJ)'},profile:{E:4,F:4,S:3,J:3},desc:{ja:'浮かせるクセの能力者。家族を楽にしたいという夢のために戦う。明るく誰とでも仲良くなれるが、戦闘では思い切りの良さを見せる。',en:'Zero Gravity Quirk user. Fights with the dream of making life easier for her family. Bright and befriends anyone but shows decisiveness in combat.'},traits:{ja:['笑顔','家族愛','明るい','成長','友情'],en:['Smile','Family Love','Bright','Growth','Friendship']},radar:[65,88,88,55,72,90]},
  {id:'todoroki_mha',icon:'❄️',name:{ja:'轟焦凍',en:'Shoto Todoroki'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'氷炎の葛藤 (INFJ)',en:'Ice-Flame Conflict (INFJ)'},profile:{I:4,N:3,F:3,J:4},desc:{ja:'氷と炎を操る個性を持つ轟の息子。父への反発から左半身の炎を封印していたが、デクとの戦いで本当の自分を取り戻す。',en:'Son of Endeavor with a Quirk to control both ice and fire. Sealed his left fire side in defiance of his father, but regains his true self through battle with Deku.'},traits:{ja:['氷炎','葛藤','克服','父との確執','成長'],en:['Ice-Flame','Conflict','Overcoming','Father Issues','Growth']},radar:[90,55,38,72,78,55]},
  {id:'allmight_mha',icon:'💪',name:{ja:'オールマイト',en:'All Might'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'平和の象徴 (ENFJ)',en:'Symbol of Peace (ENFJ)'},profile:{E:4,F:4,N:3,J:4},desc:{ja:'平和の象徴でNo.1ヒーロー。デクにワン・フォー・オールを継承した師匠。常に笑顔で人々に希望を与え続ける存在。真のヒーロー。',en:'Symbol of Peace and No.1 Hero. The mentor who passed One For All to Deku. Always smiling and continuing to give people hope. A true hero.'},traits:{ja:['平和の象徴','希望','笑顔','師匠','No.1'],en:['Symbol of Peace','Hope','Smile','Mentor','No.1']},radar:[98,85,95,65,95,85]},
  {id:'aizawa_mha',icon:'😴',name:{ja:'相澤消太（イレイザーヘッド）',en:'Shota Aizawa (Eraserhead)'},series:{ja:'僕のヒーローアカデミア',en:'My Hero Academia'},type:{ja:'プロの教師 (ISTJ)',en:'Professional Teacher (ISTJ)'},profile:{I:4,T:4,S:3,J:4},desc:{ja:'個性を消すイレイザーヘッド。眠そうに見えるが学生への愛情が深いプロ教師。問題ある生徒も見捨てず引き上げる。',en:'Eraserhead who can erase Quirks. Appears sleepy but deeply loves his students as a professional teacher. Never abandons problematic students but lifts them up.'},traits:{ja:['プロ','教師','個性消去','厳格','愛情'],en:['Professional','Teacher','Quirk Erasure','Strict','Caring']},radar:[80,65,35,82,92,48]},
  {id:'armin_aot',icon:'📕',name:{ja:'アルミン・アルレルト',en:'Armin Arlert'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'知略の天才 (INTP)',en:'Tactical Genius (INTP)'},profile:{I:3,T:4,N:4,P:3},desc:{ja:'体力はないが類稀な知性と戦略眼を持つ。仲間の命を守るために自らが「悪魔」になる決断ができる。夢を諦めない姿勢が心を打つ。',en:'Lacks physical strength but has extraordinary intellect and tactical vision. Can make the decision to become a devil to protect his friends\' lives. Never giving up on his dream is moving.'},traits:{ja:['知性','戦略','夢','勇気','友情'],en:['Intelligence','Strategy','Dream','Courage','Friendship']},radar:[45,78,55,95,72,78]},
  {id:'hange_aot',icon:'🔬',name:{ja:'ハンジ・ゾエ',en:'Hange Zoe'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'巨人研究の熱狂者 (ENTP)',en:'Titan Research Enthusiast (ENTP)'},profile:{E:4,N:4,T:3,P:4},desc:{ja:'巨人への熱狂的な研究心を持つ調査兵団の指揮官。変わり者に見えるが、深い知性と仲間への愛情を持つ優れたリーダー。',en:'Commander of the Survey Corps with passionate dedication to Titan research. Appears eccentric but is an excellent leader with deep intellect and love for comrades.'},traits:{ja:['研究','情熱','奇人','知性','リーダー'],en:['Research','Passion','Eccentric','Intelligence','Leader']},radar:[72,72,78,88,75,65]},
  {id:'sasha_aot',icon:'🥩',name:{ja:'サシャ・ブラウス',en:'Sasha Blouse'},series:{ja:'進撃の巨人',en:'Attack on Titan'},type:{ja:'食いしん坊な戦士 (ESFP)',en:'Gluttonous Warrior (ESFP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'食べることが大好きな調査兵団員。弓の腕前は一流で、戦場でも仲間を守るために奔走する。天真爛漫な笑顔で団員を和ませる存在。',en:'Survey Corps member who loves to eat. Top-class with a bow and runs to protect crewmates even in battle. Carefree smile that relaxes fellow soldiers.'},traits:{ja:['食いしん坊','弓','明るい','仲間思い','野性'],en:['Glutton','Bow','Bright','Loyal','Wild']},radar:[72,68,82,42,65,88]},
  {id:'kurapika_hxh',icon:'🔗',name:{ja:'クラピカ',en:'Kurapika'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'復讐に生きる賢者 (INTJ)',en:'Wise Man Living for Revenge (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'クルタ族の生き残り。眷属の鎖の念能力で敵に迫る。冷静な判断力と強い意志の持ち主だが、復讐という目的が全てを支配する。',en:'Survivor of the Kurta clan. Pursues enemies with Chain Jail Nen ability. Has calm judgment and strong will but revenge as a goal controls everything.'},traits:{ja:['復讐','冷静','鎖','クルタ族','誓い'],en:['Revenge','Calm','Chain','Kurta Clan','Oath']},radar:[78,52,35,92,88,55]},
  {id:'leorio_hxh',icon:'🩺',name:{ja:'レオリオ・パラディナイト',en:'Leorio Paradinight'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'熱血な医者の卵 (ESFJ)',en:'Hot-Blooded Aspiring Doctor (ESFJ)'},profile:{E:4,F:4,S:3,J:3},desc:{ja:'医者を目指す熱血漢。口は悪く見栄っ張りだが、友人のために泣ける純粋さがある。金のためと言いながら本当は人を救いたい正直者。',en:'Hot-blooded young man aiming to be a doctor. Crude mouth and boastful but has pure heart that cries for friends. Claims it\'s for money but honestly wants to save people.'},traits:{ja:['熱血','医者','友情','口が悪い','純粋'],en:['Hot-Blooded','Doctor','Friendship','Crude','Pure']},radar:[70,82,78,55,65,75]},
  {id:'hisoka_hxh',icon:'🃏',name:{ja:'ヒソカ・モロウ',en:'Hisoka Morow'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'戦闘狂の道化師 (ENTP)',en:'Battle-Crazed Jester (ENTP)'},profile:{E:3,T:4,N:4,P:4},desc:{ja:'戦闘を愛するマジシャンの殺し屋。強い相手との戦いに生を感じる危険な存在。ゴンとキルアを育て強くなるのを楽しみにしている。',en:'A magician assassin who loves combat. A dangerous existence that feels alive only in battle with strong opponents. Enjoys watching Gon and Killua grow stronger.'},traits:{ja:['戦闘狂','マジシャン','危険','興奮','奇妙'],en:['Battle-Crazed','Magician','Dangerous','Thrill','Bizarre']},radar:[90,28,55,85,32,28]},
  {id:'netero_hxh',icon:'🙏',name:{ja:'アイザック・ネテロ',en:'Isaac Netero'},series:{ja:'HUNTER×HUNTER',en:'Hunter x Hunter'},type:{ja:'最強の会長 (ENFJ)',en:'Strongest Chairman (ENFJ)'},profile:{E:3,F:3,N:4,J:4},desc:{ja:'ハンター協会会長で最強の念能力者の一人。強者との戦いを求める武人。キメラアント編での決死の戦いが伝説的。',en:'Hunter Association Chairman and one of the strongest Nen users. A warrior seeking battle with the strong. His desperate battle in the Chimera Ant arc is legendary.'},traits:{ja:['最強','会長','武人','決死','伝説'],en:['Strongest','Chairman','Warrior','Desperate','Legendary']},radar:[98,52,60,88,92,70]},
  {id:'sasuke_naruto',icon:'⚡',name:{ja:'うちはサスケ',en:'Sasuke Uchiha'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'復讐と贖罪の天才 (INTJ)',en:'Genius of Revenge and Redemption (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'うちは一族の生き残り。一族を滅ぼした兄への復讐を誓い修行を積む。孤高の天才だが、ナルトとの絆が最終的に彼を救う。',en:'Survivor of the Uchiha clan. Trains to avenge his brother who destroyed his clan. Solitary genius but his bond with Naruto ultimately saves him.'},traits:{ja:['天才','復讐','孤高','うちは','救済'],en:['Genius','Revenge','Solitary','Uchiha','Redemption']},radar:[92,42,28,90,75,40]},
  {id:'sakura_naruto',icon:'🌸',name:{ja:'春野サクラ',en:'Sakura Haruno'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'医療忍者の成長 (ESFJ)',en:'Medical Ninja Growth (ESFJ)'},profile:{E:3,F:4,S:3,J:4},desc:{ja:'内なるサクラという強い意志を持つ医療忍者。最初は弱かったが綱手の弟子として成長し、最強の医療忍者になる。',en:'Medical ninja with a strong inner will called Inner Sakura. Initially weak but grows as Tsunade\'s disciple to become the strongest medical ninja.'},traits:{ja:['医療忍者','成長','強さ','仲間','綱手弟子'],en:['Medical Ninja','Growth','Strength','Comrades','Tsunade Disciple']},radar:[75,82,68,75,80,65]},
  {id:'kakashi_naruto',icon:'📖',name:{ja:'はたけカカシ',en:'Kakashi Hatake'},series:{ja:'NARUTO -ナルト-',en:'Naruto'},type:{ja:'コピー忍者の師匠 (ISTP)',en:'Copy Ninja Mentor (ISTP)'},profile:{I:3,T:4,S:3,J:3},desc:{ja:'千の忍術をコピーした写輪眼の使い手。飄々としているが実力は最高峰。チームをまとめ導く優れた師匠。',en:'Sharingan user who copied a thousand jutsu. Easygoing but top-tier in ability. An excellent mentor who guides and unifies his team.'},traits:{ja:['コピー忍者','写輪眼','師匠','飄々','実力者'],en:['Copy Ninja','Sharingan','Mentor','Easygoing','Skilled']},radar:[88,62,55,88,82,55]},
  {id:'yor_spy',icon:'🌹',name:{ja:'ヨル・フォージャー',en:'Yor Forger'},series:{ja:'SPY×FAMILY',en:'SPY×FAMILY'},type:{ja:'殺し屋の優しい母 (ISFJ)',en:'Assassin Gentle Mother (ISFJ)'},profile:{I:3,F:4,S:4,J:3},desc:{ja:'茨姫という裏の顔を持つ凄腕の殺し屋だが、家族への愛情は本物。不器用だがアーニャとロイドのために全力を尽くす優しい人。',en:'A deadly assassin with the alias Thorn Princess but her love for family is genuine. Clumsy but gives everything for Anya and Loid. A gentle person.'},traits:{ja:['殺し屋','母','不器用','愛情','強さ'],en:['Assassin','Mother','Clumsy','Loving','Strong']},radar:[88,88,55,42,82,78]},
  {id:'marcille_dd',icon:'✨',name:{ja:'マルシル・ドノワ',en:'Marcille Donato'},series:{ja:'ダンジョン飯',en:'Delicious in Dungeon'},type:{ja:'魔法師のツッコミ役 (ENFP)',en:'Mage Straight-Man (ENFP)'},profile:{E:3,F:4,N:4,P:3},desc:{ja:'エルフの魔法師でライオスの妹の親友。モンスター料理への拒絶反応が激しいが、仲間のためなら頑張れる。長命種ゆえの孤独も抱える。',en:'Elven mage and best friend of Laios\'s sister. Strong rejection of monster food but can push through for her friends. Also carries loneliness as a long-lived species.'},traits:{ja:['エルフ','魔法師','嫌がり屋','仲間思い','長命'],en:['Elf','Mage','Reluctant','Loyal','Long-Lived']},radar:[62,82,72,78,65,72]},
  {id:'chilchuck_dd',icon:'🔑',name:{ja:'チルチャック・ティムズ',en:'Chilchuck Tims'},series:{ja:'ダンジョン飯',en:'Delicious in Dungeon'},type:{ja:'罠師の現実主義 (ISTJ)',en:'Trap Master Realist (ISTJ)'},profile:{I:3,T:4,S:4,J:4},desc:{ja:'罠の解除のプロ。ハーフフットの罠師で常に現実的な視点を持つ。口は悪くドライだが、危険な場面では仲間の命を守るために力を発揮する。',en:'A professional at disarming traps. A Halfling trap specialist with a consistently practical perspective. Crude and dry but shows his worth protecting teammates in dangerous situations.'},traits:{ja:['罠師','現実主義','ハーフフット','プロ','仲間守護'],en:['Trap Master','Realist','Halfling','Professional','Protector']},radar:[55,48,38,82,88,42]},
  {id:'power_csm',icon:'🩸',name:{ja:'パワー',en:'Power'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'血の悪魔の奔放さ (ESTP)',en:'Blood Devil Wildness (ESTP)'},profile:{E:4,S:4,T:3,P:4},desc:{ja:'血を操る悪魔でデンジの相棒。自己中心的で嘘つきだが、ニャーコへの愛情は本物。デンジとの友情を通じて成長する奔放な存在。',en:'Blood-manipulating devil and Denji\'s partner. Self-centered liar but love for Meowy is genuine. A wild existence that grows through friendship with Denji.'},traits:{ja:['奔放','自己中','血','猫愛','成長'],en:['Wild','Self-Centered','Blood','Cat Love','Growth']},radar:[80,45,72,38,32,65]},
  {id:'makima_csm',icon:'👁️',name:{ja:'マキマ',en:'Makima'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'支配の悪魔 (INTJ)',en:'Control Devil (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'公安のデビルハンターのリーダー。神秘的で謎めいた支配の悪魔。デンジに親切に接するが真の目的は深い闇の中にある。',en:'Leader of Public Safety Devil Hunters. Mysterious and enigmatic Control Devil. Acts kindly to Denji but true purpose lies in deep darkness.'},traits:{ja:['支配','神秘','謎','計画','闇'],en:['Control','Mysterious','Enigmatic','Plans','Darkness']},radar:[68,35,52,98,88,28]},
  {id:'aki_csm',icon:'⭐',name:{ja:'早川アキ',en:'Aki Hayakawa'},series:{ja:'チェンソーマン',en:'Chainsaw Man'},type:{ja:'義務感に生きる先輩 (ISTJ)',en:'Duty-Driven Senior (ISTJ)'},profile:{I:3,T:4,S:3,J:4},desc:{ja:'デビルハンターの先輩でデンジの指導役。家族をデビルに殺された過去を持つ。クールだが仲間への責任感が強い真面目な人物。',en:'Senior Devil Hunter and Denji\'s mentor. Has past of family killed by devils. Cool but a serious person with strong sense of responsibility toward comrades.'},traits:{ja:['先輩','義務感','責任','過去','誠実'],en:['Senior','Duty','Responsibility','Past','Sincere']},radar:[75,62,45,72,90,52]},
  {id:'alphonse_fma',icon:'🛡️',name:{ja:'アルフォンス・エルリック',en:'Alphonse Elric'},series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'鎧の中の優しい心 (INFJ)',en:'Gentle Heart in Armor (INFJ)'},profile:{I:3,F:4,N:3,J:4},desc:{ja:'体を失い鎧に魂を定着されたエドの弟。体がないのに誰より温かい心を持つ。兄とともに賢者の石を求め旅をする純粋な少年。',en:'Ed\'s younger brother with soul bound to armor after losing his body. Has the warmest heart despite having no body. A pure boy journeying with his brother seeking the Philosopher\'s Stone.'},traits:{ja:['優しい','兄弟愛','純粋','鎧','旅'],en:['Gentle','Brotherhood','Pure','Armor','Journey']},radar:[72,95,78,68,82,95]},
  {id:'mustang_fma',icon:'🔥',name:{ja:'ロイ・マスタング',en:'Roy Mustang'},series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'炎の錬金術師の野望 (ENTJ)',en:'Flame Alchemist Ambition (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'炎の錬金術師で大佐。国家錬金術師として軍上層部を目指す。飄々としているが確固たる目標と信念を持つカリスマリーダー。',en:'Flame Alchemist and Colonel. Aims for the top of the military as a State Alchemist. Easygoing but has firm goals and convictions as a charismatic leader.'},traits:{ja:['炎','野望','カリスマ','リーダー','信念'],en:['Flame','Ambition','Charismatic','Leader','Conviction']},radar:[80,55,65,90,85,42]},
  {id:'winry_fma',icon:'🔧',name:{ja:'ウィンリィ・ロックベル',en:'Winry Rockbell'},series:{ja:'鋼の錬金術師 BROTHERHOOD',en:'Fullmetal Alchemist: Brotherhood'},type:{ja:'機械鎧の天才職人 (ESFP)',en:'Genius Automail Mechanic (ESFP)'},profile:{E:4,F:4,S:4,P:3},desc:{ja:'オートメイルの天才技師でエドの幼馴染。エドとアルの旅を陰で支える存在。泣き虫だが芯は強く、大切な人への愛情を行動で示す。',en:'Genius automail engineer and Ed\'s childhood friend. Supports Ed and Al\'s journey from the shadows. Crybaby but has strong core, shows love for precious people through action.'},traits:{ja:['機械鎧','職人','幼馴染','愛情','成長'],en:['Automail','Mechanic','Childhood Friend','Loving','Growth']},radar:[65,88,78,62,72,82]},
  {id:'suzaku_cg',icon:'🌸',name:{ja:'枢木スザク',en:'Suzaku Kururugi'},series:{ja:'コードギアス 反逆のルルーシュ',en:'Code Geass'},type:{ja:'正義の騎士の葛藤 (ISFJ)',en:'Knight of Justice Conflict (ISFJ)'},profile:{I:3,F:4,S:4,J:4},desc:{ja:'ルルーシュの幼なじみで正規軍の騎士。内部から変えるという信念を持つが、その正義が時に暴力的な手段を肯定してしまう葛藤を抱える。',en:'Lelouch\'s childhood friend and knight of the regular military. Believes in changing things from within but struggles with his justice sometimes justifying violent means.'},traits:{ja:['正義','騎士','葛藤','幼馴染','矛盾'],en:['Justice','Knight','Conflict','Childhood Friend','Contradiction']},radar:[88,65,62,68,85,55]},
  {id:'cc_cg',icon:'🍕',name:{ja:'C.C.',en:'C.C.'},series:{ja:'コードギアス 反逆のルルーシュ',en:'Code Geass'},type:{ja:'不死の魔女 (INTP)',en:'Immortal Witch (INTP)'},profile:{I:4,T:4,N:4,P:3},desc:{ja:'ギアスを授ける不死の魔女。感情を表に出さず飄々としているが、ルルーシュとともに歩む存在。ピザへの愛情が唯一の人間らしさ。',en:'An immortal witch who grants Geass. Doesn\'t show emotions and is easygoing but walks alongside Lelouch. Love of pizza is her only human quality.'},traits:{ja:['不死','魔女','飄々','ギアス','ピザ'],en:['Immortal','Witch','Easygoing','Geass','Pizza']},radar:[55,42,35,88,65,45]},
  {id:'giorno_jjba',icon:'🌟',name:{ja:'ジョルノ・ジョバァーナ',en:'Giorno Giovanna'},series:{ja:'ジョジョの奇妙な冒険 黄金の風',en:'JoJo\'s Bizarre Adventure: Golden Wind'},type:{ja:'黄金の精神 (INFJ)',en:'Golden Spirit (INFJ)'},profile:{I:3,N:4,F:3,J:4},desc:{ja:'ディオの息子でギャングスターを目指す少年。生物を創造するゴールド・エクスペリエンスの使い手。黄金の精神で悪に立ち向かう。',en:'Dio\'s son aiming to become a gangstar. User of Gold Experience which creates life. Confronts evil with the Golden Spirit.'},traits:{ja:['黄金','ギャング','信念','静けさ','父超え'],en:['Golden','Gangster','Conviction','Calm','Surpassing Father']},radar:[82,62,48,88,85,72]},
  {id:'jotaro_jjba',icon:'🎓',name:{ja:'空条承太郎',en:'Jotaro Kujo'},series:{ja:'ジョジョの奇妙な冒険',en:'JoJo\'s Bizarre Adventure'},type:{ja:'やれやれなスタンド使い (ISTP)',en:'Good Grief Stand User (ISTP)'},profile:{I:4,T:4,S:3,J:3},desc:{ja:'やれやれだぜが口癖のスタープラチナの使い手。クールで無口だが仲間と家族を守るためには命を懸ける。時間を止める能力が強力。',en:'Good grief is his catchphrase as user of Star Platinum. Cool and quiet but risks his life to protect friends and family. Ability to stop time is powerful.'},traits:{ja:['クール','やれやれ','スタープラチナ','強さ','家族愛'],en:['Cool','Good Grief','Star Platinum','Strong','Family Love']},radar:[95,48,32,82,88,45]},
  {id:'dio_jjba',icon:'🧛',name:{ja:'DIO',en:'DIO'},series:{ja:'ジョジョの奇妙な冒険',en:'JoJo\'s Bizarre Adventure'},type:{ja:'カリスマの悪 (ENTJ)',en:'Charismatic Evil (ENTJ)'},profile:{E:4,T:4,N:4,J:4},desc:{ja:'時間を止めるザ・ワールドの使い手。圧倒的なカリスマと野望で多くの者を従える。無駄無駄無駄の叫びが印象的。',en:'User of The World that stops time. Commands many with overwhelming charisma and ambition. His cry of Muda Muda Muda is iconic.'},traits:{ja:['悪','カリスマ','野望','吸血鬼','時間停止'],en:['Evil','Charismatic','Ambitious','Vampire','Time Stop']},radar:[88,28,78,88,72,28]},
  {id:'emilia_rezero',icon:'❄️',name:{ja:'エミリア',en:'Emilia'},series:{ja:'Re:ゼロから始める異世界生活',en:'Re:Zero'},type:{ja:'孤独な半エルフ王候補 (INFP)',en:'Lonely Half-Elf Candidate (INFP)'},profile:{I:3,F:4,N:3,P:3},desc:{ja:'精霊魔法を使う半エルフの王候補。外見からサテラの魔女と間違われ孤独に生きてきた。純粋で不器用な愛情表現が魅力。',en:'Half-elf royal candidate who uses spirit magic. Has lived in loneliness mistaken for the Witch of Envy due to appearance. Charm lies in pure and clumsy expression of love.'},traits:{ja:['純粋','半エルフ','孤独','精霊','不器用'],en:['Pure','Half-Elf','Lonely','Spirit','Clumsy']},radar:[60,88,55,65,72,90]},
  {id:'subaru_rezero',icon:'🏃',name:{ja:'菜月昂',en:'Subaru Natsuki'},series:{ja:'Re:ゼロから始める異世界生活',en:'Re:Zero'},type:{ja:'死に戻る諦めない男 (ENFP)',en:'Never-Giving-Up Return-by-Death Man (ENFP)'},profile:{E:4,F:4,N:3,P:3},desc:{ja:'死に戻る能力を持つ一般人。何度死んでも諦めず最善の未来を目指し続ける。精神的に追い詰められても立ち上がる強さが物語の核心。',en:'An ordinary person with the ability to Return by Death. Never gives up no matter how many times he dies, always pursuing the best future. The strength to rise even when mentally cornered is the story\'s core.'},traits:{ja:['死に戻り','根性','諦めない','愛情','成長'],en:['Return by Death','Grit','Never Give Up','Love','Growth']},radar:[72,82,72,55,75,78]},
  {id:'rudeus_mt',icon:'📚',name:{ja:'ルーデウス・グレイラット',en:'Rudeus Greyrat'},series:{ja:'無職転生 〜異世界行ったら本気だす〜',en:'Mushoku Tensei: Jobless Reincarnation'},type:{ja:'転生した本気の魔法使い (INTP)',en:'Reincarnated Serious Mage (INTP)'},profile:{I:4,T:4,N:4,P:3},desc:{ja:'前世の後悔を胸に異世界に転生した元引きこもり。赤ん坊から努力し続け世界最高峰の魔法使いになる。成長と贖罪の物語。',en:'Former shut-in reincarnated into another world carrying past regrets. Works hard from infancy to become one of the world\'s greatest mages. A story of growth and redemption.'},traits:{ja:['転生','努力','魔法','贖罪','成長'],en:['Reincarnation','Effort','Magic','Redemption','Growth']},radar:[55,68,48,90,72,55]},
  {id:'eris_mt',icon:'🗡️',name:{ja:'エリス・ボレアス・グレイラット',en:'Eris Boreas Greyrat'},series:{ja:'無職転生 〜異世界行ったら本気だす〜',en:'Mushoku Tensei'},type:{ja:'猛烈な赤毛の騎士 (ESTP)',en:'Fierce Red-Haired Knight (ESTP)'},profile:{E:4,S:4,T:3,P:3},desc:{ja:'剣術を極めた赤毛の少女。激しい気性だが芯は優しく、ルーデウスに素直な感情を持てず苦しむ。成長して強くなった姿が感動的。',en:'A red-haired girl who has mastered swordsmanship. Fierce temperament but gentle at heart, struggling to express honest feelings toward Rudeus. Her growth into strength is moving.'},traits:{ja:['剣術','赤毛','激しい','優しい','成長'],en:['Swordsmanship','Red Hair','Fierce','Gentle','Growth']},radar:[85,55,55,48,68,65]},
  {id:'damian_spy',icon:'👑',name:{ja:'デズモンド・ダミアン',en:'Damian Desmond'},series:{ja:'SPY×FAMILY',en:'SPY×FAMILY'},type:{ja:'プライドの裏の孤独 (ENTJ)',en:'Loneliness Behind Pride (ENTJ)'},profile:{E:3,T:4,N:3,J:4},desc:{ja:'著名な政治家の息子でイーデン校のエリート生徒。プライドが高くアーニャを敵視するが、実は父の愛情に飢えている孤独な少年。',en:'Son of a prominent politician and elite Eden student. High pride and rivals Anya but actually a lonely boy starved for his father\'s affection.'},traits:{ja:['エリート','プライド','孤独','父親','成長'],en:['Elite','Pride','Lonely','Father','Growth']},radar:[65,48,55,72,78,45]},
  {id:'hinata_hq',icon:'🏐',name:{ja:'日向翔陽',en:'Shoyo Hinata'},series:{ja:'ハイキュー!!',en:'Haikyu!!'},type:{ja:'小さな巨人 (ENFP)',en:'Little Giant (ENFP)'},profile:{E:4,F:3,N:3,P:4},desc:{ja:'身長は低いがバレーへの情熱は誰より大きい。瞬発力と運動神経で弱点を補い、チームを鼓舞する太陽のような存在。',en:'Short in stature but passion for volleyball is greater than anyone. Compensates for weaknesses with explosive speed and athleticism, a sunshine presence who inspires the team.'},traits:{ja:['小さい','情熱','跳躍力','太陽','諦めない'],en:['Short','Passionate','Jumping','Sunshine','Never Give Up']},radar:[78,72,88,42,65,90]},
  {id:'kageyama_hq2',icon:'🏐',name:{ja:'影山飛雄',en:'Tobio Kageyama'},series:{ja:'ハイキュー!!',en:'Haikyu!!'},type:{ja:'天才セッターの成長 (INTJ)',en:'Genius Setter Growth (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'天才的なセットアップ技術を持つセッター。かつては独裁者と呼ばれたが、日向との関係で本当のバレーを学ぶ。',en:'A setter with genius setting skills. Once called a dictator but learns true volleyball through his relationship with Hinata.'},traits:{ja:['天才','セッター','成長','孤高','チームワーク'],en:['Genius','Setter','Growth','Solitary','Teamwork']},radar:[82,45,38,88,78,52]},
  {id:'oikawa_hq',icon:'🏐',name:{ja:'及川徹',en:'Toru Oikawa'},series:{ja:'ハイキュー!!',en:'Haikyu!!'},type:{ja:'努力の天才セッター (ENFJ)',en:'Hardworking Genius Setter (ENFJ)'},profile:{E:4,F:3,N:3,J:4},desc:{ja:'セッターとして天才ではないが誰より努力してきた男。チームをまとめるリーダーシップと個性を活かすセットで勝利を目指す。',en:'Not a genius setter but has worked harder than anyone. Aims for victory with leadership to unite the team and sets that bring out individuality.'},traits:{ja:['努力','リーダー','セッター','カリスマ','粘り強さ'],en:['Effort','Leader','Setter','Charisma','Persistence']},radar:[75,65,85,78,82,55]},
  {id:'gintoki_gintama',icon:'🍭',name:{ja:'坂田銀時',en:'Gintoki Sakata'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'だらしない侍の魂 (ENTP)',en:'Slacker Samurai Spirit (ENTP)'},profile:{E:3,N:4,T:3,P:4},desc:{ja:'週刊少年ジャンプが大好きなだらしない天然パーマ。普段は怠け者だが、いざとなれば圧倒的な剣の実力で仲間を守る。ギャグの中に泣ける展開を挟むのが銀魂の醍醐味。',en:'A shaggy-haired slacker who loves Shonen Jump. Usually lazy but when it counts, protects allies with overwhelming sword skills. The charm of Gintama is gut-wrenching scenes mixed into the comedy.'},traits:{ja:['ギャグ','侍','だらしない','実力者','友情'],en:['Comedy','Samurai','Slacker','Skilled','Friendship']},radar:[85,72,78,62,72,68]},
  {id:'kagura_gintama',icon:'☂️',name:{ja:'神楽',en:'Kagura'},series:{ja:'銀魂',en:'Gintama'},type:{ja:'天然パワー系女子 (ESTP)',en:'Natural Power Girl (ESTP)'},profile:{E:4,S:4,F:3,P:4},desc:{ja:'夜兎族の天才少女。圧倒的な怪力を持ちながら天真爛漫。チャイナドレスに傘を携えた姿が印象的。銀時・新八とともに万事屋を営む。',en:'A prodigy girl of the Yato clan. Has overwhelming strength while being carefree. Iconic image of Chinese dress and umbrella. Runs Yorozuya with Gintoki and Shinpachi.'},traits:{ja:['夜兎族','怪力','天真爛漫','食いしん坊','仲間'],en:['Yato Clan','Superstrength','Carefree','Glutton','Comrades']},radar:[90,65,85,38,58,85]},
  {id:'conan_dc',icon:'🔍',name:{ja:'江戸川コナン（工藤新一）',en:'Conan Edogawa (Shinichi Kudo)'},series:{ja:'名探偵コナン',en:'Detective Conan'},type:{ja:'小さな名探偵 (INTP)',en:'Little Great Detective (INTP)'},profile:{I:3,T:4,N:4,J:3},desc:{ja:'高校生探偵の工藤新一が薬で幼児化した名探偵。どんな複雑な謎も論理的に解き明かす天才。真実はいつも一つ！',en:'High school detective Shinichi Kudo, shrunken into a child by a drug. A genius who logically solves any complex mystery. There is always one truth!'},traits:{ja:['推理','天才','論理','真実','小学生'],en:['Deduction','Genius','Logic','Truth','Elementary Student']},radar:[45,58,62,98,80,72]},
  {id:'vegeta_db',icon:'👑',name:{ja:'ベジータ',en:'Vegeta'},series:{ja:'ドラゴンボール超',en:'Dragon Ball Super'},type:{ja:'プライドの王子 (INTJ)',en:'Prince of Pride (INTJ)'},profile:{I:3,T:4,N:3,J:4},desc:{ja:'サイヤ人の王子でプライドの塊。最強への執念でかつての敵から仲間へと変わる。孫悟空へのライバル心が成長の原動力。',en:'Saiyan prince and embodiment of pride. Changes from enemy to ally through obsession with being strongest. Rivalry with Son Goku is the driving force of growth.'},traits:{ja:['王子','プライド','ライバル','成長','最強'],en:['Prince','Pride','Rival','Growth','Strongest']},radar:[92,42,38,72,80,38]},
  {id:'kirito_sao',icon:'🗡️',name:{ja:'桐ヶ谷和人（キリト）',en:'Kazuto Kirigaya (Kirito)'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'孤独なソードマスター (INTJ)',en:'Solitary Sword Master (INTJ)'},profile:{I:4,T:4,N:3,J:3},desc:{ja:'SAOのベータテスターでゲームの世界に閉じ込められた少年。デュアルブレードの使い手でソロプレイヤーとして最強を目指す。',en:'SAO beta tester who gets trapped in the game world. Dual blade wielder aiming to be the strongest as a solo player.'},traits:{ja:['ソロ','最強','デュアル','電脳世界','守護'],en:['Solo','Strongest','Dual Blade','Digital World','Protector']},radar:[90,55,38,78,78,52]},
  {id:'asuna_sao',icon:'⚡',name:{ja:'アスナ',en:'Asuna'},series:{ja:'ソードアート・オンライン',en:'Sword Art Online'},type:{ja:'電光石火の副団長 (ENFJ)',en:'Lightning-Fast Vice Commander (ENFJ)'},profile:{E:3,F:4,N:3,J:4},desc:{ja:'閃光のアスナと呼ばれる最強の剣士の一人。感情豊かで仲間想い、キリトへの愛情が最大の力の源。',en:'One of the strongest swordspeople called Lightning Asuna. Emotionally rich and caring for allies, love for Kirito is her greatest source of strength.'},traits:{ja:['閃光','副団長','愛','強さ','料理'],en:['Lightning','Vice Commander','Love','Strong','Cooking']},radar:[85,82,72,68,82,75]},
  {id:'marin_sono',icon:'🎎',name:{ja:'喜多川海夢',en:'Marin Kitagawa'},series:{ja:'その着せ替え人形は恋をする',en:'My Dress-Up Darling'},type:{ja:'ギャルオタクの輝き (ENFP)',en:'Gyaru Otaku Radiance (ENFP)'},profile:{E:4,F:4,N:4,P:4},desc:{ja:'人気ギャルだがオタクの趣味を隠さない明るい少女。五条に頼んでコスプレ衣装を作ってもらい、どんなキャラも完璧に演じる。',en:'A popular gyaru who doesn\'t hide her otaku hobbies. A bright girl who asks Gojo to make cosplay costumes, performing any character perfectly.'},traits:{ja:['ギャル','オタク','コスプレ','明るい','自由'],en:['Gyaru','Otaku','Cosplay','Bright','Free']},radar:[78,82,92,52,58,88]},
  {id:'wakana_sono',icon:'🪆',name:{ja:'五条新菜',en:'Wakana Gojo'},series:{ja:'その着せ替え人形は恋をする',en:'My Dress-Up Darling'},type:{ja:'人形職人の不器用な誠実 (ISFP)',en:'Doll Artisan Clumsy Sincerity (ISFP)'},profile:{I:4,S:4,F:3,P:3},desc:{ja:'雛人形の頭師を目指す不器用な少年。海夢のコスプレ衣装を作ることで自分の世界が広がっていく。誠実で技術への真摯な姿勢が魅力。',en:'A clumsy boy aiming to be a hina doll craftsman. His world expands by making cosplay costumes for Marin. Charm lies in sincerity and serious attitude toward craft.'},traits:{ja:['職人','誠実','人形','不器用','成長'],en:['Craftsman','Sincere','Doll','Clumsy','Growth']},radar:[55,65,32,72,85,72]},
  {id:'kaguya_klw',icon:'🎀',name:{ja:'四宮かぐや',en:'Kaguya Shinomiya'},series:{ja:'かぐや様は告らせたい',en:'Kaguya-sama: Love Is War'},type:{ja:'天才令嬢の恋愛脳 (INTJ)',en:'Genius Ojou Love Brain (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'四宮財閥令嬢で天才だが恋愛では素直になれない。白銀に告白させようと策略を練るが、その都度恋心に負けてしまう可愛さが魅力。',en:'Shinomiya conglomerate heiress and genius but can\'t be honest in love. Schemes to make Shirogane confess but keeps losing to her own heart, which is her charm.'},traits:{ja:['天才','令嬢','ツンデレ','策略','かわいい'],en:['Genius','Ojou','Tsundere','Scheming','Cute']},radar:[42,65,55,95,80,48]},
  {id:'nadeshiko_yc',icon:'🏕️',name:{ja:'各務原なでしこ',en:'Nadeshiko Kagamihara'},series:{ja:'ゆるキャン△',en:'Laid-Back Camp'},type:{ja:'キャンプ大好きの太陽 (ENFP)',en:'Sunshine Camp Lover (ENFP)'},profile:{E:4,F:4,S:3,P:4},desc:{ja:'キャンプに魅了された元気いっぱいの女の子。どこでも食欲旺盛で笑顔が絶えない。リンと共に各地でキャンプを楽しむ。',en:'A full-of-energy girl captivated by camping. Has big appetite and endless smiles anywhere. Enjoys camping across various locations with Rin.'},traits:{ja:['キャンプ','食欲','笑顔','元気','友情'],en:['Camping','Appetite','Smile','Energetic','Friendship']},radar:[65,82,88,45,62,92]},
  {id:'rin_yc',icon:'⛺',name:{ja:'志摩リン',en:'Rin Shima'},series:{ja:'ゆるキャン△',en:'Laid-Back Camp'},type:{ja:'ソロキャンの達人 (ISTP)',en:'Solo Camp Expert (ISTP)'},profile:{I:4,S:4,T:3,P:4},desc:{ja:'ソロキャンプを愛する静かな少女。自分のペースで自由にキャンプを楽しむことを好むが、なでしこと仲良くなる中で仲間との楽しさも知る。',en:'A quiet girl who loves solo camping. Prefers enjoying camping freely at her own pace but comes to know the joy of companions while befriending Nadeshiko.'},traits:{ja:['ソロ','静か','自由','マイペース','成長'],en:['Solo','Quiet','Free','Own Pace','Growth']},radar:[50,55,35,72,80,70]},
  {id:'yui_keion',icon:'🎸',name:{ja:'平沢唯',en:'Yui Hirasawa'},series:{ja:'けいおん！',en:'K-On!'},type:{ja:'天才の空気系ギタリスト (ENFP)',en:'Genius Airhead Guitarist (ENFP)'},profile:{E:4,F:4,N:2,P:4},desc:{ja:'軽音部のギタリスト。天才的な演奏センスを持つが普段はボーっとしている。みんなに愛される天然キャラで部の雰囲気を作る。',en:'Guitarist of the Light Music Club. Has genius performance sense but usually spacey. A natural character loved by everyone who sets the club atmosphere.'},traits:{ja:['ギター','天然','天才','食いしん坊','笑顔'],en:['Guitar','Natural','Genius','Glutton','Smile']},radar:[72,85,90,35,42,95]},
  {id:'kyotaro_bokuyaba',icon:'🔪',name:{ja:'市川京太郎',en:'Kyotaro Ichikawa'},series:{ja:'僕の心のヤバイやつ',en:'The Dangers in My Heart'},type:{ja:'中二病の純愛少年 (INTJ)',en:'Chuunibyou Pure Love Boy (INTJ)'},profile:{I:4,T:3,N:4,J:3},desc:{ja:'中二病で暗い妄想を抱えるが、山田杏奈への純粋な恋心が彼を変えていく。不器用な純愛が微笑ましい成長ストーリー。',en:'Has chunibyo and dark delusions, but pure feelings for Anna Yamada change him. An endearing growth story of clumsy pure love.'},traits:{ja:['中二病','純愛','不器用','成長','妄想'],en:['Chunibyo','Pure Love','Clumsy','Growth','Delusions']},radar:[42,65,28,72,55,75]},
  {id:'anna_bokuyaba',icon:'📸',name:{ja:'山田杏奈',en:'Anna Yamada'},series:{ja:'僕の心のヤバイやつ',en:'The Dangers in My Heart'},type:{ja:'人気モデルの素顔 (ESFP)',en:'Popular Model True Face (ESFP)'},profile:{E:3,F:4,S:3,P:4},desc:{ja:'クラス一の人気者でモデルの少女。周囲には完璧に見えるが、市川の前では素の自分を出せる。食べることが大好きな可愛い一面も。',en:'The most popular class model. Appears perfect to others but can show her true self in front of Ichikawa. Also has a cute side of loving to eat.'},traits:{ja:['モデル','人気者','素の顔','食いしん坊','笑顔'],en:['Model','Popular','True Self','Foodie','Smile']},radar:[70,78,85,48,60,85]},
  {id:'chihaya_cf',icon:'🃏',name:{ja:'綾瀬千早',en:'Chihaya Ayase'},series:{ja:'ちはやふる',en:'Chihayafuru'},type:{ja:'かるたの鬼 (ENFP)',en:'Karuta Demon (ENFP)'},profile:{E:4,N:4,F:3,P:4},desc:{ja:'かるたに全てを捧げる情熱的な少女。目標はクイーン位への挑戦と新との再会。一直線な情熱と仲間への愛が武器。',en:'A passionate girl who devotes everything to karuta. Goal is to challenge for the Queen position and reunite with Arata. Straight-line passion and love for friends are her weapons.'},traits:{ja:['かるた','情熱','一直線','青春','友情'],en:['Karuta','Passionate','Single-Minded','Youth','Friendship']},radar:[80,72,78,58,70,85]},
  {id:'takagi_tkgk',icon:'😏',name:{ja:'高木さん',en:'Takagi'},series:{ja:'からかい上手の高木さん',en:'Teasing Master Takagi-san'},type:{ja:'完璧な恋のテイザー (ENFJ)',en:'Perfect Love Teaser (ENFJ)'},profile:{E:4,F:4,N:4,J:3},desc:{ja:'隣の席の西片くんをからかうことが大好きな少女。実は西片くんへの恋心を巧みに隠してからかいという形で表現する恋愛上手。',en:'A girl who loves teasing Nishikata-kun who sits next to her. Actually skillfully hides feelings for Nishikata and expresses them through teasing. Skilled in love.'},traits:{ja:['からかい','恋愛上手','笑顔','策略','純粋'],en:['Teasing','Love Expert','Smile','Scheming','Pure']},radar:[60,78,85,72,65,78]},
  {id:'thorfinn_vs',icon:'⚔️',name:{ja:'トルフィン',en:'Thorfinn'},series:{ja:'ヴィンランド・サガ',en:'Vinland Saga'},type:{ja:'復讐から平和へ (INFP)',en:'From Revenge to Peace (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'父アシェラッドへの復讐に生きた少年が、真の戦士とは戦わない者と悟り平和を求める旅に変わる。壮大な成長の物語。',en:'A boy who lived for revenge against Askeladd transforms to pursue peace, realizing a true warrior is one who doesn\'t fight. A grand story of growth.'},traits:{ja:['復讐','成長','平和','戦士','旅'],en:['Revenge','Growth','Peace','Warrior','Journey']},radar:[85,72,38,65,78,65]},
  {id:'askeladd_vs',icon:'⚔️',name:{ja:'アシェラッド',en:'Askeladd'},series:{ja:'ヴィンランド・サガ',en:'Vinland Saga'},type:{ja:'道化師の真の王 (ENTP)',en:'Jester\'s True King (ENTP)'},profile:{E:3,T:4,N:4,P:3},desc:{ja:'ヴァイキングの傭兵隊長。飄々とした道化師の仮面の裏にウェールズへの愛国心と深謀を持つ。トルフィンの父を殺した宿敵でもある。',en:'Viking mercenary captain. Behind the mask of an easygoing jester lies Welsh patriotism and deep strategy. Also the mortal enemy who killed Thorfinn\'s father.'},traits:{ja:['道化師','深謀','ウェールズ','裏切り','哲学'],en:['Jester','Deep Strategy','Wales','Betrayal','Philosophy']},radar:[75,38,62,92,62,30]},
  {id:'asta_bc',icon:'⚔️',name:{ja:'アスタ',en:'Asta'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'魔力ゼロの魔法帝 (ENFP)',en:'Zero Magic Emperor (ENFP)'},profile:{E:4,F:4,S:4,P:3},desc:{ja:'魔力を持たない少年が魔法帝を目指す熱血ストーリー。反魔法の剣を使い叫び続ける姿がうるさいが愛される。',en:'Hot-blooded story of a boy with no magic aiming for Wizard King. Uses anti-magic swords and keeps yelling, which is annoying but beloved.'},traits:{ja:['魔力ゼロ','熱血','叫ぶ','諦めない','反魔法'],en:['Zero Magic','Hot-Blooded','Shouting','Never Give Up','Anti-Magic']},radar:[82,72,82,38,78,88]},
  {id:'yuno_bc',icon:'🌬️',name:{ja:'ユノ',en:'Yuno'},series:{ja:'ブラッククローバー',en:'Black Clover'},type:{ja:'天才の静けさ (INTJ)',en:'Genius Silence (INTJ)'},profile:{I:4,T:4,N:4,J:4},desc:{ja:'アスタの幼なじみで天才的な風魔法の使い手。クールで無駄口を叩かないが、アスタとのライバル関係が成長を加速させる。',en:'Asta\'s childhood friend and genius wind magic user. Cool without wasted words but rivalry with Asta accelerates growth.'},traits:{ja:['天才','風魔法','クール','ライバル','成長'],en:['Genius','Wind Magic','Cool','Rival','Growth']},radar:[88,40,32,85,82,52]},
  {id:'shin_kingdom',icon:'⚔️',name:{ja:'信',en:'Shin'},series:{ja:'キングダム',en:'Kingdom'},type:{ja:'天下の大将軍を目指す (ENFP)',en:'Aiming for Greatest General (ENFP)'},profile:{E:4,F:4,N:3,P:4},desc:{ja:'奴隷から天下の大将軍を目指す少年兵。無謀に見えるほどの行動力と仲間への熱い想いで不可能を可能にし続ける。',en:'A young soldier aiming from slave to greatest general under heaven. Continues making the impossible possible with seemingly reckless drive and passionate feelings for comrades.'},traits:{ja:['熱血','将軍','成長','仲間','行動力'],en:['Hot-Blooded','General','Growth','Comrades','Drive']},radar:[88,72,78,42,72,85]},
  {id:'ouki_kingdom',icon:'🏹',name:{ja:'王騎',en:'Ouki'},series:{ja:'キングダム',en:'Kingdom'},type:{ja:'六大将軍の貫禄 (ENTJ)',en:'Six Generals Gravitas (ENTJ)'},profile:{E:3,T:4,N:4,J:4},desc:{ja:'秦国最強の六大将軍の一人。巨大な槍と圧倒的な戦場での存在感が印象的。信を認め育てようとした偉大な将軍。',en:'One of the strongest Six Great Generals of Qin. Impressive with his giant lance and overwhelming battlefield presence. A great general who recognized and tried to nurture Shin.'},traits:{ja:['六大将軍','貫禄','巨大な槍','戦場','指導'],en:['Six Generals','Gravitas','Giant Lance','Battlefield','Mentoring']},radar:[98,52,55,88,92,42]},
  {id:'benimaru_tensura',icon:'🔥',name:{ja:'ベニマル',en:'Benimaru'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'炎の戦鬼のプライド (ISTP)',en:'Flame War Ogre Pride (ISTP)'},profile:{I:3,T:4,S:4,P:3},desc:{ja:'鬼族の戦士でリムルに忠誠を誓う。炎を操る実力者で戦闘の天才。寡黙で厳しいがリムルへの信頼は絶対的。',en:'Ogre warrior who pledges loyalty to Rimuru. A skilled flame wielder and combat genius. Taciturn and strict but absolute trust in Rimuru.'},traits:{ja:['炎','鬼族','プライド','強さ','忠義'],en:['Flame','Ogre','Pride','Strong','Loyalty']},radar:[90,42,38,72,82,45]},
  {id:'milim_tensura',icon:'👑',name:{ja:'ミリム・ナーヴァ',en:'Milim Nava'},series:{ja:'転生したらスライムだった件',en:'That Time I Got Reincarnated as a Slime'},type:{ja:'最古の魔王の天真爛漫 (ESFP)',en:'Oldest Demon Lord Carefree (ESFP)'},profile:{E:4,F:3,S:4,P:4},desc:{ja:'最古の魔王の一人で圧倒的な力を持つが子供のような純粋さを持つ。リムルをビーダイと呼んで懐き、友情と力の間で揺れる。',en:'One of the oldest Demon Lords with overwhelming power but childlike purity. Calls Rimuru Beady and takes to him, wavering between friendship and power.'},traits:{ja:['最古魔王','純粋','圧倒的力','子供らしさ','友情'],en:['Oldest Demon Lord','Pure','Overwhelming Power','Childlike','Friendship']},radar:[98,62,82,42,45,90]},
  {id:'mem_oshinoko2',icon:'🎵',name:{ja:'MEMちょ',en:'MEM-cho'},series:{ja:'【推しの子】',en:'Oshi no Ko'},type:{ja:'実年齢隠しの配信者 (ENFP)',en:'Age-Hiding Streamer (ENFP)'},profile:{E:4,F:4,N:3,P:4},desc:{ja:'配信者として活躍する実は年上の少女。明るく八方美人だが根は努力家。推しの子の世界のキャラの中でも安心感ある存在。',en:'Actually an older girl active as a streamer. Bright and sociable but hardworking at heart. Among Oshi no Ko characters, a reassuring presence.'},traits:{ja:['配信者','明るい','年上','努力','可愛い'],en:['Streamer','Bright','Older','Hardworking','Cute']},radar:[72,75,88,48,62,78]},
  {id:'bachira_bl',icon:'⚽',name:{ja:'馬狼照英',en:'Reo Mikage'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'超個人主義のストライカー (ESTP)',en:'Ultra-Individualist Striker (ESTP)'},profile:{E:4,S:4,T:4,P:4},desc:{ja:'自分のエゴを最大化することで最強のストライカーを目指す。攻撃的な個人主義が時に仲間との摩擦を生むが、その本能的な才能は本物。',en:'Aims to be the strongest striker by maximizing his own ego. Aggressive individualism sometimes creates friction with teammates but the instinctive talent is real.'},traits:{ja:['個人主義','エゴ','攻撃的','本能','才能'],en:['Individualist','Ego','Aggressive','Instinct','Talent']},radar:[88,32,55,62,45,65]},
  {id:'isagi_bl',icon:'⚽',name:{ja:'潔世一',en:'Yoichi Isagi'},series:{ja:'ブルーロック',en:'Blue Lock'},type:{ja:'空間を支配するストライカー (INTJ)',en:'Space-Controlling Striker (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'空間認識能力に優れたストライカー。ゴールへの渇望と論理的な状況判断でブルーロックを勝ち上がる。成長するほど恐ろしい覚醒型。',en:'A striker with superior spatial recognition. Advances through Blue Lock with hunger for goals and logical situational judgment. An awakening type who becomes more fearsome as he grows.'},traits:{ja:['空間認識','渇望','成長','覚醒','論理'],en:['Spatial Recognition','Hunger','Growth','Awakening','Logic']},radar:[78,48,42,85,72,65]},
  {id:'nilfloern_ishura',icon:'💀',name:{ja:'ニルフォルン',en:'Nilfhorun'},series:{ja:'異修羅',en:'Ishura'},type:{ja:'魔剣の孤独 (INFP)',en:'Demon Sword Solitude (INFP)'},profile:{I:4,N:4,F:3,P:3},desc:{ja:'強者のみが集う世界で最強を決める戦いに挑む剣士。孤独だが信念は揺るぎなく、弱者への優しさを秘める。',en:'A swordsman who challenges battles to determine the strongest in a world where only the strong gather. Solitary but with unshakeable conviction and hidden kindness to the weak.'},traits:{ja:['孤独','強さ','信念','剣','優しさ'],en:['Solitary','Strong','Conviction','Sword','Kindness']},radar:[90,52,28,78,72,58]},
  {id:'novak_chi',icon:'🌍',name:{ja:'ノヴァク',en:'Novak'},series:{ja:'チ。-地球の運動について-',en:'Chi: About the Movement of Earth'},type:{ja:'信仰と科学の間で (INFJ)',en:'Between Faith and Science (INFJ)'},profile:{I:4,N:4,F:4,J:3},desc:{ja:'地動説を信じる者たちの後継者。信仰と真理の間で苦悩しながら、前の世代が命を懸けて守った知識を未来へ繋ごうとする。',en:'Successor to those who believed in heliocentrism. Struggles between faith and truth, trying to connect to the future the knowledge past generations protected with their lives.'},traits:{ja:['信仰','真理','継承','苦悩','覚悟'],en:['Faith','Truth','Inheritance','Struggle','Resolve']},radar:[42,80,45,82,78,72]},
  {id:'yamada_muki',icon:'📚',name:{ja:'山田くん',en:'Yamada-kun'},series:{ja:'正反対な君と僕',en:'You and I Are Polar Opposites'},type:{ja:'内気な優等生 (ISFP)',en:'Shy Honor Student (ISFP)'},profile:{I:4,S:3,F:3,P:3},desc:{ja:'真面目で内気な優等生。日野さんへの恋心を持ちながらも不器用な関係が続く。正反対な二人の関係が微笑ましい青春ラブコメ。',en:'A serious and shy honor student. Has feelings for Hino while their clumsy relationship continues. The relationship of polar opposites is an endearing youth rom-com.'},traits:{ja:['内気','優等生','真面目','不器用','青春'],en:['Shy','Honor Student','Serious','Clumsy','Youth']},radar:[42,58,28,78,82,72]},
  {id:'yorishige_ys',icon:'🔮',name:{ja:'諏訪頼重',en:'Yorishige Suwa'},series:{ja:'逃げ上手の若君',en:'The Elusive Samurai'},type:{ja:'未来を見通す神官 (ENTP)',en:'Future-Seeing Priest (ENTP)'},profile:{E:4,T:3,N:4,P:4},desc:{ja:'諏訪の神官で未来を見通す力を持つ。時行に逃げることの才能を見出し守る存在。飄々とした態度の裏に深い愛情と覚悟がある。',en:'Suwa shrine priest with the power to foresee the future. Finds talent in Tokiyuki for fleeing and protects him. Behind his easygoing attitude lies deep love and resolve.'},traits:{ja:['予知','神官','飄々','愛情','覚悟'],en:['Precognition','Priest','Easygoing','Love','Resolve']},radar:[55,72,78,85,65,60]},
  {id:'shin_sd',icon:'👓',name:{ja:'シン・アダム',en:'Shin Adar'},series:{ja:'SAKAMOTO DAYS',en:'Sakamoto Days'},type:{ja:'テレパシーの元殺し屋 (INFP)',en:'Telepathy Former Assassin (INFP)'},profile:{I:4,N:4,F:4,P:3},desc:{ja:'人の心が読めるテレパシー能力者の元殺し屋。坂本に出会い更生した繊細な青年。過去の罪と向き合いながら新しい生き方を模索する。',en:'A former assassin with telepathy who can read minds. A sensitive young man rehabilitated after meeting Sakamoto. Searching for a new way of life while facing past sins.'},traits:{ja:['テレパシー','繊細','更生','過去','成長'],en:['Telepathy','Sensitive','Rehabilitation','Past','Growth']},radar:[55,85,42,78,65,72]},
  {id:'draken_tr',icon:'🐉',name:{ja:'龍宮寺堅（ドラケン）',en:'Ken Ryuguji (Draken)'},series:{ja:'東京卍リベンジャーズ',en:'Tokyo Revengers'},type:{ja:'竜の副総長 (ISTP)',en:'Dragon Vice Commander (ISTP)'},profile:{I:3,T:4,S:4,J:4},desc:{ja:'東京卍會の副総長でマイキーの親友。頭に龍の刺青が印象的。無口で厳しいが仲間思いで義理堅い。マイキーの暴走を止める理性の柱。',en:'Tokyo Manji Gang\'s vice commander and Mikey\'s best friend. Impressive dragon tattoo on his head. Quiet and strict but loyal and faithful to comrades. The pillar of reason that stops Mikey\'s rampage.'},traits:{ja:['龍','副総長','理性','義理','仲間'],en:['Dragon','Vice Commander','Reason','Loyalty','Comrades']},radar:[88,55,45,72,90,52]},
  {id:'reigen_mp100',icon:'💫',name:{ja:'霊幻新隆',en:'Arataka Reigen'},series:{ja:'モブサイコ100',en:'Mob Psycho 100'},type:{ja:'詐欺師の本物の師匠 (ENTP)',en:'Fraudster True Master (ENTP)'},profile:{E:4,T:3,N:4,P:4},desc:{ja:'霊能力を持たない霊能コンサルタント。詐欺師だがモブへの愛情と人生訓は本物。いざとなれば自分の言葉で怪霊に立ち向かう胆力がある。',en:'A spiritual consultant with no actual spiritual powers. A con man but love for Mob and life lessons are genuine. Has the nerve to confront evil spirits with his own words when it counts.'},traits:{ja:['詐欺師','言葉','師匠','胆力','本物'],en:['Con Man','Words','Master','Nerve','Genuine']},radar:[55,68,88,52,58,48]},
  {id:'yato_noragami',icon:'🗡️',name:{ja:'ヤト',en:'Yato'},series:{ja:'ノラガミ',en:'Noragami'},type:{ja:'無名神の夢 (ENFP)',en:'Nameless God Dream (ENFP)'},profile:{E:4,N:4,F:4,P:4},desc:{ja:'神社を持たない流浪の神。5円でどんな願いでも叶えようとする。明るいが孤独で、ひとに認められ覚えてもらうことを望む存在。',en:'A wandering god without a shrine. Tries to grant any wish for 5 yen. Bright but lonely, a being who wishes to be recognized and remembered by people.'},traits:{ja:['流浪','5円','夢','孤独','成長'],en:['Wandering','5 Yen','Dream','Lonely','Growth']},radar:[72,72,75,48,42,68]},
  {id:'tsunemori_pp',icon:'🔫',name:{ja:'常守朱',en:'Akane Tsunemori'},series:{ja:'PSYCHO-PASS サイコパス',en:'Psycho-Pass'},type:{ja:'揺るぎない正義の監視官 (INFJ)',en:'Unshakeable Justice Inspector (INFJ)'},profile:{I:3,N:4,F:4,J:4},desc:{ja:'シビュラシステムと向き合いながら真の正義を問い続ける監視官。圧力にも屈しない信念と、人間への深い共感が武器。',en:'An Inspector who continues questioning true justice while confronting the Sibyl System. Conviction that doesn\'t yield to pressure and deep empathy for people are her weapons.'},traits:{ja:['正義','信念','共感','監視官','シビュラ'],en:['Justice','Conviction','Empathy','Inspector','Sibyl']},radar:[62,88,62,80,88,78]},
  {id:'kogami_pp',icon:'🚬',name:{ja:'狡噛慎也',en:'Shinya Kogami'},series:{ja:'PSYCHO-PASS サイコパス',en:'Psycho-Pass'},type:{ja:'元監視官の追跡者 (ISTP)',en:'Former Inspector Hunter (ISTP)'},profile:{I:4,T:4,S:4,P:3},desc:{ja:'槙島への復讐を胸に潜伏する元監視官。鋭い直感と圧倒的な身体能力で獲物を追い詰める。常守との複雑な関係が物語を彩る。',en:'Former Inspector lurking with revenge against Makishima in his heart. Corners prey with sharp intuition and overwhelming physical ability. Complex relationship with Tsunemori colors the story.'},traits:{ja:['復讐','潜伏','直感','肉体','信念'],en:['Revenge','Undercover','Intuition','Physical','Conviction']},radar:[88,45,35,82,72,42]},
  {id:'sayaka_mami_mg',icon:'🎻',name:{ja:'美樹さやか',en:'Sayaka Miki'},series:{ja:'魔法少女まどか☆マギカ',en:'Puella Magi Madoka Magica'},type:{ja:'正義の代償 (ENFJ)',en:'Price of Justice (ENFJ)'},profile:{E:4,F:4,N:3,J:3},desc:{ja:'正義の魔法少女を自称し仲間を守るために戦う少女。誰かを救いたいという純粋な思いが彼女の悲劇の始まりとなる。',en:'A girl who calls herself a justice magical girl and fights to protect allies. The pure desire to save someone becomes the beginning of her tragedy.'},traits:{ja:['正義','悲劇','純粋','愛','変容'],en:['Justice','Tragedy','Pure','Love','Transformation']},radar:[72,82,72,45,78,82]},
  {id:'gilbert_veg',icon:'✉️',name:{ja:'ギルベルト・ブーゲンビリア',en:'Gilbert Bougainvillea'},series:{ja:'ヴァイオレット・エヴァーガーデン',en:'Violet Evergarden'},type:{ja:'愛の言葉を残した少佐 (INFJ)',en:'Major Who Left Words of Love (INFJ)'},profile:{I:4,N:4,F:4,J:3},desc:{ja:'ヴァイオレットに「愛している」と残した少佐。戦場で彼女に生きることと人間性を教えた存在。その言葉の意味がヴァイオレットの旅の出発点。',en:'The Major who left I love you for Violet. Taught her to live and humanity on the battlefield. The meaning of those words is the starting point of Violet\'s journey.'},traits:{ja:['愛','少佐','言葉','教師','謎'],en:['Love','Major','Words','Teacher','Mystery']},radar:[55,85,45,72,78,70]},
  {id:'okabe_sg',icon:'📱',name:{ja:'岡部倫太郎（鳳凰院凶真）',en:'Rintaro Okabe (Hououin Kyouma)'},series:{ja:'シュタインズ・ゲート',en:'Steins;Gate'},type:{ja:'中二病の天才科学者 (ENTP)',en:'Chunibyo Genius Scientist (ENTP)'},profile:{E:4,T:4,N:4,P:3},desc:{ja:'自称「狂気のマッドサイエンティスト」の大学生。タイムリープ実験で世界線を巡り、仲間を守るために何度も過去に戻る決意をする。',en:'A college student who calls himself a mad scientist of madness. Travels world lines through time leap experiments and resolves to return to the past repeatedly to protect friends.'},traits:{ja:['中二病','タイムリープ','科学','仲間','覚悟'],en:['Chunibyo','Time Leap','Science','Friends','Resolve']},radar:[65,78,78,90,75,52]},
  {id:'kurisu_sg',icon:'🔬',name:{ja:'牧瀬紅莉栖',en:'Kurisu Makise'},series:{ja:'シュタインズ・ゲート',en:'Steins;Gate'},type:{ja:'天才少女の科学者 (INTJ)',en:'Genius Girl Scientist (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'18歳でありながら世界的な神経科学者。岡部のことをツンデレしながら共同研究を進める。論理と感情の間で揺れる人間らしい天才。',en:'An 18-year-old world-class neuroscientist. Progresses collaborative research while being tsundere toward Okabe. A human genius wavering between logic and emotion.'},traits:{ja:['天才','科学者','ツンデレ','論理','感情'],en:['Genius','Scientist','Tsundere','Logic','Emotion']},radar:[45,65,52,98,80,55]},
  {id:'emma_tpn',icon:'🌿',name:{ja:'エマ',en:'Emma'},series:{ja:'約束のネバーランド',en:'The Promised Neverland'},type:{ja:'誰も見捨てない主人公 (ENFP)',en:'Leave No One Behind Protagonist (ENFP)'},profile:{E:4,F:4,N:3,P:3},desc:{ja:'農園での真実を知り誰一人置いていかないという信念で仲間を導く少女。身体能力が高く感情豊か、強い意志で不可能を突破する。',en:'A girl who learns the truth of the farm and leads comrades with conviction to leave no one behind. High physical ability and emotionally rich, breaks through the impossible with strong will.'},traits:{ja:['諦めない','仲間','感情','強さ','知性'],en:['Never Give Up','Comrades','Emotional','Strong','Intelligent']},radar:[80,90,82,72,85,90]},
  {id:'norman_tpn',icon:'📊',name:{ja:'ノーマン',en:'Norman'},series:{ja:'約束のネバーランド',en:'The Promised Neverland'},type:{ja:'計算高い天才の愛 (INTJ)',en:'Calculating Genius Love (INTJ)'},profile:{I:3,T:4,N:4,J:4},desc:{ja:'農園で最高の点数を持つ天才。全ての計算の上に成り立つ戦略で仲間を守る。エマへの深い愛情が行動の根底にある。',en:'A genius with top scores at the farm. Protects comrades with strategy built on all calculations. Deep love for Emma is the foundation of his actions.'},traits:{ja:['天才','計算','愛情','戦略','守護'],en:['Genius','Calculation','Love','Strategy','Protection']},radar:[65,78,58,98,88,60]},
  {id:'senku_stone',icon:'🧪',name:{ja:'石神千空',en:'Senku Ishigami'},series:{ja:'Dr.STONE',en:'Dr. Stone'},type:{ja:'10億パーセント科学者 (INTP)',en:'10 Billion Percent Scientist (INTP)'},profile:{I:4,T:4,N:4,P:3},desc:{ja:'「10億パーセント」が口癖の天才科学者。科学の力で石化した世界を復興させる。どんな状況も科学で解決する圧倒的な知性と行動力。',en:'A genius scientist whose catchphrase is 10 billion percent. Restores a petrified world with the power of science. Overwhelming intellect and drive to solve any situation with science.'},traits:{ja:['科学','天才','10億パーセント','復興','知識'],en:['Science','Genius','10 Billion Percent','Revival','Knowledge']},radar:[60,42,58,98,75,45]},
  {id:'simon_gl',icon:'🔩',name:{ja:'シモン',en:'Simon'},series:{ja:'天元突破グレンラガン',en:'Gurren Lagann'},type:{ja:'天を突く鑚 (INFP)',en:'Heaven-Piercing Drill (INFP)'},profile:{I:3,F:4,N:4,P:3},desc:{ja:'小さな鑚で岩盤を掘り続けた少年が宇宙規模の戦いへ成長する。カミナを失い一度は折れるが、仲間と信念で最強の螺旋王へ。',en:'A boy who kept drilling through rock with a small drill grows into a cosmic-scale battle. Breaks once after losing Kamina but becomes the strongest Spiral King with friends and conviction.'},traits:{ja:['鑚','成長','螺旋','諦めない','友情'],en:['Drill','Growth','Spiral','Never Give Up','Friendship']},radar:[72,75,55,65,78,85]},
  {id:'kamina_gl',icon:'🌟',name:{ja:'カミナ',en:'Kamina'},series:{ja:'天元突破グレンラガン',en:'Gurren Lagann'},type:{ja:'天元突破のカリスマ (ENFP)',en:'Heaven-Piercing Charisma (ENFP)'},profile:{E:4,F:4,N:4,P:4},desc:{ja:'「信じるな、俺を信じるお前を信じろ！」の名言で知られるグレンラガンの精神的柱。圧倒的なカリスマで仲間を鼓舞する伝説の存在。',en:'Known for the quote: Do not believe in me, believe in you who believes in me. The spiritual pillar of Gurren Lagann. A legendary being who inspires allies with overwhelming charisma.'},traits:{ja:['カリスマ','信念','熱血','伝説','鼓舞'],en:['Charismatic','Conviction','Hot-Blooded','Legendary','Inspiring']},radar:[78,85,95,42,78,82]},
  {id:'chiikawa_char',icon:'🐾',name:{ja:'ちいかわ',en:'Chiikawa'},series:{ja:'ちいかわ',en:'Chiikawa'},type:{ja:'なんかかわいいやつ (ISFP)',en:'Something Small and Cute (ISFP)'},profile:{I:3,F:4,S:4,P:3},desc:{ja:'なんか小さくてかわいいやつ。いつも一生懸命で泣き虫だが仲間との絆は深い。日常の小さな幸せを大切にするほのぼのキャラクター。',en:'Something small and cute. Always works hard and is a crybaby but bonds with friends are deep. A heartwarming character who cherishes small everyday happiness.'},traits:{ja:['かわいい','一生懸命','泣き虫','仲間','日常'],en:['Cute','Hardworking','Crybaby','Friends','Everyday']},radar:[42,88,65,38,58,95]},
  {id:'hachiware_char',icon:'🌙',name:{ja:'ハチワレ',en:'Hachiware'},series:{ja:'ちいかわ',en:'Chiikawa'},type:{ja:'お歌が好きな仲間 (ENFP)',en:'Song-Loving Friend (ENFP)'},profile:{E:3,F:4,N:3,P:4},desc:{ja:'ちいかわの親友。お歌と踊りが大好きで明るい性格。ちいかわと一緒に試練を乗り越えながらも前向きに生きるマイペースキャラ。',en:'Chiikawa\'s best friend. Loves songs and dancing with a bright personality. A go-at-own-pace character who lives positively while overcoming trials with Chiikawa.'},traits:{ja:['歌','踊り','明るい','マイペース','友情'],en:['Song','Dance','Bright','Own Pace','Friendship']},radar:[55,78,75,42,55,88]},
  {id:'makoto_ik',icon:'📝',name:{ja:'高代槙生',en:'Makoto Takashiro'},series:{ja:'違国日記',en:'A Stranger\'s Diary'},type:{ja:'無愛想な小説家の優しさ (INTJ)',en:'Unsociable Novelist Kindness (INTJ)'},profile:{I:4,T:4,N:4,J:3},desc:{ja:'不器用で無愛想だが姪の朝を引き取る小説家。感情表現が苦手で人づきあいを避けるが、大切な人への思いやりを密かに持つ大人。',en:'A clumsy unsociable novelist who takes in her niece Asa. Poor at expressing emotions and avoids socializing but secretly holds consideration for precious people.'},traits:{ja:['小説家','無愛想','不器用','優しさ','大人'],en:['Novelist','Unsociable','Clumsy','Kind','Adult']},radar:[38,68,25,82,72,52]},
  {id:'saki_gimai',icon:'📖',name:{ja:'綾瀬沙季',en:'Saki Ayase'},series:{ja:'義妹生活',en:'Gimai Seikatsu'},type:{ja:'義理の妹の自立心 (ISTJ)',en:'Stepsister Independence (ISTJ)'},profile:{I:4,S:4,T:4,J:4},desc:{ja:'義兄への依存を避けようと自立を心がける義理の妹。感情を表に出さず合理的だが、少しずつ心を開いていく成長が魅力。',en:'A stepsister who strives for independence to avoid depending on her stepbrother. Does not show emotions and is rational but her gradual opening up is charming.'},traits:{ja:['自立','義妹','合理的','成長','素直'],en:['Independence','Stepsister','Rational','Growth','Honest']},radar:[45,55,32,82,85,55]},
  {id:'asa_ik',icon:'🌱',name:{ja:'田汲朝',en:'Asa Tamekumi'},series:{ja:'違国日記',en:'A Stranger\'s Diary'},type:{ja:'悲しみの中の成長 (INFP)',en:'Growth in Grief (INFP)'},profile:{I:3,F:4,N:3,P:3},desc:{ja:'両親を事故で亡くし槙生叔母に引き取られた少女。戸惑いながらも新しい生活に適応し、自分の感情と向き合いながら成長する。',en:'A girl who lost her parents in an accident and was taken in by Aunt Makoto. Adapts to new life while bewildered and grows while confronting her own emotions.'},traits:{ja:['悲しみ','成長','適応','自分探し','素直'],en:['Grief','Growth','Adaptation','Self-Discovery','Honest']},radar:[45,82,55,52,58,80]},
  {id:'hana_aono',icon:'🏀',name:{ja:'蜂須賀桃歌',en:'Momoka Hachisuka'},series:{ja:'アオのハコ',en:'Blue Box'},type:{ja:'バスケ女子の強さ (ISFP)',en:'Basketball Girl Strength (ISFP)'},profile:{I:3,S:4,F:4,P:3},desc:{ja:'バスケ部のエースで大喜多海の同居相手。天才的なスポーツ才能を持ちながら素直な感情表現が苦手。海への恋心に気づかない海に変化が生まれる。',en:'Basketball club ace and Taiki housemate. Has genius sports talent but struggles with honest emotional expression. Changes emerge as feelings grow.'},traits:{ja:['バスケ','天才','不器用','同居','成長'],en:['Basketball','Genius','Clumsy','Housemate','Growth']},radar:[78,68,55,62,72,70]},
];

// ══════════════════════════════════════════════════════════════
// i18n 適用 / Apply Translations
// ══════════════════════════════════════════════════════════════
function applyI18n() {
  const t = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (typeof t[key] === 'string') el.textContent = t[key];
  });
  document.getElementById('lang-toggle').textContent = lang === 'ja' ? 'EN' : 'JP';
  document.documentElement.lang = lang;

  // type chips
  const chipsEl = document.getElementById('type-chips');
  if (chipsEl) chipsEl.innerHTML = t.type_chips.map(c => `<span class="type-chip">${c}</span>`).join('');

  // anime sidebar
  const animeEl = document.getElementById('anime-list-sidebar');
  if (animeEl) animeEl.innerHTML = ANIME_LIST.slice(0, 20).map(a => `<li>${a[lang]}</li>`).join('');

  // game tips
  const tipsEl = document.getElementById('game-tips-list');
  if (tipsEl) tipsEl.innerHTML = t.tips_play.map(tip => `<li>${tip}</li>`).join('');

  // genre selects
  ['g-genre','game-filter-genre'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    el.innerHTML = (id === 'game-filter-genre' ? `<option value="">${t.g_all_genre}</option>` : '') +
      t.genres.map(g => `<option value="${g}">${g}</option>`).join('');
    if (cur) el.value = cur;
  });

  // mood select
  const moodEl = document.getElementById('g-mood');
  if (moodEl) {
    const cur = moodEl.value || '4';
    moodEl.innerHTML = t.moods.map(m => `<option value="${m.v}">${m.t}</option>`).join('');
    moodEl.value = cur;
  }

  // placeholders
  const searchEl = document.getElementById('game-search');
  if (searchEl) searchEl.placeholder = t.g_search_ph;
  const noteEl = document.getElementById('g-note');
  if (noteEl) noteEl.placeholder = lang === 'ja' ? '例: ボスクリア！ランク上げ中' : 'e.g. Boss cleared! Ranking up';
  const titleEl = document.getElementById('g-title');
  if (titleEl) titleEl.placeholder = lang === 'ja' ? '例: エルデンリング' : 'e.g. Elden Ring';

  document.title = lang === 'ja'
    ? 'アニメキャラ性格診断 ＋ ゲームプレイ時間記録 | 無料'
    : 'Anime Character Quiz + Game Time Tracker | Free';
}

// ══════════════════════════════════════════════════════════════
// タブ切替 / Tab Switching
// ══════════════════════════════════════════════════════════════
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.main').forEach(m => m.style.display = 'none');
    document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    if (btn.dataset.tab === 'game') renderGameUI();
  });
});

// 言語切替 / Language Toggle
document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('animeToolLang', lang);
  applyI18n();
  if (currentQ > 0 && currentQ < QUESTIONS[lang].length) showQuestion();
  renderGameUI();
});

// ══════════════════════════════════════════════════════════════
// TAB 1: アニメ性格診断 / Anime Character Quiz
// ══════════════════════════════════════════════════════════════
const AXES = ['E','I','T','F','N','S','J','P'];
let scores = {};
let currentQ = 0;
let radarChart = null;

function resetScores() {
  scores = {};
  AXES.forEach(a => scores[a] = 0);
  currentQ = 0;
}

function scoreCharacter(char) {
  return Object.entries(char.profile).reduce((sum, [ax, w]) => sum + (scores[ax] || 0) * w, 0);
}

function findBestMatch() {
  return CHARACTERS.reduce((best, char) => {
    const s = scoreCharacter(char);
    return s > best.score ? { char, score: s } : best;
  }, { char: CHARACTERS[0], score: -Infinity }).char;
}

document.getElementById('start-quiz-btn').addEventListener('click', () => {
  resetScores();
  document.getElementById('quiz-intro').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-area').style.display = 'block';
  showQuestion();
});

function showQuestion() {
  const qs = QUESTIONS[lang];
  const total = qs.length;
  document.getElementById('quiz-progress').style.width = (currentQ / total * 100) + '%';
  document.getElementById('quiz-label').textContent = I18N[lang].q_progress(currentQ + 1, total);
  const q = qs[currentQ];
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-options').innerHTML = q.opts.map((o, i) =>
    `<button class="q-option" data-i="${i}">${o.text}</button>`
  ).join('');
}

document.getElementById('q-options').addEventListener('click', e => {
  const btn = e.target.closest('.q-option');
  if (!btn || btn.disabled) return;
  document.querySelectorAll('.q-option').forEach(b => { b.disabled = true; });
  btn.classList.add('selected');
  const q = QUESTIONS[lang][currentQ];
  const opt = q.opts[+btn.dataset.i];
  Object.entries(opt.axes).forEach(([ax, val]) => { scores[ax] = (scores[ax] || 0) + val; });
  currentQ++;
  setTimeout(() => {
    if (currentQ < QUESTIONS[lang].length) showQuestion();
    else showResult();
  }, 320);
});

const MBTI_NAMES = {
  ja: {
    ENFP:'情熱のムードメーカー',ENTP:'論理的な革命家',ENFJ:'カリスマ型リーダー',ENTJ:'大胆な指揮者',
    INFP:'夢想家の詩人',INTP:'革新的な思索家',INFJ:'洞察力の提唱者',INTJ:'戦略的な建築家',
    ESFP:'自由なエンターテイナー',ESTP:'大胆な実行者',ESFJ:'温かい守り手',ESTJ:'秩序の管理者',
    ISFP:'柔軟な冒険家',ISTP:'万能の職人',ISFJ:'献身的な擁護者',ISTJ:'几帳面な論理家',
  },
  en: {
    ENFP:'Passionate Mood-Maker',ENTP:'Logical Revolutionary',ENFJ:'Charismatic Leader',ENTJ:'Bold Commander',
    INFP:'Dreamy Poet',INTP:'Innovative Thinker',INFJ:'Insightful Advocate',INTJ:'Strategic Architect',
    ESFP:'Free-Spirited Entertainer',ESTP:'Bold Executive',ESFJ:'Warm Guardian',ESTJ:'Order Manager',
    ISFP:'Flexible Adventurer',ISTP:'Versatile Craftsman',ISFJ:'Devoted Protector',ISTJ:'Meticulous Logician',
  },
};

function showResult() {
  document.getElementById('quiz-area').style.display = 'none';
  const best = findBestMatch();
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const matchPct = Math.min(99, Math.round(scoreCharacter(best) / totalScore * 100 + 40));

  document.getElementById('res-icon').textContent       = best.icon;
  document.getElementById('res-type-label').textContent = best.type[lang];
  document.getElementById('res-char-name').textContent  = best.name[lang];
  document.getElementById('res-series').textContent     = best.series[lang];
  document.getElementById('res-match-pct').textContent  = lang === 'ja' ? `マッチ度 ${matchPct}%` : `${matchPct}% Match`;
  document.getElementById('res-desc').textContent       = best.desc[lang];
  document.getElementById('res-traits').innerHTML       = best.traits[lang].map(t => `<span class="trait-tag">${t}</span>`).join('');

  // MBTI タイプ
  const mbti = (scores.E >= scores.I ? 'E' : 'I') +
               (scores.N >= scores.S ? 'N' : 'S') +
               (scores.T >= scores.F ? 'T' : 'F') +
               (scores.J >= scores.P ? 'J' : 'P');
  document.getElementById('res-mbti-card').innerHTML = `
    <div class="mbti-type-letters">${mbti}</div>
    <div class="mbti-type-info">
      <div class="mbti-type-name">${MBTI_NAMES[lang][mbti] || ''}</div>
      <div class="mbti-type-sub">${lang === 'ja' ? 'あなたの性格タイプ' : 'Your Personality Type'}</div>
    </div>`;

  // 性格分布バー
  const axes = [
    { l1: lang==='ja'?'外向性 E':'Extroversion E', l2: lang==='ja'?'内向性 I':'Introversion I', s1: scores.E||0, s2: scores.I||0, color: '#7c3aed' },
    { l1: lang==='ja'?'直感 N':'Intuition N',     l2: lang==='ja'?'現実 S':'Sensing S',        s1: scores.N||0, s2: scores.S||0, color: '#db2777' },
    { l1: lang==='ja'?'思考 T':'Thinking T',      l2: lang==='ja'?'感情 F':'Feeling F',         s1: scores.T||0, s2: scores.F||0, color: '#2563eb' },
    { l1: lang==='ja'?'計画 J':'Judging J',       l2: lang==='ja'?'柔軟 P':'Perceiving P',      s1: scores.J||0, s2: scores.P||0, color: '#16a34a' },
  ];
  document.getElementById('res-breakdown-card').innerHTML =
    `<div class="breakdown-title">${lang==='ja'?'⚡ あなたの性格分布':'⚡ Your Personality Breakdown'}</div>` +
    axes.map(ax => {
      const tot = ax.s1 + ax.s2 || 1;
      const pct1 = Math.round(ax.s1 / tot * 100);
      const dominant = pct1 >= 50;
      const label = dominant ? ax.l1 : ax.l2;
      const pct   = dominant ? pct1 : 100 - pct1;
      return `<div class="breakdown-row">
        <span class="bd-left-lbl">${label}</span>
        <div class="bd-bar-wrap"><div class="bd-bar" style="width:${pct}%;background:${ax.color}"></div></div>
        <span class="bd-pct" style="color:${ax.color}">${pct}%</span>
      </div>`;
    }).join('');

  if (radarChart) radarChart.destroy();
  radarChart = new Chart(document.getElementById('chart-radar'), {
    type: 'radar',
    data: {
      labels: I18N[lang].radar_labels,
      datasets: [{
        label: best.name[lang],
        data: best.radar,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,.2)',
        pointBackgroundColor: '#7c3aed',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: false,
      scales: { r: { min: 0, max: 100, ticks: { display: false } } },
      plugins: { legend: { display: false } }
    }
  });

  const ranked = CHARACTERS
    .filter(c => c.id !== best.id)
    .map(c => ({ c, s: scoreCharacter(c) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);
  document.getElementById('sim-list').innerHTML = ranked.map(({ c }) => `
    <div class="sim-char">
      <div>${c.icon} <span class="sim-char-name">${c.name[lang]}</span></div>
      <div class="sim-char-series">${c.series[lang]}</div>
    </div>
  `).join('');

  document.getElementById('quiz-result').style.display = 'block';
  document.getElementById('quiz-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  recordDiagnosis(best, mbti, matchPct);
  renderQuizHistory();
  renderPopularity();

  // X(Twitter)シェア
  document.getElementById('share-twitter').onclick = () => {
    const txt = lang === 'ja'
      ? `私のアニメキャラ診断結果は「${best.name.ja}（${best.series.ja}）」でした！✨ MBTIタイプ: ${mbti} / マッチ度: ${matchPct}%\nあなたは誰と診断される？ #アニメキャラ診断 #MBTI`
      : `My anime character quiz result is "${best.name.en} (${best.series.en})"! Type: ${mbti} / Match: ${matchPct}% ✨ Who are you? #AnimeCharacterQuiz #MBTI`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(txt) + '&url=' + encodeURIComponent(location.href), '_blank');
  };

  // LINEシェア
  document.getElementById('share-line').onclick = () => {
    const txt = lang === 'ja'
      ? `アニメキャラ診断で「${best.name.ja}」と判定されました！タイプ: ${mbti} / ${matchPct}% #アニメキャラ診断`
      : `I got "${best.name.en}" in the anime character quiz! Type: ${mbti} / ${matchPct}%`;
    window.open('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(txt), '_blank');
  };

  // URLコピー
  const copyBtn = document.getElementById('share-copy');
  const copyLabel = lang === 'ja' ? '🔗 URLをコピー' : '🔗 Copy URL';
  copyBtn.textContent = copyLabel;
  copyBtn.classList.remove('copied');
  copyBtn.onclick = () => {
    const copyDone = () => {
      copyBtn.textContent = lang === 'ja' ? '✅ コピーしました！' : '✅ Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => { copyBtn.textContent = copyLabel; copyBtn.classList.remove('copied'); }, 2000);
    };
    navigator.clipboard
      ? navigator.clipboard.writeText(location.href).then(copyDone)
      : (() => {
          const ta = Object.assign(document.createElement('textarea'), { value: location.href });
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta); copyDone();
        })();
  };
}

document.getElementById('retry-btn').addEventListener('click', () => {
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-intro').style.display = 'block';
});

// ══════════════════════════════════════════════════════════════
// TAB 2: ゲームプレイ時間記録 / Game Time Tracker
// ══════════════════════════════════════════════════════════════
const GAME_KEY = 'game_records_v1';
let gameLineChart = null, gamePieChart = null, gameGenreChart = null;
const GENRE_COLORS = {
  RPG:'#7c3aed',Action:'#ea580c',アクション:'#ea580c','FPS/TPS':'#dc2626',
  Simulation:'#2563eb',シミュレーション:'#2563eb',Fighting:'#db2777',格闘:'#db2777',
  Racing:'#ca8a04',レーシング:'#ca8a04',Puzzle:'#16a34a',パズル:'#16a34a',
  Sports:'#0891b2',スポーツ:'#0891b2','Visual Novel':'#9333ea','ADV/ノベル':'#9333ea',
  Other:'#64748b',その他:'#64748b',
};

document.getElementById('g-date').valueAsDate = new Date();

function loadGameRecords() {
  try { return JSON.parse(localStorage.getItem(GAME_KEY) || '[]'); } catch { return []; }
}
function saveGameRecords(recs) { localStorage.setItem(GAME_KEY, JSON.stringify(recs)); }

function updateDatalist() {
  const titles = [...new Set(loadGameRecords().map(r => r.title))];
  document.getElementById('game-datalist').innerHTML = titles.map(t => `<option value="${t}">`).join('');
}

document.getElementById('game-add-btn').addEventListener('click', () => {
  const date  = document.getElementById('g-date').value;
  const title = document.getElementById('g-title').value.trim();
  const hours = +document.getElementById('g-hours').value;
  const genre = document.getElementById('g-genre').value;
  const mood  = +document.getElementById('g-mood').value;
  const note  = document.getElementById('g-note').value.trim();
  if (!date || !title) { alert(lang === 'ja' ? '日付とゲームタイトルを入力してください' : 'Please enter date and game title.'); return; }
  if (hours <= 0) { alert(lang === 'ja' ? 'プレイ時間を入力してください' : 'Please enter play time.'); return; }
  const recs = loadGameRecords();
  recs.push({ date, title, hours, genre, mood, note, id: Date.now() });
  recs.sort((a, b) => a.date < b.date ? -1 : 1);
  saveGameRecords(recs);
  updateDatalist();
  renderGameUI();
  document.getElementById('game-stats').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('g-title').value = '';
  document.getElementById('g-note').value = '';
  document.getElementById('g-hours').value = '2';
});

function renderGameUI() {
  const t = I18N[lang];
  const recs = loadGameRecords();
  if (!recs.length) {
    document.getElementById('game-stats').style.display = 'none';
    document.getElementById('game-log-section').style.display = 'none';
    return;
  }
  const totalH = recs.reduce((s, r) => s + r.hours, 0);
  const titleMap = {};
  recs.forEach(r => { titleMap[r.title] = (titleMap[r.title] || 0) + r.hours; });
  const topTitle = Object.entries(titleMap).sort((a, b) => b[1] - a[1])[0];
  const days = [...new Set(recs.map(r => r.date))].length;
  document.getElementById('gk-total').textContent = totalH.toFixed(1) + 'h';
  document.getElementById('gk-top').textContent   = topTitle ? topTitle[0].slice(0, 8) : '—';
  document.getElementById('gk-days').textContent  = days + (lang === 'ja' ? '日' : 'd');
  document.getElementById('gk-avg').textContent   = (totalH / days).toFixed(1) + 'h';

  const dayMap = {};
  recs.forEach(r => { dayMap[r.date] = (dayMap[r.date] || 0) + r.hours; });
  const sortedDays = Object.keys(dayMap).sort().slice(-30);
  if (gameLineChart) gameLineChart.destroy();
  gameLineChart = new Chart(document.getElementById('chart-game-line'), {
    type: 'bar',
    data: { labels: sortedDays.map(d => d.slice(5)), datasets: [{ label: t.chart_daily, data: sortedDays.map(d => dayMap[d]), backgroundColor: 'rgba(124,58,237,.5)', borderColor: '#7c3aed', borderWidth: 1 }] },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { min: 0 } } }
  });

  const topGames = Object.entries(titleMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
  if (gamePieChart) gamePieChart.destroy();
  gamePieChart = new Chart(document.getElementById('chart-game-pie'), {
    type: 'doughnut',
    data: { labels: topGames.map(([gt]) => gt.slice(0, 10)), datasets: [{ data: topGames.map(([, h]) => h), backgroundColor: ['#7c3aed','#db2777','#2563eb','#ea580c','#16a34a','#ca8a04','#64748b'] }] },
    options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, title: { display: true, text: t.chart_by_game } } }
  });

  const genreMap = {};
  recs.forEach(r => { genreMap[r.genre] = (genreMap[r.genre] || 0) + r.hours; });
  const ge = Object.entries(genreMap).sort((a, b) => b[1] - a[1]);
  if (gameGenreChart) gameGenreChart.destroy();
  gameGenreChart = new Chart(document.getElementById('chart-game-genre'), {
    type: 'bar',
    data: { labels: ge.map(([g]) => g), datasets: [{ label: 'h', data: ge.map(([, h]) => h), backgroundColor: ge.map(([g]) => GENRE_COLORS[g] || '#7c3aed') }] },
    options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false }, title: { display: true, text: t.chart_by_genre } } }
  });

  renderGameLog();
  document.getElementById('game-stats').style.display = 'block';
  document.getElementById('game-log-section').style.display = 'block';
}

function renderGameLog() {
  const t = I18N[lang];
  const recs = loadGameRecords();
  const search = document.getElementById('game-search').value.trim().toLowerCase();
  const genre  = document.getElementById('game-filter-genre').value;
  const filtered = [...recs].reverse().filter(r =>
    (!search || r.title.toLowerCase().includes(search)) && (!genre || r.genre === genre)
  ).slice(0, 50);
  document.getElementById('game-log').innerHTML = filtered.map(r => `
    <div class="game-log-item">
      <span class="game-log-date">${r.date}</span>
      <span class="game-log-title">${r.title}</span>
      <span class="game-log-hours">${r.hours}h</span>
      <span class="game-log-genre">${r.genre}</span>
      <span class="game-log-mood">${t.mood_map[r.mood] || ''}</span>
      <button class="game-log-del" data-id="${r.id}">×</button>
    </div>
  `).join('') || `<div style="text-align:center;color:#94a3b8;padding:20px">${t.no_record}</div>`;
}

document.getElementById('game-log').addEventListener('click', e => {
  if (!e.target.classList.contains('game-log-del')) return;
  if (!confirm(I18N[lang].del_confirm)) return;
  saveGameRecords(loadGameRecords().filter(r => r.id !== +e.target.dataset.id));
  renderGameUI();
});
document.getElementById('game-search').addEventListener('input', renderGameLog);
document.getElementById('game-filter-genre').addEventListener('change', renderGameLog);
document.getElementById('game-clear-btn').addEventListener('click', () => {
  if (!confirm(I18N[lang].clear_confirm)) return;
  localStorage.removeItem(GAME_KEY);
  document.getElementById('game-stats').style.display = 'none';
  document.getElementById('game-log-section').style.display = 'none';
});

// ══════════════════════════════════════════════════════════════
// 診断履歴 & 人気ランキング / History & Popularity
// ══════════════════════════════════════════════════════════════
const HISTORY_KEY = 'anime_quiz_history_v2';
const POP_KEY = 'anime_quiz_pop_v2';

const BASE_POP = {
  'naruto':2341,'levi_aot':2188,'gojo_jjk':2054,'luffy':1923,'zoro':1876,
  'tanjiro':1754,'all_might':1632,'light_yagami':1587,'L_dn':1534,'eren_aot':1498,
  'nezuko':1412,'marin_sono':1356,'mikasa_aot':1323,'saitama':1298,'gintoki_gintama':1245,
};

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch(e) { return []; }
}
function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 10))); }
function loadPop() {
  try { return JSON.parse(localStorage.getItem(POP_KEY) || '{}'); } catch(e) { return {}; }
}
function savePop(p) { localStorage.setItem(POP_KEY, JSON.stringify(p)); }

function recordDiagnosis(char, mbti, matchPct) {
  const history = loadHistory();
  const today = new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
  history.unshift({ id: char.id, icon: char.icon, nameJa: char.name.ja, seriesJa: char.series.ja, mbti, matchPct, date: today });
  saveHistory(history);
  const pop = loadPop();
  pop[char.id] = (pop[char.id] || 0) + 1;
  savePop(pop);
}

function renderQuizHistory() {
  const history = loadHistory();
  const wrap = document.getElementById('quiz-history-wrap');
  const list = document.getElementById('quiz-history-list');
  if (!wrap || !list) return;
  if (!history.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  list.innerHTML = history.slice(0, 5).map(h => `
    <div class="history-item">
      <span class="h-icon">${h.icon}</span>
      <div class="h-body">
        <div class="h-name">${h.nameJa}</div>
        <div class="h-meta">${h.seriesJa} · ${h.mbti} · マッチ度${h.matchPct}%</div>
      </div>
      <span class="h-date">${h.date}</span>
    </div>
  `).join('');
}

function renderPopularity() {
  const myPop = loadPop();
  const list = document.getElementById('popularity-list');
  if (!list) return;
  const merged = Object.assign({}, BASE_POP);
  Object.entries(myPop).forEach(([id, cnt]) => {
    merged[id] = (merged[id] || 0) + cnt * 8;
  });
  const sorted = Object.entries(merged)
    .map(([id, cnt]) => ({ char: CHARACTERS.find(c => c.id === id), cnt }))
    .filter(x => x.char)
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 8);
  if (!sorted.length) { list.innerHTML = '<div style="font-size:12px;color:#94a3b8;padding:8px">データを集計中...</div>'; return; }
  list.innerHTML = sorted.map((item, i) => `
    <div class="pop-item">
      <span class="pop-rank">${i + 1}</span>
      <span class="pop-icon">${item.char.icon}</span>
      <div class="pop-body">
        <div class="pop-name">${item.char.name.ja}</div>
        <div class="pop-series">${item.char.series.ja}</div>
      </div>
      <div class="pop-bar-wrap"><div class="pop-bar" style="width:${Math.round(item.cnt / sorted[0].cnt * 100)}%"></div></div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════
// 初期化 / Init
// ══════════════════════════════════════════════════════════════
applyI18n();
updateDatalist();
renderGameUI();
renderQuizHistory();
renderPopularity();
