var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task('clean', function(done) {
  del(['public/bundle.js'], done);
});

gulp.task('webpack', function(done) {
  webpack(webpackConfig).run(function(err, stats) {
    if (err) {
      gutil.log('Error', err);
    } else {
      gutil.log(stats.toString());
    }
    done();
  });
});  

gulp.task('default', ['clean', 'webpack']);
