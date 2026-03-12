import { STORAGE_KEYS } from "../constants/storageKeys";

export interface SessionStorageAdapter {
  save: (token: string) => void;
  load: () => string | null;
  clear: () => void;
}

const localStorageAdapter: SessionStorageAdapter = {
  save: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch {
      // localStorage may be unavailable (private browsing, storage quota exceeded)
    }
  },
  load: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      // ignore — best-effort clear
    }
  },
};

/**
 * Pluggable session storage adapter.
 *
 * Current implementation: localStorage.
 * Future migration to HttpOnly cookies: replace this instance with a noop adapter
 * (the browser/server manages cookies automatically) without touching any other file.
 */
export const sessionStorageAdapter: SessionStorageAdapter = localStorageAdapter;
