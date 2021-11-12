import { boilerplateVersion } from "../../../package.json";

/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  boilerplateVersion,

  currentOrientation: null,

  currentState: "active",

  netInfo: {
    details: {
      subnet: "",
      ipAddress: "",
      strength: 0,
      ssid: "",
      isConnectionExpensive: null,
    },
    isInternetReachable: null,
    isConnected: null,
    type: "",
  },

  device: {
    isTablet: null,
    isEmulator: null,
  },

  currentVersion: {},

  localization: {
    currency: "",
    decimalSeparator: ".",
    digitGroupingSeparator: ",",
    isoCurrencyCodes: [],
    isMetric: false,
    isRTL: false,
    locale: "",
    locales: [],
    timezone: "",
    region: "",
    currentUsedLanguageTag: "",
  },

  isLoading: false,
  loadingMessage: "",
  loadingOptions: {},

  currentGeolocation: {
    provider: {},
    motion: {},
  },
};
