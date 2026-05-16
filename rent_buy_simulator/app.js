'use strict';

// ── 免責バナー閉じる ──────────────────────────────────────────────
document.getElementById('disc-close').addEventListener('click', () => {
  document.querySelector('.disclaimer-banner').style.display = 'none';
});

// ── タブ切替 ─────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.main').forEach(m => m.style.display = 'none');
    document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
  });
});

// 住み替えタブの種別切替
document.getElementById('m-from-type').addEventListener('change', function() {
  const isOwn = this.value === 'own';
  document.getElementById('m-from-rent-row').style.display = isOwn ? 'none' : 'flex';
  document.getElementById('m-from-sell-row').style.display = isOwn ? 'flex' : 'none';
  document.getElementById('m-from-loan-row').style.display = isOwn ? 'flex' : 'none';
});
document.getElementById('m-to-type').addEventListener('change', function() {
  const isBuy = this.value === 'buy';
  document.getElementById('m-to-rent-row').style.display = isBuy ? 'none' : 'flex';
  document.getElementById('m-to-buy-row').style.display = isBuy ? 'flex' : 'none';
});

// ── ユーティリティ ────────────────────────────────────────────────
const fmtMan = v => (Math.round(v * 10) / 10).toLocaleString() + '万円';
const fmtManLarge = v => {
  if (Math.abs(v) >= 10000) return (Math.round(v / 100) / 10) + '億円';
  return Math.round(v).toLocaleString() + '万円';
};

function calcMonthlyPayment(principal, annualRate, months) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

// 返済負担率ボックス
function setAffordabilityBox(elId, monthlyPayment, annualIncome) {
  const el = document.getElementById(elId);
  if (!annualIncome || annualIncome <= 0) { el.style.display = 'none'; return; }
  const pct = monthlyPayment / (annualIncome / 12) * 100;
  let cls = 'ok', label = '良好';
  if (pct >= 35) { cls = 'danger'; label = '負担過大（要注意）'; }
  else if (pct >= 25) { cls = 'warn'; label = 'やや高め'; }
  el.className = 'affordability-box ' + cls;
  el.innerHTML = `
    <div class="aff-pct">${pct.toFixed(1)}%</div>
    <div>
      <strong>返済負担率: ${label}</strong><br>
      <span style="font-size:12px;font-weight:400">
        月返済 ${fmtMan(monthlyPayment)} ÷ 月収 ${fmtMan(annualIncome / 12)} ≈ ${pct.toFixed(1)}%<br>
        目安: <strong style="color:var(--green)">〜25%</strong> 理想 ／
        <strong style="color:var(--warn)">25〜35%</strong> 注意 ／
        <strong style="color:var(--red)">35%超</strong> 要見直し
      </span>
    </div>`;
  el.style.display = 'flex';
}

// 購入費用詳細内訳をレンダリング
function renderBuyDetail(price, loan) {
  const agentFee  = Math.round((price * 0.03 + 6) * 1.1 * 10) / 10; // 仲介手数料（税込）
  const regTax    = Math.round(price * 0.002 * 10) / 10;             // 登録免許税（軽減後概算）
  const acqTax    = Math.round(price * 0.003 * 10) / 10;             // 不動産取得税（軽減後概算）
  const stampTax  = price < 1000 ? 1 : price < 5000 ? 2 : price < 10000 ? 6 : 16; // 印紙税
  const scrivener = 10;                                               // 司法書士報酬
  const guarantee = Math.round(loan * 0.02 * 10) / 10;               // ローン保証料（概算）
  const fire      = 20;                                               // 火災保険（35年概算）
  const moving    = 15;                                               // 引越費用（概算）
  const total     = agentFee + regTax + acqTax + stampTax + scrivener + guarantee + fire + moving;

  const items = [
    { name: '仲介手数料（税込）',     val: agentFee },
    { name: '登録免許税',             val: regTax },
    { name: '不動産取得税',           val: acqTax },
    { name: '印紙税',                 val: stampTax },
    { name: '司法書士費用',           val: scrivener },
    { name: 'ローン保証料',           val: guarantee },
    { name: '火災保険（35年概算）',   val: fire },
    { name: '引越費用（概算）',       val: moving },
  ];

  const grid = document.getElementById('buy-detail-grid');
  grid.innerHTML = items.map(it =>
    `<div class="detail-item">
      <span class="detail-name">${it.name}</span>
      <span class="detail-val">${fmtMan(it.val)}</span>
    </div>`
  ).join('') +
  `<div class="detail-item" style="grid-column:1/-1;background:#eff6ff;border-bottom:none;border-top:2px solid #bfdbfe">
    <span class="detail-name" style="font-weight:700;color:#1d4ed8">諸費用 合計（概算）</span>
    <span class="detail-val" style="color:var(--primary);font-size:16px">${fmtMan(total)}</span>
  </div>`;
}

