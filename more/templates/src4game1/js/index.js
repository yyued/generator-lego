(function($){
	 //返回顶部
    backtoTop();
    function backtoTop(){
    var sTop=$(window).scrollTop();
     	if(sTop > 500){
            $('#backtoTop').stop().animate({opacity:1}, 200)
        } else{
            $('#backtoTop').stop().animate({opacity:0}, 200)
        }
        $(window).scroll(function(){
            var scrollTop=$(this).scrollTop();
            if(scrollTop > 200){
            $('#backtoTop').stop().animate({opacity:1}, 200)
            } else{
            $('#backtoTop').stop().animate({opacity:0}, 200)
            }
        }).on('resize',function(){
            var winW=$(window).width();
            if(winW < 1350){
            	$('#backtoTop').stop().animate({opacity:0}, 200)
            } else{
            	$('#backtoTop').stop().animate({opacity:1}, 200)
            }
        })
    }
    $('body').on('click','.backtoTop',function () {
        $("body,html").stop().animate({
            scrollTop: 0
        },200,function(){
        	$('#backtoTop').stop().animate({opacity:0}, 200)
        })
    })
})(jQuery)