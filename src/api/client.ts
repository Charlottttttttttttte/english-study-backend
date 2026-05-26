// Supabase 客户端
// 连接 Supabase 数据库

const SUPABASE_URL = 'https://vwrdoszksqvixuxuddcg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3cmRvc3prc3F2aXh1eHVkZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDY4MzYsImV4cCI6MjA5NTI4MjgzNn0.WFMc7wbFrsV18bn9LyJIXLSkRnOE3ICGbY95m66EDWk';

// 统一调用 Supabase REST API
async function supabaseRequest(table: string, method: string, body?: any, query?: any) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      url.searchParams.append(k, String(v));
    });
  }

  const headers: any = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : '',
  };

  const options: any = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), options);
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }

  // 204 No Content 或空响应
  const text = await res.text();
  if (!text) return { data: [] };
  
  try {
    const data = JSON.parse(text);
    return { data };
  } catch {
    return { data: [] };
  }
}

export const ENV = 'supabase';

// 兼容旧的 tcb 接口
export const tcb = {
  database: () => ({
    collection: (name: string) => ({
      where: (query: any) => ({
        get: async () => supabaseRequest(name, 'GET', null, query),
        count: async () => {
          const { data } = await supabaseRequest(name, 'GET', null, { select: 'count' });
          return { total: Array.isArray(data) ? data.length : 0 };
        },
      }),
      orderBy: (field: string, _order: string) => ({
        get: async () => supabaseRequest(name, 'GET', null, { order: `${field}.asc` }),
      }),
      doc: (id: string) => ({
        update: async (updates: any) => supabaseRequest(name, 'PATCH', updates, { id: `eq.${id}` }),
        remove: async () => supabaseRequest(name, 'DELETE', null, { id: `eq.${id}` }),
      }),
      add: async (doc: any) => {
        const { data } = await supabaseRequest(name, 'POST', doc);
        return { id: data?.[0]?.id || data?.id };
      },
      get: async () => supabaseRequest(name, 'GET'),
    }),
  }),
  uploadFile: () => { throw new Error('使用七牛云上传文件'); },
  getTempFileURL: () => { throw new Error('使用七牛云链接'); },
};

export { supabaseRequest };
