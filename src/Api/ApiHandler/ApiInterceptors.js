import { axios } from "@udea-io/axios-wrapper";
import { get } from "lodash";

import * as ApiResponse from "../ApiResponse";
import { ApiActions, ApiStore } from "./Store";

export const requestInterceptor = {
  onFulfilled(config) {
    // Do something before request is sent
    console.log("requestInterceptor config=>", config);
    ApiStore.dispatch(ApiActions.onApiFetching(config));
    return config;
  },
  onRejected(error) {
    // Do something with request error
    return Promise.reject(error);
  },
};

export const responseInterceptor = {
  onFulfilled: (canceler) => (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    console.log("responseInterceptor response=>", response);
    ApiStore && ApiStore.dispatch(ApiActions.onApiFetchSuccess(response));
    return response;
  },
  onRejected: (canceler) => (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    ApiStore && ApiStore.dispatch(ApiActions.onApiFetchFailure(error));

    // ensure request is be canceled
    const isCanceled = axios.isCancel(error);

    // show console warning message
    __DEV__ &&
      console.warn(
        `API Response Error: ${isCanceled ? "(Request Canceled) " : ""}${
          error.status || error.message
        }
      \n[ Request Path ]\n${get(error, "config.url")}\n\n[ Full Response ]\n`,
        JSON.stringify(error, null, 2)
      );

    switch (error.status) {
      case 504: {
        !isCanceled && ApiResponse.hook504(error, canceler);
        break;
      }
      default: {
        !isCanceled && ApiResponse.hookDefaultError(error, canceler);
        break;
      }
    }
    return Promise.reject(error);
  },
};
