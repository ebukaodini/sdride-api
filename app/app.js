var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var driversRouter = require('./routes/api/drivers');
var ridersRouter = require('./routes/api/riders');
var ordersRouter = require('./routes/api/orders');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// connect to database
mongoose.connect(process.env.MONGODB_CONNECTION_URI, { dbName: 'sdride' })
  .then(() => {
    console.log(`Connected to MongoDB : ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.log(err.message);
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/riders', ridersRouter);
app.use('/api/orders', ordersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.send('404 - Not Found');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('500 - Server Error');
});

module.exports = app;
