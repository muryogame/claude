// Entry point — navigation, companion, sheet, events, confetti.
import {
  loadHabits, saveHabits, buildHabit, isDone, getStreak,
  loadUnlockedAchievements, saveUnlockedAchievements,
  getToday, isFreeLimit, sanitizeText, getAchievData, getGlobalStreak,
} from './store.js';
import { renderHabitList, renderCatFilter, syncCatFilter, updateSummary } from './ui.js';
import { renderStats, renderAchievements, checkNewAchievements } from './stats.js';
import { CATEGORIES, EMOJIS, TEMPLATES } from './constants.js';
import {
  getStage, getNextStage, getProgressRatio, getDailyMsg,
  buildShareText, shareCard,
} from './companion.js';

// ── App state ─────────────────────────────────────────────────
let habits      = loadHabits();
let activePage  = 'today';
let activeCat   = 'all';
let selectedEmoji = '🌟';
let selectedCat   = '';
let unlockedIds   = loadUnlockedAchievements();
let snackTimer    = null;

// ── Bootstrap ─────────────────────────────────────────────────
function init() {
  setupDateDisplay();
  setupCatFilter();
  setupCatSelect();
  setupEmojiPicker();
  setupTemplates();
  setupEventListeners();
  setupInstallPrompt();
  renderPage('today');
}

// ── Navigation ────────────────────────────────────────────────
function renderPage(page) {
  activePage = page;
  ['today', 'stats', 'achiev'].forEach(id => {
    const cap = id.charAt(0).toUpperCase() + id.slice(1);
    document.getElementById('page' + cap)?.classList.toggle('on', id === page);
    document.getElementById('nav'  + cap)?.classList.toggle('on', id === page);
  });
  document.getElementById('fab').style.display = page === 'today' ? '' : 'none';
  if (page === 'today')  renderToday();
  if (page === 'stats')  renderStats(habits);
  if (page === 'achiev') renderAchievements(habits, unlockedIds);
}

function renderToday() {
  renderCatFilter(activeCat, id => {
    activeCat = id;
    syncCatFilter(activeCat);
    renderHabitList(habits, activeCat, { onToggle: toggleHabit, onDelete: deleteHabit });
  });
  renderHabitList(habits, activeCat, { onToggle: toggleHabit, onDelete: deleteHabit });
  renderCompanion();
}

// ── Companion ─────────────────────────────────────────────────
function renderCompanion() {
  const d          = getAchievData(habits);
  const total      = d.totalChecks;
  const stage      = getStage(total);
  const next       = getNextStage(total);
  const pct        = getProgressRatio(total);

  document.getElementById('companionEmoji').textContent = stage.emoji;
  document.getElementById('companionName').textContent  = stage.name;
  document.getElementById('companionMsg').textContent   = getDailyMsg(stage);
  document.getElementById('companionBar').style.width   = Math.round(pct * 100) + '%';

  // Show next stage hint as tooltip
  if (next) {
    const companionInfo = document.querySelector('.companion-info');
    companionInfo.title = `次のステージ「${next.name}」まであと ${next.min - total} 回`;
  }
}

// ── Habit actions ─────────────────────────────────────────────
function toggleHabit(id) {
  const h = habits.find(x => x.id === id);
  if (!h) return;
  if (!Array.isArray(h.completedDates)) h.completedDates = [];
  const today = getToday();

  if (isDone(h)) {
    h.completedDates = h.completedDates.filter(d => d !== today);
    snack('取り消しました');
  } else {
    h.completedDates.push(today);
    const streak = getStreak(h);
    let msg = '✅ 完了！';
    if (streak >= 30)     msg = '🏆 ' + streak + '日連続！伝説だ！';
    else if (streak >= 7) msg = '🔥 ' + streak + '日連続！';
    else if (streak >= 3) msg = '✨ ' + streak + '日連続！';
    snack(msg);
    navigator.vibrate?.(streak >= 7 ? [30, 15, 60] : 40);
  }

  saveHabits(habits);

  const newIds = checkNewAchievements(habits, unlockedIds);
  if (newIds.length) {
    unlockedIds = [...unlockedIds, ...newIds];
    saveUnlockedAchievements(unlockedIds);
    setTimeout(() => snack('🏅 バッジ解除！ バッジタブで確認しよう'), 1200);
    navigator.vibrate?.([50, 30, 100, 30, 150]);
  }

  renderToday();
  if (activePage === 'stats')  renderStats(habits);
  if (activePage === 'achiev') renderAchievements(habits, unlockedIds);

  const allDone = updateSummary(habits);
  if (allDone) { fireConfetti(); setTimeout(() => snack('🎉 今日の習慣を全部達成！ Hanaも喜んでいるよ🌱'), 300); }
}

