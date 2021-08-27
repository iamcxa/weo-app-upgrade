import { combineReducers } from 'redux';
import {
  RECEIVED_UPDATE_REPLY,
  RECEIVED_UPDATE_REPLY_BY_KEY,
  RESET_REPLY,
  DELETE_REPLY,
  CREATE_REPLY,
} from './Actions/reply';

const byId = (state = {}, action) => {
  switch (action.type) {
    case CREATE_REPLY:
      return {
        ...state,
        ...action.data,
      };
    case RECEIVED_UPDATE_REPLY:
      return {
        ...state,
        ...action.data,
      };
    case RECEIVED_UPDATE_REPLY_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case RESET_REPLY:
      return {};
    case DELETE_REPLY:
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
    case CREATE_REPLY:
    case RECEIVED_UPDATE_REPLY:
      return [...state, ...Object.keys(action.data)];
    case RESET_REPLY:
      return [];
    case DELETE_REPLY:
      return state.filter((item) => item !== action.id);
    default:
      return state;
  }
};

const replies = combineReducers({
  allIds,
  byId,
});

export default replies;
