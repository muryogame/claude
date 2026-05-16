'use strict';

// ── タブ切替 ─────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.main').forEach(m => m.style.display = 'none');
    document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    if (btn.dataset.tab === 'sleep') renderSleepUI();
  });
});

// ═══════════════════════════════════════════════════════════════
// TAB 1: 処方薬 飲み合わせチェッカー
// ═══════════════════════════════════════════════════════════════

// 薬データベース（一般名/商品名 → カテゴリ・成分）
const DRUG_DB = [
  { names: ['ワーファリン','ワルファリン','warfarin'], cat: 'anticoag', label: 'ワーファリン（抗凝固薬）' },
  { names: ['アスピリン','バファリン','aspirin'], cat: 'nsaid_salicylate', label: 'アスピリン（NSAIDs/サリチル酸）' },
  { names: ['イブプロフェン','ブルフェン','ibuprofen'], cat: 'nsaid', label: 'イブプロフェン（NSAIDs）' },
  { names: ['ロキソプロフェン','ロキソニン','loxoprofen'], cat: 'nsaid', label: 'ロキソプロフェン（NSAIDs）' },
  { names: ['ジクロフェナク','voltaren','ボルタレン'], cat: 'nsaid', label: 'ジクロフェナク（NSAIDs）' },
  { names: ['カルシウム拮抗薬','アムロジピン','ノルバスク','ニフェジピン','アダラート'], cat: 'ccb', label: '降圧薬（カルシウム拮抗薬）' },
  { names: ['ace阻害薬','エナラプリル','レニベース','ペリンドプリル'], cat: 'ace', label: 'ACE阻害薬（降圧薬）' },
  { names: ['スタチン','アトルバスタチン','リピトール','ロスバスタチン','クレストール'], cat: 'statin', label: 'スタチン（脂質異常症薬）' },
  { names: ['睡眠薬','ゾルピデム','マイスリー','エスゾピクロン','ルネスタ','トリアゾラム','ハルシオン'], cat: 'hypnotic', label: '睡眠薬（ベンゾ系/非ベンゾ系）' },
  { names: ['抗生物質','テトラサイクリン','ミノサイクリン','ミノマイシン'], cat: 'tetracycline', label: 'テトラサイクリン系抗生物質' },
  { names: ['抗生物質','キノロン','レボフロキサシン','クラビット','シプロフロキサシン'], cat: 'quinolone', label: 'キノロン系抗生物質' },
  { names: ['SSRIうつ薬','パロキセチン','パキシル','フルボキサミン','ルボックス','エスシタロプラム','レクサプロ'], cat: 'ssri', label: 'SSRI（抗うつ薬）' },
  { names: ['アルコール','お酒','飲酒','alcohol'], cat: 'alcohol', label: 'アルコール（飲酒）' },
  { names: ['グレープフルーツ','グレープフルーツジュース'], cat: 'grapefruit', label: 'グレープフルーツ' },
  { names: ['牛乳','乳製品','ミルク'], cat: 'dairy', label: '牛乳・乳製品' },
  { names: ['カフェイン','コーヒー','緑茶'], cat: 'caffeine', label: 'カフェイン（コーヒー・緑茶）' },
  { names: ['メトトレキサート','リウマトレックス'], cat: 'mtx', label: 'メトトレキサート（抗リウマチ薬）' },
  { names: ['リチウム','炭酸リチウム','リーマス'], cat: 'lithium', label: 'リチウム（気分安定薬）' },
  { names: ['フェニトイン','ジフェニルヒダントイン','アレビアチン'], cat: 'phenytoin', label: 'フェニトイン（抗てんかん薬）' },
  { names: ['糖尿病薬','メトホルミン','メトグルコ','グリベンクラミド','オイグルコン'], cat: 'antidiabetic', label: '糖尿病薬' },
];

