import cloudbase from '@cloudbase/js-sdk';

const ENV_ID = 'english-study-d5guzlwvs975d1521';

let _app: any = null;

function getApp() {
  if (!_app) {
    _app = cloudbase.init({
      env: ENV_ID,
    });
  }
  return _app;
}

export const db = {
  collection: (name: string) => getApp().database().collection(name),
};

export const tcb = {
  database: () => getApp().database(),
  uploadFile: (options: any) => getApp().uploadFile(options),
  getTempFileURL: (options: any) => getApp().getTempFileURL(options),
};

export const app = { get: getApp };
export const ENV = ENV_ID;
