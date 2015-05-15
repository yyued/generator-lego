# generator-lego

> *generator-lego* 基于gulp的前端工作流


### <a name="top"></a>目录
* [主要功能](#intro)
* [环境准备](#sys-env)
* [快速开始](#quick-start)
* [文件结构](#file-tree)
* [功能说明](#func-dtls)
* [任务说明](#task-dtls)
* [Demo](#show-case)
* [已知问题](#known-issues)
* [License](#license)


### <a name="intro"></a>主要功能 [[⬆]](#top)
这是一个帮助前端开发工程师简化工作的工具，它的主要功能是：

* WebServer
* 监听匹配文件的变化自动刷新浏览器
* 初始化项目目录结构及文件
* 自动编译SASS
* 自动补全CSS3浏览器前缀
* 支持ejs模板
* [多雪碧图合并、2x、3x拼图][4]
* 压缩图片
* 发布到svn
* zip打包


### <a name="sys-env"></a>环境准备 [[⬆]](#top)
1. Node 环境：*默认此步骤已完成*  （Mac用户建议使用 [Brew] 安装 [Node.js]） 
2. Yeoman环境：`npm install -g yo`
3. Gulp 环境：`npm install -g gulp`
4. 图片编辑环境(Mac)：
	* `brew install GraphicsMagick` 
	* `brew install phantomjs` 
5. 图片编辑环境(Win)：
	* [GraphicsMagick 下载地址][1] 备胎：[GraphicsMagick-1.3.20-**Q8**-win**32/64**-dll.zip](http://pan.baidu.com/s/1qWDE7Y8#path=%252Ff2e-workflow)
	* [phantomjs 下载地址][2]  备胎：[phantomjs-1.9.7-windows.zip](http://pan.baidu.com/s/1qWDE7Y8#path=%252Ff2e-workflow)
	* [添加环境变量][3]  设置环境变量后，重启系统。


### <a name="quick-start"></a>快速开始 [[⬆]](#top)
* 点击右边【clone in desktop】克隆到本地
* 在克隆目录执行 `npm link` 链接到全局模块的位置
* 在任意空目录执行 `yo lego` 初始化项目


### <a name="file-tree"></a>文件结构 [[⬆]](#top)
`generator-lego` 初始化和执行任务涉及的文件结构：

```
yourProj/
│
├── package.json                // 项目依赖定义
├── gulp.js                     // gulp配置任务入口
├── tasks/ 						// gulp任务流，开发、构建、发布等
│
├── node_modules    			  // `npm install` 拉取依赖包
│
├── src/                        // 开发目录
│    ├── css/                   
│    │   └── global.css         // 经过sass编译后的出口css文件
│    ├── sass/                  // sass源文件
│    ├── img/                   // 仅 Copy 不做操作
│    │   └── slice/             // 切片文件夹，拼雪碧图用
│    ├── js/                    // 仅 Copy 不做操作
│    ├── tpl/                   // 仅 Copy 不做操作，用来存放ejs模板
│    └── _index.html             
│    
└── dest/                       // 发布目录，执行 `gulp build` 生成
    ├── css/                    
    │   └── global.css
    ├── img/                   
    ├── js/                     
    └── index.html               
```

### <a name="func-dtls"></a>功能说明 [[⬆]](#top)
#### ejs模板
* 参与ejs编译的文件匹配路径`src/tpl/*.ejs`
* 文件夹`src/tpl`可内建子文件夹，存放被引用的代码片段；子文件夹不会编译出html文件
* 开发阶段，编译后生成的html文件，位于`src/`；如已有同名html文件，覆盖之
* 构建阶段，编译后生成的html文件，位于`dest/`；同样覆盖同名html文件

#### 雪碧图合并
* 切片放在文件夹`src/slice/`，该文件夹可继续创建子文件夹存放切片
* 需要合并的切片，使用`background-image:url()`引入切片样式，不要使用`background`属性的缩写
* 详细说明移步 [多雪碧图合并、2x、3x拼图][4]


### <a name="task-dtls"></a>任务说明 [[⬆]](#top)
#### 初始化项目
* 执行`yo lego`，按如下规则初始化
	* 如当前文件夹没有`node_modules`，则创建软连接
	* 如当前文件夹存在`src`，则退出
	* 否则，继续执行初始化过程

#### 开发
* `gulp` 创建一个链接，自动检测`src`文件夹下的静态文件，自动刷新。支持sass、ejs编译。

#### 构建
* `gulp build` 将静态文件压缩到 `dest/`，该阶段会执行雪碧图合并、ejs编译。

#### 打包
* `gulp zip` 将源码和构建后代码压缩成一个zip包。

#### 其他命令参数
1. `gulp [-p <port>] [-w] `
	* `-p` port 的简写，给webserver指定端口号；此参数需要指定参数值作为端口号，如：8080
	* `-w` watch 的简写，检测slice文件夹，自动生成scss样式；此参数不需指定参数值

2. `gulp build [-p <port>]`
	* `-p` port 的简写，给webserver指定端口号；此参数需要指定参数值作为端口号，如：8080


### <a name="show-case"></a>Demo [[⬆]](#top)
![showcase01](https://cloud.githubusercontent.com/assets/1762523/4558145/146cf2e4-4edc-11e4-8e21-9d408776a14d.gif)

### <a name="known-issues"></a>已知问题 [[⬆]](#top)
1. win下 `npm install gulp-sass@2.0.0` 报 git命令没有找到，导致安装失败 
	* 临时处理，在 git shell 下执行`npm install gulp-sass@2.0.0`
	* 该问题依赖模块已解决，等待官方下个版本更新[issue][5][issue][6]


### <a name="license"></a>License [[⬆]](#top)
Released under [MIT] LICENSE


---
[Brew]: http://brew.sh/
[Node.js]: http://nodejs.org/
[yeoman]:http://yeoman.io/
[gulp]:https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started
[MIT]: http://rem.mit-license.org/
[1]: http://www.graphicsmagick.org/download.html
[2]: http://phantomjs.org/download.html
[3]: https://github.com/hzlzh/f2e-workflow/issues/6
[4]: https://github.com/twlk28/multi-sprite
[5]: https://github.com/sass/node-sass/issues/933
[6]: https://github.com/sass/node-sass/pull/943