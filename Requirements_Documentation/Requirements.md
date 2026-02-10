# Project: Portfolio Site

## Overview
Building an interactive portfolio with a "falling down the rabbit hole" theme. Dark gothic/whimsical mood (Alice-inspired but not literal). This is a PROTOTYPE phase - focus on feel and interaction, not final assets.

## Claude Code Skills
Use the local iterative-build, and my-style skills for this application.
Use the frontend-design skill from Anthropic's public repository located here: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md

## Technical Requirements

### Tech Stack
- React + TypeScript (Vite)
- Tailwind CSS
- Framer Motion (for animations)
- React Icons (for nav buttons)

## UI/UX Requirements

### Navigation
Floating action buttons (FABs) in corner:
- Small circular buttons
- Always visible (fixed position)
- One for About, one for Contact
- Subtle glow/hover effects
- Consider bottom-right or top-right placement

### Modal Behavior
Hybrid approach:
- **Transition**: Card grows from its scroll position (Option C)
- **Final state**: Full overlay modal (Option A)
- Dims background
- Close via X button or click outside
- Smooth animation using Framer Motion

### Falling Animation - TOGGLEABLE OPTIONS
**CRITICAL**: Build with a toggle/config to switch between animation modes:

**Mode 1: Straight Up**
- Projects float up from bottom
- Vertical movement only
- Clean, controlled feel

**Mode 2: Diagonal Drift**
- Projects float up AND drift left/right
- Alternating directions (or random slight variance)
- More chaotic "tumbling through space" feel

**Implementation**: 
- Create a config constant or prop that switches between modes
- Button or keyboard shortcut to toggle (for rapid testing)
- Both modes should use same easing/timing structure for fair comparison

### Scroll-Triggered Animation Behavior
- Projects initially below viewport (invisible)
- Trigger when 20-30% enters viewport
- Staggered timing (each appears ~200ms after previous)
- Animation properties:
  - Opacity: 0 → 1
  - Transform: translateY + scale + rotate (subtle)
  - Duration: ~800ms
  - Easing: ease-out or custom cubic-bezier

### Visual Mood (No Images Yet)
- Dark background (deep purples, dark blues, near-black)
- CSS gradients for depth
- Subtle particle effects or floating dots (optional)
- Gothic typography (serif headers, clean sans-serif body)
- Accent colors: deep reds, golds, or teals

## Content Structure

### Hero Section
- Name/title
- Tagline
- Subtle gradient background
- Minimal text (let projects be the focus)

### Projects Section
- 3-4 project cards
- Each card shows:
  - Project name
  - Tech stack (small badges/chips)
  - Thumbnail or gradient placeholder
  - Subtle hover effect
- Cards positioned for scroll animation

### Project Modal Content
When card clicked:
- Project name (header)
- Description (2-3 sentences)
- Tech stack (badges)
- Demo section (iframe or image placeholder for now)
- Links:
  - View Repository (GitHub icon)
  - Live Demo (if applicable)
- Close button (X in corner)

### About/Contact Sections
Trigger from FABs:
- Slide-in panel or inline section reveal
- About: Short bio, skills, photo placeholder
- Contact: Email, GitHub, LinkedIn links (icons)

## Development Phases

### Phase 0: Project Setup
- Create Vite + React + TypeScript project
- Install dependencies: Tailwind, Framer Motion, React Icons
- Configure Tailwind with dark theme colors
- Basic file structure

### Phase 1: Layout & Structure
- Hero section (static)
- Projects section container
- Project cards (static, no animation yet)
- FAB navigation buttons
- Modal component (structure only)

### Phase 2: Animation System - PRIORITY
- Implement scroll detection (Intersection Observer)
- Build BOTH animation modes (straight up + diagonal drift)
- Add toggle mechanism to switch modes
- Staggered timing system
- Test and refine feel

### Phase 3: Interactivity
- Card click → modal transition (grow from card position)
- Modal state management
- Close modal (button + click outside)
- FAB click handlers (About/Contact reveal)

### Phase 4: Polish
- Hover states
- Focus management (accessibility)
- Keyboard navigation (Esc to close modal)
- Responsive breakpoints
- Dark mood styling refinement

## Key Requirements

### Animation Toggle System
**Must have easy way to test animation modes:**
- Option 1: Add dev panel with buttons to switch modes
- Option 2: Keyboard shortcut (e.g., press 'A' to cycle)
- Option 3: URL parameter (?animation=diagonal)

**Preference**: Whatever allows fastest iteration during development.

### Accessibility
- Keyboard navigation for all interactions
- Focus trapping in modal
- ARIA labels for FABs
- Semantic HTML
- Skip links if needed

### Responsive Design
- Mobile: Stack projects, adjust FAB positions
- Tablet: 2-column grid
- Desktop: Full effect, optimal spacing


## Placeholder Data
Use this structure for project cards:
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl: string;
  // thumbnail: string; // Add later with real images
}
```

Create 3-4 mock projects with realistic data.

## Success Criteria for Prototype
- Scroll animation feels smooth and intentional
- Can easily toggle between animation modes
- Modal transition (card → overlay) is smooth
- FABs are accessible and functional
- Dark mood is established with CSS
- Runs smoothly on local dev server

## Notes
- This is PROTOTYPE phase - prioritize feel over pixel perfection
- Use placeholder content liberally
- Focus on getting animations right
- Real images/content come later after we nail the UX
