/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { combineReducers } from 'redux';
import { PostTypes } from './Actions';

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
const paging = createReducer(INITIAL_STATE.paging, {
  [PostTypes.UPDATE_POST_SUCCESS]: (state, action) => ({
    ...state,
    ...action.paging,
  }),
});

const byId = (state = INITIAL_STATE.byId, action) => {
  switch (action.type) {
    case PostTypes.FETCH_GET_POST:
      return {};
    case PostTypes.CREATE_POST:
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
    case PostTypes.UPDATE_POST:
      return {
        ...state,
        [action.data.id]: { ...action.data },
      };
    case PostTypes.UPDATE_POST_SUCCESS:
      return {
        ...action.data,
      };
    case PostTypes.RECEIVED_UPDATE_POST:
      return {
        ...state,
        ...action.data,
      };
    case PostTypes.RECEIVED_UPDATE_POST_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case PostTypes.UPDATE_POST_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case PostTypes.RESET_POST:
      return {};
    case PostTypes.DELETE_POST_BY_ID:
      let deleteList = { ...state };
      delete deleteList[action.id];
      return {
        ...deleteList,
      };
    case PostTypes.DELETE_POST:
      let newList = { ...state };
      delete newList[action.id];
      return {
        ...newList,
      };
    // case PostTypes.UPDATE_TOPIC_BY_KEY:
    //   return {
    //     ...state,
    //     [action.key]: action.data,
    //   };
    default:
      return state;
  }
};

const allIds = (state = INITIAL_STATE.allIds, action) => {
  switch (action.type) {
    case PostTypes.FETCH_GET_POST:
      return [];
    case PostTypes.CREATE_POST:
    case PostTypes.UPDATE_POST:
      return action.data ? [...state, action.data.id] : state;
    case PostTypes.UPDATE_POST_SUCCESS:
      return action.data ? [...Object.keys(action.data)] : state;
    case PostTypes.RECEIVED_UPDATE_POST:
      return action.data ? [...state, ...Object.keys(action.data)] : state;
    case PostTypes.RESET_POST:
      return [];
    case PostTypes.DELETE_POST_BY_ID:
      return state.filter((item) => item !== action.id);
    case PostTypes.DELETE_POST:
      return state.filter((item) => item !== action.id);
    default:
      return state;
  }
};

const isFetching = (state = INITIAL_STATE.isFetching, action = {}) => {
  switch (action.type) {
    case PostTypes.FETCH_GET_POST: {
      return true;
    }
    case PostTypes.UPDATE_POST_SUCCESS:
    case PostTypes.UPDATE_POST:
      return false;
    default:
      return state;
  }
};

export const reducer = combineReducers({
  allIds,
  byId,
  paging,
  isFetching,
});
