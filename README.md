# Office Space Calculator - React Enterprise Boilerplate

A production-ready, large-scale React application boilerplate with Redux Toolkit + RTK Query, Tailwind CSS, ShadCN UI, comprehensive error boundaries, and enterprise-grade developer experience tools.

##  Features

### Core Technology Stack

- **Vite** - Fast build tool with optimized configuration
- **React 19** - Latest React features
- **Redux Toolkit + RTK Query** - State management and API calls
- **React Router 7** - Client-side routing with protection
- **Tailwind CSS 4** - Utility-first styling with custom design tokens
- **ShadCN UI** - High-quality component library
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Authentication & Authorization

- Cookie-based session authentication
- RTK Query endpoints for login, logout, and session management
- Protected route system
- Module-based permissions (WithModulePermission HOC)
- Automatic session verification and token refresh

### Error Handling

- **Multi-level error boundaries**
  - App-level (catches all errors)
  - Route-level (per-page error handling)
  - Component-level (isolated component failures)
- Centralized error logging
- Development vs Production error messages

### Code Quality & DX

- ESLint with React, Hooks, and Unicorn rules
- Prettier for consistent formatting
- Husky for git hooks
- Lint-staged for pre-commit checks
- EditorConfig for IDE consistency
- VSCode workspace settings included
- **Import validation**: Duplicate detection only (NO alphabetical ordering)

### Performance

- Dynamic lazy loading with opt-out capability
- Code splitting strategy
- Bundle analyzer integration
- Performance budget configuration
- React Profiler wrapper for monitoring

### Developer Experience

- Path aliases (@components, @utils, @hooks, etc.)
- Environment variable validation
- Custom hooks (useAuth, usePermission, useDebounce, etc.)
- Comprehensive JSDoc comments
- Hot module replacement (HMR)

##  Project Structure

```
office-space-calculator/
├── .husky/                    # Git hooks
├── .vscode/                   # VSCode settings
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, SVGs
│   ├── components/
│   │   ├── error-boundaries/ # Error boundary components
│   │   ├── layouts/          # Layout components
│   │   ├── loaders/          # Loading components
│   │   ├── monitoring/       # Performance monitoring
│   │   ├── route-protection/ # Auth route protection
│   │   └── ui/               # ShadCN components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   ├── pages/                # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── WelcomePage.jsx
│   │   └── DashboardPage.jsx
│   ├── store/
│   │   ├── api/             # RTK Query API slices
│   │   ├── slices/          # Redux slices
│   │   └── store.js         # Redux store config
│   ├── utils/               # Utility functions
│   ├── routes.jsx           # Route configuration
│   ├── main.jsx             # Application entry
│   └── index.css            # Global styles
├── .editorconfig            # Editor configuration
├── .env.example             # Environment template
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore rules
├── .prettierrc.yml          # Prettier configuration
├── components.json          # ShadCN configuration
├── jsconfig.json            # JavaScript configuration
├── package.json             # Dependencies
├── performance-budget.json  # Performance budgets
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js           # Vite configuration
```

##  Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd office-space-calculator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.development
   ```

   Edit `.env.development` and configure:
   - `PHI_API_URL` - Your backend API URL
   - Other environment variables as needed

4. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

##  Authentication Flow

The application uses cookie-based session authentication with RTK Query:

1. User visits `/` → Redirected to `/welcome` or `/dashboard` based on auth status
2. User clicks "Get Started" → Navigate to `/login`
3. User submits credentials → RTK Query mutation to `/method/login`
4. On success:
   - Session cookie set by backend
   - User data fetched and stored in Redux
   - Permissions fetched and stored
   - Redirect to `/dashboard`
5. All subsequent API calls include session cookie (credentials: 'include')
6. On 401/403 → Automatic logout and redirect to `/login`



##  Route Protection

Routes are protected using the `ProtectedRoute` component:

```jsx
// Protected route (requires authentication)
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Public route (redirects if authenticated)
<ProtectedRoute requireAuth={false}>
  <LoginPage />
</ProtectedRoute>
```

Module-level permissions:

```jsx
// Wrap page with permission check
export default WithModulePermission(SettingsPage, 'Settings');
```

##  Styling

### Design Tokens

Custom design tokens are defined in `src/index.css`:

- Color palette (primary, secondary, neutral, semantic)
- Typography scale
- Spacing scale
- Border radius
- Shadows

### Using Tailwind

```jsx
<div className='bg-primary-600 text-white px-4 py-2 rounded-lg'>Button</div>
```

### Using ShadCN Components

```jsx
import { Button } from '@/components/ui/button';

<Button variant='primary' size='lg'>
  Click me
</Button>;
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run lint:check` - Check with max warnings = 0
- `npm run analyze` - Analyze bundle size

##  Testing

Testing infrastructure is set up but test files need to be added. The project includes:

- Jest configuration
- React Testing Library setup
- RTK Query mock utilities

##  Key Dependencies

- `@reduxjs/toolkit` - Redux Toolkit with RTK Query
- `react-router-dom` - Routing
- `react-hook-form` - Form management
- `zod` - Schema validation
- `tailwindcss` - Styling
- `@radix-ui/*` - ShadCN UI primitives
- `lucide-react` - Icons
- `sonner` - Toast notifications

##  Key Patterns

### Custom Hooks

- `useAuth()` - Access auth state and methods
- `usePermission(module, permission)` - Check permissions
- `useDebounce(value, delay)` - Debounce values
- `useLocalStorage(key, initialValue)` - Persist to localStorage

### Error Handling

```jsx
// App-level
<AppErrorBoundary>
  <App />
</AppErrorBoundary>

// Route-level
<RouteErrorBoundary>
  <MyPage />
</RouteErrorBoundary>

// Component-level
<ComponentErrorBoundary name='MyComponent'>
  <MyComponent />
</ComponentErrorBoundary>
```

### Lazy Loading

```jsx
// Default: Lazy loaded with retries
const Dashboard = lazyLoad(() => import('@/pages/Dashboard'));

// Eager: Load immediately (for critical pages)
const Critical = lazyLoad(() => import('@/pages/Critical'), { eager: true });
```

## 🚀 Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables on your hosting platform
4. Ensure backend API CORS is configured properly
5. Set up SSL for production (required for secure cookies)



##  License

This project is proprietary and confidential.

##  Acknowledgments

- Built with modern React best practices
- Follows industry-standard patterns for large-scale applications
