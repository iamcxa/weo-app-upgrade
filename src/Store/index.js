import { combineReducers } from 'redux';
import rootSaga from '../Saga';

import { reducer as AppAlertReducer } from './AppAlert/Reducers';

/**
 * Import Reduces, prepare to export
 */
// --------- Build-in reducer, do not change if not sure --------- //
import { reducer as AppConfigReducer } from './AppConfig/Reducers';

import { reducer as AppStateReducer } from './AppState/Reducers';
import configureStore from './CreateStore';
// --------- Build-in reducer, do not change if not sure --------- //
import { reducer as ExampleReducer } from './Example/Reducers';

/**
 * Export reducers, easy to use
 */
// --------- Build-in reducer, do not change if not sure --------- //

export { default as AppAlertActions } from './AppAlert/Actions';
export { default as AppStateActions } from './AppState/Actions';
export { default as AppConfigActions } from './AppConfig/Actions';
// --------- Build-in reducer, do not change if not sure --------- //

export { default as ExampleActions } from './Example/Actions';
export { default as ExampleSelectors } from './Example/Selectors';

/**
 * Export default reducers
 */
const createStore = () => {
  const rootReducer = combineReducers({
    // do not modify appState/appRoute
    appConfig: AppConfigReducer,
    appState: AppStateReducer,
    appAlert: AppAlertReducer,
    // /**
    //  * Register your reducers here.
    //  * @see https://redux.js.org/api-reference/combinereducers
    //  */
    // // feel free to remove or change this.
    example: ExampleReducer,
  });

  return configureStore(rootReducer, rootSaga);
};

export const { store: AppStore, persistor } = createStore();
