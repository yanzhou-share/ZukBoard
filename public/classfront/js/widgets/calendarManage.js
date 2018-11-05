/**
 * Created by fengge on 2018/1/31.
 */
/**
 * Created by ncy on 2018/1/30 0030.
 */

var calendarManage = (function () {
    var calendarManage = function (element, options) {
        this.$el = $(element);
        this.classes;//班级列表
        this.allclass();
        this._init();
        this._addEvents();
        this.currentDay = Tool.getNowFormatDate();
    }

    calendarManage.prototype = {
        _init: function () {
            this.$classInfoList = this.$el.find('[node-type="classInfo_list"]');//课程详情列表
            this.$add = this.$el.find('[action-type="add_course"]');//添加课程按钮
            this.$currCourse = this.$el.find('[node-type="courseList"]');//课程列表容器
            this.$addCourse = this.$el.find('[node-type="add_course"]');//添加课程容器
            this.$editSave   = this.$el.find('[action-type="edit_save"]');//保存编辑按钮
            this.$startTime  = this.$el.find('[node-type="start_class_time"]');//课程开始时间
            this.$classTitle = this.$el.find('[node-type="class_title"]');//课程标题
            this.$classDesc  = this.$el.find('[node-type="class_desc"]');//课程描述
            this.$classTeacher = this.$el.find('[node-type="class_teacher"]');//授课老师
            this.$lessonClass  = this.$el.find('[node-type="lesson_class"]');//上课班级
            this.$remindTime  = this.$el.find('[node-type="remind_time"]');//提醒时间
            this.$date = this.$el.find('#date');

            this.$editInfo  = this.$el.find('[action-type="edit_classinfo"]');//编辑傻妞妞
            this.$delInfo  = this.$el.find('[action-type="del_classinfo"]');//删除按钮
            this.$editCourse = this.$el.find('[node-type="edit_course"]');//添加课程容器
            this.$editCancel = this.$el.find('[action-type="edit_cancel"]');//取消编辑按钮


            this.$lessons_body = this.$el.find('#lessons_body');
            this.startTime = 0;
            this.remindTime = 0;
            //this._createCalendar();
            this._initClass();
        },

        _addEvents: function () {
            var _this = this;
            this.$add.on("click", $.proxy(this.addCourse, this));
            this.$editCancel.live("click", $.proxy(this.editCancel, this));
            this.$editSave.live("click", $.proxy(this.editSave, this));

            this.$startTime.on("changeDate", $.proxy(this.chooseStartTime, this));
            this.$remindTime.on("changeDate", $.proxy(this.chooseRemindTime, this));

            this.$editInfo.live("click", $.proxy(this.editInfo, this));
            this.$delInfo.live("click", $.proxy(this.delInfo, this));
            $("body").delegate('[data-roomid]', 'click', function () {
                var roomid = $(this).attr("data-roomid");
                window.location.href = "/page/web/classin/" + roomid + ".html";
            })
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
        //初始化时间组件
        _initClass : function () {
            var _this = this;
            this.$startTime.datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                todayBtn: true,
                startDate: Tool.getNowFormatDate(),
                //endDate: '2018-02-01 00:00',
                minView:0
            });

            this.$remindTime.datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                todayBtn: true,
                startDate: Tool.getNowFormatDate(),
                minView:0
            });
        },
        //开始时间
        chooseStartTime : function (event) {
            this.startTime = event.date.valueOf();
            console.log("开始时间：" + this.startTime);
            //this.$startTime.datetimepicker("setStartDate",this.$startTime.val());
        },
        //提醒时间
        chooseRemindTime : function (event) {
            this.remindTime = event.date.valueOf();
            console.log("提醒时间："+ this.remindTime);
            //this.$remindTime.datetimepicker("setStartDate",this.$remindTime.val());
        },
        //添加课程按钮
        addCourse : function () {
            this.renderOption();//炫染课程列表option
            this.$currCourse.hide() && this.$addCourse.show();

        },
        //取消
        editCancel : function () {
            var $target = $(event.target).closest('[action-type="edit_cancel"]'),
                type = $target.attr("data-type");
            this._reset();
            this.$addCourse.hide() && this.$editCourse.hide() && this.$currCourse.show();
        },
        //编辑课程
        editInfo : function () {
            var _this = this,
                $target = $(event.target).closest('[action-type="edit_classinfo"]'),
                lessonId = $target.parent().attr("data-id");
            Tool.ajax("/page/web/classfront/lessonDetail",{lessonId : lessonId}, function (res) {
                if(!!res && res.code == 0) {
                    var lessonInfo = res.data.lessonDetail;
                    _this.resetInfo(lessonInfo);
                } else {
                    console.log("编辑失败");
                }
            }, function (e) {
                console.log(e);
            });
        },
        //删除课程
        delInfo : function () {
            //todo 请求服务器删除此课程
            var _this = this,
                msg = "确定删除此节课程吗？",
                $target = $(event.target).closest('[action-type="del_classinfo"]'),
                lessonId = $target.parent().attr("data-id");
            Model.ConfirmBox(msg, function () {
                Tool.ajax("/page/web/classfront/deleteLesson",{lessonId : lessonId}, function (res) {
                    if(!!res && res.code == 0) {
                        $target.parents(".classInfo-list-item").remove();
                        //判断如果删除后的没有列表dom 则显示暂无课程
                        if($(".classInfo-list").find(".classInfo-list-item").length == 0) {
                            var arr = [];
                            arr.push('<div class="no-classInfo" style="display:block"><p>暂无课程，请添加课程信息</p></div>');
                            _this.$lessons_body.html(arr.join(''));
                        }
                    } else {
                        console.log("删除失败");
                    }
                }, function (e) {
                    console.log(e);
                });
            });

        },
        //保存数据
        editSave : function () {
            //todo 提交数据到服务器
            var _this = this,
                obj = {},
                $target = $(event.target).closest('[action-type="edit_save"]'),
                parent = $target.parents('.panel');
                type = $target.attr('data-type'),
                start = new Date(this.$date.text()).getTime(),//当前时间的零点
                end = start + (24*60*60*1000-1),//当前时间11点59分
                remindTime = Tool.timeToString(parent.find('[node-type="remind_time"]').val());


            obj.userId = CONFIG.userInfo.id;//上课人
            obj.lessonsTime = Tool.timeToString(parent.find('[node-type="start_class_time"]').val());
            obj.title = Tool.replaceHtmlTag(parent.find('[node-type="class_title"]').val());
            obj.content = Tool.replaceHtmlTag(parent.find('[node-type="class_desc"]').val());

            //校验时间
            if(!obj.lessonsTime) {
                this._showError(parent.find('[node-type="start_class_time"]'));

                return false;
            } else {
                this._hideError(parent.find('[node-type="start_class_time"]'));
            }
            //课程标题
            if(!obj.title || obj.title.length > 300 || obj.title.length < 2) {
                this._showError(parent.find('[node-type="class_title"]'));

                return false;
            } else {
                this._hideError(parent.find('[node-type="class_title"]'));
            }
            //课程内容
            if(!obj.content) {
                this._showError(parent.find('[node-type="class_desc"]'));

                return false;
            } else {
                this._hideError(parent.find('[node-type="class_desc"]'));
            }

            if(!!remindTime) {
                if (remindTime > obj.lessonsTime) {
                    this._showError(parent.find('[node-type="remind_time"]'));

                    return false;
                } else {
                    this._hideError(parent.find('[node-type="remind_time"]'));
                    obj.remindTime = remindTime;

                }
            }

            // data.lessonClass = Tool.replaceHtmlTag(this.$lessonClass.val());
            //todo 服务器请求
            if(type == "add") {
                obj.classId = parent.find("#select").find("option:selected").val();//选中的值;

                if(!obj.classId) {
                    this._showError(parent.find('#select'));

                    return false;
                } else {
                    this._hideError(parent.find('#select'));
                }
                //添加
                if(this.$editSave.hasClass("disabled")) return false;
                this.$editSave.addClass("disabled");
                var msg = "确定创建课程吗？";
                Model.ConfirmBox(msg, function (action) {
                    if(!action) {
                        _this.$editSave.removeClass("disabled");
                        return false;
                    }
                    Tool.ajax("/page/web/classfront/createLesson",obj, function (res) {
                        if(!!res && res.code == 0) {
                            var lessonInfo = res.data.lesson;
                            lessonInfo.classTeacher = Tool.replaceHtmlTag(_this.$classTeacher.val());
                            //判断是否为当前选择日期
                            if(obj.lessonsTime > start && obj.lessonsTime < end) {
                                if(_this.$lessons_body.find('.classInfo-list-item').length == 0) {
                                    _this.$lessons_body.html(_this._renderClassInfo(lessonInfo));
                                }else {
                                    _this.$classInfoList.append(_this._renderClassInfo(lessonInfo));//添加一条课程详情
                                }
                            }
                            //创建成功提示层
                            var msg = "课程创建成功！";
                            Model.successBox(msg, function (type) {
                                if(type) {
                                    $("input").not('[node-type="class_teacher"]').val("");//页面input框置空
                                    _this.$classDesc.val("");
                                    _this.$editCourse.hide() && _this.$addCourse.hide() && _this.$currCourse.show();
                                }
                            });
                            //层显示

                        } else {
                            console.log("添加失败");
                        }
                        _this.$editSave.removeClass("disabled");
                    }, function (e) {
                        console.log(e);
                        _this.$editSave.removeClass("disabled");
                    });
                });

            } else {
                obj.lessonId = $target.parent().attr('data-id');
                obj.classId = parent.find("#select").find("option:selected").val();//选中的值;
                //编辑 替换原来的内容

                if(!obj.classId) {
                    this._showError(parent.find('#select'));

                    return false;
                } else {
                    this._hideError(parent.find('#select'));
                }
                var msg = "确定修改课程吗？";
                Model.ConfirmBox(msg, function (action) {
                    if(!action) {
                        _this.$editSave.removeClass("disabled");
                        return false;
                    }
                    Tool.ajax("/page/web/classfront/updateLesson",obj, function (res) {
                        if(!!res && res.code == 0) {
                            // alert("修改成功");
                            var dom = $('[data-id="'+obj.lessonId+'"]').parents(".classInfo-list-item");
                            dom.find('[action-type="time"]').text(moment(obj.lessonsTime*1).format('HH:mm'));
                            dom.find('[action-type="title"]').text(obj.title);
                            dom.find('[action-type="detail"]').text(obj.content);

                            //重置页面
                            // _this.reset();
                            var msg = "课程修改成功！";
                            Model.successBox(msg, function (type) {
                                if(type) {
                                    _this.$editCourse.hide() && _this.$addCourse.hide() && _this.$currCourse.show();
                                }
                            });
                        } else {
                            console.log("添加失败");
                        }
                        _this.$editSave.removeClass("disabled");
                    }, function (e) {
                        console.log(e);
                        _this.$editSave.removeClass("disabled");
                    });
                });


            }

        },
        //炫染课程详情
        _renderClassInfo : function (data) {
            //todo 渲染课程信息
            var startTime = moment(data.lessonsTime*1).format('YYYY-MM-DD HH:mm'),
                classTitle = data.title ,
                classDesc = data.content,
                classTeacher = data.classTeacher,
                timestamp = Date.parse(new Date()),
                arr = [];
            if(this.$lessons_body.find('.classInfo-list-item').length == 0) {
                arr.push('<ul class="classInfo-list"  node-type="classInfo_list" style="display:block">');
            }
            arr.push('<li class="classInfo-list-item">');
            arr.push('<div class="classInfo-option">');
            if(data.status == 1) {
                arr.push('<button class="btn btn-danger" data-roomid="'+data.roomId+'">进入教室</button>');
            }
            if(CONFIG.userInfo.type == 2 && data.userId == CONFIG.userInfo.id) {
                arr.push('<div class="btn-group">');
                arr.push('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>');
                arr.push('<ul class="dropdown-menu" role="menu" data-id="'+data.id+'">');
                arr.push('<li action-type="edit_classinfo"><a>编辑</a></li>');
                arr.push('<li action-type="del_classinfo"><a>删除</a></li>');
                arr.push('</ul></div>');
            }
            arr.push('</div>');
            arr.push('<div class="classInfo-text"><span>上课时间：</span><p action-type="time">'+startTime+'</p></div>');
            arr.push('<div class="classInfo-text"><span>课程标题：</span><p action-type="title">'+classTitle+'</p></div>');
            arr.push('<div class="classInfo-text"><span>课程详情：</span><p action-type="detail">'+classDesc+'</p></div>');
            arr.push('<div class="classInfo-text"><span>老师姓名：</span><p>'+classTeacher+'</p></div>');
            if(data.description) {
                arr.push('<div class="classInfo-text"><span>老师简介：</span><p>'+data.description+'</p></div>');
            }
            arr.push('</li>');
            if(this.$lessons_body.find('.classInfo-list').length == 0) {
                arr.push('</ul>');
            }
            return arr.join("");
        },

        resetInfo : function (info) {
            //todo 根据详情炫染页面
            var _this = this,
                lessonTime = moment(info.lessons_time*1).format('YYYY-MM-DD HH:mm'),
                remindTime = moment(info.remind_time*1).format('YYYY-MM-DD HH:mm'),
                arr = [];
            arr.push('<div class="panel panel-default">');
            arr.push(' <div class="panel-heading">');
            arr.push('   <h2><strong>编辑课程</strong></h2>');
            arr.push('<div class="panel-actions" data-id="'+info.id+'">');
            arr.push('   <button class="btn btn-default" action-type="edit_cancel" data-type="edit">取消</button>');
            arr.push('    <button class="btn btn-danger" action-type="edit_save" data-type="edit">保存</button>');
            arr.push('    </div>');
            arr.push('    </div>');
            arr.push('   <div class="panel-body scroll-header">');
            arr.push('   <form role="form">');
            arr.push('    <div class="form-group">');
            arr.push('    <label class="control-label">上课日期</label>');
            arr.push('   <div class="controls">');
            arr.push('   <div class="input-group date col-sm-6">');
            arr.push('   <span class="input-group-addon"><i class="fa fa-calendar"></i></span>');
            arr.push('<input type="text" size="16" class="form-control date-picker" node-type="start_class_time"  value="'+lessonTime+'" readonly />');
            arr.push('   </div>');
            arr.push('<span class="help-block" style="display:none;">请选择上课日期</span>');
            arr.push('   </div>');
            arr.push('   </div>');
            arr.push('   <div class="form-group">');
            arr.push('   <label class="control-label">课程标题</label>');
            arr.push('   <div class="controls">');
            arr.push('   <div class="input-group col-sm-6">');
            arr.push('   <span class="input-group-addon"><i class="fa fa-font"></i></span>');
            arr.push('<input type="text" node-type="class_title" maxlength="50" placeholder="请输入课程标题" class="form-control" value="'+info.title+'">');
            arr.push('   </div>');
            arr.push('<span class="help-block" style="display:none;">请输入课程标题</span>');
            arr.push('   </div>');
            arr.push('   </div>');
            arr.push('   <div class="form-group">');
            arr.push('   <label class="control-label" >课程内容</label>');
            arr.push('   <div class="controls">');
            arr.push('   <textarea class="form-control" node-type="class_desc" placeholder="请输入课程具体详情" rows="6" style="width:100%">'+info.content+'</textarea>');
            arr.push('   </div>');
            arr.push('<span class="help-block" style="display:none;">请输入课程内容</span>');
            arr.push('   </div>');
            arr.push('    <div class="form-group">');
            arr.push('   <label class="control-label">授课老师</label>');
            arr.push('  <div class="controls">');
            arr.push('  <div class="input-group col-sm-6">');
            arr.push('   <input type="text" node-type="class_teacher" class="form-control" value="'+info.nick_name+'" readonly>');
            arr.push('   </div>');
            arr.push('   </div>');
            arr.push('    </div>');
            arr.push('   <div class="form-group">');
            arr.push('   <label class="control-label">设置上课班级</label>');
            arr.push('    <div class="controls">');
            arr.push('   <div class="input-group col-sm-6">');
            arr.push('   <select  name="select" id="select" class="form-control" size="1">');
            if( !!this.classes ) {
                if(this.classes.length > 0) {
                    this.classes.forEach(function(li){
                        if(li.id == info.class_id) {
                            arr.push('   <option value="'+li.id+'" selected>'+li.name+'</option>');
                        } else {
                            arr.push('   <option value="'+li.id+'">'+li.name+'</option>');
                        }
                    });
                }
            }
            arr.push('</select>');
            arr.push('<span class="help-block" style="display:none;">请选择上课班级</span>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('</div>');
            if(!!info.remind_time) {
                arr.push('<div class="form-group">');
                arr.push('<label class="control-label">设置提醒时间</label>');
                arr.push('<div class="controls">');
                arr.push('<div class="input-group date col-sm-6">');
                arr.push('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>');
                arr.push('<input type="text" size="16" class="form-control date-picker" node-type="remind_time" style="width: 263px;height: 34px;" value="'+remindTime+'" readonly />');
                arr.push(' </div>');
                arr.push('<span class="help-block" style="display:none;">请选择正确的提醒时间</span>');
                arr.push(' </div>');
                arr.push(' </div>');
            }
            arr.push('   </form>');
            arr.push('   </div>');
            arr.push('   </div>');
            this.$editCourse.html(arr.join(''));
            this.$currCourse.hide() && this.$editCourse.show();
        },
        //获取所有班级
        allclass : function () {
            var _this = this;
            Tool.ajax("/page/web/classfront/searchClassByUser",{}, function (res) {
                // console.log(res);
                if(!!res.code && res.code == 0) {
                    var list = res.data.result;
                    _this.classes = list;
                } else {
                    _this.classes = [];
                }
            }, function (e) {
                console.log(e);
            });
        },
        //炫染option选项
        renderOption : function () {
            var arr = [];
            arr.push('<select id="select" name="select" class="form-control" size="1">');
            if(this.classes.length > 0) {
                this.classes.forEach(function (info) {
                    arr.push('<option value="'+info.class_id+'">'+info.name+'</option>');
                });
            }
            arr.push('</select>');
            $('[node-type="select"]').html(arr.join(''));
        },

        _showError : function (_target) {
            if(!_target.parents(".form-group").hasClass("has-error")) {
                _target.parents(".form-group").addClass("has-error");
            }

            if(_target.next().length > 0) {
                _target.next().show();
            } else {
                _target.parent().next().show();
            }

        },
        _hideError : function (_target) {
            if(_target.parents(".form-group").hasClass("has-error")) {
                _target.parents(".form-group").removeClass("has-error");
            }
            if(_target.next().length > 0) {
                _target.next().hide();
            } else {
                _target.parent().next().hide();
            }
        },
        _showMessage : function (_target, msg) {
            _target.next().text(msg);
        },
        _reset : function () {
            //层显示
            $("input").not('[node-type="class_teacher"]').val("");//页面input框置空
            this.$classDesc.val("");
            $(".form-group").removeClass("has-error");
            $(".help-block").hide();

        }
    }

    $.fn.calendarManage = function (option, str) {
        var $this = $(this);
        var data = $this.data('calendarManage');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('calendarManage', (data = new calendarManage(this, option)));

            return this;
        });
    }
    $("body").calendarManage();
})();
