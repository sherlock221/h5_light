
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


