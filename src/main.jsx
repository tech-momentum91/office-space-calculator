import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { store } from './store/store';
import routes from './routes';
import AppErrorBoundary from './components/error-boundaries/AppErrorBoundary';
import { validateEnv } from './utils/env-validation';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';

import './index.css';

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  console.warn('Continuing anyway in development mode...');
  // In production, you might want to show an error page
  if (import.meta.env.PROD) {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Configuration Error</h1>
          <p>The application is not properly configured. Please contact support.</p>
        </div>
      </div>
    `;
    throw error;
  }
}

/**
 * App component that uses routes
 */
function App() {
  const element = useRoutes(routes);
  return element;
}

/**
 * Root component with all providers
 */
function Root() {
  return (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AppErrorBoundary>
            <App />
            <Toaster position='top-right' />
          </AppErrorBoundary>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}

// Render the app
createRoot(document.querySelector('#root')).render(<Root />);
