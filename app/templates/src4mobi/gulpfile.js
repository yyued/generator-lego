var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')();

var a = 'jl'

require('./tasks/gulpfile-dev')(gulp, plugins)
require('./tasks/gulpfile-build')(gulp, plugins)
require('./tasks/gulpfile-zip')(gulp, plugins)