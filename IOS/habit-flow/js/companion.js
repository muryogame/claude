// Companion module — "Hana" the plant pet (Finch / Duolingo inspired).
// Grows based on total completed habits. Provides daily encouragement.

// ── Growth stages ─────────────────────────────────────────────
export const STAGES = [
  {
    min: 0,   emoji: '🌱', name: 'たね',
    msgs: ['一緒に頑張ろう！', 'まず一歩から始めよう！', '何でも最初は小さい'],
    bg:   'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
  },
  {
    min: 5,   emoji: '🌿', name: 'めばえ',
    msgs: ['芽が出てきたよ！', '少しずつ育ってる！', 'いい感じ！続けて！'],
    bg:   'linear-gradient(135deg,#DCEDC8,#AED581)',
  },
  {
    min: 20,  emoji: '🌾', name: 'わかば',
    msgs: ['すくすく育ってる！', 'この調子でいこう！', '立派になってきたね！'],
    bg:   'linear-gradient(135deg,#C8E6C9,#66BB6A)',
  },
  {
    min: 50,  emoji: '🌳', name: 'こだち',
    msgs: ['継続は力なり！', '本物の習慣が身についてきた！', '素晴らしい成長！'],
    bg:   'linear-gradient(135deg,#A5D6A7,#2E7D32)',
  },
  {
    min: 100, emoji: '🌲', name: 'もりのき',
    msgs: ['真の習慣マスター！', '君の意志力は本物だ！', 'もう何も怖くない！'],
    bg:   'linear-gradient(135deg,#81C784,#1B5E20)',
  },
  {
    min: 200, emoji: '🏆',  name: '伝説のはな',
    msgs: ['あなたは伝説だ！', 'もはや言葉がない...', '最強の習慣人間！'],
    bg:   'linear-gradient(135deg,#FFD700,#FF6F00)',
  },
];

// ── Helpers ───────────────────────────────────────────────────
export function getStage(totalChecks) {
  let s = STAGES[0];
  for (const stage of STAGES) { if (totalChecks >= stage.min) s = stage; }
  return s;
}

export function getNextStage(totalChecks) {
  return STAGES.find(s => totalChecks < s.min) ?? null;
}

export function getProgressRatio(totalChecks) {
  const next = getNextStage(totalChecks);
  if (!next) return 1;
  const cur = [...STAGES].reverse().find(s => totalChecks >= s.min);
  const base = cur?.min ?? 0;
  return (totalChecks - base) / (next.min - base);
}

/** Different message each day of the week. */
export function getDailyMsg(stage) {
  return stage.msgs[new Date().getDay() % stage.msgs.length];
}

// ── Share card builder ────────────────────────────────────────
export function buildShareText(habits, totalChecks, globalStreak) {
  const stage    = getStage(totalChecks);
  const today    = new Date().toISOString().split('T')[0];
  const doneToday = habits.filter(h => h.completedDates?.includes(today)).length;
  const total    = habits.length;

  const lines = [
    `🌱 HabitFlow — ${stage.emoji} ${stage.name}`,
    '',
    `📅 今日: ${doneToday}/${total} 習慣を達成`,
    `🔥 ${globalStreak}日連続継続中！`,
    `✅ 累計 ${totalChecks} 回達成`,
    '',
    `「${getDailyMsg(stage)}」`,
    '',
    '📲 あなたも習慣を始めよう！',
  ];
  return lines.join('\n');
}

export async function shareCard(text) {
  try {
    if (navigator.share) { await navigator.share({ text, title: 'HabitFlow の記録' }); return 'shared'; }
  } catch {}
  try { await navigator.clipboard.writeText(text); return 'copied'; } catch {}
  return false;
}
