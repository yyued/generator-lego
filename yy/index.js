"use strict";
var yeoman = require('yeoman-generator'),
	glob = require('yeoman-generator/node_modules/glob'),
	_ = require('yeoman-generator/node_modules/lodash'),
	chalk = require('yeoman-generator/node_modules/chalk'),
	path = require('path'),
	exec = require('child_process').exec,
	fs = require('fs'),
	del = require('del'),
	log = console.log;

var win32 = process.platform === 'win32';

var LegoGenerator = yeoman.generators.Base.extend({
	
	// 1. 提问前的准备工作
	init: function (){
		this.conflicter.force = true

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
			log(chalk.bold.green('node_modules 软连接创建完毕!'))
		}
		if(_.contains(dirs, 'src')){
			log(chalk.bold.green('资源已初始化，退出...'))
			setTimeout(function(){
				process.exit(1)
			}, 200)
		}

		// 当前模板的全局配置数据，配置svn信息和命令执行的参数
		this.gConfig = this.src.readJSON('.yo-rc.json')
	},

	// 2. 提问
	prompting: function(){
		var done = this.async()
		this.projectAuthor = process.env.USER
		var timestamp = +new Date()
		var questions = [
			{
				name: 'projectAssets',
				type: 'list',
				message: '初始的静态资源:',
				choices: [
					{
						name: 'pc模板(带lego样式库)',
						value: 'src4lego',
						checked: true
					},{
						name: 'pc模板(不带lego样式库)',
						value: 'src4pc'
					},{
						name: 'mobi模板(带legomobi样式库)',
						value: 'src4legomobi'
					},{
						name: '新游戏一线专区模板',
						value: 'src4game1'
					}
				]
			},{
				name: 'projectFamily',
				type: 'list',
				message: 'CDN根目录（项目类型）:',
				choices: [
					{
						name: 'special',
						value: 'special',
						checked: true
					},{
						name: 'project',
						value: 'project'
					},{
						name: 'game',
						value: 'game'
					}
				]
			},{
				name: 'projectName',
				message: 'CDN二级目录（项目名称）',
				default: timestamp.toString(),
				validate: function(val){
				    var done = this.async();
				    setTimeout(function() {
						if (/[^a-zA-Z_-\d\/]+/.test(val)) {
				        	done("非法字符，只能是数字、字符、下划线的组合");
				        	return;
				      	}
				      	if (val.trim() === ''){
				      		done("不能为空");
				        	return;	
				      	}
				      	done(true);
				    }, 100);
				}
			},{
				name: 'projectVersion',
				message: 'CDN三级目录（项目版本号）',
				default: '1.0.0'
			}
		]
		if(!this.gConfig.svnUsr){
			questions.push({
				name: 'svnUsr',
				message: 'svn用户名',
				default: this.gConfig.svnUsr||''
			},{
				name: 'svnPwd',
				message: 'svn密码',
				default: this.gConfig.svnPwd||''
			})
		}
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
		this.gConfig.svnUsr = this.svnUsr?this.svnUsr:this.gConfig.svnUsr
		this.gConfig.svnPwd = this.svnPwd?this.svnPwd:this.gConfig.svnPwd
		this.write(path.join(__dirname, 'templates', '.yo-rc.json'), JSON.stringify(this.gConfig, null, 4), {encoding: 'utf8'})
		
		// 拷贝资源文件，资源文件可以通过`<%= %>`读取当前实例的数据
		this.directory(this.projectAssets, 'src')
		this.directory('tasks', 'tasks')
		this.copy('gulpfile.js', 'gulpfile.js')
		this.copy('package.json', 'package.json')
	},

	// 4. 拷贝后执行命令 如建立软链接等
	end: function(){
		// 文件转移后，删除不需要的文件
		del(['src/**/.gitignore','src/**/.npmignore'])
		
		// 安装包依赖，然后执行`gulp`
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