// 金利シナリオカード
function renderRiskCard(loan, months, baseRate, rate1, rate2, baseMonthly) {
  const m1 = calcMonthlyPayment(loan, rate1, months);
  const m2 = calcMonthlyPayment(loan, rate2, months);
  const d1 = m1 - baseMonthly;
  const d2 = m2 - baseMonthly;

  document.getElementById('risk-result-card').innerHTML = `
    <div class="risk-title">📈 金利上昇シナリオ（月返済額への影響）</div>
    <p style="font-size:13px;color:var(--text-sub);margin-bottom:12px">
      変動金利の場合、将来の金利上昇により月返済額が増加します。事前に確認しておきましょう。
    </p>
    <div class="risk-grid">
      <div class="risk-item">
        <div class="risk-item-label">現在（${baseRate}%）</div>
        <div class="risk-item-val">${fmtMan(Math.round(baseMonthly * 10) / 10)}</div>
        <div class="risk-item-diff" style="color:var(--text-sub)">基準</div>
      </div>
      <div class="risk-item">
        <div class="risk-item-label">シナリオ1（${rate1}%）</div>
        <div class="risk-item-val">${fmtMan(Math.round(m1 * 10) / 10)}</div>
        <div class="risk-item-diff" style="color:${d1 > 0 ? 'var(--red)' : 'var(--green);'}">
          ${d1 > 0 ? '＋' : ''}${fmtMan(Math.round(d1 * 10) / 10)} / 月
        </div>
      </div>
      <div class="risk-item">
        <div class="risk-item-label">シナリオ2（${rate2}%）</div>
        <div class="risk-item-val">${fmtMan(Math.round(m2 * 10) / 10)}</div>
        <div class="risk-item-diff" style="color:${d2 > 0 ? 'var(--red)' : 'var(--green)'}">
          ${d2 > 0 ? '＋' : ''}${fmtMan(Math.round(d2 * 10) / 10)} / 月
        </div>
      </div>
    </div>
    <p style="font-size:12px;color:#94a3b8;margin-top:10px">
      ※ 借入${fmtManLarge(loan)}・期間${months / 12}年で試算。実際の返済額は金融機関の条件により異なります。
    </p>`;
}

// 関連サービスリンク（外部サービスへの参考リンク）
const SERVICE_LINKS = [
  { name: 'SUUMO', url: 'https://suumo.jp', desc: '物件検索' },
  { name: "HOME'S", url: 'https://www.homes.co.jp', desc: '物件検索' },
  { name: 'フラット35（住金）', url: 'https://www.flat35.com/loan/flat35/sim.html', desc: '固定金利目安' },
  { name: 'LIFULL引越し', url: 'https://hikkoshi.homes.co.jp', desc: '引越し見積もり' },
  { name: '日本FP協会', url: 'https://www.jafp.or.jp/confer/', desc: 'FP相談窓口' },
];

