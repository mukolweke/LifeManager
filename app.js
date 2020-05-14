const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = new express();

// env 
require('dotenv').config();

const PORT = process.env.PORT || 3000

// Mongo Conn
const db = process.env.DB_CONNECT;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser: enebles data to be fetched in req.body
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen(PORT, console.log(`Server running at port ${PORT}`));
