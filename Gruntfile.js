module.exports = function(grunt) {

    //读取package.json
    var pkg = grunt.file.readJSON("package.json");

    var constants = {
        reset : "src/css/zepto/reset.css"
    };

    //初始化Grunt
    grunt.initConfig({
        pkg :pkg,
        /** 合并 **/
        concat  : {
            /**
             * 合并全部模块
             */
            zepto_all : {
                src : ['src/zepto/*.js'],
                dest : 'bin/zepto.all.js'
            },
            /**
             * 包含移动端事件模块(精简)
             */
            zepto_touch : {
                src : ['src/zepto/zepto.js','src/zepto/event.js','src/zepto/touch.js'],
                dest : 'bin/zepto.touch.js'
            },


            /** 合并模块css **/
            build_model_css : {
                src : ['src/css/module/*.css'],
                dest : 'src/css/module.css'
            },

            /** 模块css + 基本设置css **/
            build_setting_css : {
                src : ['src/css/module.css'],
                dest : 'dist/css/h5_light.css'
            }


//            build_css : {
//                src : ['src/css/module/*.css'],
//                filter : function(filepath){
//                    console.log(filepath);
//                    if(filepath == constants.reset){
//                        return false;
//                    }
//                    return true;
//                },
//                dest : 'bin/module_noreset.css'
//            }
        },

        /**  监听文件夹并且执行任务 **/
        watch : {
            css : {
                files : ['src/css/*.css'],
                tasks : ["concat:build_model_css","concat:build_setting_css","cssmin"],
                options : {
                    //默认 35729端口
                    livereload : true
                }
         }

        },
        /** 压缩js **/
        uglify : {
            zepto_service_01 : {
                src : "bin/zepto.service.01.js",
                dest : "bin/zepto.service.01.min.js"
            },
            iscroll : {
                src : "src/js/plugin/iscroll.js",
                dest : "bin/iscroll.min.js"
            }

        },

        /** 压缩css **/
        cssmin : {
            options : {
            },
            min_css : {
                src : 'dist/css/h5_light.css',
                dest : 'dist/css/h5_light.min.css'
            }
        },
        /** js代码检查  **/
        jshint: {
            src : "src/js/*.js"
        }
    });


    //合并文件
    grunt.loadNpmTasks('grunt-contrib-concat');
    //压缩js
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //js检查
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //压缩css
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //watch 监听
    grunt.loadNpmTasks('grunt-contrib-watch');


};