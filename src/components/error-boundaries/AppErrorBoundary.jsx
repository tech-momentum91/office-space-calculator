import React from 'react';
import { logError } from '@/utils/error-logger';
import { Button } from '@/components/ui/button';

/**
 * App-level Error Boundary
 * Catches all unhandled errors in the application
 * Shows user-friendly error page with reload option
 */
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to error tracking service
    logError(error, errorInfo, {
      boundary: 'AppErrorBoundary',
      level: 'critical',
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4'>
          <div className='max-w-md w-full text-center space-y-6'>
            <div className='space-y-2'>
              <div className='text-6xl'>😕</div>
              <h1 className='text-3xl font-bold text-neutral-900'>Something went wrong</h1>
              <p className='text-neutral-600'>
                We&apos;re sorry, but something unexpected happened. Please try reloading the page.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className='bg-error-light p-4 rounded-lg text-left'>
                <p className='font-semibold text-error-dark mb-2'>Error Details:</p>
                <p className='text-sm font-mono text-error-dark break-all'>
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className='mt-2'>
                    <summary className='cursor-pointer text-sm font-semibold text-error-dark'>
                      Component Stack
                    </summary>
                    <pre className='text-xs mt-2 overflow-auto max-h-40 text-error-dark'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className='flex gap-3 justify-center'>
              <Button onClick={this.handleReload} size='lg'>
                Reload App
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
