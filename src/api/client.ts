const API_URL = 'https://1435550312-d01jjmjzjpu.in.ap-shanghai.tencentscf.com';

export const ENV = 'english-study-d5guzlwvs975d1521';

// 统一调用云函数
export async function callCloudFunction(action: string, data: any = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}

// 材料缓存
let _materialsCache: any[] | null = null;

// 兼容 CloudBase SDK 的 tcb 接口
export const tcb = {
  database: () => ({
    collection: (name: string) => ({
      where: (query: any) => ({
        get: async () => {
          if (name === 'materials') {
            const { materials } = await callCloudFunction('getAllMaterials');
            const filtered = (materials || []).filter((m: any) =>
              Object.entries(query).every(([k, v]) => m[k] === v)
            );
            return { data: filtered };
          }
          if (name === 'users') {
            const { users } = await callCloudFunction('getUsers');
            const filtered = (users || []).map((u: any) => ({ ...u, _id: u.id })).filter((u: any) =>
              Object.entries(query).every(([k, v]) => u[k] === v)
            );
            return { data: filtered };
          }
          if (name === 'progress') {
            const { progress } = await callCloudFunction('getProgress', query);
            return { data: progress ? [progress] : [] };
          }
          return { data: [] };
        },
        count: async () => {
          if (name === 'materials') {
            const { materials } = await callCloudFunction('getAllMaterials');
            return { total: (materials || []).length };
          }
          return { total: 0 };
        },
      }),

      orderBy: (_field: string, _order: string) => ({
        get: async () => {
          if (name === 'materials') {
            const { materials } = await callCloudFunction('getAllMaterials');
            _materialsCache = materials || [];
            return { data: _materialsCache };
          }
          return { data: [] };
        },
      }),

      doc: (id: string) => ({
        update: async (updates: any) => {
          if (name === 'materials') {
            const all = _materialsCache || (await callCloudFunction('getAllMaterials')).materials || [];
            const m = all.find((x: any) => x._id === id);
            if (m) {
              await callCloudFunction('saveMaterial', {
                dayIndex: m.day_index,
                title: updates.title !== undefined ? updates.title : m.title,
                audioSrc: updates.audio_src !== undefined ? updates.audio_src : m.audio_src,
                videoSrc: updates.video_src !== undefined ? updates.video_src : m.video_src,
                originalText: updates.original_text !== undefined ? updates.original_text : m.original_text,
                translatedText: updates.translated_text !== undefined ? updates.translated_text : m.translated_text,
              });
            }
          } else if (name === 'users') {
            await callCloudFunction('toggleRole', { userId: id, role: updates.role });
          }
        },
        remove: async () => {
          if (name === 'users') {
            await callCloudFunction('deleteUser', { userId: id });
          } else if (name === 'materials') {
            await callCloudFunction('deleteMaterial', { docId: id });
          }
        },
      }),

      add: async (doc: any) => {
        if (name === 'users') {
          return await callCloudFunction('register', doc);
        } else if (name === 'materials') {
          return await callCloudFunction('saveMaterial', {
            dayIndex: doc.day_index,
            title: doc.title || '',
            audioSrc: doc.audio_src || '',
            videoSrc: doc.video_src || '',
            originalText: doc.original_text || '',
            translatedText: doc.translated_text || '',
          });
        } else if (name === 'progress') {
          return await callCloudFunction('saveProgress', doc);
        }
      },

      get: async () => {
        if (name === 'users') {
          const { users } = await callCloudFunction('getUsers');
          return { data: (users || []).map((u: any) => ({ ...u, _id: u.id })) };
        }
        if (name === 'materials') {
          const { materials } = await callCloudFunction('getAllMaterials');
          return { data: materials || [] };
        }
        return { data: [] };
      },
    }),
  }),

  uploadFile: () => {
    throw new Error('文件上传请使用七牛云');
  },
  getTempFileURL: () => {
    throw new Error('请使用七牛云链接');
  },
};
