import config from "~/Config";

const version = config.API_VERSION;
const prefix = `/api${version}/app`;

export default {
  getNotifications: () => `${prefix}/notifications`,

  setNotificationRead: ({ id }) => `${prefix}/notification/${id}/read`,
};
