// Data layer — all persistence and mutation logic.
// Security: input sanitization, localStorage schema validation.

const STORAGE_KEY   = 'hf_habits';
const ACHIEV_KEY    = 'hf_achiev';
const FREE_LIMIT    = 5;
const MAX_NAME_LEN  = 30;
const DATE_REGEX    = /^\d{4}-\d{2}-\d{2}$/;

// ── Public API ────────────────────────────────────────────────
export function getToday() {
  return new Date().toISOString().split('T')[0];
}

/** Load habits from localStorage with full schema validation. */
export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(validateHabit);
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch { /* quota exceeded — silently ignore */ }
}

export function loadUnlockedAchievements() {
  try {
    const raw = JSON.parse(localStorage.getItem(ACHIEV_KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter(id => typeof id === 'string');
  } catch { return []; }
}

export function saveUnlockedAchievements(ids) {
  try { localStorage.setItem(ACHIEV_KEY, JSON.stringify(ids)); } catch {}
}

/** Sanitize user-provided text. Returns empty string if input is not a string. */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, MAX_NAME_LEN)
    .replace(/[<>]/g, ''); // strip angle brackets to prevent injection
}

export function isFreeLimit(habits) {
  return habits.length >= FREE_LIMIT;
}

// ── Habit builders ────────────────────────────────────────────
export function buildHabit({ name, emoji, cat, time }) {
  return {
    id:             Date.now(),
    name:           sanitizeText(name),
    emoji:          sanitizeEmoji(emoji),
    cat:            sanitizeCat(cat),
    time:           sanitizeTime(time),
    createdAt:      getToday(),
    completedDates: [],
  };
}

// ── Queries ───────────────────────────────────────────────────
export function isDone(habit, date = getToday()) {
  return Array.isArray(habit.completedDates) && habit.completedDates.includes(date);
}

export function getStreak(habit) {
  let streak = 0;
  const d = new Date(getToday());
  while (true) {
    const ds = d.toISOString().split('T')[0];
    if (habit.completedDates?.includes(ds)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

export function getLongestStreak(habit) {
  if (!habit.completedDates?.length) return 0;
  const sorted = [...habit.completedDates].sort();
  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    prev.setDate(prev.getDate() + 1);
    if (prev.toISOString().split('T')[0] === sorted[i]) { cur++; if (cur > best) best = cur; }
    else cur = 1;
  }
  return best;
}

export function getCompletionRate(habit) {
  if (!habit.completedDates?.length) return 0;
  const days = Math.max(1, Math.ceil((new Date(getToday()) - new Date(habit.createdAt)) / 86400000) + 1);
  return Math.round((habit.completedDates.length / days) * 100);
}

export function getGlobalStreak(habits) {
  if (!habits.length) return 0;
  let s = 0;
  const d = new Date(getToday());
  while (true) {
    const ds = d.toISOString().split('T')[0];
    if (habits.every(h => isDone(h, ds))) { s++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
}

export function getAchievData(habits) {
  const totalChecks = habits.reduce((s, h) => s + (h.completedDates?.length ?? 0), 0);
  const maxStreak   = habits.reduce((m, h) => Math.max(m, getLongestStreak(h)), 0);
  const allDates    = new Set(habits.flatMap(h => h.completedDates ?? []));
  let perfectDays   = 0;
  allDates.forEach(date => {
    if (habits.length && habits.every(h => isDone(h, date))) perfectDays++;
  });
  return { totalChecks, maxStreak, totalHabits: habits.length, perfectDays };
}

// ── Validation (private-ish) ──────────────────────────────────
function validateHabit(h) {
  return (
    h !== null && typeof h === 'object' &&
    typeof h.id === 'number' &&
    typeof h.name === 'string' && h.name.length > 0 && h.name.length <= MAX_NAME_LEN &&
    typeof h.emoji === 'string' &&
    Array.isArray(h.completedDates) &&
    h.completedDates.every(d => typeof d === 'string' && DATE_REGEX.test(d))
  );
}

const VALID_CATS  = new Set(['health', 'mind', 'learn', 'life', 'social']);
const VALID_TIMES = new Set(['morning', 'afternoon', 'evening', '']);

function sanitizeEmoji(e) {
  // Accept only short strings (1–4 chars covers most emoji), default to star
  if (typeof e !== 'string') return '🌟';
  const trimmed = e.trim();
  return trimmed.length >= 1 && trimmed.length <= 8 ? trimmed : '🌟';
}

function sanitizeCat(c) {
  return VALID_CATS.has(c) ? c : 'life';
}

function sanitizeTime(t) {
  return VALID_TIMES.has(t) ? t : '';
}
