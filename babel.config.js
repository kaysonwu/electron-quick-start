/* eslint-disable no-case-declarations */
function getCallerInfo(caller) {
  let info;
  caller(c => {
    if (c) {
      info = c;
    }
  });

  return info;
}

module.exports = ({ caller, env }) => {
  const { name, platform } = getCallerInfo(caller);
  const options = { modules: 'commonjs', targets: { node: true } };
  const plugins = [];

  switch (name) {
    case 'babel-loader': // For webpack
      options.modules = false;
      plugins.push(['import', { libraryName: 'antd', style: true }]);

      // Development
      if (env(['development', 'test'])) {
        plugins.push('react-hot-loader/babel');
      }
      break;
    default:
      break;
  }

  return {
    presets: [
      '@babel/preset-react',
      '@babel/preset-typescript',
      ['@babel/preset-env', options],
    ],
    plugins: [
      // Preprocessor will delete some irrelevant code, so it should be executed at the front.
      ['preprocessor', { symbols: { [platform]: true, [env()]: true } }],
      ...plugins,
      '@babel/plugin-proposal-class-properties',
      ['module-resolver', {
        alias: {
          '@': './src/',
        },
      }],
    ],
  };
};
