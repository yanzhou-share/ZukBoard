/**
 * Created by ncy on 2018/1/30 0030.
 */
var MMANAGE = (function () {
    var MMANAGE = function (element, options) {
        this.$el = $(element);
        this._swicth = false;
        // this.classList ;//班级列表数据
        this._classList();//班级列表
        this._init();
    }

    MMANAGE.prototype = {
        _init: function () {
            this.$group = this.$el.find('.sort');//班级、成员dom
            this.$item = this.$el.find('.sort-item');//老师、学生
            this.$allClass = this.$el.find('[node-type="class"]');//所有班级按钮
            this.$searchInput = this.$el.find(".search-control");//搜索输入框
            this.$searchButton = this.$el.find('[node-type="searchButton"]');//搜索输入框
            this.$searchCancle = this.$el.find('[node-type="searchCancle"]');//搜索取消按钮
            this.$RightContent  = this.$el.find('[node-type="buttonContent"]');//点击创建班级一排按钮右侧内容
            this.$classContent = this.$el.find('[node-type="classContent"]');//班级右侧班级详情内容
            this.$className = this.$el.find('[node-type="className"]');//班级名称
            this.$classNo = this.$el.find('[node-type="classNo"]');//班级编号
            this.$teacherName = this.$el.find('[node-type="teacherName"]');//老师姓名
            this.$teacherPhone = this.$el.find('[node-type="teacherPhone"]');//老师手机号
            this.$studentName = this.$el.find('[node-type="studentName"]');//学生姓名
            this.$studentPhone = this.$el.find('[node-type="studentPhone"]');//学生手机号
            this.$oldClassName = this.$el.find('[node-type="oldClassName"]');//原班级名称
            this.$newClassName = this.$el.find('[node-type="newClassName"]');//新班级名称
            this.$reName = this.$el.find('[node-type="reName"]');//重命名按钮
            this.$delClass = this.$el.find('[node-type="delClass"]');//解散班级
            this.$delClassPeople = this.$el.find('[node-type="delClassPeople"]');//班级内删除人员
            this.$addToClass = this.$el.find('[node-type="addToClass"]');//添加成员到班级
            this.$deleteInvite = this.$el.find('[node-type="deleteInvite"]');//删除邀请成员
            this.$peopleDetail = this.$el.find('[node-type="peopleDetail"]');//成员详情点击
            this.$peopleContent = this.$el.find('[node-type="peopleContent"]');//成员详情内容
            this.$studentList = this.$el.find('[node-type="studentList"]');//学生列表dom
            this.$teacherList = this.$el.find('[node-type="teacherList"]');//老师列表dom
            this.$classList = this.$el.find('[node-type="classList"]');//班级列表dom
            this.$delPeople = this.$el.find('[node-type="delPeople"]');//删除人
            this.$searchList = this.$el.find('[node-type="searchList"]');//搜索列表dom
            this.$userList = this.$el.find('[node-type="userList"]');//搜索列表dom
            this.$input = this.$el.find('input');//所有input框
            this.$cancle = this.$el.find('[node-type="cancle"]');//取消按钮
            this.$create = this.$el.find('[node-type="create"]');//确定按钮
            this.userInfo =  CONFIG.userInfo;

            this._addEvents();
        },
        _addEvents: function () {
            var _this = this;
            this.$group.on("click", $.proxy(this._group, this));
            this.$item.on("click", $.proxy(this._memberList, this));

            this.$searchInput.on("input", $.proxy(this._input, this));
            this.$searchCancle.on("click", $.proxy(this._cancleSearch, this));
            //搜索
            this.$searchButton.on("click", $.proxy(this._searchButton, this));

            //按钮
            this.$cancle.on("click", $.proxy(this._cancle, this));
            this.$create.on("click", $.proxy(this._create, this));
            //重命名
            this.$reName.live("click", $.proxy(this._reName, this));
            //input框失去焦点
            this.$newClassName.live("blur",$.proxy(this._handelClassName, this) );
            //解散班级
            this.$delClass.live("click",$.proxy(this._delClass, this) );
            //删除班级成员
            this.$delClassPeople.live("click", $.proxy(this._delClassPeople, this) );
            //添加成员到班级
            this.$addToClass.on("click", $.proxy(this._addToClass, this) );
            //删除邀请成员
            this.$deleteInvite.on("click", $.proxy(this._deleteInvite, this) );
            // this.$el.delegate('[node-type="addToClass"]',"click",$.proxy(this._addToClass, this));
            //点击成员查看详情
            this.$peopleDetail.on("click",$.proxy(this._peopleDetail, this) );
            //点击班级按钮
            this.$allClass.on("click" , $.proxy(this._classDetail, this));//live监听不好使

            this.$delPeople.live('click', $.proxy(this._delPeople, this));


            //右侧按钮
            $('[node-type="Rbutton"]').click(function (event) {
                var $target = $(event.target).closest('[node-type="Rbutton"]'),
                    index = $('[node-type="Rbutton"]').index(this);
                _this._reset();
                _this.$RightContent.eq(index).show().siblings('.col-lg-8').hide();
            });


        },
        _classList :function () {
            var _this = this;
            Tool.ajax("/page/web/classfront/classList",{}, function (res) {
                // console.log(res);
                if(!!res.code && res.code == 0) {
                    var list = res.data.list;
                        _this.classList = list;
                } else {
                    return [];
                }
            }, function (e) {
                console.log(e);
            });
        },
        //班级详情
        _classDetail : function (event)　{
            var _this = this,
                $target = $(event.target).closest('[node-type="class"]'),
                classId = $target.attr("data-classId");
            // alert(classId);
            //todo : 获取班级详情 请求服务器
            Tool.ajax("/page/web/classfront/classDetail",{classId : classId}, function (res) {
                if(!!res && res.code == 0) {
                    var info = res.data;
                    _this._renderClassInfo(info);

                    //必须动态获取 因为后面有删除
                    // $('[node-type="classContent"]').eq(index).show().siblings('.col-lg-8').hide();
                } else {
                    console.log(res);
                }
            }, function (e) {
                console.log(e);
            });

        },
        //点击重命名按钮
        _reName : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="reName"]'),
                obj = {};
            $target.prevAll('span').hide();
            $target.prevAll('input').css("display","inline-block").focusEnd();
        },
        //请求服务器处理重命名
        _handelClassName : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="newClassName"]'),
                newClassName = $.trim($target.val()),
                oldClassName = $target.prev('span').text(),
                classId = $target.parents(".panel-heading").attr("data-classId"),
                obj = {};
            //如果新名字等于旧名字 不做处理
            if(newClassName == oldClassName) {
                $target.prev('span').text(newClassName).show();
                $target.css("display","none");
                return false;
            } else {
                if (!newClassName || !Tool.testNickName(newClassName) || newClassName.length > 20) {
                    Model.MsgBox("班级名称格式错误");

                    return false;
                }

            }
            //todo ：根据班级id服务器更改名字
            if($(event.target).closest('[node-type="delClassPeople"]').length > 0) {
                event.stopPropagation();
            }
            obj.classId = classId;
            obj.name = Tool.replaceHtmlTag(newClassName);
            Tool.ajax("/page/web/classfront/classUpdate",obj, function (res) {
                if(!!res && res.code == 0) {
                    $target.prev('span').text(newClassName).show();
                    $('[data-classid="'+classId+'"]').find("span").text(newClassName);
                    $target.css("display","none");
                } else if (res.code == 3001)  {
                    Model.MsgBox("班级名称已存在");
                } else {
                    console.log(res);
                }
            }, function (e) {
                console.log(e);
            });
        },
       //解散班级
        _delClass : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="delClass"]'),
                classId = $target.parents(".panel-heading").attr("data-classId"),
                msg = "确定解散班级吗？";
           var index = $('[node-type="delClass"]').index(this);
            //alert(index);
            Model.ConfirmBox(msg, function (res) {
                if(res) {
                    //todo ： 根据班级id 解散班级 向服务器请求接口
                    Tool.ajax("/page/web/classfront/deleteClass",{classId : classId}, function (res) {
                        if(!!res && res.code == 0) {
                            //移除当前确认删除的content 显示第一个content 实时获取
                            $('[node-type="classContent"]').html('').hide();
                            $('[data-classid="'+classId+'"]').remove();
                            $('[node-type="buttonContent"]').eq(0).show();
                        } else {
                            console.log(res);
                        }
                    }, function (e) {
                        console.log(e);
                    });
                }
            });

        },
        //删除班级成员
        _delClassPeople : function (event) {
            var  $target = $(event.target).closest('[node-type="delClassPeople"]'),
                peopleTotalDom = $target.parents(".class-member-item").find('[node-type="peopleTotal"]'),
                peopleTotal = peopleTotalDom.text(),
                classId = $target.parents('.panel-body').prev().attr('data-classId'),
                userId = $target.attr("data-userId"),
                msg = "是否删除？";
            Model.ConfirmBox(msg, function (res) {
                if(res) {
                    //todo ：删除班级成员 移除dom 总数减1
                    Tool.ajax("/page/web/classfront/deleteClassUser",{classId : classId, userId : userId}, function (res) {
                        if(!!res && res.code == 0) {
                            $target.parents("dd").remove();
                            peopleTotalDom.text(peopleTotal - 1);
                        } else {
                            console.log(res);
                        }
                    }, function (e) {
                        console.log(e);
                    });
                }
            });
        },
        //添加成员到教室
        _addToClass : function (event) {
            var $target = $(event.target).closest('[node-type="addToClass"]'),
                peopleId = $target.parents('[node-type="peopleDetail"]').attr("data-uid"),
                obj = {};
            // if($(event.target).closest('[node-type="peopleDetail"]').length > 0) {
            //     event.stopPropagation();
            //     return false;
            // }
            //todo ：请求服务器接口 添加人员到班级
            Model.AddMemberBox(this.classList, function(id) {
                if(!!id) {
                    //res为select选中值
                    obj.classId = id;
                    obj.userId = peopleId;
                    Tool.ajax("/page/web/classfront/createClassUser",obj, function (res) {
                        if(!!res && res.code == 0) {
                            console.log("添加成员成功 classid:"+id+"userId"+obj.userId);
                        } else {
                            console.log(res);
                        }
                    }, function (e) {
                        console.log(e);
                    });
                }
            });
        },
        _deleteInvite : function () {
            var $target = $(event.target).closest('[node-type="deleteInvite"]'),
                mobile = $target.attr("data-uid");

            var msg = "确定删除吗？";
            Model.ConfirmBox(msg, function (action) {
                if(!action) {
                    return false;
                }
                Tool.ajax("/page/web/classfront/deleteInvitedUser",{mobile : mobile}, function (res) {
                    if(!!res && res.code == 0) {
                        $target.parents('dd').remove();
                    } else {
                        console.log("添加失败");
                    }
                }, function (e) {
                    console.log(e);
                });
            });
        },
        //用户详情
        _peopleDetail : function (event) {
            var _this = this;
                $target = $(event.target).closest('[node-type="peopleDetail"]'),
                userId = $target.attr("data-uid");
            if($(event.target).closest('[node-type="addToClass"]').length > 0) {
                event.stopPropagation();
                return false;
            }
            //todo ：请求服务器接口 获取人员详情 炫染
            Tool.ajax("/page/web/classfront/userDetail",{userId : userId}, function (res) {
                if(!!res && res.code == 0) {
                    var info = res.data.user;
                    _this._renderUserInfo(info);
                } else {
                    console.log(res);
                }
            }, function (e) {
                console.log(e);
            });
        },
        _input : function () {
            var val = this.$searchInput.val(),
                Dom = this.$searchInput;
            if(!!val){
                if(Dom.next().is(':hidden')) Dom.next().show();
            } else {
                if(!Dom.next().is(':hidden')) Dom.next().hide();
            }
        },
        //取消搜索按钮
        _cancleSearch : function () {
            this.$searchCancle.prev().val("");
            this.$searchCancle.hide();

            this.$searchList.hide();
            this.$userList.show();
        },
        //搜索人详情
        _searchButton : function () {
            //todo ：请求服务器 搜索不到则显示为搜索到用户信息
            var _this = this,
                keyword = $.trim(this.$searchCancle.prev().val());
            if(!keyword) {
                return false;
            }
           //todo： 模糊搜索
            Tool.ajax("/page/web/classfront/searchUser",{keyword : keyword}, function (res) {
                if(!!res && res.code == 0) {
                    console.log(res.data);
                    var users = res.data.users;
                    _this._renderSearchInfo(keyword, users);
                } else {
                    console.log(res);
                }
            }, function (e) {
                console.log(e);
            });

        },
        _renderSearchInfo : function (keyword, users) {
            var arr = [];
            if(users.length > 0) {
                users.forEach(function(user){
                    var name = Tool.StringHighlight(keyword, user.nick_name);
                    arr.push('<li class="sort-item member"data-uid="'+user.id+'" node-type="peopleDetail">');
                    arr.push('        <a><i class="fa fa-plus-circle" node-type="addToClass"></i></a>');
                    arr.push('    <img src="'+Tool.convertIcon(user.head_pic, 60)+'" class="photo">'+name+'');
                    arr.push('   </li>');
                });
            } else {
                arr.push('<li class="sort-item no-member" style="display:block;">');
                arr.push('    <p>未找到对应搜索项成员</p>');
                arr.push('    </li>');
            }

            this.$searchList.html(arr.join(''));
            //搜索列表显示 成员列表隐藏
            this.$searchList.show();
            this.$userList.hide();
            $('[node-type="addToClass"]').off("click").on('click',$.proxy(this._addToClass, this));
            $('[node-type="peopleDetail"]').off("click").on('click',$.proxy(this._peopleDetail, this));
        },
        //取消按钮
        _cancle : function (event) {
            var $target = $(event.target).closest('[node-type="cancle"]'),
                type = $target.parent().attr("data-type");
            //console.log($target);
            this._reset(type, true);
        },
        //确定 服务器请求添加接口
        _create : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="create"]'),
                type = $target.parent().attr("data-type"),
                obj = {},
                msg,errMsg;
            //type分为 createclass addteacher addclass
            //邀请或创建完成 追加dom
            if(type == "createclass") {
                var className = Tool.replaceHtmlTag($.trim(this.$className.val())),
                    classNo = Tool.replaceHtmlTag($.trim(this.$classNo.val())),
                msg = "确定创建班级吗？";
                //班级名称 不超过20个字符
                if(!className || !Tool.testNickName(className) || className.length > 20) {
                    errMsg = "班级名称格式错误";
                    _this._showMessage(this.$className, errMsg);
                    _this._showError(this.$className);

                    return false;
                } else {
                    this._hideError(this.$className);
                }
                //班级编号
                if(!classNo || !this._checkNumber(classNo)) {
                    this._showError(this.$classNo);

                    return false;
                } else {
                    this._hideError(this.$classNo);
                }
                Model.ConfirmBox(msg, function (res) {
                    if(res) {
                        // todo : 添加班级 model
                        obj.name = Tool.replaceHtmlTag(className);
                        obj.classNo = Tool.replaceHtmlTag(classNo);

                        Tool.ajax("/page/web/classfront/createClass",obj, function (res) {
                            // console.log(res);
                            if(!!res && res.code == 0) {
                                //注册成功
                                var classInfo = res.data;
                                _this.classList.push(classInfo);//班级列表添加
                                _this.$classList.append(_this._renderClass(classInfo));
                                //js 2.0 后需要动态绑定事件的方法
                                _this.$classList.off("click").on('click','[node-type="class"]', $.proxy(_this._classDetail, _this));
                                _this.$RightContent.find("input").val('');
                                // alert("创建成功");
                            } else if(res.code == 3001) {
                                errMsg = "班级名称已存在";
                                _this._showMessage(_this.$className, errMsg);
                                _this._showError(_this.$className);
                                // alert("班级名称已存在");
                            } else if(res.code == 3002) {
                                errMsg = "班级编号已存在";
                                _this._showMessage(_this.$classNo, errMsg);
                                _this._showError(_this.$classNo);
                                // alert("班级编号已存在");
                            }
                        }, function (e) {
                            alert("服务器错误");
                        });
                    }
                });

            } else if(type == "addstudent") {
                var studentName = $.trim(this.$studentName.val()),
                    studentPhone = $.trim(this.$studentPhone.val());
                //老师名称
                msg = "确定邀请学生吗？";
                if(!studentName || !Tool.testNickName(studentName) || studentName.length <2 || studentName.length > 6) {
                    errMsg = "学生名称格式错误";
                    _this._showMessage(this.$studentName, errMsg);
                    this._showError(this.$studentName);

                    return false;
                } else {
                    this._hideError(this.$studentName);
                }
                //老师编号
                if(!studentPhone || !Tool.check_mobile(studentPhone) || !!this._checkMyPhone(studentPhone)) {
                    errMsg = "请输入正确手机格式";
                    _this._showMessage(_this.$studentPhone, errMsg);
                    this._showError(this.$studentPhone);

                    return false;
                } else {
                    this._hideError(this.$studentPhone);
                }

                Model.ConfirmBox(msg, function (res) {
                    if(res) {
                        // todo : 添加学生 model
                        obj.type = 1;
                        obj.name = Tool.replaceHtmlTag(studentName);
                        obj.mobile = Tool.replaceHtmlTag(studentPhone);

                        Tool.ajax("/page/web/classfront/inviteUser",obj, function (res) {
                            // console.log(res);
                            if(!!res && res.code == 0) {
                                //注册成功
                                var msg = "邀请成功！";
                                Model.successBox(msg, function (type) {
                                    if(type) {
                                        var info = res.data;
                                        _this.$studentList.append(_this._renderUser(info));
                                        // alert("创建成功");
                                        _this.$RightContent.find("input").val('');
                                    }
                                });

                            } else if(res.code == 2003) {
                                errMsg = "用户已被邀请";
                                _this._showMessage(_this.$studentPhone, errMsg);
                                _this._showError(_this.$studentPhone);
                            } else {
                                console.log("邀请失败");
                            }

                        }, function (e) {
                            console.log(e);
                        });
                    }
                });
            } else {
                var teacherName = $.trim(this.$teacherName.val()),
                    teacherPhone = $.trim(this.$teacherPhone.val());
                msg = "确定邀请老师吗？";
                //老师名称
                if(!teacherName || !Tool.testNickName(teacherName) || teacherName.length <2 || teacherName.length > 6) {
                    errMsg = "老师名称格式错误";
                    _this._showMessage(this.$teacherName, errMsg);
                    this._showError(this.$teacherName);

                    return false;
                } else {
                    this._hideError(this.$teacherName);
                }
                //老师编号
                if(!teacherPhone || !Tool.check_mobile(teacherPhone) || !!this._checkMyPhone(teacherPhone)) {
                    errMsg = "请输入正确手机格式";
                    this._showMessage(this.$teacherPhone, errMsg);
                    this._showError(this.$teacherPhone);

                    return false;
                } else {
                    this._hideError(this.$teacherPhone);
                }
                Model.ConfirmBox(msg, function (res) {
                    if(res) {
                        // todo : 添加老师 model
                        obj.type = 2;
                        obj.name = Tool.replaceHtmlTag(teacherName);
                        obj.mobile = Tool.replaceHtmlTag(teacherPhone);

                        Tool.ajax("/page/web/classfront/inviteUser",obj, function (res) {
                            console.log(res);
                            if(!!res && res.code == 0) {
                                //注册成功
                                var msg = "邀请成功！";
                                Model.successBox(msg, function (type) {
                                    if(type) {
                                        var info = res.data;
                                        _this.$teacherList.append(_this._renderUser(info));
                                        _this.$RightContent.find("input").val('');

                                        $('[node-type="deleteInvite"]').off("click").on('click',$.proxy(_this._deleteInvite, _this));
                                    }
                                });

                            } else if(res.code == 2003) {
                                errMsg = "用户已被邀请";
                                _this._showMessage(_this.$teacherPhone, errMsg);
                                _this._showError(_this.$teacherPhone);
                            } else {
                                console.log("邀请失败");
                            }

                        }, function (e) {
                            console.log(e);
                        });
                    }
                });
            }
        },

        _checkMyPhone : function (phone) {
            return phone == this.userInfo.mobile ? true : false;
        },


        //班级列表展开 收起
        _group : function (event) {
            var $target  = $(event.target).closest(".sort");

            if($(event.target).closest('.sort-item').length > 0) {
                event.stopPropagation();
            } else {
                if($target.parent().hasClass("open")){
                    $target.parent().removeClass("open");
                    if($target.find('.pull-right').length > 0){
                        $target.parent.addClass("open");
                    }
                } else {
                    $target.parent().addClass("open");
                }
            }

        },
        //老师学生成员列表展开 收起
        _memberList : function (event) {
            var $target  = $(event.target).closest(".sort-item");

            if($(event.target).find('.member-match').length > 0 || $(event.target).nextAll('.member-match').length > 0) {
                if($(event.target).closest(".pull-right").length > 0) {
                    event.stopPropagation();
                } else {
                    if($target.hasClass("open")){
                        $target.removeClass("open");
                    } else {
                        $target.addClass("open");
                    }
                }

            } else {
                event.stopPropagation();
            }
        },
        /*
        type 取消事件的模块值
        status 状态  true代表点击取消按钮 false或不传代表点击切换
         */
        _reset : function (type, status) {
            if(status) {
                //找到对应取消的内容父节点 然后input置空
                var parentDom = $('[data-type="'+type+'"]').parents('[node-type="buttonContent"]');
                //排除search输入框 排除班级重命名input框
                this.$input.not('.search-control').not('[node-type="newClassName"]').val("");

                parentDom.find(".form-group").removeClass("has-error");
                parentDom.find(".help-block").hide();
            } else {
                $(".help-block").hide() && $(".form-group").removeClass("has-error");
                //排除search输入框 排除班级重命名input框
                this.$input.not('.search-control').not('[node-type="newClassName"]').val("");

            }

        },
        _renderUserInfo : function (info,classes) {
            var arr = [];
            arr.push('   <div class="panel panel-default">');
            arr.push('        <div class="panel-body scroll">');
            arr.push('            <div class="person-info">');
            arr.push('                <div class="col-lg-12">');
            arr.push('                    <div class="profile-header">');
            arr.push('                       <span class="pull-right" node-type="delPeople" data-userid="'+info.id+'"><button class="btn btn-danger">删除成员</button></span>');
            arr.push('                       <img src="'+Tool.convertIcon(info.headPic, 60)+'">');
            if(info.nickName) {
                arr.push('                            <div class="name"><a><strong>'+info.nickName+'</strong></a></div>');
            } else {
                arr.push('                            <div class="name"><a><strong>'+info.userName+'</strong></a></div>');
            }
            arr.push('                            <div class="professional">'+info.position+'</div>');
            arr.push('                   </div>');
            arr.push('                </div>');
            arr.push('                <div class="col-lg-6 col-md-12">');
            arr.push('                    <h4><strong>工作信息</strong></h4>');
            arr.push('                   <ul class="profile-details">');
            arr.push('                       <li>');
            arr.push('                           <div><i class="fa fa-building-o"></i> 工作单位</div>');
            if(info.company) {
                arr.push('                           '+info.company+'');
            } else {
                arr.push('                           ');
            }
            arr.push('                        </li>');
            if(!!info.researchArea) {
                arr.push('                        <li>');
                arr.push('                            <div><i class="fa fa-flask"></i> 研究领域</div>');
                arr.push('                           '+info.researchArea+' ');
                arr.push('                       </li>');
            } else {
                arr.push('                        <li>');
                arr.push('                            <div><i class="fa fa-flask"></i> 研究领域</div>');
                arr.push(' ');
                arr.push('                       </li>');
            }
            arr.push('                   </ul>');
            arr.push('                </div>');
            arr.push('                <div class="col-lg-6 col-md-12">');
            arr.push('                   <h4><strong>联系方式</strong></h4>');
            arr.push('                   <ul class="profile-details">');
            arr.push('                        <li>');
            arr.push('                           <div><i class="fa fa-phone"></i> 手机号码</div>');
            arr.push('                           '+info.mobile+'');
            arr.push('                       </li>');
            arr.push('                        <li>');
            arr.push('                            <div><i class="fa fa-envelope"></i> 电子邮箱</div>');
            if(info.email) {
                arr.push('                            '+info.email+'');
            }
            arr.push('                       </li>');
            arr.push('                        <li>');
            arr.push('                           <div><i class="fa fa-weixin"></i> 微信账号</div>');
            if(info.wechat) {
                arr.push('                          '+info.wechat+'');
            } else {
                arr.push('                         ');
            }
            arr.push('                       </li>');
            arr.push('                   </ul>');
            arr.push('                </div>');
            arr.push('               <div class="col-lg-6 col-md-12">');
            arr.push('                   <h4><strong>个人信息</strong></h4>');
            arr.push('                    <ul class="profile-details">');
            arr.push('                       <li>');
            arr.push('                           <div><i class="fa fa-birthday-cake"></i> 出生年月</div>');
            if(info.birthday) {
                arr.push('                           '+ moment(info.birthday*1).format('YYYY-MM-DD')+'');
            } else {
                arr.push('                       ');
            }
            arr.push('                       </li>');
            arr.push('                        <li>');
                arr.push('                            <div><i class="fa fa-user"></i> 个人简介</div>');
            if(!!info.description) {
                arr.push('                           '+info.description+'');
            } else {
                arr.push('                         ');
            }
            arr.push('                       </li>');
            arr.push('                    </ul>');
            arr.push('               </div>');
            if(info.type == 2) {
                if(!!classes && classes.length>0) {
                    arr.push('                <div class="col-lg-6 col-md-12">');
                    arr.push('                   <h4><strong>教授班级</strong></h4>');
                    arr.push('                    <ul class="profile-details">');
                    classes.forEach(function (_class) {
                        arr.push('                        <li>'+_class.name+'</li>');
                    });
                    arr.push('                   </ul>');
                    arr.push('               </div>');
                }

            }
            arr.push('            </div>');
            arr.push('        </div>');
            arr.push('    </div>');

            this.$peopleContent.siblings('.col-lg-8').not('[node-type="menu"]').hide();
            this.$peopleContent.html(arr.join("")).show();
            //人员详情的删除按钮点击事件
            //this.$peopleContent.off("click").on('click','[node-type="delPeople"]', $.proxy(this._delPeople, this));

        },
        //人员详情 删除成员按钮
        _delPeople : function () {
            var _this = this,
                userId = $('[node-type="delPeople"]').attr("data-userid"),
                msg = "是否删除此用户？";
            Model.ConfirmBox(msg, function (res) {
                if(res) {
                    //todo :  请求服务器删除用户
                    Tool.ajax("/page/web/classfront/deleteUser",{userId : userId}, function (res) {
                        if(!!res && res.code == 0) {
                            // alert("删除成功");
                            _this.$peopleContent.hide();
                            $('[data-uid="'+userId+'"]').remove();
                            $('[node-type="buttonContent"]').eq(0).show();
                        } else {
                            console.log("邀请失败");
                        }

                    }, function (e) {
                        console.log(e);
                    });
                }
            });

        },
        //增加人员
        _renderUser : function (info){
            var arr = [];

            arr.push('<dd>');
            arr.push('<a><i class="fa fa-times-circle" node-type="deleteInvite" data-uid="'+info.mobile+'"></i></a>');
            arr.push('<em class="text-danger" style="display:block;">尚未注册</em>');
            arr.push('    <img src="/livepage/web/classfront/img/default.png" class="photo">'+info.name+'');
            arr.push('</dd>');

            return arr.join("");
        },
        //增加班级
        _renderClass : function (info) {
            var arr = [];
            arr.push('<li class="sort-item" node-type="class" data-classId="'+info.id+'">');
            arr.push('    <i class="fa fa-list"></i><span>'+info.name+'</span>');
            arr.push('</li>');
            return arr.join("");
        },
        //炫染课程详情 需要传数据
        _renderClassInfo : function (info) {
            var teachers = info.teachers,
                students = info.students,
                classInfo = info.class,
                arr = [];
            arr.push('    <div class="panel panel-default">');
            arr.push('       <div class="panel-heading" data-classId="'+classInfo.id+'">');
            arr.push('           <h2>');
            arr.push('               <span node-type="oldClassName">'+classInfo.name+'</span>');
            arr.push('               <input type="text" class="form-control" node-type="newClassName" value="'+classInfo.name+'" style="display:none;"><!--inline-block/none-->');
            arr.push('                   <a node-type="reName">重命名</a>|<a node-type="delClass">解散班级</a>');
            arr.push('           </h2>');
            arr.push('        </div>');
            arr.push('       <div class="panel-body scroll-header">');
            arr.push('           <div class="class-member">');
            arr.push('               <dl class="class-member-item  clearfix">');
            arr.push('                    <dt><i class="fa fa-list"></i>老师（<span node-type="peopleTotal">'+teachers.length+'</span>）</dt>');
            if(teachers.length > 0) {
                teachers.forEach(function(teacher) {
                    arr.push('                   <dd>');
                    arr.push('                       <span><i class="fa fa-minus-square-o" node-type="delClassPeople" data-userId="'+teacher.id+'"></i></span>');
                    if(!!teacher.nick_name) {
                        arr.push('                       <img src="'+Tool.convertIcon(teacher.head_pic, 60)+'" class="photo">'+teacher.nick_name+'');
                    } else {
                        arr.push('                       <img src="'+Tool.convertIcon(teacher.head_pic, 60)+'" class="photo">'+teacher.username+'');
                    }
                    arr.push('                   </dd>');
                });

            }
            arr.push('               </dl>');
            arr.push('                <dl class="class-member-item clearfix">');
            arr.push('                   <dt><i class="fa fa-list"></i>学生（<span node-type="peopleTotal">'+students.length+'</span>）</dt>');
            if(students.length > 0) {
                students.forEach(function(student) {
                    arr.push('                   <dd>');
                    arr.push('                       <span><i class="fa fa-minus-square-o" node-type="delClassPeople" data-userId="'+student.id+'"></i></span>');
                    if(student.nick_name) {
                        arr.push('                       <img src="'+ Tool.convertIcon(student.head_pic, 60)+'" class="photo">'+student.nick_name+'');
                    } else {
                        arr.push('                       <img src="'+ Tool.convertIcon(student.head_pic, 60)+'" class="photo">'+student.username+'');
                    }
                    arr.push('                   </dd>');
                });
            }
            arr.push('                </dl>');
            arr.push('            </div>');
            arr.push('        </div>');
            arr.push('   </div>');
            arr.join("");

            this.$classContent.siblings('.col-lg-8').not('[node-type="menu"]').hide();
            this.$classContent.html(arr.join("")).show();
            //js 2.0 后需要动态绑定事件的方法 重命名 解散班级
            //this.$classContent.off("click").on('click','[node-type="reName"]', $.proxy(this._reName, this));
            //this.$classContent.off("click").on('click','[node-type="delClass"]', $.proxy(this._delClass, this));
            //this.$classContent.off("click").on('blur','[node-type="newClassName"]', $.proxy(this._handelClassName, this));
            //this.$classContent.on('click','[node-type="newClassName"]', $.proxy(this._handelClassName, this));
            //this.$classContent.off("click").on("click",'[node-type="delClassPeople"]', $.proxy(this._delClassPeople, this) );
        },
        //验证班级编号 6-15位
        _checkNumber : function (_string) {
            var reg = /^[0-9]+.?[0-9]*$/;
            if (!reg.test(_string) ||　_string.length >14) {
                return false;
            }
                return true;
        },
        _showError : function (_target) {
            if(!_target.parents(".form-group").hasClass("has-error")) {
                _target.parents(".form-group").addClass("has-error");
            }
            _target.next().show();

        },
        _hideError : function (_target) {
            if(_target.parents(".form-group").hasClass("has-error")) {
                _target.parents(".form-group").removeClass("has-error");
            }
            _target.next().hide();
        },
        _showMessage : function (_target, msg) {
            _target.next().text(msg);
        }
    }

    $.fn.Mmanage = function (option, str) {
        var $this = $(this);
        var data = $this.data('Mmanage');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('Mmanage', (data = new MMANAGE(this, option)));

            return this;
        });
    }
    $("body").Mmanage();
})();

