// Game loop, event handling, shop, missions, UI.
import { Renderer } from './renderer.js';
import {
  createPlayer, updatePlayer, tryJump,
  spawnObstacle, obstacleInterval,
  spawnCoin, updateCoin, coinInterval,
  spawnPowerUp, updatePowerUp,
  makeJumpParticles, makeLandParticles, makeDeathParticles, makeCoinBurst,
  updateParticle, makeTrail,
} from './entities.js';
import {
  CHARACTERS, getDailyMissions,
  loadShopData, saveShopData,
  loadMissionState, saveMissionState,
  getCharById,
} from './shop.js';

// ── Canvas & renderer ─────────────────────────────────────────
const canvas   = document.getElementById('c');
const area     = document.getElementById('area');
const renderer = new Renderer(canvas);

// ── Game state ────────────────────────────────────────────────
let W, H, GY;
let running = false, raf = null, frame = 0;
let score = 0, coins = 0, speed = 5, lives = 3;
let player, obstacles, coinItems, powerUps, particles, trails;
let shieldTimer = 0, magnetTimer = 0;
let best       = loadBest();
let totalCoins = loadTotalCoins();
let milestones = new Set();
let audioCtx   = null;

// ── Shop / Mission state ──────────────────────────────────────
let shopData       = loadShopData();
let missionState   = loadMissionState();
let dailyMissions  = getDailyMissions();
// Per-run mission counters
let runMissionProgress = { djumps: 0, powerups: 0 };

// ── Sizing ────────────────────────────────────────────────────
function resize() {
  W = canvas.width  = area.clientWidth;
  H = canvas.height = area.clientHeight;
  GY = H - Math.min(90, H * 0.13);
}

// ── Game init ─────────────────────────────────────────────────
function initGame() {
  const char = getCharById(shopData.selected);
  player = createPlayer(80, GY);
  player.color  = char.body;
  player.accent = char.accent;
  obstacles = []; coinItems = []; powerUps = []; particles = []; trails = [];
  frame = 0; score = 0; coins = 0; speed = 5; lives = 3;
  shieldTimer = 0; magnetTimer = 0;
  milestones.clear();
  runMissionProgress = { djumps: 0, powerups: 0 };
  renderer.initWorld(W, H, GY);
}

// ── Public API ────────────────────────────────────────────────
function start() {
  resize(); initGame();
  running = true;
  hide('startScr'); hide('overScr');
  updateHUD(); updateLives();
  cancelAnimationFrame(raf);
  loop();
}

function jump() {
  if (!running) return;
  const wasOnGround = player.onGround;
  if (tryJump(player)) {
    particles.push(...makeJumpParticles(player.x, player.y, player.h));
    if (!wasOnGround) {
      runMissionProgress.djumps++;
      updateMissionProgress('djump', runMissionProgress.djumps);
    }
    playSound(wasOnGround ? 'jump' : 'doublejump');
    navigator.vibrate?.(wasOnGround ? 18 : [12, 6, 20]);
  }
}

// ── Shop ──────────────────────────────────────────────────────
function openShop() {
  document.getElementById('shopCoins').textContent = totalCoins;
  renderCharGrid();
  document.getElementById('shopOverlay').style.display = 'flex';
}
function closeShop() { document.getElementById('shopOverlay').style.display = 'none'; }

function renderCharGrid() {
  const el = document.getElementById('charGrid');
  el.innerHTML = '';
  CHARACTERS.forEach(ch => {
    const owned    = shopData.unlocked.includes(ch.id);
    const selected = shopData.selected === ch.id;
    const canBuy   = !owned && totalCoins >= ch.cost;

    const card = document.createElement('div');
    card.className = 'char-card' + (selected ? ' selected' : '') + (!owned ? ' locked' : '');

    const emoji = document.createElement('div'); emoji.className = 'char-emoji'; emoji.textContent = ch.emoji;
    const name  = document.createElement('div'); name.className  = 'char-name';  name.textContent = ch.name;
    const desc  = document.createElement('div'); desc.className  = 'char-desc';  desc.textContent = ch.desc;

    const badge = document.createElement('div');
    badge.className = 'char-badge ' + (selected ? '' : owned ? '' : canBuy ? 'buy-badge' : 'locked-badge');
    badge.textContent = selected ? '✓ 使用中' : owned ? '選択する' : ch.cost === 0 ? '無料' : '🪙 ' + ch.cost;

    card.append(emoji, name, desc, badge);
    card.addEventListener('click', () => handleCharClick(ch, owned, canBuy));
    el.appendChild(card);
  });
}

