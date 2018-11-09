; (function ($, undefined) {
    var uploadUrl =  'https://v0.api.upyun.com/imclass';//+'&tmp=true';//resourceBaseUrl+'/rc/upload?tmp=true&sid='+def_sid;//https://api.yun.vhall.com/api/v1/document/create
    var loadingimg = '/assets/img/loading2.gif';
    var audiodefault = '/assets/img/audio-default.png';
    // var uploadAudio = TT_CONFIG.URL_CONSTANTS.RC_UPFILE_URL + TT_CONFIG.URL_CONSTANTS.RC_UPFILE_DIR;
    // var uploadVideo = TT_CONFIG.URL_CONSTANTS.RC_UPFILE_URL + TT_CONFIG.URL_CONSTANTS.RC_UPFILE_DIR;
    // uploadAudio = '/up/music';//
    uploadApk = '/up/apk';//

    // var _url = 'http://v0.api.upyun.com/tutubaike'
    // var arrFilters = [{title: "Image files", extensions: "jpg,jpeg,bmp,png"}];

    /**
     * 上传组件
     * @class
     * @name mediumUpload
     * @param _el
     * @param options
     */
    var mediumUpload = function (_el, options) {
        this.$el = $(_el);
        // console.log(options,111,'mediumupload');
        this.options = $.extend({}, $.fn.mediumupload.defaults, options);
        this.initialized();
    };

    mediumUpload.prototype = /** @lends mediumUpload.prototype*/{
        /**
         * 初始化
         */
        initialized: function () {
            this.init();
            this.settings = {};
            $.extend(this.settings, TT);
            this.settings.delegateEvents(this);//继承events事件
            this.init_uploader();
        },
        init: function () {
            if (!!this.options.html) {
                if (!!this.options.istarget) {
                    this.$el.html(this.options.html);
                }
                else {
                    this.$el.after(this.options.html);
                }
            }
            this.reset(this.options);
        },
        /**
         * 重置
         * @param opt{object} 传入参数
         */
        reset: function (opt) {
            // this.options = opt;
            this.options = $.extend({}, $.fn.mediumupload.defaults, opt);
            // this.$maindom = (!!this.options.istarget) ? this.$el : this.$el.next();
            if (!!this.options.istarget) {
                this.$maindom = this.$el;
            }

            this.state = this.options.state;
            this.optBtn = this.options.btnup;
            if (this.state == "commodity" && !this.max_commodity()) {
                $("#" + this.options.btnup).show();
            }
        },
        cover_del: function (_el) {
            var node = _el.closest('[node-type="title-img"]');
            this.$maindom.removeClass('has-image').addClass('no-image').removeClass('uploading-image');
            node.find('img').hide().attr('src', '');
            node.attr('data-rid', '');
            if (!this.$upbtn) {
                this.$upbtn = this.$maindom.find('[node-type="upload-btn"]');
            }
            this.$upbtn.show();
            if (!this.$loading) {
                this.$loading = this.$maindom.find('[node-type="loading-img"]');
            }
            this.$loading.html('').hide();
            node.find('[node-type="placeHolder-coverInfo"]').html('');
        },
        contentpic_del: function (_el) {
            this.$picDom = _el.closest('[node-type="figure-img"]');
            this.$contentpic = _el.closest('[node-type="post-figure"]');
            var that = this;
            var triggerdel = (this.options.triggerdel) ? this.options.triggerdel : 'mediumupload.uploader.delete';
            this.$el.trigger(triggerdel);
            this.figure_delcallback();
            //this.$el.trigger(triggerdel,{_node:this.$contentpic,_callback:function(){that.figure_delcallback()},_scope:this});

        },
        figure_delcallback: function () {
            if (this.$picDom.length > 0) {
                this.$picDom.remove();
            }
            //figure node-type="post-figure"

            if (this.$contentpic.length > 0) {
                this.$contentpic.remove();
            }
            if (this.state == "commodity" && !this.max_commodity()) {
                $("#" + this.options.btnup).show();
            }
        },
        coll_del: function (_el) {
            this.$maindom = _el.closest('[node-type="collection-production-cover"]');
            //this.$maindom.attr({'data-img-rid':''}).css({'background-image':''});
            //this.psncover = {'rid':this.$preview.attr('data-img-rid'),'backgroundimage':this.$preview.css('background-image')};
            this.$preview.attr('data-img-rid', this.collcover.rid).css('background-image', this.collcover.backgroundimage);
            this.$maindom.removeClass('uploading-image').addClass('no-image');
        },
        psn_del: function (_el, isdel) {
            this.psncover = { 'rid': this.$maindom.attr('data-img-rid'), 'src': this.$maindom.attr('data-url') };
            if (!!isdel) {
                this.$maindom.attr('data-img-rid', '');
                this.$figurepic.attr('src', '/assets/img/default-photo.png');
            }
            else {
                this.$maindom.attr('data-img-rid', this.psncover.rid);
                this.$figurepic.attr('src', this.psncover.src);
            }
            this.$maindom.removeClass('uploading-image').addClass('no-image');
        },
        autoresizeImage: function (maxWidth, maxHeight, objImg) {
            var img = new Image();
            img.src = objImg.getAsDataURL();
            var hRatio;
            var wRatio;
            var Ratio = 1;
            var w = img.width;
            var h = img.height;
            wRatio = maxWidth / w;
            hRatio = maxHeight / h;
            if (maxWidth == 0 && maxHeight == 0) {
                Ratio = 1;
            } else if (maxWidth == 0) { //
                if (hRatio < 1) Ratio = hRatio;
            } else if (maxHeight == 0) {
                if (wRatio < 1) Ratio = wRatio;
            } else if (wRatio < 1 || hRatio < 1) {
                Ratio = (wRatio <= hRatio ? wRatio : hRatio);
            }
            if (Ratio < 1) {
                w = w * Ratio;
                h = h * Ratio;
            }
            objImg.height = h;
            objImg.width = w;
        },
        beforeUpload: function (up, file) {
            var that = this, state = this.state, $maindom = this.$maindom, target = this.options.target;
            if (state == "upload_pic" || state == "ppt") {
                this.$el.find('[node-type="upload_progress"]').show();
            } else if (state == "whiteboard") {
                $("#uploadProgress").show();
            }
            this.$el.trigger('medium.uploader.before');
            if (this.isFigure()) {
                this.figureSetup(file);
                var _figure = this.curr_item(file.id);
                _figure.pgdel.off('click').on('click', $.proxy(function (e) {
                    this.progress_remove(e, up, file);
                }, this));
                return;
            }
            else if (state == 'coverImg') {
                this.imageLoad(file);
            }
            if (this.$pgdel) {
                this.$pgdel.off('click').on('click', $.proxy(function (e) {
                    this.progress_remove(e, up, file);
                }, this));
            }
            if(state == "files") {
                $('[node-type="cancel-progress"]').off('click').on('click', $.proxy(function (e) {
                    this.filesUploadCancel(e, up, file);
                }, this));
            }
        },
        gifLoad: function (oimg) {
            var img = new Image();
            img.src = oimg.attr("src");
            return { width: img.width, height: img.height }; //图片实际宽度
        },
        progress_remove: function (e, up, file) {
            var that = this
            up.stop();
            up.removeFile(file);
            this.up_del($(e.target));
            window.setTimeout($.proxy(function () {
                this.$el.trigger('medium.uploader.enableed');
                up.disableBrowse(false);
            }, this), 5);
            e.preventDefault();
            this.$el.trigger('medium.uploader.change');
        },
        filesUploadCancel : function (e, up, file) {
            var that = this,
                $target = $(e.target).closest('[node-type="cancel-progress"]'),
                parentDom = $target.parents(".file-list-item");
            if($target.prev().children(".progress-bar").attr("aria-valuenow") > 0) {
                //正在上传的文件
                up.stop();
                up.removeFile(file);
                parentDom.remove();
                up.start();
            } else {
                //非正在上传的文件
                var fileId = parentDom.attr("data-id"),
                    files = up.files;
                    files.forEach(function (li) {
                        if(li.id == fileId) {
                            up.removeFile(li);
                            parentDom.remove();
                        }
                    });
            }
            //up.stop();
            //up.removeFile(file);
            //this.up_del($(e.target));
            //window.setTimeout($.proxy(function () {
            //    this.$el.trigger('medium.uploader.enableed');
            //    up.disableBrowse(false);
            //}, this), 5);
            //e.preventDefault();
            //this.$el.trigger('medium.uploader.change');
        },
        imageLoad: function (file) {
            var that = this, state = this.state;

            var img = new o.Image();
            if (state == 'figureimg' || state == "toolinsertimg" || state == 'figurevideo') {
                var _figure = this.curr_item(file.id);
                img.onload = function () {
                    _figure.item.attr({ 'data-height': this.height, 'data-width': this.width });
                    that.autoresizeImage(700, 0, this);
                    var tmpTop = this.height * 1 / 4;
                    // _figure.loading.css({'margin-top':tmpTop+'px'});
                    _figure.figurepic.attr({ 'src': this.getAsDataURL() }).css({
                        'width': this.width + 'px',
                        'height': this.height + 'px',
                        'max-width': '700px'
                    }).show();
                    _figure.description.mediumeditor();
                };
            }
            else if (state == 'coverImg') {
                img.onload = function () {
                    that.autoresizeImage(700, 0, this);
                    that.$preview.css('background-image', 'url(' + this.getAsDataURL() + ')');
                };
            }
            else if (state == 'usericon') {
                //用户头像上传过程中，不预览
                // img.onload = function() {
                //  that.autoresizeImage(700,0,this);
                //  that.$figurepic.attr({'src': this.getAsDataURL()});
                // };
            }
            else {
                img.onload = function () {
                    that.$preview.css('background-image', 'url(' + this.getAsDataURL() + ')');
                };
            }
            img.onerror = function () {
                file.destroy();
            };
            img.load(file.getSource());

        },

        //push pic名称
        setPICname: function (value) {
            if (!!value && this.options.picNames.indexOf(value) == -1) {
                this.options.picNames.push(value);
            }
        },
        setPPTname: function (value) {
            if (!!value && this.options.pptNames.indexOf(value) == -1) {
                this.options.pptNames.push(value);
            }
        },
        //移除资源
        up_del: function (_el, isdel) {
            var state = this.state, isdel = arguments.length > 1 ? arguments[0] : false;

            if (this.isFigure()) {
                this.contentpic_del(_el);
            } else if (this.state == 'commodity') {
                //商品推荐图片移除
                this.contentpic_del(_el);
            }
            else {
                this.$maindom.removeClass('uploading-image has-image').addClass('no-image');

                if (isdel) {
                    this.$maindom.attr('data-rid', '');
                    this.$figurepic.hide().attr('src', '');
                }
                if (this.$pgbar) {
                    this.$pgbar.css("width", "0%");
                }
                if (this.$pgnum.length > 0) {
                    this.$pgnum.text("0%");
                }
                if (this.$preview.length > 0) {
                    this.$preview.css('background-image', 'none');
                }
            }
        },
        uploadprogress: function (up, file) {
            var that = this, state = this.state, target = this.options.target;
            //console.log('-----上传进度----', file.percent);
            if (this.isFigure()) {
                var _figure = this.curr_item(file.id);
                _figure.pgbar.css("width", file.percent + "%");
                if (_figure.pgnum.length > 0) {
                    _figure.pgnum.text(file.percent + "%");
                }
            }
            else {
                if (this.$pgbar) {
                    this.$pgbar.css("width", file.percent + "%");
                    if (this.state == "upload_pic" || this.state == "ppt") {
                        //this.$maindom.find('.number').text(file.percent + "%");
                        this.$maindom.find('.name').text('上传中...');
                    }
                }
                if (this.$pgnum && this.$pgnum.length > 0) {
                    this.$pgnum.text(file.percent + "%");
                }
            }

            if (state == 'whiteboard') {
                $('#uploadProgress .progressBar').css("width", file.percent + "%");
            }
            if(state == 'files') {
                $('[data-id="'+file.id+'"]').find('.progress-bar').css("width", file.percent + "%");
                $('[data-id="'+file.id+'"]').find('.progress-bar').attr("aria-valuenow", file.percent);
             }
        },

        isgif: false,
        upattach: function (rid) {
            $.ajax({
                url: '/post/create_rcattach',
                type: 'POST',
                dataType: 'json',
                data: { 'rid': rid, 'caption': '' },
            })
                .done(function () {
                    console.log("success");
                });
        },

        cancelupload: function () {
            this.$maindom.removeClass('uploading-image').addClass('no-image').attr('data-rid', '');
            if (this.isFigure()) {
                // var _figure = this.curr_item(file.id);
                //          _figure.pgbar.css("width","0%");
            }
            else {
                if (this.$pgbar) {
                    this.$pgbar.css("width", "0%");
                }
                if (this.$pgnum.length > 0) {
                    this.$pgnum.text("0%");
                }
            }
        },

        fileuploaded: function (up, file, res) {
            var that = this, state = this.state, target = this.options.target;
            if (that.state == "upload_pic") {
                that.setPICname(file.name);
            }
            this.isgif = (file.type != "image/gif") ? false : true;
            var rdata = eval("(" + res.response + ")");//JSON.parse(res.response);
            var rid = rdata.url;
            if (this.isFigure()) {
                this.figureloaded(file, rdata);
            }
            else if (this.state == 'addpanelmp3') {
                this.mp3panelloaded(file, rdata);
            }
            else if (this.state == 'addapk') {
                this.apkloaded(file, rdata);
            }
            else if (state == 'addpanellrc') {
                this.lrcloaded(file, rdata);
            } else if (this.state == "commodity") {
                this.figureloaded(file, rdata);
            } else if (this.state == "ppt") {
                this.pptloaded(file, rdata);
            }
            else if (this.state == "whiteboard") {
                file.rid = rid;
                // this.$el.trigger('medium.uploader.loaded', file);
                this.analysisppt(file, rdata);
            } else if (false) {
                // this.$maindom.removeClass('uploading-image').addClass('has-image').attr('data-rid', rid);
                // this.$maindom.attr({'data-height': rdata['image-height'], 'data-width': rdata['image-width']});
                // if (this.$preview.length > 0) {
                //     this.$preview.css('background-image', 'url(' + this.getImageUrl(rid) + ')');
                // }
                // this.$figurepic.show().attr('src', that.getImageUrl(rid));
            } else if (this.state == 'upload_pic') {
                file.src = rid;
                file.rid = rid;
                this.$el.trigger('pic.uploader.loaded', file);
            } else if (this.state == "ppt") {
                this.$el.trigger('ppt.uploader.loaded', file);
            } else {
                file.rid = rid;
                var mimetype = rdata.mimetype;

                if (mimetype.indexOf('image') > -1) {
                    file.type = 1;
                } else {
                    file.type = 2;
                }
                this.$el.trigger('medium.uploader.loaded', file);
            }
            this.$el.trigger('tc.uploader.loaded', that.getImageUrl(rid));
            this.$el.trigger('tc.uploader.loaded_me', that.getImageUrl(rid));
            //this.upattach(rid);
        },
        mp3panelloaded: function (file, rdata) {
            console.log(rid, 'mp3', file);
            // this.$maindom.removeClass('uploading-image').addClass('has-image').attr('data-rid',rid);
            var _item = this.$maindom;

            var rid = rdata.url, that = this;
            var _figure = {
                item: _item,
                figurepic: _item.find('[node-type="upload-img"]'),
                figuretitle: _item.find('[node-type="mp3title"]'),
                mask: _item.find('[node-type="addImg-cover"]'),
                description: _item.find('[node-type="placeHolder-figureDesc"]'),
                figureaudio: _item.find('[data-audio]'),
                figuregif: _item.find('[data-gif="player"]'),
                loading: _item.find('[node-type="loading-img"]'),
                pgdel: _item.find('[node-type="pg-abort"]'),
                preview: _item.find('[node-type="preview-img"]'),
                pgbar: _item.find('[node-type="pg-bar"]'),
                pgnum: _item.find('[node-type="pg-percent"]')
            };

            _figure.figurepic.attr('src', '/assets/img/loader1.gif');
            if (this.options.mp3upyun) {
                $.ajax({
                    url: '/up/music/getmp3info',
                    type: 'POST',
                    dataType: 'json',
                    data: { rid: rid },
                })
                    .done(function (res) {
                        console.log("success", res);
                        mp3data = res.data
                        $.extend(rdata, mp3data);

                        var mcover = rdata.cover ? rdata.cover : audiodefault;
                        var playtime = rdata.playtime, rid = rdata.url, mtext = '';
                        // var mtitle = _figure.item.attr('name');
                        if (!!rdata.artist && !!rdata.title) {
                            mtext = rdata.artist + ' - ' + rdata.title;
                        }
                        else {
                            mtext = rdata.artist + rdata.title;
                        }
                        _figure.item.removeClass('uploading-image').addClass('has-image');
                        _figure.figuretitle = mtext;
                        _figure.figurepic.attr('src', that.options.mp3upyun ? that.getImageUrl(mcover) : mcover);
                        // this.$figureaudio.show();
                        var figure_opt = {
                            'data-rid': rid,
                            'data-title': mtext,
                            'data-text': mtext,
                            'data-cover': mcover,
                            'data-playtime': playtime
                        };
                        _figure.item.attr(figure_opt);//that.$el.next()
                        that.$el.trigger('medium.uploader.mp3loaded', figure_opt);
                        // that.mp3loaded(_figure,rdata);
                    });


                //mp3data = {cover:'',artist:'akk',title:'fugang',playtime:'03:35'};

            }
        },
        apkloaded: function (file, rdata) {
            var rid = rdata.url;
            this.$maindom.removeClass('uploading-image').addClass('has-image').attr('data-rid', rid);
            console.log(rdata);
            this.$el.trigger('apkuploader.complete', rdata);
            // this.$maindom.attr({''});
        },
        lrcloaded: function (file, rdata) {
            var rid = rdata.url;
            this.$maindom.removeClass('uploading-image').addClass('has-image').attr('data-rid', rid);
            console.log(rdata);
            // this.$el.trigger('lrcuploader.complete',rdata);
            // this.$maindom.attr({'data-rid':rid,'data-title':mtitle,});
        },
        mp3loaded: function (_figure, rdata) {
            var mcover = rdata.cover ? rdata.cover : audiodefault;
            var playtime = rdata.playtime, rid = rdata.url, mtext = '';
            var mtitle = _figure.item.attr('name');
            if (!!rdata.artist && !!rdata.title) {
                mtext = rdata.artist + ' - ' + rdata.title;
            }
            else {
                mtext = rdata.artist + rdata.title;
            }
            if (!!mtext && !_figure.description.data('mediumeditor').gettext()) {
                _figure.description.data('mediumeditor').settext(mtext);
            }
            _figure.figurepic.attr('src', this.options.mp3upyun ? this.getImageUrl(mcover) : mcover);
            // this.$figureaudio.show();
            _figure.figureaudio.attr({
                'data-rid': rid,
                'data-title': mtitle,
                'data-text': mtext,
                'data-cover': mcover,
                'data-playtime': playtime
            });//that.$el.next()

        },
        up_progress_init: function () {
            this.$pgbar.css("width", "0%");
            this.$maindom.find('.number').text("0%");
            this.$maindom.find('.name').text('上传中...');
            this.$el.find('[node-type="upload_progress"]').hide();
        },
        analysisppt: function (file, rdata) {
            var _this = this;
            var postdata = {};
            var mimetype = rdata.mimetype;

            if (mimetype.indexOf('image') > -1) {
                // $("#uploadProgress").hide();
                // $('#uploadProgress .progressBar').css("width", "0%");
                _this.$el.trigger('medium.uploader.loaded', file);
                return;
            }

            $("#uploadProgress").show();
            $('#uploadProgress .progressBar').css("width", "0%");
            $('#uploadProgress .name').text('解析中...');

            postdata.rid = file.rid;
            postdata.size = file.size;
            postdata.name = file.name;
            var progerss = 0;
            var interval = setInterval(function () {
                progerss += 10;
                if (progerss == 90) {
                    clearInterval(interval);
                }
                $('#uploadProgress .progressBar').css("width", progerss + "%");
            }, 1000)


            $.ajax({
                url: "/ppt/loadppt",
                type: "POST",
                data: postdata,
                dataType: 'json',
                timeout: 300000,
                success: function (data) {
                    console.log(data);
                    if (data.code == 0) {
                        $("#uploadProgress").hide();
                        $('#uploadProgress .progressBar').css("width", "0%");
                        $('#uploadProgress .name').text('上传中...');
                        alert("解析失败");
                        return;
                    }

                    if ("1" == data.code) {//成功
                        $('#uploadProgress .progressBar').css("width", "100%");
                        var __data = data.data;
                        file.ppts = __data;
                        _this.$el.trigger('medium.uploader.loaded', file);
                        file.cover_image = data.data.cover_image;
                        $("#uploadProgress").hide();
                        $('#uploadProgress .progressBar').css("width", "0%");
                        $('#uploadProgress .name').text('上传中...');
                        clearInterval(interval);
                    } else {
                        $("#uploadProgress").hide();
                        $('#uploadProgress .progressBar').css("width", "0%");
                        $('#uploadProgress .name').text('上传中...');
                        clearInterval(interval);
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        pptloaded: function (file, rdata) {
            var that = this;
            var rid = rdata.url;
            console.log("fileuploaded" + JSON.stringify(rdata));
            var postdata = {};
            postdata.rid = rid;
            postdata.size = file.size;
            postdata.tt_uid = _userId;
            postdata.name = file.name;
            this.$maindom.find('.number').text("0%");
            this.$maindom.find('.name').text('上传完成解析中...');

            var startSeconds = new Date().getTime() / 1000;
            var curSeconds;
            var interval = setInterval(function () {
                curSeconds = new Date().getTime() / 1000;
                var percent = Math.floor((1 - Math.pow(0.9, (curSeconds - startSeconds))) * 100);
                that.$pgbar.css("width", percent + "%");
                that.$maindom.find('.number').text(percent + "%");
            }, 100);
            $.ajax({
                url: "/upload.json",
                type: "POST",
                data: postdata,
                dataType: 'json',
                timeout: 300000,
                success: function (data) {
                    if (data.code == 0) {
                        alert("解析失败");
                        clearInterval(interval);
                        that.up_progress_init();
                        that.progress = false;
                        return;
                    }
                    console.log("upload json == " + JSON.stringify(data));
                    clearInterval(interval);
                    if ("1" == data.code) {//成功
                        //var progerss = parseInt($('#deal_upload_progress_' + file.id).html());
                        var progerss = 0;
                        console.log("progeresss ======= " + progerss);
                        var prointerval = setInterval(function () {
                            progerss += 5;
                            if (progerss > 100) {
                                progerss = 100;
                            }
                            if (progerss == 100) {
                                that.up_progress_init();
                                var date = new Date(data.data.upload_time);
                                //$('#primary-btn-' + file.id).css("display", "");
                                //$('#meeting-btn-' + file.id).css("display", "");
                                //$('#close-btn-' + file.id).css("display", "");
                                //$('#close-btn-' + file.id).removeAttr("id");
                                file.rid = rid;
                                file.cover_image = data.data.cover_image;
                                that.setPPTname(file.name);
                                that.$el.trigger("uploadEnd", file);
                                $("#ppt_empty").hide();
                                that.progress = false;
                                //$('#ppttime_' + file.id).html(date. getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日，" + data.data.slide_num + "张PPT");
                                clearInterval(prointerval);
                            }
                        }, 50);
                        //Addppt.init_masonry();
                    } else {
                        that.progress = false;
                        var delete_div = $('[data-key="pptshow-box' + ppt_array.length + '"]');
                        //$('#pptshow-lists-div').masonry('remove', delete_div).masonry();
                        //Addppt.init_masonry();
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });

        },
        figureloaded: function (file, rdata) {
            var rid = rdata.url, that = this;
            var _figure = this.curr_item(file.id);
            _figure.item.removeClass('uploading-image').addClass('has-image');
            //data-audio="player"
            if (this.state == 'addsongmp3' || this.state == 'addpanelmp3') {
                console.log(rid, 'mp3', file);
                if (this.options.mp3upyun) {
                    $.ajax({
                        url: '/up/music/getmp3info',
                        type: 'POST',
                        dataType: 'json',
                        data: { rid: rid },
                    })
                        .done(function (res) {
                            console.log("success", res);
                            mp3data = res.data
                            $.extend(rdata, mp3data);
                            that.mp3loaded(_figure, rdata);
                        });
                    //mp3data = {cover:'',artist:'akk',title:'fugang',playtime:'03:35'};
                }
                else {
                    this.mp3loaded(_figure, rdata);
                }

            }
            else if (this.state == 'addapk') {
                console.log(file, rdata, 'apkinfo');
            }
            else {
                _figure.item.attr('data-rid', rid);//that.$el.next()
                _figure.figuregif.attr('gif', rid);
                // this.$contentpic.find('[node-type="upload-img"]')
                _figure.figurepic.attr('src', this.getImageUrl(rid, 700, 768, 1));//fugang
                if (this.state == 'commodity') {
                    _figure.loading.hide();
                    _figure.pgdel.show();
                    if (!!this.max_commodity()) {
                        $("#" + this.options.btnup).hide();
                    }
                }
                if (file.type == "image/gif") {
                    _figure.figurepic.off('load').on('load', $.proxy(function () {
                        //$(this).addClass('aNewClass');
                        // var _item = this.curr_item(file.id);
                        // var _pic =
                        var gif_wh = this.gifLoad(_figure.figurepic);
                        _figure.item.attr({ 'data-height': gif_wh.height, 'data-width': gif_wh.width });
                        _figure.figurepic.css({ 'min-width': '20px', 'min-height': '20px' });
                    }, this));
                }
                else {
                    _figure.item.attr({ 'data-height': rdata['image-height'], 'data-width': rdata['image-width'] });
                }

            }
        },
        uploading: function (v) {
            if (!!arguments && arguments.length > 0) {
                this.$el.data('uploading', v);
                this.$el.trigger('medium.uploader.uploading', v);//,this.state
            }
            else {
                return parseInt(this.$el.data('uploading'));
            }
        },
        init_uploader: function () {
            var that = this;
            if (typeof fileType == "undefined") fileType = "image";
            //又拍云动态签名
            var upyunSign = Tool.upyunSign();
            var multipart_params = {
                policy: CONFIG.upyun.policy,
                signature: CONFIG.upyun.sign
            };
            // console.log(this.state);
            if (this.state == 'addsongmp3' || this.state == 'addpanelmp3') {
                fileType = 'mp3';
            }
            else if (this.state == 'addpanellrc') {
                fileType = 'lrc';
            }
            else if (this.state == 'panellocalvideo') {
                fileType = 'mp4';
            }
            else if (this.state == 'addapk') {
                fileType = 'apk';
            } else if (this.state == 'ppt') {
                fileType = 'ppt';
            }
            else if (this.state == 'whiteboard') {
                fileType = 'all';
            } else if(this.state == 'files') {
                fileType = 'files';
            } else {
                fileType = "image";
            }
            switch (fileType) {
                case "image":
                    if (this.state == 'figureimg' || this.state == 'toolinsertimg') {
                        arrFilters = [{ title: "Image files", extensions: "jpg,jpeg,bmp,png,gif" }]; //
                    }
                    else {
                        arrFilters = [{ title: "Image files", extensions: "jpg,jpeg,bmp,png" }]; //
                    }
                    url = uploadUrl;//[{title : "Image files", extensions : exts}]
                    break;
                case "ppt":
                    arrFilters = [{ title: "PPt files", extensions: "ppt,pptx" }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    url = uploadUrl;
                    break;
                case "all":
                    arrFilters = [{ title: "PPt files", extensions: "ppt,pptx" }, { title: "Image files", extensions: "jpg,jpeg,bmp,png" }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    url = uploadUrl;
                    break;
                case "files":
                    arrFilters = [{ title: "Image files", extensions: "jpg,jpeg,bmp,png" }];
                    var upyunSign = Tool.upyunSign();
                    var multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    // var multipart_params = {
                    //     app_id: "994ad309",
                    //     signed_at: "1526459343000",
                    //     sign: "c099220f128af5fa35a1966efc1e2a9f",
                    //     name: "ppt_name"
                    // };
                    url = uploadUrl;
                    break;
                case "xls":
                    arrFilters = [{ title: "Spreadsheet files", extensions: "xls,xlsx" }];
                    url = 'user/attachmentUpload';
                    break;
                case "media":
                    arrFilters = [{
                        title: "Media files",
                        extensions: "mpeg4,mob,3gpp,avi,wmv,mp3,m4a,ogg,wav"
                    }];
                    break;
                case "mp3":
                    arrFilters = [{
                        title: "Media files",
                        extensions: "mp3"
                    }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    //exts = "mp3";
                    url = uploadAudio;
                    break;
                case "mp4":
                    arrFilters = [{
                        title: "Media files",
                        extensions: "mp4"
                    }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    url = uploadVideo;
                    break;
                case "lrc":
                    arrFilters = [{
                        title: "Lrc file",
                        extensions: "lrc"
                    }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    url = uploadAudio;
                    break;
                case "apk":
                    url = uploadApk;
                    arrFilters = [{
                        title: "Apk file",
                        extensions: "apk"
                    }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    break;
                case "document":
                    arrFilters = [{
                        title: "Text files",
                        extensions: "doc,docx"
                    }, {
                        title: "PDF files",
                        extensions: "pdf"
                    }];
                    multipart_params = {
                        policy: CONFIG.upyun.policy,
                        signature: CONFIG.upyun.sign
                    };
                    break;
                default:
                    arrFilters = [
                        {
                            title: "Image files",
                            extensions: "jpg,jpeg,gif,png"
                        },
                        {
                            title: "Zip files",
                            extensions: "zip"
                        },
                        {
                            title: "Media files",
                            extensions: "mpeg4,mob,3gpp,avi,wmv,mp3,m4a,ogg,wav"
                        },
                        {
                            title: "Spreadsheet files",
                            extensions: "xls,xlsx"
                        },
                        {
                            title: "Text files",
                            extensions: "doc,docx"
                        },
                        {
                            title: "PDF files",
                            extensions: "pdf"
                        }
                    ];
                    break;
            }

            this.uploader = new plupload.Uploader({
                runtimes: 'html5,gears,flash,silverlight,browserplus',
                browse_button: this.optBtn,
                container: 'container',
                max_file_size: this.options.max_file_size,
                unique_names: true,
                url: url,
                multi_selection: this.options.multi_selection,
                multipart_params: multipart_params,
                filters: arrFilters,
                // file_data_name: "document"
            });

            //uploader.bind('Init', function(up, params){});
            this.uploader.init();

            this.uploader.bind('FilesAdded', $.proxy(function (up, files) {
                // this.$el.trigger('medium.uploader.stop');
                if (this.state == "upload_pic") {
                    if (!!this.options.picNames && !!files && this.options.picNames.indexOf(files[0].name) > -1) {
                        alert(files[0].name + "已存在，请修改名称后再次上传");
                        up.removeFile(files[0]);
                        return;
                    }
                    //this.uploader.start();
                }
                if (this.state == "ppt") {
                    if (!!this.options.pptNames && !!files && this.options.pptNames.indexOf(files[0].name) > -1) {
                        alert(files[0].name + "已存在，请修改名称后再次上传");
                        up.removeFile(files[0]);
                        return;
                    }
                    //this.uploader.start();
                }
                //imClass多文件上传逻辑
                if(this.state == "files") {
                    if(files.length > this.options.maxLength ) {
                        //移除队列
                        up.stop();
                        up.splice(0, up.files.length);

                        var msg = "您最多可上传12个文件";
                        Model.MsgBox(msg);
                        return;
                    } else {
                        var opt = {},
                            folderId = $("#uploadIcon").attr("data-fid");
                        opt.files = files;
                        opt.folderId = folderId;
                        if (!this.ModelStatus) {
                            this.ModelStatus = Model.UploadBox(opt, function(res) {
                                if(!res) {
                                    up.stop();
                                    up.splice(0, up.files.length);
                                }
                            });
                        } else {
                            this.ModelStatus.showModel(opt,function(res) {
                                if(!res) {
                                    up.stop();
                                    up.splice(0, up.files.length);
                                }
                            });
                        }


                        this.updateList(up, files);
                        if (!!this.options.autostart) {
                            setTimeout($.proxy(function () {
                                // up.stop();

                                // file.status = plupload.UPLOADING;
                                up.start();
                            }, this), 50);
                            this.uploading(1);
                        }
                        up.refresh();
                    }
                } else {
                    this.updateList(up, files);
                    if (!!this.options.autostart) {
                        setTimeout($.proxy(function () {
                            // up.stop();

                            // file.status = plupload.UPLOADING;
                            up.start();
                        }, this), 50);
                        this.uploading(1);
                    }
                    up.refresh();
                }
            }, this));
            this.uploader.bind('CancelUpload', $.proxy(function () {
                this.$el.trigger('medium.uploader.stop');
                // this.cancelupload();
            }, this));
            this.uploader.bind('BeforeUpload', $.proxy(function (up, file) {
                this.uploading(1);
                this.beforeUpload(up, file);
            }, this));
            this.uploader.bind('uploader.disabled', $.proxy(function () {
                ttapp.messageBox_tip('图片上传中，请稍后！');
            }, this));

            this.uploader.bind('UploadProgress', $.proxy(function (up, file) {
                this.uploadprogress(up, file);
            }, this));

            this.uploader.bind('Error', $.proxy(function (up, err) {
                //上传失败
                var file = err.file;
                this.$el.trigger('medium.uploader.error', file);
                //switch (err.code) {
                //    case plupload.FILE_EXTENSION_ERROR:
                //        // ttapp.messageBox_tip(this.options.file_extension_error);
                //        break;
                //
                //    case plupload.FILE_SIZE_ERROR:
                //        ttapp.messageBox_tip(this.options.file_size_error);
                //        break;
                //
                //    case plupload.FILE_DUPLICATE_ERROR:
                //        ttapp.messageBox_tip('上传失败，原因：已存在上传队列中。');
                //        break;
                //
                //    case self.FILE_COUNT_ERROR:
                //        ttapp.messageBox_tip('上传失败，原因：个数不符合要求。');
                //        break;
                //
                //    case plupload.IMAGE_FORMAT_ERROR:
                //        ttapp.messageBox_tip('上传失败，原因：格式错误。');
                //        break;
                //
                //    case plupload.IMAGE_MEMORY_ERROR:
                //        ttapp.messageBox_tip('上传失败，原因：内存错误。');
                //        break;
                //
                //    case plupload.HTTP_ERROR:
                //        ttapp.messageBox_tip('上传失败');//原因：HTTP请求错误。
                //        break;
                //}
                up.refresh();
                this.uploading(0);
            }, this));

            this.uploader.bind('FilesRemoved', $.proxy(function (up, err) {
                this.uploading(0);
            }, this));

            this.uploader.bind('FileUploaded', $.proxy(function (up, file, response) {
                this.fileuploaded(up, file, response);
                //this.uploading(0);
            }, this));
            this.uploader.bind('UploadComplete', $.proxy(function (up, files) {
                this.uploadcomplete(up, files);
                this.uploading(0);
            }, this));
        },
        start: function (opt) {
            //manual upload
            if (!this.options.autostart) {
                var target = this.options.target;
                if (typeof opt == 'object') {
                    this.videourl = opt.videourl;
                }
                up = this.uploader;
                this.uploading(1);
                if (this.state == 'figurevideo') {
                    this.$maindom.attr('data-videourl', this.videourl);
                }
                ttapp.figureUtil.insertFigure(target, this.options.editor, this.$maindom);
                this.figureSetup(this.currentFile);
                // this.beforeUpload(up,file);
                up.start();
            }
        },
        uploadcomplete: function (up, files) {
            this.$el.trigger('medium.uploader.change');
            this.$el.trigger('medium.uploader.complete');
            window.setTimeout($.proxy(function () {
                this.$el.trigger('medium.uploader.enableed');
                up.disableBrowse(false);
            }, this), 5);
        },
        queue_init: function (up, file, i) {
            // var that = this,state = this.state,$maindom = this.$maindom,target=this.options.target;
            // this.$el.trigger('medium.uploader.queue',file);
            //console.log(file);
            var that = this;
            if (this.isFigure()) {
                var _figure = { 'fid': file.id, 'pname': this.randomChar(4), 'hasrogress': true, 'ftype': file.type };
                var _tpl = '';
                switch (this.state) {
                    case 'figureimg':
                    case 'toolinsertimg':
                        _tpl = (file.type != "image/gif") ? $("#figurePhotoTemplate").tmpl(_figure) : $("#figureGifTemplate").tmpl(_figure);
                        break;
                    case 'figurevideo':
                        _tpl = $("#figureVideoTemplate").tmpl(_figure);
                        break;
                    case 'addsongmp3':
                        _tpl = $("#figureAudioTemplate").tmpl(_figure);
                        break;
                    case 'upload_pic':
                        _tpl = this.$el.find('["node-type="upload_progress""]');
                    case 'ppt':
                        _tpl = this.$el.find('["node-type="upload_progress""]');
                }
                this.$maindom = $(_tpl);
                //调用公共方法
                if (!!this.options.autostart) {
                    ttapp.figureUtil.insertFigure(this.options.target, this.options.editor, this.$maindom);
                    this.figureSetup(file);
                }
                this.currentFile = file;
            } else if (this.state == "commodity") {
                if (!!this.max_commodity()) return;
                var _figure = { 'fid': file.id, 'pname': this.randomChar(4), 'hasrogress': true, 'ftype': file.type };
                var _tpl = $("#comphotoTemplate").tmpl(_figure);
                $("#" + this.options.btnup).before($(_tpl));
                setTimeout(function () {
                    if (!!that.max_commodity()) {
                        $("#" + that.options.btnup).hide();
                    }
                }, 100);
            } else if (this.state == 'whiteboard') {

            }
            else {
                // this.$maindom.removeClass('no-image has-image').addClass('uploading-image');
                // this.$figurepic = this.$maindom.find('[node-type="upload-img"]');
                // this.$preview = this.$maindom.find('[node-type="preview-img"]');
                // this.$pgdel = this.$maindom.find('[node-type="pg-abort"]');
                // this.$pgbar = this.$maindom.find('[node-type="pg-bar"]');
                // this.$pgnum = this.$maindom.find('[node-type="pg-percent"]');
            }
            this.$el.trigger('medium.uploader.disabled');
        },

        max_commodity: function () {
            if (!!this.options.target && this.options.target.length > 0) {
                if (this.options.target.find('span[node-type="post-figure"]').length > 7)
                    return true;
            }
            return false;
        },

        curr_item: function (id) {
            var _item = $('#' + id);
            return {
                item: _item,
                figurepic: _item.find('[node-type="upload-img"]'),
                mask: _item.find('[node-type="addImg-cover"]'),
                description: _item.find('[node-type="placeHolder-figureDesc"]'),
                figureaudio: _item.find('[data-audio]'),
                figuregif: _item.find('[data-gif="player"]'),
                loading: _item.find('[node-type="loading-img"]'),
                pgdel: _item.find('[node-type="pg-abort"]'),
                preview: _item.find('[node-type="preview-img"]'),
                pgbar: _item.find('[node-type="pg-bar"]'),
                pgnum: _item.find('[node-type="pg-percent"]')
            }
        },

        /**
         * 正文 dom 主变量初始化
         * @param file
         */
        figureSetup: function (file) {
            var _figure = this.curr_item(file.id);
            _figure.item.removeClass('no-image').addClass('uploading-image');
            if (this.state != 'addsongmp3') {
                if (file.type != "image/gif") {
                    this.imageLoad(file);
                }
                else {
                    _figure.description.mediumeditor();
                }
            }
            else {
                _figure.description.mediumeditor();
            }
        },
        updateList: function (up, files) {
            var inputCount = 0, inputHTML;
            var _target = this.options.target;
            //queue_init
            if (!!this.options.uploding_disabledbrowse) {
                up.disableBrowse();
            }
            //增加files处理,就可以处理批量
            $.each(files, $.proxy(function (i, file) {
                this.queue_init(up, file, i);
                // if (file.status == plupload.DONE) {
                //  if (file.target_name) {
                //      console.log('target_name=',plupload.xmlEncode(file.target_name));
                //  }
                //  console.log('file.name=',plupload.xmlEncode(file.name));
                //  console.log('file.status=',(file.status == plupload.DONE ? 'done' : 'failed'));

                //  inputCount++;

                //  console.log('inputCount',inputCount);
                // }
                // else{
                //  console.log(up,this,222);
                // }
            }, this));
            // if (this.options.state!='panelvideo' && this.options.state!='panellocalvideo'){}
            if (this.isFigure()) {

                if (!!_target && _target.text().replace(/^\s+|\s+$/g, '') === '') {
                    if (!ttapp.figureUtil.isLastParagraph(_target)) {
                        _target.remove();
                    }
                }

                ttapp.figureUtil.insertLastEmpty();
            }

        },
        isFigure: function () {
            var state = this.state;
            return state == 'figureimg' || state == "toolinsertimg" || state == 'addsongmp3';
            //|| state=='figurevideo' 交由具体组件处理
        },
        handleStatus: function (file) {
            var actionClass;

            if (file.status == plupload.DONE) {
                actionClass = 'plupload_done';
            }

            if (file.status == plupload.FAILED) {
                actionClass = 'plupload_failed';
            }

            if (file.status == plupload.QUEUED) {
                actionClass = 'plupload_delete';
            }

            if (file.status == plupload.UPLOADING) {
                actionClass = 'plupload_uploading';
            }

            var icon = $('#' + file.id).attr('class', actionClass).find('a').css('display', 'block');
            if (file.hint) {
                icon.attr('title', file.hint);
            }
        },
        /*
         * 判断图片类型
         *
         * @param ths
         *          type="file"的javascript对象
         * @return true-符合要求,false-不符合
         */
        checkImgType: function (ths) {
            if (ths.value == "") {
                ttapp.messageBox_tip("请上传图片");
                return false;
            } else {
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ths.value)) {
                    ttapp.messageBox_tip("图片类型必须是.gif,jpeg,jpg,png中的一种");
                    ths.value = "";
                    return false;
                }
            }
            return true;
        },
        destroy: function () {
            this.uploader.destroy();
        },
        events: {
            'click #newpostform [node-type="remove-titleImg"]': 'removecover',
            'click #compics-box [node-type="pg-abort"]': 'removecover'
            // 'click #newpostform [node-type="remove-postImage"]' : 'removefigure',
            // '' : '',
            // '' : '',
            // '' : '',
            // '' : '',
            // '' : '',
            // '' : ''
        },
        removecover: function (evt) {
            var that = this;
            that.up_del($(evt.target), true);
            window.setTimeout(function () {
                that.$el.trigger('medium.uploader.enableed');
                that.uploader.disableBrowse(false);
            }, 5);
            evt.preventDefault();
            that.$el.trigger('medium.uploader.change');
        },
        removefigure: function (evt) {
            var that = this;
            that.contentpic_del($(evt.target), true);
            if (this.options.editor) {
                this.options.editor.hideFigurePlus();
            }
            window.setTimeout(function () {
                that.$el.trigger('medium.uploader.enableed');
                that.uploader.disableBrowse(false);
            }, 5);
            evt.preventDefault();
            //alert('picdel');
            that.$el.trigger('medium.uploader.change');
        },

        /**
         * 获取图片Url
         */
        getImageUrl: function (rid, w, h, cut) {
            if (!!this.options.cgif && !!this.isgif) {
                rid = rid + '!cgif'
            }
            return medium.Util.getImageUrl(rid, w, h, cut);
        },
        randomChar: function (l) {
            return medium.Util.randomChar(l);
        },
        isWeiXin: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }

    };

    //自定义jQuery组件
    $.fn.mediumupload = function (option) {

        return this.each(function (input_field) {
            var $this = $(this)
                , data = $this.data('mediumupload')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('mediumupload', (data = new mediumUpload(this, options)))
            }
            else {
                data['reset'](options);
            }
            if (typeof option == 'string') data[option]();
        });
    };
    $.fn.mediumupload.defaults = {
        cgif: true, multi_selection: false, mp3upyun: true,
        autostart: true, max_file_size: '20mb',
        uploding_disabledbrowse: false,//上传中禁止使用上传
        file_size_error: '上传失败，原因：文件不能超过20MB',
        file_extension_error: '上传失败，原因：扩展名错误。'
    };
})(window.jQuery);

