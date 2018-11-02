/**
 * Created by ncy on 2018/1/30 0030.
 */

var APPLY = (function() {
  var APPLY = function(element, options) {
    this.$el = $(element);
    this._swicth = false;
    this._init();
    // this._getCaptch();
  };

  APPLY.prototype = {
    _init: function() {
      this.$signBtn = this.$el.find("#subscribe-submit");//注册按钮
      this.$phone = this.$el.find("[node-type=\"phone\"]");//手机号dom
      this.$password = this.$el.find("[node-type=\"password\"]");//密码dom
      this.$verifyCode = this.$el.find("[node-type=\"verifyCode\"]");//验证码dom
      this.$msgCode = this.$el.find("[node-type=\"msgCode\"]");//短信验证码dom
      this.$signBox = this.$el.find("#signSuccess");//注册成功层
      this.$captch = this.$el.find("[node-type=\"captch\"]");//图片验证码

      //短信验证码
      this.$againsend = this.$el.find("[node-type=\"againsend\"]");//重新发送
      this.$sendMsg = this.$el.find("[node-type=\"sendMsg\"]");//发短信

      this.$nickName = this.$el.find("[node-type=\"nickName\"]");
      this.$phone = this.$el.find("[node-type=\"contactPhone\"]");
      this.$company = this.$el.find("[node-type=\"company\"]");
      this.$field = this.$el.find("[node-type=\"field\"]");
      this.$city = this.$el.find("[node-type=\"city\"]");

      this.$applyBox = this.$el.find("#applySuccess");//申请成功层
      this.$applyError = this.$el.find("#applyError");//申请错误

      this.$applyBtn = this.$el.find("[action-type=\"submit_action\"]");

      this._addEvents();
    },
    _addEvents: function() {
      var _this = this;
      this.$applyBtn.on("click", $.proxy(this.apply, this));
      //回车事件
      $("input").keydown(function(event) {
        if (event.keyCode == 13) {
          _this.$applyBtn.trigger("click");
        }
      });
    },

    _check_name: function(name) {
      var reg = /^[A-Za-z0-9-\u4e00-\u9fa5]{2,20}$/;
      return reg.test(name);
    },

    _check_company: function(name) {
      var reg = /^[A-Za-z0-9-\u4e00-\u9fa5]{2,30}$/;
      return reg.test(name);
    },

    _check_field: function(name) {
      var reg = /^[A-Za-z0-9-\u4e00-\u9fa5]{2,30}$/;
      return reg.test(name);
    },

    apply: function() {
      var that = this;
      var name = Tool.replaceHtmlTag($.trim(this.$nickName.val()));
      var phone = Tool.replaceHtmlTag($.trim(this.$phone.val()));
      var company = Tool.replaceHtmlTag($.trim(this.$company.val()));
      var field = Tool.replaceHtmlTag($.trim(this.$field.val()));
      var city = Tool.replaceHtmlTag($.trim(this.$city.find("option:selected").text()));
      city = city == "请选择" ? "" : city;

      //隐藏所有的错误提示
      this._hideALLError();

      if (!name || !this._check_name(name)) {
        this._showError(this.$nickName);
        return false;
      } else {
        this._hideError(this.$nickName);
      }

      // if(!phone){
      //     this._showError(this.$phone);
      //     return false;
      // }else{
      //     this._hideError(this.$phone);
      // }

      if (!Tool.check_mobile(phone)) {
        this._showError(this.$phone);
        return false;
      } else {
        this._hideError(this.$phone);
      }

      if (!company || !this._check_company(company)) {
        this._showError(this.$company);
        return false;
      } else {
        this._hideError(this.$company);
      }

      if (!field || !this._check_field(field)) {
        this._showError(this.$field);
        return false;
      } else {
        this._hideError(this.$field);
      }

      if (this.$applyBtn.hasClass("disabled")) return;
      this.$applyBtn.addClass("disabled");

      //TODO 跨域问题，暂时成功处理
      this.$applyBox.show();
      setTimeout(function() {
        that.$applyBox.hide();
        window.location.href = "/web/index";
      }, 1000);

      //提交申请
      // Tool.ajax("https://www.imclass.cn/page/web/classfront/addPersonTrial",{linkManName : name, linkManPhone: phone, organizeName: company, serviceField: field, city: city}, function (res) {
      //     if(!!res.code && res.code == 0) {
      //         console.log(res);
      //         //alert("提交成功");
      //         that.$applyBox.show();
      //         setTimeout(function () {
      //             that.$applyBox.hide();
      //             window.location.href = "/";
      //         }, 1000);
      //     } else {
      //         console.log(res);
      //         alert("申请失败, 服务异常");
      //     }
      //     that.$applyBtn.removeClass('disabled');
      // }, function (e) {
      //     console.log(e);
      //     that.$applyBtn.removeClass('disabled');
      //     alert("申请失败, 服务异常");
      // });
    },

    _hideALLError: function() {
      $(".form-error").each(function() {
        if (!$(this).is(":hidden")) {
          $(this).hide();
        }
      });
    },

    //显示错误提示 true 正常dom   false 验证码dom
    _showError: function(_target) {
      // var errDom = _target.closest("li").find(".form-error").eq(0);
      // if (errDom.is(":hidden")) {
      //     errDom.show();
      // }
      this.$applyError.fadeIn().fadeOut(1000);
      !!_target && _target.closest(".inp").addClass("applyError");
    },

    //隐藏错误提示
    _hideError: function(_target) {
      // var errDom = _target.closest("li").find(".form-error").eq(0);
      // if (!errDom.is(":hidden")) {
      //     errDom.hide();
      // }
      !!_target && _target.closest(".inp").removeClass("applyError");
    },
    _showMessage: function(_target, message) {
      var Dom = _target.closest("li").find(".form-error").eq(0);
      Dom.text(message);
    }
  };

  $.fn.apply = function(option, str) {
    var $this = $(this);
    var data = $this.data("apply");
    return typeof option == "string" ? data[option](str) : this.each(function() {

      if (!data) $this.data("apply", (data = new APPLY(this, option)));

      return this;
    });
  };
  $("body").apply();
})();

