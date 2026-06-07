// Pure game logic — no DOM access, no globals.
import { GRID } from './constants.js';

const STORAGE_KEY_BEST = 'nf_best';

export class GameState {
  constructor() {
    this.cells    = [];        // GRID×GRID, value = tile id (0 = empty)
    this.tileMap  = new Map(); // id -> { id, val, r, c }
    this.nextId   = 0;
    this.score    = 0;
    this.best     = this.#loadBest();
    this.gameOver = false;
    this.busy     = false;
    this.undoState = null;
    this.moves    = 0;
    this.mergeCount = 0;
    this.startTime  = Date.now();
  }

  // ── Initialisation ────────────────────────────────────────
  init() {
    this.tileMap.clear();
    this.cells      = Array.from({ length: GRID }, () => Array(GRID).fill(0));
    this.score      = 0;
    this.moves      = 0;
    this.mergeCount = 0;
    this.gameOver   = false;
    this.busy       = false;
    this.undoState  = null;
    this.startTime  = Date.now();
    this.addRandom();
    this.addRandom();
  }

  // ── Tile management ───────────────────────────────────────
  addRandom() {
    const empty = this.#getEmpty();
    if (!empty.length) return null;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const id  = ++this.nextId;
    const val = Math.random() < 0.9 ? 2 : 4;
    this.cells[r][c] = id;
    this.tileMap.set(id, { id, val, r, c });
    return { id, r, c, isNew: true };
  }

  getTile(id) { return this.tileMap.get(id) ?? null; }
  getMaxVal()  { return Math.max(0, ...[...this.tileMap.values()].map(t => t.val)); }

  // ── Undo ──────────────────────────────────────────────────
  saveUndo() {
    this.undoState = {
      cells:      this.cells.map(row => [...row]),
      tiles:      [...this.tileMap.entries()].map(([id, t]) => [id, { ...t }]),
      score:      this.score,
      moves:      this.moves,
      mergeCount: this.mergeCount,
    };
  }

  restoreUndo() {
    if (!this.undoState) return false;
    const s = this.undoState;
    this.cells      = s.cells;
    this.tileMap    = new Map(s.tiles.map(([id, t]) => [id, { ...t }]));
    this.score      = s.score;
    this.moves      = s.moves;
    this.mergeCount = s.mergeCount;
    this.undoState  = null;
    this.gameOver   = false;
    return true;
  }

  // ── Move computation (pure — does not mutate state) ───────
  computeMove(dir) {
    const isH = dir === 'left' || dir === 'right';
    const rev  = dir === 'right' || dir === 'down';
    const actions = []; // { t: 'mv'|'mg', id, toR, toC, [idB, newVal] }
    let scoreDelta = 0, moved = false;

    // Operate on a shallow snapshot to avoid mutating game state
    const snap = this.cells.map(r => [...r]);

    for (let li = 0; li < GRID; li++) {
      const line = [];
      for (let i = 0; i < GRID; i++) {
        const [r, c] = isH ? [li, i] : [i, li];
        if (snap[r][c]) line.push({ id: snap[r][c], r, c });
      }
      if (rev) line.reverse();

      // Clear snapshot cells for this line so we can write new positions
      line.forEach(({ r, c }) => { snap[r][c] = 0; });

      let pos = 0;
      for (let i = 0; i < line.length; i++) {
        const cur = line[i];
        const toPos = rev ? GRID - 1 - pos : pos;
        const [toR, toC] = isH ? [li, toPos] : [toPos, li];

        const valA = this.tileMap.get(cur.id)?.val;

        if (i + 1 < line.length) {
          const valB = this.tileMap.get(line[i + 1].id)?.val;
          if (valA === valB) {
            actions.push({ t: 'mv', id: cur.id,         toR, toC });
            actions.push({ t: 'mv', id: line[i + 1].id, toR, toC });
            actions.push({ t: 'mg', idA: cur.id, idB: line[i + 1].id, newVal: valA * 2, toR, toC });
            scoreDelta += valA * 2;
            snap[toR][toC] = -1; // placeholder
            moved = true;
            i++;
            pos++;
            continue;
          }
        }

        if (cur.r !== toR || cur.c !== toC) moved = true;
        actions.push({ t: 'mv', id: cur.id, toR, toC });
        snap[toR][toC] = cur.id;
        pos++;
      }
    }

    return { moved, actions, scoreDelta };
  }

  // ── Apply merges after animation completes ────────────────
  applyMerges(actions) {
    // Rebuild cells from the slide phase
    this.cells = Array.from({ length: GRID }, () => Array(GRID).fill(0));
    const mergeCoords = new Set(
      actions.filter(a => a.t === 'mg').map(a => `${a.toR},${a.toC}`)
    );

    for (const a of actions.filter(a => a.t === 'mv')) {
      if (mergeCoords.has(`${a.toR},${a.toC}`)) continue;
      this.cells[a.toR][a.toC] = a.id;
      const t = this.tileMap.get(a.id);
      if (t) { t.r = a.toR; t.c = a.toC; }
    }

    const newTiles = [];
    for (const m of actions.filter(a => a.t === 'mg')) {
      this.tileMap.delete(m.idA);
      this.tileMap.delete(m.idB);
      const id = ++this.nextId;
      this.tileMap.set(id, { id, val: m.newVal, r: m.toR, c: m.toC });
      this.cells[m.toR][m.toC] = id;
      newTiles.push({ id, val: m.newVal, r: m.toR, c: m.toC, isMerged: true });
      this.mergeCount++;
    }
    return newTiles;
  }

  // ── Score ─────────────────────────────────────────────────
  addScore(delta) {
    this.score += delta;
    if (this.score > this.best) {
      this.best = this.score;
      this.#saveBest();
    }
  }

  // ── Game state check ──────────────────────────────────────
  checkState() {
    if (this.getMaxVal() >= 2048) return 'win';
    if (this.#getEmpty().length)  return 'playing';
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const v = this.tileMap.get(this.cells[r][c])?.val;
        if (c + 1 < GRID && this.tileMap.get(this.cells[r][c + 1])?.val === v) return 'playing';
        if (r + 1 < GRID && this.tileMap.get(this.cells[r + 1][c])?.val === v) return 'playing';
      }
    }
    return 'over';
  }

  // ── Private helpers ───────────────────────────────────────
  #getEmpty() {
    const e = [];
    for (let r = 0; r < GRID; r++)
      for (let c = 0; c < GRID; c++)
        if (!this.cells[r][c]) e.push([r, c]);
    return e;
  }

  #loadBest() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BEST);
      const n = parseInt(raw, 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch { return 0; }
  }

  #saveBest() {
    try { localStorage.setItem(STORAGE_KEY_BEST, String(this.best)); } catch { /* quota */ }
  }
}
