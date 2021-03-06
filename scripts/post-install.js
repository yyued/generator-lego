#!/usr/bin/env node
var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')

var win32 = process.platform === 'win32'
var homeDir = process.env[ win32? 'USERPROFILE' : 'HOME']
var libPath = path.join(homeDir, '.generator-lego', 'node_modules')
var configPath = path.join(homeDir, '.generator-lego', 'config.json')

// USERPROFILE 文件夹创建
mkdirp.sync(libPath)
fs.writeFileSync(configPath, JSON.stringify({}, null, 4), { encoding: 'utf8' })