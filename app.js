var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const AWS = require('aws-sdk');
const configs = require('./configs')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
const s3 = new AWS.S3({
    accessKeyId: configs.AWS.ACCESS_KEY_ID,
    secretAccessKey: configs.AWS.SECRETT_KEY
});

app.get('/generatepresignedurl', function(req, res) {
    var fileName = req.query.fileName;
    var type = req.query.type;
    var url = s3.getSignedUrl('putObject', {
        Bucket: 'prc391-bucket',
        Key: fileName,
        ACL: "public-read",
        ContentType: type
    });
    res.send(url);
});

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