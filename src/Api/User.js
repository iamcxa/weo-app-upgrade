import config from '~/Config';

const version = config.API_VERSION;
const prefix = `/api/app${version}`;

export default {
  // 後端 api 目前還是用 `signin`，但實際上是註冊
  signUp: () => `${prefix}/member/signin`,

  logout: () => `${prefix}/member/logout`,

  updateProfile: () => `${prefix}/member/profile`,

  updateConfig: () => `${prefix}/member/config`,

  getBlockWords: () => `${prefix}/config/blocked/words`,
};
