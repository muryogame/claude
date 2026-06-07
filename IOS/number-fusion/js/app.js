// Entry point — orchestrates GameState, Renderer, Audio, Daily Challenge, and FX.
import { GameState } from './game.js';
import { Renderer }  from './render.js';
import { TILE_STYLES } from './constants.js';
import {
  getDailyId, getDailyNumber, generateDailyTiles,
  saveDailyResult, loadDailyResult,
  updateDailyStreak, loadDailyStreak,
  buildShareText, shareResult,
} from './daily.js';

// ── Module state ──────────────────────────────────────────────
const state    = new GameState();
const renderer = new Renderer();
const tileDom  = new Map();

let soundOn  = parseInt(localStorage.getItem('nf_sound') ?? '1', 10) === 1;
let audioCtx = null;
let gameMode = 'free'; // 'free' | 'daily'
let dailyDone = false;

// ── Sizing ────────────────────────────────────────────────────
const getGridSize = () => Math.min(window.innerWidth * 0.92, 420);

function applyResize() {
  renderer.resize(getGridSize());
  const enriched = new Map(
    [...state.tileMap.entries()].map(([id, t]) => [id, { ...t, el: tileDom.get(id) }])
  );
  renderer.repositionAll(enriched);
}

// ── Tile helpers ──────────────────────────────────────────────
function createTileEl(id, val, r, c, cls) {
  const el = renderer.createTile(id, val, r, c, cls);
  tileDom.set(id, el);
  return el;
}
function removeTileEl(id) {
  renderer.removeTile(tileDom.get(id));
  tileDom.delete(id);
}

// ── Move ──────────────────────────────────────────────────────
async function doMove(dir) {
  if (state.busy || state.gameOver) return;
  const plan = state.computeMove(dir);
  if (!plan.moved) return;

  state.busy = true;
  state.saveUndo();
  state.moves++;
  renderer.setUndoEnabled(false);

  for (const a of plan.actions.filter(a => a.t === 'mv')) {
    renderer.moveTile(tileDom.get(a.id), a.toR, a.toC);
  }
  await sleep(125);

  const newTiles = state.applyMerges(plan.actions);
  const consumed = new Set(plan.actions.filter(a => a.t === 'mg').flatMap(a => [a.idA, a.idB]));
  consumed.forEach(id => removeTileEl(id));

  for (const t of newTiles) {
    createTileEl(t.id, t.val, t.r, t.c, 't-merge');
    playMergeSound(t.val);
    renderer.showScorePopup(t.val, t.r, t.c);
    spawnMergeParticles(t.r, t.c, t.val);
  }

  state.addScore(plan.scoreDelta);
  navigator.vibrate?.(18);

  const spawned = state.addRandom();
  if (spawned) createTileEl(spawned.id, state.tileMap.get(spawned.id).val, spawned.r, spawned.c, 't-new');

  renderer.updateScore(state.score, state.best);
  renderer.updateProgress(state.getMaxVal());
  renderer.updateStats(state.moves, state.mergeCount, Date.now() - state.startTime);
  renderer.setUndoEnabled(true);
  updateBodyBg(state.getMaxVal());
  if (gameMode === 'free') saveGameState();

  state.busy = false;
  checkResult();
}

function checkResult() {
  const result = state.checkState();
  if (result === 'win') {
    state.gameOver = true;
    clearInterval(timerInterval);
    if (gameMode === 'daily') handleDailyEnd();
    setTimeout(() => {
      renderer.showDialog('🎉', '2048達成！', state.score, 'おめでとうございます！', true);
      document.getElementById('shareBtn').style.display = gameMode === 'daily' ? '' : 'none';
      document.getElementById('contBtn').style.display = '';
      fireConfetti();
      navigator.vibrate?.([100, 50, 100, 50, 200]);
    }, 200);
  } else if (result === 'over') {
    state.gameOver = true;
    clearInterval(timerInterval);
    if (gameMode === 'daily') handleDailyEnd();
    localStorage.removeItem('nf_save');
    setTimeout(() => {
      renderer.showDialog('💀', 'ゲームオーバー', state.score, `スコア: ${state.score.toLocaleString()}`, false);
      document.getElementById('shareBtn').style.display = gameMode === 'daily' ? '' : 'none';
      navigator.vibrate?.([200, 80, 200]);
    }, 200);
  }
}

