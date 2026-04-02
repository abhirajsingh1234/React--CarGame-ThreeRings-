import React, { useEffect, useRef, useState, useCallback } from "react";
import "./CarGame.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 400;
const H = 550;
const ROAD_LEFT = 60;
const ROAD_RIGHT = 340;
const ROAD_W = ROAD_RIGHT - ROAD_LEFT;
const LANE_COUNT = 3;
const LANE_W = ROAD_W / LANE_COUNT;
const LANES = [0, 1, 2].map((i) => ROAD_LEFT + LANE_W * i + LANE_W / 2);

const PLAYER_W = 36;
const PLAYER_H = 64;
const ENEMY_W = 36;
const ENEMY_H = 64;
const PLAYER_Y = H - 110;

const STRIPE_H = 60;
const STRIPE_GAP = 60;
const STRIPE_W = 8;

// ─── Draw Helpers ─────────────────────────────────────────────────────────────
function drawRoad(ctx, stripeOffset) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#02020f");
  sky.addColorStop(1, "#070712");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Road surface
  ctx.fillStyle = "#111118";
  ctx.fillRect(ROAD_LEFT, 0, ROAD_W, H);

  // Road edges glow
  ctx.save();
  ctx.shadowColor = "#00f5ff";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#00f5ffcc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ROAD_LEFT, 0);
  ctx.lineTo(ROAD_LEFT, H);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ROAD_RIGHT, 0);
  ctx.lineTo(ROAD_RIGHT, H);
  ctx.stroke();
  ctx.restore();

  // Lane stripes
  for (let lane = 1; lane < LANE_COUNT; lane++) {
    const x = ROAD_LEFT + LANE_W * lane;
    ctx.save();
    ctx.strokeStyle = "#ffffff33";
    ctx.lineWidth = STRIPE_W;
    ctx.setLineDash([STRIPE_H, STRIPE_GAP]);
    ctx.lineDashOffset = -stripeOffset;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
    ctx.restore();
  }

  // Side scenery: fence posts
  for (let i = 0; i < 12; i++) {
    const y = ((i * 50 + stripeOffset * 0.6) % H);
    // Left
    ctx.fillStyle = "#ffffff18";
    ctx.fillRect(ROAD_LEFT - 20, y, 4, 30);
    // Right
    ctx.fillRect(ROAD_RIGHT + 16, y, 4, 30);
  }
}

