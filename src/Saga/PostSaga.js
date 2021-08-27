import _ from 'lodash';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { call, put, select } from 'redux-saga/effects';

import { Handler, Post } from '~/Apis';
import { AppStateActions, TopicActions, PostActions } from '~/Stores';
import { translate as t } from '~/Helpers/I18n';
import { deletePostById } from '~/Stores/List/Actions/post';

export function* fetchGetPost({ topicId, curPage, belongsTo, handleNextPage }) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      yield put(AppStateActions.onLoading(true));
      const apiToken = yield select((state) => state.user.apiToken);

      const { data: res } = yield call(
        Handler.get({
          Authorization: apiToken,
          params: { perPage: 100, curPage: 1 },
        }),
        Post.getTopicPosts({ topicId }),
      );
      if (res.success) {
        const list = res.data.items;
        const posts = _.keyBy(list, (obj) => obj.id);
        yield put(
          PostActions.updatePostSuccess({
            belongsTo,
            data: posts,
            paging: res.data.paging,
          }),
        );
        const topic = res.data.parent;
        if (topic) {
          yield put(
            TopicActions.updateTopicByKey({
              belongsTo,
              key: topic.id,
              data: topic,
            }),
          );
        }
        if (typeof handleNextPage === 'function') {
          if (curPage < res.data.paging.lastPage) {
            yield call(handleNextPage);
          }
        }
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}

export function* fetchPostHidePost({ id, type, belongsTo }) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      yield put(AppStateActions.onLoading(true));
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.post({ Authorization: apiToken }),
        Post.hidePost({ id }),
      );
      if (res.success) {
        if (type === 'TOPIC') {
          yield put(TopicActions.deleteTopicById({ target: belongsTo, id }));
          yield call(Actions.pop);
        } else {
          yield call(deletePostById, { target: belongsTo, id });
        }
      }
    } catch (err) {
      Alert.alert(t('__alert_request_failed_title'), t('__alert_request_failed_content'));
      console.log('err', err);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}

export function* fetchGetSinglePost({ id, getSuccess }) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      yield put(AppStateActions.onLoading(true));
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.get({ Authorization: apiToken }),
        Post.fetchGetSinglePost({ id }),
      );
      if (res.success) {
        if (typeof getSuccess === 'function') {
          yield call(getSuccess, res.data);
        }
      }
    } catch (err) {
      Alert.alert(t('__alert_api_error_title'), t('__alert_api_error_desc'));
      console.log('err', err);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}
