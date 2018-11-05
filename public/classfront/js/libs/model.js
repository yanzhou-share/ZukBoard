/**
 * Created by ncy on 2018/2/22 0010.
 */
; (function ($) {
    /**
     * 确认弹层
     * @param callback
     * @param caller
     * @constructor
     * 例：Model.Logout();
     */
    var ConfirmBox = function (msg, callback, caller) {
        this.callback = callback;
        this.caller = caller;
        this.msg = msg;

        if (!callback) {
            !!this.caller && this.error();
        }

        this.init();
        this.addEvents();
    }

    ConfirmBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#confirm_tip");
            this.masker = $("#masker");
            this.confirmBtn = this.tip.find('[action-type="confirm"]');
            this.cancleBtn = this.tip.find('[action-type="cancle"]');
        },
        addEvents: function () {
            var _this = this;

            this.tip.delegate('[action-type="confirm"]', 'click', function () {
                _this.hide();
                _this.callback(true);
            });
            this.tip.delegate('[action-type="cancle"]', 'click', function () {
                _this.hide();
                _this.callback(false);
            });

            this.show();
        },
        render: function () {
            var arr = [];

            arr.push('<div id="confirm_tip" class="popover popover-small fade in" style="position:fixed;width:276px;left: 50%;top: 50%;margin-left: -138px;margin-top: -79px">');
            arr.push('	<div class="popover-body">		');
            arr.push('		<h3>'+this.msg+'</h3>');
            arr.push('	</div>		');
            arr.push('	<div class="popover-footer">		');
            arr.push('		<button class="btn btn-default" action-type="cancle">取消</button>');
            arr.push('		<button class="btn btn-success" action-type="confirm">确定</button>');
            arr.push('	</div>	');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        },
    };

    /**
     * 提示层
     * @param callback
     * @param caller
     * @constructor
     * 例：Model.MsgBox();
     */
    var MsgBox = function (msg, callback, caller) {
            this.callback = callback;
            this.caller = caller;
            this.msg = msg;

            if (!callback) {
                !!this.caller && this.error();
            }

            this.init();
            this.addEvents();
        }

    MsgBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#msg_tip");
            this.masker = $("#masker");
            this.confirmBtn = this.tip.find('[action-type="confirm"]');
            this.cancleBtn = this.tip.find('[action-type="cancle"]');
        },
        addEvents: function () {
            var _this = this;

            this.tip.delegate('[action-type="cancle"]', 'click', function () {
                _this.hide();
            });

            this.show();
        },
        render: function () {
            var arr = [];

            arr.push('<div id="msg_tip" class="popover popover-small fade in" style="position:fixed;width:276px;left: 50%;top: 50%;margin-left: -138px;margin-top: -50px">');
            arr.push('	<div class="popover-header">		');
            arr.push('		<a class="close" action-type="cancle"><i class="fa fa-times"></i></a>');
            arr.push('	</div>		');
            arr.push('	<div class="popover-body">		');
            arr.push('		<h3>'+this.msg+'</h3>');
            arr.push('	</div>	');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            !!this.tip && this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            var _this = this;
            this.tip.show();
            this.masker.show();
            //3s后自动关闭
            setTimeout(function(){
                _this.hide();
            }, 3000);
        },
        hide: function () {
            !!this.tip && this.tip.hide();
            this.reset();
            this.masker.hide();
        }
    };
    //成功层

    var successBox = function (msg, callback, caller) {
        this.callback = callback;
        this.caller = caller;
        this.msg = msg;

        if (!callback) {
            !!this.caller && this.error();
        }

        this.init();
        this.addEvents();
    }

    successBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#msg_tip");
            this.masker = $("#masker");
        },
        addEvents: function () {
            var _this = this;

            this.show();
        },
        render: function () {
            var arr = [];

            arr.push('<div class="popover popover-small fade in" id="msg_tip" style="display:block;position:fixed;width:276px;left: 50%;top: 50%;margin-left: -138px;margin-top: -30px">');
            arr.push('   <div class="popover-body pad-0">');
            arr.push('   <h3>'+this.msg+'</h3>');
            arr.push('</div>');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            var _this = this;
            this.tip.show();
            this.masker.show();
            //3s后自动关闭
            setTimeout(function(){
                _this.hide();
                _this.masker.hide();
                _this.callback(true);
            }, 1000);
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        },
    };


    /**
     * 检测完成提示层
     * @param callback
     * @param caller
     * @constructor
     * 例：Model.CheckBox();
     */
    var CheckBox = function (data, callback) {
        this.callback = callback;
        this.data = data;

        // if (!callback) {
        //     !!this.caller && this.error();
        // }

        this.init();
        this.addEvents();
    }

    CheckBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#check_tip");
            this.masker = $("#masker");
            this.confirmBtn = this.tip.find('[action-type="confirm"]');
            this.cancleBtn = this.tip.find('[action-type="cancle"]');
        },
        addEvents: function () {
            var _this = this;

            this.tip.delegate('[action-type="confirm"]', 'click', function () {
                _this.hide();
                _this.callback(true);
            });

            this.tip.delegate('[action-type="cancle"]', 'click', function () {
                _this.hide();
            });

            this.show();
        },
        render: function () {
            var systemPass = !!this.data.systemPass ? "success" : "fail",
                cameraPass = !!this.data.cameraPass ? "success" : "fail",
                headphonePass = !!this.data.headphonePass ? "success" : "fail",
                micPass = !!this.data.micPass ? "success" : "fail";
            var arr = [];
            arr.push('<div class="popover popover-middle fade in" id="check_tip" style="position:fixed;width:430px;left: 50%;top: 50%;margin-left: -215px;margin-top: -206px">');
            arr.push('<div class="popover-header text-center">');
            arr.push('<h3>检测完成</h3>');
            arr.push('<a class="close" action-type="cancle"><i class="fa fa-times"></i></a>');
            arr.push('</div>');
            arr.push('<div class="popover-body">');
            arr.push('<div class="device-result">');
            arr.push('<p>如果检测项目不通过，请尽快检修设备，以免影响上课效果！</p>');
            arr.push(' <ul class="device-list">');
            arr.push(' <li class="'+systemPass+'">');
            arr.push('<i class="fa fa-laptop"></i> 系统检测');
            arr.push('<span class="result pull-right">');
            arr.push('<i class="fa fa-check-circle-o"></i>');
            arr.push('<i class="fa fa-ban"></i>');
            arr.push('</span>');
            arr.push('</li>');
            arr.push('<li class="'+cameraPass+'">');
            arr.push('<i class="fa fa-video-camera"></i> 摄像头检测');
            arr.push('<span class="result pull-right">');
            arr.push('<i class="fa fa-check-circle-o"></i>');
            arr.push('<i class="fa fa-ban"></i>');
            arr.push('</span>');
            arr.push('</li>');
            arr.push('<li class="'+headphonePass+'">');
            arr.push('<i class="fa  fa-volume-up"></i> 耳机检测');
            arr.push('<span class="result pull-right">');
            arr.push('<i class="fa fa-check-circle-o"></i>');
            arr.push('<i class="fa fa-ban"></i>');
            arr.push('</span>');
            arr.push('</li>');
            arr.push('<li  class="'+micPass+'">');
            arr.push('<i class="fa fa-microphone"></i> 麦克风检测');
            arr.push('<span class="result pull-right">');
            arr.push('<i class="fa fa-check-circle-o"></i>');
            arr.push('<i class="fa fa-ban"></i>');
            arr.push('</span>');
            arr.push('</li>');
            arr.push('</ul>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('<div class="popover-footer text-center">');
            arr.push('<button class="btn btn-success" action-type="confirm">确定</button>');
            arr.push('</div>');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },
        error: function () {
            //!!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            //!!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            //this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        },
    };

    /**
     * 添加成员提示层
     * @param callback
     * @param caller
     * @constructor
     * 例：Model.AddMemberBox();
     */
    var AddMemberBox = function (list,callback, caller) {
        this.callback = callback;
        this.caller = caller;
        this.list = list;

        if (!callback) {
            !!this.caller && this.error();
        }

        this.init();
        this.addEvents();
    }

    AddMemberBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#addmember_tip");
            this.masker = $("#masker");
            this.confirmBtn = this.tip.find('[action-type="confirm"]');
            this.cancleBtn = this.tip.find('[action-type="cancle"]');
        },
        addEvents: function () {
            var _this = this;

            this.tip.delegate('[action-type="confirm"]', 'click', function () {
                var selectVal = $("#select option:selected").val();
                _this.hide();
                _this.callback(selectVal);
            });

            this.tip.delegate('[action-type="cancle"]', 'click', function () {
                _this.hide();
            });

            this.show();
        },
        render: function () {
            var arr = [];
                arr.push('<div class="popover popover-middle fade in" id="addmember_tip" style="position:fixed;left: 50%;top: 50%;margin-left: -290px;margin-top: -120px">');
                arr.push('    <div class="popover-header text-left">');
                arr.push('        <h3>添加成员至...</h3>');
                arr.push('    </div>');
                arr.push('   <div class="popover-body">');
                arr.push('        <div class="class-form">');
                arr.push('            <form class="form-horizontal">');
                arr.push('               <div class="form-group">');
                arr.push('                   <select id="select" name="select" class="form-control" size="1">');
                this.list.forEach(function (li) {
                    arr.push('                       <option value="'+li.id+'">'+li.name+'</option>');
                });
                arr.push('                   </select>');
                arr.push('               </div>');
                arr.push('           </form>');
                arr.push('       </div>');
                arr.push('   </div>');
                arr.push('   <div class="popover-footer text-right">');
                arr.push('        <button class="btn btn-default" action-type="cancle">取消</button>');
                arr.push('        <button class="btn btn-success" action-type="confirm">确定</button>');
                arr.push('   </div>');
                arr.push('</div>');


            $(document.body).append(arr.join(""));
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        },
    };

    /**
     * 文件夹层
     * @param callback
     * @param caller
     * @constructor
     * 例：Model.FolderBox();
     */
    var FolderBox = function (msg, callback, caller) {
        this.callback = callback;
        this.caller = caller;
        this.msg = msg;

        if (!callback) {
            !!this.caller && this.error();
        }

        this.init();
        this.addEvents();
    }

    FolderBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#folder_tip");
            this.masker = $("#masker");
            this.confirmBtn = this.tip.find('[action-type="confirm"]');
            this.cancleBtn = this.tip.find('[action-type="cancle"]');
            this.folderName = this.tip.find('#folderName');
            this.errorDom = this.tip.find(".form-group");
            this.errorMsg = this.tip.find('.help-block');
        },
        addEvents: function () {
            var _this = this;

            this.tip.delegate('[action-type="confirm"]', 'click', function () {
                var folderName = $.trim(_this.folderName.val());
                if (!folderName) {
                    if(!_this.errorDom.hasClass("has-error")) {
                        var msg = "请输入文件夹名";
                        _this.errorDom.addClass("has-error");
                        _this.errorMsg.text(msg).show();
                    }

                } else {
                    if(!_this.errorDom.hasClass("has-error")) {
                        _this.errorDom.removeClass("has-error");
                        _this.errorMsg.hide();
                    }

                    _this.callback(folderName);
                    //创建文件夹ajax 判断是否重名 重名错误提示
                }

            });

            this.tip.delegate('[action-type="cancle"]', 'click', function () {
                _this.hide();
            });

            this.show();
            //上传成功监听
        },
        render: function () {
            var arr = [];

            arr.push('<div class="popover popover-middle fade in" id="folder_tip" style="position:fixed;left: 50%;top: 50%;margin-left: -290px;margin-top: -120px">');
            arr.push('    <div class="popover-header text-left">');
            arr.push('        <h3>'+this.msg+'</h3>');
            arr.push('    </div>');
            arr.push('    <div class="popover-body">');
            arr.push('       <div class="class-form">');
            arr.push('           <form class="form-horizontal">');
            arr.push('               <div class="form-group">');
            arr.push('                   <input type="text" id="folderName" name="text-input" class="form-control" placeholder="Text">');
            arr.push('                       <span class="help-block" style="display:none;">请输入文件名</span>');
            arr.push('               </div>');
            arr.push('          </form>');
            arr.push('       </div>');
            arr.push('   </div>');
            arr.push('   <div class="popover-footer text-right">');
            arr.push('       <button class="btn btn-default" action-type="cancle">取消</button>');
            arr.push('        <button class="btn btn-success" action-type="confirm">确定</button>');
            arr.push('   </div>');
            arr.push('</div>');


            $(document.body).append(arr.join(""));
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            // this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        },
    };

    /**
     * 上传弹层
     * @param msg
     * @param callback
     * @param caller
     * @constructor
     */

    var UploadBox = function (options, callback, caller) {
        this.callback = callback;
        this.caller = caller;
        //true 正常弹层  false error
        this.files = options.files;
        this.folderId = options.folderId;
        this.userId = options.userId;
        this.successFiles = [];

        if (!callback) {
            !!this.caller && this.error();
        }

        this.init();
        this.addEvents();
        this.onUploader();
    }

    UploadBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#upload_tip");
            this.masker = $("#masker");
            this.confirmBtn = this.tip.find('[action-type="confirm"]');
            this.cancleBtn = this.tip.find('[action-type="cancle"]');

            //listDom
            this.listItem = this.tip.find(".file-list-item");
        },
        addEvents: function () {
            var _this = this;

            this.tip.delegate('[action-type="confirm"]', 'click', function () {
                //成功传输数据
                _this.sureConfirm();
                _this.callback(true);
            });
            this.tip.delegate('[action-type="cancle"]', 'click', function () {
                _this.hide();
                _this.callback(false);
            });

            this.tip.delegate('[node-type="cancel-icon"]', 'click', function (event) {
                //取消文件list
                _this.cancel_icon(event);
            });

            this.show();
            //上传文件成功监听
        },
        onUploader : function () {
            var _this = this;
            $('[node-type="uploadImg"]').on("medium.uploader.loaded", function (env, file) {
                if(file) {
                    //将成功文件存储在成功文件列表
                    var fileId = file.id,
                        fileData = {};
                    fileData.type = file.type;
                    fileData.name = file.name;
                    fileData.pathUrl = file.rid;
                    // _this.successFiles.push(filedata);
                    // //上传文件层dom
                    var fileDom = $('[data-id="'+file.id+'"]');

                    if(file.type == 2) {
                        Tool.ajax("/page/web/classfront/loadPPt", {rid:file.rid}, function (res) {
                            if(!!res && res.code == 0) {
                                //判断往哪层炫染
                                var data = res.data.result;
                                //ppt解析
                                fileData.content = JSON.stringify(data.data);
                                fileDom.addClass("upload-success");
                                fileDom.find('.progress').hide();
                                fileDom.find('[node-type="cancel-progress"]').hide();
                                //产品需求隐藏删除按钮
                                // fileDom.find('[node-type="cancel-icon"]').show();
                            } else {
                                console.log('解析失败');
                            }
                        });
                    } else {
                        //
                        fileDom.addClass("upload-success");
                        fileDom.find('.progress').hide();
                        fileDom.find('[node-type="cancel-progress"]').hide();
                        //产品需求隐藏删除按钮
                        // fileDom.find('[node-type="cancel-icon"]').show();
                    }
                    _this.fileData = fileData;

                }

                //监听是否含有upload-fail 没有 显示确定按钮
                _this.checkConfirm();
            });

            //上传文件失败监听
            $('[node-type="uploadImg"]').on("medium.uploader.error", function (env, file) {
                if(!!file) {
                    var fileDom = $('[data-id="'+file.id+'"]');
                    if (fileDom) {
                        fileDom.addClass("upload-fail");
                        fileDom.find('[node-type="cancel-progress"]').hide();
                        //产品要求隐藏删除按钮
                        fileDom.find('[node-type="cancel-icon"]').show();
                    }
                }
            });
        },
        render: function () {
            var arr = [];

            arr.push('<div class="popover popover-middle fade in" id="upload_tip" style="position:fixed;left: 50%;top: 50%;margin-left: -290px;margin-top: -185.5px">');
            arr.push('    <div class="popover-header text-left">');
            arr.push('        <h3>上传文件</h3>');
            arr.push('       <a class="close" action-type="cancle"><i class="fa fa-times"></i></a>');
            arr.push('    </div>');
            arr.push('   <div class="popover-body">');
            arr.push('        <ul class="file-list">');
            this.files.forEach(function (file) {
                //file.status = 4 是文件过大的文件
                if (file.status != 4 ) {
                    arr.push('           <li class="file-list-item" data-id="'+file.id+'">');
                    arr.push('               <span class="file-name">'+file.name+'</span>');
                    arr.push('               <div class="file-state">');
                    arr.push('                    <p>上传失败!</p>');
                    arr.push('                    <div class="progress thin">');
                    arr.push('                        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">');
                    arr.push('                            <span class="sr-only">0% Complete</span>');
                    arr.push('                       </div>');
                    arr.push('                   </div>');
                    arr.push('                   <a class="close" node-type="cancel-progress">取消</a>');
                    arr.push('                   <a class="close" node-type="cancel-icon" style="display:none"><i class="fa fa-times"></i></a>');
                    arr.push('               </div>');
                    arr.push('            </li>');
                } else {
                    arr.push('           <li class="file-list-item upload-fail" data-id="'+file.id+'">');
                    arr.push('               <span class="file-name">'+file.name+'</span>');
                    arr.push('               <div class="file-state">');
                    arr.push('                    <p>文件过大，无法上传!</p>');
                    arr.push('                    <div class="progress thin">');
                    arr.push('                        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">');
                    arr.push('                            <span class="sr-only">0% Complete</span>');
                    arr.push('                       </div>');
                    arr.push('                   </div>');
                    arr.push('                   <a class="close" node-type="cancel-progress" style="display:none">取消</a>');
                    arr.push('                   <a class="close" node-type="cancel-icon"><i class="fa fa-times"></i></a>');
                    arr.push('               </div>');
                    arr.push('            </li>');
                }
            })
            arr.push('        </ul>');
            arr.push('   </div>');
            arr.push('   <div class="popover-footer text-left">');
            arr.push('      <button class="btn btn-success" action-type="confirm" disabled="disabled">确定</button>');
            arr.push('      <button class="btn btn-default" action-type="cancle">取消</button>');
            arr.push('   </div>');
            arr.push('</div>');

            $(document.body).append(arr.join(""));
        },
        //删除按钮
        cancel_icon : function (event) {
            var _this = this,
                $target = $(event.target).closest('[node-type="cancel-icon"]'),
                parentDom =  $target.parents(".file-list-item");

            //列表中删除文件
            parentDom.remove();
            // if(parentDom.hasClass("upload-success")) {
            //     var fileId = parentDom.attr("data-id");
            //
            //     this.successFiles.forEach(function(li, index) {
            //         if(li.id == fileId) {
            //             _this.successFiles.splice(index, 1);
            //             //移除dom
            //             parentDom.remove();
            //         }
            //     });
            // }


            //如果移除最后一个domlist 则关闭弹层
            if($('.file-list-item').length == 0) {
                this.hide();
            } else {
                //监听是否含有upload-fail 没有 显示确定按钮
                this.checkConfirm();
            }
        },
        checkConfirm : function () {
            var errLength = $(".upload-fail").length;
            if(!errLength) {
                this.confirmBtn.removeAttr("disabled")
            }
        },
        showModel : function (opt, callback) {
            this.callback = callback;
            this.files = opt.files;
            this.folderId = opt.folderId;
            this.userId = opt.userId;
            this.init();
            this.addEvents();
        },
        //确定提交按钮 多文件上传
        // sureConfirm : function () {
        //     var _this = this;
        //     var data = {};
        //     if(this.folderId) {
        //         data.folderId = this.folderId;
        //     }
        //     data.files = JSON.stringify(_this.successFiles);
        //     Tool.ajax("/page/web/classfront/createFiles", data, function (res) {
        //         if(!!res && res.code == 0) {
        //             //判断往哪层炫染
        //             if(_this.folderId) {
        //                 //判断详情dom是否是显示状态
        //                 if($("#detail").is(':hidden')) {
        //                     $("#detail").show();
        //                     $(".no-folder").hide();
        //                 }
        //                 $('#detail').append(_this._renderInfo(data));
        //             } else{
        //                 $('#all').append(_this._renderInfo(data));
        //             }
        //             _this.hide();
        //         } else {
        //             alert("上传失败");
        //         }
        //     });
        //     //批量上传的文件数组
        //     // console.log(this.successFiles);
        // },
        // 确定提交按钮 多文件上传
        sureConfirm : function () {
            var _this = this,
                data ;
            if(this.folderId > 0) {
                this.fileData.folderId = this.folderId;
            }
            data = this.fileData
            Tool.ajax("/page/web/classfront/createFile", data, function (res) {
                if(!!res && res.code == 0) {
                    //判断往哪层炫染
                    var fileInfo = res.data.file;
                    if(_this.folderId > 0) {
                        //判断详情dom是否是显示状态
                        if($("#detail").is(':hidden')) {
                            $("#detail").html('');
                            $("#detail").show();
                            $(".no-folder").hide();
                        }
                        $('#detail').append(_this._renderFileInfo(fileInfo));
                    } else{
                        $('#all').append(_this._renderFileInfo(fileInfo));
                    }
                    _this.hide();
                } else {
                    alert("上传失败");
                }
            });
            //批量上传的文件数组
            // console.log(this.successFiles);
        },
        // _renderInfo : function (files) {
        //     var arr = [];
        //     files.forEach (function (fileInfo) {
        //         arr.push('<li data-type="file" node-type="loadInfo" data-url="'+fileInfo.pathUrl+'"> <!--data-type="folder"  file-->');
        //         arr.push('    <span class="folder-option"><i class="fa fa-check-circle"></i></span>');
        //         arr.push('    <div class="folder-photo">');
        //         if(fileInfo.type == 1) {
        //             arr.push('        <span class="photo"><i class="icon jpg"></i></span>');
        //         } else if(fileInfo.type == 2) {
        //             arr.push('        <span class="photo"><i class="icon ppt"></i></span>');
        //         }
        //         arr.push('    </div>');
        //         arr.push('    <div class="folder-name">'+fileInfo.name+'</div>');
        //         arr.push('</a>');
        //     });
        //
        //     return arr.join('');
        // },

        //单文件上传
        _renderFileInfo : function (fileInfo) {
            var arr = [];
                arr.push('<li data-type="file" node-type="loadInfo" data-rid="'+fileInfo.pathUrl+'" data-fid="'+fileInfo.id+'" file-type="'+fileInfo.type+'"> <!--data-type="folder"  file-->');
                arr.push('    <span class="folder-option"><i class="fa fa-check-circle"></i></span>');
                arr.push('    <div class="folder-photo">');
                if(fileInfo.type == 1) {
                    arr.push('        <span class="photo"><i class="icon jpg"></i></span>');
                } else if(fileInfo.type == 2) {
                    arr.push('        <span class="photo"><i class="icon ppt"></i></span>');
                }
                arr.push('    </div>');
                arr.push('    <div class="folder-name">'+fileInfo.name+'</div>');
                arr.push('</a>');

            return arr.join('');
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
            this.masker.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
            this.masker.hide();
        },
    };


    /**
     * 工具函数
     * @type {{replaceHtmlTag: Function, testNickName: Function, arrayDistinct: Function, _regMobile: Function}}
     */
    var Model = {
        ConfirmBox: function (msg, callback, caller) {
            new ConfirmBox(msg, callback, caller);
        },
        MsgBox: function (msg, callback, caller) {
            new MsgBox(msg, callback, caller);
        },
        successBox: function (msg, callback, caller) {
            new successBox(msg, callback, caller);
        },
        CheckBox: function (callback, data) {
            new CheckBox(callback, data);
        },
        AddMemberBox: function (list,callback, caller) {
            new AddMemberBox(list,callback, caller);
        },
        FolderBox: function (msg, callback, caller) {
            new FolderBox(msg, callback, caller);
        },
        UploadBox: function (options, callback, caller) {
            return new UploadBox(options, callback, caller);
        },

        //发短信倒计时
        captchCountdown : function (SendDom, againDom) {
            var countdownCaptch = againDom,
                sendCaptch = SendDom,
                countdownNum = 59,
                _this = this;

            countdownCaptch.show();
            sendCaptch.hide();

            var iCount = setInterval(function () {

                countdownNum--;
                countdownCaptch.find("span").text(countdownNum + "s后重发");

                if (countdownNum <= 0) {
                    countdownCaptch.find("span").text("59s后重发");
                    clearInterval(iCount);//关闭setInterval
                    sendCaptch.show();
                    countdownCaptch.hide();
                }
            }, 1000);
        },

    };
    window.Model = Model;
})(window.jQuery);