import config from 'App/Config';

const version = config.API_VERSION;
const prefix = `/api/app${version}`;

export default {
  createImage: () => `${prefix}/upload/image`,
};
