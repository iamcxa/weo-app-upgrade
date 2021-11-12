import { default as config } from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  getBlockWords: () => `${prefix}/config/blocked/words`,

  getWeoVersion: () => `${prefix}/config/version`,
};
