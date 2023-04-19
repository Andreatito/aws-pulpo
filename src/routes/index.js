
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
        
 
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'front_end', 'build')));
  
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'front_end', 'build', 'index.hbs'))
    });
    
  }

module.exports = router;