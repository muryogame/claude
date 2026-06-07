// Habit list and summary rendering.
// Security: user data is always set via textContent, never innerHTML.
import { isDone, getStreak, getCompletionRate, getGlobalStreak, getToday } from './store.js';
import { CATEGORIES } from './constants.js';

/** Rebuild the habit list for today's page. */
export function renderHabitList(habits, activeCat, { onToggle, onDelete }) {
  const listEl  = document.getElementById('habitList');
  const emptyEl = document.getElementById('emptyState');
  const countEl = document.getElementById('habitCount');

  const filtered = activeCat === 'all' ? habits : habits.filter(h => h.cat === activeCat);
  countEl.textContent = filtered.length + '個';

  if (!habits.length) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    updateSummary(habits);
    return;
  }
  emptyEl.style.display = 'none';

  if (!filtered.length) {
    listEl.innerHTML = '';
    listEl.appendChild(buildEmptySearch());
    updateSummary(habits);
    return;
  }

  // Sort: pending (at-risk first) → pending (normal) → done
  const today = getToday();
  const sorted = [...filtered].sort((a, b) => {
    const aDone   = isDone(a), bDone = isDone(b);
    if (aDone !== bDone) return aDone ? 1 : -1;   // done go to bottom
    const aRisk   = !aDone && getStreak(a) >= 3;
    const bRisk   = !bDone && getStreak(b) >= 3;
    return bRisk ? 1 : aRisk ? -1 : 0;             // at-risk go to top
  });

  listEl.innerHTML = '';
  sorted.forEach(h => {
    const wrapper = buildHabitItem(h, onToggle, onDelete);
    listEl.appendChild(wrapper);
  });

  updateSummary(habits);
}

/** Rebuild category filter chips. */
export function renderCatFilter(activeCat, onSelect) {
  const el = document.getElementById('catFilter');
  el.innerHTML = '';
  CATEGORIES.forEach(c => {
    const chip = document.createElement('div');
    chip.className = 'cat-chip' + (c.id === activeCat ? ' active' : '');
    chip.dataset.cat = c.id;
    chip.textContent = c.emoji + ' ' + c.label;
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.addEventListener('click', () => onSelect(c.id));
    el.appendChild(chip);
  });
}

export function syncCatFilter(activeCat) {
  document.querySelectorAll('#catFilter .cat-chip').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === activeCat);
  });
}

// ── Summary card ─────────────────────────────────────────────
export function updateSummary(habits) {
  const done  = habits.filter(h => isDone(h)).length;
  const total = habits.length;
  const pct   = total ? done / total : 0;

  document.getElementById('ringTrack').style.strokeDashoffset = 214 * (1 - pct);
  document.getElementById('ringNum').textContent = done + '/' + total;
  document.getElementById('ringWrap').setAttribute('aria-valuenow', Math.round(pct * 100));
  document.getElementById('globalStreak').textContent = '🔥 ' + getGlobalStreak(habits) + '日';

  const now = new Date();
  const hr  = now.getHours();
  document.getElementById('greeting').textContent =
    hr < 12 ? 'おはようございます！' : hr < 18 ? 'こんにちは！' : 'こんばんは！';
  const DOW = ['日', '月', '火', '水', '木', '金', '土'];
  document.getElementById('sumDate').textContent =
    `${now.getMonth() + 1}月${now.getDate()}日（${DOW[now.getDay()]}）`;

  const MSGS = [
    ['さあ始めよう！',    '今日の習慣をチェックしよう'],
    ['いいスタート！',    'この調子で続けよう 💪'],
    ['順調です！',        'もう少しで今日は完璧 ⭐'],
    ['もう少し！',        'あとちょっとで全完了 🎯'],
    ['完璧な1日！🎉',    '全習慣を達成しました！'],
  ];
  const idx = total === 0 ? 0 : done === total ? 4 : Math.min(3, Math.floor(pct * 3.5));
  document.getElementById('sumTitle').textContent = MSGS[idx][0];
  document.getElementById('sumSub').textContent   = MSGS[idx][1];

  return done === total && total > 0; // returns true when all done
}

// ── Private builders ──────────────────────────────────────────

/**
 * Wraps a habit card in a swipe container.
 * Swipe left > 72px reveals the delete button.
 */
function buildHabitItem(h, onToggle, onDelete) {
  const wrapper = document.createElement('div');
  wrapper.className = 'habit-item';

  // Delete background (revealed on swipe)
  const bg = document.createElement('div');
  bg.className = 'swipe-bg';
  const delSwipeBtn = document.createElement('button');
  delSwipeBtn.className = 'swipe-del-btn';
  delSwipeBtn.textContent = '🗑️ 削除';
  delSwipeBtn.addEventListener('click', () => onDelete(h.id));
  bg.appendChild(delSwipeBtn);

  const card = buildHabitCard(h, onToggle, onDelete, wrapper);

  wrapper.append(bg, card);
  attachSwipe(card, wrapper, () => onDelete(h.id));
  return wrapper;
}

