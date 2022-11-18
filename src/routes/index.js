
const express = require ('express');
const router = express.Router();

router.get('/',(req, res) => {


    res.render('index');
});



//mostrar audit

router.get("/audit",( req, res) =>{


    
    res.render('audit');
    
    });


    //mostrar atributos

    router.get("/atributos",( req, res) =>{


    
        res.render('atributos');
        
        });



module.exports = router;