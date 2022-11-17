const { response } = require('express');
const express = require('express');
const router = express.Router();
const {body,validationResult}=require('express-validator')

const pool = require('../database');

const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');





router.get('/add',isLoggedIn, (req, res) =>{

    res.render('./cuentas/add');
    
    } );
    
//Agregar cuenta
    router.post('/add', isLoggedIn,  async (req, res) => {

            const {nombre,plan,status,pais,timezone}= req.body;
            const newAcount = {

                nombre,
                plan,
                status,
                pais,
                timezone,
                user_id: req.user.id

            };
            await pool.query('INSERT INTO cuentas set ?', [newAcount]);
            req.flash('success','**Cuenta creada correctamente**');
            res.redirect('/crud');
        });

       



//listar cuentas
        router.get('/', isLoggedIn,  async (req, res) => {

            const cuentas= await pool.query('SELECT * FROM cuentas WHERE user_id=?', [req.user.id])   
            console.log(cuentas)
            res.render('./cuentas/list',{cuentas});
           
        });



//listar cuentas en detalles de cuenta 

router.get('/show/:id', isLoggedIn, async(req,res) => {

    const {id}=req.params;
    const cuenta= await pool.query('SELECT * FROM cuentas WHERE ID=?',[id]);
    const usuarios= await pool.query('SELECT * FROM usuarios_cuenta WHERE cuenta_id=?',[id]);
    const plan= await pool.query('SELECT * FROM vehiculos WHERE cuentas_id=?',[id]);
    console.log(cuenta,usuarios,plan);
    res.render('./cuentas/show', {cuenta: cuenta[0], usuarios:usuarios, plan:plan} );
   

}); 









//Eliminar cuenta
        router.get('/delete/:id', isLoggedIn, async(req,res) => {

               const {id}=req.params;
               await pool.query('DELETE FROM cuentas WHERE ID=?',[id]);
               req.flash('success','Cuenta eliminada correctamente');
               res.redirect('/crud');

        });


//Editar cuenta
router.get('/edit/:id', isLoggedIn, async(req,res) => {

    const {id}=req.params;
    const cuenta= await pool.query('SELECT * FROM cuentas WHERE ID=?',[id]);
    
    res.render('./cuentas/edit', {cuentas: cuenta[0]} );
   

}); 




router.post('/edit/:id', isLoggedIn, async(req,res) => {

  const {id} = req.params;
  const {nombre,plan,status,pais,timezone} = req.body;
  const newcta={

    nombre,
                plan,
                status,
                pais,
                timezone,
              

  };

console.log(newcta);
await pool.query('UPDATE cuentas set ? WHERE id=?', [newcta, id]);
req.flash('success','Cuenta actualizada correctamente');
res.redirect('/crud');
});
    

//Usuarios



//Agregar usuario de cuenta


router.get("/usuarios",( req, res) =>{


    
    res.render('./cuentas/usuarios');
    
    });

router.post('/usuarios', isLoggedIn,  async (req, res) => {

    const {nombre,email,timezone,cuenta_id,rol_id}= req.body;
    const newUser = {

        
        nombre,
        email,
        timezone,
        cuenta_id,
        rol_id
        

    };
    await pool.query('INSERT INTO usuarios_cuenta set ?', [newUser]);
    req.flash('success','**Usuario creado correctamente**');
    res.redirect('/crud');


});















    module.exports = router;
   


    