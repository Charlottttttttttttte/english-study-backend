import { supabaseRequest } from './client';

export interface AuthResponse {
  token: string;
  user: { id: string; username: string; role: string };
}

const ADMIN_CODE = 'JUNGLE2024';

export async function register(
  username: string,
  password: string,
  adminCode?: string
): Promise<AuthResponse> {
  const { data: existing } = await supabaseRequest('users', 'GET', null, { username: `eq.${username}` });
  if (existing && existing.length > 0) {
    throw new Error('该用户名已被注册');
  }

  const role = adminCode === ADMIN_CODE ? 'admin' : 'user';
  const { data } = await supabaseRequest('users', 'POST', {
    username,
    password,
    role,
  });

  const user = { id: data[0].id, username, role };
  const token = btoa(JSON.stringify(user));
  return { token, user };
}

export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  const { data: users } = await supabaseRequest('users', 'GET', null, {
    username: `eq.${username}`,
    password: `eq.${password}`,
  });

  if (!users || users.length === 0) {
    throw new Error('用户名或密码错误');
  }

  const u = users[0];
  const user = { id: u.id, username: u.username, role: u.role };
  const token = btoa(JSON.stringify(user));
  return { token, user };
}

export function saveToken(token: string, rememberMe: boolean = false) {
  localStorage.setItem('englishstudy_token', token);
  const days = rememberMe ? 30 : 7;
  const expireAt = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem('englishstudy_token_expire', String(expireAt));
}

export function getToken(): string | null {
  return localStorage.getItem('englishstudy_token');
}

export function removeToken() {
  localStorage.removeItem('englishstudy_token');
  localStorage.removeItem('englishstudy_token_expire');
}

export function isLoggedIn(): boolean {
  const token = getToken();
  if (!token) return false;
  const expireAt = localStorage.getItem('englishstudy_token_expire');
  if (expireAt) {
    const expireTime = parseInt(expireAt, 10);
    if (Date.now() > expireTime) {
      logout();
      return false;
    }
  }
  return true;
}

export function getCurrentUser(): { id: string; username: string; role: string } | null {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function logout() {
  removeToken();
  localStorage.removeItem('englishstudy_api_user');
  localStorage.removeItem('englishstudy_auth');
}

export function saveApiUser(user: { username: string; role: string }) {
  localStorage.setItem('englishstudy_api_user', JSON.stringify(user));
}

export async function getMe(): Promise<{ user: { id: string; username: string; role: string } }> {
  const user = getCurrentUser();
  if (!user) throw new Error('未登录');
  return { user };
}
