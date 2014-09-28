module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        moment = require('moment'),
    	portfinder = require('portfinder'),
        browserSync = require('browser-sync'),
        reload = browserSync.reload,
        log = console.log;

    var that = this;
    that.port = +argv.p || undefined;
    var pkg = require('../package.json');
    var banner = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author  : ' + pkg.author + '\n * @update  : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r';
    
    gulp.task('dev_conn', function() {
    	portfinder.getPort(function (err, port) {
			browserSync({
		        server: {
		            baseDir: "src",
                    directory: true
		        },
		        notify: false,
		        port: that.port||port,
		        open: "external",
		        browser: "/Applications/Google\ Chrome.app/"
		    })
	  	})
	})
    gulp.task('dev_sass', function() {
        var config = {
            sourceComments: 'map',
            sourceMap: 'sass',
            style: 'compact',
            onError: function(err){ console.log('...err...: ' + err) }
        }
        return gulp.src('src/sass/**')
            .pipe(plugins.sass(config))
            .pipe(plugins.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe(gulp.dest('src/css'))
    })
    gulp.task('dev_css', function() {
        return gulp.src('src/css/**')
            .pipe(gulp.dest('src/css'))
            .pipe(reload({stream:true}))
    })
    gulp.task('default', ['dev_conn'], function(){
    	gulp.watch('src/sass/**', ['dev_sass'])
    	gulp.watch('src/css/**', ['dev_css'])
    	gulp.watch('src/img/**', reload)
    	gulp.watch('src/js/**', reload)
        gulp.watch('src/*.html', reload)
    })  

}