function deleteHabit(id) {
  if (!confirm('この習慣を削除しますか？\n（記録も削除されます）')) return;
  habits = habits.filter(h => h.id !== id);
  saveHabits(habits);
  renderToday();
  snack('削除しました');
}

function addHabit() {
  const name = sanitizeText(document.getElementById('habitInput').value);
  if (!name) { document.getElementById('habitInput').focus(); return; }
  if (isFreeLimit(habits)) { showPremAlert(); return; }
  habits.push(buildHabit({ name, emoji: selectedEmoji, cat: selectedCat || 'life', time: document.getElementById('timeSelect').value }));
  saveHabits(habits);
  closeSheet();
  renderToday();
  snack('✅ 習慣を追加しました！Hanaも一緒に頑張るよ🌱');
  const newIds = checkNewAchievements(habits, unlockedIds);
  if (newIds.length) { unlockedIds = [...unlockedIds, ...newIds]; saveUnlockedAchievements(unlockedIds); }
}

// ── Share streak card ─────────────────────────────────────────
async function handleShare() {
  const globalStreak = getGlobalStreak(habits);
  const d            = getAchievData(habits);
  const text         = buildShareText(habits, d.totalChecks, globalStreak);
  const result       = await shareCard(text);
  if (result === 'copied') snack('📋 クリップボードにコピーしました！');
  else if (result === 'shared') snack('📤 シェアしました！');
}

// ── Sheet ─────────────────────────────────────────────────────
function openSheet() {
  document.getElementById('habitInput').value = '';
  document.getElementById('timeSelect').value = '';
  selectedCat = '';
  document.querySelectorAll('#catSelect .cat-chip').forEach(el => el.classList.remove('active'));
  const btn = document.getElementById('submitBtn');
  if (isFreeLimit(habits)) { btn.textContent = 'Proにアップグレード（7日間無料）'; btn.onclick = showPremAlert; }
  else                     { btn.textContent = '習慣を追加する'; btn.onclick = addHabit; }
  document.getElementById('sheet').classList.add('on');
  document.getElementById('overlayBg').classList.add('on');
  history.pushState({ sheet: true }, '');
  setTimeout(() => document.getElementById('habitInput').focus(), 350);
}
function closeSheet() {
  document.getElementById('sheet').classList.remove('on');
  document.getElementById('overlayBg').classList.remove('on');
}

// ── Setup helpers ─────────────────────────────────────────────
function setupDateDisplay() {
  const now = new Date(), DOW = ['日','月','火','水','木','金','土'];
  document.getElementById('datePill').textContent = `${now.getMonth()+1}月${now.getDate()}日（${DOW[now.getDay()]}）`;
}
function setupCatFilter() {
  renderCatFilter('all', id => { activeCat = id; syncCatFilter(activeCat); renderHabitList(habits, activeCat, { onToggle: toggleHabit, onDelete: deleteHabit }); });
}
function setupCatSelect() {
  const el = document.getElementById('catSelect'); el.innerHTML = '';
  CATEGORIES.slice(1).forEach(c => {
    const chip = document.createElement('div');
    chip.className = 'cat-chip'; chip.dataset.cat = c.id;
    chip.textContent = c.emoji + ' ' + c.label;
    chip.setAttribute('role', 'button'); chip.setAttribute('tabindex', '0');
    chip.addEventListener('click', () => { selectedCat = c.id; document.querySelectorAll('#catSelect .cat-chip').forEach(el => el.classList.toggle('active', el.dataset.cat === c.id)); });
    el.appendChild(chip);
  });
}
function setupEmojiPicker() {
  const ep = document.getElementById('emojiPicker'); ep.innerHTML = '';
  EMOJIS.forEach(e => {
    const btn = document.createElement('button');
    btn.className = 'ep-btn' + (e === selectedEmoji ? ' on' : '');
    btn.textContent = e; btn.setAttribute('aria-label', e);
    btn.addEventListener('click', () => { selectedEmoji = e; document.getElementById('curEmoji').textContent = e; ep.querySelectorAll('.ep-btn').forEach(b => b.classList.toggle('on', b.textContent === e)); });
    ep.appendChild(btn);
  });
}
function setupTemplates() {
  const el = document.getElementById('templates'); el.innerHTML = '';
  TEMPLATES.forEach(t => {
    const chip = document.createElement('div');
    chip.className = 'tpl-chip'; chip.setAttribute('role', 'listitem');
    chip.textContent = t.emoji + ' ' + t.name;
    chip.addEventListener('click', () => {
      document.getElementById('habitInput').value = t.name;
      selectedEmoji = t.emoji; document.getElementById('curEmoji').textContent = t.emoji;
      document.getElementById('emojiPicker').querySelectorAll('.ep-btn').forEach(b => b.classList.toggle('on', b.textContent === t.emoji));
      if (t.time) document.getElementById('timeSelect').value = t.time;
      selectedCat = t.cat;
      document.querySelectorAll('#catSelect .cat-chip').forEach(el => el.classList.toggle('active', el.dataset.cat === t.cat));
    });
    el.appendChild(chip);
  });
}

