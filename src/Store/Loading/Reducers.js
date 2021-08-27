import { RECEIVED_LOADING, ON_LIST_BACK_TOP } from './Actions';

export const initialState = {
  isOpen: false,
  isBackToTop: false,
};

export const ACTION_HANDLERS = {
  [RECEIVED_LOADING]: (state = {}, action) => ({
    ...state,
    isOpen: action.bool,
  }),
  [ON_LIST_BACK_TOP]: (state = {}, action) => ({
    ...state,
    isBackToTop: action.bool,
  }),
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
