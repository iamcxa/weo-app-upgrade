import { put, call, select } from 'redux-saga/effects';
import { isEmpty } from 'lodash';

import { AppStateActions, SearchActions } from '~/Stores';
import { Handler, Search } from '~/Apis';
import { Logger } from '~/Helpers';

const TAG = '@SearchSaga';

export function* fetchGetSearchResult({ circleId, belongsTo, keyword, curPage } = {}) {
  yield put(AppStateActions.onLoading(true, null, { hide: true }));
  // yield put(AppStateActions.onLoading(false, 'vote', { hide: true, message: '' }));
  try {
    if (!circleId) {
      if (belongsTo === 'HERE_YOU_ARE') {
        ({ id: circleId } = yield select((state) => state.circle.userCircle));
      } else {
        ({ id: circleId } = yield select((state) => state.circle.homeCircle));
      }
    }
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.get({
        Authorization: apiToken,
        params: {
          circleId,
          belongsTo,
          keyword,
          curPage,
        },
      }),
      Search.searchTopicAndPosts(),
    );

    if (res.success) {
      yield put(
        SearchActions.updateSearchStore({
          circleId: res.data.circleId,
          searchResult: res.data.items,
          paging: res.data.paging,
        }),
      );
    }
  } catch (error) {
    Logger.error(TAG, error);
  } finally {
    yield put(AppStateActions.onLoading(false));
  }
}

export function* fetchGetPopularKeywords({ circleId, belongsTo } = {}) {
  yield put(AppStateActions.onLoading(false, null, { hide: true }));
  try {
    if (!circleId) {
      if (belongsTo === 'HERE_YOU_ARE') {
        ({ id: circleId } = yield select((state) => state.circle.userCircle));
      } else {
        ({ id: circleId } = yield select((state) => state.circle.homeCircle));
      }
    }
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.get({
        Authorization: apiToken,
        params: { circleId },
      }),
      Search.getPoplarKeyWords(),
    );

    if (res.success) {
      yield put(
        SearchActions.updateSearchStore({
          poplarKeyWords: res.data.items,
          circleId,
        }),
      );
    }
  } catch (error) {
    Logger.error(TAG, error);
  } finally {
    yield put(AppStateActions.onLoading(false));
  }
}
