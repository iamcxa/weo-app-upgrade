/**
 * Import Reduces, prepare to export
 */
// --------- Build-in reducer, do not change if not sure --------- //
import { reducer as AppConfigReducer } from './AppConfig/Reducers';
import { reducer as AppStateReducer } from './AppState/Reducers';
import { reducer as ExampleReducer } from './Example/Reducers';

export default {
  // do not modify appState/appRoute
  appConfig: AppConfigReducer,
  appState: AppStateReducer,
  // /**
  //  * Register your reducers here.
  //  * @see https://redux.js.org/api-reference/combinereducers
  //  */
  // // feel free to remove or change this.
  example: ExampleReducer,
};
