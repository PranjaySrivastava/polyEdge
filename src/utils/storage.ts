/**
 * Safe browser localStorage utility with fallback.
 */

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to read "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Failed to write "${key}" to localStorage:`, err);
    return false;
  }
}

export function clearStorageKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Failed to clear "${key}" from localStorage:`, err);
  }
}
