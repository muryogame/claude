// Statistics, heatmap, and achievements rendering.
import { isDone, getCompletionRate, getLongestStreak, getAchievData, getToday } from './store.js';
import { CATEGORIES, ACHIEVEMENTS } from './constants.js';

// ── Stats page ────────────────────────────────────────────────
export function renderStats(habits) {
  renderStatCards(habits);
  renderHeatmap(habits);
  renderCharts(habits);
}

function renderStatCards(habits) {
  const d       = getAchievData(habits);
  const avgRate = habits.length
    ? Math.round(habits.reduce((s, h) => s + getCompletionRate(h), 0) / habits.length)
    : 0;

  const el = document.getElementById('statsGrid');
  el.innerHTML = '';

  const items = [
    ['登録習慣数',     habits.length],
    ['今日の完了',     habits.filter(h => isDone(h)).length + '/' + habits.length],
    ['最長ストリーク', d.maxStreak],
    ['平均達成率',     avgRate + '%'],
    ['累計チェック',   d.totalChecks],
    ['完璧な日',       d.perfectDays],
  ];

  items.forEach(([lbl, val]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    const vEl = document.createElement('div');
    vEl.className = 'stat-val';
    vEl.textContent = String(val);
    const lEl = document.createElement('div');
    lEl.className = 'stat-lbl';
    lEl.textContent = lbl;
    card.append(vEl, lEl);
    el.appendChild(card);
  });
}

// ── Monthly heatmap ───────────────────────────────────────────
export function renderHeatmap(habits) {
  const hc  = document.getElementById('heatmapCard');
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const first    = new Date(year, month, 1);
  const startDow = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = getToday();
  const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

  hc.innerHTML = '';

  const title = document.createElement('h4');
  title.textContent = `${year}年${month + 1}月の達成状況`;
  hc.appendChild(title);

  const header = document.createElement('div');
  header.className = 'month-header';
  DAY_LABELS.forEach(l => {
    const d = document.createElement('div');
    d.className = 'day-lbl';
    d.textContent = l;
    header.appendChild(d);
  });
  hc.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'month-grid';
  grid.setAttribute('role', 'grid');

  for (let i = 0; i < startDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell other-month';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date    = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = date === today;
    const total   = habits.length;
    const done    = total ? habits.filter(h => isDone(h, date)).length : 0;
    const level   = total === 0 ? 0 : done === 0 ? 0 : done === total ? 3 : done / total > 0.5 ? 2 : 1;

    const cell = document.createElement('div');
    cell.className = 'day-cell hm-' + level + (isToday ? ' hm-today' : '');
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${month + 1}月${day}日 ${done}/${total}完了`);
    cell.textContent = day;
    grid.appendChild(cell);
  }
  hc.appendChild(grid);
}

// ── Habit completion charts ───────────────────────────────────
export function renderCharts(habits) {
  const cc = document.getElementById('chartCard');
  cc.innerHTML = '';

  const h4 = document.createElement('h4');
  h4.textContent = '習慣別の達成率';
  cc.appendChild(h4);

  if (!habits.length) {
    const msg = document.createElement('div');
    msg.style.cssText = 'text-align:center;padding:16px;color:var(--outline);font-size:13px';
    msg.textContent = '習慣を追加すると表示されます';
    cc.appendChild(msg);
    return;
  }

  const sorted = [...habits].sort((a, b) => getCompletionRate(b) - getCompletionRate(a));
  sorted.forEach(h => {
    const rate    = getCompletionRate(h);
    const catColor = CATEGORIES.find(c => c.id === h.cat)?.color ?? '#4CAF50';

    const row = document.createElement('div');
    row.className = 'bar-row';

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = h.emoji + ' ' + h.name; // store-validated

    const track = document.createElement('div');
    track.className = 'bar-track';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = rate + '%';
    fill.style.background = `linear-gradient(90deg, ${catColor}, ${catColor}99)`;
    track.appendChild(fill);

    const pct = document.createElement('div');
    pct.className = 'bar-pct';
    pct.textContent = rate + '%';

    row.append(label, track, pct);
    cc.appendChild(row);
  });
}

// ── Achievements ─────────────────────────────────────────────
export function renderAchievements(habits, unlockedIds) {
  const d  = getAchievData(habits);
  const ag = document.getElementById('achievGrid');
  ag.innerHTML = '';

  ACHIEVEMENTS.forEach(a => {
    const unlocked = unlockedIds.includes(a.id) || a.check(d);
    const badge = document.createElement('div');
    badge.className = 'badge' + (unlocked ? '' : ' locked');
    badge.setAttribute('aria-label', a.name + (unlocked ? ' 解除済み' : ' 未解除'));

    const ico  = document.createElement('div');
    ico.className = 'badge-ico';
    ico.setAttribute('aria-hidden', 'true');
    ico.textContent = a.ico;

    const nm = document.createElement('div');
    nm.className = 'badge-name';
    nm.textContent = a.name;

    const ul = document.createElement('div');
    ul.className = 'badge-unlock';
    ul.textContent = a.desc;

    badge.append(ico, nm, ul);
    ag.appendChild(badge);
  });
}

/** Returns array of newly-unlocked achievement IDs. */
export function checkNewAchievements(habits, unlockedIds) {
  const d       = getAchievData(habits);
  const newIds  = [];
  ACHIEVEMENTS.forEach(a => {
    if (!unlockedIds.includes(a.id) && a.check(d)) newIds.push(a.id);
  });
  return newIds;
}
