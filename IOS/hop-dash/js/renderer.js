// Pure canvas renderer — receives game state, draws it, mutates nothing.

export class Renderer {
  #canvas;
  #ctx;
  #bgLayers = [];
  #groundDots = [];

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx    = canvas.getContext('2d');
  }

  get W() { return this.#canvas.width; }
  get H() { return this.#canvas.height; }

  // ── Initialise world decorations ──────────────────────────
  initWorld(W, H, GY) {
    this.#bgLayers = [
      {
        type: 'stars',
        items: Array.from({ length: 80 }, () => ({
          x: Math.random() * W, y: Math.random() * GY * 0.7,
          r: Math.random() * 1.8 + 0.3, spd: 0.15,
          b: Math.random() * 0.6 + 0.2,
        })),
      },
      { type: 'mountains', pts: this.#genMountains(4, GY * 0.4, GY * 0.7, W, 1), spd: 0.3, color: 'rgba(10,30,60,.9)' },
      { type: 'hills',     pts: this.#genMountains(8, GY * 0.6, GY * 0.85, W, 2), spd: 0.8, color: 'rgba(15,40,70,.85)' },
    ];
    this.#groundDots = Array.from({ length: 24 }, () => ({
      x: Math.random() * W, phase: Math.random() * Math.PI * 2,
    }));
  }

  // ── Scroll background ─────────────────────────────────────
  scrollBg(speed, frame) {
    this.#bgLayers.forEach(l => {
      if (l.type === 'stars') {
        l.items.forEach(s => { s.x -= l.spd; if (s.x < 0) s.x = this.W + 2; });
      } else if (l.pts) {
        l.pts.forEach(p => { p.x -= l.spd; if (p.x < -50) p.x += this.W + 100; });
      }
    });
    this.#groundDots.forEach(d => {
      d.x -= speed * 0.5;
      if (d.x < 0) d.x = this.W + Math.random() * 100;
      d.phase += 0.05;
    });
  }

  // ── Full frame draw ───────────────────────────────────────
  drawFrame(GY, frame, score, speed, player, obstacles, coinItems, powerUps, particles, trails, shieldTimer) {
    const ctx = this.#ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    this.#drawSky(GY, score);
    this.#drawBgLayers(GY, frame);
    this.#drawGround(GY, frame, speed);
    this.#drawTrails(trails);
    this.#drawObstacles(obstacles, GY);
    this.#drawCoinItems(coinItems);
    this.#drawPowerUpItems(powerUps, frame);
    this.#drawPlayer(player, GY, frame, shieldTimer);
    this.#drawParticles(particles);
  }

  // ── Private draw methods ──────────────────────────────────
  #drawSky(GY, score) {
    const t   = Math.min(1, score / 300);
    const r   = Math.floor(t * 5),  gb = Math.floor(10 + t * 5), b = Math.floor(20 + t * 15);
    const g   = this.#ctx.createLinearGradient(0, 0, 0, GY);
    g.addColorStop(0, `rgb(${r},${gb},${b})`);
    g.addColorStop(1, `rgb(${r + 10},${gb + 30},${b + 60})`);
    this.#ctx.fillStyle = g;
    this.#ctx.fillRect(0, 0, this.W, GY);
  }

  #drawBgLayers(GY, frame) {
    const ctx = this.#ctx;
    this.#bgLayers.forEach(l => {
      if (l.type === 'stars') {
        l.items.forEach(s => {
          ctx.globalAlpha = s.b * (0.5 + 0.5 * Math.sin(frame * 0.03 + s.x));
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } else if (l.pts) {
        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(0, GY);
        l.pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(this.W, GY);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  #drawGround(GY, frame, speed) {
    const ctx = this.#ctx;
    const g = ctx.createLinearGradient(0, GY, 0, this.H);
    g.addColorStop(0, '#1B5E20');
    g.addColorStop(0.4, '#2E7D32');
    g.addColorStop(1, '#0A280D');
    ctx.fillStyle = g;
    ctx.fillRect(0, GY, this.W, this.H - GY);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, GY, this.W, 3);
    // Moving dashes
    ctx.strokeStyle = 'rgba(76,175,80,.2)';
    ctx.lineWidth = 1.5;
    this.#groundDots.forEach(d => {
      ctx.globalAlpha = 0.3 + 0.2 * Math.sin(d.phase);
      ctx.beginPath();
      ctx.moveTo(d.x, GY + 8);
      ctx.lineTo(d.x + 12, GY + 8);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  #drawObstacles(obstacles, GY) {
    const ctx = this.#ctx;
    obstacles.forEach(o => {
      const oy = GY - o.h;
      const g = ctx.createLinearGradient(o.x, oy, o.x + o.w, oy + o.h);
      g.addColorStop(0, o.color);
      g.addColorStop(1, '#B71C1C');
      ctx.fillStyle = g;
      this.#roundRect(o.x, oy, o.w, o.h, 5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.15)';
      ctx.fillRect(o.x + 4, oy + 4, o.w - 8, 4);
      // Spike
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.moveTo(o.x + o.w / 2, oy - 8);
      ctx.lineTo(o.x + o.w / 2 - 6, oy);
      ctx.lineTo(o.x + o.w / 2 + 6, oy);
      ctx.fill();
    });
  }

  #drawCoinItems(coins) {
    const ctx = this.#ctx;
    coins.forEach(c => {
      if (c.collected) return;
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 2);
      glow.addColorStop(0, 'rgba(255,215,0,.3)');
      glow.addColorStop(1, 'rgba(255,215,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      ctx.beginPath();
      ctx.arc(c.x - 2, c.y - 2, c.r * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F9A825';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  #drawPowerUpItems(powerUps, frame) {
    const ctx = this.#ctx;
    powerUps.forEach(p => {
      if (p.collected) return;
      const bobY = p.y + Math.sin(p.bob) * 5;
      const col  = p.type === 'shield' ? '#90CAF9' : '#FFD54F';
      const ga   = 0.3 + 0.3 * Math.sin(frame * 0.1 + p.glowPhase * Math.PI * 2);
      ctx.globalAlpha = ga;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x, bobY, p.r * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.type === 'shield' ? '#1565C0' : '#F57F17';
      ctx.beginPath();
      ctx.arc(p.x, bobY, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.font = `bold ${p.r * 1.3}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.type === 'shield' ? '🛡' : '🧲', p.x, bobY);
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
    });
  }

  #drawTrails(trails) {
    const ctx = this.#ctx;
    trails.forEach((t, i) => {
      ctx.globalAlpha = t.alpha * 0.5;
      ctx.fillStyle   = t.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * (i / Math.max(trails.length, 1)), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  #drawPlayer(p, GY, frame, shieldTimer) {
    const blink = p.invincible > 0 && Math.floor(p.invincibleFrame / 5) % 2 === 0;
    if (blink) return;

    const ctx = this.#ctx;
    const px = p.x, py = p.y, pw = p.w, ph = p.h;
    const cx = px + pw / 2, cy = py + ph / 2;

    ctx.globalAlpha = p.invincible > 0 ? 0.65 : 1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(p.squashX, p.squashY);
    ctx.translate(-cx, -cy);

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.beginPath();
    ctx.ellipse(px + pw / 2, GY + 2, pw * 0.4, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body gradient
    const bg = ctx.createLinearGradient(px, py, px + pw, py + ph);
    bg.addColorStop(0, '#90CAF9');
    bg.addColorStop(1, '#1565C0');
    ctx.fillStyle = bg;
    this.#roundRect(px, py, pw, ph, 10);
    ctx.fill();

    // Helmet shine
    const shine = ctx.createLinearGradient(px + 4, py + 4, px + pw - 4, py + ph * 0.4);
    shine.addColorStop(0, 'rgba(255,255,255,.35)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    this.#roundRect(px + 4, py + 4, pw - 8, ph * 0.35, 8);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px + pw * 0.68, py + ph * 0.3, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0D1B2A';
    ctx.beginPath();
    ctx.arc(px + pw * 0.68, py + ph * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath();
    ctx.arc(px + pw * 0.68 + 2, py + ph * 0.3 - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#0D1B2A';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(px + pw * 0.5, py + ph * 0.56, 7, 0.05 * Math.PI, 0.95 * Math.PI);
    ctx.stroke();

    // Shield glow
    if (shieldTimer > 0) {
      ctx.strokeStyle = 'rgba(144,202,249,.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph / 2, pw * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#90CAF9';
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph / 2, pw * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = p.invincible > 0 ? 0.65 : 1;
    }

    // Legs
    if (p.onGround) {
      const lp = Math.sin(p.legPhase);
      ctx.fillStyle = '#1565C0';
      this.#roundRect(px + 5,       py + ph,     12, 9 + lp * 5, 3); ctx.fill();
      this.#roundRect(px + pw - 17, py + ph,     12, 9 - lp * 5, 3); ctx.fill();
      ctx.fillStyle = '#0D47A1';
      ctx.fillRect(px + 3,       py + ph + 8 + lp * 5, 16, 5);
      ctx.fillRect(px + pw - 19, py + ph + 8 - lp * 5, 16, 5);
    } else {
      ctx.fillStyle = '#1565C0';
      this.#roundRect(px + 4,       py + ph, 14, 6, 3); ctx.fill();
      this.#roundRect(px + pw - 18, py + ph, 14, 6, 3); ctx.fill();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  #drawParticles(particles) {
    const ctx = this.#ctx;
    particles.forEach(p => {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle   = p.color;
      if (p.star) {
        this.#drawStar(p.x, p.y, 5, p.r, p.r * 0.5);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }

  #drawStar(x, y, pts, r1, r2) {
    const ctx = this.#ctx;
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const a = (i * Math.PI) / pts - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
              : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  #roundRect(x, y, w, h, r) {
    const ctx = this.#ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Mountain generator ────────────────────────────────────
  #genMountains(count, minY, maxY, w, seed) {
    const pts = [];
    const step = w / (count * 2);
    for (let x = 0; x <= w + step * 2; x += step) {
      pts.push({ x, y: minY + (maxY - minY) * (0.3 + 0.7 * Math.abs(Math.sin(x * 0.007 * seed + seed))) });
    }
    return pts;
  }
}
