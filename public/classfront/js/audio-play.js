//�жϲ����Ƿ�ΪdocumentId����Ⱦ����
// 1. �вΣ���Ⱦ
// 2. �޲Σ�����Ⱦ
// 3. �вε����ǻ���������Ⱦ
var AudioPlayer = function (canvas) {
    this.audio=document.createElement("AUDIO");
    this.audio.src="/livepage/web/classfront/music/test.mp3";
    this.events = {};
    this.hasCanvas=false;
    this.autoCycle=false;
    this.audioContext = null;
    this.source = null; //the audio source
    this.analys=null;
    this.animationId = null;
    this.buffer=null;
    this.status = 0; //flag for sound is playing 1 or stopped 0
    this.xhr=new window.XMLHttpRequest();
    this.path='/livepage/web/classfront/music/test.mp3';
    if(typeof document.getElementById(canvas) !=="undefined" && document.getElementById(canvas) !==null){
        if(document.getElementById(canvas).nodeName==="CANVAS"){
            this.hasCanvas=true;
            this.canvas=document.getElementById(canvas);
        }
    }
    this._prepareAPI();
    this._prepareBuffer();
};

AudioPlayer.prototype = {
    on : function (eventName, callback) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(callback);
    },

    emit : function (eventName, _) {
        var events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].apply(null, args);
        }
    },

    _prepareAPI: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            if(this.audioContext==null){
                this.audioContext = new AudioContext();
            }
        } catch (e) {
            console.log(e);
        }
    },

    _prepareBuffer: function () {
        var that=this;
        if (that.audioContext === null) {
            return;
        }
        that.xhr.abort();
        that.xhr.open("GET", that.path, true);
        that.xhr.responseType = "arraybuffer";
        that.xhr.withCredentials=true;
        //�趨��ȡ�ɹ�ʱ�Ķ���
        that.xhr.onload = function () {
            that.audioContext.decodeAudioData(that.xhr.response,function(buffer){
                that.buffer=buffer;
            });
        };
        that.xhr.send();
    },
    _visualize: function (audioContext, buffer) {
        var that =this;
        var audioBufferSouceNode = audioContext.createBufferSource(),
            analyser = audioContext.createAnalyser();
        audioBufferSouceNode.connect(analyser);
        //analyser.connect(audioContext.destination);
        audioBufferSouceNode.buffer = buffer;
        audioBufferSouceNode.onended = that._audioEnd.bind(this);
        //stop the previous sound if any
        if (that.animationId !== null) {
            cancelAnimationFrame(that.animationId);
        }
        if (that.source !== null) {
            that.source.stop(0);
        }
        audioBufferSouceNode.start(0);
        that.status = 1;
        that.source = audioBufferSouceNode;
        that.analys =analyser;
    },
    _drawSpectrum: function (analyser) {
        var that = this,
            cwidth = that.canvas.width,
            cheight = that.canvas.height+85,
            meterWidth = 8, //width of the meters in the spectrum
            gap = 2, //gap between meters
            minline=that.canvas.height-gap;
            capHeight = 2,
            capStyle = '#fff',
            meterNum = cwidth / (meterWidth + gap), //count of the meters
            capYPositionArray = [], ////store the vertical position of hte caps for the preivous frame
            ctx = that.canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, that.canvas.height);
        gradient.addColorStop(1, '#57ad68');
        gradient.addColorStop(0, '#57ad68');
        var drawMeter = function () {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            if (that.status === 0) {
                ctx.clearRect(0, 0, cwidth, cheight+2);
                return;
            }
            var step = Math.round(array.length / meterNum); //sample limited data from the total array
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step];
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                }
                ctx.fillStyle = capStyle;
                ctx.fillRect(i * 10, cheight - capYPositionArray[i], meterWidth, capHeight);

                ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                if(cheight - value >= minline){
                    ctx.fillRect(i * 10, minline, meterWidth, gap); //the meter
                }else{
                    ctx.fillRect(i * 10, cheight - value, meterWidth, cheight); //the meter
                }

            }
            that.animationId = requestAnimationFrame(drawMeter);
        }
        this.animationId = requestAnimationFrame(drawMeter);
    },
    _audioEnd: function (){
        if(!this.audio.loop){
            this.emit("end");
            this.status = 0;
        }else{
            if(this.hasCanvas){
                this._visualize(this.audioContext,this.buffer);
                this._drawSpectrum(this.analys);
            }
        }
    },
    play:function(){
        if(this.status === 1){
            console.log("Already started.");
            return;
        }
        this.audio.src="/livepage/web/classfront/music/test.mp3";
        this.audio.play();
        this._visualize(this.audioContext,this.buffer);
        if(this.hasCanvas){
            this._drawSpectrum(this.analys);
        }
    },
    pause:function(){
        if(this.status == 1){
            this.source.disconnect(this.analys);
            this.source = null;
            this.analys =null;
            this.status = 0;
            this.audio.pause();
        }
    },
    setLoop:function(isLoop){
        this.audio.loop=isLoop;
    },
    setSinkId:function(deviceId){
        this.audio.setSinkId(deviceId);
    },
    getAudioObject:function(){
        return this.audio;
    }
}