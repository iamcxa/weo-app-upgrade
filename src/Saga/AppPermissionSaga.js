import { Alert, AppState } from 'react-native';
import { translate as t } from 'App/Helpers/I18n';
import { put, call, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import Permissions, { RESULTS } from 'react-native-permissions';

import { AppPermissionActions } from 'App/Stores';
import { Logger } from 'App/Helpers';

export function* checkPermissions({ permissions, onSuccess, onFailure }) {
  console.log('permissions=>', permissions);

  // ensure that "permissions" is an array.
  if (permissions instanceof Array) {
    // try to iterate the array to get permission to check.
    for (const eachPermission of permissions) {
      if (eachPermission) {
        const permissionStatus = yield call(Permissions.check, eachPermission);
        __DEV__ &&
          console.log('checkPermissions permissionStatus=>', eachPermission, permissionStatus);

        // if returns "granted" then record it to the store.
        if (permissionStatus === RESULTS.GRANTED) {
          yield put(
            AppPermissionActions.requestPermissionSuccess(eachPermission, permissionStatus),
          );
          if (typeof onSuccess === 'function') {
            yield call(onSuccess);
          }
        } else {
          yield put(
            AppPermissionActions.requestPermissionFailure(eachPermission, permissionStatus),
          );
          if (typeof onFailure === 'function') {
            yield call(onFailure);
          }
        }
      }
    }
  }
}

// Dialog.requestPermissionAlert({
//   title: t('permission_request_title'),
//   description: `${t('permission_request_desc_body_sensor')}`,
//   onPressOk: () =>
//   onPressCancel: false,
// });

export function* requestPermission({
  permission,
  requestTitle,
  requestDescription,
  requestFromSystemTitle,
  requestFromSystemDescription,
  shouldForceGetPermission = false,
  onSuccess,
  onFailure,
}) {
  const appStateChannel = eventChannel((emit) => {
    AppState.addEventListener('change', (state) => emit(state));

    return () => {
      AppState.removeEventListener('change');
    };
  });

  // console.log('requestPermission RESULTS=>', RESULTS);
  // console.log('requestPermission permission=>', permission);
  try {
    let permissionStatus = yield call(Permissions.check, permission);
    console.log('requestPermission permissionStatus=>', permissionStatus);

    // 如果成功，跳過
    if (permissionStatus === RESULTS.GRANTED) {
      yield put(AppPermissionActions.requestPermissionSuccess(permission, permissionStatus));
      if (typeof onSuccess === 'function') {
        yield call(onSuccess);
      }
      return true;
    }

    // 如果不支援
    else if (permissionStatus === RESULTS.UNAVAILABLE) {
      yield call(
        Alert.alert,
        t('permission_unsupported_title'),
        t('permission_unsupported_content', { permission }),
        {
          cancelable: false,
        },
      );
      if (typeof onFailure === 'function') {
        yield call(onFailure);
      }
      return false;
    }

    // 如果需要到系統設定
    else if (permissionStatus === RESULTS.BLOCKED) {
      // iOS only have once chance to show the permission dialog
      // if user had denied permission, you can only request him setting manually enable from setting
      const buttons = [
        {
          text: t('__open_system_setting'),
          onPress: Permissions.openSettings,
        },
      ];

      // 如果強制必須給予權限
      if (!shouldForceGetPermission) {
        buttons.push({
          style: 'cancel',
          text: t('__cancel'),
        });
      }

      yield call(Alert.alert, requestFromSystemTitle, requestFromSystemDescription, buttons, {
        cancelable: false,
      });

      if (shouldForceGetPermission) {
        while (true) {
          const appState = yield take(appStateChannel);

          console.log('while delaying...appState=>', appState);

          if (appState === 'active') {
            const result = yield call(Permissions.check, permission);
            console.log('while delaying...permission=>', result);
            if (result !== RESULTS.GRANTED) {
              yield put(
                AppPermissionActions.requestPermission(
                  permission,
                  requestTitle,
                  requestDescription,
                  requestFromSystemTitle,
                  requestFromSystemDescription,
                  shouldForceGetPermission,
                ),
              );
            }
            if (result === RESULTS.GRANTED) {
              yield put(AppPermissionActions.requestPermissionSuccess(permission, result));
              if (typeof onSuccess === 'function') {
                yield call(onSuccess);
              }
              return true;
            }
            break;
          }
        }
      }
    }

    // 如果沒有要求過權限
    else if (permissionStatus === RESULTS.DENIED) {
      console.log('requestTitle=>', requestTitle);
      console.log('requestDescription=>', requestDescription);
      if (requestTitle && requestDescription) {
        const alertChannel = eventChannel((emit) => {
          Alert.alert(
            requestTitle,
            requestDescription,
            [
              {
                text: t('__ok'),
                onPress: () => emit('ok'),
              },
            ],
            {
              cancelable: false,
            },
          );

          return () => {};
        });

        while (true) {
          const alert = yield take(alertChannel);
          // console.log('alert=>', alert);
          if (alert === 'ok') {
            break;
          }
        }
      }

      // if have no permission, request it
      permissionStatus = yield call(Permissions.request, permission);
      if (permissionStatus === RESULTS.GRANTED) {
        yield put(AppPermissionActions.requestPermissionSuccess(permission, permissionStatus));
        if (typeof onSuccess === 'function') {
          yield call(onSuccess);
        }
        return true;
      } else {
        if (shouldForceGetPermission) {
          yield put(
            AppPermissionActions.requestPermission({
              permission,
              requestTitle,
              requestDescription,
              requestFromSystemTitle,
              requestFromSystemDescription,
              shouldForceGetPermission,
            }),
          );
        } else {
          yield put(AppPermissionActions.requestPermissionFailure(permission, permissionStatus));
          if (typeof onFailure === 'function') {
            yield call(onFailure);
          }
        }
      }
      return false;
    }
  } catch (err) {
    console.log('err=>', err);
    // Logger.error(err);
  }
}
