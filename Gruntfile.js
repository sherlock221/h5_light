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



            /** 合并模块css **/
            build_model_css : {
                src : ['src/css/module/*.css'],
                dest : 'src/css/module.css'
            },

            /** 模块css + 基本设置css **/
            build_setting_css : {
                src : ['src/css/module.css',"src/css/setting.css"],
                dest : 'dist/css/h5_light.css'
            },

            /** 场景应用js打包  包括(微信sdk scrollsdk 图片异步加载js ) **/
            build_scene : {
                src : ['src/js/common/common.js',"src/js/common/scroll.js","src/js/common/weixin.js","src/js/common/loader.min.js"],
                dest : 'dist/js/scene.js'
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

            build_scene : {
                src :  'dist/js/scene.js',
                dest : "dist/js/scene.min.js"
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

    //合并全部css并压缩
    grunt.registerTask('css',  ["concat:build_model_css","concat:build_setting_css","cssmin"]);

    //场景应用js打包
    grunt.registerTask('scene',  ["concat:build_scene","uglify:build_scene"]);
};