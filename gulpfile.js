var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack');

var path = {
  PUBLIC: './public',
};

gulp.task('clean', function(cb) {
  del['public'], cb);
});

gulp.task('webpack', function(done) {
  webpack(require('./webpack.config.js')).run(function(err, stats) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString());
    }
    done();
  });
});  
gulp.task('default', ['clean', 'webpack']);
