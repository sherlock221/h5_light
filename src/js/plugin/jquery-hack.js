/**
 * hack jquery 1.9
 * 让jquery 1.9 支持 toggle 切换事件
 * sherlock  10:11
 * @param fn
 * @param fn2
 * @returns {*}
 */
jQuery.fn.toggle = function (fn, fn2) {
// Don't mess with animation or css toggles
    if (!jQuery.isFunction(fn) || !jQuery.isFunction(fn2)) {
        return oldToggle.apply(this, arguments);
    }
// migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");
// Save reference to arguments for access in closure
    var args = arguments,
        guid = fn.guid || jQuery.guid++,
        i = 0,
        toggler = function (event) {
// Figure out which function to execute
            var lastToggle = ( jQuery._data(this, "lastToggle" + fn.guid) || 0 ) % i;
            jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);
// Make sure that clicks stop
            event.preventDefault();
// and execute the function
            return args[ lastToggle ].apply(this, arguments) || false;
        };
// link all the functions, so any of them can unbind this click handler
    toggler.guid = guid;
    while (i < args.length) {
        args[ i++ ].guid = guid;
    }
    return this.click(toggler);
};

/**
 * 火箭
 * sherlock 12:12
 * @param dir top:bottom  顶部/底部
 * @param speed 滚动速度
 * @returns {jQuery.fn}
 */
jQuery.fn.rocket = function(dir,speed){
    var targetOffset = dir == "top" ?  -$(this).offset().top : $(document).height();
    console.log(targetOffset);
    $("body").stop().animate({scrollTop :targetOffset},speed);
    return this;
};


/**
 * 未知宽高 元素水平垂直居中 ie7+(fixed)
 * sherlock 13:11
 * @returns {jQuery.fn}
 */
jQuery.fn.center = function(){
    var $window = $(window);
    var $this   = $(this);
    $this.css({"position" : "fixed","top" : "50%","left" : "50%"}).css({"marginLeft":"-"+$this.width()/2+"px" , "marginTop" : "-"+$this.height()+"px"});
    return this;
};


/**
 * 控制它输出元素信息
 * @param msg
 */
 jQuery.fn.log = function(msg){
     if(console){
         console.log("%s: %o",msg,this);
     }
      return this;
 };