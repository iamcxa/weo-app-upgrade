import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'react-native';

import { AppStateActions } from '~/Store';

const StateMonitor = () => {
  const dispatch = useDispatch();

  const latestAppState = React.useRef(AppState.currentState);

  const { currentState } = useSelector((state) => state.appState.currentState);

  const handleAppStateChange = async (newState) => {
    console.log('StateMonitor: currentState=>', currentState);
    console.log('StateMonitor: latestAppState=>', latestAppState);
    console.log('StateMonitor: newState=>', newState);

    if (currentState !== newState) {
      dispatch(AppStateActions['app/onStateUpdate'](newState));
    }
  };

  React.useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  });
  return null;
};

export default StateMonitor;
