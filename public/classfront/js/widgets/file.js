/**
 * Created by ncy on 2018/1/31 0031.
 */
var FILELIST = (function () {
    var FILELIST = function (element, options) {
        this.$el = $(element);
        this.options = options;
        this.switch = false;
        this.nowPage = 1;
        this.pageSize = 18;
        //动态获取总页码
        this.maxPage = 1;
        this._init();
        this._addEvents();
        this._initUploadImg();
    }

    FILELIST.prototype = {
        _init: function () {
            this.$searchInput = this.$el.find(".search-control");//搜索input框
            this.$checkBox = this.$el.find('.folder-option');//选中文件按钮
            this.$delFile = this.$el.find('[node-type="deleteFile"]');//删除按钮
            this.$cancel = this.$el.find('.search-cancle');//取消input框
            this.$newFolder = this.$el.find('[node-type="newFolder"]');//新建文件夹按钮
            this.$back = this.$el.find('[node-type="back"]');//返回夹按钮
            this.$reName = this.$el.find('[node-type="reName"]');//文件夹重命名按钮
            this.$download = this.$el.find('[node-type="download"]');//下载按钮
            this.$searchBtn = this.$el.find('[node-type="searchBtn"]');//搜索按钮
            this.$filelist = this.$el.find('.folder-list');
            this.$loadInfo = this.$el.find('[node-type="loadInfo"]');
            this.$uploadImg = this.$el.find('[node-type="uploadImg"]');//上传按钮父级dom
            this.$nofolder  =this.$el.find('.no-folder');//无文件的父级dom
            this.$nofile = this.$el.find('[node-type="nofile"]');//无文件dom
            this.$nosearch = this.$el.find('[node-type="nosearch"]');//无文件dom
            this.uploadBtn  = this.$el.find('#uploadIcon');//上传按钮
            this.$pageBtn = this.$el.find('#pageBtn');

            this.$all = this.$el.find('#all');//文件首页dom
            this.$detail = this.$el.find('#detail');//文件详情dom

            //翻页dom
            this.$lastPage = this.$el.find('[node-type="lastPage"]');//上一页
            this.$nextPage = this.$el.find('[node-type="nextPage"]');//下一页
            this.$nowPage = this.$el.find('[node-type="nowPage"]');//当前页
            this.$maxPage = this.$el.find('[node-type="maxPage"]');//最大页

            this.$folderLayer = $("#folder_tip");
            this.$masker = $("#masker");
            this.$confirmBtn = $("#folder_tip").find('[action-type="confirm"]');
            this.$cancleBtn = $("#folder_tip").find('[action-type="cancle"]');
            this.$folderInput = $("#folder_tip").find('#folderName');
            this.$errorDom = this.$folderLayer.find(".form-group");
            this.$errorMsg = this.$folderLayer.find('.help-block');
        },
        _addEvents: function () {
            var _this = this;

            this.$confirmBtn.on("click", $.proxy(this._confirm, this));

            this.$cancleBtn.on("click", $.proxy(this._hide, this));
            //联系人列表
            this.$checkBox.die().live("click", $.proxy(this._check, this));

            this.$delFile.off("click").on("click", $.proxy(this._delFile, this));

            this.$cancel.on("click", $.proxy(this._cancel, this));

            this.$searchBtn.off("click").on("click", $.proxy(this._search, this));

             this.$searchInput.off("input").on("input", $.proxy(this._input, this));

            this.$newFolder.off("click").on("click", $.proxy(this._newFolder, this));
            //翻页
            this.$lastPage.off("click").on("click", $.proxy(this._lastPage, this));
            this.$nextPage.off("click").on("click", $.proxy(this._nextPage, this));
            //
            this.$download.off("click").on("click", $.proxy(this._downLoad, this));
            //详情
            this.$loadInfo.die().live("click", $.proxy(this._loadInfo, this));
            this.$reName.die().live("click", $.proxy(this._reName, this));
            //返回上一页
            this.$back.off("click").on("click", $.proxy(this._back, this));
            //回车事件
            $('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    _this.$confirmBtn.trigger("click");
                }
            });
        },
        //上传组件实例化
        _initUploadImg: function () {
            var _this = this,
                opt = {
                    html: '',
                    istarget: true,
                    multi_selection : false,
                    max_file_size: '30mb',
                    state: 'files',
                    maxLength : '12',
                    'btnup': 'uploadIcon',
                };
            //上传组件
            _this.$uploadImg.mediumupload(opt);
        },
        //input框监听
        _input : function () {
            var val = this.$searchInput.val(),
                Dom = this.$searchInput;
            if(!!val){
                if(Dom.next().is(':hidden')) Dom.next().show();
            } else {
                if(!Dom.next().is(':hidden')) Dom.next().hide();
            }
        },
        //重置
        reset: function (options) {
            this.options = options;
            this._init();//初始化
        },
        //选择文件
        _check : function (event) {
            var _this = this;
                $target = $(event.target).closest('.folder-option'),
                checkDom = $target.parent('li').not('[data-fid="1"]');

            (checkDom.hasClass('active')) ? checkDom.removeClass('active') : checkDom.addClass('active');
            //下载按钮 只有文件有
            //重命名按钮 有且仅有一个文件夹时有
            var folderDom = this.$filelist.find('[class="active"][data-type="folder"]'),
                fileDom = this.$filelist.find('[class="active"][data-type="file"]');
            if(folderDom.length > 0 || fileDom.length > 0){
                this.$delFile.show();
            }

            if(folderDom.length == 0 && fileDom.length == 0){
                this.$delFile.hide();
            }

            if (folderDom.length > 0) {
                //this.$download.hide();
                if(folderDom.length == 1 && fileDom.length == 0) {
                    this.$reName.show();
                } else {
                    this.$reName.hide();
                }
            } else {
                this.$download.show();
                this.$reName.hide();
            }
            if(fileDom.length > 0 && folderDom.length == 0) {
                this.$download.show();
            } else {
                this.$download.hide();
            }
        },
        //搜索文件
        _search : function () {
            var searchVal = $.trim(this.$searchInput.val()), _this = this,data = {};
            if(!searchVal) {
                return false;
            }

            Tool.ajax("/page/web/classfront/searchFile", {name: searchVal}, function (data) {
                // console.log(data);
                if(data.code == "0"){
                    //返回按钮
                    window.location.hash = "#folder";
                    _this.$back.show();
                    var files = data.data.files,
                        type = "search";
                    // console.log(files);
                    _this._renderFile(files, type);
                }
            })
            //todo 服务器请求搜索
        },
        //新建文件夹
        _newFolder : function () {
            var msg = "新建文件夹";

            this.activeId = null;
            //显示文件夹层
            this._show(msg);
        },
        _delFile : function () {
            var _this = this,
                msg = "确定删除吗？",
                opt = {},
                str = '',
                fids = [];

            //服务器循环删除文件文件夹接口
            //循环文件
            this.$el.find('[data-fid]').each(function(event){
               if($(this).hasClass('active')){
                   var type = $(this).attr('data-type'),
                       id = $(this).attr('data-fid'),
                       obj = {};
                   //文件id 例如："1 fodler,2 file"的形式
                   if(type == "file") {
                        obj.type = "file";
                   } else {
                       obj.type = "folder";
                   }
                   //删除时移除dom节点需要
                   obj.id = id;
                   fids.push(obj);
                   //接口数据准备
                   str += id+' '+type+",";

                   fids.push($(this).attr('data-fid'));
               }
            });
            Model.ConfirmBox(msg, function(res) {
                Tool.ajax("/page/web/classfront/deleteFiles", {fileIds: str}, function (res) {
                    if(!!res && res.code == 0) {
                        // console.log(res);
                        fids.forEach(function (info) {
                            $('[data-type="'+info.type+'"]').closest('[data-fid="'+info.id+'"]').remove();
                        });
                        //隐藏下载 删除 重命名按钮
                        _this.$delFile.hide();
                        _this.$download.hide();
                        _this.$reName.hide();
                    } else {
                        console.log("删除失败————" +res);
                    }
                })
            });
        },
        //文件文件夹详情
        _loadInfo : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="loadInfo"]'),
                fileType = $target.attr('data-type'),
                resId;
            //if里为不触发事件的dom排除

            if($(event.target).closest('.folder-option').length > 0 ) {

                event.stopPropagation();
            }else{
                this.fid = $target.attr("data-fid");
                this.uploadBtn.attr("data-fid",this.fid);
                //todo 如果为文件夹 则获取文件详情 如果为文件 则打开
                if(fileType == "folder") {
                    window.location.hash = "#folder";
                    var data = {};
                    if(this.fid) {
                        data.folderId = this.fid;
                    }
                    //炫染文件列表
                    this.changPage(this.nowPage);
                } else {
                    var rid = $target.attr('data-rid'),
                        fileType = $target.attr('file-type'),
                        pathUrl = CONFIG.upyun.rc_upyun_http + rid;
                    //ppt预览地址
                    if(fileType != 1 && fileType != 4) {
                        pathUrl = BASE64.encode(pathUrl)+".html";
                    } else if(fileType == 4){
                        pathUrl = CONFIG.qiniu_rc_url + rid;
                        window.open(pathUrl);
                    } else {
                        window.open(pathUrl);
                    }
                }
            }
        },
        //炫染文件
        _renderFile : function (info, type) {
            //循环炫染文件信息 根据文件类型不同
            if(info.length == 0) {
                //列表层隐藏,提示层显示
                this.$filelist.hide();
                this.$detail.hide();
                this.$nofolder.show();
                if(type == "search") {
                    this.$nofile.hide();
                    this.$nosearch.show();
                } else {
                    this.$nosearch.hide();
                    this.$nofile.show();
                }
            } else {
                this.$nofolder.hide();
                this.$filelist.show();
                this.$detail.show();
                var arr = [];
                info.forEach(function(file) {
                    arr.push('<li data-type="file" title="'+file.name+'" node-type="loadInfo" data-rid="'+file.path_url+'" data-fid="'+file.id+'" file-type="'+file.type+'"> <!--data-type="folder"  file-->');
                    arr.push('    <span class="folder-option"><i class="fa fa-check-circle"></i></span>');
                    arr.push('    <div class="folder-photo">');
                    if(file.type == 1) {
                        arr.push('        <span class="photo"><i class="icon jpg"></i></span>');
                    } else if(file.type == 2) {
                        arr.push('        <span class="photo"><i class="icon ppt"></i></span>');
                    }else if(file.type == 4){
                        arr.push('        <span class="photo"><i class="icon video"></i></span>');
                    }
                    arr.push('    </div>');
                    arr.push('    <div class="folder-name">'+file.name+'</div>');
                    arr.push('</a>');
                });
                this.$detail.html(arr.join(""));
            }
            this._renderHide();
            //return arr;
        },
        //文件夹重命名
        _reName : function () {
            var activeId = this.$el.find('[data-type="folder"].active').attr("data-fid");
            var folderName = this.$el.find('[data-type="folder"].active').attr("data-name");
            var msg = "重命名文件夹";

            this._show(msg);

            this.activeId = activeId;
            $("#folderName").val(folderName);
        },
        _back : function () {
            if(window.location.hash == "#folder"){
                //to do 123页
                //上传按钮的属性设置设置为初始状态
                if(this.uploadBtn.attr("data-fid") != 0) {
                    this.uploadBtn.attr("data-fid",0);
                }
                $(".folder-option").parent("li").removeClass("active");
                this.$nofolder.hide();
                this.$detail.hide();
                this.$all.show();
                this.$newFolder.show();
                this.$download.hide();
                this.$delFile.hide();   
                this.$back.hide();
                this.$pageBtn.hide();
                window.location.hash = "";
            }
        },
        _renderHide : function () {
            this.$all.hide();
            this.$back.show();
            this.$download.hide();
            this.$newFolder.hide();
            this.$delFile.hide();
            this.$reName.hide();
        },
        _downLoad : function () {
           var _this = this,
               rids = [];
           this.$el.find('[data-type="file"]').each(function(event){

               if($(this).hasClass('active')){

                   rids.push($(this).attr('data-rid'));
               }

           });
           if(!rids.length) {
               var msg = "请选择文件！";

               Model.MsgBox(msg);

               return false;

           }

           // 循环下载文件
           rids.forEach(function (rid) {
               var fileType = _this.$el.find('[data-rid="'+rid+'"]').attr("file-type");
               var imgURL = "";
               if(fileType == 4){
                   imgURL = CONFIG.qiniu_rc_url + rid + "?attname=";
               }else{
                   imgURL = CONFIG.upyun.rc_upyun_http + rid;
               }
               var a = $("<a></a>").attr("href", imgURL).attr("download", "").appendTo("body");

               a[0].click();
               a.remove();
           });
        },

        //input输入框取消
        _cancel : function () {
            this.$cancel.prev().val("");
            this.$cancel.hide();
        },
        //上一页
        _lastPage :　function () {
            var _this = this,
                pageNo;
            //判断当前页是否为1 为1 返回 不为1 当前页码-1
            if(this.nowPage != 1) {
                //获取数据，并获取总条数 从而得知总页数
                pageNo = this.nowPage - 1;
                this.nowPage = pageNo;
                //设置html当前页码
                this.$nowPage.text(this.nowPage);
                // alert(pageNo);
                this.changPage(pageNo);
            }

        },
        //下一页
        _nextPage : function () {
            var _this = this,
                pageNo;
            //判断当前页是否为最后一页， 为最后一页返回，不为最后一页,当前页码+1
            if(this.nowPage != this.maxPage) {
                //获取数据，并获取总条数 从而得知总页数
                pageNo = this.nowPage + 1;
                this.nowPage = pageNo;
                //设置html当前页码
                this.$nowPage.text(this.nowPage);
                this.changPage(pageNo);
                // alert(pageNo);
            }
        },
        //文件翻页
        changPage : function (pageNo) {
            var _this = this,
                obj = {};
            obj.pageSize = this.pageSize;
            obj.pageNumber = pageNo;
            if(this.fid) {
                obj.folderId = this.fid;
            }
            Tool.ajax("/page/web/classfront/filePageList", obj, function (res) {
                if(!!res && res.code == 0) {
                    // alert("获取成功");
                    var type = "info",
                        files = res.data.files,
                        totalPages = res.data.totalPages;
                    //设置最大页
                    if(!totalPages) {
                        _this.maxPage =  1;
                        _this.$maxPage.text(_this.maxPage);
                        //翻页按钮隐藏
                        _this.$pageBtn.hide();
                    } else {
                        _this.maxPage =  totalPages;
                        _this.$maxPage.text(_this.maxPage);
                        //翻页按钮显示
                        _this.$pageBtn.show();
                    }

                    _this._renderFile(files, type);

                } else {
                    console.log("获取失败");
                    alert("获取失败");
                }
            });
        },
        _checkFolder : function () {
            var folderName = this.$folderInput.val();
            if (!folderName || folderName.length > 20 || !Tool.testNickName(folderName)) {
                if(!this.$errorDom.hasClass("has-error")) {
                    this.$errorDom.addClass("has-error");
                    this.$errorMsg.show();
                }
                return false;

            } else {
                if(this.$errorDom.hasClass("has-error")) {
                    this.$errorDom.removeClass("has-error");
                    this.$errorMsg.hide();
                }
                return true;
            }

        },
        _confirm : function () {
            var data = {}, url = "", _this = this;
            if(!this._checkFolder())  return;

            data.name = $.trim(this.$folderInput.val());

            if(!this.activeId){
                url = "/page/web/classfront/createFolder"
            } else {
                url = "/page/web/classfront/updateFolder"
                data.folderId = this.activeId;
            }

            Tool.ajax(url, data, function (res) {
                if(!!res && res.code == 0) {
                    _this._reset();
                    if(!data.folderId) {
                        $("#all").append(_this.renderFolder(res.data.folder));
                    } else {
                        //修改dom节点文件夹名字
                        var fileDom = $('[data-type="folder"]').closest('[data-fid="'+data.folderId+'"]');
                        fileDom.attr("data-name", data.name);
                        fileDom.find('.folder-name').text(data.name);
                    }
                } else {
                    alert("异常");
                }
            })
        },
        _show : function (msg) {
            //异常异常提示
            this.$folderInput.parent().removeClass("has-error");
            this.$folderInput.next().hide();
            this.$folderLayer.find('h3').text(msg);
            this.$folderLayer.show();
            this.$masker.show();
        },
        _hide : function () {
            this._reset();
        },
        _reset : function (folderId) {
            this.activeId = null;
            this.$folderLayer.hide();
            this.$masker.hide();
            this.$folderInput.val("");
            this.folderId = null;
        },
        renderFolder : function (folder) {
            var arr = [];

            arr.push('<li  data-type="folder" data-name="'+folder.name+'" data-fid="'+folder.id+'" node-type="loadInfo">');
            arr.push('    <span class="folder-option"><i class="fa fa-check-circle"></i></span>');
            arr.push('   <div class="folder-photo">');
            arr.push('       <span class="photo"><i class="icon folder"></i></span>');
            arr.push(' </div>');
            arr.push('<div class="folder-name" >'+folder.name+'</div>');
            arr.push('   </li>');

            return arr.join('');
        },
    }

    $.fn.FILEList = function (option, str) {
        var $this = $(this),
            data = $this.data("FILEList");

        return typeof option == 'string' ? data[option](str) : this.each(function () {

            $this.data('FILEList', (data = new FILELIST(this, option)));

            return this;
        });
    }
    $("body").FILEList();
})();