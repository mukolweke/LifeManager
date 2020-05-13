const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = new express();

require('dotenv').config();

const db = process.env.DB_CONNECT;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology:true })
.then(()=>console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended:false }));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running at port ${PORT}`));
