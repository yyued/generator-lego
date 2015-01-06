module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        chalk = require('chalk'),
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
            onError: function(err){ log(chalk.bold.red('【sass compile error】>>> \n' + err)) }
        }

        // no sourcemaps, more faster
        if(argv.n){
            return gulp.src('src/sass/*.scss')
                .pipe(plugins.cached('sass', {optimizeMemory: true}))
                .pipe(plugins.sass(config))
                .pipe(plugins.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
                .pipe(plugins.remember('sass'))
                .pipe(gulp.dest('src/css'))
                .pipe(reload({stream:true}))    
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.cached('sass', {optimizeMemory: true}))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass(config))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.remember('sass'))
            .pipe(gulp.dest('src/css'))
            .pipe(reload({stream:true}))
    })
    gulp.task('dev_ejs', function() {
        return gulp.src('src/tpl/*.ejs')
            .pipe(plugins.ejs().on('error', console.log))
            .pipe(gulp.dest('src/'))
            .pipe(reload({stream:true}))
    })

    gulp.task('dev_slice2css', function(){
        var fs = require('fs')
        var path = require('path')
        var async = require('gulp-uglify/node_modules/uglify-js/node_modules/async')
        var gm = require('gm')
        var ejs = require('gulp-ejs/node_modules/ejs')

        var classnameRule = function(fileName, p){
            var relPath = path.relative('src/slice', path.dirname(p))
            var name = path.join(relPath, fileName).replace(/\//g, '-')
            return name
        }

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
                            imageurl: path.relative('src/sass', f).split(path.sep).join('/'),
                            classname: classnameRule.call({}, path.basename(f, path.extname(f)), f),
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
<% slice.forEach(function(e){ %>
.<%= e.classname%>{
    background-image: url(<%= e.imageurl%>);
    width:<%= e.width%>px;
    height:<%= e.height %>px; 
    background-repeat: no-repeat; 
}
<% }) %>
                    */}).toString().split('\n').slice(1, -1).join('\n')
                var css = ejs.render(tpl, data).replace(/^\n/mg, '')
                fs.writeFileSync('src/sass/_slice.scss', css)
            }
        ])
    })

    gulp.task('default', ['dev_conn'], function(){
        if(argv.w){
            gulp.watch('src/slice/**', ['dev_slice2css'])
        }
        gulp.watch('src/tpl/**', ['dev_ejs'])
        gulp.watch('src/sass/**', ['dev_sass'])
        gulp.watch('src/img/**', reload)
        gulp.watch('src/js/**', reload)
        gulp.watch('src/*.html', reload)
    })

}