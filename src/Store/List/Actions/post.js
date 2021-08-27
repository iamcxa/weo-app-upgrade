export const RECEIVED_UPDATE_POST = 'RECEIVED_UPDATE_POST';
export const RECEIVED_UPDATE_POST_BY_KEY = 'RECEIVED_UPDATE_POST_BY_KEY';
export const RESET_POST = 'RESET_POST';
export const DELETE_POST = 'DELETE_POST';
export const CREATE_POST = 'CREATE_POST';
const listType = 'POST';

export function createPost({ target, data }) {
  return {
    type: CREATE_POST,
    listType,
    target,
    data,
  };
}

export function updatePost({ target, data }) {
  return {
    type: RECEIVED_UPDATE_POST,
    listType,
    target,
    data,
  };
}

export function updatePostByKey({ target, key, data }) {
  return {
    type: RECEIVED_UPDATE_POST_BY_KEY,
    listType,
    target,
    key,
    data,
  };
}

export function resetPost({ target }) {
  return {
    type: RESET_POST,
    listType,
    target,
  };
}

export function deletePostById({ target, id }) {
  return {
    type: DELETE_POST,
    listType,
    target,
    id,
  };
}
