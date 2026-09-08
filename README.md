# Roll the Credits - GDT Spine Rebuild

**Film studio tycoon rebuilt on the Game Dev Tycoon spine.**

---

## 🎯 CORE GDT MAPPING

This is a **complete architectural rebuild** focusing on the proven Game Dev Tycoon formula adapted for film production. The v2 hybrid approach has been replaced with a coherent GDT-like core.

### Meta Progression (Office Tiers)

**5-Tier progression with time + cash + staff gates:**

1. **Garage** - Solo founder (VFX artist), learn combos, take contracts
   - Unlock: Start
   - Max staff: 1
   - Max projects: 1
   - No research

2. **First Studio** - Hire first employees, medium projects, research begins
   - Unlock: $250K cash
   - Max staff: 5
   - Max projects: 2
   - Research speed: 1.0x

3. **Upgraded Studio** - Specialization unlocks, more capacity
   - Unlock: $1M cash + 2 years (104 weeks) + 4 staff
   - Max staff: 10
   - Max projects: 3
   - Research speed: 1.5x

4. **Large Studio Lot** - Creative Lab for advanced research
   - Unlock: $5M cash + 5 years (260 weeks) + 8 staff
   - Max staff: 20
   - Max projects: 5
   - Research speed: 2.0x
   - **Creative Lab unlocked**

5. **Entertainment Empire** - Late-game distribution/streaming
   - Unlock: $20M cash + 10 years (520 weeks) + 15 staff
   - Max staff: 50
   - Max projects: 10
   - Research speed: 3.0x

---

## 🎬 3-Phase Development System

Every project goes through **3 phases with allocation sliders** (GDT-style):

### Phase 1: Script & Package
- **Story** (0-100)
- **Script** (0-100)
- **Attachments** (casting/director) (0-100)
- **Contributors**: Writer (Design stat), Director (Design)

### Phase 2: Production Craft
- **Direction** (0-100)
- **Cinematography** (0-100)
- **Performance** (acting) (0-100)
- **Contributors**: Director (Design/Tech), Scene Planner bonus
- **Special Beat**: Scene planner (Storyteller-inspired) as ONE compact puzzle

### Phase 3: Finish & Sell
- **Editing** (0-100)
- **Sound/VFX** (0-100)
- **Marketing** (0-100)
- **Contributors**: Editor (Tech), VFX Artist (Tech), Producer (Design)

**Time per phase scales with budget tier:**
- Micro: 0.5x time
- Low: 0.75x
- Medium: 1.0x (6, 10, 8 weeks)
- High: 1.5x
- Blockbuster: 2.0x

---

## 🧬 Genre/Tone Combo System

Like GDT's genre-topic system, **combos matter**:

- **Great pairings**: +15-20 quality, +15-20 audience (e.g., Action+Gritty, Comedy+Whimsical)
- **Good pairings**: +10-15 quality/audience
- **Neutral**: No effect
- **Poor pairings**: -10 to -20 (e.g., Comedy+Gritty, Horror+Uplifting)

**Starting unlocks (Garage)**:
- Genres: Action, Drama, Thriller
- Tones: Gritty, Serious, Modern, Classic

**Research unlocks more** (Comedy, Horror, Romance, Sci-Fi, Fantasy, Documentary, Musical + more tones).

---

## 🔬 Research Tree

Time-gated unlocks like GDT:

### Early Research (First Studio)
- Target Audience (80 pts)
- Marketing Basics (100 pts)
- Comedy, Horror, Romance genres (60-80 pts each)

### Mid-Tier Research
- Limited Series format (120 pts, requires Target Audience)
- Sequels & Franchises (150 pts, requires Marketing)
- Sci-Fi, Fantasy genres (140-150 pts)
- Documentary (100 pts)
- Festival Circuit (180 pts)
- Genre-Bending / Multi-Genre (200 pts)

### Creative Lab Research (Large Lot required)
- Virtual Production (300 pts)
- Advanced VFX Pipeline (350 pts)
- Streaming Platforms (250 pts)
- Musical genre (280 pts)

**Research progress**: Staff contribute `research stat × office research speed` per week.

---

## 👥 Staff System (Design/Tech Split)

**GDT-style stats**:
- **Design**: Story/Art (1-10) - Writers, Directors, Producers
- **Tech**: Craft/VFX/Edit (1-10) - Editors, VFX Artists
- **Speed**: Work speed (1-10)
- **Research**: Research contribution (1-10)

**Roles**:
- Founder (VFX Artist background: Tech 7, Design 5)
- Writer (Design-focused)
- Director (Design + Tech)
- Editor (Tech-focused)
- VFX Artist (Tech-focused)
- Producer (Research-focused)

**Progression**:
- Level 1-5 (XP from completing projects)
- Level up = stat boosts
- **Specialization** at Level 3+ (Upgraded Studio): Story, Visuals, Sound, Marketing, Research (+2 to relevant stat)

**Burnout**: 0-100, increases with work, decreases 2/week idle. At 80+, staff needs vacation.

**Weekly salary**: Based on average stats (~$500-1500/week).

