var gulp = require('gulp');

var server = require('gulp-express');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var distWebpackConfig = require('./webpack.dist.config.js');
var mergeStream = require('merge-stream');

gulp.task('serve', function(){
  server.run(['server/app.js']);

  var bundle = require('./bundler.js');
  bundle();

  gulp.watch(['server/**/*.js'], function(event){
    server.stop();
    server.run(['server/app.js']);
  });
});

gulp.task('build', function(done){

  //Client app build
  const js = gulp.src('client/scripts/components/main.js')
    .pipe(gulpWebpack(distWebpackConfig, webpack))
    .pipe(gulp.dest('dist/client/assets'));

  // critical app functionality
  const index = gulp.src(['client/favicon.ico', 'client/index.html' ])
    .pipe(gulp.dest('dist/client'));

  //server app
  const server = gulp.src('server/**/*')
    .pipe(gulp.dest('dist/server/'));


  return mergeStream(js, index, server);
});
