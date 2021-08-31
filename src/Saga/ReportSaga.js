import { Alert } from 'react-native';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { call, put, select } from 'redux-saga/effects';

import { Handler, Post, Report } from '~/Apis';
import { AppStateActions, TopicActions, PostActions, AppAlertActions } from '~/Store';
import { translate as t } from '~/Helpers/I18n';

export function* fetchPostHidePost({ id, mode, belongsTo }) {
  try {
    yield put(AppStateActions.onLoading(true));
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.post({ Authorization: apiToken }),
      Post.hidePost({ id }),
    );
    if (res.success) {
      if (mode === 'TOPIC') {
        yield put(TopicActions.deleteTopicById({ belongsTo, id }));
        Actions.pop();
      } else {
        yield put(PostActions.deletePostById({ belongsTo, id }));
      }
    }
  } catch (err) {
    Alert.alert(t('__alert_request_failed_title'), t('__alert_request_failed_content'));
    console.log('err', err);
  } finally {
    yield put(AppStateActions.onLoading(false));
  }
}

export function* fetchReportPost({ postType, id, data }) {
  try {
    yield put(AppStateActions.onLoading(true));
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.post({ Authorization: apiToken, data }),
      Report.fetchReportPost({ id, type: postType.toLowerCase() }),
    );
    if (res.success) {
      yield put(
        AppAlertActions.showAlert({
          title: t('report_success'),
          type: 'success',
        }),
      );
      Actions.pop();
    }
  } catch (err) {
    Alert.alert(t('__alert_request_failed_title'), t('__alert_request_failed_content'));
    console.log('err', err);
  } finally {
    yield put(AppStateActions.onLoading(false));
  }
}