function renderServiceLinks() {
  return `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0">
    <p style="font-size:12px;font-weight:700;color:var(--text-sub);margin-bottom:8px">🔗 実際に使えるサービス（外部リンク・参考）</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${SERVICE_LINKS.map(s =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:4px;padding:5px 10px;background:#f1f5f9;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--primary);text-decoration:none;font-weight:600;transition:background .15s"
          onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#f1f5f9'">
          ${s.name} <span style="font-weight:400;color:var(--text-sub)">（${s.desc}）</span>
        </a>`
      ).join('')}
    </div>
    <p style="font-size:11px;color:#94a3b8;margin-top:6px">※ 外部サービスです。リンク先の内容についての責任を負いません。</p>
  </div>`;
}

// ── URL パラメータ共有 ────────────────────────────────────────────
const PARAM_MAP = {
  pr:'b-price', dw:'b-down', rt:'b-rate', yr:'b-years',
  fe:'b-fees', tx:'b-tax', mn:'b-maint', rp:'b-repair',
  ic:'b-income', r1:'risk-rate1', r2:'risk-rate2',
  rn:'r-rent', dp:'r-deposit', ky:'r-key', ag:'r-agent',
  rw:'r-renew', rs:'r-rise', pd:'c-period', iv:'c-invest',
  ta:'tax-apply', tl:'tax-limit'
};

function loadFromURL() {
  const p = new URLSearchParams(location.search);
  let loaded = 0;
  for (const [key, elId] of Object.entries(PARAM_MAP)) {
    if (p.has(key)) {
      const el = document.getElementById(elId);
      if (el) { el.value = p.get(key); loaded++; }
    }
  }
  if (loaded > 0) {
    const notice = document.createElement('div');
    notice.className = 'url-loaded-notice';
    notice.textContent = '✅ 共有URLから設定を読み込みました。「比較計算する」を押して結果を確認してください。';
    document.getElementById('calc-compare').before(notice);
  }
}

function buildShareURL() {
  const params = new URLSearchParams();
  for (const [key, elId] of Object.entries(PARAM_MAP)) {
    const el = document.getElementById(elId);
    if (el && el.value !== '') params.set(key, el.value);
  }
  return location.origin + location.pathname + '?' + params.toString();
}

function renderShareButtons(shareUrl, tweetText) {
  const lineURL = 'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(shareUrl);
  const twitterURL = 'https://twitter.com/intent/tweet?text='
    + encodeURIComponent(tweetText) + '&url=' + encodeURIComponent(shareUrl);

  const el = document.getElementById('share-compare');
  el.innerHTML = `
    <div class="share-section">
      <div class="share-section-title">📤 この計算結果を家族・友人とシェアする</div>
      <div class="share-row">
        <a href="${twitterURL}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn-x">𝕏 X(Twitter)でシェア</a>
        <a href="${lineURL}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn-line">💬 LINEでシェア</a>
        <button class="share-btn share-btn-copy" id="copy-url-btn">🔗 URLをコピー</button>
      </div>
      <div class="share-url-box">${shareUrl}</div>
    </div>`;

  document.getElementById('copy-url-btn').addEventListener('click', () => {
    const btn = document.getElementById('copy-url-btn');
    const copyToClipboard = () => {
      btn.textContent = '✅ コピーしました！';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = '🔗 URLをコピー'; btn.classList.remove('copied'); }, 2000);
    };
    navigator.clipboard
      ? navigator.clipboard.writeText(shareUrl).then(copyToClipboard)
      : (() => {
          const ta = Object.assign(document.createElement('textarea'), { value: shareUrl });
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta); copyToClipboard();
        })();
  });
}

// ── TAB1: 家賃 vs 購入 ────────────────────────────────────────────
let chartCompare = null;

document.getElementById('calc-compare').addEventListener('click', () => {
  const price     = +document.getElementById('b-price').value;
  const down      = +document.getElementById('b-down').value;
  const rate      = +document.getElementById('b-rate').value;
  const years     = +document.getElementById('b-years').value;
  const feePct    = +document.getElementById('b-fees').value;
  const tax       = +document.getElementById('b-tax').value;
  const maint     = +document.getElementById('b-maint').value;
  const repair    = +document.getElementById('b-repair').value;
  const income    = +document.getElementById('b-income').value;
  const riskRate1 = +document.getElementById('risk-rate1').value;
  const riskRate2 = +document.getElementById('risk-rate2').value;
  const sellInput = document.getElementById('b-sell').value;
  const taxApply  = +document.getElementById('tax-apply').value;
  const taxLimit  = +document.getElementById('tax-limit').value;

  const rent    = +document.getElementById('r-rent').value;
  const deposit = +document.getElementById('r-deposit').value;
  const key     = +document.getElementById('r-key').value;
  const agent   = +document.getElementById('r-agent').value;
  const renew   = +document.getElementById('r-renew').value;
  const rise    = +document.getElementById('r-rise').value;

  const period  = +document.getElementById('c-period').value;
  const invest  = +document.getElementById('c-invest').value;

  if (!price || !rent) { alert('物件価格・月家賃を入力してください'); return; }

  const loan    = price - down;
  const fees    = price * feePct / 100;
  const months  = years * 12;
  const monthly = calcMonthlyPayment(loan, rate, months);

  // 購入コスト累積（年ごと）
  const buyCosts = [0];
  const repairYear = Math.min(Math.floor(period * 0.5), 15); // 修繕費計上年

  for (let y = 1; y <= period; y++) {
    let yearLoan = 0;
    for (let m = 0; m < 12; m++) {
      if (y * 12 - (12 - m) <= months) yearLoan += monthly;
    }
    const yearRepair = (y === repairYear && repair > 0) ? repair : 0;
    buyCosts.push(buyCosts[y - 1] + yearLoan + tax + maint * 12 + yearRepair);
  }

  const buyInitial = down + fees;
  const sellPrice = sellInput ? +sellInput : price * Math.pow(0.99, period);

  // ローン残債（period年後）
  const totalMonths = Math.min(period * 12, months);
  const r = rate / 100 / 12;
  let remBalance;
  if (r > 0) {
    remBalance = loan * Math.pow(1 + r, totalMonths)
      - monthly * (Math.pow(1 + r, totalMonths) - 1) / r;
    remBalance = Math.max(0, remBalance);
  } else {
    remBalance = Math.max(0, loan - monthly * totalMonths);
  }

  // 住宅ローン控除
  let taxDeduction = 0;
  if (taxApply) {
    const effectiveLoan = Math.min(loan, taxLimit);
    let bal = loan;
    const rMonth = r;
    for (let y = 1; y <= Math.min(13, years); y++) {
      taxDeduction += Math.min(bal, effectiveLoan) * 0.007;
      for (let m = 0; m < 12; m++) {
        if (rMonth > 0) bal = bal * (1 + rMonth) - monthly;
        else bal = Math.max(0, bal - loan / months);
      }
      bal = Math.max(0, bal);
    }
    taxDeduction = Math.round(taxDeduction);
  }

  const buyRunning = buyCosts[period];
  const netSell = sellPrice - remBalance;
  const buyNet = buyInitial + buyRunning - Math.max(0, netSell) - taxDeduction;

  // 賃貸コスト累積（年ごと）
  const rentCosts = [0];
  let curRent = rent;
  const rentInitial = rent * (deposit + key + agent);
  const investGain = buyInitial * (Math.pow(1 + invest / 100, period) - 1);

  for (let y = 1; y <= period; y++) {
    if (y > 1) curRent *= (1 + rise / 100);
    const renewCost = (y % 2 === 0) ? curRent * renew : 0;
    rentCosts.push(rentCosts[y - 1] + curRent * 12 + renewCost);
  }

  const rentNet = rentInitial + rentCosts[period] - investGain;

  // グラフ用配列
  const buyLine  = buyCosts.map((v, i) =>
    +(buyInitial + v - Math.max(0, sellPrice - remBalance) * (i / period)).toFixed(1));
  const rentLine = rentCosts.map(v => +(rentInitial + v).toFixed(1));

  // 損益分岐点
  let breakEven = null;
  for (let y = 0; y <= period; y++) {
    if (buyLine[y] <= rentLine[y]) { breakEven = y; break; }
  }

  // ── 返済負担率 ──
  setAffordabilityBox('affordability-box', monthly, income);

  // ── 結果カード ──
  document.getElementById('res-buy-total').textContent  = fmtManLarge(buyNet);
  document.getElementById('res-buy-sub').textContent    = `売却益・控除考慮後 | 頭金${fmtMan(down)}+諸費${fmtMan(fees)}`;
  document.getElementById('res-rent-total').textContent = fmtManLarge(rentNet);
  document.getElementById('res-rent-sub').textContent   = `運用益 ${fmtManLarge(investGain)} 差し引き後`;

  const diff   = Math.abs(buyNet - rentNet);
  const winner = buyNet <= rentNet ? '購入' : '賃貸';
  document.getElementById('res-winner').textContent = `🏆 ${winner}が有利！`;
  document.getElementById('res-diff').textContent   = `${period}年間で ${fmtManLarge(diff)} の差`;
  document.getElementById('res-winner-card').style.borderTopColor =
    winner === '購入' ? 'var(--primary)' : 'var(--green)';

  // ── 住宅ローン控除 ──
  const taxBox = document.getElementById('tax-deduction-box');
  if (taxApply && taxDeduction > 0) {
    taxBox.innerHTML = `💴 住宅ローン控除（13年間）の節税効果: <strong>${fmtManLarge(taxDeduction)}</strong>（購入コストから控除済み）`;
    taxBox.style.display = 'block';
  } else {
    taxBox.style.display = 'none';
  }

  // ── 費用詳細内訳 ──
  renderBuyDetail(price, loan);

  // ── 金利リスクシナリオ ──
  renderRiskCard(loan, months, rate, riskRate1, riskRate2, monthly);

  // ── 損益分岐点 ──
  const bebox = document.getElementById('breakeven-box');
  if (breakEven === 0) {
    bebox.innerHTML = '📍 購入は初年度から賃貸より安い計算です。';
  } else if (breakEven !== null) {
    bebox.innerHTML = `📍 損益分岐点: <strong>${breakEven}年目</strong> — ${breakEven}年以上住み続けるなら購入が有利`;
  } else {
    bebox.innerHTML = `📍 ${period}年間では賃貸が有利。比較期間や家賃値上がり率を調整してみてください。`;
  }

  // ── アドバイスカード ──
  const adviceLines = [];
  if (breakEven !== null && breakEven > 0)
    adviceLines.push(`📍 <strong>${breakEven}年以上住む予定</strong>なら購入が試算上有利です。`);
  if (winner === '購入')
    adviceLines.push(`🏠 購入は<strong>長期居住・資産形成</strong>に向いています。金利上昇リスクも念頭に。`);
  else
    adviceLines.push(`🏢 賃貸は<strong>ライフスタイルの柔軟性</strong>が強みです。差額を積み立て投資に回すと有利に。`);
  if (rate >= 2)
    adviceLines.push(`⚠️ 金利 ${rate}% は高めです。変動金利への切替や繰り上げ返済も検討を。`);
  if (down < price * 0.1)
    adviceLines.push(`💡 頭金が物件価格の10%未満です。諸費用も含めて資金計画を確認してください。`);
  if (repair > 0)
    adviceLines.push(`🔧 大規模修繕費 ${fmtMan(repair)}（${repairYear}年目）が計算に含まれています。`);

  document.getElementById('advice-card').innerHTML =
    `<h3 style="font-size:15px;font-weight:800;color:var(--orange);margin-bottom:10px">💡 あなたへのアドバイス</h3>` +
    adviceLines.map(l => `<p style="margin-bottom:6px;font-size:14px;line-height:1.7">${l}</p>`).join('') +
    renderServiceLinks();

  // ── グラフ ──
  const labels = Array.from({length: period + 1}, (_, i) => i + '年');
  if (chartCompare) chartCompare.destroy();
  chartCompare = new Chart(document.getElementById('chart-compare'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '購入 累積コスト（万円）', data: buyLine,  borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.08)', tension: .3, pointRadius: 2 },
        { label: '賃貸 累積コスト（万円）', data: rentLine, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,.08)', tension: .3, pointRadius: 2 },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ' + fmtManLarge(c.parsed.y) } }
      },
      scales: { y: { ticks: { callback: v => fmtManLarge(v) } } }
    }
  });

  // SNSシェアボタン
  const shareUrl = buildShareURL();
  const tweetText = `🏠 賃貸vs購入シミュレーション\n購入: ${fmtManLarge(buyNet)} / 賃貸: ${fmtManLarge(rentNet)}\n${period}年間では「${winner}」が試算上有利！\n#賃貸vs購入 #住宅ローン #不動産`;
  renderShareButtons(shareUrl, tweetText);

  document.getElementById('result-compare').style.display = 'block';
  document.getElementById('result-compare').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── TAB2: 住み替えコスト ───────────────────────────────────────────