function handleCharClick(ch, owned, canBuy) {
  if (owned) {
    shopData.selected = ch.id;
    saveShopData(shopData);
    renderCharGrid();
    updateCharPreview();
  } else if (canBuy) {
    totalCoins -= ch.cost;
    saveTotalCoins(totalCoins);
    shopData.unlocked.push(ch.id);
    shopData.selected = ch.id;
    saveShopData(shopData);
    renderCharGrid();
    updateCharPreview();
    document.getElementById('shopCoins').textContent = totalCoins;
    updateHUD();
  }
}

function updateCharPreview() {
  const ch = getCharById(shopData.selected);
  document.getElementById('charPreview').textContent = ch.emoji;
}

// ── Missions ──────────────────────────────────────────────────
function openMissions() {
  renderMissionsList();
  document.getElementById('missionsOverlay').style.display = 'flex';
}
function closeMissions() { document.getElementById('missionsOverlay').style.display = 'none'; }

function renderMissionsList() {
  const el = document.getElementById('missionsList');
  el.innerHTML = '';
  dailyMissions.forEach(m => {
    const prog    = missionState.progress[m.id] ?? 0;
    const done    = missionState.completed.includes(m.id);
    const pct     = Math.min(1, prog / m.target);

    const ICONS = { coins: '🪙', score: '🎯', runs: '🏃', powerup: '⚡', djump: '🔄', dist: '📏' };

    const item = document.createElement('div');
    item.className = 'mission-item' + (done ? ' done' : '');

    const ico  = document.createElement('div'); ico.className = 'mission-icon'; ico.textContent = ICONS[m.type] ?? '📌';
    const info = document.createElement('div'); info.className = 'mission-info';
    const desc = document.createElement('div'); desc.className = 'mission-desc'; desc.textContent = m.desc;
    const progBar = document.createElement('div'); progBar.className = 'mission-prog';
    const fill    = document.createElement('div'); fill.className = 'mission-fill'; fill.style.width = (pct * 100) + '%';
    const txt     = document.createElement('div'); txt.className = 'mission-prog-txt';
    txt.textContent = done ? '✅ 完了！' : `${Math.min(prog, m.target)} / ${m.target}`;
    progBar.appendChild(fill);
    info.append(desc, progBar, txt);

    const rew = document.createElement('div'); rew.className = 'mission-reward'; rew.textContent = done ? '受取済' : '+🪙' + m.reward;
    item.append(ico, info, rew);
    el.appendChild(item);
  });
}

function updateMissionProgress(type, value) {
  dailyMissions.forEach(m => {
    if (m.type !== type || missionState.completed.includes(m.id)) return;
    const prev = missionState.progress[m.id] ?? 0;
    const next = type === 'score' || type === 'dist' ? Math.max(prev, value) : value;
    missionState.progress[m.id] = next;
    if (next >= m.target) {
      missionState.completed.push(m.id);
      totalCoins += m.reward;
      saveTotalCoins(totalCoins);
      updateHUD();
      showToast('🎉 ミッション完了！ +🪙' + m.reward);
    }
  });
  saveMissionState(missionState);
}

// ── Main loop ─────────────────────────────────────────────────
function loop() { update(); renderer.scrollBg(speed, frame); renderer.drawFrame(GY, frame, score, speed, player, obstacles, coinItems, powerUps, particles, trails, shieldTimer); if (running) raf = requestAnimationFrame(loop); }

function update() {
  frame++;
  score = Math.floor(frame * 0.13);
  speed = 5 + Math.min(10, Math.floor(score / 50) * 0.6);
  document.getElementById('scoreV').textContent = score;

  checkMilestone(score);
  tickTimer('shield'); tickTimer('magnet');

  const wasOnGround = player.onGround;
  updatePlayer(player, GY);
  if (!wasOnGround && player.onGround) particles.push(...makeLandParticles(player.x, GY));

  if (frame % obstacleInterval(score) === 0) spawnObstacle(W, score).forEach(o => obstacles.push(o));
  if (frame % coinInterval(score) === 14)    coinItems.push(spawnCoin(W, GY, score));
  if (frame % 300 === 0 && frame > 150)      powerUps.push(spawnPowerUp(W, GY));

  obstacles.forEach(o  => { o.x -= speed; });
  coinItems.forEach(c  => { updateCoin(c); c.x -= speed; });
  powerUps.forEach(pu  => { updatePowerUp(pu); pu.x -= speed * 0.9; });

  obstacles = obstacles.filter(o  => o.x + o.w > -20);
  coinItems = coinItems.filter(c  => c.x + c.r > -20 && !c.collected);
  powerUps  = powerUps.filter(pu  => pu.x > -30 && !pu.collected);

  trails.push(makeTrail(player));
  if (trails.length > 8) trails.shift();
  trails.forEach(t => { t.alpha -= 0.025; });
  trails = trails.filter(t => t.alpha > 0);

  particles.forEach(updateParticle);
  particles = particles.filter(p => p.life > 0);

  handleCollisions();

  // Distance mission
  const dist = Math.floor(frame * 0.7);
  updateMissionProgress('dist', dist);
  updateMissionProgress('score', score);
}

