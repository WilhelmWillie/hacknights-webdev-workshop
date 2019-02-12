const express = require('express');
const path = require('path');

const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// Set up session and cookies
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
  secret: 'fight on for old sc'
}));

app.use(flash());

// Connect to database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE || 'mongodb://localhost/troytips')

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

// Set static library to be our public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, () => console.log('Launching our app on port 3000 🚀'));
