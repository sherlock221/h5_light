/*
 * HTML5音乐播放器
 * sherlock
 * 2014 04/01 22:19
 * 2.0版本
 * 功能 : 进度＋－ 播放暂停 显示时间
 */
var LockAudio = function (audioId) {

    var $dom = $(audioId);

    this.media = $dom.find(".lockAudio-default")[0];

    //属性
    this.process = $dom.find(".lockAudio-progress");
    this.processComplete = $dom.find(".lockAudio-progress-complete");
    this.pauseTime = $dom.find("#pauseTime");
    this.timer = "";
    this.btn = $dom.find(".lockAudio-btn");
    this.info = $dom.find(".lockAudio-info");
    this.timeInfo = $dom.find(".lockAudio-timeInfo");
    this.result  = $("#lockAudio-debug");

    //开启调试模式(移动端)
    this.debug = false;

    //是否加载完毕
    this.isComplete = false;

    //快速引用
    var _audio = this;

    var billEvent = function () {

        //切换按钮事件
        _audio.btn.bind("click",function(){
            var $this = $(this);
            var status = $this.attr('status');
            _audio.toggleStatus(status);
            console.log("播放/暂停..." + _audio.media.endTime);
        });


        //进度条增加事件(快进)
        _audio.process.bind("click", function (e) {
            e.stopPropagation();
            console.log("进度增加...");

            //timer 未启动启动timer
            if(_audio.timer == ""){
               _audio.toggleStatus(LockAudio.STATUS.Running);
            }

            if(_audio.isComplete == false){
                //延迟显示
               _audio.toggleStatus(LockAudio.STATUS.Refresh);
            }

            //播放进度条的基准参数
            var $this = $(this);
            var Process = $this.offset();
            var ProcessStart = Process.left;
            var ProcessLength = $this.width();
            var CurrentProces = e.clientX - ProcessStart;

            _audio.durationProcessRange(CurrentProces / ProcessLength);
            _audio.processComplete.css("width", CurrentProces);

        });

        //进度条增加事件(快退)
        _audio.processComplete.bind("click", function (e) {
            e.stopPropagation();
            console.log("进度减少....");

            //播放进度条的基准参数
            var pces = _audio.process.offset();
            var ProcessStart = pces.left;
            var ProcessLength = pces.width;
            var CurrentProces = e.clientX - ProcessStart;
            _audio.durationProcessRange(CurrentProces / ProcessLength);
            _audio.processComplete.css("width", CurrentProces);

        });


    };


    //监听处理
    this.media.addEventListener("loadstart", function () {
        console.log("首次加载...." +"  ");
        _audio.result.append("首次加载....");

    });

    this.media.addEventListener("progress", function (e) {
       // _audio.info.demo("加载中....");
        _audio.result.append("process....");
    });


    this.media.addEventListener("stalled", function () {
        console.log("stalled....");
//        info.demo("stalled....");
    });

        this.media.addEventListener("suspend", function () {
        console.log("延迟下载....");
    });

    this.media.addEventListener("abort", function () {
        _audio.toggleStatus(LockAudio.STATUS.Error,"客户端终止下载");
        console.log("客户端主动终止下载....");
        _audio.result.append("客户端主动终止下载....");
    });


    this.media.addEventListener("error", function () {
        console.log("请求数据时遇到错误....");
//    info.demo("请求数据时遇到错误....");
        _audio.toggleStatus(LockAudio.STATUS.Error,"音频加载失败或不存在");
        _audio.result.append("音频加载失败或不存在....");
    });


    this.media.addEventListener("play", function () {
            console.log("play()和autoplay开始播放时触发....");
//        _audio.info.demo("播放中");
        _audio.result.append("播放中....");
    });

    this.media.addEventListener("updatestart", function () {
        console.log("updatestart...");
        _audio.info.html("updatestart");
        _audio.result.append("updatestart....");
    });

    this.media.addEventListener("canplaythrough", function () {
        console.log("歌曲缓冲完成....");
        _audio.result.append("歌曲缓冲完成....");
        _audio.isComplete = true;
        _audio.toggleStatus(LockAudio.STATUS.Running);
    });


    this.media.addEventListener("canplay", function () {
        console.log("缓冲可播....");
        _audio.result.append("缓冲可播....");

    });


    this.media.addEventListener("pause", function () {
        console.log("暂停....");
        _audio.info.html("暂停");
    });

    this.media.addEventListener("ended", function () {
        console.log("播放结束....");
        _audio.toggleStatus(LockAudio.STATUS.Stop,"歌曲结束");

    });

    //绑定
    billEvent();
    //初始化
   // this.toggleStatus(LockAudio.STATUS.Refresh);

};


