'use strict';

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
const fmtMan = v => Math.round(v * 10) / 10 + '万円';
const fmtManLarge = v => {
  if (Math.abs(v) >= 10000) return (Math.round(v / 100) / 10) + '億円';
  return Math.round(v) + '万円';
};

// 元利均等返済の月返済額
function calcMonthlyPayment(principal, annualRate, months) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

// ── TAB1: 家賃 vs 購入 ────────────────────────────────────────────
let chartCompare = null;

document.getElementById('calc-compare').addEventListener('click', () => {
  // 入力取得
  const price   = +document.getElementById('b-price').value;   // 物件価格 万円
  const down    = +document.getElementById('b-down').value;    // 頭金 万円
  const rate    = +document.getElementById('b-rate').value;    // 年利 %
  const years   = +document.getElementById('b-years').value;   // 返済年数
  const feePct  = +document.getElementById('b-fees').value;    // 諸費用 %
  const tax     = +document.getElementById('b-tax').value;     // 固定資産税 年万円
  const maint   = +document.getElementById('b-maint').value;   // 管理費 月万円
  const sellInput = document.getElementById('b-sell').value;
  const taxApply = +document.getElementById('tax-apply').value;  // 住宅ローン控除
  const taxLimit = +document.getElementById('tax-limit').value;  // 控除上限借入額

  const rent    = +document.getElementById('r-rent').value;    // 月家賃 万円
  const deposit = +document.getElementById('r-deposit').value; // 敷金 月数
  const key     = +document.getElementById('r-key').value;     // 礼金 月数
  const agent   = +document.getElementById('r-agent').value;   // 仲介 月数
  const renew   = +document.getElementById('r-renew').value;   // 更新料 月数
  const rise    = +document.getElementById('r-rise').value;    // 家賃値上がり %/年

  const period  = +document.getElementById('c-period').value;  // 比較期間 年
  const invest  = +document.getElementById('c-invest').value;  // 運用利回り %/年

  if (!price || !rent) { alert('物件価格・月家賃を入力してください'); return; }

  const loan    = price - down;
  const fees    = price * feePct / 100;
  const months  = years * 12;
  const monthly = calcMonthlyPayment(loan, rate, months);

  // --- 購入コスト累積（年ごと） ---
  const buyCosts = [0];
  let totalLoanPaid = 0;
  let loanBalance = loan;

  for (let y = 1; y <= period; y++) {
    let yearLoan = 0;
    for (let m = 0; m < 12; m++) {
      if (y * 12 - (12 - m) <= months) { // ローン返済中
        yearLoan += monthly;
      }
    }
    totalLoanPaid += yearLoan;
    const yearCost = yearLoan + tax + maint * 12;
    buyCosts.push(buyCosts[y - 1] + yearCost);
  }

  // 初期費用（頭金＋諸費用）
  const buyInitial = down + fees;
  // 売却価格（残価）— 物件価格の年率-1%で価値減（30年後に約74%）
  const sellPrice = sellInput
    ? +sellInput
    : price * Math.pow(0.99, period);
  // ローン残債（period年後）
  let remBalance = loan;
  const totalMonths = Math.min(period * 12, months);
  const r = rate / 100 / 12;
  if (r > 0) {
    remBalance = loan * Math.pow(1 + r, totalMonths) - monthly * (Math.pow(1 + r, totalMonths) - 1) / r;
    remBalance = Math.max(0, remBalance);
  } else {
    remBalance = Math.max(0, loan - monthly * totalMonths);
  }

  // 住宅ローン控除計算（13年間 × min(ローン残高, 上限) × 0.7%）
  let taxDeduction = 0;
  if (taxApply) {
    const effectiveLoan = Math.min(loan, taxLimit);
    let bal = loan;
    const rMonth = rate / 100 / 12;
    for (let y = 1; y <= Math.min(13, years); y++) {
      taxDeduction += Math.min(bal, effectiveLoan) * 0.007;
      for (let m = 0; m < 12; m++) {
        if (rMonth > 0) bal = bal * (1 + rMonth) - calcMonthlyPayment(loan, rate, months);
        else bal = Math.max(0, bal - loan / months);
      }
      bal = Math.max(0, bal);
    }
    taxDeduction = Math.round(taxDeduction);
  }

  // 購入の実質コスト = 頭金+諸費用+ローン返済合計+税修繕 - (売却価格-ローン残債) - 控除
  const buyRunning = buyCosts[period]; // ローン＋税＋管理費の合計
  const netSell = sellPrice - remBalance;          // 手取り
  const buyNet = buyInitial + buyRunning - Math.max(0, netSell) - taxDeduction;

  // --- 賃貸コスト累積（年ごと） ---
  const rentCosts = [0];
  let cumRent = 0;
  let curRent = rent;

  // 初期費用
  const rentInitial = rent * (deposit + key + agent);
  // 運用差額（頭金を投資していたと仮定）
  let investGain = buyInitial * (Math.pow(1 + invest / 100, period) - 1);

  for (let y = 1; y <= period; y++) {
    if (y > 1) curRent *= (1 + rise / 100); // 値上がり
    // 更新料（2年ごと）
    const renewCost = (y % 2 === 0) ? curRent * renew : 0;
    const yearRent = curRent * 12 + renewCost;
    rentCosts.push(rentCosts[y - 1] + yearRent);
  }

  const rentTotal = rentInitial + rentCosts[period];
  const rentNet = rentTotal - investGain; // 運用益で実質コスト減

  // 初期費用を累積に加算してグラフ用配列作成
  const buyLine  = buyCosts.map((v, i) => +(buyInitial + v - Math.max(0, sellPrice - remBalance) * (i / period)).toFixed(1));
  const rentLine = rentCosts.map(v => +(rentInitial + v).toFixed(1));

  // 損益分岐点
  let breakEven = null;
  for (let y = 0; y <= period; y++) {
    if (buyLine[y] <= rentLine[y]) {
      breakEven = y;
      break;
    }
  }

  // 結果表示
  document.getElementById('res-buy-total').textContent  = fmtManLarge(buyNet);
  document.getElementById('res-buy-sub').textContent    = `売却益・ローン控除考慮後 | 頭金${fmtMan(down)}+諸費${fmtMan(fees)}`;
  document.getElementById('res-rent-total').textContent = fmtManLarge(rentNet);
  document.getElementById('res-rent-sub').textContent   = `運用益 ${fmtManLarge(investGain)} 差し引き後`;

  const diff = Math.abs(buyNet - rentNet);
  const winner = buyNet <= rentNet ? '購入' : '賃貸';
  document.getElementById('res-winner').textContent = `🏆 ${winner}が有利！`;
  document.getElementById('res-diff').textContent   = `${period}年間で ${fmtManLarge(diff)} の差`;
  document.getElementById('res-winner-card').style.borderTopColor = winner === '購入' ? 'var(--primary)' : 'var(--green)';

  // 住宅ローン控除表示
  const taxBox = document.getElementById('tax-deduction-box');
  if (taxApply && taxDeduction > 0) {
    taxBox.innerHTML = `💴 住宅ローン控除（13年間）の節税効果: <strong>${fmtManLarge(taxDeduction)}</strong>（購入コストから控除済み）`;
    taxBox.style.display = 'block';
  } else {
    taxBox.style.display = 'none';
  }

  // アドバイスカード
  const adviceEl = document.getElementById('advice-card');
  const adviceLines = [];
  if (breakEven !== null && breakEven > 0) {
    adviceLines.push(`📍 <strong>${breakEven}年以上住む予定</strong>なら購入が有利です。`);
  }
  if (winner === '購入') {
    adviceLines.push(`🏠 物件購入は<strong>長期居住・資産形成</strong>に向いています。金利上昇リスクにも備えましょう。`);
  } else {
    adviceLines.push(`🏢 賃貸は<strong>ライフスタイルの柔軟性</strong>が強みです。差額を投資に回すことでさらに有利になります。`);
  }
  if (rate >= 2) adviceLines.push(`⚠️ 金利 ${rate}% は高めです。変動金利への切替や繰り上げ返済の検討を。`);
  if (down < price * 0.1) adviceLines.push(`💡 頭金が物件価格の10%未満です。諸費用込みで不足しないか確認を。`);
  adviceEl.innerHTML = `<h3 style="font-size:15px;font-weight:800;color:var(--orange);margin-bottom:10px">💡 あなたへのアドバイス</h3>` +
    adviceLines.map(l => `<p style="margin-bottom:6px;font-size:14px;line-height:1.7">${l}</p>`).join('');

  // 損益分岐点テキスト
  const bebox = document.getElementById('breakeven-box');
  if (breakEven === 0) {
    bebox.innerHTML = '購入は初年度から賃貸より安い計算です。';
  } else if (breakEven !== null) {
    bebox.innerHTML = `📍 損益分岐点: <strong>${breakEven}年目</strong> — ${breakEven}年以上住むなら購入が有利`;
  } else {
    bebox.innerHTML = `📍 ${period}年間では賃貸が有利。長期比較や家賃値上がり率を調整してみてください。`;
  }

  // Chart.js グラフ
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
      plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + fmtManLarge(c.parsed.y) } } },
      scales: {
        y: { ticks: { callback: v => fmtManLarge(v) } }
      }
    }
  });

  document.getElementById('result-compare').style.display = 'block';
  document.getElementById('result-compare').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── TAB2: 住み替えコスト ───────────────────────────────────────────
