export const RECEIVED_UPDATE_REPLY = 'RECEIVED_UPDATE_REPLY';
export const RECEIVED_UPDATE_REPLY_BY_KEY = 'RECEIVED_UPDATE_REPLY_BY_KEY';
export const RESET_REPLY = 'RESET_REPLY';
export const DELETE_REPLY = 'DELETE_REPLY';
export const CREATE_REPLY = 'CREATE_REPLY';
const listType = 'REPLY';

export function createReply({ target, data }) {
  return {
    type: CREATE_REPLY,
    listType,
    data,
    target,
  };
}

export function updateReply({ target, data }) {
  return {
    type: RECEIVED_UPDATE_REPLY,
    listType,
    data,
    target,
  };
}

export function updateReplyByKey({ target, key, data }) {
  return {
    type: RECEIVED_UPDATE_REPLY_BY_KEY,
    listType,
    key,
    target,
    data,
  };
}

export function resetReply({ target }) {
  return {
    type: RESET_REPLY,
    listType,
    target,
  };
}

export function deleteReplyById({ target, id }) {
  return {
    type: DELETE_REPLY,
    listType,
    target,
    id,
  };
}
