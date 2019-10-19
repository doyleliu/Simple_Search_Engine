const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const queryPaperRouter = require('./background/queryPaper');
const queryDocRelRouter = require('./background/queryDocRel');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/backend/queryPaper', queryPaperRouter);
app.use('/backend/queryDocRel', queryDocRelRouter);

app.use(function(req, res, next) {
    next(createError(404));
  });

app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const port = process.env.PORT || 50000;

app.listen(50000, ()=> {
    console.log(`server running @${port}`)
});


module.exports = app;