// ── Milestones ────────────────────────────────────────────────
const MILESTONES = [50, 100, 200, 300, 500, 750, 1000];
function checkMilestone(s) {
  for (const m of MILESTONES) {
    if (s >= m && !milestones.has(m)) {
      milestones.add(m); showMilestonePopup(m);
      playSound('milestone'); navigator.vibrate?.([30, 20, 60]);
    }
  }
}
function showMilestonePopup(n) {
  const el = document.createElement('div');
  el.className = 'milestone-pop'; el.textContent = n.toLocaleString() + '!';
  area.appendChild(el); setTimeout(() => el.remove(), 1200);
}

// ── Timers ────────────────────────────────────────────────────
function tickTimer(type) {
  if (type === 'shield') {
    if (!shieldTimer) return; shieldTimer--;
    document.getElementById('shieldTimer').textContent = Math.ceil(shieldTimer / 60) + 's';
    if (!shieldTimer) document.getElementById('shieldChip').classList.remove('active');
  } else {
    if (!magnetTimer) return; magnetTimer--;
    document.getElementById('magnetTimer').textContent = Math.ceil(magnetTimer / 60) + 's';
    if (!magnetTimer) document.getElementById('magnetChip').classList.remove('active');
  }
}

// ── Collisions ────────────────────────────────────────────────
function handleCollisions() {
  if (magnetTimer > 0) {
    coinItems.forEach(c => {
      if (c.collected) return;
      const dx = player.x + player.w / 2 - c.x, dy = player.y + player.h / 2 - c.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140 && dist > 0) { c.x += (dx / dist) * 6; c.y += (dy / dist) * 6; }
    });
  }
  coinItems.forEach(c => {
    if (c.collected) return;
    const dx = player.x + player.w / 2 - c.x, dy = player.y + player.h / 2 - c.y;
    if (Math.hypot(dx, dy) < player.w / 2 + c.r) {
      c.collected = true; coins++; totalCoins++;
      saveTotalCoins(totalCoins);
      particles.push(...makeCoinBurst(c.x, c.y));
      playSound('coin'); navigator.vibrate?.(10);
      document.getElementById('coinsV').textContent = coins;
      updateMissionProgress('coins', coins);
    }
  });
  powerUps.forEach(pu => {
    if (pu.collected) return;
    const dx = player.x + player.w / 2 - pu.x, dy = player.y + player.h / 2 - pu.y;
    if (Math.hypot(dx, dy) < player.w / 2 + pu.r + 8) {
      pu.collected = true;
      if (pu.type === 'shield') { shieldTimer = 300; document.getElementById('shieldChip').classList.add('active'); }
      else { magnetTimer = 300; document.getElementById('magnetChip').classList.add('active'); }
      runMissionProgress.powerups++;
      updateMissionProgress('powerup', runMissionProgress.powerups);
      playSound('powerup'); navigator.vibrate?.([20, 10, 40]);
    }
  });
  if (player.invincible > 0) return;
  for (const o of obstacles) {
    const oy = GY - o.h;
    if (player.x + player.w - 10 > o.x + 4 && player.x + 10 < o.x + o.w - 4 && player.y + player.h - 4 > oy && player.y + 4 < oy + o.h) {
      if (shieldTimer > 0) { shieldTimer = 0; document.getElementById('shieldChip').classList.remove('active'); player.invincible = 60; playSound('shield'); navigator.vibrate?.([30, 20, 30]); break; }
      takeDamage(); break;
    }
  }
}

function takeDamage() {
  lives--; updateLives();
  particles.push(...makeDeathParticles(player.x, player.y, player.w, player.h));
  player.invincible = 90;
  playSound('hit'); navigator.vibrate?.([80, 40, 120]);
  if (lives <= 0) endGame();
}

