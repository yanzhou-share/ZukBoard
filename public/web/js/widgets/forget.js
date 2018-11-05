/**
 * Created by ncy on 2018/1/30 0030.
 */
var FORGET = (function () {
    var FORGET = function (element, options) {
        this.$el = $(element);
        this._swicth = false;
        this._init();
    }

    FORGET.prototype = {
        _init: function () {
            this.$forgetBtn = this.$el.find('#subscribe-submit');//提交按钮
            this.$phone = this.$el.find('[node-type="phone"]');//手机号输入框
            this.$password = this.$el.find('[node-type="password"]');//密码输入框
            this.$verifyCode = this.$el.find('[node-type="verifyCode"]');//图形验证码
            this.$msgCode = this.$el.find('[node-type="msgCode"]');//短信验证码
            this.$captch = this.$el.find('[node-type="captch"]');//图片验证码

            //短信验证码
            this.$againsend = this.$el.find('[node-type="againsend"]');//重发
            this.$sendMsg = this.$el.find('[node-type="sendMsg"]');//发送短信
            this._addEvents();
        },
        _addEvents: function () {
            var _this = this;
            this.$forgetBtn.on("click", $.proxy(this._forget, this));//提交按钮
            this.$sendMsg.on("click", $.proxy(this._sendMsg, this));//发短信
            this.$captch.on("click", $.proxy(this._getCaptch, this));

            //回车事件
            $('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    _this.$forgetBtn.trigger("click");
                }
            });
        },

        //获取图形验证码
        _getCaptch: function () {
            var _this = this;

            var timestamp = Date.parse(new Date());//生成时间戳以便每次成功调用接口
            _this.$captch.find("img").attr("src","/page/web/classfront/getImgVerificationCode?"+timestamp);

        },

        //发短信
        _sendMsg: function () {
            //倒计时 调用发短信接口
            var _this = this,
                mobile = $.trim(this.$phone.val()),
                captch = $.trim(this.$verifyCode.val()),
                verPhone = Tool.check_mobile(mobile),
                msg = '';

            if (!verPhone) {
                msg = "手机号格式不正确";
                this._showMessage(this.$phone, msg);
                this._showError(this.$phone);

                return false;
            }

            //图形验证码
            if (!captch) {
                var msg = '图形验证码错误';
                this._showMessage(this.$verifyCode, msg);
                this._showError(this.$verifyCode);
                //alert("请输入图形验证码");

                return false;
            } else {
                this._hideError(this.$verifyCode);
            }

            if (this.$sendMsg.hasClass('disabled'))    return;
            this.$sendMsg.addClass('disabled');

            //发短信
            Tool.ajax("/page/web/classfront/getMobileCodeBasedImg", {'mobile': mobile, 'imageCode': captch , 'operationType' : 'forgetPassword'}, function (res) {
                var code = res.code;
                if(code == 14001) {
                    msg = '图形验证码错误';
                    _this._showMessage(_this.$verifyCode, msg);
                    _this._showError(_this.$verifyCode);
                } else {
                    Model.captchCountdown(_this.$sendMsg, _this.$againsend);
                }
                console.log(res);
                _this.$sendMsg.removeClass('disabled');
            }, function (e) {
                console.log(e);
                _this.$sendMsg.removeClass('disabled');
            });

        },
        //忘记密码提交按钮
        _forget: function () {
            var _this = this,
                mobile = $.trim(this.$phone.val()),
                password = $.trim(this.$password.val()),
                captch = $.trim(this.$verifyCode.val()),
                phoneCode = $.trim(this.$msgCode.val()),
                obj = {},
                msg;

            //隐藏所有的错误提示
            this._hideALLError();
            var verPhone = Tool.check_mobile(mobile);

            if (!verPhone) {
                msg = "请输入正确的手机号";
                this._showMessage(this.$phone, msg);
                this._showError(this.$phone);

                return false;
            } else {
                this._hideError(this.$phone);

            }
            //图形验证码
            if (!captch) {
                this._showError(this.$verifyCode);
                //alert("请输入图形验证s码");
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

                return false;
            }
            //密码加密
            // password = BASE64.randomStr(3) + BASE64.encode(password) + BASE64.randomStr(5);
            // password = encodeURIComponent(password);
            obj.mobile = mobile;
            obj.password = $.md5(password);
            obj.mobileCode = phoneCode;
            if (this.$forgetBtn.hasClass('disabled'))    return;
            this.$forgetBtn.addClass('disabled');

            //忘记密码ajax 未注册手机号提示手机号未注册
            //请求服务器
            Tool.ajax("/page/web/classfront/forgetPassword",obj, function (res) {
                if (!!res) {
                    var code = res.code;

                    if(code == 0) {
                        window.location.href="/page/web/classfront/login.html";
                    } else if(code == 2001) {
                        msg = "该手机号不存在";
                        _this._showMessage(_this.$phone, msg);
                        _this._showError(_this.$phone);
                    } else if(res.code == 13001 ) {
                        _this._showError(_this.$msgCode);
                        //alert("请输入手机验证码");
                    } else {
                        console.log(res);
                    }
                }
                _this.$forgetBtn.removeClass('disabled');
            }, function (e) {
                _this.$forgetBtn.removeClass('disabled');
                console.log(e);
            });
        },
        //隐藏提示文案
        _hideALLError: function () {
            $(".form-error").each(function () {
                if (!$(this).is(":hidden")) {
                    $(this).hide();
                }
            })
        },
        //显示错误提示 true 正常dom   false 验证码dom
        _showError: function (_target) {
            var errDom = _target.closest(".form-group").find(".form-error").eq(0);
            if (errDom.is(":hidden")) {
                errDom.show();
            }
        },
        //隐藏错误提示
        _hideError: function (_target) {
            var errDom = _target.closest(".form-group").find(".form-error").eq(0);
            if (!errDom.is(":hidden")) {
                errDom.hide();
            }
        },
        //文案设置
        _showMessage : function (_target, message) {
            var Dom = _target.closest(".form-group").find(".form-error").eq(0);
            Dom.text(message);
        }
    }

    $.fn.forget = function (option, str) {
        var $this = $(this);
        var data = $this.data('forget');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('forget', (data = new FORGET(this, option)));

            return this;
        });
    }
    $("body").forget();
})();

