// import { ActionConst } from 'react-native-router-flux';
import { takeLatest, takeEvery, all } from 'redux-saga/effects';

import { ExampleTypes } from '~/Store/Example/Actions';
import * as Example from './ExampleSaga';

// import { AppPermissionTypes } from '~/Store/AppPermission/Actions';
// import { AppConfigTypes } from '~/Store/AppConfig/Actions';
// import { NotificationTypes } from '~/Store/Notification/Actions';
// import { CircleTypes } from '~/Store/Circle/Actions';
// import { UserTypes } from '~/Store/User/Actions';
// import { SearchTypes } from '~/Store/Search/Actions';
// import { TopicTypes } from '~/Store/Topic/Actions';
// import { VoteTypes } from '~/Store/Vote/Actions';
// import { PostTypes } from '~/Store/Post/Actions';
// import { ReportTypes } from '~/Store/Report/Actions';
// import { FirebaseTypes } from 'App/Stores/Firebase/Actions';

// import * as AppPermissionSaga from './AppPermissionSaga';
// import * as AppRouteSaga from './AppRouteSaga';
// import * as CircleSaga from './CircleSaga';
// import * as UserSaga from './UserSaga';
// import * as FirebaseSaga from './FirebaseSaga';
// import * as TopicSaga from './TopicSaga';
// import * as VoteSaga from './VoteSaga';
// import * as PostSaga from './PostSaga';
// import * as ReportSaga from './ReportSaga';
// import * as SearchSaga from './SearchSaga';
// import * as WeoConfigSaga from './WeoConfigSaga';
// import * as NotificationSaga from './NotificationSaga';

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    // takeLatest(StartupTypes.STARTUP, startup),
    // Call `fetchUser()` when a `FETCH_USER` action is triggered
    takeLatest(ExampleTypes.FETCH_USER, Example.fetchUser),
    takeLatest(ExampleTypes.CREATE_POST, Example.createPost),

    // App Route Watcher
    // takeLatest(ActionConst.FOCUS, AppRouteSaga.pushｓActionWatcher),

    // // App Permission Watcher
    // takeLatest(AppPermissionTypes.CHECK_PERMISSIONS, AppPermissionSaga.checkPermissions),
    // takeLatest(AppPermissionTypes.REQUEST_PERMISSION, AppPermissionSaga.requestPermission),
    //
    // // FCM Watchers
    // // takeLatest(FirebaseTypes.GET_FCM_TOKEN, FirebaseSaga.getFcmToken),
    //
    // // App Config Watchers
    // takeLatest(AppConfigTypes.FETCH_GET_WEO_CONFIG, WeoConfigSaga.fetchGetWeoConfig),
    //
    // // Topic Watchers
    // takeLatest(TopicTypes.FETCH_GET_TOPICS, TopicSaga.fetchGetTopics),
    // takeLatest(TopicTypes.FETCH_GET_HERE_YOU_ARE_TOPICS, TopicSaga.fetchGetTopics),
    // takeLatest(TopicTypes.FETCH_GET_THERE_YOU_ARE_TOPICS, TopicSaga.fetchGetTopics),
    // takeLatest(TopicTypes.FETCH_ADD_TOPIC, TopicSaga.fetchAddTopic),
    //
    // // Post Watchers
    // takeLatest(TopicTypes.FETCH_POST_TOPIC, TopicSaga.fetchPostTopic),
    // takeLatest(TopicTypes.FETCH_POST_TOPIC_POST, TopicSaga.fetchPostTopicPost),
    // takeLatest(TopicTypes.FETCH_REPLY_POST_POST, TopicSaga.fetchReplyPostPost),
    //
    // // Vote Watchers
    // takeLatest(VoteTypes.HANDLE_VOTE, VoteSaga.handleVote),
    //
    // // Notification Watchers
    // takeLatest(NotificationTypes.FETCH_GET_NOTIFICATIONS, NotificationSaga.fetchGetNotifications),
    // takeLatest(
    //   NotificationTypes.FETCH_SET_NOTIFICATION_READ,
    //   NotificationSaga.fetchSetNotificationRead,
    // ),
    //
    // // Search
    // takeLatest(SearchTypes.FETCH_GET_POPULAR_KEYWORDS, SearchSaga.fetchGetPopularKeywords),
    // takeLatest(SearchTypes.FETCH_GET_SEARCH_RESULT, SearchSaga.fetchGetSearchResult),
    //
    // // Circle Watchers
    // takeLatest(CircleTypes.FETCH_PUT_HOME_CIRCLE, CircleSaga.fetchPutHomeCircle),
    // takeLatest(CircleTypes.FETCH_GET_STAY_CIRCLES, CircleSaga.fetchGetStayCircles),
    //
    // // User Watchers
    // takeLatest(UserTypes.FETCH_PUT_USER_PROFILE, UserSaga.fetchPutUserProfile),
    // takeLatest(UserTypes.FETCH_POST_LOGOUT, UserSaga.fetchPostLogout),
    // takeLatest(UserTypes.FETCH_POST_SIGN_UP, UserSaga.fetchPostSignUp),
    // takeLatest(UserTypes.FETCH_POST_AUTO_SIGN_UP, UserSaga.fetchPostAutoSignUp),
    //
    // // Post
    // takeLatest(PostTypes.FETCH_GET_POST, PostSaga.fetchGetPost),
    // takeLatest(PostTypes.FETCH_GET_SINGLE_POST, PostSaga.fetchGetSinglePost),
    // takeLatest(UserTypes.FETCH_PUT_USER_NOTIFY_CONFIG, UserSaga.fetchPutUserNotifyConfig),
    //
    // // Report
    // takeLatest(ReportTypes.HIDE_POST_BY_ID, ReportSaga.fetchPostHidePost),
    // takeLatest(ReportTypes.FETCH_REPORT_POST, ReportSaga.fetchReportPost),
  ]);
}
