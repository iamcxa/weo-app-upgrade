import { combineReducers } from 'redux';
import {
  RECEIVED_UPDATE_POST,
  RECEIVED_UPDATE_POST_BY_KEY,
  CREATE_POST,
  RESET_POST,
  DELETE_POST,
} from './Actions/post';

const byId = (state = {}, action) => {
  switch (action.type) {
    case CREATE_POST:
      const newPostKey = Object.keys(action.data)[0];
      if (
        newPostKey &&
        action.data[newPostKey] &&
        action.data[newPostKey].replyPostId &&
        state[action.data[newPostKey].replyPostId]
      ) {
        const { replyPostId } = action.data[newPostKey];
        const replyPost = state[replyPostId];
        return {
          ...state,
          ...action.data,
          [replyPostId]: {
            ...replyPost,
            count: replyPost.count + 1,
          },
        };
      }
      return {
        ...state,
        ...action.data,
      };
    case RECEIVED_UPDATE_POST:
      return {
        ...state,
        ...action.data,
      };
    case RECEIVED_UPDATE_POST_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case RESET_POST:
      return {};
    case DELETE_POST:
      const newList = { ...state };
      delete newList[action.id];
      return {
        ...newList,
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case CREATE_POST:
    case RECEIVED_UPDATE_POST:
      return [...state, ...Object.keys(action.data)];
    case RESET_POST:
      return [];
    case DELETE_POST:
      return state.filter((item) => item !== action.id);
    default:
      return state;
  }
};

const posts = combineReducers({
  allIds,
  byId,
});

export default posts;