document.getElementById('calc-move').addEventListener('click', () => {
  const fromType  = document.getElementById('m-from-type').value;
  const toType    = document.getElementById('m-to-type').value;
  const moveCost  = +document.getElementById('m-move-cost').value;
  const furniture = +document.getElementById('m-furniture').value;
  const other     = +document.getElementById('m-other').value;

  const items = [];

  if (fromType === 'rent') {
    const fromRent = +document.getElementById('m-from-rent').value;
    items.push({ label: '退去クリーニング費用（概算）', val: Math.round(fromRent * 0.5 * 10) / 10 });
    items.push({ label: '賃貸 違約金・短期解約料（目安）', val: 0, note: '契約次第' });
  } else {
    const sell    = +document.getElementById('m-from-sell').value;
    const loanRem = +document.getElementById('m-from-loan').value;
    const agentFee = Math.round(sell * 0.033 + 6.6);
    items.push({ label: '売却 仲介手数料（3%+6.6万）', val: agentFee });
    items.push({ label: '抵当権抹消・司法書士費用', val: 3 });
    const gain = sell - loanRem - agentFee - 3;
    items.push({ label: '売却手取り（参考）', val: gain, plus: true });
  }

  if (toType === 'rent') {
    const toRent = +document.getElementById('m-to-rent').value;
    items.push({ label: '敷金（1ヶ月分）', val: toRent });
    items.push({ label: '礼金（1ヶ月分）', val: toRent });
    items.push({ label: '仲介手数料（1ヶ月分）', val: toRent });
    items.push({ label: '前家賃（1ヶ月分）', val: toRent });
  } else {
    const buyPrice = +document.getElementById('m-to-buy').value;
    items.push({ label: '購入諸費用（物件価格の6%目安）', val: Math.round(buyPrice * 0.06) });
    items.push({ label: '頭金（別途必要）', val: 0, note: '個人設定次第' });
  }

  items.push({ label: '引越し費用', val: moveCost });
  if (furniture > 0) items.push({ label: '家具・家電の買替費用', val: furniture });
  if (other > 0) items.push({ label: 'その他費用', val: other });

  const total = items.filter(it => !it.plus && it.val > 0).reduce((s, it) => s + it.val, 0);

  document.getElementById('move-items').innerHTML = items.map(it => `
    <div class="move-item">
      <span class="move-item-label">${it.label}${it.note ? ' <small>('+it.note+')</small>' : ''}</span>
      <span class="move-item-val" style="${it.plus ? 'color:var(--green)' : ''}">
        ${it.val === 0 && it.note ? '—' : (it.plus ? '＋' : '') + fmtMan(it.val)}
      </span>
    </div>`).join('');

  document.getElementById('move-total').textContent = `住み替え 総費用（概算）: ${fmtMan(total)}`;
  document.getElementById('result-move').style.display = 'block';
  document.getElementById('result-move').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── TAB3: ローン返済 ──────────────────────────────────────────────
let chartLoan  = null;
let loanState  = null;

document.getElementById('calc-loan').addEventListener('click', () => {
  const amount     = +document.getElementById('l-amount').value;
  const annualRate = +document.getElementById('l-rate').value;
  const lYears     = +document.getElementById('l-years').value;
  const lType      = document.getElementById('l-type').value;
  const bonus      = +document.getElementById('l-bonus').value;
  const lIncome    = +document.getElementById('l-income').value;

  if (!amount) { alert('借入金額を入力してください'); return; }

  const lMonths = lYears * 12;
  const r = annualRate / 100 / 12;

  let monthlyBase, totalPaid, totalInterest;

  if (lType === 'equal') {
    monthlyBase   = calcMonthlyPayment(amount, annualRate, lMonths);
    totalPaid     = monthlyBase * lMonths + bonus * lYears;
    totalInterest = totalPaid - amount;
  } else {
    monthlyBase = amount / lMonths;
    let totalInt = 0, balance = amount;
    for (let m = 1; m <= lMonths; m++) {
      totalInt += balance * r;
      balance -= monthlyBase;
    }
    totalInterest = totalInt;
    totalPaid = amount + totalInterest + bonus * lYears;
  }

  // 返済負担率
  setAffordabilityBox('loan-affordability-box', monthlyBase + bonus / 12, lIncome);

  document.getElementById('l-monthly').textContent  = fmtMan(Math.round((monthlyBase + bonus / 12) * 10) / 10);
  document.getElementById('l-total').textContent    = fmtManLarge(totalPaid);
  document.getElementById('l-interest').textContent = fmtManLarge(totalInterest);
  document.getElementById('l-ratio').textContent    = (totalInterest / amount * 100).toFixed(1) + '%';

  // 残高推移データ（年ごと）
  const balances   = [amount];
  const principals = [0];
  const interests  = [0];
  let bal = amount;

  for (let y = 1; y <= lYears; y++) {
    let yp = 0, yi = 0;
    for (let m = 0; m < 12; m++) {
      const int  = bal * r;
      const prin = lType === 'equal' ? monthlyBase - int : amount / lMonths;
      yi += int;
      yp += prin;
      bal = Math.max(0, bal - prin);
    }
    balances.push(+bal.toFixed(1));
    principals.push(+yp.toFixed(1));
    interests.push(+yi.toFixed(1));
  }

  const labels = Array.from({length: lYears + 1}, (_, i) => i + '年');
  if (chartLoan) chartLoan.destroy();
  chartLoan = new Chart(document.getElementById('chart-loan'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: '残高（万円）', data: balances, type: 'line', borderColor: '#2563eb', backgroundColor: 'transparent', tension: .3, yAxisID: 'y', pointRadius: 2 },
        { label: '元金返済（万円）', data: principals, backgroundColor: 'rgba(37,99,235,.4)', yAxisID: 'y2' },
        { label: '利息（万円）', data: interests, backgroundColor: 'rgba(220,38,38,.35)', yAxisID: 'y2' },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y:  { position: 'left',  ticks: { callback: v => fmtManLarge(v) }, title: { display: true, text: '残高' } },
        y2: { position: 'right', ticks: { callback: v => fmtMan(v) }, title: { display: true, text: '年間返済' }, grid: { drawOnChartArea: false } }
      }
    }
  });

  // 返済スケジュール表（5年ごと）
  const table = document.getElementById('amort-table');
  let rows = `<tr><th>経過</th><th>月返済</th><th>年間元金</th><th>年間利息</th><th>残高</th></tr>`;
  for (let y = 0; y <= lYears; y += 5) {
    const yr = Math.min(y, lYears);
    rows += `<tr>
      <td>${yr}年目</td>
      <td>${yr === 0 ? fmtMan(Math.round(monthlyBase * 10) / 10) : '—'}</td>
      <td>${fmtMan(principals[yr] || 0)}</td>
      <td>${fmtMan(interests[yr] || 0)}</td>
      <td>${fmtManLarge(balances[yr])}</td>
    </tr>`;
    if (yr >= lYears) break;
  }
  if (lYears % 5 !== 0) {
    rows += `<tr>
      <td>${lYears}年目（完済）</td><td>—</td>
      <td>${fmtMan(principals[lYears] || 0)}</td>
      <td>${fmtMan(interests[lYears] || 0)}</td>
      <td>${fmtManLarge(balances[lYears])}</td>
    </tr>`;
  }
  table.innerHTML = rows;

  // 繰り上げ計算のために保持
  loanState = { amount, annualRate, lYears, lMonths, lType, monthlyBase, balances, r };

  document.getElementById('calc-prepay').disabled = false;
  document.getElementById('result-loan').style.display = 'block';
  document.getElementById('result-loan').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── 繰り上げ返済シミュレーション ──────────────────────────────────
document.getElementById('calc-prepay').addEventListener('click', () => {
  if (!loanState) return;

  const prepayAmt = +document.getElementById('p-amount').value;
  const timing    = +document.getElementById('p-timing').value;
  const pType     = document.getElementById('p-type').value;

  const { amount, annualRate, lYears, lMonths, lType, monthlyBase, balances, r } = loanState;

  if (prepayAmt <= 0) { alert('繰り上げ返済額を入力してください'); return; }
  if (timing >= lYears) { alert('繰り上げタイミングが返済期間を超えています'); return; }

  const balAtTiming = balances[Math.min(timing, lYears)];
  if (prepayAmt >= balAtTiming) {
    alert(`繰り上げ額が残高（${fmtManLarge(balAtTiming)}）以上です。一括完済には別途窓口でご確認ください。`);
    return;
  }

  const newBalance      = balAtTiming - prepayAmt;
  const remainingMonths = (lYears - timing) * 12;

  // 繰り上げ前の残利息
  let origRemInterest = 0;
  let bal = balAtTiming;
  for (let m = 0; m < remainingMonths; m++) {
    const int  = bal * r;
    const prin = lType === 'equal'
      ? Math.min(monthlyBase - int, bal)
      : Math.min(amount / lMonths, bal);
    origRemInterest += int;
    bal = Math.max(0, bal - prin);
  }

  let interestSave, monthsSave, newMonthly;

  if (pType === 'shorten') {
    // 期間短縮型: 月返済額そのまま→期間が短くなる
    newMonthly = monthlyBase;
    let newRemInterest = 0;
    let newMonths = 0;
    let b = newBalance;
    while (b > 0.01 && newMonths < remainingMonths) {
      const int  = b * r;
      const prin = Math.min(monthlyBase - int, b);
      if (prin <= 0) break;
      newRemInterest += int;
      b -= prin;
      newMonths++;
    }
    interestSave = Math.max(0, origRemInterest - newRemInterest);
    monthsSave   = remainingMonths - newMonths;
  } else {
    // 毎月軽減型: 期間そのまま→月返済額が下がる
    newMonthly = calcMonthlyPayment(newBalance, annualRate, remainingMonths);
    let newRemInterest = 0;
    let b = newBalance;
    for (let m = 0; m < remainingMonths; m++) {
      const int  = b * r;
      const prin = Math.min(newMonthly - int, b);
      newRemInterest += int;
      b = Math.max(0, b - prin);
    }
    interestSave = Math.max(0, origRemInterest - newRemInterest);
    monthsSave   = 0;
  }

  // 結果表示
  document.getElementById('p-interest-save').textContent = fmtManLarge(interestSave);
  document.getElementById('p-months-save').textContent   = pType === 'shorten'
    ? `${Math.floor(monthsSave / 12)}年${monthsSave % 12}ヶ月`
    : '変更なし';
  document.getElementById('p-new-monthly').textContent   = pType === 'reduce'
    ? fmtMan(Math.round(newMonthly * 10) / 10)
    : `${fmtMan(Math.round(monthlyBase * 10) / 10)}（同じ）`;

  const summaryEl = document.getElementById('prepay-summary');
  if (pType === 'shorten') {
    summaryEl.innerHTML = `
      ✅ <strong>期間短縮型</strong>：${timing}年後に ${fmtMan(prepayAmt)} 繰り上げることで、
      返済期間を <strong>${Math.floor(monthsSave / 12)}年${monthsSave % 12}ヶ月短縮</strong>し、
      利息を <strong>${fmtManLarge(interestSave)}</strong> 削減できます。<br>
      <span style="font-size:12px">繰り上げ返済は早いほど利息削減効果が大きくなります。</span>`;
  } else {
    const reduction = monthlyBase - newMonthly;
    summaryEl.innerHTML = `
      ✅ <strong>毎月軽減型</strong>：${timing}年後に ${fmtMan(prepayAmt)} 繰り上げることで、
      月返済額が <strong>${fmtMan(Math.round(reduction * 10) / 10)} 減少</strong>（→ ${fmtMan(Math.round(newMonthly * 10) / 10)}）し、
      利息を <strong>${fmtManLarge(interestSave)}</strong> 削減できます。<br>
      <span style="font-size:12px">毎月の家計負担を軽くしたい場合に向いています。</span>`;
  }

  document.getElementById('result-prepay').style.display = 'block';
  document.getElementById('result-prepay').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── クイックプリセット / Quick Presets ────────────────────────────
const PRESETS = {
  urban_family: {
    'b-price':5500,'b-down':1100,'b-rate':0.5,'b-years':35,
    'b-fees':7,'b-tax':18,'b-maint':3,'b-repair':150,
    'r-rent':18,'r-deposit':36,'r-renew':2,'r-increase':1,
    'compare-years':30,'r-income':800,
  },
  rural_single: {
    'b-price':2200,'b-down':300,'b-rate':0.7,'b-years':30,
    'b-fees':6,'b-tax':8,'b-maint':1.5,'b-repair':80,
    'r-rent':6,'r-deposit':12,'r-renew':1,'r-increase':0,
    'compare-years':25,'r-income':400,
  },
  highrise: {
    'b-price':7000,'b-down':2000,'b-rate':1.2,'b-years':35,
    'b-fees':8,'b-tax':24,'b-maint':4,'b-repair':200,
    'r-rent':25,'r-deposit':50,'r-renew':2,'r-increase':1.5,
    'compare-years':20,'r-income':1000,
  },
};

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = PRESETS[btn.dataset.preset];
    if (!preset) return;
    Object.entries(preset).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-compare').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── 初期化: URL パラメータ読み込み ────────────────────────────────
loadFromURL();