/**
 * 音频状态值
 */
LockAudio.STATUS = {
    Play: "1",     //开始播放
    Pause: "2",     //暂停
    Running: "3", //继续
    Stop: "0", //停止
    Refresh : "4", // 加载中
    canPlay : "5", //可播
    Error: "-1" //出错
};


/**
 * 进度快进快退方法
 * @param rangeVal
 */
LockAudio.prototype.durationProcessRange = function (rangeVal) {
    var time = rangeVal * this.media.duration;
    this.media.currentTime = time;
    //this.media.pause();
//
};


/**
 * 播放
 */
LockAudio.prototype.play = function () {
    console.log("启动播放...");
    if(this.timer == ""){
        console.log("启动 timer...");
        this.toggleStatus(LockAudio.STATUS.Refresh);
        this.timeSpan();
    }
    this.keepOn();
};

/**
 * 暂停播放
 */
LockAudio.prototype.pause = function () {
    console.log("暂停...");
    this.pauseTime.val(this.media.currentTime);
    this.media.pause();
}


/**
 * 继续播放
 */
LockAudio.prototype.keepOn = function () {
    console.log("继续播放....");
    this.media.startTime = this.pauseTime.val();
    this.media.play();
}



/**
 * 定时扫描器
 */
LockAudio.prototype.timeSpan = function () {
    var audio = this.media;
    var _this = this;
    this.timer = setInterval(function () {
        var processYet = (audio.currentTime / audio.duration) * 100;
        _this.processComplete.css("width", processYet + "%");
        var currentTime = LockAudio.timeDispose(audio.currentTime);
        var timeAll = LockAudio.timeDispose(_this.timeAll());
       _this.timeInfo.html(currentTime + " | " + timeAll);
       // console.log(currentTime + " | " + timeAll);
    }, 1000);
}


/**
 * 秒数格式转换(类方法)
 * @param number 秒数
 * @returns {string}
 */
LockAudio.timeDispose = function (number) {
    var minute = parseInt(number / 60);

    var second = parseInt(number % 60);

    minute = minute >= 10 ? minute : "0" + minute;

    second = second >= 10 ? second : "0" + second;

    return minute + ":" + second;
};


//当前歌曲的总时间
LockAudio.prototype.timeAll = function () {
    return this.media.duration;
};


/**
 * 切换播放状态
 * @param status
 */
LockAudio.prototype.toggleStatus = function (status,message) {

    var $btn = $(this.btn);
    console.log("切换状态....");

    //停止播放
    if (status == LockAudio.STATUS.Stop) {
        $btn.removeClass("lockAudio-btn-pause").removeClass("lockAudio-btn-refresh").addClass("lockAudio-btn-play");
        //清空进度条
        clearInterval(this.timer);
        this.processComplete.width(0);
        this.info.html(message);
        this.timeInfo.html("00:00 | 00:00");
        this.timer = "";
        //下个状态
        status = LockAudio.STATUS.Running;
    }
    //继续播放
    else if (status == LockAudio.STATUS.Running) {
        $btn.removeClass("lockAudio-btn-play").removeClass("lockAudio-btn-refresh").addClass("lockAudio-btn-pause");
        this.play();
        this.isFirst = false;
        //状态－继续
        status = LockAudio.STATUS.Pause;
    }
    //暂停
    else if (status == LockAudio.STATUS.Pause) {
        $btn.removeClass("lockAudio-btn-refresh").removeClass("lockAudio-btn-pause").addClass("lockAudio-btn-play");
        this.pause();
        //状态－暂停
        status = LockAudio.STATUS.Running;
    }
    //缓冲中
    else if( status == LockAudio.STATUS.Refresh){

        $btn.removeClass("lockAudio-btn-play").removeClass("lockAudio-btn-pause").addClass("lockAudio-btn-refresh");
        //button disable
       // $btn.attr("disabled","disabled");
        status = LockAudio.STATUS.Refresh;

    }
    //出现错误
    else if (status == LockAudio.STATUS.Error) {
        $btn.removeClass("lockAudio-btn-play").addClass("lockAudio-btn-error");
        this.info.html(message);
        //状态－错误
        status = LockAudio.STATUS.Error;
    }

    $btn.attr('status', status);
};












