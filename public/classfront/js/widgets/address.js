/**
 * Created by ncy on 2018/1/30 0030.
 */

var ADDRESS = (function () {
    var ADDRESS = function (element, options) {
        this.$el = $(element);
        this._init();
    }

    ADDRESS.prototype = {
        _init: function () {
            this.$listBtn = this.$el.find('[node-type="list"]');//班级按钮
            this.$cancle = this.$el.find("#cancel");//搜索取消按钮
            this.$search = this.$el.find('[node-type="search"]');//搜索按钮
            this.$searchInput = this.$el.find(".search-control");//搜索input框
            this.$Info= this.$el.find('[node-type="info"]');//用户点击按钮
            this.$userInfo = this.$el.find('[node-type="userInfo"]');//用户信息dom
            this.$searchList = this.$el.find('[node-type="searchList"]');//搜索用户列表dom
            this.$userList = this.$el.find('[node-type="userList"]');//用户列表

            this._addEvents();
        },
        _addEvents: function () {
            var _this = this;
            this.$listBtn.on("click", $.proxy(this._list, this));
            this.$cancle.on("click", $.proxy(this._cancle, this));
            this.$search.on("click", $.proxy(this._search, this));
            this.$searchInput.on("input", $.proxy(this._input, this));
            this.$Info.on("click", $.proxy(this._info, this));
        },
        //input框监测数据输入
        _input : function () {
            var val = this.$searchInput.val(),
                Dom = this.$searchInput;
            if(!!val){
                if(Dom.next().is(':hidden')) Dom.next().show();
            } else {
                if(!Dom.next().is(':hidden')) Dom.next().hide();
            }
        },
        //显示下拉列表
        _list : function (event) {
            var $target = $(event.target).closest('[node-type="list"]');
            if($(event.target).closest('.address-match-box').length > 0) {
                event.stopPropagation();
            } else {
                if($target.hasClass("open")){
                    $target.removeClass("open");
                } else {
                    $target.addClass("open");
                }
            }
        },
        //搜索数据详情
        _search : function () {
            //请求接口模糊搜索
            var _this = this;
                searchVal = $.trim(this.$searchInput.val());
            if(!searchVal) {
                return false;
            }
            // this.StringHighlight();
            Tool.ajax("/page/web/classfront/searchContactUser",{name : searchVal}, function (res) {
                if(!!res && res.code == 0) {
                    var info = res.data.result;
                    _this._renderSearchInfo(info, searchVal);
                    // _this._renderUserInfo(info);
                } else {
                    console.log(res);
                }
            }, function (e) {
                console.log(e);
            });
            //todo 模糊查询

        },
        //获取用户信息
        _info : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="info"]'),
                userId =  $target.attr("data-uid");

            if(!$target.hasClass("active")) {
                this.$Info.removeClass("active");
                $target.addClass("active");
            }
            //todo 服务器查询
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
        //炫染模糊搜索列表
        _renderSearchInfo : function (info, seachVal) {
            var arr = [];
            arr.push('<ul class="address-list">');
            if(info.length > 0) {
                info.forEach(function (user) {
                    //有搜索列表显示
                    arr.push('       <li node-type="info" data-uid="'+user.id+'">');
                    arr.push('      <div class="member"><img src="'+ Tool.convertIcon(user.head_pic, 60)+'" class="photo">'+Tool.StringHighlight(seachVal,user.nick_name)+'</div>');
                    arr.push('  </li>');
                });
            } else {
                //无搜索列表显示
                arr.push(' <li class="sort-item no-member" style="display:block;">');
                arr.push('    <p>未找到对应搜索项成员</p>');
                arr.push('   </li>');
            }
            arr.push('   </ul>');
            this.$searchList.html(arr.join(''));
            this.$userList.hide();
            this.$searchList.show();
            this.$el.off("click").on('click','[node-type="info"]', $.proxy(this._info, this));
        },
        //炫染用户信息
        _renderUserInfo : function (info) {
            var arr = [];
            arr.push('        <div class="person-info">');
            arr.push('           <div class="col-lg-12">');
            arr.push('                <div class="profile-header">');
            if(info.headPic) {
                arr.push('                    <img src="'+ Tool.convertIcon(info.headPic, 60)+'">');
            } else {
                arr.push('                    <img src="/livepage/web/classfront/img/default.png">');
            }
            if(info.nickName) {
                arr.push('                        <div class="name"><a><strong>'+info.nickName+'</strong></a></div>');
            } else {
                arr.push('                        <div class="name"><a><strong>'+info.userName+'</strong></a></div>');
            }
            if(info.position) {
                arr.push('                        <div class="professional">'+info.position+'</div>');
            }
            arr.push('                </div>');
            arr.push('            </div>');
            arr.push('            <div class="col-lg-6 col-md-12">');
            arr.push('               <h4><strong>工作信息</strong></h4>');
            arr.push('                <ul class="profile-details">');
            arr.push('                   <li>');
            arr.push('                       <div><i class="fa fa-building-o"></i> 工作单位</div>');
            if(info.company) {
                arr.push('                       '+info.company+'');
            }
            arr.push('                    </li>');
            arr.push('                   <li>');
            arr.push('                       <div><i class="fa fa-flask"></i> 研究领域</div>');
            if(info.researchArea) {
                arr.push('                       '+info.researchArea+'');
            }
            arr.push('                   </li>');
            arr.push('               </ul>');
            arr.push('           </div>');
            arr.push('           <div class="col-lg-6 col-md-12">');
            arr.push('               <h4><strong>联系方式</strong></h4>');
            arr.push('               <ul class="profile-details">');
            arr.push('                   <li>');
            arr.push('                       <div><i class="fa fa-phone"></i> 手机号码</div>');
            if(info.mobile) {
                arr.push(info.mobile);
            }
            arr.push('                    </li>');
            arr.push('                    <li>');
            arr.push('                        <div><i class="fa fa-envelope"></i> 电子邮箱</div>');
            if(info.email) {
                arr.push(info.email);
            }
            arr.push('                   </li>');
            arr.push('                    <li>');
            arr.push('                       <div><i class="fa fa-weixin"></i> 微信账号</div>');
            if(info.wechat) {
                arr.push(info.wechat);
            }
            arr.push('                   </li>');
            arr.push('               </ul>');
            arr.push('           </div>');
            arr.push('           <div class="col-lg-6 col-md-12">');
            arr.push('               <h4><strong>个人信息</strong></h4>');
            arr.push('               <ul class="profile-details">');
            arr.push('                   <li>');
            arr.push('                       <div><i class="fa fa-birthday-cake"></i> 出生年月</div>');
            if(info.birthday) {
                arr.push('                        '+moment(info.birthday*1).format('YYYY-MM-DD')+'');
            }
            arr.push('                   </li>');
            arr.push('                   <li>');
            arr.push('                       <div><i class="fa fa-user"></i> 个人简介</div>');
            if(info.description) {
                arr.push('                       '+info.description+'');
            }
            arr.push('                   </li>');
            arr.push('               </ul>');
            arr.push('            </div>');

            this.$userInfo.html(arr.join(""));
        },
        //取消input框输入
        _cancle : function () {
            this.$cancle.prev().val("");
            this.$cancle.hide();

            this.$userList.show();
            this.$searchList.hide();
        },



    }

    $.fn.Address = function (option, str) {
        var $this = $(this);
        var data = $this.data('Address');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('Address', (data = new ADDRESS(this, option)));

            return this;
        });
    }
    $("body").Address();
})();
