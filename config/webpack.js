const { join } = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { main, dependencies } = require('../package.json');

module.exports = async (env, argv) => {
  const { platform } = argv;
  const src = join(__dirname, '..', 'src');
  const path = join(__dirname, '..', 'dist');
  const renderer = join(__dirname, '..', main);
  // eslint-disable-next-line import/no-dynamic-require
  let config = require(`./webpack.${env}`);

  if (typeof config === 'function') {
    config = await config(renderer, path, argv);
  }

  return merge({
    target: 'electron-renderer',
    externals: Object.keys(dependencies || {}),
    entry: { renderer },
    output: {
      path,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
      alias: {
        '@': src,
      },
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                caller: { platform },
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: 'css/[id].css',
      }),
      new HtmlWebpackPlugin({
        template: join(src, 'index.html'),
      }),
    ],
  }, config);
};
