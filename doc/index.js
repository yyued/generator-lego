"use strict";
var yeoman = require('yeoman-generator'),
	chalk = require('yeoman-generator/node_modules/chalk'),
	log = console.log;

var win32 = process.platform === 'win32';

var LegoGenerator = yeoman.generators.Base.extend({
	
	// 资源文件拷贝
	writing: function(){
		this.directory('doc', 'doc')
		// this.copy('README.md', 'README.md')
	},
	end: function(){
		log(chalk.bold.green('操作完毕!'))
	}
});


module.exports = LegoGenerator;