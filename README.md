# generator-lego

> *generator-lego* 基于gulp的前端工作流


### <a name="top"></a>目录
* [主要功能](#intro)
* [环境准备](#sys-env)
* [安装](#install)
* [使用](#usage)
* [资源文件结构](#file-tree)
* [任务说明](#task-dtls)
* [功能说明](#func-dtls)
* [已知问题](#known-issues)
* [License](#license)


### <a name="intro"></a>主要功能 [[⬆]](#top)
这是一个帮助前端开发工程师简化工作的工具，它的主要功能是：

* 初始化项目目录结构及文件
* 建立本地静态文件web服务，监听文件变化自动刷新浏览器
* 实时编译：sass、ejs
* 资源合并：[多雪碧图合并、2x、3x拼图][4]、svg合并
* 资源压缩：图片、样式、脚本
* 自动补全css3浏览器前缀
* zip打包


### <a name="sys-env"></a>环境准备 [[⬆]](#top)
1. Node 环境：*默认此步骤已完成*  （Mac用户建议使用 [Brew] 安装 [Node.js]） 
2. Yeoman和Gulp：
	* `npm install -g yo`
	* `npm install -g gulp`  		
3. 图片编辑环境:
	* mac 用户
		* `brew install GraphicsMagick` 
		* `brew install phantomjs` 	
	* win 用户
		* [GraphicsMagick 下载地址][1] 备胎：[GraphicsMagick-1.3.20-**Q8**-win**32/64**-dll.zip](http://pan.baidu.com/s/1qWDE7Y8#path=%252Ff2e-workflow)
		* [phantomjs 下载地址][2]  备胎：[phantomjs-1.9.7-windows.zip](http://pan.baidu.com/s/1qWDE7Y8#path=%252Ff2e-workflow)
		* [添加环境变量][3]  设置环境变量后，重启系统。

### <a name="install"></a>安装 [[⬆]](#top)
1. 在 [主页][7] 点击【clone in desktop】克隆到本地
2. 在本地的克隆目录里执行 `npm link`
	
### <a name="usage"></a>使用 [[⬆]](#top)
打开终端进入任意空目录执行 `yo lego`，该命令按顺序执行以下逻辑：

1. 在当前文件夹里创建`node_modules/`软连接，链接源是`<lego>/node_modules/ `。通过建立软连接并将链接源指定为同一个文件夹来避免`node_modules`重复安装。
2. 终端显示初始化配置项，等待用户选择
	* 要拷贝的资源类型：PC端还是移动端
	* 上传到 CDN 的路径
3. 根据配置项 **生成 gulp 配置文件**、**进行资源文件拷贝**
4. 执行命令`npm install`，根据npm规范安装或更新`node_modules`。
5. 执行命令`gulp`，开始编码工作。

![showcase01](https://cloud.githubusercontent.com/assets/1762523/4558145/146cf2e4-4edc-11e4-8e21-9d408776a14d.gif)

### <a name="file-tree"></a>资源文件结构 [[⬆]](#top)
![init-direcotry](https://cloud.githubusercontent.com/assets/1762523/7699489/cc87ce62-fe4a-11e4-9aa2-113cd3fa542d.png)




### <a name="task-dtls"></a>任务说明 [[⬆]](#top)
#### 任务简介
1. 开发阶段，执行`gulp`，建立一个本地静态文件web服务；检测文件 `src/**`变化，自动刷新；检测`src/`指定子文件夹执行编译或胶水任务。
2. 构建阶段，执行`gulp build`，在 `src/` 目录基础上，执行编译任务后，再对资源进行合并和压缩，生成可直接部署的静态资源到 `dest/ `文件夹。
3. 打包功能，执行`gulp zip`，将`dest/*.html` 的相对路径的资源引用替换为线上路径；再将`src/ `和 `dest/ `打成 zip包。

#### 开发
* sass 编译
	* 检测文件`sass/**`，生成样式到`css/`
	* 自动追加css3浏览器前缀
	* 文件内嵌 sourcemaps
* 生成切片样式
	* 检测文件`img/slice/**`，生成切片样式到`sass/_slice.scss`
* svg 合并
	* 检测文件`svg/slice/**`，生成合并好后的 svg文件到`svg/symbol.svg`
* ejs 模板渲染
	* 检测文件`tpl/**`，生成html 到`/`
	
![gulp-dev](https://cloud.githubusercontent.com/assets/1762523/7699278/5c309cbc-fe49-11e4-80f1-626bd0e352f2.png)

![ga-mark](https://cloud.githubusercontent.com/assets/1762523/7699279/5c30b5c6-fe49-11e4-8c93-82779420b6d1.png)


#### 构建
1. 编译：sass、ejs
2. 合并：合并雪碧图，更新样式；合并svg
3. 压缩：样式、脚本、图片

![gulp-build](https://cloud.githubusercontent.com/assets/1762523/7699280/5c315b48-fe49-11e4-9f63-444071d489a4.png)


#### 打包
1. dest/*.html 的资源路径引用替换为线上路径
2. 将 src/ 和 dest/ 文件夹压缩为 zip包

![gulp-zip](https://cloud.githubusercontent.com/assets/1762523/7699281/5c34bc02-fe49-11e4-8fc2-b7acdd2d1e8e.png)

#### 其他命令参数
1. `gulp [-p <port>] `
	* `-p` port 的简写，给webserver指定端口号；此参数需要指定参数值作为端口号，如：8080

2. `gulp build [-p <port>]`
	* `-p` port 的简写，给webserver指定端口号；此参数需要指定参数值作为端口号，如：8080

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


### <a name="known-issues"></a>已知问题 [[⬆]](#top)
1. win下 `npm install gulp-sass@2.0.0` 报 git命令没有找到，导致安装失败 
	* 临时处理，在 git shell 下执行`npm install gulp-sass@2.0.0`
	* 该问题依赖模块已解决，等待官方下个版本更新 [issue][5]、[issue][6]


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
[7]: https://github.com/duowan/generator-lego