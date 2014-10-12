/**
 *  移动端 工具类
 * */
var util = function(){



    /** 获得当前屏幕宽高 **/
    var  getOffset = function(){
            return { width : document.body.offsetWidth, height : document.body.offsetHeight }
     };

    var getBF = function(){
        var ua = navigator.userAgent.toLowerCase();
        var scene = (ua.indexOf('micromessenger')) > -1 ? 'weixin' : ((/qq\/([\d\.]+)*/).test(ua) ? 'qq': 'web');
        return scene;
    };


    /**
     * transition 动画结束
     * @returns {*}
     */
    var transitionEnd = function() {
        var el = document.createElement('div');
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd otransitionend',
            'transition'       : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }
        return false;
    };

    /**
     * transition 动画结束
     * @returns {*}
     */
    var animationEnd = function(dom,callBack) {
        var el = document.createElement('div');
        var transEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'MozAnimation'    : 'animationend',
            'OAnimation'      : 'oAnimationEnd',
            'animation'       : 'animationend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                dom.addEventListener(transEndEventNames[name], callBack);
                break;
            }
        }
    };




    /**
     * transition 定时器
     * @returns {*}
     */
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {return setTimeout(callback, 1000 / 60); };


    /**
     * transition 取消定时器
     * @returns {*}
     */
    var cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(callback) {return clearTimeout(callback, 1000 / 60); };


    /**
     * 继承
     * @returns {*}
     */
    var extend = function(){
        var args = Array.prototype.slice.call(arguments, 0), attr;
        var o = args[0];
        var deep = false;
        if(typeof args[args.length - 1] == 'boolean'){
            deep = args[args.length - 1];
            args.pop();
        }
        for(var i = 1; i < args.length; i++){
            for(attr in args[i]) {
                if(deep && typeof args[i][attr] == 'object'){
                    o[attr] = {};
                    extend(o[attr], args[i][attr], true);
                }
                else
                    o[attr] = args[i][attr];
            }
        }
        return o;
    };


    var proxy = function(scope, fn){
        scope = scope || null;
        return function(){
            fn.apply(scope, arguments);
        }
    };

    var get = function(url, data, cb){
        var _createAjax = function() {
            var xhr = null;
            try {
                //IE系列浏览器
                xhr = new ActiveXObject("microsoft.xmlhttp");
            } catch (e1) {
                try {
                    //非IE浏览器
                    xhr = new XMLHttpRequest();
                } catch (e2) {
                    window.alert("您的浏览器不支持ajax，请更换！");
                }
            }
            return xhr;
        }
        var pram = '';
        if(typeof data == 'object'){
            for(var name in data){
                pram += '&' + name + '=' + data['name'];
            }
        }
        pram.replace(/^&/, '?');
        var xhr = _createAjax();
        if(!url) return;
        xhr.open('get', url + pram, true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                cb&&cb();
            }
        }
    }

    var addClass=function(elem,_class){
        var className=elem.className,classReg=new RegExp('(^'+_class+'\\s+)|(\\s+'+_class+'\\s+)|(\\s+'+_class+'$)|(^'+_class+'$)','g');
        if(!className){elem.className=_class;}
        else if(classReg.test(className)){return;}
        else {elem.className=className+' '+_class;}
    };
    var removeClass=function(elem,_class){
        var className=elem.className,classReg=new RegExp('(^'+_class+'\\s+)|(\\s+'+_class+'\\s+)|(\\s+'+_class+'$)|(^'+_class+'$)','g');
        className=className.replace(classReg,function(k,$1,$2,$3,$4){if($2)return ' ';else return '';});
        elem.className=className;
    };

    var get_transform_value=function(transform,key,index){
        //transform即transform的所有属性,key键名，index_arr按数组索引取value
        key=key.replace(/\-/g,'\\-');
        var index_list=[0];
        if(arguments.length>2){
            for(var i=2;i<arguments.length;++i){
                index_list[i-2]=arguments[i];
            }
        }
        if('none'==transform||''==transform){return null;}
        var reg=new RegExp(key+'\\(([^\\)]+)\\)','ig'),key_value=transform.match(reg),value_list=[],ret=[];
        if(key_value&&key_value.length>0){
            key_value=key_value[0];
            value_list=key_value.replace(reg,'$1').split(',');
            for(var i=0;i<index_list.length;++i){
                ret.push(value_list[index_list[i]]);
            }
        }
        if(ret.length==1){ret=ret[0];}
        else if(index){ret=ret[index];}
        return ret;
    };

    var noop = function(){};

    return{
        'getOffset' : getOffset,
        'noop' : noop,
        'transitionEnd' : transitionEnd,
        'animationEnd' : animationEnd,
        'RAF' : requestAnimationFrame,
        'cRAF' : cancelAnimationFrame,
        'extend' : extend,
        'proxy' : proxy,
        'getBF' : getBF,
        'get' : get,
        'addClass' : addClass,
        'removeClass' : removeClass,
        'getTransform' : get_transform_value
    }
}();

var Event = (function(){
    var _EventList = {};

    var bind = function( name, fn, scope){
        if(typeof scope == 'object'){
            if(!scope['event']){
                scope['event'] = {};
            }
            if(!scope['event'][name]){
                scope['event'][name] = [];
            }
            scope['event'][name].push(fn);
            return;
        }
        if(!_EventList[name]){
            _EventList[name] = [];
        }
        _EventList[name].push(fn);
    };

    var trigger = function(name, scope, args){
        var _list = _EventList[name];
        if(scope['event'] && scope['event'][name]){
            _list = scope['event'][name];
        }
        if(_list == undefined) return;
        for (var i = 0; i < _list.length; i++) {
            _list[i].call(scope,  args || {});
        }
    };

    return {
        bind:bind,
        trigger:trigger
    }

})();

