const express = require('express');
const router = express.Router();
const passport = require('passport');

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

const pool = require('../database');
const { Passport } = require('passport');
let alert = require('alert'); 
const helpers = require('../lib/helpers');


    router.get('/signup',isLoggedIn, async(req, res)=>{


      const userT= await pool.query('SELECT * FROM user_tipo');
      console.log (userT);

        res.render('auth/signup',{userT});

    });


 //formulario signup

router.post('/signup',isLoggedIn

,async (req, res, done) =>{


console.log("cuentas post add")

        const {id} = req.params;
              
        var errors= {}
        var nombrePattern=new RegExp(/^[\w-6]{10,15}$/);
        var passPattern=new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$/)
        var fullPattern= new RegExp(/^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/)
        var empleadoPattern=new RegExp(/^[\w-6]{5,15}$/);

        if(!req.body.username){

          errors.username="*Ingrese un nombre de usuario"

        }else if(!nombrePattern.test(req.body.username)){
          errors.username="*Ingrese un usuario válido. El nombre de usuario debe ser alfanúmerico y con una longitud de 10 a 15 caracteres. Puede incluir un guión"

        }if(!req.body.password){

          errors.password="*Ingrese un password"


        }else if(!passPattern.test(req.body.password)){
          errors.password="*La contraseña debe contener al menos una letra mayúscula, una minúscula, un número , un carácter especial y tener una longitud entre 8 y 16 caracteres. "

        } if(!req.body.password2){

          errors.password2="*Ingrese nuevamente el password"


        }else if(!passPattern.test(req.body.password2)){
          errors.password2="*La contraseña debe contener al menos una letra mayúscula, una minúscula, un número , un carácter especial y tener una longitud entre 8 y 16 caracteres. "

        }else if(req.body.password2 !== req.body.password){
          errors.password2="*Las contraseñas no coinciden. "

        }if(!req.body.fullname){

          errors.fullname="*Ingrese el nombre del usuario"

        }else if(!fullPattern.test(req.body.fullname)){
          errors.fullname="*Ingrese un usuario válido. Ingrese únicamente letras y espacios"

        }if(!req.body.apellido){

          errors.apellido="*Ingrese el apellido del usuario"

        }else if(!fullPattern.test(req.body.apellido)){
          errors.apellido="*Ingrese un apellido válido. Ingrese únicamente letras y espacios"

        }if(!req.body.is_admin){

          errors.is_admin="*Seleccione un tipo de usuario"

        }if(!req.body.empleado){

          errors.empleado="*Ingrese un número de empleado"

        }else if(!empleadoPattern.test(req.body.empleado)){

          errors.empleado="El número de empleado puede  contener letras o número y guión. no se permiten los espacios."

        }
        
        
        
        if(Object.keys(errors).length !== 0){

          res.json(
            {
              status:"error",
              message:"*Error al crear el usuario",
              errors: errors
            }
          )

          }



        else{

          const { username,password,fullname,apellido,password2,is_admin,empleado } = req.body;
          let newUser = {
          
            username,
            password,
            fullname,
            apellido,
            password2,
            is_admin,
            empleado

          };


newUser.password = await helpers.encryptPassword(password,password2);

// Saving in the Database

const result = await pool.query('INSERT INTO users SET ? ', newUser);
newUser.id = result.insertId;

res.json(
  {
    status:"ok",
    message:"Usuario creado correctamente",
    errors: errors
    
  }
)

};



});



passport.serializeUser((user, done) => {
done(null, user.id);
});



passport.deserializeUser(async (id, done) => {
const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
done(null, rows[0]);
});






  


   //Signin

    router.get('/signin', (req, res)=> {

        res.render('auth/signin');

    });


    router.post('/signin', (req, res, next) => {

    /*   req.check('username', 'Username is Required').notEmpty();
      req.check('password', 'Password is Required').notEmpty(); */

      // const errors = req.validationErrors();
      // if (errors.length > 0) {
      //   req.flash('message', errors[0].msg);
      //   res.redirect('/signin');
      // }
      passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
      })(req, res, next);
    });

       
    router.get('/profile',isLoggedIn, (req,res) =>{ 

      return res.render('profile')
   
    });


router.get('/logout',(req,res) =>{

    console.log('Logout request');
    req.logOut(function(){
        res.redirect('/signin');
    });
});

module.exports = router;