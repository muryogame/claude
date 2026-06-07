// DOM rendering — owns all direct DOM mutations for the game.
import { TILE_STYLES, TILE_STYLE_DEFAULT, GAP, PAD } from './constants.js';

export class Renderer {
  #tileSize = 80;
  #gridTilesEl;
  #gridBgEl;
  #gridOuterEl;

  constructor() {
    this.#gridTilesEl = document.getElementById('gridTiles');
    this.#gridBgEl    = document.getElementById('gridBg');
    this.#gridOuterEl = document.getElementById('gridOuter');
    this.#buildBgCells();
  }

  // ── Sizing ────────────────────────────────────────────────
  resize(gridSize) {
    this.#tileSize = (gridSize - PAD * 2 - GAP * 3) / 4;
    const GRID  = 4;
    const inner = this.#tileSize * GRID + GAP * (GRID - 1);
    // Set both width and height explicitly so aspect-ratio isn't relied upon
    this.#gridOuterEl.style.width  = gridSize + 'px';
    this.#gridOuterEl.style.height = gridSize + 'px';
    this.#gridBgEl.style.gridTemplateColumns = `repeat(4, ${this.#tileSize}px)`;
    this.#gridBgEl.style.gap    = GAP + 'px';
    this.#gridTilesEl.style.width  = inner + 'px';
    this.#gridTilesEl.style.height = inner + 'px';
  }

  getTileSize() { return this.#tileSize; }

  // ── Tile lifecycle ────────────────────────────────────────
  createTile(id, val, r, c, cls = 't-new') {
    const el = document.createElement('div');
    el.className = 'tile ' + cls;
    el.setAttribute('role', 'gridcell');
    el.setAttribute('aria-label', String(val));
    this.#applyTileStyle(el, val);
    this.#setTilePos(el, r, c);
    this.#gridTilesEl.appendChild(el);
    return el;
  }

  moveTile(el, toR, toC) {
    if (!el) return;
    this.#setTilePos(el, toR, toC);
  }

  removeTile(el) {
    el?.remove();
  }

  refreshTileStyle(el, val) {
    this.#applyTileStyle(el, val);
    el.setAttribute('aria-label', String(val));
  }

  repositionAll(tileMap) {
    // Called on window resize — re-positions every live tile
    tileMap.forEach(tile => {
      const el = tile.el;
      if (!el) return;
      this.#setTilePos(el, tile.r, tile.c);
      el.style.width  = this.#tileSize + 'px';
      el.style.height = this.#tileSize + 'px';
      this.#applyTileStyle(el, tile.val);
    });
  }

  // ── HUD ───────────────────────────────────────────────────
  updateScore(score, best) {
    const sv = document.getElementById('scoreVal');
    sv.textContent = score.toLocaleString();
    sv.classList.remove('bump');
    // Trigger reflow so animation restarts
    void sv.offsetWidth;
    sv.classList.add('bump');
    document.getElementById('bestVal').textContent = best.toLocaleString();
  }

  updateStats(moves, merges, elapsedMs) {
    const s = Math.floor(elapsedMs / 1000);
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    document.getElementById('statMoves').textContent  = moves + '手';
    document.getElementById('statMerges').textContent = merges + '回合体';
    document.getElementById('statTime').textContent   = m + ':' + ss;
  }

  updateProgress(maxVal) {
    const lvl = Math.max(1, Math.log2(maxVal));
    const pct = Math.min(100, (lvl / 11) * 100);
    document.getElementById('progFill').style.width = pct + '%';
    // Use textContent — no user input involved
    document.getElementById('progLabel').textContent = '最高タイル: ' + maxVal.toLocaleString();
    document.getElementById('gridOuter').setAttribute('aria-valuenow', Math.round(pct));
  }

  // ── Score popup ───────────────────────────────────────────
  showScorePopup(val, r, c) {
    const el = document.createElement('div');
    el.className = 'score-pop';
    // textContent — val is a number, not user input
    el.textContent = '+' + val.toLocaleString();
    const rect = this.#gridOuterEl.getBoundingClientRect();
    const x = rect.left + PAD + c * (this.#tileSize + GAP) + this.#tileSize / 2 - 20;
    const y = rect.top  + PAD + r * (this.#tileSize + GAP) + this.#tileSize / 2 - 10;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  // ── Dialog ────────────────────────────────────────────────
  showDialog(ico, title, score, msg, canContinue) {
    // All values are application-controlled strings — safe to set via textContent
    document.getElementById('dlgIco').textContent   = ico;
    document.getElementById('dlgTitle').textContent = title;
    document.getElementById('dlgScore').textContent = score.toLocaleString();
    document.getElementById('dlgMsg').textContent   = msg;
    document.getElementById('contBtn').style.display = canContinue ? '' : 'none';
    document.getElementById('overlay').classList.add('show');
  }

  closeDialog() {
    document.getElementById('overlay').classList.remove('show');
  }

  setUndoEnabled(enabled) {
    document.getElementById('undoBtn').disabled = !enabled;
  }

  setSoundIcon(on) {
    document.getElementById('soundIco').textContent = on ? '🔊' : '🔇';
  }

  // ── Private ───────────────────────────────────────────────
  #buildBgCells() {
    this.#gridBgEl.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      this.#gridBgEl.appendChild(cell);
    }
  }

  #tilePos(r, c) {
    return {
      left: c * (this.#tileSize + GAP),
      top:  r * (this.#tileSize + GAP),
    };
  }

  #setTilePos(el, r, c) {
    const { left, top } = this.#tilePos(r, c);
    el.style.left   = left + 'px';
    el.style.top    = top  + 'px';
    el.style.width  = this.#tileSize + 'px';
    el.style.height = this.#tileSize + 'px';
    const len = String(el.textContent).replace(/,/g, '').length;
    el.style.fontSize = this.#tileSize * (len <= 2 ? .42 : len === 3 ? .33 : len === 4 ? .26 : .2) + 'px';
  }

  #applyTileStyle(el, val) {
    const s = TILE_STYLES[val] ?? TILE_STYLE_DEFAULT;
    el.style.background = s.bg;
    el.style.color      = s.c;
    el.style.boxShadow  = s.glow ?? '0 4px 12px rgba(0,0,0,.35)';
    if (s.glow) { el.dataset.glow = '1'; }
    else         { delete el.dataset.glow; }
    // Safe: val is always a number from game logic
    el.textContent = val.toLocaleString();
  }
}
