import { ON_LIST_UPDATE } from './Actions/list';

export const initialState = {
  isBackToTop: false,
  isRefresh: false,
};

export const ACTION_HANDLERS = {
  [ON_LIST_UPDATE]: (state = {}, action) => ({
    ...state,
    ...action.data,
  }),
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
