# generator-lego

> f2e workflow, base on yeoman & gulp

## Getting Started
0. 假定你已经安装了`node`和`grunt`环境
1. `npm install -g yeoman`
2. `npm install -g gulp`
3. `npm install -g generator-lego`
4. `yo lego`初始化项目
5. `gulp`或者`grunt`开始开发

## Usage

### 初始化项目
执行`yo lego`，初始化PC类的项目。
或者，执行`yo lego:mobi`，初始化移动类型的项目。


### 使用`gulp`开发与发布

#### `gulp`
创建一个链接，自动检测`src`文件夹下的静态文件，自动刷新。支持sass编译。

#### `gulp -p 8080`
同上，`-p`参数指定特定端口。

#### `gulp release`
将静态文件压缩到`dest/`。


### 使用`grunt`开发与发布 （详见[duowan/workflow][1]）

#### `grunt` 或者 `grunt port:8088`
创建一个链接（默认端口9000），自动检测`src/**`下静态文件，自动刷新。支持sass编译、ejs模板编译、多雪碧图合并。

#### `grunt release`
将静态文件压缩到`dest/`。

#### `grunt commit:提交注释`
将`dest/`提交至静态文件svn。提示：提交后到`code.duowan.com`发布。

#### `grunt zip`
打包`src/**`和`dest/**`，其中`dest/*.html`替换成线上路径。


[1]: https://github.com/duowan/workflow

## Release History
_(Nothing yet)_
