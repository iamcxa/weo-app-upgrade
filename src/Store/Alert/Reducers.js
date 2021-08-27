import { RECEIVED_UPDATE_ALERT } from './Actions';

export const familyDataInitialState = {
  status: 'hide',
  title: '',
  desc: '',
  type: '',
  service: '',
  actionSubject: '',
  actionTime: '',
};

export const ACTION_HANDLERS = {
  [RECEIVED_UPDATE_ALERT]: (state = {}, action) => ({ ...state, ...action.data }),
};

export default function(state = familyDataInitialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
