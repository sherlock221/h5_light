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
