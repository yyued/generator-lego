module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        chalk = require('chalk'),
        moment = require('moment'),
        browserSync = require('browser-sync'),
        reload = browserSync.reload,
        fecs = require('gulp-fecs-fork'),
        log = console.log;
    
    var win32 = process.platform === 'win32'
    var that = this
    that.port = +argv.p || 3000
    var pkg = require('../package.json')
    var banner = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author  : ' + pkg.author + '\n * @update  : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r'
    var fecsCheckOptions = {
        maxerr: 5
    }
    
    gulp.task('dev_conn', function() {
        browserSync({
            ui:false,
            server: {
                baseDir: "src",
                directory: true
            },
            notify: false,
            ghostMode:false,
            port: that.port,
            open: false,
            browser: "/Applications/Google\ Chrome.app/"
        },function(err, arg){
            if (argv.q) {
                var url = arg.options.get('urls').get('external')
                var qrcode = require('qrcode-terminal')
                qrcode.generate(url);
            }
 
        })
    })
    gulp.task('dev_sass', function() {
        function sassCompile(){
            function handler(){
                return plugins.notify.onError({
                    title:'sass编译错误', 
                    message:'<%=error.message%>'
                })
            }
            return plugins.sass().on('error', handler()) 
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompile())
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer( {browsers: ['> 0%']} ))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(gulp.dest('src/css'))
            .pipe(reload({stream:true}))
    })
    gulp.task('dev_js', function() {
        return gulp.src(['src/js/**/*.js', '!src/js/lib/**/*.js'])
            .pipe(plugins.cached('jshint'))
            .pipe(fecs.check(fecsCheckOptions))
            .pipe(fecs.reporter('baidu'))
            .pipe(reload({stream:true}))
    })
    gulp.task('dev_ejs', function() {
        return gulp.src('src/tpl/*.ejs')
            .pipe(plugins.ejs().on('error', console.log))
            .pipe(gulp.dest('src/'))
            .pipe(reload({stream:true}))
    })
    gulp.task('dev_html', function(){
        return gulp.src('src/**/*.html')
            .pipe(plugins.cached('htmlhint'))
            .pipe(fecs.check(fecsCheckOptions))
            .pipe(fecs.reporter('baidu')) 
            .pipe(reload({stream:true}))
    })
    gulp.task('dev_svg', function() {
        function renameSvg(p){
            p.basename = 'symbols'
        }
        return gulp.src('src/svg/slice/*.svg')
            .pipe(plugins.svgSymbols({templates: ['default-svg']}))
            .pipe(plugins.rename(renameSvg))
            .pipe(gulp.dest('src/svg'))
            .pipe(reload({stream:true}))
    })

    // 检测 src/img/slice 文件夹，读取图片信息来生成css切片样式
    gulp.task('dev_slice2css', function(){
        var fs = require('fs')
        var path = require('path')
        var async = require('gulp-uglify/node_modules/uglify-js/node_modules/async')
        var getPixels = require('multi-sprite/node_modules/spritesmith/node_modules/pixelsmith/node_modules/get-pixels')
        var ejs = require('gulp-ejs/node_modules/ejs')

        var classnameRule = function(fileName, p){
            var relPath = path.relative('src/img/slice', path.dirname(p))
            var name = win32? path.join(relPath, fileName).replace(/\\/g, '-'):path.join(relPath, fileName).replace(/\//g, '-')
            return name
        }

        var pageWidth = argv.w, isProcessREM = !!argv.w, data = {}, files
        async.series([
            // 1. 文件过滤
            function(next){
                var glob = require("glob")
                files = glob.sync("src/img/slice/**", {nodir:true})
                files = files.filter(function(f){
                    return !~(path.basename(f).indexOf('@'))
                })
                next(null)
            },

            // 2. 生成切片数据
            function(next){
                var arr = data.slice = []
                async.eachSeries(files, iterator, callback)
                function iterator(f, _next){
                    getPixels(f, function (err, pixels) {
                        if(err){return}
                        arr.push({
                            filepath: f,
                            imageurl: path.relative('src/sass', f).split(path.sep).join('/'),
                            classname: classnameRule.call({}, path.basename(f, path.extname(f)), f),
                            width: formatPX(pixels.shape[0]),
                            height: formatPX(pixels.shape[1]),
                            cover: isProcessREM?'background-size:cover;':''
                        })
                        _next(null)

                        function formatPX (pxValue) {
                            if (!pageWidth) {return pxValue+'px'}
                            if (+pageWidth === 1) { return pxValue*16/720+'rem' }
                            return (pxValue*16/+pageWidth)+'rem'
                        }
                    })
                }
                function callback(err, result){
                    next(null)
                }
            },

            // 3. 生成css文件
            function(next){
                var tpl = (function(){/*
// CSS Sprites切片样式
<% slice.forEach(function(e){ %>
%<%= e.classname%> {
    width: <%= e.width%>;
    height: <%= e.height %>;
    background-image: url(<%= e.imageurl%>);
    background-repeat: no-repeat;
    <%= e.cover%>
}
<% }) %>
                    */}).toString().split('\n').slice(1, -1).join('\n')
                var css = ejs.render(tpl, data).replace(/^\n/mg, '')
                fs.writeFileSync('src/sass/_slice.scss', css)
            }
        ])
    })

    gulp.task('default', ['dev_conn'], function(){
        gulp.watch('src/img/slice/**', ['dev_slice2css'])
        gulp.watch('src/svg/slice/**', ['dev_svg'])
        gulp.watch('src/tpl/**', ['dev_ejs'])
        gulp.watch('src/sass/**', ['dev_sass'])
        gulp.watch('src/img/**', reload)
        gulp.watch('src/svg/**', reload)
        gulp.watch('src/js/**', ['dev_js'])
        gulp.watch('src/*.html', ['dev_html'])
    })

}