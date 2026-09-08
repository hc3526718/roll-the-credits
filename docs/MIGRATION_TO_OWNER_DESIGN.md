# Migration to Owner Design - Gap Analysis

## Current State vs Owner Design (§40 Prototype Priorities)

### ✅ COMPLETE
1. **Garage 2.5D environment** - IsometricOffice component with 5 tiers
2. **Project selection screen** - NewProjectScreen functional
3. **Critic + audience scores** - Release screen with multi-critic reviews
4. **Revenue calculation** - Box office calculation functional
5. **Research / Production Lab screen** - ResearchScreenReplica with Creative Lab
6. **Basic studio upgrade** - Office tier system (garage → first office → etc.)
7. **Auto time 4-tick week** - Implemented with pause/resume
8. **Projects list** - Shows active + completed
9. **Production incidents** - With free/cheap options, pauses production
10. **Boot reliability** - No infinite Loading, no React #310

### ☐ IN PROGRESS / NEEDS WORK

#### **5 Stages × 3 Linked Sliders (HIGH PRIORITY)**
**Current**: 3 phases with 9-10 sliders total  
**Target**: 5 stages with 3 sliders each (100-pt pool)

**Stages**:
1. Planning: Script/Story, Storyboard/Previz, Budget/Schedule
2. Recruitment: Casting, Crew, Locations
3. Filming: Cinematography, Performance, Production Design
4. Post: Editing, Sound/Score, VFX/Grade
5. Marketing: Trailer/Campaign, Press, Distribution/Release

**Files to Update**:
- `lib/types-gdt.ts` - DevelopmentStage, StageAllocation
- `lib/project-gdt.ts` - Stage time/quality calculations
- `components/gdt/PhaseDevScreenReplica.tsx` - Rewrite for 5 stages
- `app/page.tsx` - Update project creation

**Strategy**: Create parallel 5-stage system, migrate gradually.

#### **Topic × Genre × Format × Scale (HIGH PRIORITY)**
**Current**: Genre × Tone × Format × Budget  
**Target**: Topic × Genre × Format × Scale

**Changes**:
- Add `ProjectTopic` dimension to Project interface
- Add `availableTopics` to NewProjectScreen
- Update combo system to use Topic×Genre (not Genre×Tone)
- Teach combos via post-mortem reports

**Files to Update**:
- `lib/types-gdt.ts` - Add ProjectTopic to Project
- `components/gdt/NewProjectScreen.tsx` - Add topic selector
- `lib/genre-combos.ts` - Update combo logic
- `components/gdt/ReleaseScreenReplica.tsx` - Show combo in post-mortem

#### **Early Formats (HIGH PRIORITY)**
**Current**: Short, Feature, Limited-Series  
**Target**: Social Video, Short Film, Music Video, Commercial, Micro-doc

**Changes**:
- Update `ProjectFormat` type
- Update initial unlocks in game-context
- Update research tree to unlock Feature/Series later

**Files to Update**:
- `lib/types-gdt.ts` - ProjectFormat enum
- `lib/game-context-gdt.tsx` - Initial unlockedFormats
- `lib/research-tree.ts` - Add research for late formats

#### **Staff Attributes Expansion (MEDIUM PRIORITY)**
**Current**: Design, Tech, Speed, Research  
**Target**: Craft, Taste, Speed, Reliability, Network, Rep, Cost, Specialization, Chemistry, Availability, Ambition

**Changes**:
- Add new attributes to StaffMember interface
- Update staff generation logic
- Update role list (Founder, Actor, DP, Camera Op, Editor, Sound, VFX, SFX, Producer, Publicist)
- Display attributes in hiring screen

**Files to Update**:
- `lib/types-gdt.ts` - StaffMember interface
- `lib/staff-gdt.ts` - generateStaffMember with new attributes
- `components/gdt/HiringScreenReplica.tsx` - Show all attributes

**Strategy**: Add new attributes alongside legacy ones, keep compatibility.

#### **Live Production Animation (MEDIUM PRIORITY)**
**Current**: Static office view  
**Target**: Animation showing production progress in miniature studio

**Implementation**:
- Add simple SVG/CSS animations to IsometricOffice
- Show "filming in progress" visual state
- Animate staff moving/working
- Show project props (camera, lights, etc.) during filming stage

**Files to Create/Update**:
- `components/gdt/ProductionAnimation.tsx` - New component
- `components/gdt/IsometricOffice.tsx` - Integrate animations
- `app/page.tsx` - Trigger animations based on active project stage

#### **Post-Mortem Learning Report (MEDIUM PRIORITY)**
**Current**: Release screen with scores  
**Target**: GDT-style learning - explain what went well/wrong, teach combos

**Implementation**:
- Add "What Worked" and "What Didn't" sections
- Reveal combo ratings after first use
- Show which sliders/stages contributed most/least to quality
- Provide actionable feedback ("Your editing was weak, hire better editors")

**Files to Update**:
- `components/gdt/ReleaseScreenReplica.tsx` - Add learning sections
- `lib/project-gdt.ts` - Generate learning insights from stage data

### ☐ LATER / STRETCH GOALS

#### Talent Contracts
- Multi-project deals
- Exclusivity
- Option clauses

#### Festivals
- Submit to festivals
- Win awards
- Boost reputation

#### Franchises
- Sequels
- Spin-offs
- Shared universes

#### Departments
- Buy/upgrade departments
- Rent out for income
- Department-specific unlocks

## Migration Strategy

### Phase 1: Non-Breaking Additions (SAFE)
1. Add new types alongside old ones (aliases)
2. Add Owner Design attributes to staff (keep legacy)
3. Update initial formats and topics
4. Create parallel 5-stage logic file

### Phase 2: Component Migration (CAREFUL)
1. Create new 5-stage PhaseDevScreen
2. Add topic selector to NewProjectScreen
3. Update combo system
4. Enhance post-mortem report

### Phase 3: Deprecation (LAST)
1. Remove 3-phase aliases
2. Remove legacy staff attributes
3. Clean up backup files

## Testing Checklist

Before each commit:
- [ ] `npm run build` passes
- [ ] Cold load reaches Title screen
- [ ] Can start New Game
- [ ] Can create and develop a project
- [ ] No infinite Loading
- [ ] No React #310
- [ ] Auto time ticks properly
- [ ] Save/load works

## Current Status

**Commit**: a256f1b  
**Build**: ✅ Passing  
**Boot**: ✅ Solid  
**Next**: Implement Phase 1 (non-breaking additions)
