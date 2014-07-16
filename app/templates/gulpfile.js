var gulp = require('gulp'),
    gulpif = require('gulp-if'),
	argv = require('yargs').argv,
	// connect = require('gulp-connect-multi')(),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    autoprefix = require('gulp-autoprefixer'),
    zip = require('gulp-zip'),
	log = console.log;

var port = +argv.p || 9000,
    env = argv._[0] || 'dev';

gulp.task('conn_src', function(){
	connect.server({
		root: 'src',
		port: port,
		livereload: {
			port: port+1
		}
	})
})
gulp.task('conn_dest', function(){
	connect.server({
		root: 'dest',
		port: 9100,
		livereload: {
			port: 9101
		}
	})
})

// gulp.task('conn_src', connect.server({
// 	root: ['src'],
// 	port: port,
// 	livereload: {
// 		port: port+1
// 	},
// 	open: {
// 		browser: '/Applications/Google\ Chrome.app'
// 	}
// }))

// gulp.task('conn_dest', connect.server({
//     root: ['dest'],
//     port: 9100,
//     livereload: false,
//     open: {
//         browser: '/Applications/Google\ Chrome.app'
//     }
// }))

gulp.task('html', function(){
    return gulp.src(['src/*.html'])
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', gulp.dest('dest')) )
})

// win32 gulp-sass charset bug --> https://github.com/dlmanning/gulp-sass/issues/10
gulp.task('sass', function(){
	var config = {sourceComments: 'map', sourceMap: 'sass', style: 'compact'}
	if(env === 'dev'){
		gulp.watch(['src/sass/**'], function(){
			return gulp.src('src/sass/**')
				.pipe(sass(config))
				.pipe(autoprefix("last 1 version", "> 1%", "ie 8", "ie 7"))
		        .pipe(gulp.dest('src/css'))
		})
	}
	if(env === 'release'){
		return gulp.src('src/sass/**')
			.pipe(sass(config))
			.pipe(autoprefix("last 1 version", "> 1%", "ie 8", "ie 7"))
	        .pipe(gulp.dest('src/css'))
	}
})
gulp.task('css', ['sass'], function(){
    return gulp.src('src/css/**')
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', minifyCSS()) )
        .pipe( gulpif(env==='release', gulp.dest('dest/css')) )
})
gulp.task('js', function(){
    return gulp.src('src/js/**')
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', uglify()) )
        .pipe( gulpif(env==='release', gulp.dest('dest/js')) )
})
gulp.task('img', function(){
    return gulp.src('src/img/**')
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', imagemin({ progressive: true })) )
        .pipe( gulpif(env==='release', gulp.dest('dest/img')) )
})

gulp.task('clean_dest', function(){
    return gulp.src('dest', {read: false})
        .pipe( clean() )
})

// TODO trans_html
gulp.task('trans_html', function(){
	log('replace url to asserts server url')
})

// usage1> gulp
// usage2> gulp -p 1234
gulp.task('default', ['conn_src', 'css', 'js', 'img', 'html'])

//  usage> gulp release
gulp.task('release', ['clean_dest', 'conn_dest', 'css', 'js', 'img', 'html'])

//  usage> gulp zip
gulp.task('zip',['trans_html'], function(){
	gulp.src(['dest/**', '!dest/slice/**'])
		.pipe(zip('dest.zip'))
		.pipe(gulp.dest('./'))
})