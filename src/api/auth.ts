import { supabase } from './client';

export interface AuthResponse {
  token: string;
  user: { id: string; username: string; role: string };
}

// 管理员注册码 - 你可以修改成自己的密码
const ADMIN_CODE = 'JUNGLE2024';

export async function register(username: string, password: string, adminCode?: string): Promise<AuthResponse> {
  // 如果输入了正确的注册码，设为管理员，否则是普通用户
  const role = adminCode === ADMIN_CODE ? 'admin' : 'user';
  
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password, role }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('注册失败');

  const token = btoa(JSON.stringify({ id: data.id, username: data.username, role: data.role }));
  return { token, user: { id: String(data.id), username: data.username, role: data.role } };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) throw new Error('用户名或密码错误');

  const token = btoa(JSON.stringify({ id: data.id, username: data.username, role: data.role }));
  return { token, user: { id: String(data.id), username: data.username, role: data.role } };
}

export function getToken(): string | null {
  return localStorage.getItem('englishstudy_token');
}

export function saveToken(token: string) {
  localStorage.setItem('englishstudy_token', token);
}

export function removeToken() {
  localStorage.removeItem('englishstudy_token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
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
