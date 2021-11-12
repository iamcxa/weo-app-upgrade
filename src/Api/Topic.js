import config from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  createTopic: () => `${prefix}/topic`,

  getTopics: () => `${prefix}/topics`,

  getTopicPosts: (id) => `${prefix}/topic/${id}`,

  fetchPostTopic: ({ id }) => `${prefix}/topic/${id}`,
  fetchPostTopicPost: ({ id }) => `${prefix}/topic/${id}/post`,
  fetchReplyPostPost: ({ id }) => `${prefix}/post/${id}/reply`,
};
