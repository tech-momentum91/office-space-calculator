import { Profiler } from 'react';
import { isDevelopment } from '@/utils/env-validation';

/**
 * React Profiler Wrapper Component
 * Wraps components to track render performance
 * Only active in development mode
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the profiled component
 * @param {React.ReactNode} props.children - Components to profile
 * @param {Function} props.onRender - Optional custom render callback
 */
export default function ProfilerWrapper({ id, children, onRender }) {
  // Default onRender callback
  const defaultOnRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    if (isDevelopment()) {
      console.log(`[Profiler] ${id}`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        startTime,
        commitTime,
      });

      // Warn if render took too long
      if (actualDuration > 100) {
        console.warn(`[Performance] ${id} took ${actualDuration.toFixed(2)}ms to render`);
      }
    }
  };

  // Only use Profiler in development
  if (!isDevelopment()) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRender || defaultOnRender}>
      {children}
    </Profiler>
  );
}
