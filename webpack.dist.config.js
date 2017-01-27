/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var webpack = require('webpack');

// PATHS
var PATHS = {
  app: __dirname + '/client',
  target: __dirname + '/dist'
};

module.exports = {

  output: {
    publicPath: '/assets/',
    path: __dirname + 'dist/client/assets/',
    filename: 'main.js'
  },

  debug: false,
  devtool: false,
  entry: './client/scripts/components/main.js',

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en$/)
  ],

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
      loader: 'babel?' + JSON.stringify({
        plugins: ['transform-runtime'],
        presets: ['react', 'es2015', 'stage-1']
      }),
      include: PATHS.app
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less/,
      loader: 'style-loader!css-loader!less-loader'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.(eot.*|woff.*|ttf.*|svg.*)$/,
      loader: "file-loader"
    }]
  }
};
