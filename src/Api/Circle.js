import config from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  getCurrentCircle: () => `${prefix}/circle/current`,

  getCircleRanking: () => `${prefix}/circle/ranking`,

  setUserCircle: ({ id }) => `${prefix}/member/circle/${id}`,

  setHomeCircle: ({ id }) => `${prefix}/member/home-circle/${id}`,
};
