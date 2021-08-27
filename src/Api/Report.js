import config from '~/Config';

const version = config.API_VERSION;
const prefix = `/api/app${version}`;

export default {
  createTopicReport: (id) => `${prefix}/report/topic/${id}`,

  createPostReport: (id) => `${prefix}/report/post/${id}`,

  createReplyReport: (id) => `${prefix}/report/reply/${id}`,

  hidePost: (id) => `${prefix}/hide/${id}`,
  fetchReportPost: ({ id, type }) => `${prefix}/report/${type}/${id}`,
};
