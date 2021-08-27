import { default as config } from 'App/Config';

const version = config.API_VERSION;
const prefix = `/api/app${version}`;

export default {
  getBlockWords: () => `${prefix}/config/blocked/words`,

  getWeoVersion: () => `${prefix}/config/version`,
};
