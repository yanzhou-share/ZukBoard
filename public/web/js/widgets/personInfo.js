/**
 * Created by ncy on 2018/1/30 0030.
 */
var PERSONInfo = (function () {
    var PERSONInfo = function (element, options) {
        this.$el = $(element);
        this._swicth = false;
        this._init();
        this._initUploadImg();
    }

    PERSONInfo.prototype = {
        _init: function () {
            this.$uploadIcon = this.$el.find("#uploadIcon");//上传头像按钮
            this.$uploadImg = this.$el.find('[node-type="uploadImg"]');//上传头像父节点
            this.$imgDom = this.$el.find('[node-type="img"]');//头像dom
            this.$calendar = this.$el.find('[node-type="calendar"]');

            //保存 取消
            this.$save = this.$el.find('[node-type="save"]');
            this.$cancle = this.$el.find('[node-type="cancle"]');

            this.$againsend = this.$el.find('[node-type="againsend"]');//重新发送
            this.$sendMsg = this.$el.find('[node-type="sendMsg"]');//发短信

            //info dom
            this.$formGroup = this.$el.find('.form-group');
            this.$errMsg = this.$el.find('.help-block');
            //用户信息 右侧信息栏
            this.$icon = this.$el.find('[node-type="icon"]');//头像
            this.$name = this.$el.find('[node-type="name"]');//姓名
            this.$birth = this.$el.find('[node-type="birth"]');//出生日期
            this.$introduce = this.$el.find('[node-type="introduce"]');//个人介绍
            //联系方式
            this.$phone = this.$el.find('[node-type="phone"]');//手机号
            this.$verifyCode = this.$el.find('[node-type="verifyCode"]');//手机验证码
            this.$email = this.$el.find('[node-type="email"]');//电子邮件
            this.$wechat = this.$el.find('[node-type="wechat"]');//微信
            //工作信息
            this.$workplace = this.$el.find('[node-type="workplace"]');//工作地点
            this.$job = this.$el.find('[node-type="job"]');//工作
            this.$department = this.$el.find('[node-type="department"]');//所属部门
            this.$research = this.$el.find('[node-type="research"]');//研究领域


            //左侧信息栏
            this.$personInfo = this.$el.find('#personInfo');

            this.$l_icon = this.$personInfo.find('[action-type="icon"]');//头像
            this.$l_name = this.$personInfo.find('[action-type="name"]');//姓名
            this.$l_birth = this.$personInfo.find('[action-type="birth"]');//出生日期
            this.$l_introduce = this.$personInfo.find('[action-type="introduce"]');//个人介绍
            //联系方式
            this.$l_phone = this.$personInfo.find('[action-type="phone"]');//手机号
            this.$l_email = this.$personInfo.find('[action-type="email"]');//电子邮件
            this.$l_wechat = this.$personInfo.find('[action-type="wechat"]');//微信
            //工作信息
            this.$l_workplace = this.$personInfo.find('[action-type="workplace"]');//工作地点
            this.$l_job = this.$personInfo.find('[action-type="job"]');//工作
            this.$l_department = this.$personInfo.find('[action-type="department"]');//所属部门
            this.$l_research = this.$personInfo.find('[action-type="research"]');//研究领域

            this._addEvents();
            this._initClass();
        },
        _addEvents: function () {
            var _this = this;
            this.$save.on("click", $.proxy(this._save, this));
            this.$cancle.on("click", $.proxy(this._cancle, this));
            this.$sendMsg.on("click", $.proxy(this._sendMsg, this));
            //编辑点击事件
            $('[node-type="edit"]').click(function (event) {
                var $target = $(event.target).closest('[node-type="edit"]'),
                    type = $target.attr("data-type"),
                    index = $('[node-type="edit"]').index(this),
                    type_info = "info",
                    type_connect = "connect",
                    type_job = "job";
                _this._reset(type);
                // if(type == "info") {
                //      _this._reset(type_connect);
                //      _this._reset(type_job);
                //     // _this._reset(type_job);
                //
                // } else if(type == "connect") {
                //     _this._reset(type_info);
                //     _this._reset(type_job);
                // } else {
                //     _this._reset(type_connect);
                //     _this._reset(type_info);
                // }


                $('.col-md-8').eq(index).show().siblings(".col-md-8").hide();
            });
        },
        //发短信
        _sendMsg: function () {

            var _this = this,
                mobile = $.trim(this.$phone.val()),
                verPhone = Tool.check_mobile(mobile),
                msg = '';

            if (!verPhone) {
                this._showError(this.$phone);
                return false;
            }


            // if (this.$sendMsg.hasClass('disabled'))    return;
            // this.$sendMsg.addClass('disabled');

            //发短信
            Tool.ajax("/page/web/classfront/getMobileCode", {'mobile': mobile}, function (res) {
                if (!!res) {
                    var code = res.code;

                    if(code == 0){
                        //倒计时
                        Model.captchCountdown(_this.$sendMsg, _this.$againsend);
                    } else {
                        msg = "短信发送失败";
                        _this._showMessage(this.$phone, msg);
                        _this._showError(this.$phone);
                    }
                }
                //  console.log(res);
                // _this.$sendMsg.removeClass('disabled');
            }, function (e) {
                console.log(e);
                // _this.$sendMsg.removeClass('disabled');
            });

        },
        //保存按钮
        _save : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="save"]'),
                type = $target.parent().attr("data-type"),
                userId = $target.attr("data-id"),
                obj = {};
            obj.userId = userId;
            if (type == "info") {
                //隐藏所有的错误文案
                var icon = $.trim(this.$icon.attr("data-rid")),
                    name = $.trim(this.$name.val()),
                    birthday = $.trim(this.$birth.val()),
                    introduce = $.trim(this.$introduce.val());
                //验证姓名
                if(!Tool.testNickName(name) || name < 2 || name.length >6) {
                    this._showError(this.$name);
                    return false;
                } else {
                    this._hideError(this.$name);
                }
                // 验证出生日期
                if(!birthday) {
                    this._showError(this.$birth);
                    return false;
                } else {
                    this._hideError(this.$birth);
                }
                //个人介绍 允许为空 空格回行默认一个
                if (introduce) {
                    if(introduce.length < 2) {
                        this.$introduce.parent().next().show();
                        this.$introduce.parents('.form-group').addClass('has-error');
                        // this._showError(this.$introduce);
                        return false;
                    } else {
                        this.$introduce.parent().next().hide();
                        this.$introduce.parents('.form-group').removeClass('has-error');
                        //判断是否有空格 有空格 多个空格替换为一个
                        introduce = Tool.doString(introduce);
                        obj.description = introduce;
                    }
                }
                obj.headPic = Tool.replaceHtmlTag(icon);
                obj.nickName = Tool.replaceHtmlTag(name);
                obj.birthday = Tool.timeToString(birthday);
            } else if(type == "connect") {
                var phone = $.trim(this.$phone.val()),
                    email = $.trim(this.$email.val()),
                    verifyCode = $.trim(this.$verifyCode.val()),
                    wechat = $.trim(this.$wechat.val());
                //验证手机号
                if(!Tool.check_mobile(phone)) {
                    this._showError(this.$phone);
                    return false;
                } else {
                    this._hideError(this.$phone);
                }
                if (!verifyCode) {
                    this._showError(this.$verifyCode);
                    return false;
                } else {
                    this._hideError(this.$verifyCode);
                }
                //验证邮箱
                if(!Tool.checkEmail(email)) {
                    this._showError(this.$email);
                    return false;
                } else {
                    this._hideError(this.$email);
                }
                //验证微信号
                if(!Tool.check_wechat(wechat)) {
                    this._showError(this.$wechat);
                    return false;
                } else {
                    this._hideError(this.$wechat);
                }
                obj.mobile = Tool.replaceHtmlTag(phone);
                obj.email = Tool.replaceHtmlTag(email);
                obj.wechat = Tool.replaceHtmlTag(wechat);
                obj.userName = obj.mobile;
                obj.mobileCode = Tool.replaceHtmlTag(verifyCode);
            } else {
                //type == "job"
                var workplace = $.trim(this.$workplace.val()),
                    job = $.trim(this.$job.val()),
                    department = $.trim(this.$department.val()),
                    research = $.trim(this.$research.val());
                //验证工作单位 可为空 4-30
                if(workplace) {
                    if(workplace.length < 2 ||  workplace.length > 14) {
                        this._showError(this.$workplace);
                        return false;
                    } else {
                        this._hideError(this.$workplace);
                    }
                } else {
                    this._hideError(this.$workplace);
                }
                //验证职位 可为空 2-14
                if(job) {
                    if(job.length < 2 ||  job.length > 14) {
                        this._showError(this.$job);
                        return false;
                    } else {
                        this._hideError(this.$job);
                    }
                } else {
                    this._hideError(this.$job);
                }
                //验证所属部门 可为空 4-15
                if(department) {
                    if(department.length < 2 ||  department.length > 14) {
                        this._showError(this.$department);
                        return false;
                    } else {
                        this._hideError(this.$department);
                    }
                } else {
                    this._hideError(this.$department);
                }
                //验证研究领域 可为空
                if(!!research) {
                    if(research.length < 2 || research.length > 300) {
                        this._showError(this.$research);
                        return false;
                    } else {
                        //判断是否有空格 有空格 多个空格替换为一个
                        this._hideError(this.$research);
                        research = Tool.doString(research);
                        obj.researchArea = research;
                    }
                } else {
                    this._showError(this.$research);
                    return false;
                }
                
                obj.company = Tool.replaceHtmlTag(workplace);
                obj.position = Tool.replaceHtmlTag(job);
                obj.department = Tool.replaceHtmlTag(department);
            }
            //todo 服务器保存
            //保存ajax
            if (this.$save.hasClass('disabled'))    return;
            this.$save.addClass('disabled');

            Tool.ajax("/page/web/classfront/userUpdate",obj
                , function (res) {
                    // console.log(res);
                    if(!!res.code && res.code == 0) {
                        // alert("修改成功");
                        // $("input").val('');
                        // $("textarea").val('');
                        var msg = "修改成功！";
                        Model.successBox(msg, function (type) {
                            if(type) {
                                _this._setInfo(obj);
                            }
                        });

                    } else if(res.code == 13001 ) {
                        _this._showError(_this.$verifyCode);
                        //alert("请输入手机验证码");
                    } else {
                        console.log("修改失败");
                    }
                    _this.$save.removeClass('disabled');
                }, function (e) {
                    // _this.$save.removeClass('disabled');
                    console.log(e);
                });
        },
        //取消按钮
        _cancle : function(event) {
            var $target = $(event.target).closest('[node-type="cancle"]'),
                type = $target.parent().attr("data-type");
            this._reset(type);
        },
        _showError : function (_target){
            var parent = _target.parents('.form-group');
            if(!parent.hasClass("has-error")) {
                parent.addClass("has-error");

            }
            if (_target.parent(".input-group").next().length > 0) {
                if(_target.parent(".input-group").next().is(":hidden")) {
                    _target.parent(".input-group").next().show();
                }
            } else {
                if(_target.parent(".input-group").parent().next().is(":hidden")) {
                    _target.parent(".input-group").parent().next().show();
                }
            }

        },
        _hideError : function (_target) {
            var parent = _target.parents('.form-group');
            if(parent.hasClass("has-error")) {
                parent.removeClass("has-error");

            }
            if (_target.parent(".input-group").next().length > 0) {
                if(!_target.parent(".input-group").next().is(":hidden")) {
                    _target.parent(".input-group").next().hide();
                }
            } else {
                if(!_target.parent(".input-group").parent().next().is(":hidden")) {
                    _target.parent(".input-group").parent().next().hide();
                }
            }
        },
        //点击编辑后重置右侧用户信息
        _reset : function (type) {
            if(type == "info") {
                //联系方式和工作重置
                this.$icon.attr("src",this.$l_icon.attr("src"));
                this.$name.val(this.$l_name.text());
                // this.$birth.val(this.$l_birth.text());
                this.$introduce.val(this.$l_introduce.text());
            } else if (type == "connect") {
                this.$phone.val(this.$l_phone.text());
                this.$verifyCode.val("");
                this.$email.val(this.$l_email.text());
                this.$wechat.val(this.$l_wechat.text());
            } else {
                this.$workplace.val(this.$l_workplace.text());
                this.$job.val(this.$l_job.text());
                this.$department.val(this.$l_department.text());
                this.$research.val(this.$l_research.text());
            }
            this.$formGroup.removeClass("has-error");
            this.$errMsg.hide();

        },
        //成功后设置左侧用户信息
        _setInfo : function (obj) {
            //个人信息
            if(obj.headPic) {
                this.$l_icon.attr("src",CONFIG.upyun.rc_upyun_http + obj.headPic + '!wh200');
            }
            if(obj.nickName) {
                this.$l_name.text(obj.nickName);
                //header用户名
                $('#userName').text(obj.nickName);
            }
            if(obj.birthday) {
                this.$l_birth.text(moment(obj.birthday*1).format('YYYY-MM-DD'));
            }
            if(obj.description) {
                this.$l_introduce.text(obj.description);
            }
            //联系方式
            if(obj.mobile) {
                this.$l_phone.text(obj.mobile);
            }
            if(obj.email) {
                this.$l_email.text(obj.email);
            }
            if(obj.wechat) {
                this.$l_wechat.text(obj.wechat);
            }

            //工作
            if(obj.company) {
                this.$l_workplace.text(obj.company);
            }
            if(obj.position) {
                this.$l_job.text(obj.position);
            }
            if(obj.department) {
                this.$l_department.text(obj.department);
            }
            if(obj.researchArea) {
                this.$l_research.text(obj.researchArea);
            }

        },
        _initUploadImg: function () {
            var _this = this,
                opt = {
                    html: '',
                    istarget: true,
                    state: 'usericon',
                    'btnup': 'uploadIcon'
                };
            //上传组件
            _this.$uploadImg.mediumupload(opt);
            _this.$uploadImg.on("medium.uploader.loaded", function (env, file) {
                // console.log("file");
                _this.$imgDom.attr("src",CONFIG.upyun.rc_upyun_http + file.rid + '!wh200');
                _this.$icon.attr("data-rid", file.rid);
                _this.$icon.attr("src", CONFIG.upyun.rc_upyun_http + file.rid + '!wh200')
                //todo 上传头像
            });
        },
        //时间
        _initClass : function () {
            var _this = this;
            this.$birth.datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: true,
                minView:"month",
            });
        },
    }

    $.fn.personInfo = function (option, str) {
        var $this = $(this);
        var data = $this.data('personInfo');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('personInfo', (data = new PERSONInfo(this, option)));

            return this;
        });
    }
    $("body").personInfo();
})();

