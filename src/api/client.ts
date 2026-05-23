// 通过 CDN 加载的 CloudBase SDK，使用 window.cloudbase

const ENV_ID = 'english-study-d5guzlwvs975d1521';

// @ts-ignore
const cloudbase = window.cloudbase;

if (!cloudbase) {
  console.error('CloudBase SDK 未加载，请检查网络连接');
}

cloudbase.init({ env: ENV_ID });

export const db = cloudbase.database();
export const tcb = cloudbase;
export { cloudbase as app };
export const ENV = ENV_ID;
