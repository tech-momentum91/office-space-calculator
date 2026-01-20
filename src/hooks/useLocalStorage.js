import { useState, useEffect } from 'react';

/**
 * Custom hook to persist state to localStorage
 *
 * @param {string} key - LocalStorage key
 * @param {*} initialValue - Initial value
 * @returns {[*, Function]} - Stateful value and setter function
 *
 * @example
 * const [name, setName] = useLocalStorage('userName', 'Guest');
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
