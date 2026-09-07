# Roll the Credits

A creative studio tycoon game that combines Game Dev Tycoon's management mechanics, creator sim audience dynamics, and Storyteller's scene-planning puzzle system.

## About

**Roll the Credits** is a browser-based tycoon game where you run a film/TV studio. Build projects from concept to release, hire and manage talent, arrange actors in scenes to create story beats, and balance audience appeal against critic scores.

### Core Mechanics

1. **Studio Management** - Track cash, reputation, followers, and office tier
2. **Trend System** - Rotating genre trends affect audience appeal
3. **Project Pipeline** - Complete end-to-end creation workflow
4. **Scene Planner** - Unique Storyteller-inspired puzzle where character placement matters
5. **Editing Choices** - Balance audience retention vs critical acclaim
6. **Results & Progression** - See scores, revenue, and grow your studio

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to play.

## Gameplay Loop

### 1. Concept Phase
- Choose format (Feature / Limited Series / Short)
- Select genre (Action, Drama, Comedy, Horror, Romance, Thriller, Sci-Fi, Fantasy)
- Pick budget tier (Micro / Low / Mid / High)
- Trending genres get audience bonuses

### 2. Hiring Phase
- Hire from a talent pool (Actors, Directors, Writers, Cinematographers, Editors)
- Each person has: Skill (1-10), Fame (1-10), Salary, Chemistry Tags
- Requirements: 1+ Director, 2+ Actors
- Stay within budget

### 3. Scene Planning ⭐ (Key Differentiator)
- Arrange 2-5 scenes (panels) for your project
- Drag actors into scenes (up to 3 per scene)
- Character chemistry affects quality:
  - **High chemistry (70+)** = quality & audience boost
  - **Low chemistry (<30)** = penalties
- Scene order matters - Scene 1 sets tone
- Chemistry tags determine compatibility (e.g., "method" + "dramatic" = good, "method" + "comedic" = bad)

### 4. Production Phase
- Watch progress bar fill
- Mid-production decision at 50% (reshoot, edit fix, or continue)
- Budget spent automatically

### 5. Editing Phase (YouTuber Layer)
- **Pacing**: Slow (critics), Medium (balanced), Fast (audience)
- **Cold Open**: Start with action for retention boost
- **Cut Scenes**: Trim for audience at cost of critic score
- **Title Treatment**: Subtle (critics), Bold (balanced), Viral (audience)
- **Thumbnail/Poster**: Artistic (critics), Dramatic (balanced), Clickbait (audience)

### 6. Results
- **Audience Score** (0-100) → Followers gained
- **Critic Score** (0-100) → Reputation change
- **Revenue** → Cash earned (based on both scores + budget)
- Story tags show what resonated (romance, chemistry, twist, etc.)

## Data Model

### Studio
```typescript
{
  name: string
  cash: number
  reputation: number (0-100)
  officeTier: 'garage' | 'small' | 'medium' | 'large'
  audience: { size, tasteVector, engagementRate }
  talentPool: Talent[]
  trends: Trend[]
  currentProject?: Project
  completedProjects: Project[]
}
```

### Project
```typescript
{
  name, format, genre, budgetTier, budget
  assignedTalent: Talent[]
  scenes: ScenePanel[]
  storyOutcome: { quality, tags, audienceAppeal, criticAppeal }
  editChoices: { pacing, coldOpen, cutScenes, titleEnergy, thumbnailStyle }
  results: { audienceScore, criticScore, revenue, followersGained, reputationChange }
}
```

### Talent
```typescript
{
  name, role
  stats: { skill: 1-10, fame: 1-10, energy: 0-100 }
  chemistryTags: string[] // e.g. ['veteran', 'comedic', 'romantic']
  salary: number
}
```

## Chemistry System

Characters with compatible chemistry tags create better scenes:

**Compatible Pairs:**
- method ↔ dramatic, intense, indie-darling
- comedic ↔ quirky, romantic
- action-star ↔ blockbuster, intense
- indie-darling ↔ experimental, dramatic
- veteran ↔ classical, dramatic

**Incompatible Pairs:**
- method ↔ comedic, quirky
- action-star ↔ indie-darling
- experimental ↔ classical, veteran

Base chemistry is 50. Compatible tags add +15, incompatible subtract -20.

## Tips

1. **Start Small** - Low or Micro budget projects to build reputation and followers
2. **Watch Trends** - Match genre to trending topics for big audience boosts
3. **Scene 1 Matters** - Put your highest-skill actor in the opening scene
4. **Balance Scores** - High audience + high critic = rare "critical and commercial success"
5. **Chemistry Is Key** - Check tags before pairing actors in scenes
6. **Editing Strategy**:
   - New studio? Prioritize audience (fast pacing, viral titles)
   - High reputation? Go for critics (slow pacing, artistic style)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **React 19**
- **Tailwind CSS 4**
- **localStorage** for save/load
- Procedural pixel art (CSS + SVG)

## Architecture

```
/lib
  types.ts           - Core game types
  game-data.ts       - Procedural generation (talent, trends)
  game-logic.ts      - Calculations (scores, chemistry, results)
  game-context.tsx   - React Context for state management
  procedural-art.ts  - SVG avatar & office generation

/components
  StartScreen.tsx
  OfficeView.tsx
  ConceptPhase.tsx
  HiringPhase.tsx
  ScenePlanner.tsx   ⭐ Key feature - Storyteller-inspired
  ProductionPhase.tsx
  EditingPhase.tsx
  ResultsScreen.tsx

/app
  page.tsx           - Main game orchestrator
  layout.tsx         - Root layout with GameProvider
  globals.css        - Pixel aesthetic styles
```

## Future Extensions (Out of v1)

- More talent (50+ pool)
- More scene settings & rules
- Office upgrades (desks, equipment)
- Multiple content formats (YouTube videos, streaming series)
- Multiplayer competitions
- Real IP licensing
- Marketing campaigns
- Film festival submissions
- Sequel mechanics

## Credits

Built with inspiration from:
- **Game Dev Tycoon** (Greenheart Games) - Office management, progression
- **YouTuber** life sims - Audience/editing mechanics
- **Storyteller** (Daniel Benmergui) - Scene arrangement puzzle

Made with ❤️ for creative tycoon fans.
