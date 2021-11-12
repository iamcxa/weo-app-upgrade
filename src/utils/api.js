import { Platform, Alert } from "react-native";
import _ from "lodash";
// import timeoutFetch from 'react-native-fetch-polyfill';
// import { Actions } from 'react-native-router-flux';
// import { dispatch } from 'redux';
// import config from '~/Config';
// import { api, apiAction as apiActionConfig } from '~/constant/api';
// import Storage from '~/constant/storage';
// import { getItem } from './asyncStorage';
// import { translate as t } from '~/Helper/I18n';
// import i18n, { i18nKey } from './i18n';
// import { AppStateActions } from '~/Store';
// import { updateAlert } from '~/Store/AppAlert/Actions';
import { AppStore as store } from "~/Store";

const ASYNC_STORAGE_NO_AUTH_TOKEN = "Async Storage No Auth Token";

const throttleAlert = _.throttle(({ title, desc, type = "error", buttons }) => {
  // if (title.length > 0) {
  //   store.dispatch(
  //     updateAlert({
  //       status: 'show',
  //       title,
  //       desc,
  //       type,
  //       ...buttons,
  //       // service: '',
  //       // actionSubject: '',
  //       // actionTime: ''
  //     }),
  //   );
  // }
}, 2000);

function FileSizeError(message) {
  this.name = "FileSizeError";
  this.message = message || "";
}
FileSizeError.prototype = Error.prototype;

const serialize = (obj, prefix) => {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;

      const v = obj[p];
      str.push(
        typeof v === "object"
          ? serialize(v, k)
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      );
    }
  }
  return str.join("&");
};

export const apiAction = {};

let apiHandlerQueued = {};
export const apiHandler = async ({
  res,
  done = () => {},
  fail = () => {},
  notify = true,
  errorTitle,
}) => {
  // console.log('@Legacy ApiHandler res=>', res);
  // if (res.success === true) {
  //   if (notify) {
  //     if (res.user_title && res.user_msg) {
  //       throttleAlert({
  //         title: res.user_title,
  //         desc: res.user_msg,
  //         button: [{ text: i18n.t(i18nKey.apiAlertAction), onPress: () => {} }],
  //       });
  //     } else if (res.user_msg) {
  //       throttleAlert({
  //         title: i18n.t(i18nKey.apiAlertSuccessTitle),
  //         desc: res.user_msg,
  //         button: [{ text: i18n.t(i18nKey.apiAlertAction), onPress: () => {} }],
  //       });
  //     } else if (res.message) {
  //       // throttleAlert('成功', res.msg);
  //     }
  //   }
  //   if (res.reFetch) {
  //     res.reFetch = false;
  //     res.queued = false;
  //     await apiHandler({
  //       res,
  //       ...apiHandlerQueued[res.queueId],
  //     });
  //     console.log(`${res.queueId} ReFetch done.`);
  //     delete apiHandlerQueued[res.queueId];
  //   } else if (res.queued) {
  //     apiHandlerQueued = {
  //       ...apiHandlerQueued,
  //       [res.queueId]: { done, fail, alert },
  //     };
  //   } else {
  //     await done(res);
  //   }
  // } else if (res.result === ASYNC_STORAGE_NO_AUTH_TOKEN) {
  //   console.log("can't find auth token in AsyncStorage");
  //   store.dispatch(AppStateActions.onLoading(false));
  //   store.dispatch(
  //     updateAlert({
  //       title: '請先登入',
  //       // desc: '',
  //       status: 'show',
  //       type: 'error',
  //     }),
  //   );
  //   setTimeout(() => {
  //     Actions.signUp({ type: 'reset', panHandlers: null });
  //   }, 500);
  // } else {
  //   if (res.responseStatus === 400) {
  //     throttleAlert({
  //       title: t('__alert_api_error_title'),
  //       desc: `${t('__alert_api_error_desc')} (400)`,
  //       button: [{ onPress: () => {} }],
  //       type: 'warning',
  //     });
  //     Actions.pop();
  //   } else if (res.responseStatus === 401 || res.responseStatus === 403) {
  //     Actions.systemLogout({
  //       message: res.error_user_msg || res.msg || res.message,
  //     });
  //   } else if (notify) {
  //     let errorInfo = '';
  //     if (res.errors && _.isArray(res.errors)) {
  //       res.errors.forEach((data) => {
  //         errorInfo += `${data.error_user_msg}\n`;
  //       });
  //     }
  //     if (res.error_user_msg && res.error_user_title) {
  //       throttleAlert(res.error_user_title, `${res.error_user_msg}\n${errorInfo}`, [
  //         { text: i18n.t(i18nKey.apiAlertAction), onPress: () => {} },
  //       ]);
  //     } else if (res.error_user_msg) {
  //       throttleAlert({
  //         title: errorTitle || i18n.t(i18nKey.apiAlertTitle),
  //         desc: `${res.error_user_msg}\n${errorInfo}`,
  //         button: [{ text: i18n.t(i18nKey.apiAlertAction), onPress: () => {} }],
  //       });
  //     } else if (res && res.message) {
  //       throttleAlert({
  //         title: errorTitle || i18n.t(i18nKey.apiAlertTitle),
  //         desc: `${res.message}`,
  //         button: [{ text: i18n.t(i18nKey.apiAlertAction), onPress: () => {} }],
  //       });
  //     } else {
  //       console.log('res.success is not valid', res);
  //       throttleAlert({
  //         title: errorTitle || i18n.t(i18nKey.apiAlertTitle),
  //         desc: `${t('__alert_api_error_desc')} (${res.responseStatus})`,
  //         desc: t('__alert_api_error_desc'),
  //         button: [{ text: i18n.t(i18nKey.apiAlertAction), onPress: () => {} }],
  //       });
  //     }
  //   }
  //   await fail(res);
  // }
};

