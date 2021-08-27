import 'react-native-console-time-polyfill';

import { ApiConst, ApiRuntime } from '@udea-io/axios-wrapper';
import * as Localization from 'expo-localization';
import { get } from 'lodash';

import Config from '~/Config';

import * as ApiInterceptors from './ApiInterceptors';

const ApiHandler =
  (
    method = ApiConst.GET,
    config = {},
    options = {
      headers: {
        'Accept-Language': Localization.locales.toString(),
      },
    },
  ) =>
  async (url) => {
    // Get current app locale status
    let acceptLanguage = get(config, 'headers["Accept-Language"]');
    if (!acceptLanguage) {
      acceptLanguage = Localization.locales.toString();
    }

    const jwt = get(config, 'Authorization');
    const ENV = Config.API_ENV;

    // eslint-disable-next-line no-return-await
    return await ApiRuntime(
      url,
      method,
      {
        requestInterceptor: ApiInterceptors.requestInterceptor,
        responseInterceptor: ApiInterceptors.responseInterceptor,
        ...options,
      },
      {
        ...config,
        baseURL: get(Config, `${ENV}.API_BASE_URL`, Config.API_BASE_URL),
        headers: {
          'Accept-Language': acceptLanguage,
          Authorization: jwt && `Bearer ${jwt}`,
          ...get(config, 'headers', {}),
        },
      },
    );
  };

export default ApiHandler;
