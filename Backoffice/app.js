var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const authController = require('./controllers/authController');
const cors = require('cors');

var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var propertyRouter = require('./routes/properties');
var eventRouter = require('./routes/events');
const { log } = require('console');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://dbUser:123@clusterpaw.iohpxrk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true }) 
  .then(() => console.log('Connected to DB!'))
  .catch(() => console.log('Error connecting to DB!'));

var app = express();
app.use(cors()); // Permitir solicitações de qualquer origem

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json')
const usersRouter = require('./routes/users');

authController.applyCorsMiddleware(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/properties', propertyRouter);
app.use('/events', eventRouter);

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
