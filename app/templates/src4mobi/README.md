# YY UED 2015移动端解决方案（纯净版）


### 目录结构：

	src----sass---base---_base.scss	                              // 基础样式
		  |		    | 	|
		  |         |   |
		  |         |   |-_tool.scss                             // 工具类使用样式
		  |         |---_slice.scss                              // 切片样式文件
		  |         |
		  |         |---_global.scss                             // 需要导入的全局公共样式
		  |			|
		  |			|---index.scss                               // 自定义样式文件
		  |
		  |---css
		  |
		  |---js---index.js                                      // 自定义脚本文件
		  |      |
		  |      |
		  |      |---module----header.js....                     // 自定义模块脚本文件
		  |
		  |---img---slice                                        // 工作流切片图片文件夹
		  |
		  |
		  |
          |---tpl---partial---header.ejs....                     // HTML模板库文件夹
		  |		   |
		  |        |
		  |		   |--index.ejs.... 		                      // 调用用HTML模板文件
		  |
		  |
		  |---index.html



---

### 公用部分

1. SASS

		页面样式需要引入 全局公共SCSS文件：
		脚手架生成 src/sass/_global.scss
		ps: 无须编译的sass文件，命名需要带下划线开头

2. JS

		页面脚本seaJS模块化配置脚本：
		http://assets.dwstatic.com/mobile/src/js/main/seajs/sea-lego.js

		可直接加载模块包括：
		paths: {
		'legoPath': 'http://assets.dwstatic.com/mobile/src/js/'
		},
		alias: {
			'zepto': 'legoPath/main/zepto/zepto.min.js',              // 基础核心zepto包
			'touch': 'legoPath/main/zepto/zepto.touch.js',            // zepto tap等事件扩展包
			'fx':  'legoPath/main/zepto/zepto.fx.js',                 // zepto animate等方法扩展包
			'scroll': 'legoPath/main/zepto/zepto.scroll.js',          // zepto scrollTop等方法扩展包
			'expand': 'legoPath/module/expand/expand.js',             // zepto 自定义方法扩展包
			'swiper': 'legoPath/module/swiper/swiper.min.js',         // swiper(轮播)核心包
	      	'iscroll': 'legoPath/module/iscroll/iscroll.js',          // iscroll(滑动)核心包
	      	'hammer': 'legoPath/module/iscroll/hammer.min.js',        // hammer(手势)核心包
	      	'hbURL': 'legoPath/module/hideBrowserURL/hideBrowserURL.js',// 隐藏UCQQ等浏览器地址栏
		}

---  

### REM布局

1. 自动设置头部viewport，头部引入JS脚本

		<script src="http://assets.dwstatic.com/mobile/viewport.js"></script>

	使用方式，如：

		<!doctype html>
		<html>
		<head>
		    <meta charset="utf-8">
		    <script src="http://assets.dwstatic.com/mobile/viewport.js"></script>
		    <meta name="format-detection" content="telephone=no,address=no,email=no">
		    <title> 模板页 </title>
		</head>


2. Sass工具类模块包含REM转换函数：

		/* @name: 转为REM单位fn
		 * @ps: 默认宽度为750px
		 */
		@function toRem($px , $width: 750px) {
			// 动态尺寸单位
			$ppr: $width / 16 / 1rem;
			@return ($px / $ppr);
		}

 	使用方式，如：

		#div{
		    width: 100%;
		    height: toRem(100px);
		    background-color: red;
		}
