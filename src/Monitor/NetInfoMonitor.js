import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { AppStateActions } from '~/Store';

export default () => {
  const dispatch = useDispatch();

  const netInfo = useSelector((state) => state.appState.netInfo);

  const handleNetInfoChange = async (newState) => {
    if (netInfo !== newState) {
      dispatch(AppStateActions['app/onNetInfoUpdate'](newState));
    }
  };

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleNetInfoChange);
    return () => unsubscribe();
  });

  return null;
};
