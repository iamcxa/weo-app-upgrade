import config from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  getPoplarKeyWords: () => `${prefix}/search/poplar`,

  searchTopicAndPosts: () => `${prefix}/search`,
};
