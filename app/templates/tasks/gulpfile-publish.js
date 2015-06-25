module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        path = require('path'),
        svn = require('svn-push'),
        log = console.log;

    var that = this;
    that.message = argv.m || '初始化项目';
    var pkg = require('../package.json');
    var proj_namespace = [pkg.description, pkg.name, pkg.version+'/'].join('/')

    var homedir = process.env[(process.platform == 'win32')?'USERPROFILE':'HOME']
    var config = require(homedir+'/.generator-lego/config.json')

    gulp.task('publish', function(){
        svn({
            message: that.message,
            username: config.svnUsr,
            password: config.svnPwd,
            trymkdir: true,
            pushIgnore: ['*.html', '.DS_Store', '.idea/**', '.tmp_svn/**', '.svn/**'],
            src: 'dest',
            dest: 'http://svn.duowan.com:9999/svn/web/program/assets/' + proj_namespace,
            tmp: '.tmp_svn'
        })
    })  

}