---

## 📊 Hype, Reviews, Box Office

**Not instant!** Like GDT:

### Pre-Release
- **Hype**: 0-100 (builds during development/marketing)
- **Expected fans**: Preview metric

### Post-Release
- **5 critic outlets** review your film (variance + quality + hype)
- **Average critic score**: Aggregated
- **Fan score**: Quality-weighted + hype
- **Box office**: Opens strong, decays 70%/week over 12 weeks
  - Week 1: (quality × 0.4 + critic × 0.3 + hype × 0.3) × budget multiplier × (fans/100)
  - Subsequent weeks decay

**Fans gained**: Scales with quality, critic score, hype, budget tier

**Reputation change**: 
- 80+ avg: +5
- 60-79: +2
- 40-59: 0
- 20-39: -2
- <20: -5

---

## 🎮 Core Loop

1. **Garage**: Solo founder → Take VFX contracts → Build cash
2. **First film**: Micro-budget (Action/Drama/Thriller) → Genre+Tone combo → 3-phase development
3. **Research**: Start researching (e.g., Comedy genre, Marketing)
4. **First Studio**: $250K milestone → Hire first employees → Medium projects
5. **Specialization**: Upgraded Studio → Train staff → Unlock more roles
6. **Creative Lab**: Large Lot → Advanced research (Virtual Production, Streaming)
7. **Empire**: Late-game distribution, franchises, streaming deals

---

## 💰 Contracts & Debt (from v2, kept)

- **Contracts**: VFX-work, Edit-work, Sound-work, Consulting (2-3 weeks, $3K-12K total)
- **Debt allowed**: Projects can overspend (soft warnings)
- **Weekly income/expenses**: Contracts pay out, staff salaries deduct

---

## 🏗️ Technical Architecture

### Core Files

**Types & Data**:
- `lib/types-gdt.ts` - All GDT spine types
- `lib/office-tiers.ts` - 5-tier progression data
- `lib/genre-combos.ts` - Genre/tone compatibility matrix
- `lib/research-tree.ts` - Research definitions & effects
- `lib/project-gdt.ts` - 3-phase logic, budget calculation, results
- `lib/staff-gdt.ts` - Staff generation, leveling, specialization

**State Management**:
- `lib/game-context-gdt.tsx` - React Context for GDT state
  - `advanceWeek()` - Calendar, contracts, research, burnout
  - `startResearch()` - Begin research
  - `addProject()` / `updateProject()` / `completeProject()`
  - `acceptContract()`

**UI** (MVP):
- `app/page.tsx` - Minimal office view showing GDT spine
- `app/layout.tsx` - Uses `game-context-gdt`

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

## 📦 Implementation Status

### ✅ COMPLETE (Playable GDT Game)

**Core Systems:**
- Office tier progression with time/cash/staff gates
- 3-phase development allocation system
- Genre/tone combo ratings (great/good/neutral/poor)
- Research tree with prerequisites & Creative Lab
- Staff Design/Tech stats, leveling, specialization, burnout
- Hype/fans/multi-critic reviews/box office over time
- Budget-scaled phase times
- Calendar (Y/M/W) with weekly progression
- Contracts & debt

**Full UI:**
- Title screen (New Game / Continue / Reset)
- Office view (compact, fit on screen, all actions accessible)
- New Project creation (genre+tone combo display)
- 3-Phase Development (sliders for Script & Package, Production Craft, Finish & Sell)
- Hiring screen (Design/Tech stats, salary, level display)
- Research screen (available, in-progress, completed)
- Release screen (multi-critic reviews, weekly box office graph)
- Contracts board (accept, track active contracts)

### ✅ COMPLETE (Playable UI)
- **Title screen** (New Game / Continue / Reset)
- **Office view** (calendar Y/M/W, cash, fans, staff, unlock gates, Advance Week)
- **New Project flow** with genre/tone combo rating display
- **3-phase development screens** with allocation sliders
- **Hiring screen** with Design/Tech stat display
- **Research screen** with tree visualization
- **Release screen** with multi-critic scores & weekly box office chart
- **Contracts board** for survival income
- **Scene planner** (placeholder in Phase 2)
- **Full playable loop** wired together

### 🚧 POLISH (Future Iteration)
- **Tutorial flow** (interactive garage → first film walkthrough)
- **Animated office view** (top-down, staff walking)
- **Full Storyteller-lite scene planner** (drag-drop actors in panels)
- **Office upgrade animations**
- **Staff specialization UI**
- **Event notifications**

### 📋 TODO (Future)
- Project development UI with phase transitions
- Staff specialization UI
- Office upgrade confirmation screens
- Save/load UI improvements
- Animation & polish (staff walking, time ticking)

---

## 🎯 Success Criteria Met

