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

            /**
             * 包含 基本业务01
             */
            zepto_service_01 : {
                src : ['src/zepto/zepto.js','src/zepto/event.js','src/zepto/touch.js','src/zepto/detect.js','src/zepto/fx.js','src/zepto/ajax.js','src/zepto/form.js'],
                dest : 'bin/zepto.service.01.js'
            },

            build_bootstrap_css : {
                src :['src/css/zepto/function.css','src/css/zepto/text.css','src/css/zepto/value.css'],
                dest : "bin/quick.css"
            },
            build_model_css : {
                src : ['src/css/module/*.css'],
                dest : 'bin/module.css'
            },

            build_model_css_noreset : {
                src : ['src/css/module/*.css'],
                filter : function(filepath){
                    console.log(filepath);
                    if(filepath == constants.reset){
                        return false;
                    }
                    return true;
                },
                dest : 'bin/module_noreset.css'
            },

            build_model_cloud:{
                src : ['src/css/zepto/*.css'],
                filter : function(filepath){
                    console.log(filepath);
                    if(filepath == constants.reset){
                        return false;
                    }
                    return true;
                },
                dest : '../EnterpriseCloudClient/source/css/core/zepto.css'
            }


        },

        /**  监听文件夹并且执行任务 **/
        watch : {
            css : {
                files : ['src/css/module/*.css'],
                tasks : ["concat:build_model_css","concat:build_model_css_noreset","cssmin"],
                options : {
                    //默认 35729端口
                    livereload : true
                }
         },

               cloud : {
                   files : ['src/css/zepto/*.css'],
                   tasks : ["concat:build_model_cloud"]

               },


            lad : {
                files : ['src/css/plugin/lockaudio.css'],
                tasks : ["cssmin:audio"],
                options : {
                    //默认 35729端口
                    livereload : true
                }
            }
        },
        /** 压缩css **/
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
            build : {
                src : 'bin/module.css',
                dest : 'bin/module.min.css'
            },
            build_noreset : {
                src : 'bin/module_noreset.css',
                dest : 'bin/module_noreset.min.css'
            },
            audio : {
                src : 'src/css/plugin/lockaudio.css',
                dest : 'bin/lockaudio/lockaudio.min.css'
            }
        },

        imagemin: {
            /* 压缩图片大小 */
            dist: {
                files: [{
                    expand: true,
//                    cwd: "./dev/images/",
//                    src: ["wap/*.{jpg,png,gif}"],
                    src: ["src/demo/wap/*.png"],
                    dest: "src/img/"
                }]
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

    //压缩图片
    grunt.loadNpmTasks('grunt-contrib-imagemin');



};