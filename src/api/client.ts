// Supabase 客户端
// 连接 Supabase 数据库

const SUPABASE_URL = 'https://icsnavjjdmeoxlhzhvbj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc25hdm5janltZW94bGh6aHZiaiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMzNjY0MjQ2LCJleHAiOjIwNDkyNDAyNDZ9';

// 简单的 supabase 兼容层
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
  };

  const options: any = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();
  return { data };
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

// 导出 supabaseRequest 供其他文件使用
export { supabaseRequest };
