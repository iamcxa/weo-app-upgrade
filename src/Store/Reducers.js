import { filterActions } from 'redux-ignore';
import { combineReducers } from 'redux';

/**
 * Import Reduces, prepare to export
 */
// --------- Build-in reducer, do not change if not sure --------- //
import { reducer as AppConfigReducer } from './AppConfig/Reducers';
import { reducer as AppStateReducer } from './AppState/Reducers';
import { reducer as ExampleReducer } from './Example/Reducers';
import { reducer as AppPermissionReducer } from './AppPermission/Reducers';
import { reducer as AppRouteReducer } from './AppRoute/Reducers';
import { reducer as AppApiReducer } from './AppApi/Reducers';
import { reducer as AppAlertReducer } from './AppAlert/Reducers';
import { reducer as CircleReducer } from './Circle/Reducers';
import { reducer as UserReducer } from './User/Reducers';
import { reducer as SearchReducer } from './Search/Reducers';
import { reducer as NotificationReducer } from './Notification/Reducers';
import { reducer as TopicReducer } from './Topic/Reducers';
import { reducer as PostReducer } from './Post/Reducers';
import { reducer as ReplyReducer } from './Reply/Reducers';
import listReducer from './List/Reducers';
import loading from './Loading/Reducers';
import notifyAction from './NotifyAction/Reducers';
import list from './List/list';

export default {
  // // do not modify appState/appRoute
  // appConfig: AppConfigReducer,
  // appState: AppStateReducer,
  // // /**
  // //  * Register your reducers here.
  // //  * @see https://redux.js.org/api-reference/combinereducers
  // //  */
  // // // feel free to remove or change this.
  // example: ExampleReducer,

  // do not modify default appState/appRoute/...
  appPermission: AppPermissionReducer,
  appConfig: AppConfigReducer,
  appRoute: AppRouteReducer,
  appState: AppStateReducer,
  appApi: AppApiReducer,
  alert: AppAlertReducer,

  /**
   * Register your reducers here.
   *
   * @see https://redux.js.org/api-reference/combinereducers
   */
  // feel free to remove or change this.
  example: ExampleReducer,
  circle: CircleReducer,
  user: UserReducer,
  search: SearchReducer,
  notification: NotificationReducer,

  // hereYouAre content
  hereYouAre: filterActions(
    combineReducers({
      topics: TopicReducer,
      posts: PostReducer,
      replies: ReplyReducer,
    }),
    (action) => action.belongsTo === 'HERE_YOU_ARE',
  ),

  // thereYouAre content
  thereYouAre: filterActions(
    combineReducers({
      topics: TopicReducer,
      posts: PostReducer,
      replies: ReplyReducer,
    }),
    (action) => action.belongsTo === 'THERE_YOU_ARE',
  ),

  // peek view content
  peek: filterActions(
    combineReducers({
      topics: TopicReducer,
      posts: PostReducer,
      replies: ReplyReducer,
    }),
    (action) => action.belongsTo === 'PEEK',
  ),

  // hereYouAre: listReducer('HERE_YOU_ARE'),
  // thereYouAre: listReducer('THERE_YOU_ARE'),
  // peek: listReducer('PEEK'),
  browse: listReducer('BROWSE'),
  // alert,
  // circle,
  loading,
  // notification,
  notifyAction,
  list,
};
