/**
 * Created by msi008 on 2015/7/1.
 */
;Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.added = function(val) {
    var index = this.indexOf(val);
    if (index == -1) {
        this.push(val);
    }
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
(function ($) {
    /**
     * loading
     */
    var Loading = function () {
        this.init();
    };
    Loading.prototype = {
        init: function () {
            this.render();
        },
        render: function () {
            var arr = Array();
            arr.push('<div class="mask">');
            arr.push('<i class="loading"></i>');
            arr.push('</div>');
            $(document.body).append(arr.join(""));
            //$(".mask").length > 0 ? void(0) :  $(document.body).append(arr.join(""));
        },
        show: function () {
            $(".mask").show();
        },
        hide: function () {
            $(".mask").hide();
        }
    };

    /**
     *
     * @param message
     * @param callback
     * @param caller
     * @constructor
     */
    var ConfirmBox = function (message, callback, caller) {
        this.message = message;
        this.callback = callback;
        this.caller = caller;
        if (!callback) {
            !!this.caller && this.error();
        }
        this.init();
        this.addEvents();
    };
    ConfirmBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#confirm_tip");
            this.masker = $("#masker");
            this.closed = this.tip.find('[data-type="tip_closed"]');
            this.action = this.tip.find('[action-type="accept_action"]');
            //this.tip.find('p').text(this.message);
        },
        render: function () {
            var messageText = this.message;
            //for (var m in this.message) {
            //    messageText += "<p>" + this.message[m] + "</p>";
            //}
            var arr = Array();

            arr.push('<div id="confirm_tip" class="popover fade animateXMark" style="position:fixed;display: none;left: 50%;top: 35%;margin-left: -160px;">');
            arr.push('<div class="popover-inner bool-box">');

            arr.push('<div class="info"><h2 node-type="message_text">'+messageText+'</h2></div>');
            arr.push('<div class="btn-option">');
            arr.push('<button class="btn btn-green default-btn-width" action-type="accept_action">确定</button>');
            arr.push('<button class="btn default-btn-width" data-type="tip_closed">取消</button>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },

        addEvents: function () {
            var that = this;
            this.action.off("click").on("click", function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    that.callback();
                }
            });

            this.closed.off('click').on('click', function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    //that.callback();
                }
            });
//            this.tip.off("click").on("click", function () {
//                that.hide();
//                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
//                    //that.callback();
//                }
//            });
            this.show();
        },

        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        }
    };

    /**
     * 提示框
     * @param message
     * @param callback
     * @param caller
     * @constructor
     */
    var MessageBox = function (message, callback, caller) {
        this.message = message;
        this.callback = callback;
        this.caller = caller;
        if (!callback) {
            !!this.caller && this.error();
            //this.vibrate();
        }
        this.init();
        this.addEvents();
    };
    MessageBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#message_tip");
            this.masker = $("#masker");
            this.closed = this.tip.find('[data-type="tip_closed"]');
            this.action = this.tip.find('[action-type="accept_action"]');
            //this.tip.find('p').text(this.message);
        },
        render: function () {
            var messageText = this.message;
            //for (var m in this.message) {
            //    messageText += "<p>" + this.message[m] + "</p>";
            //}
            var arr = Array();

            arr.push('<div id="message_tip" class="popover fade animateXMark" style="position:fixed;display: none;left: 50%;top: 35%;margin-left: -160px;">');
            arr.push('<div class="popover-inner bool-box">');
            arr.push(' <span class="close" data-type="tip_closed"><i class="icons icons-close"></i></span>');

            arr.push('<div class="info"><h2 node-type="message_text">'+messageText+'</h2></div>');
            arr.push('<div class="btn-option">');
            arr.push('<button class="btn btn-green default-btn-width" action-type="accept_action">确定</button>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },

        addEvents: function () {
            var that = this;
            this.action.off("click").on("click", function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    that.callback();
                }
            });

            this.closed.off('click').on('click', function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    //that.callback();
                }
            });
            this.tip.off("click").on("click", function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    //that.callback();
                }
            });
            //if (!!this.caller) {
            //    this.caller.off("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            //        $(this).removeClass('shake');
            //        that.show();
            //    });
            //} else {
            //    this.show();
            //}
            this.show();
        },
        vibrate: function () {
            if ((navigator.vibrate || navigator.webkitVibrate) && window.webkitNotifications) {
                if (window.webkitNotifications.checkPermission() != 0) {
                    window.webkitNotifications.requestPermission(function () {
                    });
                }
            } else {
                //提示浏览器不支持此api
            }

            if (navigator.vibrate) {
                navigator.vibrate(200);
            } else if (navigator.webkitVibrate) {
                navigator.webkitVibrate(200);
            }
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        }
    };

    var Share = function () {
    };
    Share.prototype = {
        remove_sharetag : function(str){
            str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            str = str.replace(/　/g,'');//去除中文空格
            str = str.replace(/(^\s*)|(\s*$)/g, "");
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
            return str;
        },
        // share begin
        mb_strcut : function(str, maxlength, dot) {
            var len = 0;
            var res = '';
            str = this.remove_sharetag(str);
            var dot = !dot ? '...' : '';
            if (typeof page_charset == 'undefined') {
                page_charset = document.characterset;
            }
            maxlength = maxlength - dot.length;
            for ( var i = 0; i < str.length; i++) {
                len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (page_charset == 'utf-8' ? 3 : 2) : 1;
                if (len > maxlength) {
                    res += dot;
                    break;
                }
                res += str.substr(i, 1);
            }
            return res;
        },
        qqweibo : function(evt){
            var node = $(evt.target);
            var opt = this.getShareParam(node);
            var _title = '我正在tuturead阅读《'+opt.title+'》',_title = this.mb_strcut(_title+opt.summary,140),w=700,h=680;
            var _pic = !!opt.pic ? '&pic='+encodeURIComponent(opt.pic) :  '&pic='+encodeURIComponent(this.sitesharelogo);

            // var qqUrl = 'http://share.v.t.qq.com/index.php?c=share&a=index'
            //     +'&title='+encodeURIComponent(_title)+'&url='+encodeURIComponent(opt.url)
            //     +'&site='+encodeURIComponent('yasongju.tthuakan.com')
            //     +_pic;

            // this.opurl(qqUrl,'qqweibo',w,h);
        },
        sitesharelogo : 'http://www.tuturead.com/assets/img/logo-icon_75.png',
        tieba : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            var _title = '【'+opt.title+'】',_title = this.mb_strcut(_title+opt.summary,240),w=620,h=450;
            var _pic = !!opt.pic ? '&pic='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pic='+encodeURIComponent(this.sitesharelogo);
            var sinaUrl = 'http://tieba.baidu.com/f/commit/share/openShareApi?url='+encodeURIComponent(opt.url)
                +'&appkey='+TT_CONFIG.CONSTANTS.WEIBO_APPID
                +'&source=bshare'
                +'&retcode=0'
                +_pic
                +'&title='+encodeURIComponent(_title)+'(发表于:@孝礼APP)'
                +'&appkey=&ralateUid=&dpc=1&state=1';
            // console.log(opt,111);
            this.opurl(sinaUrl,'sinaweibo',w,h);
        },
        sinaweibo : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            var ptype = opt.ptype;
            var _title =  ptype == 1 ? '【'+opt.title+'】' : '我在【孝礼】发现了好礼物【'+opt.title+'】',w=620,h=450;
            var _pic = !!opt.pic ? '&pic='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pic='+encodeURIComponent(this.sitesharelogo);
            var sinaUrl = 'http://service.weibo.com/share/share.php?url='+encodeURIComponent(opt.url)
                +'&appkey='+TT_CONFIG.CONSTANTS.WEIBO_APPID
                +'&source=bshare'
                +'&retcode=0'
                +_pic
                +'&title='+encodeURIComponent(_title)+'(分享自 @孝礼APP)'
                +'&appkey=&ralateUid=&dpc=1&state=1';
            // console.log(opt,111);
            this.opurl(sinaUrl,'sinaweibo',w,h);
        },
        douban : function(evt) {
            var node = $(evt.target);
            var opt = this.getShareParam(node);
            var _title = '我正在tuturead阅读《'+opt.title+'》。',_title = this.mb_strcut(_title,140),
                s1=window.getSelection,s2=document.getSelection,
                s3=document.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',
                w=450,h=330;
            var _pic = !!opt.pic ? '&image='+encodeURIComponent(opt.pic) :  '&image='+encodeURIComponent(this.sitesharelogo);
            var _summary = this.mb_strcut(opt.summary,240);
            var doubanUrl = 'http://www.douban.com/recommend/?url='+encodeURIComponent(opt.url)
                +'&title='+encodeURIComponent(_title)
                +'&sel='+encodeURIComponent(_summary)
                +_pic
                +'&v=1';
            // +'&name='+encodeURIComponent(_summary)//encodeURIComponent(this.mb_strcut(opt.summary,140))
            // +'&text='+encodeURIComponent(_summary)


            this.opurl(doubanUrl,'douban',w,h);
        },
        opurl : function(r,name,w,h){
            var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
            var android = ( navigator.userAgent.match(/(android)/g) ? true : false );//
            if (iOS || android){
                var link = document.createElement('a');
                link.setAttribute("href", r);
                link.setAttribute("target", "_blank");

                $(link).trigger("click");
                var dispatch = document.createEvent("HTMLEvents");
                dispatch.initEvent("click", true, true);
                link.dispatchEvent(dispatch);
            }
            else{
                var x=function(){if(!window.open(r,name,'toolbar=0,resizable=1,scrollbars=yes,status=1,width='+w+',height='+h+',left='+(screen.width-w)/2+',top='+(screen.height-h)/2))location.href=r+'&r=1'};
                if(/Firefox/.test(navigator.userAgent)){setTimeout(x,0)}else{x()}
            }
        },
        weixin : function(node,opt){//node,_url,_css,_logo
            var _opts = $.extend({}, {container:'#screen-content'}, opt);
            // var _opts = {container:'#screen-content',url:_url,laycss:_css,logo:_logo};
            node.weixinpanel(_opts);//
        },

        qq : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            //opt.url = "http://www.myxiaoli.com/h5/glload/e184d39";

            var ptype = opt.ptype, _title =  ptype == 0 ? '我在【孝礼】发现了好礼物【'+opt.title+'】' : opt.title,_desc = this.mb_strcut(opt.summary,240),w=820,h=450;
            var _pic = !!opt.pic ? '&pics='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pics='+encodeURIComponent(this.sitesharelogo);
            var qqUrl = 'http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(opt.url)
                +'&title='+encodeURIComponent(_title)
                //+'&desc='+encodeURIComponent(_desc)
                +'&summary='+encodeURIComponent(_desc)
                +_pic;
             //console.log(qqUrl);
            this.opurl(qqUrl,'qq',w,h);
        },

        qzone : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            var ptype = opt.ptype, _title =  ptype == 1 ? '【'+opt.title+'】' : '我在【孝礼】发现了好礼物',_desc = this.mb_strcut(opt.summary,240),w=620,h=450;
            var _pic = !!opt.pic ? '&pics='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pics='+encodeURIComponent(this.sitesharelogo);
            var qzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(opt.url)
                +'&title='+encodeURIComponent(_title)
                +'&summary='+encodeURIComponent(ptype == 1 ? _desc : opt.title)
                +_pic;
            this.opurl(qzoneUrl,'qzone',w,h);
        }
    };

    /**
     * 工具函数
     * @type {{replaceHtmlTag: Function, testNickName: Function, arrayDistinct: Function, _regMobile: Function}}
     */
    var Tool = {
        checkDevice : function(callback){

            var MediaDevices = [];
            var audioInputDevices = [];
            var audioOutputDevices = [];
            var videoInputDevices = [];

            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                // Firefox 38+ seems having support of enumerateDevices
                // Thanks @xdumaine/enumerateDevices
                navigator.enumerateDevices = function(callback) {
                    navigator.mediaDevices.enumerateDevices().then(callback).catch(function() {
                        callback([]);
                    });
                };
            }

            var canEnumerate = false;
            /*global MediaStreamTrack:true */
            if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
                canEnumerate = true;
            } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
                canEnumerate = true;
            }

            var hasMicrophone = false;
            var hasSpeakers = false;
            var hasWebcam = false;

            var isWebsiteHasMicrophonePermissions = false;
            var isWebsiteHasWebcamPermissions = false;


            if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
                navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
            }

            if (!navigator.enumerateDevices && navigator.enumerateDevices) {
                navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
            }

            if (!navigator.enumerateDevices) {
                if (callback) {
                    callback();
                }
                return;
            }

            MediaDevices = [];

            audioInputDevices = [];
            audioOutputDevices = [];
            videoInputDevices = [];
            (function (callback){
                navigator.enumerateDevices(function(devices) {
                    if(devices.length > 0){
                        devices.forEach(function(_device) {
                            var device = {};
                            for (var d in _device) {
                                device[d] = _device[d];
                            }

                            // if it is MediaStreamTrack.getSources
                            if (device.kind === 'audio') {
                                device.kind = 'audioinput';
                            }

                            if (device.kind === 'video') {
                                device.kind = 'videoinput';
                            }

                            var skip;
                            MediaDevices.forEach(function(d) {
                                if (d.id === device.id && d.kind === device.kind) {
                                    skip = true;
                                }
                            });

                            if (skip) {
                                return;
                            }

                            if (!device.deviceId) {
                                device.deviceId = device.id;
                            }

                            if (!device.id) {
                                device.id = device.deviceId;
                            }

                            if (!device.label) {
                                device.label = 'Please invoke getUserMedia once.';
                                if (location.protocol !== 'https:') {
                                    if (document.domain.search && document.domain.search(/localhost|127.0./g) === -1) {
                                        device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
                                    }
                                }
                            } else {
                                if (device.kind === 'videoinput' && !isWebsiteHasWebcamPermissions) {
                                    isWebsiteHasWebcamPermissions = true;
                                }

                                if (device.kind === 'audioinput' && !isWebsiteHasMicrophonePermissions) {
                                    isWebsiteHasMicrophonePermissions = true;
                                }
                            }

                            if (device.kind === 'audioinput') {
                                hasMicrophone = true;

                                if (audioInputDevices.indexOf(device) === -1) {
                                    audioInputDevices.push(device);
                                }
                            }

                            if (device.kind === 'audiooutput') {
                                hasSpeakers = true;

                                if (audioOutputDevices.indexOf(device) === -1) {
                                    audioOutputDevices.push(device);
                                }
                            }

                            if (device.kind === 'videoinput') {
                                hasWebcam = true;

                                if (videoInputDevices.indexOf(device) === -1) {
                                    videoInputDevices.push(device);
                                }
                            }

                            // there is no 'videoouput' in the spec.

                            if (MediaDevices.indexOf(device) === -1) {
                                MediaDevices.push(device);
                            }
                        });

                        var checkDevices = {
                            MediaDevices : MediaDevices,
                            hasMicrophone : hasMicrophone,
                            hasSpeakers : hasSpeakers,
                            hasWebcam : hasWebcam,

                            isWebsiteHasWebcamPermissions : isWebsiteHasWebcamPermissions,
                            isWebsiteHasMicrophonePermissions : isWebsiteHasMicrophonePermissions,

                            audioInputDevices : audioInputDevices,
                            audioOutputDevices : audioOutputDevices,
                            videoInputDevices : videoInputDevices
                        }

                        if (!!callback) {
                            callback(checkDevices);
                        }
                    }else{
                        if(!!callback){
                            callback(false);
                        }
                    }
                });

                //return{
                //    MediaDevices : MediaDevices,
                //    hasMicrophone : hasMicrophone,
                //    hasSpeakers : hasSpeakers,
                //    hasWebcam : hasWebcam,
                //
                //    isWebsiteHasWebcamPermissions : isWebsiteHasWebcamPermissions,
                //    isWebsiteHasMicrophonePermissions : isWebsiteHasMicrophonePermissions,
                //
                //    audioInputDevices : audioInputDevices,
                //    audioOutputDevices : audioOutputDevices,
                //    videoInputDevices : videoInputDevices
                //}
            })(callback);
        },

        checkRTC : function(){
            var dataChannelSupport = (function (){
                var dataChannelSupport = false;

                try {
                    var PeerConnectionConstructor = window.RTCPeerConnection
                        || window.webkitRTCPeerConnection
                        || window.mozRTCPeerConnection;

                    if (PeerConnectionConstructor) {
                        var peerConnection = new PeerConnectionConstructor({
                            'iceServers': [{'url': 'stun:0'}]
                        });

                        dataChannelSupport = 'createDataChannel' in peerConnection;
                    }
                } catch (e) {
                    dataChannelSupport = false;
                }

                return dataChannelSupport;
            })();

            if(typeof getUserMedia == "undefined" || typeof RTCPeerConnection == "undefined" || !dataChannelSupport){
                return false;
            }
            return true;
        },

        pageStar : function(){
            if(typeof NProgress != "undefined") NProgress.start();
        },

        pageEnd : function(){
            if(typeof NProgress != "undefined") NProgress.done();
        },
        networkStatus : function(){
            return navigator.onLine;
        },

        getCurrentTarget : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            return $(e.target);
        },

        share : function(){
            return new Share();
        },

        checkUrl :function(url){
            //var regex =/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
            var regex = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
            if(regex.test(url)){
                return true;
            }
            return false;
        },

        checkPlus : function(n){
           var regex =  /^([1-9]\d*|\+?(\d*\.\d{1,2})|[0]{1,1})$/;
           return !!regex.test(n);
        },

        checklen: function () {
            var target = $(this);
            if (!!target) {
                var text = $.trim(target.val());
                target.next(".number").find("[data-number]").text(text.length);
            }
        },
        errorInfo: function (message, target, scrolling) {
            if (message && !!target) {
                target.siblings("p").text(message).closest("div").addClass("error");
                if (!!scrolling) {
                    var top = target.position().top;
                    $("html,body").animate({scrollTop: top});
                }
                target.addClass("shake");
                target.on("webkitAnimationEnd mozAnimationEnd animationEnd", function () {
                    target.removeClass("shake");
                });
            }
        },
        getCameraList : function(callback){
        	MediaStreamTrack.getSources(function(gotSources){
				var me_array = [];
				for (var i = 0; i !== gotSources.length; ++i) {
					var sourceInfo = gotSources[i];
					if (sourceInfo.kind === 'video') {
						me_array.push(sourceInfo.id);
					}
				}
				callback(me_array);
			});
        },
        //获取字符串在数组中的坐标
        indexOfArr : function(arr, str,callback){
            var len = arr.length;
            for(var i = 0; i < len; i++){
                if(arr[i] == str){
                	callback(i);
                }
            }
            callback(-1);
        },
        clearError: function (target) {
            if (!!target) {
                target.next("p").text("").closest("div").removeClass("error");
            }
        },
        messageBox: function (message, callback, caller) {
            new MessageBox(message, callback, caller);
        },
        confirmBox : function(message, callback, caller){
            new ConfirmBox(message, callback, caller);
        },

        loading: function () {
            return new Loading();
        },
        replaceHtmlTag: function (value) {
            if (typeof value === "undefined" || !value) return "";
            return value.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        },
        testNickName: function (name) {
            var reg = /([\^_|~!@#$%&*()`=+:,.;?<>-]|[\s]\[|\]|\\|\——|\/|\'|\·|\~|\～|\"|\，|\。|\《|\》|\？|\；|\：|\’|\”|\！|\【|\】|\{|\｛|\｝|\}|\、|\＆|\……|\％|\￥|\＃|\＠|\×|\（|\）|\s)/ig;  //非法字符
            return !reg.test(name);
        },

        checkLdentity: function (card) {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return !!reg.test(card);
        },

        arrayDistinct: function () {
            var n = {}, r = []; //n为hash表，r为临时数组
            for (var i = 0; i < arr.length; i++) //遍历当前数组
            {
                if (!n[arr[i]]) //如果hash表中没有当前项
                {
                    n[arr[i]] = true; //存入hash表
                    r.push(arr[i]); //把当前数组的当前项push到临时数组里面
                }
            }
            return r;
        },

        regMobile: function (m) {
            var PATTERN_CHINAMOBILE = /^1(3[4-9]|5[012789]|8[23478])\d{8}$/,
                reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

            if (reg.test(m)) {
                if (PATTERN_CHINAMOBILE.test(m)) {
                    return 3;
                } else {
                    return 1;
                }
            } else {//手机号不合法
                return 0;
            }
        },

        isMobile: function () {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                return true;
            } else {
                return false;
            }
        },

        checkEmail: function (email) {
            var reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
            return !!reg.test(email);
        },

        check_pwd: function (pwd) {
            var patrn = /^([A-Za-z0-9]){6,20}$/;
            if (!patrn.exec(pwd)) return false;
            return true
        },
        check_wechat: function (wechat) {
            var patrn = /^[a-zA-Z\d_]{5,}$/;
            if (!patrn.exec(wechat)) return false;
            return true
        },
        check_card : function(value){
            var patrn=/^(\d){16,19}$/;
            if (!patrn.exec(value)) return false;
            return true
        },
        check_captcha : function (captcha) {
            var reg = /^\d{6}$/;
            var re = new RegExp(reg);
            if (!re.test(captcha)) return false;
            return true;
        },
        //字符串多个空格合并一个 多个回车 合并一个
        doString : function (_string) {
            if (_string.indexOf(" ") >=0) {
                //空格正则
                var space = /\s+/g;
                _string = _string.replace(space, ' ');
            }
            //是否有回行
            if (_string.indexOf("\n") >= 0) {
                var enter = /[\r\n]+/g;
                _string = _string.replace(enter, '<br/><br/>');
            }
            return _string;
        },

        encodeTextAreaString: function(str) {
            var reg = new RegExp("\n", "g");
            str = str.replace(reg, "<br/>");
            return str;
        },

        //匹配某字符串在另一字符串的位置并高亮
        StringHighlight : function (searchStr,name) {
            var searchIndex = name.indexOf(searchStr),//搜索字符串在名字的位置
                searchLen = searchStr.length,//搜索字符串的长度
                nameLen = name.length,//名字字符串的长度
                arr = [];
            if(searchStr == name) {
                //字符串完全匹配
                arr.push('<span class="m-match-red">'+searchStr+'</span>');
            } else {
                if(searchIndex == 0) {
                    //搜索字符串在开头位置
                    //剩下的字符
                    var remainStr = name.slice(searchLen);
                    arr.push('<span class="m-match-red">'+searchStr+'</span>');
                    arr.push(remainStr);
                } else if(searchIndex + searchLen == nameLen ) {
                    //搜索字符串在末尾
                    var remainStr = name.substring(0,nameLen-searchLen);//开头截取到匹配位置
                    arr.push(remainStr);
                    arr.push('<span class="m-match-red">'+searchStr+'</span>');
                } else {
                    //搜索字符在中间
                    var FremainStr = name.slice(0,searchIndex),//开头截取到匹配位置
                        EremainStr = name.slice(searchLen+searchIndex);//从匹配位置最后字符长度截取到最后
                    arr.push(FremainStr);
                    arr.push('<span class="m-match-red">'+searchStr+'</span>');
                    arr.push(EremainStr);
                }
            }
            return arr.join("");
        },
        //获取当前时间，格式YYYY-MM-DD
        getNowFormatDate : function () {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        //又拍云签名
        upyunSign : function () {
            //运行环境 开发 测试 线上
            var env = "imclass";
            var options = {};
            var myDate = new Date();
            var timestamp = parseInt(myDate.getTime()/1000);

            options['bucket'] = 'edu-hoozha';
            options['expiration'] = timestamp + 60000; /// 授权过期时间
            options['save-key'] = '/{year}/{mon}{day}/'+ env +'/{random}{.suffix}'; /// 文件名生成格式，请参阅 API 文档
            options['allow-file-type'] = 'ppt,pptx,jpg,jpeg,bmp,png,doc'; /// 控制文件上传的类型，可选
            options['content-length-range'] = '1,20480000'; /// 限制文件大小，可选

            //logger.info("又拍云认证时间"+options['expiration']);
            var policy = BASE64.encode(JSON.stringify(options));
            var sign = $.md5(policy+'&'+'lyNrY+yoA731epaN2DpnJKtJxZ8=');
            return {policy:policy, sign:sign};
        },
        wait : 60,
        t : null,
        countDown : function(el){
            if(Tool.wait == 0){
                el.removeClass("disabled");
                el.text('重新获取');
                Tool.wait = 60;
                clearTimeout(Tool.t);
            }else{
                el.addClass('disabled');
                el.text('重新获取('+Tool.wait+')');
                Tool.wait--;
                Tool.t = setTimeout(function(){
                    Tool.countDown(el);
                },1000);
            }
        },

        clearTime : function(el){
            el.removeClass("disabled");
            el.text('获取验证码');
            Tool.wait = 60;
            clearTimeout(Tool.t);
        },

        offset : 0,
        clock : 0,
        watchInterval : null,

        startWatch : function(el, stime, callback){
            if (!!stime) {
                Tool.offset = stime;
            }
            Tool.watchInterval = setInterval(Tool.getCurrTime.bind({el:el,callback:callback}), 1000);
        },

        stopWatch : function () {
            clearInterval(Tool.watchInterval);
        },

        getCurrTime : function(){
            Tool.clock += Tool.delta();
            var t_ms = (Tool.clock / 1000).toFixed(2),
                t_sec = parseInt(Tool.clock / 1000),
                t_min = parseInt(Tool.clock / 1000 / 60);

            if (t_sec > 59) {
                t_sec = t_sec - (60 * t_min);
            }
            var timer = {};
            timer.mil = (t_ms ? (t_ms > 9 ? t_ms : "0" + t_ms) : "00").slice(-2); // ms
            timer.sec = (t_sec ? (t_sec > 9 ? t_sec : "0" + t_sec) : "00"); // sec
            timer.min = (t_min ? (t_min > 9 ? t_min : "0" + t_min) : "00"); // min
            !!this.el && this.el.text(timer.min+":"+timer.sec);
            !!this.callback && typeof this.callback == "function" && this.callback(Tool.clock);
            //return timer;
        },

        delta : function () {
            // var now = Date.now();
            //     Tool.offset = !Tool.offset ? Date.now() : Tool.offset;
            // var t = now - Tool.offset;
            // Tool.offset = now;
            // return t;
            return 1000;
        },

        resetClock : function (clock) {
            if(clock > 0){
                Tool.clock = clock;
            }
        },

        check_name: function (name) {
            //var reg = /([\^_|~!@#$%&*()`=+:,.;?<>-]|[\s]\[|\]|\\|\——|\/|\'|\·|\~|\～|\"|\，|\。|\《|\》|\？|\；|\：|\’|\”|\！|\【|\】|\{|\｛|\｝|\}|\、|\＆|\……|\％|\￥|\＃|\＠|\×|\（|\）|\s)/ig;  //非法字符
            var reg = /^([A-Za-z0-9-\u4e00-\u9fa5]|\·)+$/;
            return reg.test(name);
        },

        check_mobile: function (mobile) {
            var regu = /0?(13|14|15|16|18|17|19)[0-9]{9}/;
            var re = new RegExp(regu);
            if (!re.test(mobile)) {
                return false;
            }
            return true;
        },

        isWeiXin: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },

        validateIdCard: function (id, backInfo) {
            var info = {
                    y: "1900",
                    m: "01",
                    d: "01",
                    sex: "m",
                    valid: false,
                    length: 0
                },
                initDate = function (length) {
                    info.length = length;
                    var a = length === 15 ? 0 : 2,  // 15:18
                        temp;
                    info.y = (a ? "" : "19") + id.substring(6, 8 + a);
                    info.m = id.substring(8 + a, 10 + a);
                    info.d = id.substring(10 + a, 12 + a);
                    info.sex = id.substring(14, 15 + a) % 2 === 0 ? "f" : "m";
                    temp = new Date(info.y, info.m - 1, info.d);
                    return (temp.getFullYear() == info.y * 1)
                        && (temp.getMonth() + 1 == info.m * 1)
                        && (temp.getDate() == info.d * 1);
                },
                back = function () {
                    return backInfo ? info : info.valid;
                };
            if (typeof id !== "string") return back();
            // 18
            if (/^\d{17}[0-9x]$/i.test(id)) {
                if (!initDate(18)) return back();
                id = id.toLowerCase().split("");
                var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    y = "10x98765432".split(""),
                    sum = 0;
                for (var i = 0; i < 17; i++) sum += wi[i] * id[i];
                if (y[sum % 11] === id.pop().toLowerCase()) info.valid = true;
                return back();
            }
            // 15
            else if (/^\d{15}$/.test(id)) {
                if (initDate(15)) info.valid = true;
                return back();
            }
            else {
                return back();
            }
        },

        strlen: function (str) {
            ///<summary>获得字符串实际长度，中文2，英文1</summary>
            ///<param name="str">要获得长度的字符串</param>
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        },

        ajax: function (a, d, c, e, b, f) {
            b = !!b ? b : "post";
            var Ajax = $.ajax({
                url: a,
                data: d,
                type: b,
                async:f,
                dataType: 'json'
            }).done(c).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                e.call();
                console.log("status:  " + XMLHttpRequest.status);
                console.log("readyState:  " + XMLHttpRequest.readyState);
                console.log("textStatus:  " + textStatus);
            });
            return Ajax;
        },
        //时间戳转日期
        timestampToTime : function (timestamp, type) {
            var date = new Date(timestamp);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;

            // var unixtimestamp = new Date(timestamp);
            // var year = 1900 + unixtimestamp.getYear();
            // var month = "0" + (unixtimestamp.getMonth() + 1);
            // var date = "0" + unixtimestamp.getDate();
            // var hour = "0" + unixtimestamp.getHours();
            // var minute = "0" + unixtimestamp.getMinutes();
            // var second = "0" + unixtimestamp.getSeconds();
            // if(type) {
            //     return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length);
            // } else {
            //     return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
            //         + " " + hour.substring(hour.length-2, hour.length) + ":"
            //         + minute.substring(minute.length-2, minute.length) + ":"
            //         + second.substring(second.length-2, second.length);
            // }


        },
        //日期转时间戳
        timeToString : function (timestring){

            var T = new Date(timestring);  // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
            // 有三种方式获取
            var time = T.getTime();
            return time;
        },
        //班级列表
        _classList :function (organizeId) {
            var _this = this;
            var organizeId = organizeId;
            Tool.ajax("/page/web/classfront/classList",{organizeId : organizeId}, function (res) {
                console.log(res);
                if(!!res.code && res.code == 0) {
                    var list = res.data.list;
                    return list;
                } else {
                    return [];
                }
            }, function (e) {
                console.log(e);
            });
        },

        fromUnixTimestamp: function (timestamp) {
            //default
            //console.log(new Date(timestamp*1).format("h:m"));
            if (timestamp == '') {
                return new Date("m月d日  H:i", timestamp);
            }
            var str = "", timestamp1 = timestamp;
            timestamp = Math.round(timestamp/1000);
            var now = Math.round(new Date().getTime()/1000);
            var micro = Math.ceil((now - timestamp));

            if (micro < 60) {
                str = '刚刚';
            }
            else if (micro < 3600) {
                str = (Math.round(micro / 60) <= 0 ? 1 : Math.round(micro / 60)) + '分钟前';
            }
            else if (micro < 86400) {
                var d = Math.floor(micro/86400);
                if(d < 1){
                    str = '今天 '+new Date(timestamp1*1).format("hh:mm");
                }
            }
            else {
                var d = Math.floor(micro/86400);
                if(d == 1){
                    str = '昨天 '+new Date(timestamp1*1).format("hh:mm");
                }else if(d == 2){
                    str = '前天 '+new Date(timestamp1*1).format("hh:mm");
                }else{
                    str = new Date(timestamp1*1).format("MM月dd日 hh:mm");
                }
            }
            return str;
        },

        convertIcon : function(icon, wh){
            if(!!icon){
                return icon.indexOf("http://") > -1 ? icon : (!!wh ? CONFIG.upyun.rc_upyun_http+icon+"!wh"+wh : CONFIG.upyun.rc_upyun_http+icon);
            }
            return icon;
        },

        getRandomString: function () {
            if (window.crypto && window.crypto.getRandomValues && -1 === navigator.userAgent.indexOf("Safari")) {
                for (var a = window.crypto.getRandomValues(new Uint32Array(3)), token = "", i = 0, l = a.length; l > i; i++) token += a[i].toString(36);
                return token
            }
            return (Math.random() * (new Date).getTime()).toString(36).replace(/\./g, "")
        },

        randUid : function () {
            var clientID = '';
            var possible = "0123456789abcdefghijklmnopqrstuvwxyz";
            var numPossible = possible.length;
            for (var i = 0; i < 6; i++) {
                clientID += possible.charAt((Math.random() * numPossible) | 0);
            }
            return "tm"+clientID;
        },

        /**
         * 获取图片Url
         */
        getImageUrl: function (rid, w, h, cut) {
            return medium.Util.getImageUrl(rid, w, h, cut);
        },

        /**
         * 生成唯一ID
         */
        getUniqueId : function (options, callback) {
            if(!!Fingerprint2){
                var fp = new Fingerprint2(options);
                fp.get(function(result){
                    if(!!result){
                        !!callback && typeof callback == "function" && callback(result);
                    }else{
                        !!callback && typeof callback == "function" && callback("");
                    }
                });
            }else{
                !!callback && typeof callback == "function" && callback("");
            }
        },

        /**
         * 取消全屏
         */
        fullScreenCancel : function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        },

        /**
         * 全屏
         * @param element
         */
        fullScreen : function (element) {
            var elem = !!element ? element : document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if (elem.webkitRequestFullScreen) {
                // 对 Chrome 特殊处理，
                // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
                if ( window.navigator.userAgent.toUpperCase().indexOf( 'CHROME' ) >= 0 ) {
                    elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
                // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
                else {
                    elem.webkitRequestFullScreen();
                }
            }
            else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
        },

        //检测操作系统
        detectionOS: function () {
            var os = navigator.platform;
            var userAgent = navigator.userAgent;
            var info = "";
            if (os.indexOf("Win") > -1) {
                if (userAgent.indexOf("Windows NT 5.0") > -1) {
                    info += "Windows2000";
                } else if (userAgent.indexOf("Windows NT 5.1") > -1) {
                    info += "WindowsXP";
                } else if (userAgent.indexOf("Windows NT 5.2") > -1) {
                    info += "Windows2003";
                } else if (userAgent.indexOf("Windows NT 6.0") > -1) {
                    info += "WindowsVista";
                } else if (userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1) {
                    info += "Windows7";
                } else if (userAgent.indexOf("Windows NT 8.0") > -1 || userAgent.indexOf("Windows 8") > -1) {
                    info += "Windows8";
                } else if (userAgent.indexOf("Windows NT 10.0") > -1) {
                    info += "Windows10";
                } else {
                    info += "Other";
                }
            } else if (os.indexOf("Mac") > -1) {
                info += "Mac";
            } else if (os.indexOf("X11") > -1) {
                info += "Unix";
            } else if (os.indexOf("Linux") > -1) {
                info += "Linux";
            } else {
                info += "Other";
            }
            return info;
        },

        checkRtcBrower : function () {
            var result = {};
            var sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var baidu = "百度浏览器";
            var jisu = "360极速浏览器";
            var qq = "QQ浏览器";
            var sogo = "搜狗浏览器";
            var s;
            (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
                    (s = ua.match(/opera \/([\d.]+)/)) ? sys.opera = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                            (s = ua.match(/baidu.([\d.]+)/)) ? sys.baidu = s[1] :
                                (s = ua.match(/jisu.([\d.]+)/)) ? sys.jisu = s[1] :
                                    (s = ua.match(/qq.([\d.]+)/)) ? sys.qq = s[1] :
                                        (s = ua.match(/sogo.([\d.]+)/)) ? sys.sogo = s[1] :
                                            (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
            
            if (sys.chrome >= "50") {
                result.version = sys.chrome.substring(0, sys.chrome.indexOf('.'));
                result.browser = 'Chrome浏览器';
                result.support = true;
                return result;
            }
            //else if (sys.firefox > "42" && sys.firefox != "43 || 45 || 50") {
            // result.version = sys.firefox.substring(0, sys.firefox.indexOf('.'));
            // result.browser = 'firefox浏览器';
            // result.support = true;
            // return result;
            //}
            else if (sys.opera >= "34") {
                result.version = sys.opera.substring(0, sys.opera.indexOf('.'));
                result.browser = 'opera浏览器';
                result.support = true;
                return result;
            }
            //else if (sys.baidu > "8.1" && sys.baidu != "8.6") {
            //    result.version = sys.baidu.substring(0, sys.baidu.indexOf('.'));
            //    result.browser = '百度浏览器';
            //    result.support = true;
            //    return result;
            //}
            else if (sys.jisu >= "8.5") {
                result.version = sys.jisu.substring(0, sys.jisu.indexOf('.'));
                result.browser = '360极速浏览器';
                result.support = true;
                return result;
            }
            // else if (sys.qq > "9.4") {
            //     result.version = sys.qq.substring(0, sys.qq.indexOf('.'));
            //     result.browser = 'QQ浏览器';
            //     result.support = true;
            //     return result;
            // }
            // else if (sys.sogo > "6.0" && sys.sogo != "6.4") {
            //     result.version = sys.sogo.substring(0, sys.sogo.indexOf('.'));
            //     result.browser = '搜狗浏览器';
            //     result.support = true;
            //     return result;
            // }
            else {
                result.version = '';
                result.browser = '不支持';
                result.support = false;
                return result;
            }
        }
    };

    var weixinpanel = function(element,options){
        this.$el = $(element);
        this.options = $.extend({}, $.fn.weixinpanel.defaults, options);
        this.initialized();
    };

    weixinpanel.prototype = {
        initialized : function(){
            this.setup();
            this.settings = {};
            $.extend(this.settings, TT);
            this.settings.delegateEvents(this);//继承events事件
        },
        events : {
            'click' : 'togglepop'
        },

        generate_random_id : function(prefix) {
            var string;
            string = prefix + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
            while ($("#" + string).length > 0) {
                string += this.generate_random_char();
            }
            return string;
        },
        generate_random_char : function() {
            var chars, newchar, rand;
            chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
            rand = Math.floor(Math.random() * chars.length);
            return newchar = chars.substring(rand, rand + 1);
        },

        setup : function(){
            var options = this.options;
            this.popid =  (this.options.container) ? this.generate_random_id('popwx-') : 'popwx-';

            var html = $('#popweixin').tmpl({'id':this.popid,'url':encodeURIComponent(this.options.url),'laycss':this.options.laycss,'logo':this.options.logo,'qrtitle':this.options.qrtitle,'isdownqr':this.options.isdownqr});
            $tip = $(html);
            this.placement = this.$el.attr('placement');

            if (typeof this.options.container == 'string'){
                this.options.container=$(this.options.container);
            }
            this.options.container ? $tip.appendTo(this.options.container) : $tip.appendTo(this.$el);
            //this.$el.html(html);

            this.$popwx = $('#'+this.popid);
            this.$masker = $('#masker');
            var zIndex = parseInt(this.$masker.filter(function() {
                    return $(this).css('z-index') != 'auto';
                }).first().css('z-index'))+50;
            // this.show();
            this.$popwx.delegate('[data-type="weixinclose"]', 'click', $.proxy(function(event) {
                this.hide();
            },this));
            this.$popwx.css({'z-index':zIndex});
        },
        togglepop : function() {
            if (!this.$popwx.hasClass('fade')){
                var _callback = this.options.showcallback,
                    _scope = this.options.showscope;
                if (TT.isFunction(_callback)) {
                    _callback.apply(_scope, arguments);
                }
                //_hmt.push(['_trackEvent', 'share', 'click', 'weixin']);
                this.show();
            }
            else{
                this.hide();
            }
        },
        show : function(){
            this.$popwx.show().addClass('fade in');
            this.$popwx.css({
                "top": "50%","left": "50%",
                "margin-top": function () {
                    return - ($(this).outerHeight() / 2);
                },
                'margin-left': function () {
                    return -($(this).outerWidth() / 2);
                }
            });
            setTimeout($.proxy(function(){
                $('html').off('click.weixin.data-api').on('click.weixin.data-api', $.proxy(function (e) {
                    if (!!e && ($(e.target).closest('[data-type="pop-weixin"]').length>0 || $(e.target).closest('[data-action="share-on-weixin"]').length>0)){
                        e.stopPropagation() ;
                    }
                    else{
                        this.hide();
                    }
                },this));
            },this),20);
        },
        hide : function(){
            $('html').off('click.weixin.data-api');
            this.$popwx.hide().removeClass('fade in');
        }
    };

    $.fn.weixinpanel = function (option) {

        return this.each(function(input_field) {

            var $this = $(this)
                , data = $this.data('weixinpanel')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('weixinpanel', (data = new weixinpanel(this, options)))
            }
            else if(typeof option == 'object' && option){
                data['show']();
            }
            if (typeof option == 'string') data[option]();
        });
    };
    $.fn.weixinpanel.defaults = {url:'',content:'',heading:'',laycss:'',logo:'',qrtitle:'分享到微信','isdownqr':false};


    $.fn.setCursorPosition = function(position){
        if(this.lengh == 0) return this;
        return $(this).setSelection(position, position);
    };
    $.fn.setSelection = function(selectionStart, selectionEnd) {
        if(this.lengh == 0) return this;
        input = this[0];

        if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        } else if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }

        return this;
    };
    $.fn.focusEnd = function(){
        this.setCursorPosition(this.val().length);
    };
    window.Tool = Tool;
})(window.jQuery);

