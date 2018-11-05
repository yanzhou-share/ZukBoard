/**
 *
 * 用户修改密码
 *
 *
 * @Author by shine
 * @create time 20180611
 */

var SETPWD = (function () {
    var SETPWD = function (ele, options) {
        this.$el = $(ele);

        this._init();
    }

    SETPWD.prototype = {
        //初始化数据
        _init: function () {
            this.$oldpwd = this.$el.find("#old-password");
            this.$newpwd = this.$el.find("#new-password");
            this.$surepwd = this.$el.find("#sure-password");
            this.$sureEdit = this.$el.find("#sureEdit");

            this._addEvents();
        },
        //绑定事件
        _addEvents: function () {
            var _this = this;

            this.$sureEdit.on("click", $.proxy(this.sure, this));

            //回车事件
            $('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    _this.$sureEdit.trigger("click");
                }
            });
        },
        //修改密码
        sure: function () {
            var _this = this,
                oldpwd = $.trim(this.$oldpwd.val()),
                newpwd = $.trim(this.$newpwd.val()),
                surepwd = $.trim(this.$surepwd.val()),
                obj = {};

            //验证密码
            var _oldPwd = Tool.check_pwd(oldpwd);

            if (!_oldPwd) {
                this._showError(this.$oldpwd, "密码为6-20位字符，由数字和字母组成");
            } else {
                this._hideError(this.$oldpwd);
            }

            var _newPwd = Tool.check_pwd(newpwd);

            if (!_newPwd) {
                this._showError(this.$newpwd, "新密码为6-20位字符，由数字和字母组成");
            } else {
                this._hideError(this.$newpwd);
            }

            var _surePwd = Tool.check_pwd(surepwd);

            if (surepwd != newpwd) {
                this._showError(this.$surepwd, "确认密码与新密码不同，请再次输入");
                return;
            } else {
                this._hideError(this.$surepwd);
            }

            if (this.$sureEdit.hasClass('disabled'))    return;
            this.$sureEdit.addClass('disabled');

            obj.newPassword = $.md5(newpwd);
            obj.oldPassword = $.md5(oldpwd);
            obj.userId = CONFIG.userInfo.id;

            Tool.ajax("/page/web/classfront/setPassword", obj, function (res) {
                if(!!res && res.code == 0) {
                    var msg = "修改成功！";
                    Model.successBox(msg, function (type) {
                        if(type) {
                            window.location.href = "/page/web/classfront/logOut";
                        }
                    });
                } else if(res.code == 2006) {
                    _this._showError(_this.$oldpwd);
                }

                _this.$sureEdit.removeClass('disabled');
            }, function (e) {
                _this.$sureEdit.removeClass('disabled');
            });
        },

        //隐藏错误提示
        _hideError : function ($dom) {
            $dom.parents(".form-group").removeClass("error");
        },
        //显示错误提示
        _showError: function ($dom, err) {
            $dom.next().text(err).parents(".form-group").addClass("error");
        }
    }

    $.fn.setpwd = function (option, str) {
        var $this = $(this);
        var data = $this.data('setpwd');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('setpwd', (data = new SETPWD(this, option)));

            return this;
        });
    }
    $("body").setpwd();
})();
