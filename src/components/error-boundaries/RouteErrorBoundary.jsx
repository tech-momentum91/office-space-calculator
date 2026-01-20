import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logError } from '@/utils/error-logger';
import { Button } from '@/components/ui/button';

/**
 * Route-level Error Boundary
 * Catches errors within a specific route
 * Shows error page with "Go Back" option
 */
class RouteErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo, {
      boundary: 'RouteErrorBoundary',
      level: 'warning',
      route: window.location.pathname,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          navigate={this.props.navigate}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Error fallback UI component
 */
function ErrorFallback({ error, errorInfo, onReset, navigate }) {
  const handleGoBack = () => {
    onReset();
    navigate(-1);
  };

  const handleGoHome = () => {
    onReset();
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4'>
      <div className='max-w-md w-full text-center space-y-6'>
        <div className='space-y-2'>
          <div className='text-6xl'>⚠️</div>
          <h1 className='text-2xl font-bold text-neutral-900'>Page Error</h1>
          <p className='text-neutral-600'>
            This page encountered an error. You can go back or return to the home page.
          </p>
        </div>

        {import.meta.env.DEV && error && (
          <div className='bg-warning-light p-4 rounded-lg text-left'>
            <p className='font-semibold text-warning-dark mb-2'>Error Details:</p>
            <p className='text-sm font-mono text-warning-dark break-all'>{error.toString()}</p>
          </div>
        )}

        <div className='flex gap-3 justify-center'>
          <Button onClick={handleGoBack} variant='outline'>
            Go Back
          </Button>
          <Button onClick={handleGoHome}>Go to Home</Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper to provide navigate function to class component
 */
export default function RouteErrorBoundary({ children }) {
  const navigate = useNavigate();
  return <RouteErrorBoundaryClass navigate={navigate}>{children}</RouteErrorBoundaryClass>;
}
