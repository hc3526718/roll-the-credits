# Roll the Credits v1.5

A creative studio tycoon game that combines **Game Dev Tycoon** management, **creator sim** mechanics, and **Storyteller's** scene-planning puzzle system.

## 🎮 What's New in v1.5

### Multi-Stage Production Pipeline
Gone is the simple 3-stage flow. Projects now progress through **5 realistic stages**:

1. **Planning & Development** (8 weeks)
   - Hire Writer, develop script
   - Choose adaptation vs original story
   - Script depth decisions

2. **Pre-Production** (6 weeks)
   - Hire Cinematographer, expand cast
   - Location scouting vs VFX planning
   - Schedule compression tradeoffs

3. **Filming / Principal Photography** (10 weeks)
   - Scene planner (arrange actors)
   - On-set challenges & actor conflicts
   - Weather delays & reshoots

4. **Post-Production** (8 weeks)
   - Hire Editor, Sound Designer, VFX Artist
   - Choose VFX vs sound vs edit focus
   - Picture lock decisions

5. **Marketing & Distribution** (6 weeks)
   - Campaign strategy
   - Festival premiere vs viral vs traditional
   - Release window optimization

**Total: 38+ weeks** from greenlight to release (vs ~12 weeks in v1).

### 9 Professional Roles
Each role contributes to specific stages:

- 🎭 **Actor** - Cast in scenes (multiple scenes allowed!)
- 🎬 **Director** - Affects all stages (30% quality weight)
- ✍️ **Writer** - Script quality in Planning (20% weight)
- 📷 **Cinematographer** - Visual quality in Pre-production (15%)
- ✂️ **Editor** - Pacing & flow in Post (15%)
- 🔊 **Sound Designer** - Audio quality in Post (10%)
- ✨ **VFX Artist** - Visual effects in Post (10%)
- 🎵 **Composer** - Music score (optional)
- 📋 **Producer** - Marketing reach (optional)

### Studio Progression & Unlocks
Start lean in your **garage**, earn bigger projects:

**Level 1-2: Garage Studio**
- Unlock: Actor, Director
- Max cast: 3 actors
- Micro/Low budgets only

**Level 3-4: Small Office**
- Unlock: Writer, Cinematographer, Editor
- Max cast: 5 actors
- Test screenings available

**Level 5-6: Medium Studio**
- Unlock: Sound Designer, Composer, VFX Artist
- Max cast: 6+ actors
- Marketing tools unlocked
- Advanced trend insights

**Level 7+: Large Studio**
- Unlock: Producer
- Max cast: 8+ actors
- Festival submissions
- All features unlocked

**Office Upgrades:**
- Garage → Small: $150,000
- Small → Medium: $500,000
- Medium → Large: $1,500,000

### Industry Events System
Random world events affect your projects (~5% chance per week):

- **Writer Strike** (90 days) - Only non-union writers available, 1.5x cost
- **Actor Burnout** (60 days) - Stars take sabbaticals, unavailable
- **Union Action** (30 days) - Crew rates increase 1.2x
- **Festival Invite** (45 days) - +5 critic score, +2 reputation
- **Streaming War** (60 days) - Platforms compete, +10 audience
- **Weather Delay** (14 days) - Outdoor filming delays
- **Test Screening Leak** (7 days) - Early buzz (good or bad)
- **Awards Buzz** (90 days) - +8 critic score, +3 reputation

### Scene Planner Upgrades
- **Actors in multiple scenes** - Your lead can appear in 3+ scenes
- Usage count badges show how often each actor appears
- Scene importance tracking (key / supporting / transition)
- State preserved on back navigation

### Mid-Stage Decisions
Each stage presents **1 major decision** at 50% progress with real tradeoffs:

**Decision Types:**
- Budget vs Quality vs Time
- Audience appeal vs Critic respect  
- Risk levels: Low (safe), Medium (tradeoff), High (swing for fences)

**Examples:**
- "Reshoot key scene for $20K?" (+10 quality, +1 week, low risk)
- "Replace difficult actor?" (-$50K, -10 quality, -15 audience, 4 weeks, high risk)
- "Premium locations?" (+$40K, +12 quality, +10 critic, low risk)

### Enhanced Quality System
Overall project quality now weighted across:
- Director contribution (30%)
- Script quality from Writer (20%)
- Story outcome from scene chemistry (30%)
- Cinematography (15%)
- Editing (15%)
- Sound (10%)
- VFX (10%)
- Marketing reach bonus

