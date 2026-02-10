# Portfolio Site

An interactive portfolio with a dark gothic/whimsical "falling down the rabbit hole" theme.

## Tech Stack

- **React 18** + **TypeScript** - UI framework with type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS with custom dark theme
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Icon library for navigation buttons

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Shared components
├── features/            # Feature-based modules
│   ├── hero/           # Hero section
│   ├── projects/       # Projects display and modal
│   ├── about/          # About panel
│   └── contact/        # Contact panel
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── data/               # Mock data (projects, etc.)
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Tailwind theme + global styles
```

## Development Phases

1. **Phase 0: Project Setup** - Vite scaffold, Tailwind config, base structure
2. **Phase 1: Layout & Structure** - Static components, basic layout
3. **Phase 2: Animation System** - Scroll-triggered animations with toggleable modes
4. **Phase 3: Interactivity** - Modal transitions, state management
5. **Phase 4: Polish** - Accessibility, responsive refinement, final styling

## Theme

The site uses a custom dark theme with:

- **Backgrounds**: Void-to-dusk progression (near-black to dark gray-purple)
- **Primary**: Purple atmospheric colors ("rabbit hole" descent)
- **Accents**: Gold (primary), Red, Teal
- **Typography**: Cinzel Decorative (display), Cinzel (headings), Raleway (body)

## License

MIT
