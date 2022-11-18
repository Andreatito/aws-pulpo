const { response } = require('express');
const express = require('express');
const router = express.Router();
const {body,validationResult}=require('express-validator')

const pool = require('../database');

const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');





//Agregar cuenta

router.get('/add',isLoggedIn, async(req, res) =>{

    const timezones= await pool.query('SELECT * FROM timezone');
    console.log (timezones);
    const status= await pool.query('SELECT * FROM status');
    console.log (status);
    const plan= await pool.query('SELECT * FROM planes');
    console.log (plan);
    const pais= await pool.query('SELECT * FROM paises');
    console.log (pais);
    const usercta= await pool.query('SELECT * FROM users');
    console.log (pais);

    res.render('./cuentas/add',{timezones,status,plan,pais,usercta});
    
    } );
    

    router.post('/add', isLoggedIn,  async (req, res) => {

            const {nombre,user_id,timezone_id,status_id,plan_id,pais_id}= req.body;
            const newAcount = {

                nombre,
                user_id,
                timezone_id, 
                status_id,
                plan_id,
                pais_id,
                

            };
            await pool.query('INSERT INTO cuentas set ?', [newAcount]);

            req.flash('success','**Cuenta creada correctamente**');

            res.redirect('/crud');
        });

       
        


//listar cuentas
        router.get('/', isLoggedIn,  async (req, res) => {

            
            const {id}=req.params;
            const cuentas= await pool.query(`SELECT 
            cuentas.*,timezone.timezone AS tz,status.nombre AS status_nombre,paises.nombre AS pais_nombre, planes.plan AS plan_nombre
          FROM 
            cuentas 
            LEFT JOIN timezone ON timezone.id_timezone = cuentas.timezone_id 
            LEFT JOIN status ON status.id = cuentas.status_id 
            LEFT JOIN paises ON paises.id = cuentas.pais_id
            LEFT JOIN planes ON planes.id_plan = cuentas.plan_id
              WHERE 
              deleted_at is NULL AND
                user_id = ?`, [req.user.id])   
            console.log(cuentas)                                   
 
            res.render('./cuentas/list',{cuentas});
           
        });





//listar cuentas en detalles de cuenta 

router.get('/show/:id', isLoggedIn, async(req,res) => {

    const {id}=req.params;
    const cuenta= await pool.query(`SELECT 
            cuentas.*,timezone.timezone AS tz,status.nombre AS status_nombre,paises.nombre AS pais_nombre
          FROM 
            cuentas 
            LEFT JOIN timezone ON timezone.id_timezone = cuentas.timezone_id 
            LEFT JOIN status ON status.id = cuentas.status_id 
            LEFT JOIN paises ON paises.id = cuentas.pais_id
            
              WHERE 
                cuentas.id = ?`,[id]);

    const usuarios= await pool.query(`SELECT usuarios_cuenta.*, timezone.timezone AS tz, roles.rol as rl
     FROM usuarios_cuenta 
    LEFT JOIN timezone ON timezone.id_timezone = usuarios_cuenta.timezone  
    LEFT JOIN roles ON roles.id_rol = usuarios_cuenta.rol_id 
    WHERE usuarios_cuenta.cuenta_id=?`,[id]);


    const vehiculos= await pool.query('SELECT COUNT(*) AS total FROM vehiculos WHERE cuentas_id=?',id);
    const usuariosTotal= await pool.query('SELECT COUNT(*) AS total FROM usuarios_cuenta WHERE cuenta_id=?',id);
    console.log(cuenta,usuarios,vehiculos);
    res.render('./cuentas/show', {cuenta: cuenta[0], usuarios:usuarios, vehiculos:vehiculos[0], usuariosTotal:usuariosTotal[0]} );
   

}); 









//Eliminar cuenta
        router.get('/delete/:id', isLoggedIn, async(req,res) => {

               const {id}=req.params;
               await pool.query('UPDATE cuentas SET deleted_at=now() WHERE ID=?',[id]);
               req.flash('success','Cuenta eliminada correctamente');
               res.redirect('/crud');

        });


//Editar cuenta

router.get('/edit/:id', isLoggedIn, async(req,res) => {

    const {id}=req.params;

    
    const cuenta= await pool.query('SELECT * FROM cuentas WHERE ID=?',[id]);
    const status= await pool.query('SELECT *, if(id=?,"S","") AS selected FROM status',[cuenta[0].status_id]);
    const plan= await pool.query('SELECT *, if(id_plan=?,"S","") AS selected FROM planes',[cuenta[0].plan_id]);
    const pais= await pool.query('SELECT *, if(id=?,"S","") AS selected FROM paises',[cuenta[0].pais_id]);
    const timezones=await pool.query('SELECT *, if(id_timezone=?,"S","") AS selected FROM timezone',[cuenta[0].timezone_id]);
    
    console.log (status);
    console.log (pais);
    console.log (cuenta);
    res.render('./cuentas/edit', {cuentas: cuenta[0], status:status, plan:plan, pais:pais, timezones:timezones} );
   

}); 




router.post('/edit/:id', isLoggedIn, async(req,res) => {

  const {id} = req.params;
  const {nombre,plan_id,status_id,pais_id,timezone_id} = req.body;
  const newcta={

    nombre,
                plan_id,
                status_id,
                pais_id,
                timezone_id,
              

  };

console.log(newcta);
await pool.query('UPDATE cuentas set ? WHERE id=?', [newcta, id]);


req.flash('success','Cuenta actualizada correctamente');
res.redirect('/crud');
});
    

//Usuarios



//Agregar usuario de cuenta





router.get("/usuarios",async( req, res) =>{

    const timezones= await pool.query('SELECT * FROM timezone');
    console.log (timezones);

    const roles= await pool.query('SELECT * FROM roles');
    console.log (roles);
    
    res.render('./cuentas/usuarios', {timezones,roles});
    
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
   


    