var timer = {
    remainTime: function(y,mm,d,h,min,s){
        var endDate = new Date(y,mm - 1,d,h,min,s).getTime();
        var nowDate = new Date().getTime();
        var _leftTime = endDate - nowDate;
        if(_leftTime < 0){
            return {
                'hour' : 0,
                'min' : 0,
                'sec' : 0
            }
        }
        var hour = Math.floor(_leftTime/3600000);
        _leftTime = _leftTime%3600000;
        var min = Math.floor(_leftTime/60000);
        _leftTime = _leftTime%60000;
        var sec = Math.floor(_leftTime/1000);
        return {
            'hour' : hour,
            'min' : min,
            'sec' : sec
        }
    }
};

Function.prototype.delegate = function(scope){
    var that = this;
    return function(){
        that.apply(scope, arguments);
    };
};


var Scroller = function(selector, opts){
    if(!selector && typeof selector != 'string') return;
    var _s = selector;
    var _opts = opts || {};
    this.init(_s, _opts);
};

var _default_opts = {
    Scontainer : '.container',
    hScroll : false,
    vScroll : false,
    momentum : false,
    bounce : false,
    lockDirection : true,
    snap : true,
    nesting : false
};

Scroller.prototype = {
    init: function(s, opts){
        this.opts = util.extend({},_default_opts, opts);
        console.log(this.opts);
        var $el = document.querySelector(s + ' ' + this.opts.Scontainer);
        var $parent = document.querySelector(s);
        this._initUi($el, $parent);
        this._mixH = $parent.offsetHeight - $el.offsetHeight;
        this._mixW = $parent.offsetWidth - $el.offsetWidth;
        this.$el.style.webkitTransform = 'translate3D(0, 0, 0)';
        if(this.opts.hScroll){
            this.lock = 'lock_y';
        }
        if(this.opts.vScroll){
            this.lock = 'lock_x';
        }
        if(this.opts.hScroll && this.opts.vScroll){
            this.lock = undefined;
        }
        this.initEvent(opts);
    },

    _initUi: function($el, $parent){
        if(this.opts.snap){
            var _pageHeight = $parent.clientHeight;
            var _pageWidth = $parent.clientWidth;
            this._clientW = _pageWidth;
            this._clientH = _pageHeight;

            var li = $el.querySelectorAll('#'+$el.id+'>li');
            for (var i = 0, len = li.length; i < len; i++){
                li[i].style.width = this._clientW + 'px';
                li[i].style.height = this._clientH + 'px';
            };

            $el.style.height = $el.scrollHeight + 'px';
            $el.style.width = $el.scrollWidth + 'px';
        }else{
            $el.style.height = $el.scrollHeight + 'px';
            $el.style.width = $el.scrollWidth + 'px';
        }
        this.$el = $el;
        this.$parent = $parent;
        this.$li = li;
    },

    _touchstart : function(evt){
        if(this.drag) return;
        this.drag = true;
        target = evt.targetTouches[0];
        this._x = this._x || 0;
        this._y = this._y || 0;

        this.startX = target.pageX;
        this.startY = target.pageY;
        this.srartTime = new Date();

        this._clientX = target.pageX - this._x;
        this._clientY = target.pageY - this._y;
        this.$el.style.webkitTransitionDuration = '0ms';
        this.$el.addEventListener('touchmove', this.update.delegate(this));
        this.$el.addEventListener('touchend', this.clearEvent.delegate(this));
        //this.draw(); //鼠标点击开始
        evt.preventDefault();
        Event.trigger('scrollBefore', this, evt);
    },

    initEvent: function(opts){
        opts = opts || this.opts;
        this.fun = this._touchstart.delegate(this);
        this.$el.addEventListener('touchstart', this.fun);
        if(this.opts.momentum){
            this.$el.addEventListener( util.transitionEnd().end , function(e){
                this.$el.style.webkitTransitionDuration = '0ms';
                var curr_num = this.currNum;
                var num = curr_num ? -1 * curr_num : '0';
                Event.trigger('scrollEnd', this, num);
            }.delegate(this), false);
        }
        if(opts.scrollEnd){
            Event.bind('scrollBefore', opts.scrollBefore || util.noop, this);
        }
        if(opts.scrollEnd){
            Event.bind('scrollEnd', opts.scrollEnd || util.noop, this);
        }
        if(opts.onScroll){
            Event.bind('onScroll', opts.onScroll || util.noop, this);
        }
        if(opts.onTouchEnd){
            Event.bind('onTouchEnd', opts.onTouchEnd || util.noop, this);
        }
    },

    scrollTo:function(options){
        this._x = options.x || this._x;
        this._y = options.y || this._y;
        this._x = this._x || 0;
        this._y = this._y || 0;
        if(this.opts.snap){
            if(options.y > 0 || options.x > 0){
                var math = Math.ceil;
            }else{
                var math = Math.floor;
            }
            var curr_num = math( this._y / this._clientH );
            this._x = math( this._x / this._clientW ) * this._clientW;
            this._y = curr_num * this._clientH;
        }
        this.$el.style.webkitTransform = 'translate3d('+ this._x +'px, ' + this._y + 'px, 0px)';
        this.$el.style.webkitTransitionDuration = '300ms';
        var me = this;
        this.currNum = curr_num || 0;
        Event.trigger('onTouchEnd', this, {'x':this._x, 'y':this._y} );
    },
    reset: function(){
        this.$el.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
        this._x = 0;
        this._y = 0;
    },
    draw: function(){
        //没位移就不渲染
        if (!this._shouldMoved) {
            rAF = RAF(this.draw.delegate(this));
            return;
        }
        this.$el.style.webkitTransform = 'translate3D(' + this._x + 'px, ' + this._y + 'px, 0)';

        this._shouldMoved = false;
        rAF = RAF(this.draw.delegate(this));
    },
    clearEvent: function(evt){
        if(!this.drag) return;
        this.drag = false;
        this.$el.removeEventListener("touchmove", this.update, false);
        this.$el.removeEventListener("touchend", this.clearEvent, false);
        //cancelRAF(rAF);
        var target = evt.changedTouches[0];
        var endX = target.pageX;
        var endY = target.pageY;

        var _x = this._x,_y = this._y, _dis;
        if(undefined == this.lock || 'lock_x' == this.lock){
            var direction_y = endY - this.startY < 0 ? -1 : 1;
            _dis = direction_y;
        }

        if(undefined == this.lock || 'lock_y' == this.lock){
            var direction_x = endX - this.startX < 0 ? -1 : 1;
            _dis = direction_x;
        }


        if(this.opts.momentum){
            var endTime = new Date();
            var disTime = endTime - this.srartTime;
            //disTime = 50000/disTime;
            var _v = Math.abs(_dis / disTime);
            this.$el.style.webkitTransitionDuration = '500ms';
        }

        if(this.opts.snap){
            if(direction_y > 0 || direction_x > 0){
                var math = Math.ceil;
            }else{
                var math = Math.floor;
            }
            var curr_num;
            curr_num = math( _y / this._clientH );
            _x = math( _x / this._clientW ) * this._clientW;
            _y = curr_num * this._clientH;
            if('lock_y' == this.lock){
                curr_num = math( _x / this._clientW );
            }

        }
        if(this.opts.momentum && !this.opts.snap){
            if(undefined == this.lock || 'lock_y' == this.lock){
                _x = _x + _dis / disTime * 10000;
            }
            if(undefined == this.lock || 'lock_x' == this.lock){
                _y = _y + _dis / disTime * 10000;
            }
        }

        if(undefined == this.lock || 'lock_x' == this.lock){
            if(_y > 0) _y = 0;
            if(_y < this._mixH) _y = this._mixH;
        }else if(undefined == this.lock || 'lock_y' == this.lock){
            if(_x > 0) _x = 0;
            if(_x < this._mixW) _x = this._mixW;
        }


        this._x = _x;
        this._y = _y;
        this.currNum = curr_num || 0;
        this.$el.style.webkitTransform = 'translate3d('+ _x +'px, ' + _y + 'px, 0px)';

        Event.trigger('onTouchEnd', this, {'x':this._x, 'y':this._y} );

        if(this.opts.nesting){
            this.lock = undefined;
        }

        if(this.opts.lockDirection && this.opts.hScroll && this.opts.vScroll){
            this.lock = undefined;
        }
    },
    update: function(evt){
        if(!this.drag) return;
        var target = evt.targetTouches[0];
        var disY = target.pageY - this._clientY;
        var disX = target.pageX - this._clientX;
        if(disY == disX){
            return;
        }
        var _direction = Math.abs(this._y - disY) > Math.abs(this._x - disX) ? 1 : -1;
        if(this.opts.lockDirection && undefined == this.lock){
            if(_direction == 1){
                this.lock = 'lock_x';
            }else if(_direction == -1){
                this.lock = 'lock_y';
            }
        }
        if(this.lock == 'lock_x' && _direction == -1){
            evt.stopPropagation();
            if(this.opts.nesting){
                this.opts.nesting.drag = false;
            }

            return;
        }else if(this.lock == 'lock_y' && _direction == 1){
            evt.stopPropagation();
            if(this.opts.nesting){
                this.opts.nesting.drag = false;
            }
            return;
        }

        if(undefined == this.lock || 'lock_x' == this.lock){

            if( !this.opts.bounce ){
                if(disY > 0) disY = 0;
                if(disY < this._mixH) disY = this._mixH;
            }else{
                if(disY > 0) disY = disY / 3;
                if(disY < this._mixH) disY = this._mixH + ( disY - this._mixH ) / 3;
            }

            this._y = disY;
        }
        if(undefined == this.lock || 'lock_y' == this.lock){

            if( !this.opts.bounce ){
                if(disX > 0) disX = 0;
                if(disX < this._mixW) disX = this._mixW;
            }else{
                if(disX > 0) disX = disX / 3;
                if(disX < this._mixW) disX = this._mixW + ( disX - this._mixW ) / 3;
            }
            this._x = disX;

        }
        this._shouldMoved = true;
        evt.preventDefault();



        Event.trigger('onScroll', this, {'x':this._x, 'y':this._y} );
    },
    destory:function(){
        this.$el.removeEventListener("touchstart", this.fun);
        this.$parent.style.overflow = 'visible';
    }
}



