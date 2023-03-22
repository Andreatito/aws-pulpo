
const express = require ('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');

router.get('/', isLoggedIn, (req, res) => {


    res.render('index');
});



//mostrar audit

router.get("/audit",( req, res) =>{
    res.render('audit');
});


router.use('/crud',require('./crud'));
router.use('/user', require('./users'));
        


module.exports = router;