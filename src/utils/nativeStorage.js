/**
 * nativeStorage.js
 * 
 * High-performance synchronous-read storage adapter for React Native.
 * Bridges legacy web localStorage usage with asynchronous mobile storage
 * by maintaining an active in-memory cache synchronized with persistent storage.
 */

let memoryCache = {};

// Initialize from global localStorage if running on Web/Capacitor
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        memoryCache[key] = window.localStorage.getItem(key);
      }
    }
  } catch {}
}

export const nativeStorage = {
  /**
   * Synchronous getter from in-memory cache
   */
  getItem(key) {
    if (typeof key !== 'string') return null;
    if (key in memoryCache) {
      return memoryCache[key];
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const val = window.localStorage.getItem(key);
        memoryCache[key] = val;
        return val;
      } catch {}
    }
    return null;
  },

  /**
   * Synchronous update to cache + async persistence
   */
  setItem(key, value) {
    if (typeof key !== 'string') return;
    const strVal = String(value);
    memoryCache[key] = strVal;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, strVal);
      } catch {}
    }
  },

  /**
   * Remove item from cache and persistent store
   */
  removeItem(key) {
    if (typeof key !== 'string') return;
    delete memoryCache[key];
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }
  },

  /**
   * Clear all storage
   */
  clear() {
    memoryCache = {};
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch {}
    }
  },

  /**
   * Bulk import for hydrating cache from AsyncStorage
   */
  hydrate(entries) {
    if (Array.isArray(entries)) {
      entries.forEach(([k, v]) => {
        if (k && v !== null) memoryCache[k] = v;
      });
    }
  },
};

export default nativeStorage;