/**!
 * 微信内置浏览器的Javascript API，功能包括：
 *
 * 1、分享到微信朋友圈
 * 2、分享给微信好友
 * 3、分享到腾讯微博
 * 4、新的分享接口，包含朋友圈、好友、微博的分享（for iOS）
 * 5、隐藏/显示右上角的菜单入口
 * 6、隐藏/显示底部浏览器工具栏
 * 7、获取当前的网络状态
 * 8、调起微信客户端的图片播放组件
 * 9、关闭公众平台Web页面
 *
 * @author zhaoxianlie(http://www.baidufe.com)
 */
var WeixinApi = (function () {

    "use strict";

    /**
     * 分享到微信朋友圈
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    appId      公众平台的appId（服务号可用）
     * @p-config    {String}    imgUrl     图片地址
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     * @p-config    {String}    title      分享的标题
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv)             就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    function weixinShareTimeline(data, callbacks) {
        callbacks = callbacks || {};
        var shareTimeline = function (theData) {
            WeixinJSBridge.invoke('shareTimeline', {
                "appid":theData.appId ? theData.appId : '',
                "img_url":theData.imgUrl,
                "link":theData.link,
                "desc":theData.title,
                "title":theData.desc, // 注意这里要分享出去的内容是desc
                "img_width":"640",
                "img_height":"640"
            }, function (resp) {
                switch (resp.err_msg) {
                    // share_timeline:cancel 用户取消
                    case 'share_timeline:cancel':
                        callbacks.cancel && callbacks.cancel(resp);
                        break;
                    // share_timeline:confirm 发送成功
                    case 'share_timeline:confirm':
                    case 'share_timeline:ok':
                        callbacks.confirm && callbacks.confirm(resp);
                        break;
                    // share_timeline:fail　发送失败
                    case 'share_timeline:fail':
                    default:
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
                // 无论成功失败都会执行的回调
                callbacks.all && callbacks.all(resp);
            });
        };
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            if (callbacks.async && callbacks.ready) {
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                    window["_wx_loadedCb_"] = new Function();
                }
                callbacks.dataLoaded = function (newData) {
                    window["_wx_loadedCb_"](newData);
                    shareTimeline(newData);
                };
                // 然后就绪
                callbacks.ready && callbacks.ready(argv);
            } else {
                // 就绪状态
                callbacks.ready && callbacks.ready(argv);
                shareTimeline(data);
            }
        });
    }

    /**
     * 发送给微信上的好友
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    appId      公众平台的appId（服务号可用）
     * @p-config    {String}    imgUrl     图片地址
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     * @p-config    {String}    title      分享的标题
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv)             就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    function weixinSendAppMessage(data, callbacks) {
        callbacks = callbacks || {};
        var sendAppMessage = function (theData) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "appid":theData.appId ? theData.appId : '',
                "img_url":theData.imgUrl,
                "link":theData.link,
                "desc":theData.desc,
                "title":theData.title,
                "img_width":"640",
                "img_height":"640"
            }, function (resp) {
                switch (resp.err_msg) {
                    // send_app_msg:cancel 用户取消
                    case 'send_app_msg:cancel':
                        callbacks.cancel && callbacks.cancel(resp);
                        break;
                    // send_app_msg:confirm 发送成功
                    case 'send_app_msg:confirm':
                    case 'send_app_msg:ok':
                        callbacks.confirm && callbacks.confirm(resp);
                        break;
                    // send_app_msg:fail　发送失败
                    case 'send_app_msg:fail':
                    default:
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
                // 无论成功失败都会执行的回调
                callbacks.all && callbacks.all(resp);
            });
        };
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
            if (callbacks.async && callbacks.ready) {
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                    window["_wx_loadedCb_"] = new Function();
                }
                callbacks.dataLoaded = function (newData) {
                    window["_wx_loadedCb_"](newData);
                    sendAppMessage(newData);
                };
                // 然后就绪
                callbacks.ready && callbacks.ready(argv);
            } else {
                // 就绪状态
                callbacks.ready && callbacks.ready(argv);
                sendAppMessage(data);
            }
        });
    }

    /**
     * 分享到腾讯微博
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv)             就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    function weixinShareWeibo(data, callbacks) {
        callbacks = callbacks || {};
        var shareWeibo = function (theData) {
            WeixinJSBridge.invoke('shareWeibo', {
                "content":theData.desc,
                "url":theData.link
            }, function (resp) {
                switch (resp.err_msg) {
                    // share_weibo:cancel 用户取消
                    case 'share_weibo:cancel':
                        callbacks.cancel && callbacks.cancel(resp);
                        break;
                    // share_weibo:confirm 发送成功
                    case 'share_weibo:confirm':
                    case 'share_weibo:ok':
                        callbacks.confirm && callbacks.confirm(resp);
                        break;
                    // share_weibo:fail　发送失败
                    case 'share_weibo:fail':
                    default:
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
                // 无论成功失败都会执行的回调
                callbacks.all && callbacks.all(resp);
            });
        };
        WeixinJSBridge.on('menu:share:weibo', function (argv) {
            if (callbacks.async && callbacks.ready) {
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                    window["_wx_loadedCb_"] = new Function();
                }
                callbacks.dataLoaded = function (newData) {
                    window["_wx_loadedCb_"](newData);
                    shareWeibo(newData);
                };
                // 然后就绪
                callbacks.ready && callbacks.ready(argv);
            } else {
                // 就绪状态
                callbacks.ready && callbacks.ready(argv);
                shareWeibo(data);
            }
        });
    }


    /**
     * 新的分享接口
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    appId      公众平台的appId（服务号可用）
     * @p-config    {String}    imgUrl     图片地址
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     * @p-config    {String}    title      分享的标题
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv,shareTo)             就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp,shareTo)    取消
     * @p-config    {Function}  fail(resp,shareTo)      失败
     * @p-config    {Function}  confirm(resp,shareTo)   成功
     * @p-config    {Function}  all(resp,shareTo)       无论成功失败都会执行的回调
     */
    function weixinGeneralShare(data, callbacks) {
        callbacks = callbacks || {};
        var generalShare = function (general,theData) {

            // 如果是分享到朋友圈，则需要把title和desc交换一下
            if(general.shareTo == 'timeline') {
                var title = theData.title;
                theData.title = theData.desc || title;
                theData.desc = title;
            }

            // 分享出去
            general.generalShare({
                "appid":theData.appId ? theData.appId : '',
                "img_url":theData.imgUrl,
                "link":theData.link,
                "desc":theData.desc,
                "title":theData.title,
                "img_width":"640",
                "img_height":"640"
            }, function (resp) {
                switch (resp.err_msg) {
                    // general_share:cancel 用户取消
                    case 'general_share:cancel':
                        callbacks.cancel && callbacks.cancel(resp ,general.shareTo);
                        break;
                    // general_share:confirm 发送成功
                    case 'general_share:confirm':
                    case 'general_share:ok':
                        callbacks.confirm && callbacks.confirm(resp ,general.shareTo);
                        break;
                    // general_share:fail　发送失败
                    case 'general_share:fail':
                    default:
                        callbacks.fail && callbacks.fail(resp ,general.shareTo);
                        break;
                }
                // 无论成功失败都会执行的回调
                callbacks.all && callbacks.all(resp ,general.shareTo);
            });
        };
        WeixinJSBridge.on('menu:general:share', function (general) {
            if (callbacks.async && callbacks.ready) {
                window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                    window["_wx_loadedCb_"] = new Function();
                }
                callbacks.dataLoaded = function (newData) {
                    window["_wx_loadedCb_"](newData);
                    generalShare(general,newData);
                };
                // 然后就绪
                callbacks.ready && callbacks.ready(general,general.shareTo);
            } else {
                // 就绪状态
                callbacks.ready && callbacks.ready(general,general.shareTo);
                generalShare(general,data);
            }
        });
    }

    /**
     * 加关注（此功能只是暂时先加上，不过因为权限限制问题，不能用，如果你的站点是部署在*.qq.com下，也许可行）
     * @param       {String}    appWeixinId     微信公众号ID
     * @param       {Object}    callbacks       回调方法
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     */
    function addContact(appWeixinId,callbacks){
        callbacks = callbacks || {};
        WeixinJSBridge.invoke("addContact", {
            webtype: "1",
            username: appWeixinId
        }, function (resp) {
            var success = !resp.err_msg || "add_contact:ok" == resp.err_msg || "add_contact:added" == resp.err_msg;
            if(success) {
                callbacks.success && callbacks.success(resp);
            }else{
                callbacks.fail && callbacks.fail(resp);
            }
        })
    }

    /**
     * 调起微信Native的图片播放组件。
     * 这里必须对参数进行强检测，如果参数不合法，直接会导致微信客户端crash
     *
     * @param {String} curSrc 当前播放的图片地址
     * @param {Array} srcList 图片地址列表
     */
    function imagePreview(curSrc,srcList) {
        if(!curSrc || !srcList || srcList.length == 0) {
            return;
        }
        WeixinJSBridge.invoke('imagePreview', {
            'current' : curSrc,
            'urls' : srcList
        });
    }

    /**
     * 显示网页右上角的按钮
     */
    function showOptionMenu() {
        WeixinJSBridge.call('showOptionMenu');
    }


    /**
     * 隐藏网页右上角的按钮
     */
    function hideOptionMenu() {
        WeixinJSBridge.call('hideOptionMenu');
    }

    /**
     * 显示底部工具栏
     */
    function showToolbar() {
        WeixinJSBridge.call('showToolbar');
    }

    /**
     * 隐藏底部工具栏
     */
    function hideToolbar() {
        WeixinJSBridge.call('hideToolbar');
    }

    /**
     * 返回如下几种类型：
     *
     * network_type:wifi     wifi网络
     * network_type:edge     非wifi,包含3G/2G
     * network_type:fail     网络断开连接
     * network_type:wwan     2g或者3g
     *
     * 使用方法：
     * WeixinApi.getNetworkType(function(networkType){
     *
     * });
     *
     * @param callback
     */
    function getNetworkType(callback) {
        if (callback && typeof callback == 'function') {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                // 在这里拿到e.err_msg，这里面就包含了所有的网络类型
                callback(e.err_msg);
            });
        }
    }

    /**
     * 关闭当前微信公众平台页面
     */
    function closeWindow() {
        WeixinJSBridge.call("closeWindow");
    }

    /**
     * 当页面加载完毕后执行，使用方法：
     * WeixinApi.ready(function(Api){
     *     // 从这里只用Api即是WeixinApi
     * });
     * @param readyCallback
     */
    function wxJsBridgeReady(readyCallback) {
        if (readyCallback && typeof readyCallback == 'function') {
            var Api = this;
            var wxReadyFunc = function () {
                readyCallback(Api);
            };
            if (typeof window.WeixinJSBridge == "undefined"){
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);
                    document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);
                }
            }else{
                wxReadyFunc();
            }
        }
    }

    /**
     * 判断当前网页是否在微信内置浏览器中打开
     */
    function openInWeixin(){
        return /MicroMessenger/i.test(navigator.userAgent);
    }

    return {
        version         :"2.1",
        ready           :wxJsBridgeReady,
        shareToTimeline :weixinShareTimeline,
        shareToWeibo    :weixinShareWeibo,
        shareToFriend   :weixinSendAppMessage,
        generalShare    :weixinGeneralShare,
        addContact      :addContact,
        showOptionMenu  :showOptionMenu,
        hideOptionMenu  :hideOptionMenu,
        showToolbar     :showToolbar,
        hideToolbar     :hideToolbar,
        getNetworkType  :getNetworkType,
        imagePreview    :imagePreview,
        closeWindow     :closeWindow,
        openInWeixin    :openInWeixin
    };
})();
/**
 * 文件预加载器(混淆,壓縮)
 * 可加装 js image  css
 * sherlock
 * 1.0.0
 */
