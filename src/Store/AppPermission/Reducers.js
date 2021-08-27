/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { uniq } from 'lodash';
import { createReducer } from 'reduxsauce';
import { INITIAL_STATE } from './InitialState';
import { AppPermissionTypes } from './Actions';

const updateAppPermissionStore = (state, action) => ({
  ...state,
  ...action.data,
});

const resetPermissions = (state, action) => ({
  ...state,
  permissions: [],
});

const removePermission = (state, { permission }) => ({
  ...state,
  permissions: state.permissions.filter((p) => p.type !== permission),
});

const requestPermission = (state, { permission }) => ({
  ...state,
  isRequesting: true,
});

const requestPermissionSuccess = (state, { permission, permissionStatus }) => ({
  ...state,
  permissions: uniq([...state.permissions, { permission, permissionStatus }]),
  error: null,
  isRequesting: false,
});

const requestPermissionFailure = (state, { permission, permissionStatus }) => ({
  ...state,
  error: {
    permission,
    permissionStatus,
  },
  isRequesting: false,
});

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [AppPermissionTypes.UPDATE_APP_PERMISSION_STORE]: updateAppPermissionStore,
  [AppPermissionTypes.RESET_PERMISSIONS]: resetPermissions,
  [AppPermissionTypes.REMOVE_PERMISSION]: removePermission,
  [AppPermissionTypes.REQUEST_PERMISSION]: requestPermission,
  [AppPermissionTypes.REQUEST_PERMISSION_SUCCESS]: requestPermissionSuccess,
  [AppPermissionTypes.REQUEST_PERMISSION_FAILURE]: requestPermissionFailure,
});
