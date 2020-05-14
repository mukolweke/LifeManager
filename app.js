const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = new express();

// env 
require('dotenv').config();

const port = process.env.PORT || 3000

// Passport config
require('./src/config/passport')(passport);

// Mongo config
const db = process.env.DB_CONNECT;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => debug(chalk.yellow('MongoDB Connected')))
  .catch(err => console.log(err));

// Static files
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', express.static(path.join(__dirname, '/public/css')));


// EJS
app.use(expressLayouts);
app.set('views', './src/views');
app.set('view engine', 'ejs');

// BodyParser: enebles data to be fetched in req.body
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//Routes
app.use('/', require('./src/routes/index'));
app.use('/users', require('./src/routes/users'));

const User = require('./src/models/User');
app.use('/api', require('./src/routes/auth')(User));


app.server = app.listen(port, () => {
  debug(chalk.red(`\nServer runnning at port ${port}\n`));
});

module.exports = app;