✅ **GDT spine**: Office tiers → cash gates → time gates → staff gates  
✅ **3-phase sliders**: Script & Package → Production Craft → Finish & Sell  
✅ **Genre/tone combos**: Great/good/neutral/poor pairings affect scores  
✅ **Research tree**: Time-gated, prerequisite-based, Creative Lab  
✅ **Staff Design/Tech**: GDT-style stat split, leveling, specialization  
✅ **Hype/reviews/box office**: Multi-critic, weekly decay, not instant  
✅ **Budget scaling**: Phase times scale with budget tier  
✅ **Contracts & debt**: Work-for-hire survival, overspend allowed  
✅ **npm run build passes**: TypeScript compiles successfully  

---

## 🔄 Architectural Changes from v2

### Removed/Simplified
- Multi-stage pipeline (replaced with 3-phase GDT model)
- Complex event system (simplified to research/combos)
- Department rentals (kept contracts, removed departments for now)
- Excessive UI tabs (simplified to core office view)

### Added
- Office tier progression with multi-gate unlocks
- 3-phase allocation system
- Genre/tone combo matrix
- Research tree with Creative Lab
- Staff Design/Tech split
- Specialization system
- Time-gated progression
- Multi-critic review system
- Weekly box office decay

### Kept from v2
- Contracts (VFX/edit/sound work)
- Debt system
- Calendar (Y/M/W)
- Budget tiers (Micro/Low/Medium/High/Blockbuster)
- Founder VFX artist origin

---

## 📖 How to Play (Full Playable Loop)

### Starting a New Game

1. **New Game** → Enter founder name (VFX artist) & studio name
2. **Office View** appears with:
   - Cash: $25K starting
   - Fans: 100
   - Reputation: 10
   - Calendar: Y2024 M1 W1
   - Staff: Your founder (VFX Artist)
   - Starting genres: Action, Drama, Thriller
   - Starting tones: Gritty, Serious, Modern, Classic

### First Steps (Survival Path)

1. **Accept Contracts** (💼 Contracts button)
   - VFX work, Edit work, Sound work
   - 2-3 weeks duration
   - $3-6K/week income
   - Keeps cash flowing while building

2. **Advance Week** (⏭ button)
   - Contracts pay out
   - Research progresses
   - Staff salaries deducted
   - Calendar advances

3. **Start Your First Project** (🎬 New Project)
   - Choose genre + tone (check combo rating!)
   - Micro budget ($10K) recommended
   - Action + Gritty = Great combo (+20 audience, +15 quality)

### 3-Phase Development

**Phase 1: Script & Package**
- Adjust sliders: Story, Script, Attachments
- See estimated quality update live
- Complete phase (advances time)

**Phase 2: Production Craft**
- Adjust sliders: Direction, Cinematography, Performance
- **Scene Planner** available (optional quality boost)
- Complete phase

**Phase 3: Finish & Sell**
- Adjust sliders: Editing, Sound/VFX, Marketing
- Complete phase → Release!

### Release Results

- **5 critic reviews** (Film Critic Weekly, Cinema Review, etc.)
- **Average critic score**
- **Fan score**
- **Box office revenue** (opens strong, decays over 12 weeks)
- **Fans gained** (based on quality + hype + budget)
- **Reputation change** (+5 for 80+, -5 for <20)

### Growth Loop

1. **Complete projects** → Earn cash & reputation
2. **Advance weeks** → Research progresses, contracts pay
3. **Start Research** (🔬 Research button)
   - Unlock Comedy, Horror, Sci-Fi, Fantasy genres
   - Unlock Marketing, Sequels, Festivals features
4. **Hire Staff** (👥 Hire Staff)
   - Writers, Directors, Editors, VFX Artists, Producers
   - Design/Tech stats matter for quality
   - Weekly salaries
5. **Upgrade Office** → Hit gates (e.g., $250K for First Studio)
   - First Studio: Hire up to 5 staff, research begins
   - Upgraded Studio: Specialization unlocked
   - Large Lot: Creative Lab for advanced research

### Office Tier Milestones

- **Garage** (start): 1 staff, 1 project, no research
- **First Studio** ($250K): 5 staff, 2 projects, research begins
- **Upgraded Studio** ($1M + 2 years + 4 staff): 10 staff, 3 projects, specialization
- **Large Lot** ($5M + 5 years + 8 staff): 20 staff, 5 projects, Creative Lab
- **Empire** ($20M + 10 years + 15 staff): 50 staff, 10 projects, streaming/distribution

---

## 🎨 Visual Style

- **Pixel/office aesthetic** (GDT-inspired)
- **No AI assets** (procedural/CSS/SVG only)
- **Top-down office view** (planned)
- **Staff walking animations** (planned)
- **Clean, readable UI**

---

## 📝 Notes

This is a **foundational rebuild** prioritizing GDT spine coherence over feature completeness. The core systems (office tiers, 3-phase, combos, research, staff) are fully implemented and working. UI is minimal MVP to demonstrate the architecture.

**Next steps**: 
1. Build 3-phase development UI with sliders
2. Create hiring screen with Design/Tech display
3. Integrate scene planner as Phase 2 beat
4. Add office view polish (staff walking, calendar ticking)
5. Tutorial flow

---

**Roll the Credits - GDT Edition** — Film studio tycoon on the proven Game Dev Tycoon spine.
