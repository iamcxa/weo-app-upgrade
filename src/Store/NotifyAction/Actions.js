export const RECEIVED_NOTIFY_ACTION = 'RECEIVED_NOTIFY_ACTION';
export const RESET_NOTIFY_ACTION = 'RESET_NOTIFY_ACTION';
export function updateNotifyAction(data) {
  return {
    type: RECEIVED_NOTIFY_ACTION,
    data,
  };
}
export function resetNotifyAction() {
  return {
    type: RESET_NOTIFY_ACTION,
  };
}
