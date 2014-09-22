"use strict";
var yeoman = require('yeoman-generator'),
	path = require('path'),
	exec = require('child_process').exec,
	fs = require('fs'),
	log = console.log;


var LegoGenerator = yeoman.generators.Base.extend({
	
	init: function (){
		// global config for prompting & shell script
		this.gConfig = this.src.readJSON('.yo-rc.json')
	},

	prompting: function(){
		var done = this.async()
		var questions = [
			{
				name: 'projectFamily',
				type: 'list',
				message: 'which Project Type do you need:',
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
				message: 'Project Name',
				default: path.basename(process.cwd())
			},{
				name: 'projectVersion',
				message: 'Project version',
				default: '1.0.0'
			},{
				name: 'projectAuthor',
				message: 'Author Name',
				default: this.gConfig.projectAuthor||''
			// },{
			// 	name: 'svnUsr',
			// 	message: 'svn committer',
			// 	default: this.gConfig.svnUsr||''
			// },{
			// 	name: 'svnPwd',
			// 	message: 'svn password',
			// 	default: this.gConfig.svnPwd||''
			}
		]
		this.prompt(questions, function(answers){
			for(var item in answers){
				answers.hasOwnProperty(item) && (this[item] = answers[item])
			}
			done()
		}.bind(this))
	},

	configuring: function(){
		// this.config.set('ftp-user', '')
	},

	writing: function(){
		this.directory('src', 'src')
		this.directory('tools', 'tools')
		this.copy('gulpfile.js', 'gulpfile.js')
		this.copy('package.json', 'package.json')		
		// this.copy('bower.json', 'src/bower.json')
		// GruntfileEditor.init( fs.readFileSync(path.join(__dirname, 'templates', 'Gruntfile.js')) )
		// GruntfileEditor.addGlobalDeclarationRaw('SVN_USR', '"'+this.svnUsr+'"')
		// GruntfileEditor.addGlobalDeclarationRaw('SVN_PWD', '"'+this.svnPwd+'"')

		// cover the global config
		this.gConfig.projectAuthor = this.projectAuthor
		// this.gConfig.svnUsr = this.svnUsr
		// this.gConfig.svnPwd = this.svnPwd
		this.write(path.join(__dirname, 'templates', '.yo-rc.json'), JSON.stringify(this.gConfig, null, 4), {encoding: 'utf8'})
	},

	end: function(){
		if(process.platform === "darwin"||"linux"){
        	this.spawnCommand('ln', ['-s', path.join(__dirname, 'templates', 'lib'), 'node_modules'])
        	// this.spawnCommand('bower', ['install'], {cwd: 'src'})
        	if(this.gConfig['open_app']){
        		this.spawnCommand('open', ['-a', this.gConfig['open_app'], '.'])
        	} 
        	this.spawnCommand('gulp')
		}
		if(process.platform === "win32"){
			this.spawnCommand('mklink', ['/d', '.\\node_modules', path.join(__dirname, 'templates', 'lib')])
        	// this.spawnCommand('bower', ['install'], {cwd: 'src'})
        	if(this.gConfig['open_app']){
        		this.spawnCommand('start', ['', this.gConfig['open_app'], '.'])			
        	}
		}
        this.installDependencies()
        this.log('done!')
	}

});

module.exports = LegoGenerator;