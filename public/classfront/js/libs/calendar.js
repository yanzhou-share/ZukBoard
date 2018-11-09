/**
 * 完整代码
 */

// 关于月份： 在设置时要-1，使用时要+1

;(function ($, window, document, undefined) {

    var Calendar = function (elem, options) {
        this.$calendar = elem;
        //用户uid 日期数据 全部的
        this.old_lessons = options.old_lessons;
        this.future_lessons = options.future_lessons;
        this.userInfo = options.userInfo;

        this.defaults = {
            ifSwitch: true,
            hoverDate: false,
            backToday: false
        };

        this.opts = $.extend({}, this.defaults, options);

        // console.log(this.opts);
    };

    Calendar.prototype = {
        //鼠标滑过时显示信息
        showHoverInfo: function (obj) { // hover 时显示当天信息
            var _dateStr = $(obj).attr('data');
            var offset_t = $(obj).offset().top + (this.$calendar_today.height() - $(obj).height()) / 2;
            var offset_l = $(obj).offset().left + $(obj).width();
            var changeStr = addMark(_dateStr);
            var _week = changingStr(changeStr).getDay();
            var _weekStr = '';

            this.$calendar_today.show();

            this.$calendar_today
                .css({left: offset_l + 30, top: offset_t})
                .stop()
                .animate({left: offset_l + 16, top: offset_t});

            switch (_week) {
                case 0:
                    _weekStr = 'Sunday';
                    break;
                case 1:
                    _weekStr = 'Monday';
                    break;
                case 2:
                    _weekStr = 'Tuesday';
                    break;
                case 3:
                    _weekStr = 'Wednesday';
                    break;
                case 4:
                    _weekStr = 'Thursday';
                    break;
                case 5:
                    _weekStr = 'Friday';
                    break;
                case 6:
                    _weekStr = 'Saturday';
                    break;
            }

            this.$calendarToday_date.text(changeStr);
            this.$calendarToday_week.text(_weekStr);
        },

        showCalendar: function () { // 输入数据并显示
            var self = this;
            var year = dateObj.getDate().getFullYear();
            var month = dateObj.getDate().getMonth() + 1;
            var dateStr = returnDateStr(dateObj.getDate());
            var firstDay = new Date(year, month - 1, 1); // 当前月的第一天

            this.$calendarTitle_text.text(year + '/' + dateStr.substr(4, 2));
            //炫染日期样式
            $("#date").text(addMark(dateStr));
            this.$backToday.attr("data", dateStr);

            this.$calendarDate_item.each(function (i) {
                // allDay: 得到当前列表显示的所有天数
                var allDay = new Date(year, month - 1, i + 1 - firstDay.getDay());
                var allDay_str = returnDateStr(allDay);

                $(this).text(allDay.getDate()).attr('data', allDay_str);
                //原来逻辑
                if (returnDateStr(new Date()) === allDay_str) {
                    $(this).attr('class', 'item item-curDay');
                } else if (returnDateStr(firstDay).substr(0, 6) === allDay_str.substr(0, 6)) {
                    $(this).attr('class', 'item item-curMonth');
                } else {
                    $(this).attr('class', 'item');
                }
                //自己逻辑
                if (returnDateStr(new Date()) === allDay_str) {
                   //判断今天是否有课
                   $(this).attr('class', 'item item-curDay ');
                } else if (returnDateStr(firstDay).substr(0, 6) === allDay_str.substr(0, 6)) {
                   if (!!self.future_lessons && self.future_lessons.length > 0) {
                       //判断某天是否有课
                       if ($.inArray(addMark(allDay_str), self.future_lessons) != -1) {
                           $(this).attr('class', 'item item-curMonth item-nocheck');
                       } else {
                           $(this).attr('class', 'item item-curMonth');
                       }
                   }else if(!!self.old_lessons && self.old_lessons.length > 0) {
                       if ($.inArray(addMark(allDay_str), self.old_lessons) != -1) {
                           $(this).attr('class', 'item item-curMonth item-check');
                       } else {
                           $(this).attr('class', 'item item-curMonth');
                       }
                   } else {
                       $(this).attr('class', 'item item-curMonth');
                   }
                } else {
                   $(this).attr('class', 'item');
                }
             });

            // 已选择的情况下，切换日期也不会改变
            if (self.selected_data) {
                var selected_elem = self.$calendar_date.find('[data=' + self.selected_data + ']');

                selected_elem.addClass('item-selected');
            }
        },
        //一开始炫染页面
        renderDOM: function () { // 渲染DOM
            this.$calendar_title = $('<div class="calendar-title"></div>');
            this.$calendar_week = $('<ul class="calendar-week"></ul>');
            this.$calendar_date = $('<ul class="calendar-date"></ul>');
            this.$calendar_today = $('<div class="calendar-today"></div>');


            var _titleStr = '<a href="javascript:;" class="title"></a>' +
                '<a href="javascript:;" id="backToday">T</a>' +
                '<div class="arrow">' +
                '<span class="arrow-prev"><</span>' +
                '<span class="arrow-next">></span>' +
                '</div>';
            var _weekStr = '<li class="item">日</li>' +
                '<li class="item">一</li>' +
                '<li class="item">二</li>' +
                '<li class="item">三</li>' +
                '<li class="item">四</li>' +
                '<li class="item">五</li>' +
                '<li class="item">六</li>';
            var _dateStr = '';
            var _dayStr = '<i class="triangle"></i>' +
                '<p class="date"></p>' +
                '<p class="week"></p>';

            for (var i = 0; i < 6; i++) {
                _dateStr += '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>';
            }

            this.$calendar_title.html(_titleStr);
            this.$calendar_week.html(_weekStr);
            this.$calendar_date.html(_dateStr);
            this.$calendar_today.html(_dayStr);

            this.$calendar.append(this.$calendar_title, this.$calendar_week, this.$calendar_date, this.$calendar_today);
            this.$calendar.show();
        },

        inital: function () { // 初始化
            var self = this;

            this.renderDOM();

            this.$calendarTitle_text = this.$calendar_title.find('.title');
            this.$backToday = $('#backToday');
            this.$arrow_prev = this.$calendar_title.find('.arrow-prev');
            this.$arrow_next = this.$calendar_title.find('.arrow-next');
            this.$calendarDate_item = this.$calendar_date.find('.item');
            this.$calendarToday_date = this.$calendar_today.find('.date');
            this.$calendarToday_week = this.$calendar_today.find('.week');

            this.selected_data = 0;

            this.showCalendar();

            if (this.opts.ifSwitch) {
                //上一月点击事件
                this.$arrow_prev.bind('click', function () {
                    var _date = dateObj.getDate();

                    dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() - 1, 1));

                    self.showCalendar();
                });
                //下一月点击事件
                this.$arrow_next.bind('click', function () {
                    var _date = dateObj.getDate();

                    dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() + 1, 1));

                    self.showCalendar();
                });
            }
            //回到今天
            if (this.opts.backToday) {
                var cur_month = dateObj.getDate().getMonth() + 1;
                //回到今天点击事件
                this.$backToday.bind('click', function () {
                    var item_month = $('.item-curMonth').eq(0).attr('data').substr(4, 2);
                    var if_lastDay = (item_month != cur_month) ? true : false;

                        dateObj.setDate(new Date());

                        self.showCalendar();
                        //回到今天ajax
                        Tool.ajax("/page/web/classfront/todayLessons",{}, function (res) {
                            if(!!res && res.code == 0) {
                                var data = res.data.today_lessons;
                                renderInfo(data);
                            } else {
                                console.log("添加失败");
                            }

                        }, function (e) {
                            console.log(e);
                        });
                });
            }
            //选择其他日期颜色
            //this.$calendarDate_item.hover(function () {
            //  self.showHoverInfo($(this));
            //}, function () {
            //  self.$calendar_today.css({left: 0, top: 0}).hide();
            //});
            //日期点击事件
            this.$calendarDate_item.click(function () {
                var _dateStr = $(this).attr('data');
                var click_dateStr = Date.parse(new Date(addMark(_dateStr)));//当前点击的日期加“-” 后天请求ajax
                var _date = changingStr(addMark(_dateStr));
                var $curClick = null;

                self.selected_data = $(this).attr('data');

                dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth(), 1));

                if (!$(this).hasClass('item-curMonth')) {
                    self.showCalendar();
                }

                $curClick = self.$calendar_date.find('[data=' + _dateStr + ']');
                $curDay = self.$calendar_date.find('.item-curDay');
                if (!$curClick.hasClass('item-selected')) {
                    self.$calendarDate_item.removeClass('item-selected');

                    $curClick.addClass('item-selected');
                }
                //选择日期炫染列表 最大时间戳 最小时间戳
                // 炫染列表上面日期
                $("#date").text(moment(click_dateStr*1).format('YYYY-MM-DD'));
                var day = new Date(click_dateStr);
                day.setHours(0);
                day.setMinutes(0);
                day.setSeconds(0);
                day.setMilliseconds(0);
                var startTime = Date.parse(day);
                var endTime = startTime + +24*60*60*1000-1;
                //todo : 根据日期查询课程列表
                Tool.ajax("/page/web/classfront/searchLesson",{startTime : startTime, endTime : endTime }, function (res) {
                    if(!!res && res.code == 0) {
                        var data = res.data.lessons;
                        renderInfo(data);
                    } else {
                        console.log("添加失败");
                    }

                }, function (e) {
                    console.log(e);
                });
            });
        },

        constructor: Calendar
    };

    $.fn.calendar = function (options) {
        var calendar = new Calendar(this, options);

        return calendar.inital();
    };


    // ========== 使用到的方法 ==========

    var dateObj = (function () {
        var _date = new Date();

        return {
            getDate: function () {
                return _date;
            },

            setDate: function (date) {
                _date = date;
            }
        }
    })();

    function returnDateStr(date) { // 日期转字符串
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        month = month <= 9 ? ('0' + month) : ('' + month);
        day = day <= 9 ? ('0' + day) : ('' + day);

        return year + month + day;
    };

    function changingStr(fDate) { // 字符串转日期
        var fullDate = fDate.split("-");

        return new Date(fullDate[0], fullDate[1] - 1, fullDate[2]);
    };

    function addMark(dateStr) { // 给传进来的日期字符串加-
        return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substring(6);
    };
    //炫染课程列表
    function renderInfo (data) {
            var slef = this;
                arr = [];
        arr.push('<ul class="classInfo-list" node-type="classInfo_list" style=" display:block">');
        if(data.length > 0) {
            data.forEach(function (list) {
                var startTime = moment(list.lessons_time*1).format('HH:mm'),
                    classTitle = list.title ,
                    classDesc = list.content,
                    classTeacher = (list.nick_name) ? list.nick_name : list.username,
                    timestamp = Date.parse(new Date());
                arr.push('<li class="classInfo-list-item">');
                arr.push('<div class="classInfo-option">');
                if(list.status == 1) {
                    arr.push('<button class="btn btn-danger" data-roomid="'+list.room_id+'">进入教室</button>');
                }
                if(CONFIG.userInfo.type == 2 && list.user_id == CONFIG.userInfo.id) {
                    arr.push('<div class="btn-group">');
                    arr.push('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>');
                    arr.push('<ul class="dropdown-menu" role="menu" data-id="'+list.id+'">');
                    arr.push('<li action-type="edit_classinfo"><a>编辑</a></li>');
                    arr.push('<li action-type="del_classinfo"><a>删除</a></li>');
                    arr.push('</ul></div>');
                }
                arr.push('</div>');
                arr.push('<div class="classInfo-text"><span>上课时间：</span><p action-type="time">'+startTime+'</p></div>');
                arr.push('<div class="classInfo-text"><span>课程标题：</span><p action-type="title">'+classTitle+'</p></div>');
                arr.push('<div class="classInfo-text"><span>课程详情：</span><p action-type="detail">'+classDesc+'</p></div>');
                arr.push('<div class="classInfo-text"><span>老师姓名：</span><p>'+classTeacher+'</p></div>');
                if(list.description) {
                    arr.push('<div class="classInfo-text"><span>老师简介：</span><p>'+list.description+'</p></div>');
                }
                arr.push('</li>');
            });
        } else {
                if(CONFIG.userInfo.type == 2) {
                    arr.push('<div class="no-classInfo" style="display:block"><p>暂无课程，请添加课程信息</p></div>');
                } else {
                    arr.push('<div class="no-classInfo" style="display:block"><p>今日暂无课程</p></div>');
                }
        }
        arr.push('</ul>');

        $('#lessons_body').html(arr.join(""));
    }

    // 条件1：年份必须要能被4整除
    // 条件2：年份不能是整百数
    // 条件3：年份是400的倍数
    function isLeapYear(year) { // 判断闰年
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    }

})(jQuery, window, document);