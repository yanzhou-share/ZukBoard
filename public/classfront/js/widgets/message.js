/**
 * Created by ncy on 2018/1/30 0030.
 */

var MESSAGE = (function () {
    var MESSAGE = function (element, options) {
        this.$el = $(element);
        this.minPage = 1;
        this.nowPage = 1;
        //动态获取总页码
        this.maxPage = (maxPage != 0) ? maxPage : 1;
        this._init();
    }

    MESSAGE.prototype = {
        _init: function () {
            //翻页dom
            this.$lastPage = this.$el.find('[node-type="lastPage"]');//上一页
            this.$nextPage = this.$el.find('[node-type="nextPage"]');//下一页
            this.$nowPage = this.$el.find('[node-type="nowPage"]');//当前页
            this.$maxPage = this.$el.find('[node-type="maxPage"]');//最大页
            this.$msgDetail = this.$el.find('[node-type="msgDetail"]');
            this.$noteList = this.$el.find('.note-list');
            this.$lessonItem = this.$el.find('[data-roomid]');
            this._addEvents();
        },
        _addEvents: function () {
            var _this = this;
            //翻页
            this.$lastPage.on("click", $.proxy(this._lastPage, this));
            this.$nextPage.on("click", $.proxy(this._nextPage, this));
            $("body").delegate('[node-type="msgDetail"]', 'click', function () {
                _this._msgDetail();
            })
            // this.$msgDetail.on("click", $.proxy(this._msgDetail, this));
            this.$lessonItem.on("click", function () {
                var roomid = $(this).attr("data-roomid");
                window.location.href = "/page/web/classin/" + roomid + ".html";
            });
        },
        //上一页
        _lastPage :　function () {
            var _this = this,
                pageNo;
            //判断当前页是否为1 为1 返回 不为1 当前页码-1
            if(this.nowPage != 1) {
                if (this.$nextPage.prop("disabled")) {
                    this.$nextPage.removeAttr("disabled");
                }
                //获取数据，并获取总条数 从而得知总页数
                //todo ：获取翻页接口
                pageNo = this.nowPage - 1;
                this.nowPage = pageNo;
                //设置html当前页码
                this.$nowPage.text(this.nowPage);
                this.getListByPage();
                if (this.nowPage == 1) {
                    this.$lastPage.attr("disabled","disabled");
                }
            }
        },
        //下一页
        _nextPage : function () {
            var _this = this,
                pageNo;
            //判断当前页是否为最后一页， 为最后一页返回，不为最后一页,当前页码+1
            if(this.nowPage != this.maxPage) {
                if (this.$lastPage.prop("disabled")) {
                    this.$lastPage.removeAttr("disabled");
                }
                //获取数据，并获取总条数 从而得知总页数
                //todo ：消息中心数据翻页获取 点击可查看详情
                pageNo = this.nowPage + 1;
                this.nowPage = pageNo;
                //设置html当前页码
                this.$nowPage.text(this.nowPage);
                this.getListByPage();
                //如果翻页到最后一页 按钮不可点击
                if (this.nowPage == this.maxPage) {
                    this.$nextPage.attr("disabled","disabled");
                }
            }
        },
        //消息详情
        _msgDetail : function () {
            var $target = $(event.target).closest('[node-type="msgDetail"]'),
                desDom = $target.find(".description"),
                notice_id = $target.attr("data-id");

            var shortDesc = $target.find('[node-type="shortDesc"]');
            var allDesc = $target.find('[node-type="allDesc"]');

            if(desDom.hasClass("open")) {
                desDom.removeClass("open");
                allDesc.hide();
                shortDesc.show();
            } else {
                desDom.addClass("open");
                allDesc.show();
                shortDesc.hide();
            }
            if($target.hasClass("unread")) {
                //todo : 更改消息读取状态
                Tool.ajax('/page/web/classfront/createUserNotice', {noticeId : notice_id}, function (data) {
                    if(data.code == "0"){
                        $target.removeClass("unread");
                    }
                })
            }
        },
        getListByPage : function () {
            var _this = this;
            Tool.ajax("/page/web/classfront/classNoticeList", {pageNumber:this.nowPage}, function (data) {
                if(data.code == "0"){
                    var list = data.data.list;
                    _this.renderListInfo(list);
                }
            })
        },
        //炫染消息列表
        renderListInfo : function (list) {
            var arr = [];
            for (var i = 0, l = list.length; i < l; i++){
                var cls, content = list[i].content;
                cls = !!list[i].status ? '' : 'unread';

                if(typeof list[i].status == 'undefined'){
                    cls = "unread";
                }
                content = content.length > 50 ? content.substring(0, 50) + "..." : content;

                arr.push('<li class="' + cls + '" node-type="msgDetail" data-id="'+list[i].id+'">');
                arr.push('<a href="javascript:;">');
                arr.push('<div class="header">');
                arr.push('<span class="title">'+list[i].title+'</span>');
                arr.push('<span class="tag">New</span>');
                arr.push('<span class="date"><span class="fa fa-paper-clip"></span>'+ moment(list[i].create_time).format("MM/DD HH:mm") +'</span>');
                arr.push('</div>');
                arr.push('<div class="description">');
                arr.push('<p node-type="shortDesc">'+content+'</p>');
                arr.push('<p style="display: none" node-type="allDesc">'+list[i].content+'</p>');
                arr.push('</div>');
                arr.push('</a>');
                arr.push('</li>');
            }
            this.$noteList.html(arr.join(''));
        }
    }

    $.fn.message = function (option, str) {
            var $this = $(this);
        var data = $this.data('message');
        return typeof option == 'string' ? data[option](str) : this.each(function () {

            if (!data) $this.data('message', (data = new MESSAGE(this, option)));

            return this;
        });
    }
    $("body").message();
})();
