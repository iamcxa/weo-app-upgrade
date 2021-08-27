import _ from 'lodash';

export const GET_NOTIFICATION_LIST = 'GET_NOTIFICATION_LIST';
export const RESET_NOTIFICATION_LIST = 'RESET_NOTIFICATION_LIST';
export const UPDATE_NOTIFICATION_BY_KEY = 'UPDATE_NOTIFICATION_BY_KEY';

export function receiveNotificationList(data) {
  const formatedData = _.reduce(
    data,
    (total, item) => ({ ...total, [item.id]: { ...item } }),
    {},
  );
  return {
    type: GET_NOTIFICATION_LIST,
    data: formatedData,
  };
}

export function updateNotificationByKey({ key, data }) {
  return {
    type: UPDATE_NOTIFICATION_BY_KEY,
    key,
    data,
  };
}

export function resetNotification() {
  return {
    type: RESET_NOTIFICATION_LIST,
  };
}
