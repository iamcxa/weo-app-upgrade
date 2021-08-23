import * as ScreenOrientation from 'expo-screen-orientation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppStateActions } from '~/Store/Actions';

export function useScreenOrientation(lock) {
  const [lockError, setLockError] = React.useState();

  const dispatch = useDispatch();

  const { currentOrientation } = useSelector((state) => state.appState);

  const getOrientation = React.useCallback(
    () =>
      ScreenOrientation.getOrientationAsync().then((info) => {
        if (currentOrientation !== info) {
          dispatch(AppStateActions['app/onOrientationUpdate'](info));
        }
        return info;
      }),
    [currentOrientation, dispatch],
  );

  React.useEffect(() => {
    if (lock && lock !== ScreenOrientation.OrientationLock.DEFAULT) {
      ScreenOrientation.lockAsync(lock)
        .then(() => dispatch(AppStateActions['app/onOrientationUpdate'](lock)))
        .catch(setLockError);
    } else {
      ScreenOrientation.unlockAsync();
      getOrientation();
    }

    const handleOrientationChange = (event) => {
      console.log('event=>', event);
      console.log('currentOrientation=>', currentOrientation);
      if (currentOrientation !== event) {
        dispatch(AppStateActions['app/onOrientationUpdate'](event));
      }
    };

    const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientationChange);

    return () => {
      subscription.remove();
      ScreenOrientation.unlockAsync();
    };
  }, [currentOrientation, dispatch, getOrientation, lock]);

  return [currentOrientation, lockError];
}
