$(window).on("load resize",function(){
    var h=window.innerHeight||document.body.clientHeight||document.documentElement.clientHeight;
    if($('.scroll-header').length > 0) {
        $('.scroll-header').css("height", (h-250)+'px');
    }
    if($('.scroll').length > 0) {
        $('.scroll').css("height", (h-203)+'px');
    }
});