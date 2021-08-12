import 'react-native-console-time-polyfill';
import axios from 'axios';
import { get, isNil } from 'lodash';

const Runtime = async (
  url,
  method,
  options = {
    // default handlers
    defaultSuccessHandler: undefined,
    defaultErrorHandler: undefined,

    // handlers
    successHandler: undefined,
    errorHandler: undefined,
    finallyHandler: undefined,
    isDefaultHandlerEnable: true,

    // i.o interceptors
    requestInterceptor: {
      onFulfilled: () => {},
      onRejected: () => {},
    },
    responseInterceptor: {
      onFulfilled: () => {},
      onRejected: () => {},
    },

    //  axios canceler
    cancelToken: undefined,
  },
  config = {
    timeout: 15 * 1000,
    baseURL: undefined,
    params: {}, // query params
    data: undefined, // body data
    headers: {
      'Content-Type': 'application/json',
      Authorization: undefined,
    },
  },
) => {
  const TAG = `[!][${method.toUpperCase()}][${url}](${new Date().getTime()})`;
  const isDefaultHandlerEnable = get(options, 'isDefaultHandlerEnable');
  try {
    if (__DEV__ && console.time) {
      console.time(TAG);
    }
    console.groupCollapsed(TAG);

    const baseUrl = get(config, 'baseURL');
    const headers = {
      'Content-Type': 'application/json',
      ...get(config, 'headers', {}),
    };
    const params = get(config, 'params', {});
    const data = get(config, 'data');

    console.log('request-headers=>', headers);
    console.log('url-params=>', params);
    console.log('body-data=>', data);

    // Ensure there's no undefined
    {
      const baseUrlNil =
        isNil(baseUrl) || baseUrl.includes('undefined') || baseUrl.includes('null');
      if (baseUrlNil) {
        const message = `API Base Url contains "null" or "undefined". Check input: "${baseUrl}".`;
        console.error(message);
        // eslint-disable-next-line no-alert
        return __DEV__ && alert && alert(message);
      }

      const requestUrlNil = isNil(url) || url.includes('undefined') || url.includes('null');
      if (requestUrlNil) {
        const message = `API Request Url contains "null" or "undefined". Check input: "${url}".`;
        console.error(message);
        // eslint-disable-next-line no-alert
        return __DEV__ && alert && alert(message);
      }
    }

    if (!global.canceler || global.canceler.token.reason) {
      console.debug('request canceler=>', global.canceler);
      global.canceler = axios.CancelToken.source();
    }

    // Create an axios instance
    const instance = axios.create({
      ...config,

      baseURL: config.baseURL,

      timeout: config.timeout,

      headers: {
        // Default accept header set to json
        'Content-Type': 'application/json',
        'Accept-Language': get(config, 'headers.acceptLanguage'),
        ...get(config, 'headers', {}),
      },

      cancelToken: get(options, 'cancelToken') || get(global, 'canceler.token'),
    });

    const requestInterceptor = get(options, 'requestInterceptor');
    if (typeof requestInterceptor === 'object') {
      instance.interceptors.request.use(
        requestInterceptor.onFulfilled,
        requestInterceptor.onRejected,
      );
    }

    const responseInterceptor = get(options, 'responseInterceptor');
    if (typeof responseInterceptor === 'object' && isDefaultHandlerEnable) {
      instance.interceptors.response.use(
        responseInterceptor.onFulfilled(global.canceler),
        responseInterceptor.onRejected(global.canceler),
      );
    }

    const res = ['patch', 'post', 'put'].includes(method)
      ? await instance[method](url, data, { params })
      : await instance[method](url, { params, data });

    const successHandler = get(options, 'successHandler');
    if (typeof successHandler === 'function') {
      await successHandler(res);
    }
    return res;
  } catch (err) {
    // if error has normal response, use default handling
    // if custom handler is gave, use it
    let errorObject = err;
    if (err.response) {
      errorObject = err.response;
    }
    const errorHandler = get(options, 'errorHandler');
    if (typeof errorHandler === 'function') {
      await errorHandler(errorObject);
    }
    // throw error in the end
    throw errorObject;
  } finally {
    const finallyHandler = get(options, 'finallyHandler');
    if (typeof finallyHandler === 'function') {
      await finallyHandler();
    }
    console.groupEnd();
    if (__DEV__ && console.timeEnd) {
      console.timeEnd(TAG);
    }
  }
};

export default Runtime;
