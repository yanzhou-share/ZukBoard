/**
 * Created by ncy on 2018/1/30 0030.
 */

var NOTICE = (function () {
    var NOTICE = function (element, options) {
        this.$el = $(element);
        this._init();
    }

    NOTICE.prototype = {
        _init: function () {
            this.$release = this.$el.find('[node-type="save" ]');//保存
            this.$cancel = this.$el.find('[node-type="cancel" ]');//取消
            this.$noticeTitle = this.$el.find('[node-type="noticeTitle"]');//公告标题
            this.$noticeContent = this.$el.find('[node-type="noticeContent"]');//公告内容
            this.$allcheck = this.$el.find('[node-type="allcheck"]');
            this.checked = this.$el.find("input[name='inline-checkbox1']");
            this.$nodedetail = this.$el.find('[node-type="noteDetail"]');
            this.$create = this.$el.find('[node-type="create"]');
            this.$detail = this.$el.find('[node-type="detail"]');
            this.$delete = this.$el.find('[node-type="delete"]');
            this.$noticeList = this.$el.find('[node-type="notice-list"]');
            this.$classList = this.$el.find('[node-type="class-list"]');
            //this.$noticeScroll = this.$el.find('[node-type="note-box"]');
            this.$noticeScroll = this.$el.find('[node-type="note-scroll"]');
            this.$noNotice = this.$el.find('.no-note');
            this.currNoticeId = "";
            this.classList = "";
            this.organizeId = organizeId;
            this.userInfo =  userInfo;
            this.userId = !!this.userInfo && this.userInfo.id ? this.userInfo.id : "";
            this.switch = 0;
            this.page = 2;
            this._render();
            this._addEvents();
        },

        _render : function () {
            this._classList();
            //this._renderList();
        },

        _addEvents: function () {
            var _this = this;
            this.$release.on("click", $.proxy(this._release, this));
            this.$cancel.on("click", $.proxy(this._cancel, this));
            this.$allcheck.on("click", $.proxy(this._allcheck, this));
            this.$nodedetail.live("click", $.proxy(this._detail, this));
            this.$delete.live("click", $.proxy(this._delete, this));
            this.$noticeScroll.on("scroll", $.proxy(this._noticeScroll, this));
            this.$classList.find(".checkbox-inline").on("click", $.proxy(this._checkClass, this));
            //回车事件
            $('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    _this.$release.trigger("click");
                }
            });
        },

        _renderList : function () {
            var that = this;
            var data = {"organizeId": this.organizeId,"pageNumber": this.page,"pageSize": 6};
            Tool.ajax("/page/web/classfront/noticeList",data
                , function (res) {
                    // console.log(res);
                    if(!!res && res.code == 0) {
                        var data = res.data.list;
                        that._renderNoticeList(data);
                        that.page++;
                    } else {
                        console.log("加载通知列表错误");
                    }
                    //that.$noticeScroll.on("scroll", $.proxy(that._noticeScroll, that));
                }, function (e) {
                    console.log(e);
                });
        },

        _checkClass : function () {
            var thisCheck = $(event.target).closest(".checkbox-inline").find("input");
            if(thisCheck.is(':checked')) {
                thisCheck.removeAttr("checked");
            }else{
                thisCheck.attr("checked", "true");
            }
        },

        _noticeScroll : function () {
            var that = this;
            var scrollTop = this.$noticeScroll.scrollTop();
            var owinH = this.$noticeScroll.height();
            var odocH = this.$noticeScroll.height();
            if (scrollTop + owinH >= odocH - 50) {
                if(this.switch == 0){
                    this.switch = 1;
                    var data = {"organizeId": this.organizeId,"pageNumber": this.page,"pageSize": 6};
                    Tool.ajax("/page/web/classfront/noticeList",data
                        , function (res) {
                            // console.log(res);
                            if(!!res && res.code == 0) {
                                var data = res.data.list;

                                //var data = !!res.data && !!res.data.notice ? res.data.notice : "";
                                //_this._renderNotice(data);
                                that._renderNoticeList(data);
                                that.page++;
                            } else {

                            }
                            that.switch = 0;
                        }, function (e) {
                            console.log(e);
                            that.switch = 0;
                        });
                }

            }
        },

        _renderNoticeList : function (list) {
            var _html = "";
            for(var i=0; i<list.length; i++){
                // this._renderNotice(list[i]);
                _html+=this._noticeItem(list[i]);
            }
            this.$noticeList.append(_html);
        },

        _noticeItem :function (item) {
            var arr = [], id = item.id || "", title = item.title || "", content = item.content || "",
                time = item.create_time || "";
            arr.push('<li node-type="noteDetail" data-id="'+id+'">');
            arr.push('       <a ref="#">');
            arr.push('      <h5>'+title+'</h5>');
            arr.push('    <p class="time">'+moment(time*1).format('MM-DD HH:mm')+'</p>');
            arr.push('<p>'+content+'</p>');
            arr.push('</a>');
            arr.push(' </li>');
            // this.$noticeList.prepend(arr.join(""));
            return arr.join("");
        },

        _allcheck : function () {
            var that = this;
            var checkBox = $("input[name='inline-checkbox1']");
            var allCheckBox = this.$allcheck.find('input[type="checkbox"]');
            if(checkBox.length > 0) {
                checkBox.each(function () {
                    if(allCheckBox.is(":checked")) {
                        $(this).attr("checked","true");
                    } else {
                        $(this).removeAttr("checked");
                    }
                    //$(this).attr("checked","true");
                });
            }
            //$("input[name='checkbox']").removeAttr("checked");
        },

        _release: function () {
            var _this = this,
                noticeTitle = Tool.replaceHtmlTag($.trim(this.$noticeTitle.val())),
                noticeContent = Tool.replaceHtmlTag($.trim(this.$noticeContent.val())),
                noticeGroup = [],
                obj = {};
            if (!noticeTitle) {
                this._showError(this.$noticeTitle);

                return false;
            } else {
                this._hideError(this.$noticeTitle);
                //判断是否有空格 有空格 多个空格替换为一个
                Tool.doString(noticeTitle);

            }

            if(!noticeContent) {
                this._showError(this.$noticeContent, false);

                return false;
            } else {
                this._hideError(this.$noticeContent, false);
                noticeContent = this._doString(noticeContent);
            }

            //选重值
            this.checked.each(function() {
                if($(this).is(':checked')) {
                    noticeGroup.push($(this).val());
                }
            });

            obj.userId = this.userId;//发布者id
            obj.createUser = this.userId;
            obj.organizeId = this.organizeId;//学校id
            var classIds = this.getCheckClass();
            obj.classId = classIds.join(",");//["1","2","3"].join(",");//多个为数组
            obj.title = noticeTitle;
            obj.content = noticeContent;

            if(!obj.classId){
                Model.MsgBox("请选择发送范围");
                return;
            }

            //todo : 发布公告
            var msg = "确认发布公告";
            Model.ConfirmBox(msg, function (res) {
                if(res) {
                    if (_this.$release.hasClass('disabled'))    return;
                    _this.$release.addClass('disabled');
                    Tool.ajax("/page/web/classfront/createNotice",obj
                        , function (res) {
                            // console.log(res);
                            if(!!res && res.code == 0) {
                                //注册成功
                                Model.MsgBox("发布成功");
                                var data = !!res.data && !!res.data.notice ? res.data.notice : "";
                                _this._renderNotice(data);
                                _this._setNoNotice();//设置列表空状态
                                _this._reset();
                            } else {
                                Model.MsgBox("发布失败");
                            }
                            _this.$release.removeClass('disabled');
                        }, function (e) {
                            _this.$release.removeClass('disabled');
                            console.log(e);
                        });
                }
            });

        },

        _renderNotice :function (item) {
            var arr = [], id = item.id || "", title = item.title || "", content = item.content || "",
                time = item.createTime || "";
                title = title.length > 10 ? title.substring(0, 10) + "..." : title;
                content = content.length > 100 ? content.substring(0, 100) + "..." : content;
            arr.push('<li node-type="noteDetail" data-id="'+id+'">');
            arr.push('       <a ref="#">');
            arr.push('      <h5>'+title+'</h5>');
            arr.push('    <p class="time">'+moment(time*1).format('MM-DD HH:mm')+'</p>');
            arr.push('<p>'+content+'</p>');
            arr.push('</a>');
            arr.push(' </li>');
            this.$noticeList.prepend(arr.join(""));
        },

        _setNoNotice : function () {
            if(this.$noticeList.find("li").length > 0){
                this.$noNotice.hide();
            }else{
                this.$noNotice.show();
            }
        },

        getCheckClass : function (){
            var result = [];
            $('input[name="inline-checkbox1"]').each(function() {
                if ("checked"==$(this).attr('checked')) {
                    //str=str+$(this).val()+",";
                    var classId = $(this).attr("data-id");
                    result.added(classId);
                }
            });
            return result;
        },

        _renderClassitem : function (item) {
            var arr = [], id = item.id || item.class_id || "", name = item.name || "";
            arr.push('<label class="checkbox-inline"  >');
            arr.push('<input type="checkbox" data-id="'+id+'"  name="inline-checkbox1" value="option2">'+name+'</label>');
            return arr.join("");
        },

        _renderClass : function (classList) {
            var _html = "";
            if(!!classList && classList.length > 0){
                for(var i=0; i<classList.length; i++){
                    _html+= this._renderClassitem(classList[i]);
                }
            }
            this.$classList.html(_html);
        },

        _classList : function () {
            var _this = this;
            var organizeId = this.organizeId;
            var url = this.userInfo.type == 3 ? "/page/web/classfront/classList" : (this.userInfo.type == 2 ? "/page/web/classfront/searchClassByUser" : "");
            Tool.ajax(url, {organizeId : organizeId}, function (res) {
                console.log(res);
                if(!!res.code && res.code == 0) {
                    var list = res.data.list || res.data.result;
                    _this.classList  = list;
                    _this._renderClass(list);
                    //_this.classList = list;
                } else {
                    return [];
                }
            }, function (e) {
                console.log(e);
            });
        },

        _getClassNames : function (ids) {
            var name_arr = [], that = this;
            if(!!ids && this.classList){
                ids.forEach(function (item) {
                    var class_id = item.class_id;
                    for(var i=0; i<that.classList.length; i++){
                        var orgid = that.classList[i].id || that.classList[i].class_id;
                        if(orgid == class_id){
                            name_arr.added(that.classList[i].name);
                            break;
                        }
                    }
                });
            }
            return name_arr;
        },

        _getNoticeInfo : function (id) {
            var info = "";
            if(!!id && !!noticeList){
                for(var i=0; i<noticeList.length; i++){
                    if(id == noticeList[i].id){
                        info = noticeList[i];
                        break;
                    }
                }
            }
            return info;
        },

        _detail : function () {
            var _this = this,
                $target = $(event.target).closest('[node-type="noteDetail"]'),
                id = $target.attr('data-id');
            this._getDetail(id);
        },

        _getDetail : function (id) {
            var _this = this;
            if(!!id){
                this.currNoticeId = id;
                //todo : 获得详情
                Tool.ajax("/page/web/classfront/noticeDetail",{"noticeId": id}
                    , function (res) {
                        // console.log(res);
                        if(!!res && res.code == 0) {
                            var data = res.data;
                            _this._renderDetail(data);
                            //that.delNoticeItem(data.noticeId);
                        } else {
                            console.log("获取详情失败");
                        }
                    }, function (e) {
                        console.log(e);
                    });
            }
            this.$detail.show();
            this.$create.hide();
        },

        _renderDetail : function (data) {
            var item = data.notice, class_ids = data.classesId || [];
            var arr = [], id = item.id || "", title = item.title || "", content = item.content || "",
                time = item.create_time || "", create_user = item.create_user;
            var classNames = this._getClassNames(class_ids); //className = !!classInfo && classInfo.name ? classInfo.name : "";
            arr.push('<div class="panel panel-default">');
            arr.push('       <div class="panel-heading">');
            arr.push('   <h2>公告内容</h2>');
            if(create_user == this.userId || this.userInfo.type == 3){
                arr.push('    <div class="panel-actions">');
                arr.push('   <button class="btn btn-danger" node-type="delete" data-id="'+id+'">删除</button>');
                arr.push('   </div>');
            }
            arr.push('    </div>');
            arr.push('    <div class="panel-body scroll-header no-padding">');
            arr.push('    <div class="note-detail">');
            arr.push('    <h1><strong>'+title+'</strong></h1>');
            arr.push('<p class="time">'+moment(time*1).format('MM-DD HH:mm')+'</p>');
            arr.push('<p>'+content+'</p>');
            //arr.push('<p class="t-i">1、根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神...</p>');
            //arr.push('<p class="t-i">2、根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神...</p>');
            //arr.push('<p class="t-i">3、根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神，根据上级有关精神...</p>');
            //arr.push('<br />');
            arr.push('<p><strong>发布范围：</strong><br />'+classNames.join(",")+'</p>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('</div>');
            this.$detail.html(arr.join(''));
        },

        _delete : function () {
            var that = this;
            //todo 删除公告
            //this.$detail.hide();
            //this.$create.show();
            //var noticeId = $(event.target).closest('[node-type="noteDetail"]').attr("data-id");
            var data = {};
            data.noticeId = this.currNoticeId;
            data.organizeId = this.organizeId;
            //todo : 删除公告
            var msg = "确认删除公告";
            Model.ConfirmBox(msg, function (res) {
                if(!!res){
                    if (that.$delete.hasClass('disabled'))    return;
                    that.$delete.addClass("disabled");
                    Tool.ajax("/page/web/classfront/deleteNotice",data
                        , function (res) {
                            // console.log(res);
                            if(!!res && res.code == 0) {
                                Model.MsgBox("删除公告成功");
                                that.delNoticeItem(data.noticeId);
                                that.selectPrevNotice(data.noticeId);
                                that._setNoNotice();
                            } else {
                                Model.MsgBox("删除公告失败");
                            }
                            that.$delete.removeClass('disabled');
                        }, function (e) {
                            that.$delete.removeClass('disabled');
                            console.log(e);
                        });
                }
            });
        },
        //选中上一条公告
        selectPrevNotice : function (noticeId) {
            if(!!noticeId){
                var target = this.$nodedetail.first();
                if(!!target && target.length > 0){
                    var id = target.attr("data-id");
                    this._getDetail(id);
                }else{
                    //todo 暂无公告
                }

            }
        },

        delNoticeItem : function (noticeId) {
            if(!!noticeId){
                this.$noticeList.find('li[data-id="'+noticeId+'"]').remove();
            }
        },

        _reset : function () {
            this.$noticeTitle.val("");
            this.$noticeContent.val("");
            this._hideError(this.$noticeTitle, false);
            this._hideError(this.$noticeContent, false);
            $('input[type="checkbox"]').each(function () {
                $(this).removeAttr("checked");
            });
        },

        _update : function () {
            var obj = {};
            obj.noticeId = 10;
            obj.classId = 1;//多个为数组
            obj.title = "2222";
            obj.content = "3333";

            Tool.ajax("/page/web/classfront/updateNotice",obj, function (res) {
                console.log(res);
                if(!!res && res.code == 0) {
                    //注册成功
                    Model.MsgBox("发布成功");
                } else {
                    Model.MsgBox("发布失败");
                }

            }, function (e) {
                console.log(JSON.stringify(e));
            });
        },
        _doString : function (_string) {
            if (_string.indexOf(" ") >=0) {
                //空格正则
                var space = /\s+/g;
                _string = _string.replace(space, ' ');
            }
            //是否有回行
            if (_string.indexOf("\n") >= 0) {
                 var enter = /[\r\n]+/g;
                 _string = _string.replace(enter, '<br/><br/>');
                //var reg = new RegExp("\n", "g");
                //_string = _string.replace(reg, "<br/><br/>");
            }
             return _string;
        },
        _showError : function (_target, type){
            if(type) {
                var parent = _target.parent().parent().parent();
                if(!parent.hasClass("has-error")) {
                    parent.addClass("has-error");

                }
                if(_target.parent(".input-group").next().is(":hidden")) {
                    _target.parent(".input-group").next().show();
                }
            } else {
                var parent = _target.parent().parent();
                if(!parent.hasClass("has-error")) {
                    parent.addClass("has-error");

                }
                if(_target.next().is(":hidden")) {
                    _target.next().show();
                }
            }
        },
        
        _hideError : function (_target, type) {
            if(type) {
                var parent = _target.parent().parent().parent();
                if(parent.hasClass("has-error")) {
                    parent.removeClass("has-error");

                }
                if(!_target.parent(".input-group").next().is(":hidden")) {
                    _target.parent(".input-group").next().hide();
                }
            } else {
                var parent = _target.parent().parent();
                if(parent.hasClass("has-error")) {
                    parent.removeClass("has-error");

                }
                if(!_target.next().is(":hidden")) {
                    _target.next().hide();
                }
            }

        },
        _cancel : function () {
            this.$noticeTitle.val("");
            this.$noticeContent.val("");
            $(".form-group").removeClass("has-error");
            $(".help-block").hide();
        }
    }

    $.fn.notice = function (option, str) {
        var $this = $(this);
        var data = $this.data('notice');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('notice', (data = new NOTICE(this, option)));

            return this;
        });
    }
    $("body").notice();
})();
