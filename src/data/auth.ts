// Unified auth system: backend-first with localStorage fallback

import { removeToken, isLoggedIn as apiLoggedIn } from '../api/auth';

export type UserRole = 'admin' | 'guest' | 'user';

export interface User {
  name: string;
  role: UserRole;
  avatar: string;
}

const AUTH_KEY = 'englishstudy_auth';
const MODE_KEY = 'englishstudy_mode'; // 'api' | 'local'

// Preset local accounts
export const ACCOUNTS = {
  admin: { name: '管理员', password: 'admin123', role: 'admin' as UserRole, avatar: '管' },
  guest: { name: '游客', password: 'guest123', role: 'guest' as UserRole, avatar: '游' },
};

/** Check if local login exists */
function localLoggedIn(): boolean {
  return !!localStorage.getItem(AUTH_KEY);
}

/** Check if user is authenticated (either backend or local) */
export function isLoggedIn(): boolean {
  return apiLoggedIn() || localLoggedIn();
}

/** Check if current user is admin */
export function isAdmin(): boolean {
  // Try API mode first
  if (apiLoggedIn()) {
    const userStr = localStorage.getItem('englishstudy_api_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role === 'admin';
      } catch { /* ignore */ }
    }
  }
  // Fall back to local mode
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/** Get current user (unified) */
export function getCurrentUser(): User | null {
  // Try API mode first
  if (apiLoggedIn()) {
    const userStr = localStorage.getItem('englishstudy_api_user');
    if (userStr) {
      try {
        const apiUser = JSON.parse(userStr);
        return {
          name: apiUser.username,
          role: apiUser.role as UserRole,
          avatar: apiUser.username.charAt(0).toUpperCase(),
        };
      } catch { /* ignore */ }
    }
  }
  // Fall back to local mode
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

/** Local login (preset accounts) */
export function loginLocal(username: string, password: string): User | null {
  if (username === 'admin' && password === 'admin123') {
    const user: User = { name: ACCOUNTS.admin.name, role: 'admin', avatar: ACCOUNTS.admin.avatar };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(MODE_KEY, 'local');
    return user;
  }
  if (username === 'guest' && password === 'guest123') {
    const user: User = { name: ACCOUNTS.guest.name, role: 'guest', avatar: ACCOUNTS.guest.avatar };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(MODE_KEY, 'local');
    return user;
  }
  return null;
}

/** Save API user data */
export function saveApiUser(user: { username: string; role: string }) {
  localStorage.setItem('englishstudy_api_user', JSON.stringify(user));
  localStorage.setItem(MODE_KEY, 'api');
}

/** Unified logout */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('englishstudy_api_user');
  localStorage.removeItem(MODE_KEY);
  removeToken();
}

/** Get current mode */
export function getMode(): 'api' | 'local' | null {
  return localStorage.getItem(MODE_KEY) as 'api' | 'local' | null;
}
