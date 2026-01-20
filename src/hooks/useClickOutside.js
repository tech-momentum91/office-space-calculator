import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect clicks outside an element
 *
 * @param {Function} callback - Function to call when click outside is detected
 * @returns {React.RefObject} - Ref to attach to the element
 *
 * @example
 * const ref = useClickOutside(() => {
 *   setIsOpen(false);
 * });
 *
 * return <div ref={ref}>Content</div>;
 */
export function useClickOutside(callback) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback]);

  return ref;
}
