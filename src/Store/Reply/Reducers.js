/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { combineReducers } from 'redux';
import { ReplyTypes } from './Actions';

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
const byId = (state = INITIAL_STATE.byId, action) => {
  switch (action.type) {
    case ReplyTypes.CREATE_POST:
      if (!action.data) {
        return state;
      }
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
    case ReplyTypes.RECEIVED_UPDATE_POST:
      return {
        ...state,
        ...action.data,
      };
    case ReplyTypes.RECEIVED_UPDATE_POST_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case ReplyTypes.RESET_POST:
      return {};
    case ReplyTypes.DELETE_POST:
      const newList = { ...state };
      delete newList[action.id];
      return {
        ...newList,
      };
    default:
      return state;
  }
};

const allIds = (state = INITIAL_STATE.allIds, action) => {
  switch (action.type) {
    case ReplyTypes.CREATE_POST:
    case ReplyTypes.RECEIVED_UPDATE_POST:
      return action.data ? [...state, ...Object.keys(action.data)] : state;
    case ReplyTypes.RESET_POST:
      return [];
    case ReplyTypes.DELETE_POST:
      return state.filter((item) => item !== action.id);
    default:
      return state;
  }
};

export const reducer = combineReducers({
  allIds,
  byId,
});
