import config from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  like: ({ type, id }) => `${prefix}/vote/${type}/${id}/like`,
  dislike: ({ type, id }) => `${prefix}/vote/${type}/${id}/dislike`,
  cancelVote: ({ type, id }) => `${prefix}/vote/${type}/${id}/cancel`,

  // topic
  likeTopic: (id) => `${prefix}/vote/topic/${id}/like`,
  dislikeTopic: (id) => `${prefix}/vote/topic/${id}/dislike`,
  cancelVoteTopic: (id) => `${prefix}/vote/topic/${id}/cancel`,

  // post
  likePost: (id) => `${prefix}/vote/post/${id}/like`,
  dislikePost: (id) => `${prefix}/vote/post/${id}/dislike`,
  cancelVotePost: (id) => `${prefix}/vote/post/${id}/cancel`,

  // reply
  likeReply: (id) => `${prefix}/vote/reply/${id}/like`,
  dislikeReply: (id) => `${prefix}/vote/reply/${id}/dislike`,
  cancelVoteReply: (id) => `${prefix}/vote/reply/${id}/cancel`,
};