function handleDailyEnd() {
  dailyDone = true;
  saveDailyResult(state.score, state.getMaxVal(), state.moves);
  updateDailyStreak();
  updateDailyBadge();
}

// ── Public API ────────────────────────────────────────────────
export function newGame() {
  gameMode = 'free';
  clearInterval(timerInterval);
  tileDom.forEach(el => el.remove());
  tileDom.clear();
  localStorage.removeItem('nf_save');
  state.init();
  renderer.closeDialog();
  renderer.setUndoEnabled(false);
  state.tileMap.forEach(t => createTileEl(t.id, t.val, t.r, t.c, 't-new'));
  renderer.updateScore(state.score, state.best);
  renderer.updateProgress(2);
  renderer.updateStats(0, 0, 0);
  updateBodyBg(2);
  document.getElementById('tabFree').classList.add('active');
  document.getElementById('tabDaily').classList.remove('active');
  startTimer();
}

export function switchMode(mode) {
  if (mode === 'daily') {
    openDailyPanel();
  } else {
    newGame();
  }
}

export function startDaily() {
  closeDailyPanel();
  gameMode = 'daily';
  clearInterval(timerInterval);
  tileDom.forEach(el => el.remove());
  tileDom.clear();
  state.init();
  renderer.closeDialog();
  renderer.setUndoEnabled(false);

  // Override initial tiles with today's seeded tiles
  const startTiles = generateDailyTiles();
  startTiles.forEach(({ r, c, val }) => {
    const id = ++state.nextId;
    state.cells[r][c] = id;
    state.tileMap.set(id, { id, val, r, c });
    createTileEl(id, val, r, c, 't-new');
  });

  renderer.updateScore(state.score, state.best);
  renderer.updateProgress(2);
  renderer.updateStats(0, 0, 0);
  updateBodyBg(2);

  document.getElementById('tabFree').classList.remove('active');
  document.getElementById('tabDaily').classList.add('active');
  startTimer();
}

export function undo() {
  if (state.busy) return;
  if (!state.restoreUndo()) return;
  tileDom.forEach(el => el.remove());
  tileDom.clear();
  state.tileMap.forEach(t => createTileEl(t.id, t.val, t.r, t.c, ''));
  renderer.updateScore(state.score, state.best);
  renderer.updateProgress(state.getMaxVal());
  renderer.updateStats(state.moves, state.mergeCount, Date.now() - state.startTime);
  renderer.setUndoEnabled(false);
  updateBodyBg(state.getMaxVal());
  navigator.vibrate?.(30);
}

export function confirmNew() {
  if (tileDom.size <= 2 && state.score === 0) { newGame(); return; }
  if (confirm('新しいゲームを始めますか？')) newGame();
}

export function closeDialog()  { renderer.closeDialog(); }
export function toggleSound()  {
  soundOn = !soundOn;
  try { localStorage.setItem('nf_sound', soundOn ? '1' : '0'); } catch {}
  renderer.setSoundIcon(soundOn);
}

export async function shareDaily() {
  const result = loadDailyResult();
  if (!result) return;
  const text = buildShareText(result.score, result.maxTile, state.cells, state.tileMap);
  const outcome = await shareResult(text);
  if (outcome === 'copied') snackMsg('📋 クリップボードにコピーしました！');
  else if (outcome === 'shared') snackMsg('📤 シェアしました！');
}

// ── Daily panel ───────────────────────────────────────────────
function openDailyPanel() {
  document.getElementById('dailyNumber').textContent = '#' + getDailyNumber();
  const existing = loadDailyResult();
  const startBtn  = document.getElementById('startDailyBtn');
  const resultEl  = document.getElementById('dailyResult');
  const scoreEl   = document.getElementById('dailyResultScore');

  if (existing) {
    startBtn.style.display   = 'none';
    resultEl.style.display   = '';
    scoreEl.textContent      = existing.score.toLocaleString() + ' 点';
  } else {
    startBtn.style.display   = '';
    resultEl.style.display   = 'none';
  }
  document.getElementById('dailyPanel').style.display = 'flex';
}

export function closeDailyPanel() {
  document.getElementById('dailyPanel').style.display = 'none';
}

function updateDailyBadge() {
  const streak = loadDailyStreak();
  const badge  = document.getElementById('dailyStreakBadge');
  if (streak > 0) {
    badge.textContent  = '🔥' + streak;
    badge.style.display = '';
  }
}

