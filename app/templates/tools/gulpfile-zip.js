module.exports = function(gulp, plugins) {

    var del = require('del'),
        path = require('path'),
        log = console.log;

    var pkg = require('../package.json');

    gulp.task('zip_clean', function(){
    	del.sync(['assets'])
    })
	gulp.task('zip_copySrc', function(){
    	return gulp.src(['src/**'])
    		.pipe(gulp.dest('assets/src'))
    })
    gulp.task('zip_copyDest', function(){
		return gulp.src(['dest/**', '!dest/**/*.html'])
    		.pipe(gulp.dest('assets/dest'))
    })
    gulp.task('zip_trans', function() {
    	var url = require('url').resolve('http://assets.dwstatic.com', [pkg.description, pkg.name, pkg.version].join('/'))
        return gulp.src(['dest/**/*.html'])
        	.pipe( plugins.cdnAbsolutePath({assets:'dest', cdn:url}) )
        	.pipe(gulp.dest('assets/dest'))
    })
    gulp.task('zip_done', ['zip_clean', 'zip_copySrc', 'zip_copyDest', 'zip_trans'], function() {
        var zipname = path.basename(path.join(__dirname, '..'))+'.zip'
        return gulp.src(['assets/**'])
            .pipe(plugins.zip(zipname))
            .pipe(gulp.dest('./'))
    })

    gulp.task('zip', ['zip_done'], function() {
        del.sync(['assets'])
    })

}