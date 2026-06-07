// Application-wide constants — no business logic.

export const CATEGORIES = [
  { id: 'all',    label: 'すべて',   emoji: '✨', color: '#4CAF50' },
  { id: 'health', label: '健康',     emoji: '💪', color: '#E53935' },
  { id: 'mind',   label: 'メンタル', emoji: '🧠', color: '#7B1FA2' },
  { id: 'learn',  label: '学習',     emoji: '📚', color: '#1565C0' },
  { id: 'life',   label: '生活',     emoji: '🏠', color: '#F57C00' },
  { id: 'social', label: '社会',     emoji: '👥', color: '#00838F' },
];

export const EMOJIS = [
  '🌟','🏃','💪','📚','🧘','💧','🥗','😴','🎯','✍️',
  '🧠','🎵','🌿','💊','🚴','🏊','🎨','🙏','🌅','❤️',
  '🔥','🎸','📝','🍎','🏋️','🧹','☕','🚶','🎮','📱',
];

export const TEMPLATES = [
  { name: '毎日運動',   emoji: '🏃', cat: 'health', time: 'morning'  },
  { name: '水2L飲む',  emoji: '💧', cat: 'health', time: ''          },
  { name: '瞑想10分',  emoji: '🧘', cat: 'mind',   time: 'morning'  },
  { name: '読書30分',  emoji: '📚', cat: 'learn',  time: 'evening'  },
  { name: '日記を書く', emoji: '✍️', cat: 'mind',   time: 'evening'  },
  { name: '早起き',    emoji: '🌅', cat: 'life',   time: 'morning'  },
  { name: '野菜を食べる', emoji: '🥗', cat: 'health', time: ''       },
  { name: '英語学習',  emoji: '🎯', cat: 'learn',  time: ''          },
];

export const ACHIEVEMENTS = [
  { id: 'first',   name: '初めの一歩',   desc: '初回チェック',       ico: '🌱', check: d => d.totalChecks  >= 1  },
  { id: 'week',    name: '1週間継続',    desc: '7日連続達成',        ico: '🔥', check: d => d.maxStreak    >= 7  },
  { id: 'month',   name: '1ヶ月の壁',   desc: '30日連続達成',       ico: '💎', check: d => d.maxStreak    >= 30 },
  { id: 'five',    name: 'コレクター',   desc: '習慣5個追加',        ico: '🏆', check: d => d.totalHabits  >= 5  },
  { id: 'perfect', name: '完璧な1日',   desc: '全習慣を達成',       ico: '⭐', check: d => d.perfectDays  >= 1  },
  { id: 'century', name: '100回達成',   desc: '累計100回チェック',   ico: '💯', check: d => d.totalChecks  >= 100 },
];