export const fetchAPI = async (
  action,
  data = {},
  params = {},
  options = {}
) => {
  // if (!api[action]) {
  //   console.log(`action ${action} is not set`);
  // }
  // if (!api[action].url) {
  //   console.log(`action ${action} url is not set`);
  // }
  // console.log(`@Legacy ApiHandler "${action}" fetching...`);
  //
  // const replace = _.template(api[action].url);
  // let url = config.domain + replace(params);
  //
  // const method = api[action].method.toUpperCase();
  // const geolocation = api[action].geolocation ? {} : null;
  // const body = {
  //   // appVersion: `${Platform.OS}  ${config.version}`,
  //   // langCode: i18n.getDeviceLocale(),
  //   ...data,
  //   ...api[action].data,
  //   ...geolocation,
  //   // type: data.type || 'A',
  // };
  // const {
  //   user: { apiToken: token },
  // } = store.getState();
  // // await getItem(Storage.AUTHORIZATION);
  // // console.log('store.getState()=>', store.getState());
  // // console.log('store.getState().user=>', store.getState().user);
  // // const { Authorization: token } = store.getState().user;
  // // console.log('token=>', token);
  //
  // const requestOption = {
  //   method,
  //   headers: api[action].headers || {
  //     Accept: 'application/json',
  //     'Accept-Language': i18n.getDeviceLocale(),
  //   },
  //   timeout: config.timeout,
  //   ...options,
  // };
  //
  // const auth = api[action].auth;
  // if (auth) {
  //   if (_.isEmpty(token)) {
  //     return {
  //       result: ASYNC_STORAGE_NO_AUTH_TOKEN,
  //     };
  //   }
  //   requestOption.headers.Authorization = `Bearer ${token}`;
  // }
  // if (!_.isEmpty(body)) {
  //   if (method === 'GET') {
  //     url += `?${serialize(body)}`;
  //   } else if (
  //     api[action].headers &&
  //     api[action].headers.Accept === 'multipart/form-data'
  //   ) {
  //     /* formData */
  //     const formData = new FormData();
  //     console.log('body', body);
  //
  //     for (const name of Object.keys(body)) {
  //       console.log('key', name);
  //       // if (name && !_.isEmpty(body[name]) || _.isNumber(body[name])) {
  //       //   console.log(name, body[name]);
  //       //   if (_.isArray(body[name])) {
  //       //     formData.append(name, `[${body[name]}]`);
  //       //   } else {
  //       //     formData.append(name, body[name]);
  //       //   }
  //       // }
  //       formData.append(name, body[name]);
  //     }
  //     requestOption.body = formData;
  //   } else {
  //     /* JSON */
  //     requestOption.body = JSON.stringify(body);
  //   }
  // }
  // let responseJson;
  // try {
  //   const response = await timeoutFetch(url, requestOption);
  //   responseJson = await response.json();
  //   responseJson.responseStatus = response.status;
  //   if (config.openFetchLog) {
  //     console.group('- API request');
  //     console.log('', url, requestOption);
  //     console.log('API result: ', responseJson);
  //     console.groupEnd();
  //   }
  //   return responseJson;
  // } catch (error) {
  //   if (config.openFetchLog) {
  //     console.group('- API request ERROR');
  //     console.warn('error: ', error);
  //     console.groupEnd();
  //   }
  //   let msg = '';
  //   switch (error.name) {
  //     case 'FileSizeError':
  //       msg = error.message;
  //       break;
  //     default:
  //       msg = t('__alert_api_error_desc');
  //       break;
  //   }
  //   return {
  //     result: -1,
  //     error_code: 87,
  //     msg,
  //   };
  // }
};
