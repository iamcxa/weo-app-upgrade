import { createActions } from "reduxsauce";

/**
 * We use reduxsauce's `createActions()` helper to easily create redux actions.
 *
 * Keys are action names and values are the list of parameters for the given action.
 *
 * Action names are turned to SNAKE_CASE into the `Types` variable. This can be used
 * to listen to actions:
 *
 * - to trigger reducers to update the state, for example in App/Stores/Example/Reducers.js
 * - to trigger sagas, for example in App/Sagas/index.js
 *
 * Actions can be dispatched:
 *
 * - in React components using `dispatch(...)`, for example in @App/App.js
 * - in sagas using `yield put(...)`, for example in App/Sagas/ExampleSaga.js
 *
 * @see https://github.com/infinitered/reduxsauce#createactions
 */
const { Types, Creators } = createActions({
  updateUserStore: ["data"],
  updateUserConfig: ["data"],
  updateUserProfile: ["data"],
  cleanUser: null,

  updateTooltipVisibility: ["sceneKey", "key", "value"],

  fetchPostLogout: ["data"],

  fetchPostAutoSignUp: {
    forceRequest: false,
    fcmToken: null,
    onSuccess: null,
  },

  fetchPostSignUp: {
    nickname: "",
    avatarKey: "",
    identifier: "",
    deviceInfo: {},
  },

  fetchPutUserProfile: {
    nickname: "",
    avatarKey: "",
  },

  fetchPutUserNotifyConfig: {
    hasCircleNotify: true,
    hasTopicNotify: true,
    hasPostNotify: true,
    hasReplyNotify: true,
  },
});

export const UserTypes = Types;
export default Creators;