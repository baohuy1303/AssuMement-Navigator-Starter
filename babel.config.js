module.exports = function(api) {
  api.cache(true);
  return {
      presets: ['babel-preset-expo'],
      plugins: ["react-native-reanimated/plugin",
        [
          'module:react-native-dotenv',
          {
            envName: 'EXPO_PUBLIC_API_GOOGLE_MAPS',
            moduleName: '@env',
            path: '.env',
          }
        ]
      ],
  };
};
