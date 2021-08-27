/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  fcmToken: null,
  apiToken: null,
  expiredAt: null,
  expiredTime: null,
  lastCreateTopicAt: null,
  lastCreatePostAt: null,
  profile: {
    Authorization: '',
    isDeviceRegistered: true,
    id: 0,
    username: '',
    memberId: '',
    nickname: '',
    hash: '',
    avatarUrl: '',
    avatarId: '',
    avatarKey: '',
    hasCircleNotify: true,
    hasTopicNotify: true,
    hasPostNotify: true,
    hasReplyNotify: true,
  },
  config: {
    hasCircleNotify: true,
    hasTopicNotify: true,
    hasPostNotify: true,
    hasReplyNotify: true,
  },
};
