import React from 'react';
import { logError } from '@/utils/error-logger';

/**
 * Component-level Error Boundary
 * Wraps individual components to prevent entire app from crashing
 * Shows minimal fallback UI
 */
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo, {
      boundary: 'ComponentErrorBoundary',
      level: 'info',
      component: this.props.name || 'Unknown',
    });

    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className='p-4 bg-error-light border border-error rounded-lg'>
          <p className='text-sm text-error-dark'>
            {this.props.name ? `Unable to load ${this.props.name}` : 'Component failed to load'}
          </p>
          {import.meta.env.DEV && this.state.error && (
            <p className='text-xs text-error-dark mt-2 font-mono'>{this.state.error.message}</p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
