# Roll the Credits

**Film Studio Tycoon • Game Dev Tycoon Replica UI**

---

## 🎮 Status: ✅ GDT REPLICA UI COMPLETE

**Replica-quality Game Dev Tycoon + YouTubers Life presentation:**
- ✅ **2.5D isometric office views** for all 5 tiers (Garage → Empire)
- ✅ **Code-drawn assets** using SVG/canvas/CSS only (no AI/generated images)
- ✅ **GDT-style UI** across all screens with pixel aesthetic
- ✅ **Compact layouts** designed for 1280x800+ (minimal scrolling)
- ✅ **Build verified passing** (`npm run build` ✓)

---

## 🖥️ Replica UI Screens

### Title & Settings
- **Title Screen**: New Game / Continue / Settings
  - VFX artist founder origin story
  - Garage → studio progression tagline
- **Settings Panel**: Sound toggle, wipe save, credits

### Office Hub (Primary View)
- **2.5D Isometric Office**: Clickable desks, staff sprites, tier-specific room art
  - Garage: Small desk, founder sprite, garage door
  - First Studio: Multiple desks, windows, growing team
  - Upgraded Studio: Larger floor, windowed walls
  - Large Studio Lot: Creative Lab door (clickable), many work zones
  - Entertainment Empire: Floor-to-ceiling windows, massive scale
- **Control Panel**: Time advancement, projects, staff, contracts, research
- **Office Upgrade Indicator**: Next tier gates (cash, time, staff count)

### Project Pipeline
- **New Project Screen**: Genre + tone combo ratings (live feedback), format, budget tier
- **Phase Development** (3 phases):
  - GDT-style allocation sliders (Design/Tech feel)
  - Staff assignment cards with stat bars (Design/Tech/Speed/Research)
  - Workload indicator (green/yellow/red based on intensity)
  - Scene Planner hook (Phase 2)
  - Budget and time info
- **Release Report** (GDT game report style):
  - Multi-critic reviews (6 outlets with scores)
  - Overall quality & fan score (large numbers)
  - Weekly box office graph (bar chart with hover)
  - Fans gained, reputation change, total revenue

### Hiring & Team
- **Find Staff Screen**:
  - Design/Tech/Balanced filters (GDT-style)
  - Candidate cards with stat bars
  - Weekly salary, affordability checks
  - Star rating (avg stat visualization)

### Research & Contracts
- **Research Screen**:
  - Active research with progress bar
  - Available research (genre, tone, format, features)
  - Completed research (collapsed view)
  - Locked research preview
  - Creative Lab visual distinction (pink highlights)
- **Contracts Board** (YTL-style hustle income):
  - Active contracts with progress bars
  - Available contracts with payouts
  - Contract types: VFX work, Edit work, Sound work

---

## 🏗️ GDT Spine Architecture

### Meta Progression (Office Tiers)

**5-Tier progression with time + cash + staff gates:**

1. **Garage** - Solo founder (VFX artist), learn combos, take contracts
2. **First Studio** - Hire first employees, medium projects, research begins
3. **Upgraded Studio** - Specialization unlocks, more capacity
4. **Large Studio Lot** - Creative Lab for advanced research
5. **Entertainment Empire** - Late-game distribution/streaming

Each tier:
- Unlocks at specific cash, time (weeks), and staff count milestones
- Increases max staff and max projects
- Boosts research speed
- Changes office 2.5D art

### 3-Phase Development System

Every project goes through **3 phases with allocation sliders**:

**Phase 1: Script & Package**
- Story Development, Script Writing, Talent Attachments

**Phase 2: Production Craft**
- Direction, Cinematography, Performance
- Scene Planner beat (Storyteller-inspired)

**Phase 3: Finish & Sell**
- Editing, Sound/VFX, Marketing

### Genre/Tone Combos

**Great combos** (Drama + Dark, Action + Explosive):
- +20% audience, +15% quality

**Good combos**: +10% audience, +8% quality

**Neutral combos**: No bonus

**Poor combos**: -10% audience, -10% quality

### Research Tree

