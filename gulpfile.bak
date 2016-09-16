'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

var files = ['gulpfile.js', 'index.js', __dirname + '/lib/**/*.js', __dirname + '/test/**/*.js',
            __dirname + '/models/**/*.js', __dirname + '/routes/**/*.js'];

//Run mocha for tests
gulp.task('mocha', function() {
  return gulp.src(__dirname +'/test/tutor_test.js', {read: false})
             .pipe(mocha( {reporter: 'nyan'}));
});

//Run eslint linter tool
gulp.task('lint', function() {
  return gulp.src(files)
    .pipe(eslint({//Commented out the .eslintrc file and added option to lint task
      'rules': {
        'no-console': 0,
        'indent': [
          2,
          2
        ],
        'quotes': [
          2,
          'single'
        ],
        'linebreak-style': [
          2,
          'unix'
        ],
        'semi': [
          2,
          'always'
        ]
      },
      'env': {
        'es6': true,
        'node': true,
        'browser': true
      },
      'globals': {
        'describe': false,
        'it': false,
        'beforeEach': false,
        'afterEach': false,
        'before': false,
        'after': false
      },
      'ecmaFeatures': {
        'modules': true,
        'experimentalObjectRestSpread': true
      },
      'extends': 'eslint:recommended'
    }))
    .pipe(eslint.format());
});

//Run tasks on changes to files
gulp.task('default',['mocha', 'lint']);
