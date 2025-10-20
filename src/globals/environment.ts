type Environment = "local" | "test" | "prod";

const env: Environment = "local";

const environments = {
  local: {
    api: "http://localhost:8005",
    cookie: "localhost",
    url: "http://localhost:5175",
  },
  test: {
   api: "https://sl-wms-api-test.flowcsolutions.com",
    cookie: ".flowcsolutions.com",
    url: "sl-wms-test.flowcsolutions.com",
  },
  prod: {
   api: "https://sl-wms-api.flowcsolutions.com",
    cookie: ".flowcsolutions.com",
    url: "sl-wms.flowcsolutions.com",
  },
  
};
const { api, cookie, url } = environments[env];

export {
  api as apiEnvironment,
  cookie as cookieEnvironment,
  url as urlEnvironment,

};