# Priority Board

A minimal, Material Design 3-inspired priority board for task management. Organize your work into "Now", "Next", and "Later" columns with a clean interface optimized for long-term use and low cognitive strain.

## Features

- **Three-column board**: Now, Next, Later for clear prioritization
- **Task management**: Add, edit, move, and delete tasks with descriptions and timeframes
- **Drag-and-drop**: Intuitive task reordering within and across columns
- **Persistent storage**: Tasks saved to localStorage, survives page refreshes
- **Theme support**: Light and dark themes with smooth transitions
- **Responsive design**: Works seamlessly on desktop and mobile devices
- **Accessible**: WCAG 2.2 compliant with keyboard navigation and screen reader support

## Tech Stack

### Core
- **React 19**: Latest React with automatic memoization via React Compiler
- **TypeScript 5.9**: Strict type safety with modern TS features
- **Vite 7.3**: Fast build tool with HMR for rapid development

### Styling
- **Tailwind CSS 4.1**: CSS-first configuration with modern utilities
- **CSS Variables**: Semantic theming system for light/dark modes
- **Lucide React**: Consistent, minimal icon set

### UI Components
- **Radix UI**: Accessible component primitives (@radix-ui/react-slot)
- **CVA**: Class Variance Authority for component variants
- **Tailwind Merge**: Intelligent class merging utility

## Project Structure

```
priority-board/
├── src/
│   ├── app.tsx                    # Root app component
│   ├── main.tsx                   # Application entry point
│   ├── types/
│   │   └── task.ts                # Task type definitions
│   ├── hooks/
│   │   └── use-local-storage.ts   # Persistent state hook
│   ├── components/
│   │   ├── board.tsx              # Main board container
│   │   ├── column.tsx             # Column component (Now/Next/Later)
│   │   ├── task-card.tsx          # Individual task card
│   │   ├── add-task-form.tsx      # Task creation form
│   │   ├── theme-toggle.tsx       # Light/dark theme switcher
│   │   ├── providers/
│   │   │   └── theme.tsx          # Theme context provider
│   │   └── ui/
│   │       ├── button.tsx         # Reusable button component
│   │       └── card.tsx           # Reusable card component
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn helper)
│   └── styles/
│       └── global.css             # Global styles and CSS variables
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── components.json                 # shadcn/ui configuration
└── postcss.config.js               # PostCSS configuration
```

## Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd priority-board

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Type check
npm run typecheck

# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management
- **Local state**: React's `useState` for component-specific data
- **Persistent state**: Custom `useLocalStorage` hook syncs state with localStorage
- **No global state library**: Prop drilling minimized through component composition

### Data Model
```typescript
interface Task {
  id: string;           // Unique identifier (crypto.randomUUID())
  title: string;        // Task title
  description: string;  // Task details
  timeframe: string;    // Estimated completion time
  columnId: string;     // 'now' | 'next' | 'later'
}
```

### Component Hierarchy
```
App
└── ThemeProvider
    └── Board
        ├── ThemeToggle
        ├── Column (Now)
        │   ├── AddTaskForm
        │   └── TaskCard[]
        ├── Column (Next)
        │   ├── AddTaskForm
        │   └── TaskCard[]
        └── Column (Later)
            ├── AddTaskForm
            └── TaskCard[]
```

### Theming System
Themes use CSS custom properties defined in `src/styles/global.css`:
- `--color-bg`: Background color
- `--color-surface`: Card/surface background
- `--color-text`: Primary text color
- `--color-text-secondary`: Secondary text color
- `--color-border`: Border color
- Theme toggle switches between `.light` and `.dark` classes on `:root`

## Development Guidelines

### Code Style
- **TypeScript strict mode**: No implicit any, strict null checks
- **Functional components**: Use hooks for all logic
- **Early returns**: Guard clauses before happy path
- **Small functions**: Keep functions under 30 lines
- **Semantic naming**: `getUserById`, not `getData`

### Component Patterns
- **Props interface**: Always define explicit prop types
- **Composition over inheritance**: Use children and render props
- **Single responsibility**: Each component does one thing well
- **Controlled inputs**: Forms manage state explicitly

### CSS Guidelines
- **Tailwind utilities first**: Prefer utility classes over custom CSS
- **Responsive design**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Accessibility**: Focus states, sufficient contrast (4.5:1), semantic HTML
- **State variants**: Style hover, focus, active, disabled states

### TypeScript Patterns
```typescript
// Use satisfies for type-safe object literals
const config = { ... } satisfies Config;

// Use discriminated unions for state machines
type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: Task[] }
  | { type: 'error'; error: string };

// Use branded types for type-safe IDs
type TaskId = string & { readonly __brand: 'TaskId' };
```

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following the development guidelines
4. Run type checking: `npm run typecheck`
5. Build to verify: `npm run build`
6. Commit with clear messages: `git commit -m "feat: add task filtering"`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a Pull Request

### Commit Convention
Use conventional commits for clear history:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Changes are tested in both light and dark themes
- [ ] Responsive design works on mobile and desktop
- [ ] Accessibility: keyboard navigation and screen reader support
- [ ] No console errors or warnings
- [ ] Commit messages follow conventional commits

### Areas for Contribution
- **Task filtering**: Filter by timeframe or search
- **Task editing**: Inline editing for existing tasks
- **Drag-and-drop**: Native HTML5 drag-and-drop for reordering
- **Keyboard shortcuts**: Quick actions (e.g., `n` for new task)
- **Export/Import**: JSON export/import for backup
- **Task metadata**: Priority levels, tags, due dates
- **Animations**: Smooth transitions for task movements
- **Undo/Redo**: History management for task operations
- **Multi-board support**: Multiple boards with switching
- **Collaboration**: Real-time sync (requires backend)

## Browser Support

- **Chrome/Edge**: 120+
- **Firefox**: 120+
- **Safari**: 17+

Modern browsers with support for:
- CSS Container Queries
- CSS Nesting
- `:has()` selector
- View Transitions API (progressive enhancement)

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Design inspired by Material Design 3 guidelines
- Icons from [Lucide](https://lucide.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)
