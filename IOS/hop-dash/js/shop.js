// Character shop + Daily missions — Crossy Road / Geometry Dash inspired.

// ── Characters ────────────────────────────────────────────────
export const CHARACTERS = [
  {
    id: 'runner', name: 'ランナー', cost: 0, emoji: '🏃',
    body: '#90CAF9', accent: '#1565C0', glow: null,
    desc: 'スピードの申し子！',
  },
  {
    id: 'robot', name: 'ロボ', cost: 50, emoji: '🤖',
    body: '#B0BEC5', accent: '#37474F', glow: 'rgba(100,200,255,.4)',
    desc: '鉄の意志でひた走る！',
  },
  {
    id: 'nekko', name: 'ネッコ', cost: 100, emoji: '🐱',
    body: '#FFCC80', accent: '#E65100', glow: null,
    desc: '9つの命で激走！',
  },
  {
    id: 'ninja', name: '忍者', cost: 150, emoji: '🥷',
    body: '#CE93D8', accent: '#6A1B9A', glow: 'rgba(180,100,255,.35)',
    desc: '影のごとく疾走！',
  },
  {
    id: 'cosmo', name: 'コスモ', cost: 200, emoji: '🚀',
    body: '#E8EAF6', accent: '#3949AB', glow: 'rgba(144,202,249,.5)',
    desc: '宇宙最速の存在！',
  },
];

// ── Daily missions ─────────────────────────────────────────────
const MISSION_POOL = [
  { id: 'm1',  desc: 'コインを10枚集める',     type: 'coins',   target: 10,  reward: 20  },
  { id: 'm2',  desc: 'コインを25枚集める',     type: 'coins',   target: 25,  reward: 40  },
  { id: 'm3',  desc: 'スコア100を達成する',    type: 'score',   target: 100, reward: 30  },
  { id: 'm4',  desc: 'スコア300を達成する',    type: 'score',   target: 300, reward: 60  },
  { id: 'm5',  desc: '3回プレイする',          type: 'runs',    target: 3,   reward: 20  },
  { id: 'm6',  desc: 'パワーアップを3個取る',  type: 'powerup', target: 3,   reward: 35  },
  { id: 'm7',  desc: '二段ジャンプを5回使う',  type: 'djump',   target: 5,   reward: 25  },
  { id: 'm8',  desc: '50mを走る',             type: 'dist',    target: 50,  reward: 20  },
];

// ── Seeded selection ──────────────────────────────────────────
function dailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyMissions() {
  const pool = [...MISSION_POOL];
  let seed   = dailySeed();
  const result = [];
  for (let i = 0; i < 3 && pool.length; i++) {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    const idx = seed % pool.length;
    result.push({ ...pool[idx] });
    pool.splice(idx, 1);
  }
  return result;
}

// ── Persistence ───────────────────────────────────────────────
const SHOP_KEY    = 'hd_shop';
const MISSION_KEY = 'hd_missions';

export function loadShopData() {
  try {
    const raw = JSON.parse(localStorage.getItem(SHOP_KEY) ?? '{}');
    return {
      selected: typeof raw.selected === 'string' ? raw.selected : 'runner',
      unlocked: Array.isArray(raw.unlocked) ? raw.unlocked.filter(s => typeof s === 'string') : ['runner'],
    };
  } catch { return { selected: 'runner', unlocked: ['runner'] }; }
}

export function saveShopData(data) {
  try { localStorage.setItem(SHOP_KEY, JSON.stringify(data)); } catch {}
}

export function loadMissionState() {
  try {
    const raw = JSON.parse(localStorage.getItem(MISSION_KEY) ?? '{}');
    if (raw.day !== dailySeed()) {
      return { day: dailySeed(), progress: {}, completed: [] };
    }
    return {
      day:       raw.day,
      progress:  typeof raw.progress === 'object' ? raw.progress : {},
      completed: Array.isArray(raw.completed) ? raw.completed : [],
    };
  } catch { return { day: dailySeed(), progress: {}, completed: [] }; }
}

export function saveMissionState(state) {
  try { localStorage.setItem(MISSION_KEY, JSON.stringify(state)); } catch {}
}

export function getCharById(id) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}
