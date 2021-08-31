import {
  RECEIVED_NOTIFY_ACTION,
  RESET_NOTIFY_ACTION,
} from '~/Store/NotifyAction/Actions';

export const initialState = {
  isAction: true,
  type: '',
  service: '',
};

export const ACTION_HANDLERS = {
  [RECEIVED_NOTIFY_ACTION]: (state = {}, action) => ({ ...state, ...action.data }),
  [RESET_NOTIFY_ACTION]: (state = {}, action) => ({
    isAction: true,
    type: '',
    service: '',
  }),
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