function setupEventListeners() {
  document.getElementById('fab').addEventListener('click', openSheet);
  document.getElementById('overlayBg').addEventListener('click', closeSheet);
  document.getElementById('habitInput').addEventListener('keydown', e => { if (e.key === 'Enter') addHabit(); });
  document.getElementById('navToday') .addEventListener('click', () => renderPage('today'));
  document.getElementById('navStats') .addEventListener('click', () => renderPage('stats'));
  document.getElementById('navAchiev').addEventListener('click', () => renderPage('achiev'));
  document.getElementById('premBanner').addEventListener('click', showPremAlert);
  document.getElementById('shareBtn')?.addEventListener('click', handleShare);
  window.addEventListener('popstate', () => { if (document.getElementById('sheet').classList.contains('on')) closeSheet(); });
}

function setupInstallPrompt() {
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredInstall = e;
    document.getElementById('installBanner').style.display = 'flex';
  });
  document.getElementById('installBtn').addEventListener('click', async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt(); await deferredInstall.userChoice;
    deferredInstall = null; document.getElementById('installBanner').style.display = 'none';
  });
  document.getElementById('installClose').addEventListener('click', () => { document.getElementById('installBanner').style.display = 'none'; });
  window.addEventListener('appinstalled', () => { document.getElementById('installBanner').style.display = 'none'; });
}

// ── Premium ───────────────────────────────────────────────────
function showPremAlert() { closeSheet(); snack('⭐ 7日間無料！Pro版で無制限の習慣と詳細分析が使えます'); }

// ── Snackbar ──────────────────────────────────────────────────
function snack(msg) {
  const el = document.getElementById('snack');
  el.textContent = msg; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  clearTimeout(snackTimer); snackTimer = setTimeout(() => el.classList.remove('on'), 2800);
}

// ── Confetti ──────────────────────────────────────────────────
const cfCanvas = document.getElementById('cf'), cfCtx = cfCanvas.getContext('2d');
let cfParts = [], cfRaf = null, lastConfettiTime = 0;
function fireConfetti() {
  const now = Date.now(); if (now - lastConfettiTime < 3000) return; lastConfettiTime = now;
  cfCanvas.width = window.innerWidth; cfCanvas.height = window.innerHeight;
  const cols = ['#FFD700','#4CAF50','#E91E63','#9C27B0','#2196F3','#FF5722','#00BCD4'];
  cfParts = Array.from({ length: 100 }, () => ({ x: Math.random()*cfCanvas.width, y: -20, vx: (Math.random()-.5)*7, vy: Math.random()*7+3, r: Math.random()*6+3, rot: Math.random()*360, rotV: (Math.random()-.5)*9, color: cols[Math.floor(Math.random()*cols.length)], life: 1, shape: Math.random()<.5?'rect':'circle' }));
  cancelAnimationFrame(cfRaf); animateCf();
}
function animateCf() {
  cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);
  cfParts.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=.12; p.rot+=p.rotV; p.life-=.009; cfCtx.globalAlpha=Math.max(0,p.life); cfCtx.fillStyle=p.color; cfCtx.save(); cfCtx.translate(p.x,p.y); cfCtx.rotate(p.rot*Math.PI/180); if(p.shape==='rect') cfCtx.fillRect(-p.r,-p.r*.5,p.r*2,p.r); else{cfCtx.beginPath();cfCtx.arc(0,0,p.r*.6,0,Math.PI*2);cfCtx.fill();} cfCtx.restore(); });
  cfCtx.globalAlpha = 1;
  cfParts = cfParts.filter(p => p.life > 0);
  if (cfParts.length) cfRaf = requestAnimationFrame(animateCf);
  else cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);
}

init();
