const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = new express();

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

require('dotenv').config();

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running at port ${PORT}`));
