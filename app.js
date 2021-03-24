const createError = require('http-errors');
const express = require('express');
const session = require ('express-session');
const nedbStorage = require ('tch-nedb-session') (session);
const path = require('path');
const cookieParser = require('cookie-parser');
const csurf = require('csurf')
const logger = require('morgan');
const helmet = require('helmet')

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/auth/users');
const api = require('./routes/api/api');

// Used to sync part.db with plex api
const { getPartNumbers } = require('./models/fetchPlexAPI');
const timeInterval = 1000 * 60 * 60 * 12;
setInterval(() => {
	getPartNumbers()
}, timeInterval );

// getPartNumbers();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// app.use(helmet())

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"default-src": ["'self'"],
			"base-uri": ["'self'"],
			"block-all-mixed-content": [],
			"font-src": ["'self'", 'http:', 'data:'],
			"frame-ancestors": ["'self'"],
			"img-src": ["'self'", 'data:'],
			"object-src": ["'none'"],
			"script-src": ["'self'"],
			"script-src-attr": ["'none'"],
			"style-src": ["'self'", "http: 'unsafe-inline'"],
			// "upgrade-insecure-requests": [],
		}
	})
);

	
	

	
app.use(logger('dev'));

app.use('/api', api);

let expiration = 24 * 60 * 60 * 1000;
let sessionStore = new nedbStorage ({
	filename: './models/sessions.db',
	expiration: expiration,
	expirationType: 'interval',
	autoCompactInterval: 15 * 60 * 1000,
	expirationInterval: 24 * 60 * 60 * 1000,
	user: '',
});

app.use (session ({
	secret: process.env.SESSION_SECRET,
	cookie: {
		maxAge: expiration,
		user: '',
	},
	resave: false,
	saveUninitialized: false,
	store: sessionStore
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(csurf());


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