function buildHabitCard(h, onToggle, onDelete, wrapper) {
  const done     = isDone(h);
  const streak   = getStreak(h);
  const rate     = getCompletionRate(h);
  const catColor = CATEGORIES.find(c => c.id === h.cat)?.color ?? '#4CAF50';
  const atRisk   = !done && streak >= 3;
  const timeLabel = { morning: '☀️朝', afternoon: '☀️昼', evening: '🌙夜' }[h.time] ?? '';

  const card = document.createElement('div');
  card.className = 'habit-card' + (done ? ' done' : '') + (atRisk ? ' at-risk' : '');
  card.style.borderLeftColor = done ? catColor : (atRisk ? '#FF6F00' : catColor + '44');

  // At-risk badge
  if (atRisk) {
    const badge = document.createElement('div');
    badge.className = 'at-risk-badge';
    badge.textContent = '🔥 ' + streak + '日危険！';
    card.appendChild(badge);
  }

  // Emoji badge
  const emojiEl = document.createElement('div');
  emojiEl.className = 'emoji-badge';
  emojiEl.style.background = catColor + '22';
  emojiEl.textContent = h.emoji;

  // Info
  const info = document.createElement('div');
  info.className = 'habit-info';

  const name = document.createElement('div');
  name.className = 'habit-name';
  name.textContent = h.name;

  const meta = document.createElement('div');
  meta.className = 'habit-meta';

  const streakChip = document.createElement('span');
  streakChip.className = 'streak-chip' + (atRisk ? ' risk' : '');
  streakChip.textContent = streak > 0 ? '🔥 ' + streak + '日連続' : 'まだ0日';

  const rateChip = document.createElement('span');
  rateChip.className = 'rate-chip';
  rateChip.textContent = rate + '% 達成';

  meta.append(streakChip, rateChip);
  if (timeLabel) {
    const tc = document.createElement('span');
    tc.className = 'time-chip';
    tc.textContent = timeLabel;
    meta.appendChild(tc);
  }

  // Mini progress bar
  const miniBar = document.createElement('div');
  miniBar.className = 'mini-bar';
  const fill = document.createElement('div');
  fill.className = 'mini-bar-fill';
  fill.style.width      = rate + '%';
  fill.style.background = catColor;
  miniBar.appendChild(fill);

  // Weekly dots (last 7 days)
  const weekDots = buildWeekDots(h);

  info.append(name, meta, miniBar, weekDots);

  // Check button
  const checkBtn = document.createElement('button');
  checkBtn.className = 'check-btn';
  checkBtn.setAttribute('aria-label', done ? '完了を取り消す' : '完了にする');
  checkBtn.addEventListener('click', e => { e.stopPropagation(); onToggle(h.id); });

  // ⋮ menu button
  const delBtn = document.createElement('button');
  delBtn.className = 'del-btn';
  delBtn.setAttribute('aria-label', '削除');
  delBtn.textContent = '⋮';
  delBtn.addEventListener('click', e => { e.stopPropagation(); onDelete(h.id); });

  card.append(emojiEl, info, checkBtn, delBtn);
  return card;
}

function buildWeekDots(habit) {
  const today = getToday();
  const container = document.createElement('div');
  container.className = 'week-dots';
  container.setAttribute('aria-label', '過去7日間の達成状況');

  const base = new Date(today);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const filled  = habit.completedDates?.includes(ds) ?? false;
    const isToday = i === 0;

    const dot = document.createElement('div');
    dot.className = 'week-dot' + (filled ? ' filled' : '') + (isToday ? ' today' : '');
    dot.setAttribute('aria-label', `${i === 0 ? '今日' : i + '日前'}: ${filled ? '完了' : '未完了'}`);
    container.appendChild(dot);
  }
  return container;
}

/** Attach swipe-left-to-reveal gesture to a habit card. */
function attachSwipe(card, wrapper, onConfirmDelete) {
  let startX = 0, startY = 0, isSwiping = false, revealed = false;

  card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = false;
    card.style.transition = 'none';
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (!isSwiping) {
      if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 8) return;
      isSwiping = true;
    }
    if (dx < 0) {
      const clamp = revealed ? Math.max(-144, dx - 72) : Math.max(-72, dx);
      card.style.transform = `translateX(${clamp}px)`;
    } else if (revealed && dx > 0) {
      const shift = Math.min(0, -72 + dx);
      card.style.transform = `translateX(${shift}px)`;
    }
  }, { passive: true });

  card.addEventListener('touchend', e => {
    if (!isSwiping) return;
    const dx = e.changedTouches[0].clientX - startX;
    card.style.transition = 'transform .22s ease';

    if (dx < -50 && !revealed) {
      card.style.transform = 'translateX(-72px)';
      revealed = true;
    } else if ((dx > 30 && revealed) || dx > 80) {
      card.style.transform = '';
      revealed = false;
    } else if (revealed) {
      card.style.transform = 'translateX(-72px)';
    } else {
      card.style.transform = '';
    }
    isSwiping = false;
  }, { passive: true });
}

function buildEmptySearch() {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.style.padding = '32px 0';
  const ico = document.createElement('div');
  ico.style.cssText = 'font-size:40px;margin-bottom:8px';
  ico.textContent = '🔍';
  const t = document.createElement('div');
  t.className = 'empty-title';
  t.style.fontSize = '16px';
  t.textContent = 'このカテゴリはありません';
  div.append(ico, t);
  return div;
}
