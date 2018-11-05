function imgratio() {//图片 ratio方法调用
    $(".ratio-img").each(function (index, element) {
     
        if($(this).is(":visible"))
        {
            $(this).css({height:Math.floor($(this).width()*$(this).data("ratio"))});
        }
    });

	   var abH = $(".ab_bk_03 .con").height();
	   $(".ab_bk_03 .con img").css({"max-height":abH+"px"});

}

$(function () {

    imgratio()//初始化图片ratio

    setTimeout(function () {
        imgratio();
    }, 300)

    $(".ratio-img").each(function (index, element) {
        $(this).attr({ "src": $(this).data("src") });
    });


    //窗口改变大小回调ratio；
    var rtime = new Date();
    var timeout = false;
    var delta = 500;
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
            imgratio()//ratio
        }
    }
    //

})

//无图图像
var nullimg = 'images/error.png';
function lod(t) {
    t.onerror = null;
    t.src = nullimg
}
$(function () {
    $(".ratio-img").each(function () {
        if ($(this).attr("src") == "") {
            $(this).attr({ "src": nullimg })
        }
    })
})