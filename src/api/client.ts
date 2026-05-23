import cloudbase from '@cloudbase/js-sdk';

const ENV_ID = 'english-study-d5guzlwvs975d1521';

cloudbase.init({
  env: ENV_ID,
});

export const db = cloudbase.database();
export const tcb = cloudbase;
export { cloudbase as app };
export const ENV = ENV_ID;