// ── Snack message ─────────────────────────────────────────────
let snackTimer = null;
function snackMsg(msg) {
  let el = document.getElementById('appSnack');
  if (!el) {
    el = document.createElement('div');
    el.id = 'appSnack';
    el.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;border-radius:100px;padding:12px 20px;font-size:14px;z-index:500;transition:opacity .2s;pointer-events:none';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ── Game persistence ──────────────────────────────────────────
function saveGameState() {
  if (state.gameOver || !tileDom.size) return;
  try {
    localStorage.setItem('nf_save', JSON.stringify({
      tiles:      [...state.tileMap.values()].map(t => ({ id: t.id, val: t.val, r: t.r, c: t.c })),
      cells:      state.cells.map(row => [...row]),
      score:      state.score,
      nextId:     state.nextId,
      moves:      state.moves,
      mergeCount: state.mergeCount,
    }));
  } catch {}
}

function loadGameState() {
  try {
    const raw = localStorage.getItem('nf_save');
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.tiles) || !Array.isArray(data.cells)) return false;
    if (typeof data.score !== 'number' || !Number.isFinite(data.score)) return false;
    tileDom.forEach(el => el.remove());
    tileDom.clear();
    state.tileMap.clear();
    state.cells      = data.cells;
    state.score      = data.score;
    state.nextId     = data.nextId ?? 0;
    state.moves      = data.moves ?? 0;
    state.mergeCount = data.mergeCount ?? 0;
    state.gameOver   = false;
    state.undoState  = null;
    state.startTime  = Date.now();
    data.tiles.forEach(t => {
      if (typeof t.id !== 'number' || typeof t.val !== 'number') return;
      if (typeof t.r !== 'number'  || typeof t.c !== 'number') return;
      state.tileMap.set(t.id, { id: t.id, val: t.val, r: t.r, c: t.c });
      createTileEl(t.id, t.val, t.r, t.c, '');
    });
    return state.tileMap.size > 0;
  } catch { return false; }
}

// ── Background hue shift ──────────────────────────────────────
function updateBodyBg(maxVal) {
  const t   = Math.min(1, Math.log2(Math.max(2, maxVal)) / 11);
  const hue = Math.round(270 - t * 100);
  const sat = Math.round(80 + t * 10);
  document.documentElement.style.setProperty('--c-bg-from', `hsl(${hue} ${sat}% 4%)`);
  document.documentElement.style.setProperty('--c-bg-to',   `hsl(${hue} ${sat}% 11%)`);
}

// ── Merge sparkles ────────────────────────────────────────────
function spawnMergeParticles(r, c, val) {
  const rect = document.getElementById('gridOuter').getBoundingClientRect();
  const ts   = renderer.getTileSize();
  const GAP  = 10, PAD = 10;
  const cx   = rect.left + PAD + c * (ts + GAP) + ts / 2;
  const cy   = rect.top  + PAD + r * (ts + GAP) + ts / 2;
  const style = TILE_STYLES[val];
  const colors = style?.glow
    ? ['#FFD700', '#fff', '#FFA000']
    : ['#B39DDB', '#E1BEE7', '#9575CD'];
  const count = val >= 512 ? 14 : 8;
  for (let i = 0; i < count; i++) {
    const el    = document.createElement('div');
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist  = 28 + Math.random() * 36;
    el.className = 'merge-particle';
    el.style.left       = cx + 'px';
    el.style.top        = cy + 'px';
    el.style.background = colors[i % colors.length];
    el.style.width = el.style.height = (4 + Math.random() * 5) + 'px';
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }
}

// ── Timer ─────────────────────────────────────────────────────
let timerInterval = null;
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    renderer.updateStats(state.moves, state.mergeCount, Date.now() - state.startTime);
  }, 1000);
}

