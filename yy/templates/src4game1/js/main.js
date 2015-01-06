(function($,w){
    //'use strict';
    
    //定义专区对象
    w.ZQ = {};

    /**
     * [imageLightbox 专区文章页，文章内容图片格式化，为文章内图片添加lightbox插件功能]
     * @return {[type]} [description]
     */
    ZQ.imageLightbox = function(){
        var imgList,
            articalTitle;

        var _init = function(){

            //动态脚本缓存
            $.ajaxSetup({
              cache: true
            });

            //添加lightbox插件样式，脚本
            var cssHtml = '<link rel="stylesheet" href="http://assets.dwstatic.com/common/lib/lightbox/css/lightbox.css">';
            $("head").append(cssHtml);
            $.getScript("http://assets.dwstatic.com/common/lib/lightbox/js/lightbox.js");

            //文章图片
            imgList = $( "#text img" );
            //文章题目
            articalTitle = $("h1").text();
            imgList.each(function(index, el) {
                $(this).wrap('<a href="'+ $(this).attr("src") +'" data-lightbox="zq-article-pop" data-title="'+ articalTitle +'"></a>');
            });
        }

        $(function(){
            _init();
        })
    }

    /**
     * [aniHead 头图视差移动]
     * @type {Object}
     */
    ZQ.aniHead = {
        speed : 1200,
        zqhead : "",
        scrollSign : 1,
        scrollTem : 0,
        init : function(){
            var _this = this;
            if( this.zqhead == "" ){
                this.zqhead = $(".ZQ__head");
                this.scrollTem = $("body").scrollTop();
            }
            this.scrollControl();
        },
        scrollControl : function(){
            var _this = this;
            $(w).scroll(function(event) {
                var tem = $("body").scrollTop() - _this.scrollTem;
                _this.scrollTem = $("body").scrollTop();
                if( $("body").scrollTop() > 50 && tem > 0 ){
                    _this.scrollImage( 1 );
                }
                else if( $("body").scrollTop() < 50 && tem < 0 ){
                    _this.scrollImage( -1 );
                }
                /* Act on the event */
            });
        },
        scrollImage : function(scroll){
            var add,
                _this = this;
            //已经进行滚动后，不向下滚动
            if( this.scrollSign == 0 &&  scroll > 0 ){
                return;
            }
            //未进行滚动，不向上滚动
            else if( this.scrollSign == 1 &&  scroll < 0 ){
                return;
            }
            else{
                if( scroll > 0 )
                {
                    add = "+=50";
                    this.scrollSign = 0;
                }
                else{
                    add = "-=50";
                    this.scrollSign = 1;
                }
                this.zqhead.animate({
                    "background-position-y": add },
                    _this.speed, function() {
                    /* stuff to do after animation is complete */

                });
            }
        }
    }

    $(function(){
        //ZQ.aniHead.init();
    })


})(jQuery,window);