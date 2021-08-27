export const ON_LIST_UPDATE = 'ON_LIST_UPDATE';

export function onUpdateList(data) {
  return {
    type: ON_LIST_UPDATE,
    data,
  };
}

export default {
  onUpdateList,
};
