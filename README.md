# generator-lego

> *generator-lego* 基于gulp的前端工作流


### <a name="top"></a>目录
* [快速开始](#quick-start)
* [文件结构](#file-tree)
* [环境准备](#sys-env)
* [任务说明](#task-dtls)
* [Demo](#show-case)
* [已知问题](#known-issues)
* [License](#license)

### <a name="quick-start"></a>快速开始 [[⬆]](#top)
提供以下2种获取方式：	

1. Clone the repo
	* `git clone git@github.com:duowan/generator-lego.git`
	* 在克隆目录执行 `npm link` 链接到全局模块的位置
	* 在空目录执行 `yo lego` 初始化项目
2. npm
	* `npm install -g generator-lego`	
	* 在空目录执行 `yo lego` 初始化项目

### <a name="file-tree"></a>文件结构 [[⬆]](#top)
`generator-lego` 初始化和执行任务涉及的文件结构：

```
yourProj/
│
├── package.json                // 项目依赖定义
├── gulp.js                     // 配置任务
│
├── node_modules    			  // `npm install` 拉取依赖包
│
├── src/                        // 开发目录
│    ├── css/                   
│    │   └── global.css         // 经过sass编译后的出口css文件
│    ├── sass/                  // sass源文件
│    ├── img/                   // 仅 Copy 不做操作
│    ├── js/                    // 仅 Copy 不做操作
│    └── index.html             
│    
└── dest/                       // 发布目录，执行 `gulp release` 生成
    ├── css/                    
    │   └── global.css
    ├── img/                   
    ├── js/                     
    └── index.html               
```

### <a name="sys-env"></a>环境准备 [[⬆]](#top)
1. Node 环境：*默认此步骤已完成*  （Mac用户建议使用 [Brew] 安装 [Node.js]） 
2. Yeoman环境：`npm install -g yo`
3. Gulp 环境：`npm install -g gulp`

### <a name="task-dtls"></a>任务说明 [[⬆]](#top)
#### 初始化项目
* 执行`yo lego`，初始化PC类的项目。
* 或者，执行`yo lego:mobi`，初始化移动类型的项目。

#### 开发
* `gulp` 创建一个链接，自动检测`src`文件夹下的静态文件，自动刷新。支持sass编译。
* `gulp -p 8080` 同上，`-p`参数指定特定端口。

#### 发布
* `gulp release` 将静态文件压缩到 `dest/`。

### <a name="show-case"></a>Demo [[⬆]](#top)
//TODO

### <a name="known-issues"></a>已知问题 [[⬆]](#top)
* sass编译出错中断console 。 [见issue][1]

### <a name="license"></a>License [[⬆]](#top)
Released under [MIT] LICENSE

---
[1]: https://github.com/jking90/docpad-plugin-nodesass/issues/14
[Brew]: http://brew.sh/
[Node.js]: http://nodejs.org/
[yeoman]:http://yeoman.io/
[gulp]:https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started
[MIT]: http://rem.mit-license.org/