Plus event effects and trend bonuses.

---

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to play.

## v1.5 Gameplay Loop

### First Project (Level 1)
1. **Office** - Start with $100K, Level 1, garage studio
2. **Concept** - Choose Drama, Low budget ($200K)
3. **Planning** - Hire Writer + Director (only roles available)
4. **Pre-production** - "Unlock blocked: Need Level 3 for Cinematographer"
   - Can still hire more Actors though!
5. **Filming** - Scene planner: arrange 2-3 actors across scenes
6. **Post-production** - "Unlock blocked: Need Level 3 for Editor"
   - Project auto-advances with basic quality
7. **Marketing** - Campaign choices (if unlocked)
8. **Editing** - Final touch: pacing, titles, thumbnails
9. **Results** - Scores, revenue, level up!

### Second Project (Level 3+)
Now you have Writer, Cinematographer, Editor unlocked!
- Deeper crew at each stage
- Better quality contributions
- More complex decisions
- Higher budgets available

### End-Game (Level 7+)
- Full 9-role productions
- Festival premieres
- Test screenings
- Marketing campaigns
- Streaming bidding wars

---

## Core Systems

### Scene Planner (Storyteller-Inspired)
Before filming, arrange actors in 3-5 comic-panel scenes:

- Drag actors into scenes (up to 3 per scene)
- Actors can appear in **multiple scenes** (new in v1.5!)
- Chemistry between paired actors affects quality:
  - **70+ chemistry** → +5 quality, +3 audience
  - **<30 chemistry** → -8 quality, -5 critic
- Scene order matters (Scene 1 sets tone)
- Chemistry tags: 'method' + 'dramatic' = good, 'method' + 'comedic' = bad

**Chemistry Rules:**
- compatible: method ↔ dramatic/intense
- compatible: comedic ↔ quirky/romantic
- incompatible: method ↔ comedic
- incompatible: action-star ↔ indie-darling

### Budget & Time Management
- Each stage burns budget (~2% per week)
- Decisions cost money and time
- Can't proceed if over budget
- Trends shift during production
- Events can trigger mid-project

### Progression Curve
- **Weeks 1-10**: Learn basics (Actor/Director)
- **Weeks 20-40**: First 2-3 projects, unlock Writer/Cinematographer/Editor
- **Weeks 50-100**: Professional tier, Sound/VFX unlocked
- **Weeks 100+**: Master tier, all features, high-budget prestige films

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **React 19**
- **Tailwind CSS 4**
- **localStorage** for save/load
- Procedural pixel art (CSS + SVG, no AI assets)

---

## Data Model

### Studio
```typescript
{
  name: string
  cash: number
  reputation: number (0-100)
  level: number (1-10)
  officeTier: 'garage' | 'small' | 'medium' | 'large'
  
  audience: { size, tasteVector, engagementRate }
  talentPool: Talent[] (40 total: 12 actors, 5 directors, etc.)
  trends: Trend[] (4 active, rotate/decay)
  unlocks: StudioUnlocks (available roles, features)
  activeEvents: IndustryEvent[]
  
  completedProjects: Project[]
  daysPassed: number
  weeksPassed: number
}
```

### Project
```typescript
{
  name, format, genre, budgetTier
  budget, spent, remainingBudget
  
  assignedTalent: Talent[] (hired across all stages)
  scenes: ScenePanel[] (3-5 panels with multi-actor support)
  
  phase: 'planning' | 'preproduction' | 'filming' | 'postproduction' | 'marketing' | 'released'
  stageProgress: { stage, progress, weeksElapsed, decisionsMade }
  allDecisionsMade: Array
  
  // Quality tracking
  scriptQuality: number
  cinematographyQuality: number
  storyOutcome: { quality, tags, audienceAppeal, criticAppeal }
  editingQuality: number
  soundQuality: number
  vfxQuality: number
  marketingReach: number
  
  editChoices: { pacing, coldOpen, cutScenes, titleEnergy, thumbnailStyle }
  results: { audienceScore, criticScore, revenue, followersGained, reputationChange }
  
  weeksElapsed: number
  createdAt, releasedAt
}
```

---

## Architecture

