/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/18/17.
 */
const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    './src/index.js',
    // the entry point of our app
  ],

  watch: true,

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },

  output: {
    filename: 'bundle.js',
    // the output bundle

    path: path.resolve(__dirname, '../../public'),

    publicPath: '/'
    // necessary for HMR to know where to load the hot update chunks
  },

  // Look for other devtool - sourcemap options to make it nicier (slower)
  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['happypack/loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors
    // new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HappyPack({
      // loaders is the only required parameter:
      loaders: ['babel-loader'],
    }),
    new HtmlWebpackPlugin({
      template: 'index-template.html'
    }),
  ],

}