// 相互作用データベース
const INTERACTIONS = [
  { cats: ['anticoag','nsaid_salicylate'], level: 'danger', title: '出血リスクが大幅増加', desc: 'ワーファリン＋アスピリンは血液を固まりにくくする作用が重複し、重篤な出血を引き起こす可能性があります。必ず医師に相談してください。' },
  { cats: ['anticoag','nsaid'],            level: 'danger', title: 'NSAIDsが抗凝固作用を増強', desc: 'ワーファリンとNSAIDsの併用は出血リスクを高めます。代替の鎮痛薬（アセトアミノフェン等）を検討してください。' },
  { cats: ['anticoag','ssri'],             level: 'warn',   title: '出血リスクが増加', desc: 'SSRIは血小板機能に影響し、抗凝固薬との併用で出血しやすくなります。定期的な血液検査が必要です。' },
  { cats: ['nsaid_salicylate','nsaid'],    level: 'danger', title: '同種NSAIDsの重複', desc: 'アスピリンとイブプロフェン等の併用は胃腸障害・腎障害リスクが増大します。1種類のNSAIDsのみ使用してください。' },
  { cats: ['nsaid','nsaid'],               level: 'danger', title: 'NSAIDs重複投与', desc: '同系統の鎮痛薬の重複は副作用が倍増します。必ず1種類に絞ってください。' },
  { cats: ['ccb','grapefruit'],            level: 'danger', title: 'グレープフルーツが薬効を増強', desc: 'グレープフルーツ（ジュース）はカルシウム拮抗薬の血中濃度を2〜3倍に上昇させます。服薬中は避けてください。' },
  { cats: ['statin','grapefruit'],         level: 'danger', title: 'スタチン血中濃度が上昇', desc: 'グレープフルーツはスタチンの代謝を阻害し、筋肉障害（横紋筋融解症）リスクが高まります。' },
  { cats: ['hypnotic','alcohol'],          level: 'danger', title: '中枢神経抑制が増強（危険）', desc: '睡眠薬とアルコールの併用は呼吸抑制を引き起こす危険があります。絶対に避けてください。' },
  { cats: ['ssri','alcohol'],              level: 'warn',   title: '鎮静・判断力低下', desc: 'SSRIとアルコールの併用は鎮静効果が増し、事故リスクが高まります。飲酒は控えめに。' },
  { cats: ['tetracycline','dairy'],        level: 'danger', title: '薬の吸収が大幅低下', desc: 'テトラサイクリン系抗生物質は牛乳・乳製品と同時摂取すると吸収率が80%低下します。服薬2時間前後は乳製品を避けてください。' },
  { cats: ['quinolone','dairy'],           level: 'warn',   title: '薬の吸収が低下', desc: 'キノロン系抗生物質と乳製品の同時摂取は吸収を妨げます。30分以上間隔をあけてください。' },
  { cats: ['mtx','nsaid'],                 level: 'danger', title: 'メトトレキサート中毒リスク', desc: 'NSAIDsはメトトレキサートの排泄を阻害し、血中濃度が急上昇します。併用は必ず医師の管理下で。' },
  { cats: ['lithium','nsaid'],             level: 'warn',   title: 'リチウム濃度が上昇', desc: 'NSAIDsはリチウムの排泄を阻害し、中毒症状（振戦・意識障害）を引き起こす可能性があります。' },
  { cats: ['anticoag','caffeine'],         level: 'info',   title: 'カフェインの影響は少量なら軽微', desc: '大量のカフェインは抗凝固薬の効果に影響する場合があります。過度な摂取は控えましょう。' },
  { cats: ['hypnotic','caffeine'],         level: 'warn',   title: '睡眠薬の効果が減弱', desc: 'カフェインは睡眠薬の効果を打ち消します。就寝前のコーヒー・緑茶は控えてください。' },
  { cats: ['ssri','nsaid_salicylate'],     level: 'warn',   title: '消化管出血リスク増加', desc: 'SSRIとアスピリンの併用は胃腸出血リスクを高めます。胃薬との併用も検討してください。' },
  { cats: ['antidiabetic','alcohol'],      level: 'warn',   title: '低血糖リスク増加', desc: 'アルコールは血糖値を下げる作用があり、糖尿病薬との併用で重症低血糖を引き起こす可能性があります。' },
  { cats: ['phenytoin','caffeine'],        level: 'info',   title: 'フェニトインの代謝に影響', desc: 'カフェインはフェニトインの吸収や代謝に影響する場合があります。定期的な血中濃度確認を。' },
  { cats: ['ace','nsaid'],                 level: 'warn',   title: '降圧効果の低下＋腎障害リスク', desc: 'NSAIDsはACE阻害薬の降圧効果を弱め、腎機能に悪影響を及ぼす可能性があります。' },
];

let drugList = [];

// 薬名マッチング
function findDrug(input) {
  const q = input.trim().toLowerCase();
  return DRUG_DB.find(d => d.names.some(n => n.toLowerCase().includes(q) || q.includes(n.toLowerCase())));
}