document.getElementById('calc-move').addEventListener('click', () => {
  const fromType = document.getElementById('m-from-type').value;
  const toType   = document.getElementById('m-to-type').value;
  const moveCost = +document.getElementById('m-move-cost').value;
  const other    = +document.getElementById('m-other').value;

  const items = [];

  // 退去側
  if (fromType === 'rent') {
    const fromRent = +document.getElementById('m-from-rent').value;
    items.push({ label: '退去クリーニング費用（概算）', val: Math.round(fromRent * 0.5 * 10) / 10 });
    items.push({ label: '賃貸 違約金・短期解約料（目安）', val: 0, note: '契約次第' });
  } else {
    const sell  = +document.getElementById('m-from-sell').value;
    const loan  = +document.getElementById('m-from-loan').value;
    const agentFee = Math.round(sell * 0.033 + 6.6);  // 仲介手数料上限
    items.push({ label: '売却 仲介手数料（3%+6.6万）', val: agentFee });
    items.push({ label: '抵当権抹消・司法書士費用', val: 3 });
    const gain = sell - loan - agentFee - 3;
    items.push({ label: `売却手取り（参考）`, val: gain, plus: true });
  }

  // 入居側
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

  // 共通
  items.push({ label: '引越し費用', val: moveCost });
  if (other > 0) items.push({ label: 'その他費用', val: other });

  // 合計（プラス＝収入は除く）
  const costItems = items.filter(it => !it.plus && it.val > 0);
  const total = costItems.reduce((s, it) => s + it.val, 0);

  const container = document.getElementById('move-items');
  container.innerHTML = items.map(it => `
    <div class="move-item">
      <span class="move-item-label">${it.label}${it.note ? ' <small>('+it.note+')</small>' : ''}</span>
      <span class="move-item-val" style="${it.plus ? 'color:var(--green)' : ''}">${it.val === 0 && it.note ? '—' : (it.plus ? '＋' : '') + fmtMan(it.val)}</span>
    </div>
  `).join('');

  document.getElementById('move-total').textContent = `住み替え 総費用（概算）: ${fmtMan(total)}`;
  document.getElementById('result-move').style.display = 'block';
  document.getElementById('result-move').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── TAB3: ローン返済 ──────────────────────────────────────────────
let chartLoan = null;

document.getElementById('calc-loan').addEventListener('click', () => {
  const amount = +document.getElementById('l-amount').value;  // 借入万円
  const annualRate = +document.getElementById('l-rate').value; // 年利%
  const lYears = +document.getElementById('l-years').value;
  const lType  = document.getElementById('l-type').value;
  const bonus  = +document.getElementById('l-bonus').value;   // ボーナス 年万円

  if (!amount) { alert('借入金額を入力してください'); return; }

  const lMonths = lYears * 12;
  const r = annualRate / 100 / 12;

  let monthlyBase, totalPaid, totalInterest;

  if (lType === 'equal') {
    // 元利均等
    monthlyBase = calcMonthlyPayment(amount, annualRate, lMonths);
    totalPaid = monthlyBase * lMonths + bonus * lYears;
    totalInterest = totalPaid - amount;
  } else {
    // 元金均等
    monthlyBase = amount / lMonths;
    let totalInt = 0;
    let balance = amount;
    for (let m = 1; m <= lMonths; m++) {
      totalInt += balance * r;
      balance -= monthlyBase;
    }
    totalInterest = totalInt + bonus * lYears * 0; // ボーナス分は利息なし近似
    totalPaid = amount + totalInterest + bonus * lYears;
  }

  document.getElementById('l-monthly').textContent  = fmtMan(monthlyBase + bonus / 12);
  document.getElementById('l-total').textContent    = fmtManLarge(totalPaid);
  document.getElementById('l-interest').textContent = fmtManLarge(totalInterest);
  document.getElementById('l-ratio').textContent    = (totalInterest / amount * 100).toFixed(1) + '%';

  // 残高推移データ（年ごと）
  const balances = [amount];
  const principals = [0];
  const interests = [0];
  let bal = amount;

  for (let y = 1; y <= lYears; y++) {
    let yearPrincipal = 0, yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      const int = bal * r;
      let prin;
      if (lType === 'equal') {
        prin = monthlyBase - int;
      } else {
        prin = amount / lMonths;
      }
      yearInterest += int;
      yearPrincipal += prin;
      bal = Math.max(0, bal - prin);
    }
    balances.push(+bal.toFixed(1));
    principals.push(+yearPrincipal.toFixed(1));
    interests.push(+yearInterest.toFixed(1));
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
      <td>${yr === 0 ? fmtMan(monthlyBase) : '—'}</td>
      <td>${fmtMan(principals[yr] || 0)}</td>
      <td>${fmtMan(interests[yr] || 0)}</td>
      <td>${fmtManLarge(balances[yr])}</td>
    </tr>`;
    if (yr >= lYears) break;
  }
  // 最終行
  if (lYears % 5 !== 0) {
    rows += `<tr>
      <td>${lYears}年目（完済）</td>
      <td>—</td>
      <td>${fmtMan(principals[lYears] || 0)}</td>
      <td>${fmtMan(interests[lYears] || 0)}</td>
      <td>${fmtManLarge(balances[lYears])}</td>
    </tr>`;
  }
  table.innerHTML = rows;

  document.getElementById('result-loan').style.display = 'block';
  document.getElementById('result-loan').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
