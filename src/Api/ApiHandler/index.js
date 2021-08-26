import { ApiConst } from '@udea-io/axios-wrapper';

import ApiHandler from './ApiHandler';

export default {
  get: (config, options) => ApiHandler(ApiConst.GET, config, options),
  put: (config, options) => ApiHandler(ApiConst.PUT, config, options),
  post: (config, options) => ApiHandler(ApiConst.POST, config, options),
  patch: (config, options) => ApiHandler(ApiConst.PATCH, config, options),
  delete: (config, options) => ApiHandler(ApiConst.DELETE, config, options),
};
