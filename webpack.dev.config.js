/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {

  output: {
    publicPath: '/assets/',
    path: './.tmp/assets',
    filename: 'main.js'
  },

  cache: true,
  debug: true,
  devtool: false,
  watch:true,
  entry: [
      'webpack/hot/only-dev-server',
      './client/scripts/components/main.js'
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
    preLoaders: [{
      test: '\\.js$',
      exclude: 'node_modules',
      loader: 'jshint'
    }],
    loaders: [{
      test: /\.js$/,
      loader: 'react-hot!jsx-loader?harmony',
      include: path.join(__dirname, 'client')
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
