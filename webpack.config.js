const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './plugin/src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'plugin/dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};