// ── Audio ─────────────────────────────────────────────────────
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext ?? window.webkitAudioContext)();
}
function playMergeSound(val) {
  if (!soundOn) return;
  try {
    initAudio(); audioCtx.resume?.();
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    const base = 220 + Math.min(Math.log2(val) * 55, 500);
    o.type = val >= 512 ? 'triangle' : 'sine';
    o.frequency.setValueAtTime(base, now);
    o.frequency.exponentialRampToValueAtTime(base * 1.6, now + 0.12);
    g.gain.setValueAtTime(0.14, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    o.start(now); o.stop(now + 0.30);
  } catch {}
}

// ── Background canvas ─────────────────────────────────────────
const bgCanvas = document.getElementById('bg'), bgCtx = bgCanvas.getContext('2d');
const bgDots = Array.from({ length: 40 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.5 + 0.5,
  spd: Math.random() * 0.2 + 0.05,
  phase: Math.random() * Math.PI * 2,
}));
function drawBg() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgDots.forEach(d => {
    d.y -= d.spd / bgCanvas.height; if (d.y < 0) d.y = 1;
    d.phase += 0.02;
    bgCtx.globalAlpha = 0.3 + Math.sin(d.phase) * 0.2;
    bgCtx.fillStyle   = `hsl(${270 + d.r * 30} 80% 70%)`;
    bgCtx.beginPath(); bgCtx.arc(d.x * bgCanvas.width, d.y * bgCanvas.height, d.r, 0, Math.PI * 2); bgCtx.fill();
  });
  bgCtx.globalAlpha = 1;
  requestAnimationFrame(drawBg);
}

// ── Confetti ──────────────────────────────────────────────────
const cfCanvas = document.getElementById('confetti'), cfCtx = cfCanvas.getContext('2d');
let cfParts = [], cfRaf = null;
function fireConfetti() {
  cfCanvas.width  = window.innerWidth; cfCanvas.height = window.innerHeight;
  const cols = ['#FFD700','#B39DDB','#81C784','#4FC3F7','#F06292','#FFB74D','#fff'];
  cfParts = Array.from({ length: 140 }, () => ({
    x: Math.random() * cfCanvas.width, y: cfCanvas.height * 0.3,
    vx: (Math.random() - 0.5) * 9, vy: Math.random() * -13 - 5,
    r: Math.random() * 7 + 3, rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.22,
    color: cols[Math.floor(Math.random() * cols.length)], life: 1,
    shape: Math.random() < 0.5 ? 'rect' : 'circle',
  }));
  cancelAnimationFrame(cfRaf); animateCf();
}
function animateCf() {
  cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);
  cfParts.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.rot += p.rotV; p.life -= 0.011;
    cfCtx.globalAlpha = Math.max(0, p.life); cfCtx.fillStyle = p.color;
    cfCtx.save(); cfCtx.translate(p.x, p.y); cfCtx.rotate(p.rot);
    if (p.shape === 'rect') cfCtx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
    else { cfCtx.beginPath(); cfCtx.arc(0, 0, p.r * 0.6, 0, Math.PI * 2); cfCtx.fill(); }
    cfCtx.restore();
  });
  cfCtx.globalAlpha = 1;
  cfParts = cfParts.filter(p => p.life > 0);
  if (cfParts.length) cfRaf = requestAnimationFrame(animateCf);
  else cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);
}

// ── Input ─────────────────────────────────────────────────────
let touchX = 0, touchY = 0;
document.addEventListener('touchstart', e => {
  touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
  audioCtx?.resume().catch(() => {});
}, { passive: true });
document.addEventListener('touchend', e => {
  if (document.getElementById('overlay').classList.contains('show')) return;
  if (document.getElementById('dailyPanel').style.display !== 'none') return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;
  doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
}, { passive: true });
document.addEventListener('keydown', e => {
  const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  if (!map[e.key]) return; e.preventDefault(); doMove(map[e.key]);
});
window.addEventListener('resize', applyResize);

// ── PWA Install prompt ────────────────────────────────────────
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  document.getElementById('installBanner').style.display = 'flex';
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  document.getElementById('installBanner').style.display = 'none';
});
document.getElementById('installClose').addEventListener('click', () => {
  document.getElementById('installBanner').style.display = 'none';
});
window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner').style.display = 'none';
});

// ── Utility ───────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Bootstrap ─────────────────────────────────────────────────
renderer.setSoundIcon(soundOn);
applyResize();
drawBg();
updateDailyBadge();

const restored = loadGameState();
if (restored) {
  renderer.updateScore(state.score, state.best);
  renderer.updateProgress(state.getMaxVal());
  renderer.updateStats(state.moves, state.mergeCount, 0);
  renderer.setUndoEnabled(false);
  updateBodyBg(state.getMaxVal());
  startTimer();
} else {
  newGame();
}

window.NF = { newGame, switchMode, startDaily, closeDailyPanel, undo, confirmNew, closeDialog, toggleSound, shareDaily };
