// JavaScript Document
$(function(){
	$(window).resize(function(){
	var winw=$(window).width();	
	///图像等比例缩放
		//
		$(".auto-img img").one('load', function() {
			mainBgResize(this, 1, 1);
		}).each(function() {
			if(this.complete) $(this).load();
		});
        
		var s = setInterval(function () {
		        $(".auto-img img").one('load', function () {
		            mainBgResize(this, 1, 1);
		        }).each(function () {
		            if (this.complete) $(this).load();
		        });
                clearInterval(s) 
		    },1)
		//
	//end
	})
	$(window).resize();
})

$(function(){
	$(window).resize(function(){

		//IE87兼容 input
		//console.log($("html").hasClass("ie"))
		if ($("html").hasClass("lt10")) {
			$('input').placeholder();
		}
		//end

	})
})


var browser_w, browser_h;
function mainBgResize(img, w_r, h_r) {
	
	var $img = $(img);
	if(img.complete || img.width) {
		imgResize();
	} else {
		$img.load(function() {
			imgResize();
		});
	}
	

	function imgResize() {
		//browser_w = $(".main").width() < 768 ? 768 * w_r : $(".main").width() * w_r;
		//browser_h = $(".main").height() < 650 ? 650 * h_r : $(".main").height() * h_r;
		browser_w = $img.parents(".auto-img").width() * w_r;
		browser_h = $img.parents(".auto-img").height() * h_r;
		
		if($img.width() < browser_w || $img.width() > browser_w) {
				$img.css({width: browser_w, height: 'auto'});
				if($img.height() < browser_h) {

					$img.css({width: 'auto', height: browser_h});
				}
			} else if($img.height() < browser_h || $img.height() > browser_h) {
				$img.css({width: 'auto', height: browser_h});
				if($img.width() < browser_w) {
					$img.css({width: browser_w, height: 'auto'});
				}
			}

			$img.css({marginTop: -($img.height() - browser_h) / 2, marginLeft: -($img.width() - browser_w) / 2,'visibility':'visible'});
	}
}

/**
 * jQuery EnPlaceholder plug
 * EnPlaceholder是一个跨浏览器实现placeholder效果的jQuery插件
 * version 1.0
 */
 (function ($) {
    $.fn.extend({
        "placeholder": function (options) {
            options = $.extend({
                placeholderColor: '#ACA899',
                isUseSpan: false, //是否使用插入span标签模拟placeholder的方式,默认false,默认使用value模拟
                onInput: true  //使用标签模拟(isUseSpan为true)时，是否绑定onInput事件取代focus/blur事件
            }, options);

            $(this).each(function () {
                var _this = this;
                var supportPlaceholder = 'placeholder' in document.createElement('input');
                if (!supportPlaceholder) {
                    var defaultValue = $(_this).attr('placeholder');
                    var defaultColor = $(_this).css('color');
                    if (options.isUseSpan == false) {
                        $(_this).focus(function () {
                            var pattern = new RegExp("^" + defaultValue + "$|^$");
                            pattern.test($(_this).val()) && $(_this).val('').css('color', defaultColor);
                        }).blur(function () {
                            if ($(_this).val() == defaultValue) {
                                $(_this).css('color', defaultColor);
                            } else if ($(_this).val().length == 0) {
                                $(_this).val(defaultValue).css('color', options.placeholderColor)
                            }
                        }).trigger('blur');
                    } else {
                        var $imitate = $('<span class="wrap-placeholder" style="position:absolute; display:inline-block; overflow:hidden; color:' + options.placeholderColor + '; width:' + $(_this).outerWidth() + 'px; height:' + $(_this).outerHeight() + 'px;">' + defaultValue + '</span>');
                        $imitate.css({
                            'margin-left': $(_this).css('margin-left'),
                            'margin-top': $(_this).css('margin-top'),
                            'font-size': $(_this).css('font-size'),
                            'font-family': $(_this).css('font-family'),
                            'font-weight': $(_this).css('font-weight'),
                            'padding-left': parseInt($(_this).css('padding-left')) + 2 + 'px',
                            'line-height': _this.nodeName.toLowerCase() == 'textarea' ? $(_this).css('line-weight') : $(_this).outerHeight() + 'px',
                            'padding-top': _this.nodeName.toLowerCase() == 'textarea' ? parseInt($(_this).css('padding-top')) + 2 : 0
                        });
                        $(_this).before($imitate.click(function () {
                            $(_this).trigger('focus');
                        }));

                        $(_this).val().length != 0 && $imitate.hide();

                        if (options.onInput) {
                            //绑定oninput/onpropertychange事件
                            var inputChangeEvent = typeof (_this.oninput) == 'object' ? 'input' : 'propertychange';
                            $(_this).bind(inputChangeEvent, function () {
                                $imitate[0].style.display = $(_this).val().length != 0 ? 'none' : 'inline-block';
                            });
                        } else {
                            $(_this).focus(function () {
                                $imitate.hide();
                            }).blur(function () {
                                /^$/.test($(_this).val()) && $imitate.show();
                            });
                        }
                    }
                }
            });
            return this;
        }
    });
    $('.top-search input').placeholder();
 })(jQuery);









