/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';

var webpack = require('webpack');
var path = require('path');

// PATHS
var PATHS = {
  app: __dirname + '/client',
  target: __dirname + '/dist'
};

module.exports = {

  output: {
    publicPath: '/assets/',
    path: __dirname + '/.tmp/assets',
    filename: 'main.js'
  },

  cache: true,
  debug: true,
  devtool: '#inline-source-map',
  watch:true,
  entry: [
      'webpack-dev-server/client?http://localhost:9001/',
      'webpack/hot/only-dev-server',
      __dirname + '/client/scripts/components/main.js'
  ],

  stats: {
    colors: true,
    modules:true,
    reasons: true
  },

  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'react-hot!babel?' + JSON.stringify({
        plugins: ['transform-runtime'],
        presets: ['react', 'es2015', 'stage-1']
      }),
      include: PATHS.app,
      exclude: /node_modules/,
    }, {
      test: /\.less/,
      loader: 'style-loader!css-loader!less-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    },{
      test: /\.(eot.*|woff.*|ttf.*|svg.*)$/,
      loader: "file-loader"
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]

};
