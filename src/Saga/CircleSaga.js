import { isEmpty, uniqBy, differenceBy } from 'lodash';
import moment from 'moment';
import { put, call, delay, select } from 'redux-saga/effects';

import { Geolocation, Permission, Dialog, Logger, Fcm } from '~/Helpers';
import { AppStore, CircleActions, AppStateActions, AppPermissionSelectors } from '~/Stores';
import { Handler, Circle } from '~/Apis';
import { translate as t } from '~/Helpers/I18n';
import Config from '~/Config';

const TAG = '@CircleSaga';

export function* getCurrentCircles({
  latitude = 0,
  longitude = 0,
  accuracy,
  speed,
  heading,
  altitude,
  radius,
} = {}) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.get({
          Authorization: apiToken,
          params: {
            latitude,
            longitude,
            accuracy,
            speed,
            heading,
            altitude,
            radius,
          },
        }),
        Circle.getCurrentCircle(),
      );

      if (res.success) {
        const {
          data: { nearCircles },
        } = res;
        // yield put(ClassActions.getClassListSuccess(res.data));
        // console.group('- Create/Update GeoFences');

        const nearFences = nearCircles.map((circle) => ({
          identifier: circle.id.toString(),
          radius: circle.radius < 200 ? 200 : circle.radius,
          latitude: circle.latitude,
          longitude: circle.longitude,
          notifyOnEntry: true,
          notifyOnExit: true,
          notifyOnDwell: true,
          loiteringDelay: 0, // 30 seconds
          extras: {
            ...circle,
            originDistance: circle.distance,
          },
        }));

        const existGeofences = yield call(Geolocation.getGeofences);
        // console.log('existGeofences=>', existGeofences);
        const totalFences = uniqBy(nearFences.concat(existGeofences), 'identifier');
        // console.info('totalFences=>', totalFences);

        const duplicateFences = isEmpty(existGeofences)
          ? []
          : existGeofences.filter((old) =>
              nearFences.map((nf) => nf.identifier === old.identifier),
            );
        // console.info('duplicateFences=>', duplicateFences);

        const newFences = differenceBy(nearFences, duplicateFences, 'identifier');
        // console.info('newFences=>', newFences);
        // console.groupEnd();

        /**
         * 根據 https://github.com/transistorsoft/react-native-background-geolocation/blob/master/docs/README.md#geofenceschange
         * 每次發 API 時應該是不需要清除 geofences，反而應該要讓它盡可能在每次 session 中多存 geofences，
         * 理論上增進反應時間，因為 app 的 geofences 會越來越多，反應越快。
         * 根據實測，geofences 會自動排除重複的 identifier。
         */
        // const outFences = differenceBy(
        //   existGeofences,
        //   duplicateFences,
        //   'identifier'
        // );
        // console.info('outFences=>', outFences);
        // outFences
        //   .forEach((circle) => {
        //     console.warn('remove geofence', circle.identifier);
        //     // remove exist-and-not-common fences
        //     BackgroundGeolocation.removeGeofence(
        //       circle.identifier,
        //       () => {},
        //       (error) => {
        //         console.warn('Failed to remove geofence', error);
        //       }
        //     );
        //   });

        // add new fences
        if (!isEmpty(newFences)) {
          yield call(
            Geolocation.addGeofences,
            newFences,
            () => {
              console.info('Successfully added geofences');
              // console.info(`Successfully added geofences [${newFences.map(e => e.identifier)}]`);
            },
            (error) => {
              console.warn('Failed to add geofence', error);
            },
          );
        }
      }
      console.log('res.data=>', res.data);
      return res.data;
    } catch (error) {
      Logger.error(TAG, error);
      return {
        userCircle: null,
        currentCircle: null,
        insideCircles: [],
        nearCircles: [],
      };
    }
  }
}