// ── End game ──────────────────────────────────────────────────
function endGame() {
  running = false;
  const isNew = score > best;
  if (isNew) { best = score; saveBest(best); }

  // Runs mission
  const runCount = (parseInt(localStorage.getItem('hd_runs') ?? '0', 10) || 0) + 1;
  try { localStorage.setItem('hd_runs', String(runCount)); } catch {}
  updateMissionProgress('runs', runCount);

  playSound(isNew ? 'newbest' : 'gameover');
  navigator.vibrate?.([100, 50, 200]);

  const dist = Math.floor(frame * 0.7);
  const el = document.getElementById('overStats'); el.innerHTML = '';
  [[score, 'スコア'], [coins, 'コイン'], [dist + 'm', '距離'], [totalCoins, '総コイン']].forEach(([v, l]) => {
    const item = document.createElement('div'); item.className = 'stat-item';
    const n = document.createElement('div'); n.className = 'stat-num'; n.textContent = String(v);
    const lb = document.createElement('div'); lb.className = 'stat-lbl'; lb.textContent = l;
    item.append(n, lb); el.appendChild(item);
  });
  document.getElementById('bestTxt2').textContent = isNew ? 'NEW RECORD 🏆 ' + best : 'ベスト: ' + best;
  show('overScr');
}

// ── Audio ─────────────────────────────────────────────────────
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext ?? window.webkitAudioContext)(); }
function playSound(type) {
  try {
    initAudio(); if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    const S = { jump:[280,420,.12,.12,'sine'], doublejump:[420,600,.15,.1,'sine'], coin:[880,1200,.10,.1,'sine'], powerup:[440,880,.25,.12,'triangle'], shield:[300,200,.15,.1,'square'], hit:[200,80,.20,.15,'sawtooth'], milestone:[660,880,.20,.12,'triangle'], gameover:[200,100,.50,.15,'sawtooth'], newbest:[440,660,.40,.13,'sine'] };
    const s = S[type] ?? S.jump;
    o.type = s[4]; o.frequency.setValueAtTime(s[0], now); o.frequency.linearRampToValueAtTime(s[1], now + s[2]);
    g.gain.setValueAtTime(s[3], now); g.gain.exponentialRampToValueAtTime(0.001, now + s[2]);
    o.start(now); o.stop(now + s[2] + 0.01);
  } catch {}
}

// ── UI helpers ────────────────────────────────────────────────
function updateHUD() {
  document.getElementById('bestV').textContent = best;
  document.getElementById('bestTxt').textContent = best > 0 ? 'ベスト: ' + best + '  |  🪙' + totalCoins : '🪙 ' + totalCoins;
  updateCharPreview();
}
function updateLives() {
  const el = document.getElementById('lives'); el.innerHTML = '';
  for (let i = 0; i < 3; i++) { const h = document.createElement('span'); h.className = 'heart' + (i >= lives ? ' lost' : ''); h.textContent = '❤️'; el.appendChild(h); }
}
function show(id) { document.getElementById(id).classList.add('on'); }
function hide(id) { document.getElementById(id).classList.remove('on'); }

let toastTimer = null;
function showToast(msg) {
  let el = document.getElementById('gameToast');
  if (!el) { el = document.createElement('div'); el.id = 'gameToast'; el.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:rgba(79,195,247,.9);color:#001D36;font-weight:700;border-radius:100px;padding:12px 20px;font-size:15px;z-index:500;transition:opacity .2s;pointer-events:none'; document.body.appendChild(el); }
  el.textContent = msg; el.style.opacity = '1';
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ── Persistence ───────────────────────────────────────────────
function loadBest() { try { const n = parseInt(localStorage.getItem('hd_best') ?? '0', 10); return Number.isFinite(n) && n >= 0 ? n : 0; } catch { return 0; } }
function saveBest(n) { try { localStorage.setItem('hd_best', String(n)); } catch {} }
function loadTotalCoins() { try { const n = parseInt(localStorage.getItem('hd_coins') ?? '0', 10); return Number.isFinite(n) && n >= 0 ? n : 0; } catch { return 0; } }
function saveTotalCoins(n) { try { localStorage.setItem('hd_coins', String(n)); } catch {} }

// ── Input ─────────────────────────────────────────────────────
document.getElementById('jumpBtn').addEventListener('touchstart', e => { e.preventDefault(); jump(); }, { passive: false });
document.getElementById('jumpBtn').addEventListener('click', jump);
document.getElementById('area').addEventListener('touchstart', e => { if (!e.target.closest('button') && !e.target.closest('.screen') && running) jump(); }, { passive: true });
document.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } });
document.addEventListener('touchstart', () => { try { initAudio(); audioCtx?.resume(); } catch {} }, { once: true });

window.addEventListener('resize', () => { if (running) { resize(); renderer.initWorld(W, H, GY); } else resize(); });

// ── PWA Install ───────────────────────────────────────────────
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

// ── Bootstrap ─────────────────────────────────────────────────
resize(); updateHUD();
window.HD = { start, jump, openShop, closeShop, openMissions, closeMissions };
