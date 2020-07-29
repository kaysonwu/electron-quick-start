/* eslint-disable no-console */
const { resolve, join } = require('path');
const { spawn } = require('child_process');
const getPort = require('get-port');
const webpack = require('webpack');

module.exports = async (
  renderer,
  path,
  { main, https, host, port: customizedPort = process.env.port },
) => {
  const scheme = https ? 'https' : 'http';
  const port = customizedPort || await getPort({ port: getPort.makeRange(8080, 65535), host });
  const publicPath = `${scheme}://${host}:${port}/`;

  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
      renderer: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${publicPath}`,
        'webpack/hot/only-dev-server',
        renderer,
      ],
    },
    output: { path, publicPath },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      host,
      port,
      https,
      publicPath,
      hot: true,
      inline: true,
      lazy: false,
      compress: true,
      noInfo: false,
      stats: 'errors-only',
      historyApiFallback: true,
      contentBase: path,
      headers: { 'Access-Control-Allow-Origin': '*' },
      before() {
        if (main) {
          console.log('Starting Main Process...');
          spawn('electron', ['-r', join(__dirname, 'register.js'), resolve(main)], {
            shell: true,
            env: { ...process.env, entry: `${publicPath}/index.html` },
            stdio: 'inherit',
          })
            .on('close', code => process.exit(code))
            .on('error', error => console.error(error));
        }
      },
    },
  };
};
