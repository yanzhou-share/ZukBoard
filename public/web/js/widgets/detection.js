/**
 * Created by mashuo on 2017/3/17.
 */
(function ($) {
    var Detection = function (element, options) {
        this.$el = $(element);
        this.options = options;
        this._init();
        this._addEvents();
        this._addSocket();
        this._testSpeed();
    };

    Detection.prototype = {
        _init: function () {
            var that = this;
            this.init = true;
            this.systemPass = false;
            this.cameraPass = false;
            this.headphonePass = false;
            this.micPass = false;
            this.store = new Store();

            this.$setup1 = this.$el.find('[node-type="setup1-box"]');
            this.$browser = this.$el.find('[node-type="browser_type"]');
            this.$system = this.$el.find('[node-type="system_type"]');
            this.$passSetup1 = this.$el.find('[action-type="pass_setup1"]');
            this.$systemState  = this.$el.find('[node-type="system-state"]');

            this.$setup2 = this.$el.find('[node-type="setup2-box"]');
            this.$cameraList = this.$el.find('[node-type="camera_list"]');
            this.$videoCamera = this.$el.find('[node-type="video_camera"]');
            this.$passSetup2 = this.$el.find('[action-type="pass_setup2"]');
            this.$nopassSetup2 = this.$el.find('[action-type="nopass_setup2"]');
            this.$cameraState  = this.$el.find('[node-type="camera-state"]');

            this.$setup3 = this.$el.find('[node-type="setup3-box"]');
            this.$headphoneList = this.$el.find('[node-type="headphone_list"]');
            this.$audioPlay = this.$el.find('[action-type="btn_audio_play"]');
            this.$passSetup3 = this.$el.find('[action-type="pass_setup3"]');
            this.$nopassSetup3 = this.$el.find('[action-type="nopass_setup3"]');
            this.$headphoneState  = this.$el.find('[node-type="headphone-state"]');

            this.$setup4 = this.$el.find('[node-type="setup4-box"]');
            this.$micList = this.$el.find('[node-type="mic_list"]');
            this.audio_show = this.$el.find('[node-type="audio_show"]')[0];
            this.$passSetup4 = this.$el.find('[action-type="pass_setup4"]');
            this.$nopassSetup4 = this.$el.find('[action-type="nopass_setup4"]');
            this.$micState  = this.$el.find('[node-type="mic-state"]');

            this.$download = this.$el.find('[node-type="download-text"]');
            this.$upload = this.$el.find('[node-type="upload-text"]');
            this.$delayBox = this.$el.find('[node-type="delay-box"]');
            this.$networkBox = this.$el.find('[node-type="network-box"]');

            this.$delayText = this.$el.find('[node-type="delay-text"]');
            this.$networkText = this.$el.find('[node-type="network-text"]');

            this.hash=(!window.location.hash) ? "" : window.location.hash;
            window.location.hash=this.hash;

            this.currentCameraId = 'default';
            this.currentMicId = '';
            this.currentSinkId = '';
            this.stream = null;
            this.audioCtx = null;

            this.audioPlayer = new AudioPlayer('audio_canvas');

            this.socket = io.connect(detectionUrl);
            this.allStartTime = 0;
            this.recentCurrentCount = 0;
            this.recentMaxCount = 0;
            this.maxSize = 0;
            this.dataTransferSize = 10;
            this.chunkSize = 128 * 1024;
            this.delayInterval = null;
            this.delay_arr = [];
            this.upload_arr = [];
            this.download_arr = [];
            this.upload_speed = 0;
            this.download_speed = 0;
            this.avgDelay = 0;

            this._initHash();
        },

        _initHash : function () {
            if(this.hash==""){
                this.setup1();
            } else if(this.hash=="#2"){
                this.setup2();
            } else if(this.hash=="#3"){
                this.setup3();
            } else if(this.hash=="#4"){
                this.setup4();
            } else{
                this.hash="";
                window.location.hash = this.hash;
            }
        },

        setup1 : function () {
            var browser = this._testBrowser();
            this.$browser.text(browser.browser + browser.version);
            if(!(browser.browser.indexOf("Chrome") > -1 && browser.version > 50)){
                //浏览器不合格
                Model.MsgBox("浏览器不支持，请下载Chrome内核浏览器");
                this.$browser.addClass("td-warning");
            }
            var os = this._testOS();
            this.$system.text(os);
            if(os == "Windows2000" || os == "WindowsXP"){
                Model.MsgBox("系统版本太低");
                this.$system.addClass("td-danger");
            }
            this.$setup2.hide() && this.$setup3.hide() && this.$setup4.hide() && this.$setup1.show();
        },

        setup2 : function () {
            this._recoverMediaListAndCamera();
            this.$setup1.hide() && this.$setup3.hide() && this.$setup4.hide() && this.$setup2.show();
        },

        setup3 : function () {
            this._recoverMediaList();
            this.audioPlayer = new AudioPlayer('audio_canvas');
            this.$setup1.hide() && this.$setup2.hide() && this.$setup4.hide() && this.$setup3.show();
        },

        setup4 : function () {
            this._recoverMediaListAndMicroPhone();
            this.$setup1.hide() && this.$setup2.hide() && this.$setup3.hide() && this.$setup4.show();
        },

        _addEvents: function () {
            var that = this;
            this.$cameraList.on("change", $.proxy(this.cameraChange, this));
            this.$headphoneList.on("change", $.proxy(this.headphoneChange, this));
            this.$micList.on("change", $.proxy(this.micChange, this));
            this.$audioPlay.on("click", $.proxy(this.audioPlay, this));

            this.$passSetup1.on("click", $.proxy(this.passSetup1, this));
            this.$passSetup2.on("click", $.proxy(this.passSetup2, this));
            this.$passSetup3.on("click", $.proxy(this.passSetup3, this));
            this.$passSetup4.on("click", $.proxy(this.passSetup4, this));

            this.$nopassSetup2.on("click", $.proxy(this.nopassSetup2, this));
            this.$nopassSetup3.on("click", $.proxy(this.nopassSetup3, this));
            this.$nopassSetup4.on("click", $.proxy(this.nopassSetup4, this));

            //hash路径判断校验
            window.onhashchange = function(){
                that.hash = window.location.hash;
                if(that.hash==""){
                    that.setup1();
                } else if(that.hash=="#2"){
                    that.setup2();
                } else if(that.hash=="#3"){
                    that.setup3();
                } else if(that.hash=="#4"){
                    that.setup4();
                }
            };
        },

        passSetup1 : function () {
            this.systemPass = true;
            this.$systemState.removeClass("fail").addClass("success");
            window.location.hash = "2";
        },

        passSetup2 : function () {
            //摄像头检测通过
            this.cameraPass = true;
            this.$cameraState.removeClass("fail").addClass("success");
            window.location.hash = "3";
        },

        nopassSetup2 : function () {
            //摄像头检测未通过
            this.cameraPass = false;
            this.$cameraState.removeClass("success").addClass("fail");
            window.location.hash = "3";
        },

        passSetup3 : function () {
            //耳机检测通过
            this.headphonePass = true;
            this.$headphoneState.removeClass("fail").addClass("success");
            this.audioPause();
            window.location.hash = "4";
        },

        nopassSetup3 : function () {
            //耳机检测未通过
            this.headphonePass = false;
            this.$headphoneState.removeClass("success").addClass("fail");
            this.audioPause();
            window.location.hash = "4";
        },

        passSetup4 : function () {
            this.micPass = true;
            this.$micState.removeClass("fail").addClass("success");
            this._hungUp();
            this.tip_master();
        },

        nopassSetup4 : function () {
            //todo
            this.micPass = false;
            this.$micState.removeClass("success").addClass("fail");
            this._hungUp();
            this.tip_master();
        },

        tip_master : function () {
            var that = this;
            Model.CheckBox({systemPass: this.systemPass, cameraPass: this.cameraPass, headphonePass: this.headphonePass, micPass: this.micPass}, function (data) {
                //todo 进入教室
                that.resetSetup();
            });
        },

        resetSetup : function () {
            this.systemPass = false;
            this.$systemState.removeClass("success").removeClass();
            this.cameraPass = false;
            this.$cameraState.removeClass("success").removeClass();
            this.headphonePass = false;
            this.$headphoneState.removeClass("success").removeClass();
            this.micPass = false;
            this.$micState.removeClass("success").removeClass();
            window.location.replace("/page/web/classfront/device-test.html");
        },

        cameraChange : function () {
            //切换摄像头设备
            this.currentCameraId = this.$cameraList.val();
            this._getUserMedia(null,this.currentCameraId);
            this._storeCurrDevices();
            this._refreshMediaList();
        },

        headphoneChange : function () {
            //切换耳机设备
            this.currentSinkId = this.$headphoneList.val();
            this.audioPlayer.setSinkId(this.currentSinkId);
            this._storeCurrDevices();
            this._refreshMediaList();
        },

        micChange : function () {
            //切换麦克风设备
            this.currentMicId = this.$micList.val();
            this._getUserMedia(this.currentMicId,null);
            this._storeCurrDevices();
            this._refreshMediaList();
        },

        audioPlay : function () {
            this.audioPlayer && this.audioPlayer.play();
        },

        audioPause : function () {
            this.audioPlayer && this.audioPlayer.pause();
        },

        audioStop : function () {
            this.audioPlayer && this.audioPlayer.stop();
        },

        _addSocket : function () {
            var that = this;
            this.socket.on("delay", function (stime) {
                if(that.upload_speed > 0 && that.download_speed > 0){
                    clearInterval(that.delayInterval);
                    //that.avgDelay = that.average(that.delay_arr);
                    // delayTime.innerText = avgDelay;
                    that.socket.emit("delayEnd");
                    console.log("平均延时："+that.avgDelay);
                }else{
                    that.delay_arr.push(Date.now() - stime);
                }
            });

            this.socket.on('MoreData', function (data) {
                //if is the first loop
                if (data['Transferred'] == 0) {
                    that.chunkSize = data['ChunkSize'];
                    //current packet speed is calculated on 1 mb transfer
                    that.recentMaxCount = 1048576 / that.chunkSize;
                }
                that.updateUploadStats(data['Transferred'], data['ChunkSize'], "upload");
                //set chunk size in kb
                var chunkSize = data['ChunkSize'];
                if (chunkSize <= 0) chunkSize = 128;

                var chunk = that.prepareDataToUpload(chunkSize);
                that.socket.emit('Upload', {'Data': chunk, 'Size': that.dataTransferSize});
            });

            this.socket.on('MoreDataToDownload', function (data) {
                //if is the first loop
                if (data['Transferred'] == 0) {
                    that.chunkSize = data['ChunkSize'];
                    //current packet speed is calculated on 1 mb transfer
                    that.recentMaxCount = 1048576 / that.chunkSize;
                }else {
                    var chunk = data['Data'].length;
                }
                that.updateUploadStats(data['Transferred'], data['ChunkSize'], "download");
                that.socket.emit('Download', {'Data': chunk, 'Size': that.dataTransferSize});
            });

            this.socket.on('Done', function (data) {
                // reached.style.width = '100%';
                // reached.innerText = Math.round(100) + '%';
                var now = (new Date()).getTime();
                //sTotalTime.innerText = Math.round((now - allStartTime) / 1000);
                //sTransferredData.innerText = (data['Ope']=='D'? 'download size: ':'upload size: ') + dataTransferSize + ' MB';
                if(data.type == "delay"){
                    that.avgDelay = that.average(that.delay_arr);
                    that.$delayText.text(that.avgDelay+"ms");
                    that.getMos();
                }else if(data.type == "download"){
                    that.download_speed = that.average(that.download_arr);
                    that.$download.text(that.download_speed+"kb/s");
                    that.startUpload();
                }else if(data.type == "upload"){
                    that.upload_speed = that.average(that.upload_arr);
                    that.$upload.text(that.upload_speed+"kb/s");
                }
                console.log("上传速度："+ that.upload_speed, "下载速度：" + that.download_speed, "延时："+ that.avgDelay);
            });
        },

        getMos : function () {
            // var delayHtml = [];
            //     delayHtml.push('<div class="progress thin progress-striped">');
            //     delayHtml.push('<div node-type="delay-box" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">');
            //     delayHtml.push('<span class="sr-only">45% Complete (success)</span>');
            //     delayHtml.push('</div></div>');
            // this.$delayText.empty().html(delayHtml.join(""));
            //this.$delayBox = this.$delayText.find('[node-type="delay-box"]');

            //var networkHtml = [];
            // networkHtml.push('<div class="progress thin progress-striped">');
            // networkHtml.push('<div node-type="network-box" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">');
            // networkHtml.push('<span class="sr-only">45% Complete (success)</span>');
            // networkHtml.push('</div></div>');
            //this.$networkText.empty().html(networkHtml.join(""));
            //this.$networkBox = this.$networkText.find('[node-type="network-box"]');

            // if(that.avgDelay <= 50){
            //     this.$delayBox.addClass("progress-bar-success");
            // }else if(that.avgDelay > 50 && that.avgDelay < 200){
            //     this.$delayBox.addClass("progress-bar-warning");
            // }else{
            //     this.$delayBox.addClass("progress-bar-danger");
            // }

            if(that.avgDelay < 100 && that.download_speed > 250 && that.upload_speed > 250){
                this.$networkText.text("网络状态良好").removeClass().addClass("td-success");
                //this.$networkBox.addClass("progress-bar-success");
            }else if(that.avgDelay > 100 && that.avgDelay < 200 && that.download_speed > 100  && that.upload_speed > 100){
                this.$networkText.text("网络状态一般").removeClass().addClass("td-warning");
                //this.$networkBox.addClass("progress-bar-warning");
            }else{
                this.$networkText.text("网络状态较差").removeClass().addClass("td-danger");
                //this.$networkBox.addClass("progress-bar-danger");
            }
        },

        _testSpeed : function () {
            this.startDownload();
            // this.startUpload();
            this.startPing();
        },

        startUpload : function (){
            this.dataTransferSize = 10;
            if (this.dataTransferSize != '' && !isNaN(this.dataTransferSize) && this.dataTransferSize > 0) {
                this.reset();
                this.socket.emit('StartUpload', {'Size': this.maxSize});
            }
            else {
                Model.MsgBox("Please select a valid upload size");
            }
        },

        startPing : function (){
            this.delay_arr = [], that = this;
            this.delayInterval = setInterval(function () {
                that.socket.emit("delay", Date.now());
            }, 100);
        },

        startDownload : function (){
            if (this.dataTransferSize != '' && !isNaN(this.dataTransferSize) && this.dataTransferSize > 0) {
                this.reset();
                this.socket.emit('StartDownload', {'Size': this.maxSize});
            }
            else {
                Model.MsgBox("Please select a valid download size");
            }
        },

        reset : function (){
            this.maxSize = this.dataTransferSize * 1048576;
            this.allStartTime = (new Date()).getTime();
            this.recentCurrentCount = 0;
        },

        //prepare packet to upload
        prepareDataToUpload : function () {
            var chunk = '';
            while (chunk.length < this.chunkSize) {
                chunk += 'x';
            }
            //console.log('chunk size', chunk.length);
            return chunk;
        },

        //upload stats
        updateUploadStats : function (transferred, chunkSize, type) {
            var now = (new Date()).getTime();
            var base;
            base = (transferred / 1024) / ((now - this.allStartTime ) / 1000) / 8;
            //console.log('Transferred: ', transferred, 'Time: ', (now - allStartTime), now, allStartTime, 'Base: ', base)
            // var q1 = Math.round(base);
            // var q2 = Math.round((base * 8) / 100) / 10;
            // var q3 = Math.round((base * 60) / 1024);

            type == "upload" && (this.upload_arr.push(Math.round(base)));

            type == "download" && (this.download_arr.push(Math.round(base)));

            //type == "upload" && (sAvgRateSec.innerText = Math.round(base));
            //type == "upload" && (sAvgRateBit.innerText = Math.round((base * 8) / 100) / 10);
            //type == "upload" && (sAvgRateMin.innerText = Math.round((base * 60) / 1024));
            // var percent = 100 * transferred / (maxSize);
            // reached.style.backgroundColor = 'lime';
            // reached.style.width = percent + '%';
            // reached.innerText = Math.round(percent) + '%';

            //type == "download" && (document.getElementById("down_sAvgRateSec").innerText = Math.round(base));
            //type == "download" && (document.getElementById("down_sAvgRateMin").innerText = Math.round((base * 60) / 1024));
            //type == "download" && (document.getElementById("down_sAvgRateBit").innerText = Math.round((base * 8) / 100) / 10);

            // this.recentTransferred += chunkSize;
            this.recentCurrentCount++;
        },

        /**
         * 求平均值
         * @param values
         * @returns {number}
         */
        average : function(values){
            var sumValues = values.reduce(function (sum, value) {
                return sum + value;
            }, 0);
            return Math.round(sumValues / values.length);
        },

        _recoverMediaList : function () {
            var that = this;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                Tool.checkDevice(function (results) {
                    if (results.hasSpeakers) {
                        that.$headphoneList.html("");
                        results.audioOutputDevices.forEach(function (audioOutputDevice) {
                            that._addItemToSelect(that.$headphoneList, audioOutputDevice.label, audioOutputDevice.deviceId);
                            that.$headphoneList.val(audioOutputDevice.deviceId);
                            that.currentSinkId=audioOutputDevice.deviceId;
                        });
                    }
                    that._hungUp();
                });
            } else {
                console.log("getUserMedia id not supported");
            }
        },

        _recoverMediaListAndCamera : function () {
            var that = this;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                Tool.checkDevice(function (results) {
                    if (results.hasWebcam) {
                        that.$cameraList.html("");
                        results.videoInputDevices.forEach(function (videoInputDevice) {
                            that._addItemToSelect(that.$cameraList, videoInputDevice.label, videoInputDevice.deviceId);
                            that.$cameraList.val(videoInputDevice.deviceId);
                            that.currentCameraId = videoInputDevice.deviceId;
                        });
                    }
                    //that._hungUp();
                    that._getUserMedia(null,that.currentCameraId);
                });
            } else {
                console.log("getUserMedia id not supported");
            }
        },

        _recoverMediaListAndMicroPhone : function () {
            var that = this;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                Tool.checkDevice(function (results) {
                    if (results.hasMicrophone) {
                        that.$micList.html("");
                        results.audioInputDevices.forEach(function (audioInputDevice) {
                            that._addItemToSelect(that.$micList, audioInputDevice.label, audioInputDevice.deviceId);
                            that.$micList.val(audioInputDevice.deviceId);
                            that.currentMicId=audioInputDevice.deviceId;
                        });
                    }
                    that._hungUp();
                    that._getUserMedia(that.currentMicId,null);
                });
            } else {
                console.log("getUserMedia id not supported");
            }
        },

        //加入一个Item
        _addItemToSelect: function (objSelect, objItemText, objItemValue) {
            var varItem = new Option(objItemText, objItemValue);
            objSelect.append(varItem);
        },

        //检测操作系统
        _testOS: function () {
            var os = navigator.platform;
            var userAgent = navigator.userAgent;
            var info = "";
            var tempArray = "";
            if (os.indexOf("Win") > -1) {
                if (userAgent.indexOf("Windows NT 5.0") > -1) {
                    info += "Windows2000";
                } else if (userAgent.indexOf("Windows NT 5.1") > -1) {
                    info += "WindowsXP";
                } else if (userAgent.indexOf("Windows NT 5.2") > -1) {
                    info += "Windows2003";
                } else if (userAgent.indexOf("Windows NT 6.0") > -1) {
                    info += "WindowsVista";
                } else if (userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1) {
                    info += "Windows7";
                } else if (userAgent.indexOf("Windows NT 8.0") > -1 || userAgent.indexOf("Windows 8") > -1) {
                    info += "Windows8";
                } else if (userAgent.indexOf("Windows NT 10.0") > -1) {
                    info += "Windows10";
                } else {
                    info += "Other";
                }
            } else if (os.indexOf("Mac") > -1) {
                info += "Mac";
            } else if (os.indexOf("X11") > -1) {
                info += "Unix";
            } else if (os.indexOf("Linux") > -1) {
                info += "Linux";
            } else {
                info += "Other";
            }
            return info;
        },

        //检测浏览器
        _testBrowser : function () {
            return Tool.checkRtcBrower();
        },


        _getUserMedia : function(audioDeviceId,videoDeviceId){
            var that=this;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                if(!audioDeviceId && !videoDeviceId){
                    Model.MsgBox("没有检测到相关设备");
                    return;
                }
                navigator.getUserMedia({audio:!!audioDeviceId?{deviceId:audioDeviceId}:false, video:!!videoDeviceId?{deviceId:videoDeviceId}:false},
                    function (stream) {
                        that.stream = stream;
                        !!audioDeviceId && that._visualize();
                        that.$videoCamera.attr("src", window.URL.createObjectURL(stream));
                    },
                    function (err) {
                        console.log("The following error occurred: " + err.name);
                        !!bughd && bughd("notifyException", JSON.stringify(error));
                    }
                );
            } else {
                console.log("getUserMedia id not supported");
            }
        },

        _visualize : function(){
            var WIDTH = this.audio_show.width;
            var HEIGHT = this.audio_show.height;
            if(this.audioCtx==null){
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)();
            }
            var analyser = this.audioCtx.createAnalyser();
            analyser.minDecibels = -90;
            analyser.maxDecibels = -10;
            analyser.smoothingTimeConstant = 0.85;

            var canvasCtx = this.audio_show.getContext("2d");

            var drawVisual;
            var source = this.audioCtx.createMediaStreamSource(this.stream);
            source.connect(analyser);
            analyser.connect(this.audioCtx.destination);

            analyser.fftSize = 256;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            function draw() {
                drawVisual = requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                canvasCtx.fillStyle = 'rgb(255, 255, 255)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                var barWidth = (WIDTH / bufferLength) * 2.5;
                var barHeight;
                var x = 0;

                for(var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];

                    //canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                    canvasCtx.fillStyle = '#57ad68';
                    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

                    x += barWidth + 1;
                }
            };

            draw();
        },

        _hungUp : function() {
            if(!!this.stream){
                this.stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
        },

        _getCurrDevices:function(){
            this.currentCameraId=this.store.getSessionStorage("video_deviceId");
            this.currentMicId=this.store.getSessionStorage("mic_deviceId");
            this.currentSinkId=this.store.getSessionStorage("speaker_deviceId");
        },

        _storeCurrDevices:function(){
            this.store.setSessionStorage("video_deviceId",this.currentCameraId);
            this.store.setSessionStorage("mic_deviceId",this.currentMicId);
            this.store.setSessionStorage("speaker_deviceId",this.currentSinkId);
        },

        _refreshMediaList : function(){
            var that=this;
            Tool.checkDevice(function (results) {
                that.$cameraList.empty();
                that.$headphoneList.empty();
                that.$micList.empty();
                if (results.hasWebcam) {
                    results.videoInputDevices.forEach(function (videoInputDevice) {
                        that._addItemToSelect(that.$cameraList, videoInputDevice.label, videoInputDevice.deviceId);
                    });
                }

                if (results.hasMicrophone) {
                    results.audioInputDevices.forEach(function (audioInputDevice) {
                            that._addItemToSelect(that.$micList, audioInputDevice.label, audioInputDevice.deviceId);

                    });
                }

                if (results.hasSpeakers) {
                    results.audioOutputDevices.forEach(function (audioOutputDevice) {
                            that._addItemToSelect(that.$headphoneList, audioOutputDevice.label, audioOutputDevice.deviceId);

                    });
                }

                that.$cameraList.val(that.currentCameraId);
                that.$micList.val(that.currentMicId);
                that.$headphoneList.val(that.currentSinkId);
            });
        }
    };

    $.fn.detection = function (option) {
        var ob = "";
        this.each(function () {
            var $this = $(this),
                data = $this.data("detection"),
                options = typeof option == "object" && option;
            if (!data) {
                $this.data("detection", (data = new Detection(this, options)));
            } else {
                data.reset(options);
            }
            if (typeof option == 'string') data[option]();
            ob = data;
        });
        return ob;
    };

    $('[node-type="device_box"]').detection();

})(window.jQuery);
