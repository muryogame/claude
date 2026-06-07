// Game entity factories and update functions — no DOM/Canvas access.

// ── Player ────────────────────────────────────────────────────
export function createPlayer(x, groundY) {
  return {
    x, y: groundY - 64,
    w: 42, h: 56,
    vy: 0,
    onGround: true,
    jumpCount: 0,
    squashX: 1, squashY: 1,
    legPhase: 0,
    dead: false,
    invincible: 0,
    invincibleFrame: 0,
    color: '#90CAF9',
    accent: '#1565C0',
  };
}

export function updatePlayer(p, groundY) {
  p.vy     += 0.7;
  p.y      += p.vy;

  const wasAir = !p.onGround;
  if (p.y >= groundY - p.h) {
    p.y       = groundY - p.h;
    p.vy      = 0;
    p.onGround  = true;
    p.jumpCount = 0;
    if (wasAir) { p.squashX = 1.3; p.squashY = 0.6; }
  }

  // Ease squash back to 1
  p.squashX += (1 - p.squashX) * 0.2;
  p.squashY += (1 - p.squashY) * 0.2;

  // Jump stretch
  if (!p.onGround && p.vy < 0) { p.squashX = 0.8; p.squashY = 1.3; }

  if (p.onGround) p.legPhase += 0.22;
  if (p.invincible > 0) { p.invincible--; p.invincibleFrame++; }
}

export function tryJump(p) {
  if (p.dead) return false;
  if (p.onGround || p.jumpCount < 2) {
    p.vy       = -17 + p.jumpCount * -1.5;
    p.onGround = false;
    p.jumpCount++;
    p.squashX = 0.8;
    p.squashY = 1.4;
    return true;
  }
  return false;
}

// ── Obstacles ─────────────────────────────────────────────────
const OBSTACLE_TYPES = ['cactus', 'tall', 'double'];

export function spawnObstacle(W, score) {
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  const results = [];
  if (type === 'cactus') {
    results.push({ x: W, w: 26 + Math.random() * 18, h: 44,  color: '#EF5350', type });
  } else if (type === 'tall') {
    results.push({ x: W, w: 26 + Math.random() * 14, h: 88,  color: '#FF7043', type });
  } else {
    const w = 22;
    const gap = 48 + Math.random() * 30;
    results.push({ x: W,         w, h: 50, color: '#EF5350', type: 'd1' });
    results.push({ x: W + w + gap, w, h: 64, color: '#FF7043', type: 'd2' });
  }
  return results.map(o => ({ ...o, y: 0 })); // y is set by renderer using groundY
}

export function obstacleInterval(score) {
  return Math.max(48, 80 - Math.floor(score / 40) * 4);
}

// ── Coins ─────────────────────────────────────────────────────
export function spawnCoin(W, groundY, score) {
  const floatChance = Math.min(0.4, score / 500);
  const y = Math.random() < floatChance ? groundY - 140 : groundY - 70;
  return { x: W + Math.random() * 40, y, r: 10, collected: false, bob: Math.random() * Math.PI * 2 };
}

export function updateCoin(coin) {
  coin.bob += 0.1;
  coin.y   += Math.sin(coin.bob) * 0.5;
}

export function coinInterval(score) {
  return Math.max(22, 35 - Math.min(13, Math.floor(score / 100)));
}

// ── Power-ups ─────────────────────────────────────────────────
export function spawnPowerUp(W, groundY) {
  return {
    x: W,
    y: groundY - 110,
    r: 16,
    type: Math.random() < 0.5 ? 'shield' : 'magnet',
    bob: 0,
    glowPhase: 0,
    collected: false,
  };
}

export function updatePowerUp(pu) {
  pu.bob       += 0.08;
  pu.glowPhase  = (pu.glowPhase + 0.05) % 1;
}

// ── Particles ─────────────────────────────────────────────────
export function makeJumpParticles(px, py, ph) {
  return Array.from({ length: 8 }, () => {
    const a = Math.PI + Math.random() * Math.PI;
    return { x: px + 21, y: py + ph, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, r: 3 + Math.random() * 3, color: '#90CAF9', life: 20, maxLife: 20 };
  });
}
export function makeLandParticles(px, groundY) {
  return Array.from({ length: 10 }, () => {
    const a = Math.PI + Math.random() * 0.8 - Math.PI * 0.1;
    return { x: px + 21, y: groundY, vx: Math.cos(a) * 4, vy: Math.sin(a) * 3 - 1, r: 4 + Math.random() * 4, color: '#4CAF50', life: 15, maxLife: 15 };
  });
}
export function makeDeathParticles(px, py, pw, ph) {
  return Array.from({ length: 20 }, () => {
    const a = Math.random() * Math.PI * 2, s = Math.random() * 7 + 3;
    return { x: px + pw / 2, y: py + ph / 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, r: 5 + Math.random() * 6, color: '#90CAF9', life: 40, maxLife: 40, star: true };
  });
}
export function makeCoinBurst(x, y) {
  return Array.from({ length: 5 }, () => {
    const a = Math.random() * Math.PI * 2;
    return { x, y, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3 - 2, r: 4, color: '#FFD700', life: 20, maxLife: 20 };
  });
}

export function updateParticle(p) {
  p.x  += p.vx;
  p.y  += p.vy;
  p.vy += 0.18;
  if (p.star) { p.vx *= 0.95; p.vy *= 0.95; }
  p.life--;
}

// ── Trail ─────────────────────────────────────────────────────
export function makeTrail(p) {
  return { x: p.x + p.w / 2, y: p.y + p.h * 0.5, r: p.w * 0.4, alpha: 0.25, color: p.color };
}
