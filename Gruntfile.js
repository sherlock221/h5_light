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
        },
        /** 压缩css **/
        cssmin : {
            options : {
            },
            min_css : {
                src : 'src/scss/module/h5_light.css',
                dest : 'dist/h5_light.min.css'
            }
        }

    });

    //压缩css
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //构建
    grunt.registerTask('h5_light',  ["cssmin"]);
};