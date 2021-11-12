import config from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  createImage: () => `${prefix}/upload/image`,
};
