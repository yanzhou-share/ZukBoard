/**
 * Created by ncy on 2018/1/30 0030.
 */

var SIGN = (function () {
    var SIGN = function (element, options) {
        this.$el = $(element);
        this._swicth = false;
        this._init();
        // this._getCaptch();
    }

    SIGN.prototype = {
        _init: function () {
            this.$signBtn = this.$el.find('#subscribe-submit');//注册按钮
            this.$phone = this.$el.find('[node-type="phone"]');//手机号dom
            this.$password = this.$el.find('[node-type="password"]');//密码dom
            this.$verifyCode = this.$el.find('[node-type="verifyCode"]');//验证码dom
            this.$msgCode = this.$el.find('[node-type="msgCode"]');//短信验证码dom
            this.$signBox = this.$el.find("#signSuccess");//注册成功层
            this.$captch = this.$el.find('[node-type="captch"]');//图片验证码

            //短信验证码
            this.$againsend = this.$el.find('[node-type="againsend"]');//重新发送
            this.$sendMsg = this.$el.find('[node-type="sendMsg"]');//发短信
            this._addEvents();
        },
        _addEvents: function () {
            var _this = this;
            this.$signBtn.on("click", $.proxy(this.sign, this));
            //发送验证码
            this.$sendMsg.on("click", $.proxy(this._sendMsg, this));

            this.$captch.on("click", $.proxy(this._getCaptch, this));

            //回车事件
            $('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    _this.$signBtn.trigger("click");
                }
            });

        },
        //获取图形验证码
        _getCaptch: function () {
            var _this = this;

            var timestamp = Date.parse(new Date());
            _this.$captch.find("img").attr("src","/page/web/classfront/getImgVerificationCode?"+timestamp);

        },

        //注册发短信
        _sendMsg: function () {

            var _this = this,
                mobile = $.trim(this.$phone.val()),
                captch = $.trim(this.$verifyCode.val()),
                verPhone = Tool.check_mobile(mobile),
                msg = '';

            if (!verPhone) {
                var msg = "手机号格式不正确";
                this._showMessage(this.$phone, msg);
                this._showError(this.$phone);

                return false;
            } else {
                this._hideError(this.$phone);
            }

            //图形验证码
            if (!captch) {
                this._showError(this.$verifyCode);

                return false;
            } else {
                this._hideError(this.$verifyCode);
            }

            if (this.$sendMsg.hasClass('disabled'))    return;
            this.$sendMsg.addClass('disabled');

               //发短信
           Tool.ajax("/page/web/classfront/getMobileCodeBasedImg", {'mobile': mobile, 'imageCode': captch , 'operationType' : 'userSign'}, function (res) {
               if (!!res) {
                   var code = res.code;

                   if(code == 14001) {
                       _this._showError(_this.$verifyCode);
                   } else if(code == 0){
                       //倒计时
                       Model.captchCountdown(_this.$sendMsg, _this.$againsend);
                   } else {
                       msg = "短信发送失败";
                       _this._showMessage(this.$phone, msg);
                       _this._showError(this.$phone);
                   }
               }
                // console.log(res);
               _this.$sendMsg.removeClass('disabled');
           }, function (e) {
               console.log(e);
               _this.$sendMsg.removeClass('disabled');
           });

        },
        sign: function () {
            var _this = this,
                mobile = $.trim(this.$phone.val()),
                password = $.trim(this.$password.val()),
                captch = $.trim(this.$verifyCode.val()),
                phoneCode = $.trim(this.$msgCode.val()),
                obj = {},
                msg = '';

            //隐藏所有的错误提示
            this._hideALLError();

            var verPhone = Tool.check_mobile(mobile);

            if (!verPhone) {
                msg = "手机号格式不正确";
                this._showMessage(this.$phone, msg);
                this._showError(this.$phone);

                return false;
            }

            //图形验证码
            if (!captch) {
                this._showError(this.$verifyCode);
                //alert("请输入图形验证码");

                return false;
            }
            //手机验证码
            if (!phoneCode) {
                this._showError(this.$msgCode);
                //alert("请输入手机验证码");

                return false;
            }
            //密码
            var verPwd = Tool.check_pwd(password);
            if (!verPwd) {
                this._showError(this.$password);
                //alert("密码错误");
                return false;
            }

            //密码加密
            // password = BASE64.randomStr(3) + BASE64.encode(password) + BASE64.randomStr(5);
            // password = encodeURIComponent(password);
            password = $.md5(password);

            //接口参数
            obj.mobile = mobile;
            obj.userName = obj.mobile;
            obj.password = password;
            obj.mobileCode = phoneCode;
            obj.headPic = '/2018/0323/dev/wj4xfzqpywgoefcs.jpg';

            if (this.$signBtn.hasClass('disabled'))    return;
            this.$signBtn.addClass('disabled');

            Tool.ajax("/page/web/classfront/sign",obj
            , function (res) {
                // console.log(res);
                if(!!res) {

                    var code = res.code;
                    if (code == 0) {
                        //注册成功
                        _this.$signBox.show();
                        setTimeout(function () {
                            _this.$signBox.hide();
                            window.location.href = "/page/web/classfront/login.html";
                        }, 1000);
                        //window.location.href = "/page/web/classfront/login.html";
                        // alert("注册成功");
                    } else if(res.code == 2002) {
                        msg = "该手机号已注册";
                        _this._showMessage(_this.$phone, msg);
                        _this._showError(_this.$phone);
                    }else if(res.code == 13001 ) {
                        _this._showError(_this.$msgCode);
                        //alert("请输入手机验证码");
                    } else if(code == 2007){
                        //未邀请用户不能注册
                        msg = "该手机号未被邀请";
                        _this._showMessage(_this.$phone, msg);
                        _this._showError(_this.$phone);
                    }
                }
                    _this.$signBtn.removeClass('disabled');
            }, function (e) {
                _this.$signbtn.removeClass('disabled');
                console.log(e);
            });
        },
        _hideALLError: function () {
            $(".form-error").each(function () {
                if (!$(this).is(":hidden")) {
                    $(this).hide();
                }
            })
        },
        //显示错误提示 true 正常dom   false 验证码dom
        _showError: function (_target) {
            //var errDom = _target.parent('[node-type="input-parent"]').nextAll(".form-error").eq(0);
            var errDom = _target.closest(".form-group").find(".form-error").eq(0);
            if (errDom.is(":hidden")) {
                errDom.show();
            }
        },
        //隐藏错误提示
        _hideError: function (_target) {
            //var errDom = _target.parent('[node-type="input-parent"]').nextAll(".form-error").eq(0);
            var errDom = _target.closest(".form-group").find(".form-error").eq(0);
            if (!errDom.is(":hidden")) {
                errDom.hide();
            }
        },
        _showMessage : function (_target, message) {
            //var Dom = _target.parent('[node-type="input-parent"]').nextAll(".form-error").eq(0);
            var Dom = _target.closest(".form-group").find(".form-error").eq(0);
            Dom.text(message);
        }
    }

    $.fn.sign = function (option, str) {
        var $this = $(this);
        var data = $this.data('sign');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('sign', (data = new SIGN(this, option)));

            return this;
        });
    }
    $("body").sign();
})();

