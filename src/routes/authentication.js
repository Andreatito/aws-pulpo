const express = require('express');
const router = express.Router();
const passport = require('passport');

const {isLoggedIn} = require('../lib/auth');

const pool = require('../database');
const { Passport } = require('passport');
let alert = require('alert'); 

    router.get('/signup',(req,res) =>{
        res.render('auth/signup')
    });



    router.post('/signup', isLoggedIn, async (req, res) => {

      passport.authenticate ('local.signup', {

        successRedirect: '/profile',
        failureRedirect:'/signin',
        failureFlash: true

  })

        console.log("cuentas post add")
       
        var errors= {}
        var nombrePattern=new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü ]{1,50}$/);
        
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

        if(!req.body.is_admin){

          errors.is_admin="*La zona horaria es requerida"

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
/*   
    router.post('/signup', passport.authenticate ('local.signup', {

        successRedirect: '/profile',
        failureRedirect:'/signin',
        failureFlash: true




  })); */

    router.get('/signin', (req, res)=> {

        res.render('auth/signin');

    });


    router.post('/signin', (req, res, next)=> {

        passport.authenticate('local.signin',{

        successRedirect: '/profile',
        failureRedirect:'/signin',
        failureFlash: true

        }) (req,res,next);

        var errors= {}

        if(!req.body.password){
          
          errors.password="*Ingrese un password"
          console.log("ingrese un password")
          
        }

        if(!req.body.username){
          
          errors.username="*Ingrese su usuario"
          
        } console.log ("andrea",Object.keys(errors).length)
        if(Object.keys(errors).length !== 0){

          res.json(
            {
              status:"error",
              message:"Error al crear el usuario",
              errors: errors
            }
          )

        }
        
        
        
        else{
         

          router.get('/profile',isLoggedIn, (req,res) =>{ 

            res.render('profile')
        
        });
        }

    });

   

   

router.get('/logout',(req,res) =>{

    console.log('Logout request');
    req.logOut(function(){
        res.redirect('/signin');
    });
});

module.exports = router;