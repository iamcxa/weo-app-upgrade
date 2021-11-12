import NetInfo from "@react-native-community/netinfo";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppStateActions } from "~/Store/Actions";

export function useNetInfo(config) {
  const dispatch = useDispatch();

  const netInfo = useSelector((state) => state.appState.netInfo);

  if (typeof config === "object") {
    NetInfo.configure(config);
  }

  React.useEffect(() => {
    const handleNetInfoChange = (newState) => {
      if (netInfo !== newState) {
        dispatch(AppStateActions["app/onNetInfoUpdate"](newState));
      }
    };
    const unsubscribe = NetInfo.addEventListener(handleNetInfoChange);
    return () => unsubscribe();
  }, [dispatch, netInfo]);

  return netInfo;
}
