const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '.build'),
    publicPath: '/.build/',
    filename: 'bundle.js',
  },

  devServer: {
    open: 'chrome',
    openPage: '.build/',
    port: 8000,
    publicPath: '/.build/',
    writeToDisk: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'scenes'),
          path.resolve(__dirname, 'common'),
        ],
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '.resources'),
          path.resolve(__dirname, '.build'),
          path.resolve(__dirname, 'lib'),
          path.resolve(__dirname, 'typings'),
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        // prevents license txt file from being created
        extractComments: false,
      }),
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  return (config);
};
