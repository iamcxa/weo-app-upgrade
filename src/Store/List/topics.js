import { combineReducers } from 'redux';
import {
  RECEIVED_UPDATE_TOPIC,
  RECEIVED_UPDATE_TOPIC_BY_KEY,
  RESET_TOPIC,
  DELETE_TOPIC,
  CREATE_TOPIC,
} from './Actions/topic';

const byId = (state = {}, action) => {
  switch (action.type) {
    case CREATE_TOPIC:
      return {
        ...state,
        ...action.data,
      };
    case RECEIVED_UPDATE_TOPIC:
      return {
        ...state,
        ...action.data,
      };
    case RECEIVED_UPDATE_TOPIC_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case RESET_TOPIC:
      return {};
    case DELETE_TOPIC:
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
    case CREATE_TOPIC:
    case RECEIVED_UPDATE_TOPIC:
      return [...state, ...Object.keys(action.data)];
    case RESET_TOPIC:
      return [];
    case DELETE_TOPIC:
      return state.filter((item) => item !== action.id);
    default:
      return state;
  }
};

const topics = combineReducers({
  allIds,
  byId,
});

export default topics;
