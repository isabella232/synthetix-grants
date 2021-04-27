module.exports = {
  assetPrefix: "./",
  trailingSlash: true,
  env: {
    IS_PROD: process.env.IS_PROD,
    API_URL: process.env.API_URL,
  },
};
