module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        del = require('del'),
        moment = require('moment'),
        multiSprite = require('multi-sprite'),
        portfinder = require('portfinder'),
        browserSync = require('browser-sync'),
        log = console.log;

    var that = this;
    that.port = +argv.p || undefined;
    var pkg = require('../package.json');
    var banner = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author  : ' + pkg.author + '\n * @update  : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r';

    gulp.task('rels_sass', function() {
        var config = {
            sourceComments: 'map',
            sourceMap: 'sass',
            style: 'compact',
            onError: function(err) { console.log('...err...: ' + err) }
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.sass(config))
            .pipe(plugins.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe(gulp.dest('src/css'))
    })
    gulp.task('rels_css', ['rels_sass'], function() {
        return gulp.src('src/css/**/*.css')
            .pipe(plugins.minifyCss())
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/css'))
    })
    gulp.task('rels_slice', function() {
        return gulp.src('src/slice/**')
            .pipe(gulp.dest('dest/slice'))
    })
    gulp.task('rels_sprite', ['rels_slice', 'rels_css'], function() {
        return multiSprite({
            srcCss: 'dest/css',
            srcImg: 'dest/slice',
            destCss: 'dest/css',
            destImg: 'dest/img/sprite',
            'algorithm': 'binary-tree',
            'padding': 4,
            'exportOpts': {
                'format': 'png',
                'quality': 90
            },
            successCB: function(){
                del(['dest/slice/**'])
                
                // 给css文件的图片请求加上时间戳
                if (argv.t) {
                    var timestamp = +new Date
                    gulp.src(['dest/css/**'])
                        .pipe(plugins.replace(/(\/[\w-]*\.(jpg|jpeg|gif|png|bmp|tiff|otf|ttf|woff|svg|webp|swf|htc))/ig, '$1?'+timestamp))
                        .pipe(gulp.dest('dest/css'));
                }
            }
        })
    })
    gulp.task('rels_js', function() {
        return gulp.src('src/js/**')
            .pipe(plugins.uglify())
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/js'))
    })
    gulp.task('rels_img', function() {
        return gulp.src('src/img/**')
            .pipe(plugins.imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('dest/img'))
    })
    gulp.task('rels_html', function() {
        return gulp.src(['src/*.html'])
            .pipe(gulp.dest('dest'))
    })
    gulp.task('rels_clean', function() {
        del.sync(['dest/**'])
    })

    gulp.task('release', ['rels_clean', 'rels_html', 'rels_sprite', 'rels_js', 'rels_img'], function(){
        portfinder.getPort(function (err, port) {
            browserSync({
                server: {
                    baseDir: "dest",
                    directory: true
                },
                notify: false,
                ghostMode:false,
                codeSync: false,
                port: that.port||port,
                open: "external",
                browser: "/Applications/Google\ Chrome.app/"
            })
        })
    })
    gulp.task('dest', function(){
        portfinder.getPort(function (err, port) {
            browserSync({
                server: {
                    baseDir: "dest",
                    directory: true
                },
                notify: false,
                ghostMode:false,
                codeSync: false,
                port: that.port||port,
                open: "external",
                browser: "/Applications/Google\ Chrome.app/"
            })
        })
    })

}