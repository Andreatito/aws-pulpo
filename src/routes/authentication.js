const express = require('express');
const router = express.Router();
const passport = require('passport');

const {isLoggedIn} = require('../lib/auth');

    router.get('/signup',(req,res) =>{
        res.render('auth/signup')
    });



    router.post('/signup', isLoggedIn, async (req, res) => {

        console.log("cuentas post add")
       
        var errors= {}
        var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
        
        if(!req.body.username){

          errors.username="*Ingrese un usuario"

        }else if(!nombrePattern.test(req.body.username)){
          errors.username="*Ingrese un usuario válido"
      }

        if(!req.body.password){

          errors.password="*Ingrese un password"

        }

        if(!req.body.password2){

          errors.password2="*Debe confirmar su password"

        }

        if(!req.body.fullname){

          errors.fullname="*El Nombre es requerido"

        }

        if(!req.body.role){

          errors.role="*La zona horaria es requerida"

        }

        
        console.log ("andrea",Object.keys(errors).length)
        if(Object.keys(errors).length !== 0){

          res.json(
            {
              status:"error",
              message:"Error al crear el usuario",
              errors: errors
            }
          )

        }else{
          
          await pool.query('INSERT INTO users set ?', [req.body]);

          res.json(
          {
            status:"ok",
            message:"Usuario creado correctamente"
          }
          )
        }
        
    });

   
    









    router.get('/signin', (req, res)=> {

        res.render('auth/signin');

    });

    router.post('/signin', (req, res, next)=> {

        passport.authenticate('local.signin',{

        successRedirect: '/profile',
        failureRedirect:'/signin',
        failureFlash: true

        })(req,res,next);

    });

    router.get('/profile',isLoggedIn, (req,res) =>{

        res.render('profile')
    
    });

router.get('/logout',(req,res) =>{

    console.log('Logout request');
    req.logOut(function(){
        res.redirect('/signin');
    });
});

module.exports = router;