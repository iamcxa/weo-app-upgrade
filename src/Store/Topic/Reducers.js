/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *,
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { combineReducers } from 'redux';
import { get } from 'lodash';
import { TopicTypes } from './Actions';
import { AppStore } from 'App/Stores';

const stateKey = {
  HERE_YOU_ARE: 'hereYouAre',
  THERE_YOU_ARE: 'thereYouAre',
  BROWSE: 'browse',
  PEEK: 'peek',
};

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
const paging = createReducer(INITIAL_STATE.paging, {
  [TopicTypes.FETCH_GET_TOPICS_SUCCESS]: (state, action) => ({
    ...state,
    ...action.paging,
  }),
  [TopicTypes.REPLACE_TOPICS]: (state, action) => ({
    ...state,
    ...action.paging,
  }),
  [TopicTypes.UPDATE_TOPICS]: (state, action) => ({
    ...state,
    ...action.paging,
  }),
});

const byId = (state = INITIAL_STATE.byId, action = {}) => {
  switch (action.type) {
    // case TopicTypes.FETCH_GET_THERE_YOU_ARE_TOPICS:
    // case TopicTypes.FETCH_GET_HERE_YOU_ARE_TOPICS:
    // case TopicTypes.FETCH_GET_TOPICS: {
    //   if (action.curPage === 1) return {};
    //   return state;
    // }
    case TopicTypes.CREATE_TOPIC:
      return {
        ...state,
        // ...action.data,
        [action.data.id]: action.data,
      };
    case TopicTypes.REPLACE_TOPICS:
      return {
        ...action.data,
      };
    case TopicTypes.UPDATE_TOPICS:
      return {
        ...state,
        ...action.data,
      };
    case TopicTypes.UPDATE_TOPIC_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case TopicTypes.RESET_TOPIC:
      return {};
    case TopicTypes.DELETE_TOPIC_BY_ID:
      let deleteList = { ...state };
      delete deleteList[action.id];
      return {
        ...deleteList,
      };
    case TopicTypes.DELETE_TOPIC:
      let newList = { ...state };
      delete newList[action.id];
      return {
        ...newList,
      };
    default:
      return state;
  }
};

const allIds = createReducer(INITIAL_STATE.allIds, {
  [TopicTypes.CREATE_TOPIC]: (state, action) => [action.data.id, ...state],

  [TopicTypes.REPLACE_TOPICS]: (state, action) =>
    action.data ? [...Object.keys(action.data)] : state,

  [TopicTypes.UPDATE_TOPICS]: (state, action) =>
    action.data ? [...state, ...Object.keys(action.data)] : state,

  [TopicTypes.UPDATE_TOPIC_BY_KEY]: (state, action) => {
    if (action.sortBy === 'newest') {
      const newTopics = state.filter((e) => e !== action.key);
      return [action.key, ...newTopics];
    }
    return state;
  },

  [TopicTypes.RESET_TOPIC]: (state, action) => [],

  [TopicTypes.DELETE_TOPIC_BY_ID]: (state, action) =>
    state.filter((item) => item !== action.id),
});

const isFetching = (state = INITIAL_STATE.isFetching, action = {}) => {
  switch (action.type) {
    case TopicTypes.FETCH_GET_THERE_YOU_ARE_TOPICS:
    case TopicTypes.FETCH_GET_HERE_YOU_ARE_TOPICS:
    case TopicTypes.FETCH_GET_TOPICS: {
      return true;
    }
    case TopicTypes.CREATE_TOPIC:
    case TopicTypes.REPLACE_TOPICS:
    case TopicTypes.UPDATE_TOPICS:
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
