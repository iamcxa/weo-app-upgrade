import { ENV_DEVELOP, ENV_LOCAL, ENV_STANDARD } from "@env";

import API from "./Api";
import LOGGER from "./Logger";

export default {
  // App basic info
  // APP_VERSION: version,
  API,
  LOGGER,
  ENV_DEVELOP,
  ENV_LOCAL,
  ENV_STANDARD,

  // Api
  API_TIMEOUT: 10 * 1000,
  API_VERSION: "",
  API_BASE_URL: "https://jsonplaceholder.typicode.com",
};
