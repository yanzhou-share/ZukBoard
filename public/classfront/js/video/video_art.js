/// <reference path="jquery.js" />

var sw, sh, winw, winh, html1;
function win1(bl) {
    winw = $(".img-box").width();
    winh = $(window).height();
    sw = winw;
    sh = sw / 907 * 510;
    //sh=$(window).height()
    var h = (winh - sh) / 2;
    h < 0 ? h == 0 : 0;
    $(".vid-box").css({ width: sw, height: sh, marginTop: 0 })
    $(".vi").css({ width: sw, height: sh });

    if (bl)
    {
        $(".vid-box").each(function () {
            
            aboutvideo(sh, sw, $(this).data("mp4"), $(this).data("img"), $(this).attr("id"));
        })
        
    }
}


$(function () {

    win1(true)

    //窗口改变大小回调ratio；
    var rtime = new Date();
    var timeout = false;
    var delta = 200;
    $(window).resize(function () {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            if (!$("html").hasClass("ie7")) {
                setTimeout(resizeend, delta); //resize只回调最后一次
            }

        }
    });
    function resizeend() {  //window.resize回调
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            win1(false);

        }
    }
    //

    $(document).on("click", "video", function () {
        var obj = $(this)[0];
        var $this = $(this);
        var ss = obj.paused
        obj.controls = "true";
        setTimeout(function () {
            // console.log(obj.paused);
            obj.play();
            if (ss == obj.paused) {
                obj.pause()
            }
            if (!obj.paused) {                
                $this.parent().parent().addClass("play");
               
            } else {
                $this.parent().parent().removeClass("play");
               
            }

        },20)
        
    });
    $(document).on("click", ".bx-controls-direction a", function () {
        $("video").each(function () {
            var obj = $(this)[0];
            if (!obj.paused) {
                obj.pause();
                
            } else {

            }
            $(this).parent().parent().removeClass("play");
        });

        
    });
    


    //视频切换
    if ($(".microfilm-list li").size() > 1) {
        $('.microfilm-list ul').bxSlider({
            infiniteLoop: false,
            auto: false,
            autoControls: true
        });
    }

})



function aboutvideo(h, w, src, img, id) {

    
    if ($("html").hasClass("lt10")) {
        $(".video_t").html("");

        videoBox(h, w, src, img, id);
    }
    else {
        
        html1 = '<video class="vi"  loop="loop"   poster="' + img + '" width="' + w + '" height="' + h + '" >'
        html1 += '<source src="' + src + '" type="video/mp4" />'
        html1 += '</video>'
        

        $("#" + id).html(html1)

    }
}
function videoBox(height, width, url, img, id) {
    var s1 = new SWFObject("../js/video/flvplayer.swf", "single", width, height, "7");
    s1.addParam("allowfullscreen", "true");
    s1.addParam("wmode", "transparent");
    s1.addVariable("file",  url);
    s1.addVariable("image", img);
    s1.addVariable("autostart", "false");
    s1.addVariable("repeat", "always");
    s1.addVariable("width", width);
    s1.addVariable("backcolor", 0x000000);
    s1.addVariable("frontcolor", 0xFFFFFF);
    s1.addVariable("lightcolor", 0x000000);
    s1.addVariable("height", height);
    s1.write(id);
    //alert($("#playerswf").html())
}