// サジェスト表示
const drugInput = document.getElementById('drug-input');
const suggestEl = document.getElementById('drug-suggestions');

drugInput.addEventListener('input', () => {
  const q = drugInput.value.trim().toLowerCase();
  if (q.length < 1) { suggestEl.style.display = 'none'; return; }
  const matches = DRUG_DB.filter(d => d.names.some(n => n.toLowerCase().includes(q))).slice(0, 5);
  if (!matches.length) { suggestEl.style.display = 'none'; return; }
  suggestEl.innerHTML = matches.map(d => `<div class="drug-sug-item" data-label="${d.label}" data-cat="${d.cat}">${d.label}</div>`).join('');
  suggestEl.style.display = 'block';
});
suggestEl.addEventListener('click', e => {
  const item = e.target.closest('.drug-sug-item');
  if (!item) return;
  addDrug({ label: item.dataset.label, cat: item.dataset.cat });
  drugInput.value = '';
  suggestEl.style.display = 'none';
});
document.addEventListener('click', e => { if (!e.target.closest('.drug-input-row') && !e.target.closest('.drug-suggestions')) suggestEl.style.display = 'none'; });

// 追加ボタン
document.getElementById('drug-add-btn').addEventListener('click', () => {
  const val = drugInput.value.trim();
  if (!val) return;
  const found = findDrug(val);
  if (found) {
    addDrug({ label: found.label, cat: found.cat });
  } else {
    addDrug({ label: val + '（不明な薬）', cat: 'unknown' });
  }
  drugInput.value = '';
  suggestEl.style.display = 'none';
});
drugInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('drug-add-btn').click(); });

function addDrug(drug) {
  if (drugList.some(d => d.cat === drug.cat && drug.cat !== 'unknown')) {
    alert(`「${drug.label}」は既に追加済みです`); return;
  }
  drugList.push(drug);
  renderDrugList();
  document.getElementById('drug-result').style.display = 'none';
}

function renderDrugList() {
  const el = document.getElementById('drug-list');
  if (!drugList.length) {
    el.innerHTML = '<div class="drug-empty">薬を追加するとここに表示されます</div>';
    return;
  }
  el.innerHTML = drugList.map((d, i) => `
    <div class="drug-tag">
      <span class="drug-tag-name">💊 ${d.label}</span>
      <button class="drug-tag-del" data-i="${i}" title="削除">×</button>
    </div>
  `).join('');
}
document.getElementById('drug-list').addEventListener('click', e => {
  if (!e.target.classList.contains('drug-tag-del')) return;
  drugList.splice(+e.target.dataset.i, 1);
  renderDrugList();
  document.getElementById('drug-result').style.display = 'none';
});

// クイックペア
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    drugList = [];
    const names = btn.dataset.drugs.split(',');
    names.forEach(name => {
      const found = findDrug(name.trim());
      drugList.push(found ? { label: found.label, cat: found.cat } : { label: name.trim(), cat: 'unknown' });
    });
    renderDrugList();
    document.getElementById('drug-check-btn').click();
  });
});

// チェック実行
document.getElementById('drug-check-btn').addEventListener('click', () => {
  if (!drugList.length) { alert('薬を1つ以上追加してください'); return; }

  const alerts = [];
  const cats = drugList.map(d => d.cat);

  // 全ペアをチェック
  for (let i = 0; i < drugList.length; i++) {
    for (let j = i + 1; j < drugList.length; j++) {
      const catPair = [cats[i], cats[j]];
      const matched = INTERACTIONS.filter(intr =>
        (intr.cats[0] === catPair[0] && intr.cats[1] === catPair[1]) ||
        (intr.cats[0] === catPair[1] && intr.cats[1] === catPair[0]) ||
        // 同カテゴリ(nsaid同士など)
        (intr.cats[0] === intr.cats[1] && intr.cats[0] === catPair[0] && catPair[0] === catPair[1])
      );
      matched.forEach(m => {
        if (!alerts.some(a => a.title === m.title)) {
          alerts.push({ ...m, drugs: `${drugList[i].label} ＋ ${drugList[j].label}` });
        }
      });
    }
  }

  const alertEl = document.getElementById('drug-alerts');
  const safeEl  = document.getElementById('drug-safe-box');

  if (!alerts.length) {
    alertEl.innerHTML = '';
    safeEl.style.display = 'flex';
  } else {
    safeEl.style.display = 'none';
    const iconMap = { danger: '🚨', warn: '⚠️', info: 'ℹ️' };
    alertEl.innerHTML = alerts.map(a => `
      <div class="drug-alert ${a.level}">
        <div class="alert-icon">${iconMap[a.level]}</div>
        <div class="alert-body">
          <h4>${a.title}</h4>
          <p><strong>${a.drugs}</strong></p>
          <p>${a.desc}</p>
        </div>
      </div>
    `).join('');
  }

  document.getElementById('drug-result').style.display = 'block';
  document.getElementById('drug-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ═══════════════════════════════════════════════════════════════
// TAB 2: 睡眠スコア記録
// ═══════════════════════════════════════════════════════════════

const SLEEP_KEY = 'sleep_records_v1';
let sleepChart = null;

// 初期値: 今日
document.getElementById('s-date').valueAsDate = new Date();

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(SLEEP_KEY) || '[]'); }
  catch { return []; }
}
function saveRecords(recs) {
  localStorage.setItem(SLEEP_KEY, JSON.stringify(recs));
}

