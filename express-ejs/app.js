var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// 自定义路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var doubanRouter = require('./routes/douban');
var xbiaoRouter = require('./routes/xbiao');
var xbusrRouter = require('./routes/xbusr');

var huaRouter = require('./routes/hua');
var huaUsrRouter = require('./routes/huaUsr');



var app = express();


// view engine setup
// 引擎模板目标文件夹;
// path.jion 以路径的方式进行两端字符串的拼接;
// 给整个views文件夹做简写; views === C://...../views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 使用外部中间件
// 打印日志的中间件;
app.use(logger('dev'));
// 对请求数据的解析
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 静态资源配置;  我们把是所有的静态资源全部放在了 public里面;
// script src=
app.use(express.static(path.join(__dirname, 'public')));


// 路由封装
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/douban',doubanRouter);
app.use('/xbiao', xbiaoRouter);
app.use('/xbusr',xbusrRouter)

app.use('/hua', huaRouter);
app.use('/huaUsr',huaUsrRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
