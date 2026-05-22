import cloudbase from '@cloudbase/js-sdk';

const ENV_ID = 'english-study-d5guzlwvs975d1521';

const app = cloudbase.init({
  env: ENV_ID,
});

export const db = app.database();
export const auth = app.auth();
export const tcb = app;
export { app };
export const ENV = ENV_ID;