export function* getNearCircles(data) {
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      const savedUserCircle = yield select((state) => state.circle.userCircle);
      const { userCircle, currentCircle, insideCircles, nearCircles } = yield call(
        getCurrentCircles,
        data,
      );
      yield put(
        CircleActions.updateCircles({
          currentCircle,
          insideCircles,
          nearCircles,
          userCircle,
        }),
      );
      // 沒有 userCircle 但有 currentCircle 時，直接更新 userCircle
      if (isEmpty(savedUserCircle) && !isEmpty(currentCircle)) {
        yield put(CircleActions.updateUserCircle(currentCircle));
      }

      return {
        currentCircle,
        insideCircles,
        nearCircles,
        userCircle,
      };
    } catch (error) {
      Logger.error(TAG, error);
      return {
        currentCircle: null,
        insideCircles: [],
        nearCircles: [],
        userCircle: null,
      };
    }
  }
}

export function* fetchGetStayCircles({ onSuccess } = {}) {
  const { STAY_CIRCLE_TIME, LEFT_APP_TIMEOUT } = Config;
  yield put(AppStateActions.onLoading(true, null, { hide: true }));
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      // debounce
      // Config.CHECK_CURRENT_CIRCLE_THROTTLE
      yield delay(1000);

      // step 0 - 確認是否符合更新條件
      {
        const routeName = yield select((state) => state.appRoute.routeName);
        const apiToken = yield select((state) => state.user.apiToken);
        const hasHightGeolocationPermission = yield select((state) =>
          AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_HIGH)(state),
        );
        const hasLowGeolocationPermission = yield select((state) =>
          AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_LOW)(state),
        );
        const hasGeolocationPermission =
          hasHightGeolocationPermission || hasLowGeolocationPermission;
        if (
          !apiToken ||
          !hasGeolocationPermission ||
          ['SignUpScreen', 'SplashScreen', 'thereYouAre'].includes(routeName)
        ) {
          __DEV__ &&
            console.log(
              `stop get current circle due to no user or current routeName(${routeName}) is not allowed`,
            );
          return false;
        }
      }

      // step 1 - 取得當前座標與 circles
      const { latitude, longitude, accuracy, speed, heading, altitude, radius } = yield call(
        Geolocation.getCurrentPosition,
      );

      // step 2 - 取得當前 circles，並比較 currentCircle 與 userCircle
      const { currentCircle } = yield call(getNearCircles, {
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        altitude,
        radius,
      });

      const { userCircle, prevUserCircle, insideCircles, leftCircleTime, leftAppTime } =
        yield select((state) => state.circle);

      // 有 leftCircleTime 則表示目前倒數中
      // if (leftCircleTime !== null) {
      //   __DEV__ && console.log('stop get current circle due to isCountingDown');
      //   return false;
      // }

      const isCountingDown = leftCircleTime !== null;
      const isGetInNoCircle = isEmpty(currentCircle) && !isEmpty(userCircle);
      const isStillNoCircle = isEmpty(currentCircle) && isEmpty(userCircle);
      // const nextCircleId = currentCircle ? currentCircle.id : null;
      // const shouldEnterNewCircle = userCircle && userCircle.id !== nextCircleId;
      const shouldEnterNewCircle =
        userCircle && userCircle.id && !insideCircles.map((e) => e.id).includes(userCircle.id);
      // const isBackToLastCircle = prevUserCircle
      //   ? prevUserCircle.id === userCircle.id
      //   : false;

      // 同時沒有 currentCircle/userCircle 則表示 user 到了沒有服務的地區
      if (isStillNoCircle) {
        __DEV__ && console.log('stop get current circle due to isNoCircleArea');
        // if (userCircle === currentCircle) {
        //   return Dialog.noCircleAlert();
        // }
        return false;
      } else if (isGetInNoCircle) {
        return Dialog.leaveCircleAlert({
          onYesPress: () => {
            AppStore.dispatch(CircleActions.updateLeftAppTime(null));
            AppStore.dispatch(CircleActions.updateLeftCircleTime(null));
            AppStore.dispatch(CircleActions.updateUserCircle(null));
          },
          onNoPress: () => {},
          oldCircleName: userCircle.name,
          newCircleName: t('__no_circle_area'),
        });
      } else if (shouldEnterNewCircle) {
        if (!isCountingDown) {
          // 檢查是否已經離開 app 超過一定時間後才返回，如果是則直接進入新 circle

          // leftAppTime 紀錄為 unix 毫秒，需要除以 1000 轉為秒後，
          // 再除以 60 兩次得到小時
          const isLongerEnough = leftAppTime
            ? moment().diff(leftAppTime * 1000, 'seconds') / 60 / 60 > LEFT_APP_TIMEOUT
            : false;

          if (leftAppTime) {
            console.log(
              'expire time(hours)=>',
              moment().diff(leftAppTime * 1000, 'seconds') / 60 / 60,
            );
          }
          console.log('isLongerEnough=>', isLongerEnough);

          if (!isLongerEnough) {
            // 不在倒數中，且進入新 circle 範圍
            const newLeftCircleTime = moment().add(STAY_CIRCLE_TIME, 'seconds').unix();
            console.log('set new time', newLeftCircleTime);
            yield put(CircleActions.updateLeftCircleTime(newLeftCircleTime));

            const isEnableCircleNotification = yield select((state) => state.user.hasCircleNotify);
            if (isEnableCircleNotification && currentCircle) {
              yield (Fcm.presentNotification,
              {
                title: t('__alert_leave_circle'),
                body: t('__alert_leave_circle_content', {
                  oldCircleName: userCircle.name,
                  newCircleName: currentCircle.name,
                }),
                data: { action: 'enter-circle' },
              });
            }

            if (currentCircle) {
              return Dialog.leaveCircleAlert({
                onYesPress: () => {
                  AppStore.dispatch(CircleActions.updateLeftAppTime(null));
                  AppStore.dispatch(CircleActions.updateLeftCircleTime(null));
                  AppStore.dispatch(CircleActions.updateUserCircle(currentCircle));
                },
                onNoPress: () => {},
                oldCircleName: userCircle.name,
                newCircleName: currentCircle.name,
              });
            }
          } else {
            return Dialog.leaveCircleAlert({
              onYesPress: () => {
                AppStore.dispatch(CircleActions.updateLeftAppTime(null));
                AppStore.dispatch(CircleActions.updateLeftCircleTime(null));
                AppStore.dispatch(CircleActions.updateUserCircle(null));
              },
              onNoPress: () => {},
              oldCircleName: userCircle.name,
              newCircleName: t('__no_circle_area'),
            });
          }

          if (isCountingDown) {
            yield put(CircleActions.updateLeftCircleTime(null));
          }
          yield put(CircleActions.updateLeftAppTime(null));
          yield put(CircleActions.updateLeftCircleTime(null));
          yield put(CircleActions.updateUserCircle(currentCircle));
        } else {
          console.log('wont show the leaveCircleAlert because user is dismiss the alert.');
        }
      }
      // else if (isCountingDown && isBackToLastCircle && !isGetInNoCircle) {
      //   // 倒數中回到原 circle ，取消倒數
      //   yield put(CircleActions.updateLeftCircleTime(null));
      // }

      if (typeof onSuccess === 'function') {
        yield call(onSuccess, {
          latitude,
          longitude,
          accuracy,
          speed,
          heading,
          altitude,
          radius,
        });
      }
    } catch (error) {
      Logger.error(TAG, error);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}

export function* fetchPutHomeCircle({ circle, onSuccess }) {
  yield put(AppStateActions.onLoading(true, null, { hide: false }));
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      console.info('fetchPutHomeCircle circle=>', circle);
      console.info('fetchPutHomeCircle onSuccess=>', onSuccess);
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.put({
          Authorization: apiToken,
        }),
        Circle.setHomeCircle({ id: circle.id }),
      );
      console.log('fetchPutHomeCircle res=>', res);
      if (res.success) {
        yield put(CircleActions.updateHomeCircle(circle));
        if (typeof onSuccess === 'function') {
          yield call(onSuccess, { circle });
        }
      }
    } catch (error) {
      Logger.error(TAG, error);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}
