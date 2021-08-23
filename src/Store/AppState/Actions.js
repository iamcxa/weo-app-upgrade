import { createActions } from 'reduxsauce';

/**
 * We use reduxsauce's `createActions()` helper to easily create redux actions.
 *
 * Keys are action names and values are the list of parameters for the given action.
 *
 * Action names are turned to SNAKE_CASE into the `Types` variable. This can be used
 * to listen to actions:
 *
 * - to trigger reducers to update the state, for example in App/Store/Example/Reducers.js
 * - to trigger sagas, for example in App/Saga/index.js
 *
 * Actions can be dispatched:
 *
 * - in React components using `dispatch(...)`, for example in @App/App.js
 * - in sagas using `yield put(...)`, for example in App/Saga/ExampleSaga.js
 *
 * @see https://github.com/infinitered/reduxsauce#createactions
 */
const { Types, Creators } = createActions({
  // This action triggered when the app stars or it's locale option is changed.
  'app/onLocaleUpdate': ['localization'],

  // This action triggered when the app go to foreground or background.
  'app/onStateUpdate': ['currentState'],

  // This action triggered when the phone network status changes.
  'app/onNetInfoUpdate': ['state'],

  // This action triggered when the app stars, to get current app version.
  'app/onVersionUpdate': ['nativeAppVersion', 'nativeBuildVersion', 'expoVersion', 'platform'],

  // This action triggered when the app orientation changes.
  'app/onOrientationUpdate': ['currentOrientation'],

  // This action triggered when the app requires user to wait.
  'app/onLoading': ['isLoading', 'message', 'options'],

  // This action triggered when the app go to foreground or background.
  onDeviceUpdate: ['device'],
});

export const AppStateTypes = Types;

export default Creators;
