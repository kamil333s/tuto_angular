'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var webpack = require('webpack-stream');

gulp.task('testing', function(){
  return gulp.src('test/router_test.js', {read:false})
  .pipe(mocha());
});

gulp.task('lint', function (){
  return gulp.src(['*.js', 'test/*.js', 'models/*.js', 'app/*.js', 'lib/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('watch', function (){
  gulp.watch(['*.js', 'test/*.js', 'models/*.js', 'app/*.js', 'lib/*.js'], ['lint']);
  gulp.watch(['test/server_test.js', 'server.js' ], ['testing']);
  gulp.watch(['app/*.js', 'server.js', 'public/*.html' ], ['webpack']);
});


gulp.task('webpack', function () {
  return gulp.src('./entry.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          test: /\.css$/,
          loader: 'style!css'
        }]
      }
    }))
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['testing', 'lint', 'watch', 'webpack']);