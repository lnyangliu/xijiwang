// gulp的插件

// 1.http插件；（服务器插件）
// gulp connect

const gulp = require("gulp");//引入gulp
// gulp 服务器插件
const connect = require("gulp-connect");
// gulp 合并插件 
var concat = require('gulp-concat');
// gulp 压缩插件
var uglify = require("gulp-uglify");
// babel 插件；
var babel = require("gulp-babel");

// css插件
var cleanCss = require("gulp-clean-css")
// sass编译插件；
var sass = require("gulp-sass-china");

var proxy=require("http-proxy-middleware")

gulp.task('connect',function(){
    connect.server({
        root:"dist/",
        livereload:true, //自动更新一下
        // 中间件；
        // middleware:function(connect , opt){
        //     var Proxy = require('gulp-connect-proxy');
        //     opt.route = '/proxy';
        //     var proxy = new Proxy(opt);
        //     return [proxy];
        // }
        middleware:function(){
            return [
                proxy("/api",{
                    target:"http://localhost:3001",
                    pathRewrite: {
                        '^/api' : '/',     // rewrite path
                    }
                })
            ]
        }
    })
    //  connect.server({
        // port:8888  默认端口为8888；更改端口；
    // });
});
// 如何发起一个代理请求 : 
// localhost:8888/proxy/目标;
gulp.task("html",()=>{
    return gulp.src("*.html").pipe(gulp.dest("dist/")).pipe(connect.reload());
    //connect.reload() 数据在管中队列
})
gulp.task("watch",()=>{
    gulp.watch("*.html",["html","sass"]);
    gulp.watch("sass/*.scss",["html","sass"]);
    gulp.watch("script/app/*.js",["html","script"]);
})
gulp.task("default",["watch","connect","sass","script"]);//自动刷新功能

// script 转存指令；
gulp.task("script",()=>{
    return gulp.src(["script/libs/*.js",
    "script/module/*.js","script/app/*.js","!script/app/jquery.js"])
    // .pipe(concat("main.js"))
    // .pipe(uglify())
    .pipe(gulp.dest("dist/script"));
})
gulp.task("css",()=>{
    return gulp.src(["styles/*.css"])
    .pipe(cleanCss())
    .pipe(gulp.dest("dist/css"));
})
gulp.task("sass",()=>{
    return gulp.src(["sass/*.scss"])
    .pipe(sass().on("error",sass.logError))
    .pipe(gulp.dest("dist/css"))
})

// 编译；es6 => es5;
gulp.task("es6",()=>{
    return gulp.src("es6/*.js")
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest("dist/script"));
})
