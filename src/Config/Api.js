import { ENV_DEVELOP, ENV_LOCAL, ENV_STANDARD } from "@env";

export default {
  // App basic info
  // APP_VERSION: version,
  ENV: process.env.NODE_ENV,

  // Api
  API_TIMEOUT: 10 * 1000,
  API_VERSION: "",
  API_BASE_URL: "https://jsonplaceholder.typicode.com",
};