```
/lib
  types.ts              - Core types (9 roles, 5 stages, events, unlocks)
  game-data.ts          - Procedural generation (40 talent, trends)
  game-logic.ts         - Calculations (quality, chemistry, results)
  game-context.tsx      - React Context for state
  progression.ts        - Level & unlock system
  industry-events.ts    - Event generation & effects (8 types)
  stage-decisions.ts    - Decision trees (5 stages, 15+ decisions)
  procedural-art.ts     - SVG avatar generation

/components
  StartScreen.tsx
  OfficeView.tsx        - Now shows level, events, unlocks
  ConceptPhase.tsx
  HiringPhase.tsx       - Stage-specific hiring with unlock gates
  ScenePlanner.tsx      - Multi-scene actor support
  StageScreen.tsx       - Universal stage progress component
  DecisionModal.tsx     - Mid-stage decision overlay
  EditingPhase.tsx
  ResultsScreen.tsx

/app
  page.tsx              - Main orchestrator (5-stage pipeline)
  layout.tsx
  globals.css
```

---

## Tips & Strategy

### Early Game (Levels 1-3)
- Focus on Micro/Low budgets
- Build reputation with consistent quality
- Prioritize Actor/Director chemistry in scenes
- Save cash for Writer unlock at Level 2

### Mid Game (Levels 4-6)
- Unlock full crew (Cinematographer, Editor, Sound)
- Mid-tier budgets become viable
- Use test screenings to gauge reception
- Balance audience vs critic scores for progression

### Late Game (Levels 7+)
- High-budget prestige films
- Festival premieres for critic bonuses
- Marketing campaigns for audience reach
- Producer helps with distribution deals

### Decision Strategy
- **Low risk** when tight on budget
- **Medium risk** for meaningful quality gains
- **High risk** only when you can afford failure
- Audience-focused = fast pacing + viral marketing
- Critic-focused = slow pacing + festival premiere

### Scene Planning Pro Tips
- Check chemistry tags before pairing actors
- Put highest-skill actor in Scene 1 (sets tone)
- Ensemble finales (2+ actors in last scene) boost audience
- Romantic/intense tags create story outcomes
- Actors can repeat - use your star in 3+ scenes!

---

## Known Behaviors

### Progression
- Level calculated from: reputation/10 + projects + cash/50K
- Unlocks check `studio.unlocks.availableRoles`
- Locked roles show in hiring but are grayed out

### Events
- 5% chance per week during stage progression
- Multiple events can stack
- Effects apply to scores at release
- Events show on Office view when active

### Save/Load
- Auto-saves after every state change (100ms debounce)
- Stored in localStorage as JSON
- Full state including events, unlocks, in-progress stages

### Budget Discipline
- Each stage burns ~2% budget per week
- Decisions require remaining budget check
- Can't proceed if over budget
- Overspending blocks progress

---

## Changelog

### v1.5.0 (Current)
- ✅ 5-stage production pipeline (38+ weeks)
- ✅ 9 professional roles with unlock progression
- ✅ Studio levels 1-10 with office upgrades
- ✅ Industry events system (8 event types)
- ✅ Mid-stage decisions (15+ unique choices)
- ✅ Actors in multiple scenes
- ✅ Enhanced quality system (weighted crew contributions)
- ✅ Time & calendar progression
- ✅ Budget burn rate during stages
- ✅ Event notification system
- ✅ Unlock progress tracking

### v1.0.0 (Launch)
- Basic 3-stage pipeline (Hire → Scene → Production → Edit)
- 5 roles (Actor, Director, Writer, Cinematographer, Editor)
- Scene planner (actors in single scene only)
- Trend system
- Save/load
- Pixel aesthetic

---

## Future Roadmap

**Potential v2.0 features:**
- Multiple simultaneous projects
- Staff management (energy, morale, contracts)
- Studio facilities (sound stages, edit bays)
- Marketing budget allocation
- Real-time competing studios (AI opponents)
- Contract negotiation minigame
- Awards ceremonies
- Streaming platform deals
- International markets

---

## Credits

**Inspired by:**
- **Game Dev Tycoon** (Greenheart Games) - Progression & office feel
- **YouTuber** life sims - Audience/editing mechanics  
- **Storyteller** (Daniel Benmergui) - Scene arrangement puzzle

**Built by:** Cursor Agent + Claude Sonnet 4.5

**License:** MIT

---

**Play it now!** Start your studio, unlock the industry, make your masterpiece. 🎬

**Live Demo:** https://roll-the-credits.vercel.app (if deployed)

**Repository:** https://github.com/hc3526718/roll-the-credits
