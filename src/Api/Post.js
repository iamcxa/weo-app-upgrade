import config from "App/Config";

const version = config.API_VERSION;
const prefix = `/api/app${version}`;

export default {
  getSinglePost: (id) => `${prefix}/post/${id}`,

  getPostReplies: (id) => `${prefix}/post/${id}/replies`,

  createPost: (id) => `${prefix}/topic/${id}/post`,

  createReply: (id) => `${prefix}/post/${id}/reply`,

  getTopicPosts: ({ topicId }) => `${prefix}/topic/${topicId}`,
  hidePost: ({ id }) => `${prefix}/hide/${id}`,
  fetchGetSinglePost: ({ id }) => `${prefix}/post/${id}`,
};