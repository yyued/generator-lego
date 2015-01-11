"use strict";
var yeoman = require('yeoman-generator'),
	glob = require('yeoman-generator/node_modules/glob'),
	_ = require('yeoman-generator/node_modules/lodash'),
	path = require('path'),
	exec = require('child_process').exec,
	fs = require('fs'),
	del = require('del'),
	log = console.log;

var win32 = process.platform === 'win32';

var LegoGenerator = yeoman.generators.Base.extend({
	
	// 1. 提问前的准备工作
	init: function (){
		// 当前模板的全局配置数据，配置svn信息和命令执行的参数
		this.gConfig = this.src.readJSON('.yo-rc.json')

		// 初始环境检测
		// 若当前目录没有node_modules文件夹，则建立软连接；否则继续
		// 若当前存在src文件夹，则退出；否则继续
		var dirs = glob.sync('+(src|node_modules)')
		if(!_.contains(dirs, 'node_modules')){
			if(win32){
				require('child_process').exec('mklink /d .\\node_modules '+ path.join(__dirname, '..', 'node_modules') )
			}else{
	        	this.spawnCommand('ln', ['-s', path.join(__dirname, '..', 'node_modules'), 'node_modules'])
			}
			console.log('node_modules 软连接创建完毕!')
		}
		if(_.contains(dirs, 'src')){
			console.log('资源已初始化，退出...')
			process.exit(1)
		}
	},

	// 2. 提问
	prompting: function(){
		var done = this.async()
		this.projectAuthor = process.env.USER
		this.projectName = path.basename(process.cwd())
		// 读取assetsURL列表，提供选择或输入
		// 
		var questions = [
			{
				name: 'assetsDir',
				type: 'list',
				message: '初始的静态资源:',
				choices: [
					{
						name: 'PC端基础样式',
						value: 'src4pc',
						checked: true
					},{
						name: '移动端基础样式',
						value: 'src4mobi'
					}
				]
			}
		]
		this.prompt(questions, function(answers){
			for(var item in answers){
				answers.hasOwnProperty(item) && (this[item] = answers[item])
			}
			done()
		}.bind(this))
	},

	// 3. 资源文件拷贝
	writing: function(){
		// 同步问答结果，更新当前模板的配置数据
		// this.gConfig.assetsURL = this.assetsURL
		// this.write(path.join(__dirname, 'templates', '.yo-rc.json'), JSON.stringify(this.gConfig, null, 4), {encoding: 'utf8'})
		
		// 拷贝资源文件，资源文件可以通过`<%= %>`读取当前实例的数据
		this.directory(this.assetsDir, 'src')
		this.directory('tasks', 'tasks')
		this.copy('gulpfile.js', 'gulpfile.js')
		this.copy('package.json', 'package.json')
	},

	// 4. 拷贝后执行命令 如建立软链接等
	end: function(){
		// 文件转移后，删除不需要的文件
		del(['src/**/.gitignore','src/**/.npmignore'])
		
		// 安装包依赖后，执行`gulp`
		// https://github.com/yeoman/generator/blob/45258c0a48edfb917ecf915e842b091a26d17f3e/lib/actions/install.js#L67-69
	    this.installDependencies({
	    	bower: false,
 			npm: true,
	    	skipInstall: false,
	    	callback: execAfterInstall.bind(this)
	    })

        function execAfterInstall(){
			if(!win32){
	        	if(this.gConfig['open_app']){
	        		this.spawnCommand('open', ['-a', this.gConfig['open_app'], '.'])
	        	} 
			}
        	this.spawnCommand('gulp', ['-w'])
            log('资源初始化完毕! 现在可以 coding...')
        }
	}

});

module.exports = LegoGenerator;