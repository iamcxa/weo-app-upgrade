module.exports = function (api) {
  api.cache(true);
  // api.cache.invalidate(() => process.env.NODE_ENV);
  // console.log('env', process.env.NODE_ENV);
  // console.log('bEnv', process.env.BABEL_ENV);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        'babel-plugin-root-import',
        {
          root: __dirname,
          rootPathPrefix: '~/',
          rootPathSuffix: 'src/',
        },
      ],
    ],
  };
};