**Time-gated unlocks** for:
- Genres (Action, Drama, Sci-Fi, Horror, etc.)
- Tones (Dark, Lighthearted, Satirical, etc.)
- Formats (Feature, Limited Series, Short, etc.)
- Features (Sequels, Multi-genre, Festival circuit, Streaming deals)

**Creative Lab** (unlocked at Large Studio Lot) enables advanced research.

### Staff System

**Design/Tech split** (GDT-style):
- **Design**: Story/Art (1-10)
- **Tech**: Craft/VFX/Edit (1-10)
- **Speed**: Work speed (1-10)
- **Research**: Research contribution (1-10)

**Leveling**: Staff gain XP from projects and contracts.

**Specialization**: Unlocked at higher studio tiers.

**Burnout**: High workload → burnout → needs vacation.

### Contracts (Survival Income)

- VFX work, Edit work, Sound work, Consulting
- Weekly payouts over 2-4 weeks
- Accept during downtime between projects

---

## 🛠️ Technical Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **React** (Context API for state)
- **Tailwind CSS** + pixel aesthetic
- **SVG/Canvas** for 2.5D office views
- **LocalStorage** for save/load

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 How to Play

1. **Start**: New Game → Name founder + studio → Begin in Garage
2. **Early Game**: Accept contracts for survival income
3. **First Project**: New Project → Choose genre/tone (watch combo rating) → 3-phase development
4. **Hire**: Hire Staff → Filter by Design/Tech/Balanced → Expand team
5. **Research**: Advance weeks to progress research → Unlock new genres/tones/formats
6. **Progression**: Reach cash/time/staff gates → Upgrade office tier → Unlock Creative Lab
7. **Mid-Late Game**: Larger projects, specialization, distribution/streaming ambitions

**Office is the hub**: Click office to start projects, staff to hire, Creative Lab door to research.

---

## 📂 Project Structure

```
/workspace
├── app/
│   ├── page.tsx              # Main orchestrator (screens, state)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Pixel aesthetic + GDT borders
├── components/gdt/
│   ├── IsometricOffice.tsx      # 2.5D office views (5 tiers)
│   ├── TitleScreen.tsx          # Title + new game
│   ├── SettingsPanel.tsx        # Settings modal
│   ├── OfficeView.tsx           # Office hub
│   ├── NewProjectScreen.tsx     # Project creation
│   ├── PhaseDevScreenReplica.tsx       # 3-phase development
│   ├── HiringScreenReplica.tsx         # Staff hiring
│   ├── ResearchScreenReplica.tsx       # Research tree
│   ├── ReleaseScreenReplica.tsx        # Release report
│   └── ContractsBoardReplica.tsx       # Contracts
├── lib/
│   ├── types-gdt.ts          # All game types
│   ├── game-context-gdt.tsx  # State management
│   ├── office-tiers.ts       # 5-tier progression
│   ├── genre-combos.ts       # Genre/tone ratings
│   ├── research-tree.ts      # Research items
│   ├── project-gdt.ts        # Project calculations
│   └── staff-gdt.ts          # Staff generation + leveling
└── README.md
```

---

## 🎯 Design Goals Achieved

✅ **Replica quality** of GDT/YouTubers Life presentation  
✅ **2.5D code-drawn assets** (SVG/canvas/CSS only)  
✅ **GDT spine logic** (3-phase, combos, research, staff)  
✅ **Compact UI** (fit on screen, minimal scroll)  
✅ **Office as a place** (not a flat dashboard)  
✅ **Pixel aesthetic** with GDT-style borders  
✅ **Build passing** with TypeScript checks  

---

## 🐛 Known Issues / Next Steps

- Scene Planner is a placeholder (Phase 2 hook exists, full puzzle not built yet)
- Sound toggle is placeholder (no audio system)
- Tutorial flow can be refined (VFX founder story is text-only)
- More genres/tones/formats can be added via research tree expansion
- Office tier 5 (Late Game) features are scaffolded but not fully fleshed out

---

## 📜 License

MIT

---

**GitHub**: [hc3526718/roll-the-credits](https://github.com/hc3526718/roll-the-credits)  
**Latest Commit**: GDT Replica UI (2.5D offices, enhanced screens, pixel aesthetic)

---

**Roll the Credits** • From garage VFX artist to entertainment empire • GDT Edition
