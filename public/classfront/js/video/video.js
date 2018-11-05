// JavaScript Document
$(function(){
	var srcl="",simg='',playerId="",vid_t="",scro_H=""

    $(document).on('click','.in_video .video_button',function(e){
		srcl=$(this).data("mp4");
		simg=$(this).data("img");
		stext=$(this).find(".tit").html();
		$(".video_place").fadeIn();
		vid_t=$(".video_con");
		video(vid_t,playerId)
		e.stopPropagation();
	})
	$(document).on('click','.video_con',function(e){
		e.stopPropagation();
	});
	$(".video_place .video_close_btn").click(function(){
		$(".video_place").fadeOut();
		if($('html').hasClass('lt9')) {
			$(".video_con").html("");
		}else{
		 $(".video_con video").get(0).pause()
		}
	})

	$(document).click(function(){
		$(".video_place").fadeOut();
		if($('html').hasClass('lt9')) {
			$(".video_con").html("");
		}else{
		 $(".video_con video").get(0).pause()
		}
	})
	
	function video(vid_t,player){
		if($('html').hasClass('lt9')) {
			$(".video_con").html("")
			videoBox(vid_t.width(), vid_t.height(), srcl,simg);
        } else {
        	$(".video_con video").attr({
        		src:srcl,
        		poster:simg
        	});
			$(".video_place").find("p").html(stext);
        	$(".video_con video").attr({width:vid_t.width(),height:vid_t.height()})
        	$(".video_con video").get(0).play();
        }
	}
	function videoBox(width, height, url,img) {
	    var s1 = new SWFObject("flvplayer.swf","single",width,height,"7");
        s1.addParam("allowfullscreen","true");
        s1.addParam("wmode","transparent");
        s1.addVariable("file",url);
        s1.addVariable("autostart","true");
        s1.addVariable("width",width);
		s1.addVariable("backcolor",0x000000);
		s1.addVariable("frontcolor",0xFFFFFF);
		s1.addVariable("lightcolor",0x000000);
        s1.addVariable("height",height);
        s1.write("player");
	}
	
})
