import React from "react";

import { User } from "~/Api";
import { ApiPanel } from "~/Component";
import { UserActions } from "~/Store/Actions";

const MemberApiSection = ({ dispatch, navigation }) => {
  const list = Object.keys(User).map((e) => ({ name: e }));
  return (
    <>
      <ApiPanel
        title="User API"
        list={list}
        dispatch={dispatch}
        action={{
          signUp: UserActions.fetchPostAutoSignUp,
          logout: UserActions.fetchPostLogout,
          updateConfig: UserActions.fetchPutUserProfile,
          updateProfile: UserActions.fetchPutUserNotifyConfig,
        }}
        payload={{
          signUp: { forceRequest: true },
          logout: { forceRequest: true },
          updateConfig: { forceRequest: true },
          updateProfile: { forceRequest: true },
        }}
      />
    </>
  );
};

export default MemberApiSection;
