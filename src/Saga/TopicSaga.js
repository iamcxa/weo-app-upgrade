import { put, call, delay, select } from "redux-saga/effects";
import { Actions } from "react-native-router-flux";
import { Platform } from "react-native";
import { keyBy, isEmpty } from "lodash";

import { getStateKeyByBelongsTo } from "App/Stores/List/Reducers";
import { AppStateActions, TopicActions, CircleActions } from "App/Stores";
import { Handler, Topic } from "App/Apis";
import {
  Logger,
  Dialog,
  User as UserHelper,
  Content as ContentHelper,
  Date as d,
} from "App/Helpers";
import { CIRCLE_TYPE } from "App/Config";

import * as UploadSaga from "./UploadSaga";

// import { updateTopics, resetTopic, updateTopicByKey } from 'App/Stores/List/Actions/topic';

const TAG = "@TopicSaga";

export function* fetchGetTopics({
  sort = "newest",
  curPage = 1,
  perPage,
  circleId,
  belongsTo,
} = {}) {
  // console.log('sort=>', sort);
  // console.log('curPage=>', curPage);
  // console.log('circleId=>', circleId);
  // console.log('belongsTo=>', belongsTo);
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable
  );
  if (isInternetReachable) {
    try {
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.get({
          Authorization: apiToken,
          params: {
            sort,
            perPage,
            curPage,
            circleId,
          },
        }),
        Topic.getTopics()
      );
      // console.log('getTopics res=>', res);

      if (res.success) {
        const data = {
          paging: res.data.paging,
          data: keyBy(res.data.items, (obj) => obj.id),
          belongsTo,
        };
        if (curPage === 1) {
          yield put(TopicActions.replaceTopics(data));
        } else {
          yield put(TopicActions.updateTopics(data));
        }
        return res;
      }
    } catch (error) {
      return Logger.error(TAG, error);
    }
  }
}

export function* fetchPostTopic({ id, data, replySuccess }) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable
  );
  if (isInternetReachable) {
    try {
      yield put(AppStateActions.onLoading(true));
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.post({ Authorization: apiToken, data }),
        Topic.fetchPostTopic({ id })
      );
      if (res.success) {
        console.log("fetchPostTopic res =>", res);
        if (typeof replySuccess === "function") {
          yield call(replySuccess, res);
        }
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}

export function* fetchPostTopicPost({ id, data, replySuccess }) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable
  );
  if (isInternetReachable) {
    try {
      yield put(AppStateActions.onLoading(true));
      const apiToken = yield select((state) => state.user.apiToken);

      if (data.selectedImage) {
        const uploadedImage = yield call(UploadSaga.fetchUploadImage, {
          image: data.selectedImage,
        });
        if (uploadedImage) {
          data.media = [];
          data.media.push(uploadedImage.id);
        }
      }

      const { data: res } = yield call(
        Handler.post({ Authorization: apiToken, data }),
        Topic.fetchPostTopicPost({ id })
      );
      if (res.success) {
        if (typeof replySuccess === "function") {
          yield call(replySuccess, res);
        }
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}

export function* fetchReplyPostPost({ id, data, replySuccess }) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable
  );
  if (isInternetReachable) {
    try {
      yield put(AppStateActions.onLoading(true));
      const apiToken = yield select((state) => state.user.apiToken);

      if (data.selectedImage) {
        const uploadedImage = yield call(UploadSaga.fetchUploadImage, {
          image: data.selectedImage,
        });
        if (uploadedImage) {
          data.media = [];
          data.media.push(uploadedImage.id);
        }
      }

      const { data: res } = yield call(
        Handler.post({ Authorization: apiToken, data }),
        Topic.fetchReplyPostPost({ id })
      );
      if (res.success) {
        if (typeof replySuccess === "function") {
          yield call(replySuccess, res);
        }
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}

export function* fetchAddTopic({
  title,
  content,
  circleId,
  belongsTo,
  selectedImage,
  media = [],
  onSuccess,
} = {}) {
  console.log(
    "fetchAddTopic=>",
    title,
    content,
    circleId,
    belongsTo,
    selectedImage,
    onSuccess
  );
  yield put(AppStateActions.onLoading(true, null, { hide: false }));
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable
  );
  if (isInternetReachable) {
    try {
      if (selectedImage) {
        const uploadedImage = yield call(UploadSaga.fetchUploadImage, {
          image: selectedImage,
        });
        if (uploadedImage) {
          media.push(uploadedImage.id);
        }
      }
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.post({
          Authorization: apiToken,
          data: {
            title: title.trim(),
            content,
            circleId,
            media,
          },
        }),
        Topic.createTopic()
      );
      console.log("fetchAddTopic res=>", res);
      console.log(
        "getStateKeyByBelongsTo(belongsTo)=>",
        getStateKeyByBelongsTo(belongsTo)
      );

      if (res.success) {
        const pData = res.data;
        console.log("pData=>", pData);
        // yield call(requestAnimationFrame, Actions.pop);
        yield call(requestAnimationFrame, () => {
          Actions.pop();
          Actions[`${getStateKeyByBelongsTo(belongsTo)}_postList`]({
            topicId: pData.id,
            title: pData.title,
            content: pData.content,
            avatar: pData.memberAvatar,
            authorName: pData.memberName,
            authorHash: pData.memberHash,
            createdAt: d.humanize(pData.createdAt),
          });
        });
        yield put(
          TopicActions.createTopic({
            belongsTo,
            data: res.data,
          })
        );
        if (typeof onSuccess === "function") {
          yield call(onSuccess, res);
        }
      } else {
        yield call(Dialog.requestFailedSystemAlert);
      }
    } catch (error) {
      Logger.error(TAG, error);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}
