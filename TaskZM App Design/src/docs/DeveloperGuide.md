# TaskZM Developer Guide

## Overview

TaskZM is a modern React-based task management application built with TypeScript, Tailwind CSS, and a comprehensive set of UI components. This guide provides technical documentation for developers working on the project.

## Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

### UI Components
- **shadcn/ui**: Modern component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### State Management
- **React Context**: Global state management
- **Custom Hooks**: Reusable state logic
- **Local Storage**: Persistent data storage

### Backend Integration
- **Supabase**: Backend-as-a-Service
- **Real-time**: Live collaboration features
- **Authentication**: User management
- **Database**: PostgreSQL with real-time subscriptions

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── figma/          # Design system components
│   └── ...             # Feature components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── data/               # Sample data and types
├── styles/             # CSS and styling
└── docs/               # Documentation
```

## Component Architecture

### Component Types

#### 1. UI Components (`src/components/ui/`)
Base components built on Radix UI primitives:
- **Button**: Interactive elements
- **Input**: Form controls
- **Card**: Content containers
- **Dialog**: Modal overlays
- **Dropdown**: Menu components

#### 2. Feature Components
Application-specific components:
- **TaskCard**: Individual task display
- **WeeklyKanbanBoard**: Main task board
- **VerticalNavBar**: Navigation sidebar
- **MobileBottomNav**: Mobile navigation

#### 3. Layout Components
Structure and organization:
- **App**: Main application wrapper
- **ErrorBoundary**: Error handling
- **RightSidePanel**: Sliding panels

### Component Patterns

#### Functional Components with Hooks
```typescript
interface ComponentProps {
  // Props interface
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Event logic
  }, [dependencies]);
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Custom Hooks
```typescript
export const useCustomHook = (param: string) => {
  const [state, setState] = useState(initialValue);
  
  const method = useCallback(() => {
    // Logic
  }, [dependencies]);
  
  return { state, method };
};
```

## State Management

### Context Providers

#### AuthContext
- User authentication state
- Login/logout functionality
- Session management
- Demo mode support

#### ThemeContext
- Light/dark mode switching
- System theme detection
- Persistent theme storage

#### CollaborationContext
- Team member management
- Real-time presence
- Activity tracking
- Workspace isolation

### State Patterns

#### Local State
```typescript
const [localState, setLocalState] = useState(initialValue);
```

#### Context State
```typescript
const { globalState, updateGlobalState } = useContext(GlobalContext);
```

#### Derived State
```typescript
const derivedState = useMemo(() => {
  return computeValue(dependencies);
}, [dependencies]);
```

## Data Flow

### Data Sources
1. **Local Storage**: User preferences, cached data
2. **Supabase**: Real-time database
3. **Sample Data**: Development fallbacks
4. **User Input**: Form submissions, interactions

### Data Flow Patterns

#### Unidirectional Data Flow
```
User Action → Event Handler → State Update → Re-render
```

#### Real-time Updates
```
Database Change → Supabase Subscription → Context Update → UI Update
```

#### Error Handling
```
Error → Error Boundary → User Notification → Recovery Action
```

## API Integration

### Supabase Client
```typescript
import { supabase } from './lib/supabase';

// Query data
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId);

// Insert data
const { data, error } = await supabase
  .from('tasks')
  .insert(newTask);

// Real-time subscriptions
const subscription = supabase
  .channel('tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'tasks'
  }, (payload) => {
    // Handle real-time updates
  })
  .subscribe();
```

### Error Handling
```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  handleError(error, {
    component: 'ComponentName',
    action: 'actionName'
  });
  throw error;
}
```

## Styling System

### Tailwind CSS Configuration
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      spacing: {
        // Custom spacing scale
      }
    }
  },
  plugins: [
    // Additional plugins
  ]
};
```

### CSS Classes

#### Utility Classes
- **Layout**: `flex`, `grid`, `block`, `inline`
- **Spacing**: `p-4`, `m-2`, `space-x-4`
- **Colors**: `bg-blue-500`, `text-gray-900`
- **Responsive**: `md:flex`, `lg:grid-cols-3`

#### Component Classes
- **Custom Components**: `.mobile-card`, `.touch-target`
- **Accessibility**: `.sr-only`, `.focus-visible`
- **Animations**: `.mobile-slide-up`, `.fade-in`

### Responsive Design
```typescript
// Mobile-first approach
<div className="
  flex flex-col          // Mobile: column layout
  md:flex-row           // Desktop: row layout
  gap-4                 // Consistent spacing
  p-4                   // Mobile padding
  md:p-6               // Desktop padding
">
```

## Performance Optimization

### React Performance
```typescript
// Memoization
const MemoizedComponent = memo(Component);

// Callback memoization
const handleClick = useCallback(() => {
  // Expensive operation
}, [dependencies]);

// Value memoization
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### Virtualization
```typescript
// For large lists
import { VirtualizedTaskList } from './components/VirtualizedTaskList';

<VirtualizedTaskList
  items={tasks}
  itemHeight={80}
  containerHeight={400}
/>
```

### Lazy Loading
```typescript
// Code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Conditional loading
{shouldLoad && <LazyComponent />}
```

## Testing

### Testing Setup
```typescript
// Jest configuration
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Test Patterns
```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';

test('renders task card', () => {
  render(<TaskCard task={mockTask} />);
  expect(screen.getByText(mockTask.title)).toBeInTheDocument();
});

// Hook testing
import { renderHook, act } from '@testing-library/react';

test('useCustomHook updates state', () => {
  const { result } = renderHook(() => useCustomHook());
  
  act(() => {
    result.current.updateState('new value');
  });
  
  expect(result.current.state).toBe('new value');
});
```

## Accessibility

### ARIA Attributes
```typescript
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
>
  <X className="w-4 h-4" />
</button>
```

### Keyboard Navigation
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      handleActivate();
      break;
    case 'Escape':
      handleClose();
      break;
    case 'ArrowDown':
      handleNext();
      break;
  }
};
```

### Screen Reader Support
```typescript
<div
  role="button"
  tabIndex={0}
  aria-label="Task card for {task.title}"
  onKeyDown={handleKeyDown}
>
  {/* Content */}
</div>
```

## Mobile Development

### Touch Events
```typescript
const { handleTouchStart, handleTouchEnd } = useMobileTouch();

<div
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  className="touch-manipulation"
>
  {/* Touch content */}
</div>
```

### Responsive Patterns
```typescript
// Mobile-first CSS
.mobile-card {
  @apply rounded-lg shadow-sm p-4;
}

@media (min-width: 768px) {
  .mobile-card {
    @apply rounded-xl shadow-md p-6;
  }
}
```

## Build and Deployment

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment Variables
```typescript
// .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Production Build
```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Code Quality

### ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-unused-vars": "warn",
    "prefer-const": "error"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Contributing

### Development Workflow
1. **Fork Repository**: Create your own fork
2. **Create Branch**: `git checkout -b feature/new-feature`
3. **Make Changes**: Implement your feature
4. **Test Changes**: Run tests and linting
5. **Submit PR**: Create pull request with description

### Code Standards
- **TypeScript**: Use strict typing
- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Write tests for new features
- **Documentation**: Update docs for changes

### Commit Messages
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

#### Styling Issues
```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

### Debug Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State debugging
- **Network Tab**: API call monitoring
- **Console**: Error logging

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tools
- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### Learning
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Performance Best Practices](https://web.dev/performance/)

---

This guide provides a comprehensive overview of the TaskZM codebase. For specific implementation details, refer to the source code and inline documentation.
