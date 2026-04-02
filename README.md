# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# ⚔️ Kurukshetra Universe — Interactive React Experience

A cinematic, multi-experience React application combining a mythological battlefield simulation and an arcade racing game — both built entirely with React Hooks and pure CSS.

---

## 🌌 Experience 1 — 🪽 Kurukshetra: The Divine Strike

A cinematic, interactive 3D web experience simulating a battlefield scene from Kurukshetra, featuring a movable warrior protected by mystical snake rings and an interactive Sudarshan Chakra attack system.

### 🌟 Features

**The Sudarshan Chakra**
- Realistic 3D design created using 24 serrated gold blades with metallic gradients
- High-speed animation rotating at 0.15s per cycle to simulate realistic motion blur
- Targeting system: flies from the upper-left corner to the center of the battlefield upon interaction

**Interactive Warrior (Mario-Style)**
- Pixel art aesthetic: a detailed humanoid figure built entirely with CSS div blocks
- Fully movable across the "Blood Shed Land" using keyboard controls
- Dynamic states: features a detachable head for the final "Beheading" stage

**Protective Snake Rings**
- Triple layer defense: three rings (White, Grey, and Red) orbit the warrior
- S-shape slither using lateral undulation to mimic biological snake movement
- Destructible: rings vanish one by one as they are struck by the Chakra

**The Battlefield (Kurukshetra)**
- Atmospheric lighting: a dark, blood-red radial gradient sky
- Terrain: a skewed brown landscape featuring blood puddles and moving fog

### 🎮 Controls — Kurukshetra

| Action | Control |
|---|---|
| Move Warrior | Arrow Up / Down / Left / Right |
| Trigger Attack | Click the **STRIKE** Button |
| Reset Scene | Refresh Browser |

---

## 🏎️ Experience 2 — Turbo Dash: Car Racing Game

A neon retro-arcade, endless car racing game set across a 3-lane highway. Dodge enemy vehicles, survive as long as possible, and beat your high score.

### 🌟 Features

**The Road**
- 3-lane animated highway with scrolling dashed stripes
- Speed increases progressively the longer you survive
- Roadside fence posts scroll for added depth and motion feel

**Player Car**
- Cyan neon-styled car with smooth lane transitions
- Blinks with invincibility frames after a collision
- Controlled via on-screen buttons or keyboard arrow keys

**Enemy Cars**
- Pink neon enemy cars spawn randomly across all 3 lanes
- Spawn rate and speed increase as your score climbs
- Collision triggers a particle explosion and removes one life

**HUD & Scoring**
- Live score counter (increments every frame)
- Speed bar showing current velocity as a percentage
- 3-life heart system (♥♥♥)
- Persistent best score tracked across rounds

**Start & Game Over Screens**
- Cinematic overlay on launch with instructions
- Game Over screen displays final score and all-time best
- Restart available at any time via button or overlay

### 🎮 Controls — Turbo Dash

| Action | Control |
|---|---|
| Move Left | ← Arrow Key or ◀ Button |
| Move Right | → Arrow Key or ▶ Button |
| Restart Game | **RESTART** Button |
| Start Game | Click **START** on launch screen |

---

## 🛠️ Technical Stack

- **Frontend:** React.js
- **Styling:** CSS3 (3D Transforms, Keyframe Animations, Conic Gradients, Canvas 2D API)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **Rendering:** HTML5 Canvas (Car Game), Pure CSS Divs (Kurukshetra)
- **Fonts:** Google Fonts (Orbitron, Share Tech Mono, Bebas Neue)

---

## 🚀 Installation & Setup

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/kurukshetra-universe.git
```

**2. Navigate to the project folder:**
```bash
cd kurukshetra-universe
```

**3. Install dependencies:**
```bash
npm install
```

**4. Start the development server:**
```bash
npm start
```

**5. Open in browser:**
```
http://localhost:3000
```

---

## 📂 Project Structure

```
src/
├── App.jsx                   # Root component — renders both experiences
├── components/
│   ├── Kurukshetra.jsx       # Battlefield logic: 4-stage battle progression, keyboard listeners
│   ├── Kurukshetra.css       # 3D scene setup, Sudarshan Chakra styling, snake slither animations
│   ├── CarGame.jsx           # Car game loop, canvas rendering, collision detection, controls
│   ├── CarGame.css           # Neon HUD, button styles, scanline overlay, speed bar
│   └── Navbar.jsx            # Responsive sticky navigation bar
```

---

## 💡 How It Works

### Kurukshetra Logic
1. **Stage 0:** Warrior starts with 3 protective snake rings orbiting them
2. **Stages 1–3:** On each "STRIKE" click, the Chakra's CSS class updates to `strike-animation`, flying to the warrior's coordinates. React state removes one ring per hit
3. **Stage 4:** The final attack adds `.is-beheaded` to the warrior, triggering a 3D CSS translation that separates the head from the body

### Turbo Dash Logic
1. **Game Loop:** Runs via `requestAnimationFrame` inside a `useEffect`, drawing every frame to an HTML5 Canvas
2. **Lane System:** The road is divided into 3 fixed lanes. The player snaps between them with smooth `lerp` interpolation
3. **Difficulty Scaling:** Enemy spawn interval shrinks and base speed increases every 300 score points
4. **Collision Detection:** AABB (axis-aligned bounding box) check between player and each enemy, with a forgiveness margin for fairness
5. **Invincibility Frames:** After a hit, the player blinks for 90 frames (~1.5s), preventing chain collisions

---

## 🎨 Design Philosophy

| Experience | Aesthetic | Palette |
|---|---|---|
| Kurukshetra | Cinematic / Mythological | Blood red, gold, dark earth |
| Turbo Dash | Neon Retro-Arcade | Cyan, hot pink, electric yellow |

Both experiences are self-contained with isolated CSS files — no style bleed between components.

---

## 🔮 Future Improvements

- [ ] Add sound effects and background music to both experiences
- [ ] Mobile touch swipe support for Kurukshetra warrior movement
- [ ] Leaderboard with localStorage persistence for Turbo Dash
- [ ] Add a home/landing screen to switch between experiences
- [ ] Power-ups (shield, slow-motion) in the car game
- [ ] Additional stages and enemies in Kurukshetra

---

## 📜 License

MIT License — free to use, modify, and distribute.
