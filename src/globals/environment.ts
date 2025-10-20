type Environment = "local" | "test" | "prod";

const env: Environment = "local";

const environments = {
  local: {
    api: "http://localhost:8005",
    cookie: "localhost",
    url: "http://localhost:5175",
  },
  test: {
   api: "your test api url here",
    cookie: "your test cookie domain here",
    url: "your test app url here",
  },
  prod: {
   api: "your production api url here",
    cookie: "your production cookie domain here",
    url: "your production app url here",
  },
  
};
const { api, cookie, url } = environments[env];

export {
  api as apiEnvironment,
  cookie as cookieEnvironment,
  url as urlEnvironment,

};