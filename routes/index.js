const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>res.render('welcome'));

router.get('/dashboard', (req, res)=>res.send('welcome dashboard'));

module.exports = router;