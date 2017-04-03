var gulp = require('gulp');

var server = require('gulp-express');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var distWebpackConfig = require('./webpack.dist.config.js');

gulp.task('serve', function(){
  server.run(['server/app.js']);

  var bundle = require('./bundler.js');
  bundle();

  gulp.watch(['server/**/*.js'], function(event){
    server.stop();
    server.run(['server/app.js']);
  });
});

gulp.task('build', function(){

  //Client app build
  gulp.src('client/scripts/components/main.js')
    .pipe(gulpWebpack(distWebpackConfig, webpack))
    .pipe(gulp.dest('dist/client'));

  // critical app functionality
  gulp.src('client/favicon.ico')
    .pipe(gulp.dest('dist/client'));

  //server app
  gulp.src('server/**/*')
    .pipe(gulp.dest('dist/server/'));
});
