import config from 'App/Config';

const version = config.API_VERSION;
const prefix = `/api/app${version}`;

export default {
  getCurrentCircle: () => `${prefix}/member/circle`,

  setUserCircle: ({ id }) => `${prefix}/member/circle/${id}`,

  setHomeCircle: ({ id }) => `${prefix}/member/home-circle/${id}`,
};
