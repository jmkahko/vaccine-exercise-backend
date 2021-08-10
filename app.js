const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Tietokanta yhteys ja ENV tiedosto määrittely
const mongoose = require('mongoose'); // MongoDB tietokanta
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua
const cors = require('cors'); // Corssin käyttöönotto

// Reitit
const indexRouter = require('./routes/index');
const vaccinesRouter = require('./routes/vaccines');

let app = express();

// cors avaa yhteyden palvelinsovelluksen ja asiakassovelluksen välille, jos nämä sijaitsevat eri palvelimilla
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};

// Otetaan cors käyttöön apppiin
app.use(cors(corsOptions));

// MongoDB tietokantaan yhteyden muodostus
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Reittien käyttöönotto
app.use('/', indexRouter);
app.use('/vaccines', vaccinesRouter);

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
