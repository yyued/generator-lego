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
                ghostMode:false,
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
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.sass(config))
            .pipe(plugins.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe(gulp.dest('src/css'))
    })
    gulp.task('dev_css', function() {
        return gulp.src('src/css/**')
            .pipe(gulp.dest('src/css'))
            .pipe(reload({stream:true}))
    })
    gulp.task('dev_ejs', function() {
        var data = require('../src/tpl/d/global.json')
        return gulp.src('src/tpl/*.ejs')
            .pipe(plugins.ejs(data).on('error', console.log))
            .pipe(gulp.dest('src/'))
            .pipe(reload({stream:true}))
    })

    gulp.task('dev_slice2css', function(){
        var fs = require('fs')
        var path = require('path')
        var async = require('async')
        var gm = require('gm')
        var ejs = require('gulp-ejs/node_modules/ejs')

        var files, data = {}
        async.series([
            // 列出图片
            function(next){
                var glob = require("glob")
                files = glob.sync("src/slice/**", {nodir:true})
                files = files.filter(function(f){
                    return !~(path.basename(f).indexOf('@'))
                })
                next(null)
            },

            // 生成数据
            function(next){
                var arr = data.slice = []
                async.eachSeries(files, iterator, callback)
                function iterator(f, _next){
                    gm(f).size(function(err, size){
                        if(err){return}
                        arr.push({
                            filepath: f,
                            imageurl: path.relative('src/sass', f),
                            classname: path.basename(f, path.extname(f)),
                            width: size.width,
                            height: size.height
                        })
                        _next(null)
                    })
                }
                function callback(err, result){
                    next(null)
                }
            },

            // 生成css
            function(next){
                var tpl = (function(){/*
@mixin slice($slice_url, $default_pos:false){
  background-image: url($slice_url); background-repeat: no-repeat; 
  @if($default_pos){display: inline-block; *display: inline; *zoom: 1; vertical-align: middle; text-align: center;}
}
<% slice.forEach(function(e){ %>
.<%= e.classname%>{ @include slice('<%= e.imageurl%>'); width:<%= e.width%>px; height:<%= e.height %>px; }
<% }) %>
                    */}).toString().split('\n').slice(1, -1).join('\n')
                var css = ejs.render(tpl, data).replace(/^\n/mg, '')
                fs.writeFileSync('src/sass/_icon.scss', css)
            }
        ])
    })

    gulp.task('default', ['dev_conn'], function(){
        if(argv.w){
            gulp.watch('src/slice/**', ['dev_slice2css'])
        }
        gulp.watch('src/tpl/**', ['dev_ejs'])
        gulp.watch('src/sass/**', ['dev_sass'])
        gulp.watch('src/css/**', ['dev_css'])
        gulp.watch('src/img/**', reload)
        gulp.watch('src/js/**', reload)
        gulp.watch('src/*.html', reload)
    })

}