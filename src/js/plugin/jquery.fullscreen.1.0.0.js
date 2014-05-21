/**
 * jquery 基本最大化 插件
 * sherlock 11:10
 */

(function ($) {
    $.fn.fullscreen = function () {

        // 私有函数
        var privateFn = {

            init: function (options) {
                //引用当前对象
                var $this = $(this);
                // 覆盖设置
                var options = $.extend({}, $.fn.fullscreen.options, options);
                //存入设置
                $this.data("options", options);
                
                //最外层添加div
            },

            //获取屏幕宽高
            getScreen: function ($this) {
                var screen = {};
                screen.w = $(window).width();
                screen.h = $(window).height();
                return screen;
            }

        };

        // 暴露方法
        var publicFn = {
            openFull: function ($this) {
                var _this = $this || $(this);
                var screen = privateFn.getScreen(_this);
                var fix = $.fn.fullscreen.options.fixed;
                _this.css(fix);
            },
            clsoeFull: function ($this) {
                var _this = $this || $(this);
                var screen = privateFn.getScreen(_this);
                var fix = {
                    top: "0px",
                    left: "0px",
                    position: "fixed",
                    width: "100%",
                    height: "100%"
                };
                _this.removeAttr("style");
            },
            getOptions: function ($this) {
                return $this.data("options");
            },
            setOptions: function ($this, options) {
                var current = $this.data("options");
                var options = $.extend({}, $.fn.fullscreen.options, current);
                $this.data("options", options);
            }
        };


        // 判断是 构造函数 || 调用方法
        var method = arguments[0];
        var array;
        if (publicFn[method]) {
            method = publicFn[method];
            array = Array.prototype.slice.call(arguments, 1);
        } else if (typeof (method) == 'object' || !method) {
            method = privateFn.init;
        } else {
            $.error('Method ' + method
                + ' does not exist on jquery.fullscreen');
            return this;
        }

        // 处理多个对象
        return this.each(function () {
            method.apply(this, array);
        });
    };




    // 默认设置
    $.fn.fullscreen.options = {
        fixed: {
            top: "0px",
            left: "0px",
            position: "fixed",
            width: "100%",
            height: "100%"
        }
    };


})(jQuery);
