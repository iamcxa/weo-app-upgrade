export const RECEIVED_UPDATE_TOPIC = 'RECEIVED_UPDATE_TOPIC';
export const RECEIVED_UPDATE_TOPIC_BY_KEY = 'RECEIVED_UPDATE_TOPIC_BY_KEY';
export const RESET_TOPIC = 'RESET_TOPIC';
export const DELETE_TOPIC = 'DELETE_TOPIC';
export const CREATE_TOPIC = 'CREATE_TOPIC';
const listType = 'TOPIC';

export function createTopic({ target, data }) {
  return {
    type: CREATE_TOPIC,
    target,
    data: {
      [data.id]: data,
    },
  };
}

export function updateTopics({ target, data }) {
  return {
    type: RECEIVED_UPDATE_TOPIC,
    listType,
    data,
    target,
  };
}

export function updateTopicByKey({ target, key, data }) {
  return {
    type: RECEIVED_UPDATE_TOPIC_BY_KEY,
    listType,
    target,
    key,
    data,
  };
}

export function resetTopic({ target }) {
  return {
    type: RESET_TOPIC,
    listType,
    target,
  };
}

export function deleteTopicById({ target, id }) {
  return {
    type: DELETE_TOPIC,
    listType,
    target,
    id,
  };
}