;(function(bPwG1){var XHgA2={};var wUsXG3=function(source){this["\x5f\x73\x6f\x75\x72\x63\x65"]=[];this["\x66\x61\x69\x6c\x73"]=[];this["\x5f\x69\x6e\x64\x65\x78"]=0;this["\x66\x61\x69\x6c\x65\x64"]=0;this["\x6c\x6f\x61\x64\x65\x64"]=0;this["\x70\x65\x72\x63\x65\x6e\x74"]='\x30\x25';this["\x5f\x69\x6e\x69\x74"](source);this["\x74\x6f\x74\x61\x6c"]=this["\x5f\x73\x6f\x75\x72\x63\x65"]["\x6c\x65\x6e\x67\x74\x68"];this["\x5f\x6c\x6f\x61\x64"]()};wUsXG3["\x70\x72\x6f\x74\x6f\x74\x79\x70\x65"]={_rsuffix:/\.(js|css|mp3)$/,_init:function(MThLSZ4){if(typeof MThLSZ4==='\x73\x74\x72\x69\x6e\x67'){this["\x5f\x73\x6f\x75\x72\x63\x65"]["\x70\x75\x73\x68"](MThLSZ4)}else if(window["\x41\x72\x72\x61\x79"]["\x69\x73\x41\x72\x72\x61\x79"](MThLSZ4)){this["\x5f\x73\x6f\x75\x72\x63\x65"]=MThLSZ4}else{throw'\x4c\x6f\x61\x64\x65\x72 \x45\x72\x72\x6f\x72\x3a \x61\x72\x67\x75\x6d\x65\x6e\x74\x73 \x6d\x75\x73\x74 \x62\x65 \x53\x74\x72\x69\x6e\x67\x7c\x41\x72\x72\x61\x79\x2e'}},_get_load_method:function(W5){var jy$6=(jy$6=W5["\x6d\x61\x74\x63\x68"](this["\x5f\x72\x73\x75\x66\x66\x69\x78"]))?jy$6[1]:'\x69\x6d\x67';return'\x5f'+jy$6},_js:function(cEIFcGgCg7,uXN8){var LLM9=this;var dG10=window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"]('\x73\x63\x72\x69\x70\x74');dG10["\x6f\x6e\x6c\x6f\x61\x64"]=function(){uXN8&&uXN8["\x63\x61\x6c\x6c"](LLM9,true,cEIFcGgCg7)};dG10["\x6f\x6e\x65\x72\x72\x6f\x72"]=function(){uXN8&&uXN8["\x63\x61\x6c\x6c"](LLM9,false,cEIFcGgCg7)};dG10["\x74\x79\x70\x65"]='\x74\x65\x78\x74\x2f\x6a\x61\x76\x61\x73\x63\x72\x69\x70\x74';dG10["\x73\x72\x63"]=cEIFcGgCg7;window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x68\x65\x61\x64"]["\x61\x70\x70\x65\x6e\x64\x43\x68\x69\x6c\x64"](dG10)},_css:function(M11,fUz12){var VOjkTeXS13=this;var NOM14=window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"]('\x6c\x69\x6e\x6b');NOM14["\x74\x79\x70\x65"]='\x74\x65\x78\x74\x2f\x63\x73\x73';NOM14["\x72\x65\x6c"]='\x73\x74\x79\x6c\x65\x73\x68\x65\x65\x74';NOM14["\x68\x72\x65\x66"]=M11;window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x68\x65\x61\x64"]["\x61\x70\x70\x65\x6e\x64\x43\x68\x69\x6c\x64"](NOM14);fUz12&&fUz12["\x63\x61\x6c\x6c"](VOjkTeXS13,true,M11)},_img:function(L15,jzbaXNeSj16){var QLs17=this;var aSI_18=new Image();aSI_18["\x6f\x6e\x6c\x6f\x61\x64"]=function(){XHgA2[L15]=aSI_18;jzbaXNeSj16&&jzbaXNeSj16["\x63\x61\x6c\x6c"](QLs17,true,L15)};aSI_18["\x6f\x6e\x65\x72\x72\x6f\x72"]=function(){jzbaXNeSj16&&jzbaXNeSj16["\x63\x61\x6c\x6c"](QLs17,false,L15)};aSI_18["\x73\x72\x63"]=L15},_mp3:function(sI19,mk20){},_load:function(){if(this["\x5f\x69\x6e\x64\x65\x78"]==this["\x5f\x73\x6f\x75\x72\x63\x65"]["\x6c\x65\x6e\x67\x74\x68"])return this["\x5f\x6f\x6e\x65\x6e\x64"]();var X21=this["\x5f\x73\x6f\x75\x72\x63\x65"][this["\x5f\x69\x6e\x64\x65\x78"]];if(!X21){return}var TwrFcO$l22=this["\x5f\x67\x65\x74\x5f\x6c\x6f\x61\x64\x5f\x6d\x65\x74\x68\x6f\x64"](X21);this[TwrFcO$l22](X21,this["\x5f\x6c\x6f\x61\x64\x65\x6e\x64"]);this["\x5f\x6f\x6e\x6c\x6f\x61\x64\x73\x74\x61\x72\x74"](X21)},_loadend:function(st_oa23,_XrQ24){if(st_oa23){++this["\x6c\x6f\x61\x64\x65\x64"]}else{++this["\x66\x61\x69\x6c\x65\x64"];this["\x66\x61\x69\x6c\x73"]["\x70\x75\x73\x68"](_XrQ24)}++this["\x5f\x69\x6e\x64\x65\x78"];this["\x70\x65\x72\x63\x65\x6e\x74"]=window["\x4d\x61\x74\x68"]["\x63\x65\x69\x6c"](this["\x5f\x69\x6e\x64\x65\x78"]/this["\x74\x6f\x74\x61\x6c"]*100)+'\x25';this["\x5f\x6f\x6e\x6c\x6f\x61\x64\x65\x6e\x64"](st_oa23,_XrQ24);this["\x5f\x6c\x6f\x61\x64"]()},_onloadstart:function(){},_onloadend:function(){},_onend:function(){},loadstart:function(IWoChX25){if(typeof IWoChX25==='\x66\x75\x6e\x63\x74\x69\x6f\x6e'){this["\x5f\x6f\x6e\x6c\x6f\x61\x64\x73\x74\x61\x72\x74"]=IWoChX25}return this},loadend:function(zHMB26){if(typeof zHMB26==='\x66\x75\x6e\x63\x74\x69\x6f\x6e'){this["\x5f\x6f\x6e\x6c\x6f\x61\x64\x65\x6e\x64"]=zHMB26}return this},complete:function(mSfbTcn27){if(typeof mSfbTcn27==='\x66\x75\x6e\x63\x74\x69\x6f\x6e'){this["\x5f\x6f\x6e\x65\x6e\x64"]=mSfbTcn27}return this},image:function(fEybRLp28,WkCXSn29){if(arguments["\x6c\x65\x6e\x67\x74\x68"]==1){if(undefined==fEybRLp28){return XHgA2}var Xd30=XHgA2[fEybRLp28];if(Xd30){return Xd30}Xd30=new Image();Xd30["\x73\x72\x63"]=fEybRLp28;return Xd30}if(arguments["\x6c\x65\x6e\x67\x74\x68"]==2){XHgA2[fEybRLp28]=WkCXSn29}}};var kwq31=function(source,$Es32,L33){var WgsjA34=window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"]('\x73\x74\x79\x6c\x65');WgsjA34["\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c"]='\x40\x2d\x77\x65\x62\x6b\x69\x74\x2d\x6b\x65\x79\x66\x72\x61\x6d\x65\x73 \x6c\x6f\x61\x64\x69\x6e\x67\x7b\x30\x25\x7b\x2d\x77\x65\x62\x6b\x69\x74\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29\x3b\x7d\x31\x30\x30\x25\x7b\x2d\x77\x65\x62\x6b\x69\x74\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x33\x36\x30\x64\x65\x67\x29\x3b\x7d\x7d\x40\x2d\x6d\x6f\x7a\x2d\x6b\x65\x79\x66\x72\x61\x6d\x65\x73 \x6c\x6f\x61\x64\x69\x6e\x67\x7b\x30\x25\x7b\x2d\x6d\x6f\x7a\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29\x3b\x7d\x31\x30\x30\x25\x7b\x2d\x6d\x6f\x7a\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x33\x36\x30\x64\x65\x67\x29\x3b\x7d\x7d\x40\x2d\x6f\x2d\x6b\x65\x79\x66\x72\x61\x6d\x65\x73 \x6c\x6f\x61\x64\x69\x6e\x67\x7b\x30\x25\x7b\x2d\x6f\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29\x3b\x7d\x31\x30\x30\x25\x7b\x2d\x6f\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x33\x36\x30\x64\x65\x67\x29\x3b\x7d\x7d\x40\x2d\x6d\x73\x2d\x6b\x65\x79\x66\x72\x61\x6d\x65\x73 \x6c\x6f\x61\x64\x69\x6e\x67\x7b\x30\x25\x7b\x2d\x6d\x73\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29\x3b\x7d\x31\x30\x30\x25\x7b\x2d\x6d\x73\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x33\x36\x30\x64\x65\x67\x29\x3b\x7d\x7d\x40\x6b\x65\x79\x66\x72\x61\x6d\x65\x73 \x6c\x6f\x61\x64\x69\x6e\x67\x7b\x30\x25\x7b\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29\x3b\x7d\x31\x30\x30\x25\x7b\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x3a\x72\x6f\x74\x61\x74\x65\x28\x33\x36\x30\x64\x65\x67\x29\x3b\x7d\x7d'+'\x2e\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x7b\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a\x61\x62\x73\x6f\x6c\x75\x74\x65\x3b \x77\x69\x64\x74\x68\x3a\x31\x30\x30\x25\x3b \x68\x65\x69\x67\x68\x74\x3a\x31\x30\x30\x25\x3b \x6f\x76\x65\x72\x66\x6c\x6f\x77\x3a\x68\x69\x64\x64\x65\x6e\x3b \x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x2d\x63\x6f\x6c\x6f\x72\x3a\x23\x45\x34\x34\x42\x34\x36\x3b \x6c\x65\x66\x74\x3a\x30\x3b \x74\x6f\x70\x3a\x30\x3b \x2d\x77\x65\x62\x6b\x69\x74\x2d\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x2d\x73\x74\x79\x6c\x65\x3a\x70\x72\x65\x73\x65\x72\x76\x65\x2d\x33\x64\x3b \x7a\x2d\x69\x6e\x64\x65\x78\x3a\x31\x3b\x7d'+'\x2e\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x5f\x63\x6c\x69\x70\x7b\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a\x61\x62\x73\x6f\x6c\x75\x74\x65\x3b \x6c\x65\x66\x74\x3a\x35\x30\x25\x3b \x74\x6f\x70\x3a\x35\x30\x25\x3b \x77\x69\x64\x74\x68\x3a\x36\x30\x70\x78\x3b \x68\x65\x69\x67\x68\x74\x3a\x36\x30\x70\x78\x3b \x6d\x61\x72\x67\x69\x6e\x3a\x2d\x33\x30\x70\x78 \x30 \x30 \x2d\x33\x30\x70\x78\x3b \x6f\x76\x65\x72\x66\x6c\x6f\x77\x3a\x68\x69\x64\x64\x65\x6e\x3b  \x2d\x77\x65\x62\x6b\x69\x74\x2d\x61\x6e\x69\x6d\x61\x74\x69\x6f\x6e\x3a\x6c\x6f\x61\x64\x69\x6e\x67 \x31\x2e\x32\x73 \x6c\x69\x6e\x65\x61\x72 \x69\x6e\x66\x69\x6e\x69\x74\x65\x3b \x2d\x6d\x6f\x7a\x2d\x61\x6e\x69\x6d\x61\x74\x69\x6f\x6e\x3a\x6c\x6f\x61\x64\x69\x6e\x67 \x31\x2e\x32\x73 \x6c\x69\x6e\x65\x61\x72 \x69\x6e\x66\x69\x6e\x69\x74\x65\x3b \x2d\x6f\x2d\x61\x6e\x69\x6d\x61\x74\x69\x6f\x6e\x3a\x6c\x6f\x61\x64\x69\x6e\x67 \x31\x2e\x32\x73 \x6c\x69\x6e\x65\x61\x72 \x69\x6e\x66\x69\x6e\x69\x74\x65\x3b \x2d\x6d\x73\x2d\x61\x6e\x69\x6d\x61\x74\x69\x6f\x6e\x3a\x6c\x6f\x61\x64\x69\x6e\x67 \x31\x2e\x32\x73 \x6c\x69\x6e\x65\x61\x72 \x69\x6e\x66\x69\x6e\x69\x74\x65\x3b \x61\x6e\x69\x6d\x61\x74\x69\x6f\x6e\x3a\x6c\x6f\x61\x64\x69\x6e\x67 \x31\x2e\x32\x73 \x6c\x69\x6e\x65\x61\x72 \x69\x6e\x66\x69\x6e\x69\x74\x65\x3b\x7d'+'\x2e\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x5f\x62\x61\x72\x7b\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a\x61\x62\x73\x6f\x6c\x75\x74\x65\x3b \x6c\x65\x66\x74\x3a\x30\x3b \x74\x6f\x70\x3a\x30\x3b \x77\x69\x64\x74\x68\x3a \x35\x34\x70\x78\x3b\x68\x65\x69\x67\x68\x74\x3a \x35\x34\x70\x78\x3b \x62\x6f\x72\x64\x65\x72\x2d\x72\x61\x64\x69\x75\x73\x3a\x35\x30\x70\x78\x3b \x6f\x76\x65\x72\x66\x6c\x6f\x77\x3a\x68\x69\x64\x64\x65\x6e\x3b \x63\x6c\x69\x70\x3a \x72\x65\x63\x74\x28\x30\x70\x78\x2c\x33\x36\x70\x78\x2c\x37\x30\x70\x78\x2c\x30\x29\x3b \x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x74\x72\x61\x6e\x73\x70\x61\x72\x65\x6e\x74\x3b \x62\x6f\x72\x64\x65\x72\x3a\x33\x70\x78 \x73\x6f\x6c\x69\x64 \x23\x66\x66\x66\x3b \x2d\x77\x65\x62\x6b\x69\x74\x2d\x6d\x61\x73\x6b\x3a\x2d\x77\x65\x62\x6b\x69\x74\x2d\x67\x72\x61\x64\x69\x65\x6e\x74\x28\x6c\x69\x6e\x65\x61\x72\x2c\x30 \x30\x2c\x30 \x31\x30\x30\x25\x2c\x66\x72\x6f\x6d\x28\x72\x67\x62\x61\x28\x32\x35\x35\x2c\x32\x35\x35\x2c\x32\x35\x35\x2c\x31\x29\x29\x2c\x74\x6f\x28\x72\x67\x62\x61\x28\x32\x35\x35\x2c\x32\x35\x35\x2c\x32\x35\x35\x2c\x30\x29\x29\x29\x3b\x7d'+'\x2e\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x5f\x74\x78\x74\x7b\x77\x69\x64\x74\x68\x3a \x31\x30\x30\x70\x78\x3b\x68\x65\x69\x67\x68\x74\x3a \x33\x30\x70\x78\x3b\x6c\x69\x6e\x65\x2d\x68\x65\x69\x67\x68\x74\x3a \x33\x30\x70\x78\x3b\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a \x61\x62\x73\x6f\x6c\x75\x74\x65\x3b\x6c\x65\x66\x74\x3a \x35\x30\x25\x3b\x74\x6f\x70\x3a \x35\x30\x25\x3b\x6d\x61\x72\x67\x69\x6e\x2d\x6c\x65\x66\x74\x3a \x2d\x35\x30\x70\x78\x3b\x6d\x61\x72\x67\x69\x6e\x2d\x74\x6f\x70\x3a \x2d\x31\x35\x70\x78\x3b\x74\x65\x78\x74\x2d\x61\x6c\x69\x67\x6e\x3a \x63\x65\x6e\x74\x65\x72\x3b\x63\x6f\x6c\x6f\x72\x3a \x23\x66\x66\x66\x3b\x7d';window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65"]('\x68\x65\x61\x64')[0]["\x61\x70\x70\x65\x6e\x64\x43\x68\x69\x6c\x64"](WgsjA34);var UhD35=window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"],QdyEWyFY36=arguments,ZqnT37=typeof ZqnT37=='\x73\x74\x72\x69\x6e\x67'?ZqnT37:'\x23\x45\x34\x34\x42\x34\x36';var XmwA38=UhD35["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]('\x4d\x50\x5f\x6c\x6f\x61\x64\x69\x6e\x67'),sNi39=UhD35["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]('\x4d\x50\x5f\x70\x72\x65\x63\x65\x6e\x74');if(!XmwA38){XmwA38=UhD35["\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"]('\x64\x69\x76');XmwA38["\x63\x6c\x61\x73\x73\x4e\x61\x6d\x65"]='\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67';XmwA38["\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c"]='\x3c\x64\x69\x76 \x63\x6c\x61\x73\x73\x3d\x22\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x5f\x63\x6c\x69\x70\x22\x3e\x3c\x64\x69\x76 \x63\x6c\x61\x73\x73\x3d\x22\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x5f\x62\x61\x72\x22 \x73\x74\x79\x6c\x65\x3d\x22\x62\x6f\x72\x64\x65\x72\x2d\x63\x6f\x6c\x6f\x72\x3a\x22'+ZqnT37+'\x3e\x3c\x2f\x64\x69\x76\x3e\x3c\x2f\x64\x69\x76\x3e';sNi39=UhD35["\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"]('\x64\x69\x76');sNi39["\x63\x6c\x61\x73\x73\x4e\x61\x6d\x65"]='\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67\x5f\x74\x78\x74';XmwA38["\x63\x61\x6c\x73\x73\x4e\x61\x6d\x65"]='\x6d\x70\x5f\x6c\x6f\x61\x64\x69\x6e\x67';sNi39["\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c"]="\x30\x25";XmwA38["\x61\x70\x70\x65\x6e\x64\x43\x68\x69\x6c\x64"](sNi39);window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x62\x6f\x64\x79"]["\x61\x70\x70\x65\x6e\x64\x43\x68\x69\x6c\x64"](XmwA38)}this["\x5f\x6c\x6f\x61\x64\x44\x6f\x6d"]=XmwA38;this["\x5f\x74\x78\x74\x44\x6f\x6d"]=sNi39;var ystk40=this;var _WYwDTdoq41=L33;_WYwDTdoq41=typeof _WYwDTdoq41=='\x66\x75\x6e\x63\x74\x69\x6f\x6e'?_WYwDTdoq41:function(){};new wUsXG3(source)["\x6c\x6f\x61\x64\x73\x74\x61\x72\x74"](function(){})["\x6c\x6f\x61\x64\x65\x6e\x64"](function(lmOzt42){ystk40["\x5f\x74\x78\x74\x44\x6f\x6d"]["\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c"]=this["\x70\x65\x72\x63\x65\x6e\x74"]})["\x63\x6f\x6d\x70\x6c\x65\x74\x65"](function(){ystk40["\x5f\x6c\x6f\x61\x64\x44\x6f\x6d"]["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"]='\x6e\x6f\x6e\x65';_WYwDTdoq41["\x61\x70\x70\x6c\x79"](ystk40)})};bPwG1["\x6c\x6f\x61\x64\x65\x72"]=wUsXG3;bPwG1["\x6c\x6f\x61\x64\x65\x72\x6d\x73\x6b"]=kwq31})(window);