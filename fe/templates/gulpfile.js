var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')();

var a = '<%= projectAuthor %>'

require('./tools/gulpfile-dev')(gulp, plugins)
require('./tools/gulpfile-release')(gulp, plugins)
require('./tools/gulpfile-zip')(gulp, plugins)