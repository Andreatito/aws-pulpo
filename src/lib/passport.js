
const { createPool } = require('mysql');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;


const pool = require('../database');
const helpers = require('../lib/helpers');

//login

passport.use('local.signin', new LocalStrategy({

    usernameField: 'username',
    passwordField:'password',
    passReqToCallback: true

}, async (req, username, password, done) => {

    
    const rows = await pool.query('SELECT * FROM users WHERE username =?', [username]);
    
    if(rows.length > 0) {

        const user= rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)//valida contraseña en BD con la ingresada
        if(validPassword){

            done(null, user, req.flash( 'success','welcome' + user.username)); //Ingreso correcto
        } else {

            done(null, false, req.flash('message','contraseña invalida')); //Password incorrecto
        }
    }else {

        return done(null,false, req.flash('message','El usuario ingresado no existe'));//El usuario no existe
    }


}));

//registro de usuarios customer service

passport.use('local.signup', new LocalStrategy({



    usernameField: 'username',
    passwordField:'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const{fullname} =req.body;

    const newUser = {

    username,
    password,
    fullname

};

newUser.password= await helpers.encryptPassword(password);// cifrado de password

const result = await pool.query('INSERT INTO users SET ?', [newUser]);
newUser.id = result.insertId;
return done(null, newUser);

}));

passport.serializeUser((user, done) =>{

done(null, user.id);


});

passport.deserializeUser(async(id, done) => {

const rows= await pool.query('SELECT * FROM users WHERE id=?', [id]);
done(null,rows[0]);

});



