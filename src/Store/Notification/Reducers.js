/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { combineReducers } from 'redux';
import { NotificationTypes } from './Actions';

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
const paging = createReducer(INITIAL_STATE.paging, {
  [NotificationTypes.REPLACE_NOTIFICATIONS]: (state, action) => ({
    ...state,
    ...action.paging,
  }),
  [NotificationTypes.UPDATE_NOTIFICATIONS]: (state, action) => ({
    ...state,
    ...action.paging,
  }),
});

const byId = (state = INITIAL_STATE.byId, action = {}) => {
  switch (action.type) {
    case NotificationTypes.REPLACE_NOTIFICATIONS:
      return {
        ...action.data,
      };
    case NotificationTypes.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        ...action.data,
      };
    case NotificationTypes.UPDATE_NOTIFICATION_BY_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case NotificationTypes.RESET_NOTIFICATION:
      return {};
    default:
      return state;
  }
};

const allIds = (state = INITIAL_STATE.allIds, action = {}) => {
  switch (action.type) {
    case NotificationTypes.REPLACE_NOTIFICATIONS:
      return action.data ? [...Object.keys(action.data)] : state;
    case NotificationTypes.UPDATE_NOTIFICATIONS:
      return action.data ? [...state, ...Object.keys(action.data)] : state;
    case NotificationTypes.RESET_NOTIFICATION:
      return [];
    default:
      return state;
  }
};

const isFetching = (state = INITIAL_STATE.isFetching, action = {}) => {
  switch (action.type) {
    case NotificationTypes.FETCH_GET_NOTIFICATIONS: {
      return true;
    }
    case NotificationTypes.REPLACE_NOTIFICATIONS:
    case NotificationTypes.UPDATE_NOTIFICATIONS:
      return false;
    default:
      return state;
  }
};

const hasUnRead = (state = INITIAL_STATE.hasUnRead, action = {}) => {
  switch (action.type) {
    case NotificationTypes.REPLACE_NOTIFICATIONS:
    case NotificationTypes.UPDATE_NOTIFICATIONS:
      return Object.values(action.data).some((e) => !e.isRead);
    default:
      return state;
  }
};

export const reducer = combineReducers({
  allIds,
  byId,
  paging,
  hasUnRead,
  isFetching,
});
