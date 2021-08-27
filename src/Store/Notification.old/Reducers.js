import {
  GET_NOTIFICATION_LIST,
  RESET_NOTIFICATION_LIST,
  UPDATE_NOTIFICATION_BY_KEY,
} from './Actions';

export const initialState = {};

export const ACTION_HANDLERS = {
  [RESET_NOTIFICATION_LIST]: () => ({}),
  [GET_NOTIFICATION_LIST]: (state = {}, action) => ({
    ...state,
    ...action.data,
  }),
  [UPDATE_NOTIFICATION_BY_KEY]: (state = {}, action) => {
    const newState = { ...state };
    newState[action.key] = {
      ...newState[action.key],
      ...action.data,
    };
    return newState;
  },
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
