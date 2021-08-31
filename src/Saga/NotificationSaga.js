import { put, call, select } from 'redux-saga/effects';
import { keyBy } from 'lodash';

import { NotificationActions } from '~/Stores';
import { Handler, Notification } from '~/Apis';
import { Logger } from '~/Helper';

const TAG = '@NotificationSaga';

export function* fetchGetNotifications({ sort, curPage = 1, perPage } = {}) {
  try {
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.get({
        Authorization: apiToken,
        params: {
          sort: 'DESC',
          perPage: 10,
          curPage,
        },
      }),
      Notification.getNotifications(),
    );
    // console.log('fetchGetNotifications res=>', res);
    if (res.success) {
      const data = {
        paging: res.data.paging,
        data: keyBy(res.data.items, (obj) => obj.id),
      };
      if (curPage === 1) {
        yield put(NotificationActions.replaceNotifications(data));
      } else {
        yield put(NotificationActions.updateNotifications(data));
      }
    } else {
    }
  } catch (error) {
    Logger.error(TAG, error);
  }
}

export function* fetchSetNotificationRead({ id }) {
  try {
    // console.log('id=>', id);
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.post({
        Authorization: apiToken,
      }),
      Notification.setNotificationRead({ id }),
    );
    // console.log('fetchGetNotifications res=>', res);
  } catch (error) {
    Logger.error(TAG, error);

    const byId = yield select((state) => state.notification.byId);
    yield put(
      NotificationActions.updateNotificationByKey({
        id,
        data: {
          ...byId[id],
          isRead: false,
        },
      }),
    );
  }
}