function drawCar(ctx, x, y, w, h, color, isPlayer) {
  ctx.save();
  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - w / 2 + 4, y - h / 2 + 10, w - 8, h - 20, 4);
  ctx.fill();

  // Cabin
  ctx.fillStyle = isPlayer ? "#001a1a" : "#1a0010";
  ctx.beginPath();
  ctx.roundRect(x - w / 2 + 9, y - h / 2 + 18, w - 18, h * 0.35, 4);
  ctx.fill();

  // Headlights / taillights
  const lightColor = isPlayer ? "#fffbe0" : "#ff4444";
  ctx.fillStyle = lightColor;
  ctx.shadowColor = lightColor;
  ctx.shadowBlur = 10;
  const ly = isPlayer ? y - h / 2 + 12 : y + h / 2 - 18;
  ctx.fillRect(x - w / 2 + 5, ly, 10, 5);
  ctx.fillRect(x + w / 2 - 15, ly, 10, 5);

  // Wheels
  ctx.fillStyle = "#000";
  ctx.shadowBlur = 0;
  [
    [x - w / 2, y - h / 2 + 20],
    [x + w / 2, y - h / 2 + 20],
    [x - w / 2, y + h / 2 - 22],
    [x + w / 2, y + h / 2 - 22],
  ].forEach(([wx, wy]) => {
    ctx.beginPath();
    ctx.ellipse(wx, wy, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawExplosion(ctx, particles) {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function spawnParticles(x, y) {
  const colors = ["#ff006e", "#ffe600", "#ff4500", "#fff"];
  return Array.from({ length: 28 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6 - 2,
    r: Math.random() * 5 + 2,
    alpha: 1,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CarGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });

  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(3);
  const [uiBest, setUiBest] = useState(0);
  const [uiSpeed, setUiSpeed] = useState(0);
  const [phase, setPhase] = useState("start"); // start | playing | gameover
  const [btnActive, setBtnActive] = useState({ left: false, right: false });

  // ── Init / Reset game state
  const initState = useCallback(() => {
    return {
      playerX: LANES[1],
      playerLane: 1,
      targetX: LANES[1],
      enemies: [],
      particles: [],
      stripeOffset: 0,
      score: 0,
      lives: 3,
      speed: 3,
      frame: 0,
      invincible: 0,
      spawnInterval: 80,
      moveDir: 0,
    };
  }, []);

  // ── Start / Restart
  const startGame = useCallback(() => {
    stateRef.current = initState();
    setUiScore(0);
    setUiLives(3);
    setUiSpeed(0);
    setPhase("playing");
  }, [initState]);

  // ── Move left / right
  const moveLeft = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.playerLane <= 0) return;
    s.playerLane -= 1;
    s.targetX = LANES[s.playerLane];
  }, []);

  const moveRight = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.playerLane >= LANE_COUNT - 1) return;
    s.playerLane += 1;
    s.targetX = LANES[s.playerLane];
  }, []);

  // ── Keyboard
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        if (!keysRef.current.left) moveLeft();
        keysRef.current.left = true;
        setBtnActive((b) => ({ ...b, left: true }));
      }
      if (e.key === "ArrowRight") {
        if (!keysRef.current.right) moveRight();
        keysRef.current.right = true;
        setBtnActive((b) => ({ ...b, right: true }));
      }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft") { keysRef.current.left = false; setBtnActive((b) => ({ ...b, left: false })); }
      if (e.key === "ArrowRight") { keysRef.current.right = false; setBtnActive((b) => ({ ...b, right: false })); }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); };
  }, [moveLeft, moveRight]);

  // ── Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const s = stateRef.current;

      if (!s || phase !== "playing") {
        // Draw static road when not playing
        drawRoad(ctx, 0);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      s.frame++;
      s.score++;
      s.speed = 3 + Math.floor(s.score / 300) * 0.5;
      if (s.speed > 14) s.speed = 14;
      s.stripeOffset = (s.stripeOffset + s.speed * 0.8) % (STRIPE_H + STRIPE_GAP);

      // Smooth player movement
      s.playerX += (s.targetX - s.playerX) * 0.18;

      // Spawn enemies
      if (s.frame % Math.max(25, s.spawnInterval - Math.floor(s.score / 400) * 5) === 0) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        s.enemies.push({ x: LANES[lane], y: -ENEMY_H, lane, w: ENEMY_W, h: ENEMY_H });
      }

      // Move enemies
      s.enemies = s.enemies
        .map((e) => ({ ...e, y: e.y + s.speed + 1.5 }))
        .filter((e) => e.y < H + ENEMY_H);

      // Collision
      if (s.invincible <= 0) {
        for (const e of s.enemies) {
          const dx = Math.abs(s.playerX - e.x);
          const dy = Math.abs(PLAYER_Y - e.y);
          if (dx < (PLAYER_W + e.w) / 2 - 6 && dy < (PLAYER_H + e.h) / 2 - 10) {
            // Hit!
            s.particles.push(...spawnParticles(s.playerX, PLAYER_Y));
            s.lives -= 1;
            s.invincible = 90;
            s.enemies = s.enemies.filter((en) => en !== e);
            setUiLives(s.lives);
            if (s.lives <= 0) {
              setUiBest((prev) => Math.max(prev, Math.floor(s.score / 10)));
              setPhase("gameover");
              stateRef.current = null;
              return;
            }
            break;
          }
        }
      } else {
        s.invincible--;
      }

      // Particles
      s.particles = s.particles
        .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.18, alpha: p.alpha - 0.035, r: p.r * 0.97 }))
        .filter((p) => p.alpha > 0);

      // UI sync (throttled)
      if (s.frame % 6 === 0) {
        setUiScore(Math.floor(s.score / 10));
        setUiSpeed(Math.round(((s.speed - 3) / 11) * 100));
      }

      // ── DRAW ──
      drawRoad(ctx, s.stripeOffset);

      // Enemies
      s.enemies.forEach((e) => drawCar(ctx, e.x, e.y, e.w, e.h, "#ff006e", false));

      // Player (blink if invincible)
      const blink = s.invincible > 0 && Math.floor(s.invincible / 6) % 2 === 0;
      if (!blink) drawCar(ctx, s.playerX, PLAYER_Y, PLAYER_W, PLAYER_H, "#00f5ff", true);

      // Particles
      drawExplosion(ctx, s.particles);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const speedPct = `${uiSpeed}%`;

  return (
    <div className="game-wrapper">
      {/* HUD */}
      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">Score</span>
          <span className="hud-value">{String(uiScore).padStart(5, "0")}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Speed</span>
          <div className="speed-bar-wrap">
            <div className="speed-bar">
              <div className="speed-bar-fill" style={{ width: speedPct }} />
            </div>
            <span className="hud-label">{uiSpeed}%</span>
          </div>
        </div>
        <div className="hud-item">
          <span className="hud-label">Lives</span>
          <span className="hud-value lives">{"♥".repeat(uiLives)}{"♡".repeat(3 - uiLives)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Best</span>
          <span className="hud-value best">{String(uiBest).padStart(5, "0")}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="game-canvas-area">
        <canvas ref={canvasRef} id="gameCanvas" width={W} height={H} />

        {/* Start overlay */}
        <div className={`overlay ${phase !== "start" ? "hidden" : ""}`}>
          <div className="overlay-title">TURBO<br />DASH</div>
          <div className="overlay-sub">3 LANES · 3 LIVES · INFINITE SPEED</div>
          <div className="overlay-sub" style={{ marginTop: 8 }}>← → KEYS or BUTTONS BELOW</div>
          <button className="btn btn-restart" style={{ marginTop: 16, width: 130, fontSize: 12 }} onClick={startGame}>
            <span className="icon">▶</span> START
          </button>
        </div>

        {/* Game over overlay */}
        <div className={`overlay ${phase !== "gameover" ? "hidden" : ""}`}>
          <div className="overlay-title gameover">GAME<br />OVER</div>
          <div className="overlay-score">SCORE: {String(uiScore).padStart(5, "0")}</div>
          <div className="overlay-score" style={{ color: "var(--neon-yellow)" }}>BEST:  {String(uiBest).padStart(5, "0")}</div>
          <button className="btn btn-restart" style={{ marginTop: 16, width: 130, fontSize: 12 }} onClick={startGame}>
            <span className="icon">↺</span> RETRY
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="ctrl-group">
          <button
            className={`btn btn-move ${btnActive.left ? "active" : ""}`}
            onMouseDown={() => { moveLeft(); setBtnActive((b) => ({ ...b, left: true })); }}
            onMouseUp={() => setBtnActive((b) => ({ ...b, left: false }))}
            onMouseLeave={() => setBtnActive((b) => ({ ...b, left: false }))}
            onTouchStart={(e) => { e.preventDefault(); moveLeft(); setBtnActive((b) => ({ ...b, left: true })); }}
            onTouchEnd={() => setBtnActive((b) => ({ ...b, left: false }))}
          >
            ◀
          </button>
          <button
            className={`btn btn-move ${btnActive.right ? "active" : ""}`}
            onMouseDown={() => { moveRight(); setBtnActive((b) => ({ ...b, right: true })); }}
            onMouseUp={() => setBtnActive((b) => ({ ...b, right: false }))}
            onMouseLeave={() => setBtnActive((b) => ({ ...b, right: false }))}
            onTouchStart={(e) => { e.preventDefault(); moveRight(); setBtnActive((b) => ({ ...b, right: true })); }}
            onTouchEnd={() => setBtnActive((b) => ({ ...b, right: false }))}
          >
            ▶
          </button>
        </div>

        <button className="btn btn-restart" onClick={startGame}>
          <span className="icon">↺</span>
          RESTART
        </button>
      </div>
    </div>
  );
}