function calcDuration(bed, wake) {
  if (!bed || !wake) return null;
  const [bh, bm] = bed.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60; // 日をまたぐ
  return mins / 60;
}

document.getElementById('sleep-add-btn').addEventListener('click', () => {
  const date  = document.getElementById('s-date').value;
  const bed   = document.getElementById('s-bed').value;
  const wake  = document.getElementById('s-wake').value;
  const score = +document.getElementById('s-score').value;
  const onset = +document.getElementById('s-onset').value;
  const ref   = +document.getElementById('s-refresh').value;
  const note  = document.getElementById('s-note').value.trim();

  if (!date) { alert('日付を入力してください'); return; }

  const recs = loadRecords();
  // 同日付があれば上書き
  const idx = recs.findIndex(r => r.date === date);
  const rec = { date, bed, wake, score, onset, ref, note, duration: calcDuration(bed, wake) };
  if (idx >= 0) recs[idx] = rec; else recs.push(rec);
  recs.sort((a, b) => a.date < b.date ? -1 : 1);
  saveRecords(recs);
  renderSleepUI();
  document.getElementById('sleep-stats').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

function renderSleepUI() {
  const recs = loadRecords();
  if (!recs.length) {
    document.getElementById('sleep-stats').style.display = 'none';
    document.getElementById('sleep-log-section').style.display = 'none';
    return;
  }

  // KPI
  const durations = recs.map(r => r.duration).filter(Boolean);
  const scores    = recs.map(r => r.score).filter(n => n > 0);
  document.getElementById('k-duration').textContent = durations.length ? (durations.reduce((a,b)=>a+b,0)/durations.length).toFixed(1) + 'h' : '—';
  document.getElementById('k-score').textContent    = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : '—';
  document.getElementById('k-days').textContent     = recs.length + '日';
  document.getElementById('k-best').textContent     = scores.length ? Math.max(...scores) : '—';

  // グラフ（最新30日）
  const recent = recs.slice(-30);
  const labels = recent.map(r => r.date.slice(5)); // MM-DD
  const scoreData = recent.map(r => r.score || null);
  const durData   = recent.map(r => r.duration != null ? +r.duration.toFixed(1) : null);

  if (sleepChart) sleepChart.destroy();
  sleepChart = new Chart(document.getElementById('chart-sleep'), {
    data: {
      labels,
      datasets: [
        { type: 'bar',  label: '睡眠スコア', data: scoreData, backgroundColor: 'rgba(22,163,74,.45)', yAxisID: 'y' },
        { type: 'line', label: '睡眠時間(h)', data: durData, borderColor: '#2563eb', backgroundColor: 'transparent', tension: .3, yAxisID: 'y2', pointRadius: 3 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y:  { min: 0, max: 100, position: 'left',  title: { display: true, text: 'スコア' } },
        y2: { min: 0, max: 12,  position: 'right', title: { display: true, text: '時間(h)' }, grid: { drawOnChartArea: false } }
      }
    }
  });

  // ログ一覧
  const logEl = document.getElementById('sleep-log');
  const scoreClass = s => s >= 80 ? 'high' : s >= 60 ? 'mid' : 'low';
  logEl.innerHTML = [...recs].reverse().slice(0, 30).map((r, i) => `
    <div class="sleep-log-item">
      <span class="sleep-date">${r.date}</span>
      <span>${r.bed || '—'} → ${r.wake || '—'} ${r.duration != null ? '(' + r.duration.toFixed(1) + 'h)' : ''}</span>
      <span class="sleep-score ${scoreClass(r.score)}">スコア${r.score || '—'}</span>
      <span style="font-size:12px;color:var(--text-sub)">${r.note || ''}</span>
      <button class="sleep-log-del" data-date="${r.date}" title="削除">×</button>
    </div>
  `).join('');

  document.getElementById('sleep-stats').style.display = 'block';
  document.getElementById('sleep-log-section').style.display = 'block';
  renderSleepStreak(recs);
}

document.getElementById('sleep-log').addEventListener('click', e => {
  if (!e.target.classList.contains('sleep-log-del')) return;
  const date = e.target.dataset.date;
  if (!confirm(`${date} の記録を削除しますか？`)) return;
  const recs = loadRecords().filter(r => r.date !== date);
  saveRecords(recs);
  renderSleepUI();
});

document.getElementById('sleep-clear-btn').addEventListener('click', () => {
  if (!confirm('全ての睡眠記録を削除しますか？')) return;
  localStorage.removeItem(SLEEP_KEY);
  renderSleepUI();
});

// ── 睡眠ストリーク ────────────────────────────────────────────────
function calcSleepStreak(records) {
  if (!records.length) return 0;
  const dates = [...new Set(records.map(r => r.date))].sort().reverse();
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    const diff = Math.round((today - d) / 86400000);
    if (diff === i || diff === i + 1) streak++;
    else break;
  }
  return streak;
}

function renderSleepStreak(records) {
  const streak = calcSleepStreak(records);
  const card = document.getElementById('sleep-streak-card');
  if (!card) return;
  if (streak < 2) { card.style.display = 'none'; return; }
  card.style.display = 'block';
  document.getElementById('streak-count').textContent = streak;
  const msgs = streak >= 30 ? '🏆 驚異の継続力！' : streak >= 14 ? '🌟 素晴らしい！' : streak >= 7 ? '💪 いい習慣！' : '👍 継続は力なり！';
  document.getElementById('streak-msg').textContent = msgs;
}

// 初期読み込み
renderSleepUI();

// ══════════════════════════════════════════════════════════════
// TAB 3: BMI・体重管理
// ══════════════════════════════════════════════════════════════
const BMI_KEY = 'weight_records_v1';
let weightChart = null;

document.getElementById('bmi-date').valueAsDate = new Date();

function loadWeightRecs() {
  try { return JSON.parse(localStorage.getItem(BMI_KEY) || '[]'); } catch { return []; }
}
function saveWeightRecs(r) { localStorage.setItem(BMI_KEY, JSON.stringify(r)); }

function calcBMI(height, weight) { return weight / Math.pow(height / 100, 2); }
function bmiClass(bmi) {
  if (bmi < 18.5) return { label: '低体重（やせ）', color: '#3b82f6' };
  if (bmi < 25)   return { label: '普通体重',         color: '#16a34a' };
  if (bmi < 30)   return { label: '過体重（肥満1度）', color: '#f59e0b' };
  if (bmi < 35)   return { label: '肥満（2度）',      color: '#ef4444' };
  return                  { label: '高度肥満（3度以上）', color: '#7f1d1d' };
}
function idealWeight(height) { return 22 * Math.pow(height / 100, 2); }

document.getElementById('bmi-calc-btn').addEventListener('click', () => {
  const height = +document.getElementById('bmi-height').value;
  const weight = +document.getElementById('bmi-weight').value;
  const date   = document.getElementById('bmi-date').value;
  const note   = document.getElementById('bmi-note').value.trim();

  if (!height || !weight || !date) { alert('身長・体重・日付を入力してください'); return; }

  const bmi = calcBMI(height, weight);
  const cls = bmiClass(bmi);
  const ideal = idealWeight(height);
  const diff = weight - ideal;

  // 結果表示
  document.getElementById('bmi-value').textContent = bmi.toFixed(1);
  document.getElementById('bmi-value').style.color = cls.color;
  document.getElementById('bmi-class').textContent = cls.label;
  document.getElementById('bmi-class').style.color = cls.color;
  document.getElementById('bmi-ideal').textContent =
    `適正体重: ${ideal.toFixed(1)}kg（現在 ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}kg）`;

  // マーカー位置（BMI 15〜40 の範囲で計算）
  const markerPct = Math.max(0, Math.min(100, (bmi - 15) / (40 - 15) * 100));
  document.getElementById('bmi-marker').style.left = markerPct + '%';
  document.getElementById('bmi-result').style.display = 'block';

  // BMIシェアボタン
  const shareRow = document.getElementById('bmi-share-row');
  shareRow.style.display = 'flex';
  const bmiTxt = `⚖️ BMI計算しました！\nBMI: ${bmi.toFixed(1)}（${cls.label}）\n適正体重: ${ideal.toFixed(1)}kg\nあなたのBMIは？ #BMI計算 #健康管理`;
  const bmiUrl = location.href;
  document.getElementById('bmi-share-x').onclick = () => {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(bmiTxt) + '&url=' + encodeURIComponent(bmiUrl), '_blank');
  };
  document.getElementById('bmi-share-line').onclick = () => {
    window.open('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(bmiUrl) + '&text=' + encodeURIComponent(`BMI: ${bmi.toFixed(1)}（${cls.label}）あなたは？`), '_blank');
  };
  const copyBtnBmi = document.getElementById('bmi-share-copy');
  copyBtnBmi.onclick = () => {
    const done = () => {
      copyBtnBmi.textContent = '✅ コピーしました！';
      copyBtnBmi.classList.add('copied');
      setTimeout(() => { copyBtnBmi.textContent = '🔗 URLをコピー'; copyBtnBmi.classList.remove('copied'); }, 2000);
    };
    navigator.clipboard ? navigator.clipboard.writeText(bmiUrl).then(done)
      : (() => { const ta = Object.assign(document.createElement('textarea'), {value: bmiUrl}); document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done(); })();
  };

  // 記録保存
  const recs = loadWeightRecs();
  const idx = recs.findIndex(r => r.date === date);
  const rec = { date, height, weight, bmi: +bmi.toFixed(1), note };
  if (idx >= 0) recs[idx] = rec; else recs.push(rec);
  recs.sort((a, b) => a.date < b.date ? -1 : 1);
  saveWeightRecs(recs);
  renderWeightHistory();
});

function renderWeightHistory() {
  const recs = loadWeightRecs();
  if (!recs.length) { document.getElementById('bmi-history-wrap').style.display = 'none'; return; }

  document.getElementById('bk-days').textContent   = recs.length + '日';
  document.getElementById('bk-latest').textContent = recs[recs.length - 1].weight + 'kg';
  document.getElementById('bk-min').textContent    = Math.min(...recs.map(r => r.weight)) + 'kg';
  document.getElementById('bk-max').textContent    = Math.max(...recs.map(r => r.weight)) + 'kg';

  const recent = recs.slice(-60);
  if (weightChart) weightChart.destroy();
  weightChart = new Chart(document.getElementById('chart-weight'), {
    type: 'line',
    data: {
      labels: recent.map(r => r.date.slice(5)),
      datasets: [
        { label: '体重(kg)', data: recent.map(r => r.weight), borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,.1)', tension: .3, pointRadius: 4, fill: true },
        { label: 'BMI', data: recent.map(r => r.bmi), borderColor: '#2563eb', backgroundColor: 'transparent', tension: .3, pointRadius: 2, yAxisID: 'y2', borderDash: [5,3] },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y:  { position: 'left',  title: { display: true, text: '体重(kg)' } },
        y2: { position: 'right', title: { display: true, text: 'BMI' }, grid: { drawOnChartArea: false } }
      }
    }
  });

  const logEl = document.getElementById('weight-log');
  logEl.innerHTML = [...recs].reverse().slice(0, 30).map(r => {
    const cls = bmiClass(r.bmi);
    return `<div class="weight-log-item">
      <span class="wl-date">${r.date}</span>
      <span class="wl-weight">${r.weight}kg</span>
      <span class="wl-bmi" style="color:${cls.color}">BMI ${r.bmi}</span>
      <span style="font-size:12px;color:var(--text-sub)">${r.note||''}</span>
      <button class="wl-del" data-date="${r.date}">×</button>
    </div>`;
  }).join('');

  document.getElementById('bmi-history-wrap').style.display = 'block';
  document.getElementById('bmi-history-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('weight-log').addEventListener('click', e => {
  if (!e.target.classList.contains('wl-del')) return;
  if (!confirm('この記録を削除しますか？')) return;
  saveWeightRecs(loadWeightRecs().filter(r => r.date !== e.target.dataset.date));
  renderWeightHistory();
});
document.getElementById('bmi-clear-btn').addEventListener('click', () => {
  if (!confirm('全ての体重記録を削除しますか？')) return;
  localStorage.removeItem(BMI_KEY);
  document.getElementById('bmi-result').style.display = 'none';
  document.getElementById('bmi-history-wrap').style.display = 'none';
});

renderWeightHistory();

// ══════════════════════════════════════════════════════════════
// TAB 4: カロリー計算
// ══════════════════════════════════════════════════════════════
let macroChart = null;
let calDelta = 0;

// 目標ボタン切替
document.getElementById('cal-goal-btns').addEventListener('click', e => {
  const btn = e.target.closest('.goal-btn');
  if (!btn) return;
  document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calDelta = +btn.dataset.delta;
});
// 初期値（現状維持を選択）
document.querySelectorAll('.goal-btn').forEach(b => {
  if (+b.dataset.delta === 0) b.classList.add('active');
  else b.classList.remove('active');
});

document.getElementById('cal-calc-btn').addEventListener('click', () => {
  const age      = +document.getElementById('cal-age').value;
  const sex      = document.getElementById('cal-sex').value;
  const height   = +document.getElementById('cal-height').value;
  const weight   = +document.getElementById('cal-weight').value;
  const activity = +document.getElementById('cal-activity').value;

  if (!age || !height || !weight) { alert('年齢・身長・体重を入力してください'); return; }

  // Mifflin-St Jeor 式
  const bmr = sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee   = Math.round(bmr * activity);
  const target = Math.round(tdee + calDelta);

  document.getElementById('cal-bmr').textContent   = Math.round(bmr) + ' kcal';
  document.getElementById('cal-tdee').textContent  = tdee + ' kcal';
  document.getElementById('cal-target').textContent = target + ' kcal';

  // マクロ計算（たんぱく質30%、脂質25%、炭水化物45%）
  const protein = Math.round(target * 0.30 / 4);
  const fat     = Math.round(target * 0.25 / 9);
  const carbs   = Math.round(target * 0.45 / 4);

  document.getElementById('macro-grid').innerHTML = `
    <div class="macro-item">
      <div class="macro-name">🍗 たんぱく質</div>
      <div class="macro-val" style="color:#ef4444">${protein}g</div>
      <div class="macro-sub">${Math.round(target * 0.30)} kcal</div>
    </div>
    <div class="macro-item">
      <div class="macro-name">🥑 脂質</div>
      <div class="macro-val" style="color:#f59e0b">${fat}g</div>
      <div class="macro-sub">${Math.round(target * 0.25)} kcal</div>
    </div>
    <div class="macro-item">
      <div class="macro-name">🍚 炭水化物</div>
      <div class="macro-val" style="color:#3b82f6">${carbs}g</div>
      <div class="macro-sub">${Math.round(target * 0.45)} kcal</div>
    </div>`;

  if (macroChart) macroChart.destroy();
  macroChart = new Chart(document.getElementById('chart-macro'), {
    type: 'doughnut',
    data: {
      labels: ['たんぱく質 30%', '脂質 25%', '炭水化物 45%'],
      datasets: [{ data: [protein * 4, fat * 9, carbs * 4], backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  const FOODS = [
    { name: '白米（1杯 150g）', kcal: 252 }, { name: '食パン（1枚 60g）', kcal: 156 },
    { name: '鶏むね肉（100g）', kcal: 108 }, { name: '鶏もも肉（100g）', kcal: 204 },
    { name: '卵（1個 60g）', kcal: 91 },     { name: '豆腐（1/2丁 150g）', kcal: 84 },
    { name: 'バナナ（1本 100g）', kcal: 86 }, { name: 'りんご（1/2個 100g）', kcal: 56 },
    { name: 'ラーメン（1杯）', kcal: 450 },  { name: 'カレーライス（1人前）', kcal: 700 },
    { name: 'ビール（350ml）', kcal: 140 },   { name: '牛乳（200ml）', kcal: 122 },
  ];
  document.getElementById('food-list').innerHTML = FOODS.map(f =>
    `<div class="food-item"><span>${f.name}</span><span class="food-kcal">${f.kcal} kcal</span></div>`
  ).join('');

  document.getElementById('cal-result').style.display = 'block';
  document.getElementById('cal-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
