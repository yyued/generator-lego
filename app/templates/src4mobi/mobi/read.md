## YY UED 2015移动端解决方案

> 目录结构：

	src----sass---common---base---base.scss	                  // 基础样式库
		  |		    |       |
		  |         |       |--tool---easy-animation.scss....    // sass工具库
		  |         |       |
		  |         |       |--UI--ui(button,form....)           // ui元素库
		  |		    |       |      
		  |         |       |--component--slider---slider.scss.. // 组件样式库
		  |         | 		 |
		  |			|        |-- _mobile-lego.scss               // 需要导入的总括scss文件
		  |			|
		  |         |
		  |         |-slice---slice.scss                         // 切片样式
		  |         |
		  |         |-index.scss                                 // 自定义样式
		  |
		  |---css
		  |
		  |---js---index.js                                      // 自定义脚本
		  |      |		  
		  |      |
		  |      |---module----header.js                         // 自定义组件模块脚本
		  |		             |
		  |					 |-footer.js             
		  |
		  |---img
		  |
		  |---slice                                              // 工作流切片图片
		  |						
		  |			
          |---tpl---partial---header.ejs                         // HTML模板库
		  |		   |          |
		  |        |          |.......
		  |        |
		  |		   |--index.ejs..... 		                      // 调用用HTML模板
		  |	   
		  |
		  |---index.html



- - -


> 公用部分

1. SASS
	
		页面样式需要引入公共SCSS文件：
		脚手架生成 src/sass/common/_mobile-lego.scss 
	
2. JS

		页面脚本seaJS模块化配置脚本：
		http://assets.dwstatic.com/mobile/src/js/main/seajs/sea-lego.js
		
		可直接加载模块包括：
		paths: {
		'legoPath': 'http://assets.dwstatic.com/mobile/src/js/'
		},
		alias: {
			'zepto': 'legoPath/main/zepto/zepto.min.js',// 基础核心zepto包
			'touch': 'legoPath/main/zepto/zepto.touch.js',// zepto tap等事件扩展包
			'fx':  'legoPath/main/zepto/zepto.fx.js',// zepto animate等方法扩展包
			'scroll': 'legoPath/main/zepto/zepto.scroll.js',// zepto scrollTop等方法扩展包
			'expand': 'legoPath/module/expand/expand.js',// zepto 自定义方法扩展包
			'swiper': 'legoPath/module/swiper/swiper.min.js',// swiper(轮播)核心包
	      	'iscroll': 'legoPath/module/iscroll/iscroll.js',// iscroll(滑动)核心包
	      	'hammer': 'legoPath/module/iscroll/hammer.min.js',// hammer(手势)核心包
		}      	
      	
  
- - -  
      	
 > 插件
 
 1. scroll
 	
 	参考svn/assets/mobile/demo/scroll目录下相关demo
 
 2. swiper 
 
 	参考[官网API](http://www.swiper.com.cn/api/index.html) 或 参考svn/assets/mobile/demo/swiper目录下相关demo 
 		
 		
 3. expand方法包：
 	     	
 	     · 仿jquery slideDown收起效果 - slideDown
 	     · 仿jquery slideUp收起效果 - slideUp
 	     · 


- - -

> 最近更新
  
  20150504 - 新增 hammer(手势)