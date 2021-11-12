import React from "react";
import { AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AppStateActions } from "~/Store/Actions";

export function useAppState() {
  const dispatch = useDispatch();

  const currentState = useSelector((state) => state.appState.currentState);

  const handleAppStateChange = async (newState) => {
    if (currentState !== newState) {
      dispatch(AppStateActions["app/onStateUpdate"](newState));
    }
  };

  React.useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => AppState.removeEventListener("change", handleAppStateChange);
  });
  return currentState;
}
