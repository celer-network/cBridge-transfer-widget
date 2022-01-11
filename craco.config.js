// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  use: [
    {
      loader: "@svgr/webpack",
      options: {
        babel: false,
        icon: true,
      },
    },
  ],
};
