export const RECEIVED_UPDATE_ALERT = 'RECEIVED_UPDATE_ALERT';

export function updateAlert(data) {
  return {
    type: RECEIVED_UPDATE_ALERT,
    data,
  };
}

export default {
  updateAlert,
  RECEIVED_UPDATE_ALERT,
};
