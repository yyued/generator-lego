module.exports = function(gulp, plugins) {
        
    var argv = require('yargs').argv;
    var browserSync = require('browser-sync'),
        reload = browserSync.reload,
        stylish = require('jshint-stylish');
    
    var that = this;
    that.port = +argv.p || 3001;
    
    gulp.task('hint-conn', function() {
        browserSync({
            ui:false,
            server: {
                baseDir: "src",
                directory: false
            },
            notify: false,
            ghostMode: false,
            port: that.port,
            open: false
        })
    })
    
    gulp.task('hint-js', function() {
        return gulp.src(['src/js/**', '!lib/**'])
            .pipe(plugins.cached('jshint'))
            .pipe(plugins.jshint('.jshintrc'))
            .pipe(plugins.jshint.reporter(stylish, { verbose: true }))
            .pipe(reload({stream:true}))
    });
    

    gulp.task('hint', ['hint-js', 'hint-conn'], function(){
        gulp.watch('src/js/**', ['hint-js'])
    })

}
