// Daily Challenge module — Wordle-inspired daily puzzle.
// All players on the same date get identical starting conditions.

// ── Seeded RNG (Mulberry32) ────────────────────────────────────
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Date helpers ──────────────────────────────────────────────
export function getDailyId() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyNumber() {
  // Day 1 = 2025-01-01
  const EPOCH = new Date('2025-01-01').getTime();
  return Math.floor((Date.now() - EPOCH) / 86400000) + 1;
}

// ── Generate today's starting tiles ──────────────────────────
export function generateDailyTiles(gridSize = 4) {
  const rng = mulberry32(getDailyId());
  const allCells = [];
  for (let r = 0; r < gridSize; r++)
    for (let c = 0; c < gridSize; c++)
      allCells.push([r, c]);
  // Shuffle via seeded RNG
  for (let i = allCells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
  }
  return [
    { r: allCells[0][0], c: allCells[0][1], val: rng() < 0.9 ? 2 : 4 },
    { r: allCells[1][0], c: allCells[1][1], val: rng() < 0.9 ? 2 : 4 },
  ];
}

// ── Persistence ───────────────────────────────────────────────
const KEY = 'nf_daily';

export function saveDailyResult(score, maxTile, moves) {
  try {
    const prev = loadDailyResult();
    if (prev && prev.score >= score) return; // only save if improvement
    localStorage.setItem(KEY, JSON.stringify({ id: getDailyId(), score, maxTile, moves }));
  } catch {}
}

export function loadDailyResult() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (typeof d.id !== 'number' || d.id !== getDailyId()) return null;
    return d;
  } catch { return null; }
}

// ── Daily play streak ─────────────────────────────────────────
const STREAK_KEY = 'nf_daily_streak';

export function updateDailyStreak() {
  try {
    const raw   = JSON.parse(localStorage.getItem(STREAK_KEY) ?? '{}');
    const today = getDailyId();
    const yest  = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); })();
    const streak = raw.lastDay === yest ? (raw.streak ?? 0) + 1 : raw.lastDay === today ? raw.streak ?? 1 : 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDay: today, streak }));
    return streak;
  } catch { return 1; }
}

export function loadDailyStreak() {
  try {
    const raw = JSON.parse(localStorage.getItem(STREAK_KEY) ?? '{}');
    if (raw.lastDay !== getDailyId()) return 0;
    return raw.streak ?? 0;
  } catch { return 0; }
}

// ── Emoji share grid (Wordle-style) ──────────────────────────
const CELL_EMOJI = {
  0: '⬜', 2: '🟪', 4: '🟪', 8: '🟣',
  16: '🟥', 32: '🟧', 64: '🟨', 128: '🟩',
  256: '🟦', 512: '🔷', 1024: '🩷', 2048: '⭐',
};

export function buildShareText(score, maxTile, cells, tileMap) {
  const grid = cells.map(row =>
    row.map(id => {
      const val = tileMap.get(id)?.val ?? 0;
      return CELL_EMOJI[val] ?? '⭐';
    }).join('')
  ).join('\n');

  const dayNum = getDailyNumber();
  return [
    `🔮 Number Fusion Daily #${dayNum}`,
    `スコア: ${score.toLocaleString()}  最高タイル: ${maxTile}`,
    '',
    grid,
    '',
    '📲 ぜひあなたも挑戦してみて！',
  ].join('\n');
}

export async function shareResult(text) {
  try {
    if (navigator.share) { await navigator.share({ text, title: 'Number Fusion Daily' }); return 'shared'; }
  } catch {}
  try { await navigator.clipboard.writeText(text); return 'copied'; } catch {}
  return false;
}
