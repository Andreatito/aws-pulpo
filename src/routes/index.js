
const express = require ('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');


const fs= require('fs');
const {content} = require("./crud")


//crear PDF





//mostrar audit

router.get("/audit",( req, res) =>{
    res.render('audit');
});



router.use('/crud',require('./crud'));
router.use('/user', require('./users'));
router.use('/atributos', require('./atributos'));
        
 



module.exports = router;