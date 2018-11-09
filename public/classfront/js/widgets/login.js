/**
 * Created by ncy on 2018/1/30 0030.
 */

var LOGIN = (function () {
    var LOGIN = function (element, options) {
        this.$el = $(element);
        this._init();
    }

    LOGIN.prototype = {
        _init: function () {
            this.$loginBtn = this.$el.find("#subscribe-submit");
            this.$phone = this.$el.find('[node-type="phone"]');
            this.$password = this.$el.find('[node-type="password"]');
            this.$errorInfo = this.$el.find('[node-type="error_info"]');

            this._addEvents();
        },
        _addEvents: function () {
            var _this = this;
            this.$loginBtn.on("click", $.proxy(this.login, this));
            //回车事件
            $('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    _this.$loginBtn.trigger("click");
                }
            });
        },
        //登录  **判断用户是否注册 未注册或手机号密码不匹配
        // 提示"用户名或密码输入错误"
        login: function () {
            var _this = this,
                phone = $.trim(this.$phone.val()),
                password = $.trim(this.$password.val()),
                verPhone = Tool.check_mobile(phone);
            //验证手机号
            // if (!verPhone) {
            //     this._showError(this.$password);
            //     // this._showError(this.$phone);
            //     //alert("手机号错误");
            //     return false;
            // } else {
            //     this._hideError(this.$password);
            // }
            if (!phone) {
                this._showError(this.$password);
                    //alert("手机号错误");
                this._showMessage(this.$password, "手机号格式不正确");
                return false;
            } else {
                this._hideError(this.$password);
            }

            //验证密码
            var verPwd = Tool.check_pwd(password);
            if (!verPwd) {
                this._showError(this.$password);
                this._showMessage(this.$password, "用户名或密码输入错误");
                return false;
            } else {
                this._hideError(this.$password);
            }

            //密码加密
            // password = BASE64.randomStr(3) + BASE64.encode(password) + BASE64.randomStr(5);
            // password = encodeURIComponent(password);
            password = $.md5(password);

            if (this.$loginBtn.hasClass('disabled'))    return;
            this.$loginBtn.addClass('disabled');

            //判断手机号是否注册，未注册的提示"用户名或密码输入错误" 注册允许登录

            Tool.ajax("/page/web/classfront/login", {userName: phone, password: password}, function (res) {
                // console.log(res);
                if(!!res && res.code == 0) {
                    var type = res.data.userInfo.type;
                    var organizeList = res.data.organizeList;
                    if(!!organizeList && organizeList.length == 1) {
                        if(type == 3) {
                            if(organizeList[0].status == 1) {
                                window.location.href="/page/web/classfront/freeze.html";
                            }
                            if(organizeList[0].status == 2) {
                                window.location.href="/page/web/classfront/expire.html";
                            }
                            if(organizeList[0].status == 0) {
                                window.location.href = "/page/web/classfront/member-manage.html";
                            }
                        } else {
                            if(organizeList[0].status == 0) {
                                window.location.href = "/page/web/classfront/msg-center.html";
                            } else {
                                window.location.href="/page/web/classfront/institution-select.html";
                            }
                        }
                        
                    } else if(organizeList.length > 1){
                        window.location.href="/page/web/classfront/institution-select.html";
                    } else {
                        console.log("还没有机构");
                        window.location.href="/page/web/classfront/none.html";
                    }

                } else {
                    var msg = "手机号或密码错误";
                    _this._showMessage(_this.$password, msg);
                    _this._showError(_this.$password);
                }
                _this.$loginBtn.removeClass("disabled");
            }, function (e) {
                _this.$loginBtn.removeClass("disabled");
                console.log(e);
            });
        },

        _hideALLError: function () {
            // $(".help-error").each(function () {
            //     if (!$(this).is(":hidden")) {
            //         $(this).hide();
            //     }
            // })
            this.$errorInfo.hide();
        },

        //显示错误提示
        _showError: function (_target) {
            // var errDom = _target.parent('[node-type="input-parent"]').next();
            // if (errDom.is(":hidden")) {
            //     errDom.show();
            // }
            this.$errorInfo.show();
        },
        //隐藏错误提示
        _hideError: function (_target) {
            // var errDom = _target.parent('[node-type="input-parent"]').next();
            // if (!errDom.is(":hidden")) {
            //     errDom.hide();
            // }
            this.$errorInfo.hide();
        },
        _showMessage : function (_target, message) {
            // var Dom = _target.parent('[node-type="input-parent"]').nextAll(".help-error").eq(0);
            // Dom.find(".help-block").text(message);
            this.$errorInfo.text(message);
        }
    }

    $.fn.login = function (option, str) {
        var $this = $(this);
        var data = $this.data('login');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('login', (data = new LOGIN(this, option)));

            return this;
        });
    }
    $("body").login();
})();
