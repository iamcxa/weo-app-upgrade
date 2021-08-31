import { put, call, select } from 'redux-saga/effects';
import { isEmpty } from 'lodash';

import { AppStateActions, TopicActions, PostActions, ReplyActions } from '~/Store';
import { Handler, Vote } from '~/Apis';
import { Logger } from '~/Helper';

const TAG = '@VoteSaga';
const LIKE = 'LIKE';
const DISLIKE = 'DISLIKE';
const TARGET_TYPE = {
  TOPIC: 'topics',
  POST: 'posts',
  REPLY: 'replies',
  HERE_YOU_ARE: 'hereYouAre',
  THERE_YOU_ARE: 'thereYouAre',
};

function* updateVoteData(contentType, data) {
  if (contentType === 'TOPIC') {
    yield put(TopicActions.updateTopicByKey(data));
  }
  if (contentType === 'POST') {
    yield put(PostActions.updatePostByKey(data));
  }
  if (contentType === 'REPLY') {
    yield put(ReplyActions.updateReplyByKey(data));
  }
}

export function* handleVote({ contentType, voteType, belongsTo, id } = {}) {
  // yield put(AppStateActions.onLoading(false, null, { hide: true }));
  // yield put(AppStateActions.onLoading(false, 'vote', { hide: true, message: '' }));
  const contentById = yield select(
    (state) => state[TARGET_TYPE[belongsTo]][TARGET_TYPE[contentType]].byId,
  );
  const { vote: sourceVoteData = {} } = contentById[id];
  try {
    if (isEmpty(sourceVoteData)) {
      throw Error(`handle vote error: id(${id}) or contentType(${contentType}) not exists.`);
    }

    let apiUrl = '',
      vote = {};

    if (voteType === LIKE) {
      if (sourceVoteData.current === null) {
        vote = {
          like: sourceVoteData.like + 1,
          current: LIKE,
        };
        apiUrl = Vote.like({ type: contentType, id });
      } else if (sourceVoteData.current === LIKE) {
        vote = {
          like: sourceVoteData.like >= 1 ? sourceVoteData.like - 1 : sourceVoteData.like,
          current: null,
        };
        apiUrl = Vote.cancelVote({ type: contentType, id });
      } else if (sourceVoteData.current === DISLIKE) {
        vote = {
          dislike:
            sourceVoteData.dislike >= 1 ? sourceVoteData.dislike - 1 : sourceVoteData.dislike,
          like: sourceVoteData.like + 1,
          current: LIKE,
        };
        apiUrl = Vote.like({ type: contentType, id });
      }
    } else if (voteType === DISLIKE) {
      if (sourceVoteData.current === null) {
        vote = {
          dislike: sourceVoteData.dislike + 1,
          current: DISLIKE,
        };
        apiUrl = Vote.dislike({ type: contentType, id });
      } else if (sourceVoteData.current === LIKE) {
        vote = {
          dislike: sourceVoteData.dislike + 1,
          like: sourceVoteData.like >= 1 ? sourceVoteData.like - 1 : sourceVoteData.like,
          current: DISLIKE,
        };
        apiUrl = Vote.dislike({ type: contentType, id });
      } else if (sourceVoteData.current === DISLIKE) {
        vote = {
          dislike:
            sourceVoteData.dislike >= 1 ? sourceVoteData.dislike - 1 : sourceVoteData.dislike,
          current: null,
        };
        apiUrl = Vote.cancelVote({ type: contentType, id });
      }
    }
    const updatedData = {
      data: {
        ...contentById[id],
        vote: { ...contentById[id].vote, ...vote },
      },
      belongsTo,
      key: id,
    };
    yield call(updateVoteData, contentType, updatedData);

    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.post({
        Authorization: apiToken,
      }),
      apiUrl,
    );

    if (!res.success) {
      yield call(updateVoteData, contentType, contentById[id]);
    }
  } catch (error) {
    Logger.error(TAG, error);
    yield call(updateVoteData, contentType, contentById[id]);
  } finally {
    // yield put(AppStateActions.onLoading(false));
  }
}
