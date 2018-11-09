
(function(){

        var winH=$(window).height();
        var winW=$(window).width();

  if(winW<=767){
	  var deviceWidth = "",
		  d = document.documentElement;
	  window.onresize = setFont;
	  setFont();
	  function setFont(){
		deviceWidth = Math.min(750, window.innerWidth, d.clientWidth);
		d.style.fontSize = deviceWidth / 7.5 + "px";
	  };
	  	  
  }	
})()


$(function(){
	
        // 获取屏幕高度
        var winH=$(window).height();
        var winW=$(window).width();
		 
    //手机导航
    $(document).on("click", ".menu_h,.ph-mask", function () {
        $("body").toggleClass("menu-open");
		
        if ($("body").hasClass("menu-open")) {
            $(".body-box").height($(window).height());
        } else {
            $(".body-box").height("auto");
        }
		
		
    });         

    //IE87兼容 input
    //console.log($("html").hasClass("ie"))
    if ($("html").hasClass("lt10")) {
        $('input').placeholder();
		$('textarea').placeholder();
    }
    //end
	
//--------------pc端导航
	if($(".menu_h").is(":hidden")){
		$(".header nav li").hover(function () {
			$(this).addClass("on")
			}, function () {
			$(this).removeClass("on")
		})
	}
//
	

//--------------pad导航点击
    if ($(window).width() > 768 && $(window).width() < 1205) {
        $(".header nav li > a").click(function (e) {
            if ($(this).parent().hasClass("on")) {
            //return false;
            } else {
                e.preventDefault();
                e.stopPropagation();
                $(this).parent().siblings().removeClass("on").end().addClass ("on");
            }
        });
    }
//

	
    //头部导航滚动动画
    $(window).scroll(function () {
        var tp = $(window).scrollTop();
        if (tp > 20) {
            $(".header").addClass("scroll");
        }
        else {
            $(".header").removeClass("scroll");
        }
    })
		
	//aimg
	$(".aimg").each(function(i){
	   if(winW>767){
			 simgs=$(this).data("big");
			 $(this).attr({"src":simgs});
	   }else{
			 srcls=$(this).data("phone");
			 $(this).attr({"src":srcls});
	   }
		
	});
	
		//imgbg
		 $(".imgbg").each(function(i){
			  if(winW>767){
				 simg=$(this).data("big");
				 $(this).css({"background-image":'url('+simg+')'});
			  }else{
				 srcl=$(this).data("phone");
				 $(this).css({"background-image":'url('+srcl+')'});
			  }
		
		  })
	
						
		
   	   $(window).resize(function() {
        var winH=$(window).height();
        var winW=$(window).width();
		
		//imgbg
		 $(".imgbg").each(function(i){
			  if(winW>767){
				 simg=$(this).data("big");
				 $(this).css({"background-image":'url('+simg+')'});
			  }else{
				 srcl=$(this).data("phone");
				 $(this).css({"background-image":'url('+srcl+')'});
			  }
		
		  })
	
			
		//aimg
		$(".aimg").each(function(i){
		   if(winW>767){
				 simgs=$(this).data("big");
				 $(this).attr({"src":simgs});
		   }else{
				 srcls=$(this).data("phone");
				 $(this).attr({"src":srcls});
		   }
			
		});
		
		

	   })
	   
	   
    //return_top
	$(window).scroll(function(){
		if($(window).scrollTop() > 10){
			$(".gotop").fadeIn("slow")	;
		}else{
		  if(winW>767){
			$(".gotop").fadeOut("slow")	  
		  }	
			
		};
	});
	$(".gotop").click(function(){
		$("html,body").animate({scrollTop:"0px"}, 500);
	});
	
	
	
    //分享
    var title_2 = encodeURIComponent("Imclass-多人线上互动教室服务提供商-Imclass");
	
	
    $(".ft_share .a-1").click(function () {//新浪微博
        // var url = window.location.href;
        // var img = ""
        // var title = document.title;
        // var op = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent(url) + "&title=" + title + "&searchPic=" + img + ""
        // window.open(op)
    })
	
	

    $(".weixinbut").click(function () {//微信
        var url = $(this).attr("data-qrcode")
        //alert(url)
        var title = ""
        title += "<div class='weixin'>"
        title += "<i class='c'>x</i>"
        title += "<h2>二维码</h2>"
        title += "<div class='img'><img src='" + url + "' width='100px;' height='100px;'></div>"
        title += "<p>扫一扫</p>"
        title += "</div>"
        $("body").remove(".weixin");
        $("body").append(title)
        //var op="http://service.weibo.com/share/share.html?url='"+ url +"'&title='"+ title +"'&searchPic=false"
        //window.open(op)
    })
    $(document).on("click", ".weixin .c", function () {
        //alert(0)
        $(".weixin").remove();
    })
        //

     //--------------模拟下拉
	$(".select-box dt").click(function(e){
	    e.preventDefault();
	    e.stopPropagation();
	    $(this).toggleClass("open");
	    if ($(this).hasClass("open")) {
	        $(this).parents(".select-box").find("dd").show();
	    }
	    else {
	        $(this).parents(".select-box").find("dd").hide();
	    }
		$(this).parents("li").siblings().find("dd").hide();
		$(this).parents("li").siblings().find("dt").removeClass("open");
	})
	
	$(".select-box dd a").click(function(e){
	    $(this).addClass("on").siblings().removeClass("on");
	    $(this).parents(".select-box").find("dt b").text($(this).text());
	    $(this).parents(".select-box").next(".select-hidden").val($(this).attr("data-val"));

	    $(".select-box dt").removeClass("open");
	    $(".select-box dd").hide();
	})
	
	$(".select-box").bind("mouseleave",function(e){
	    $(".select-box dt").removeClass("open");
	    $(".select-box dd").hide();
	})
	
	
	$(document).click(function(e){
	    $(".select-box dt").removeClass("open");
	    $(".select-box dd").hide();
	})
    //end
	
		
 //模拟复选按钮
	$(".check_group").click(function(){
		 var $but = $(this).find(".checkbox");									
		 if($but.hasClass("checkbox02")){
			  $but.removeClass("checkbox02");
			  $but.find(".check").removeAttr("checked");
		 }else{
			  $but.addClass("checkbox02");
			  $but.find(".check").attr("checked",'true');
		 }
											
	});	
	
	
	//公共选项卡切换
	$(function(){
		
	  if(winW>767){
		$(document).on("mouseover", ".tab-box .tab-a", function () {
			$(this).addClass("on").siblings().removeClass("on");
			var ii = $(this).index();		
			$(this).parents(".tab-box").find(".tab-b").eq(ii).show().siblings().hide();
			imgratio()
		})
		//
		$(".tab-box").each(function (i) {
			$(this).find(".tab-a:eq(0)").addClass("on");
			$(this).find(".tab-b").eq(0).show().siblings().hide();
		});	
	   }	
	})
	//
	
	   

});       




	//无图图像
	var nullimgs = 'images/error.png';
	function lods(t) {
		t.onerror = null;
		t.src = nullimgs
	}
	$(document).ready(function () {
		$("img").each(function () {
			if ($(this).attr("src") == "") {
			   $(this).attr({ "src": nullimgs })
			 }
		 })

		 
		 
	})
	
	
	var nullimg = '../images/error.png';
        $(function () {
            $(".ratio-img").each(function () {
                if ($(this).attr("src") == "") {
                    $(this).attr({ "src": nullimg })
                }
            })
        })


