const e = require('connect-flash');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const {body,validationResult}=require('express-validator')
const passport = require('passport');
const pool = require('../database');

const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');
const {validateCreate} = require('../routes/validation');





//Agregar cuenta

router.get('/add',isLoggedIn, async(req, res) =>{
    console.log("cuentas get add")
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
    
    
    
router.post('/add', isLoggedIn, async (req, res) => {

            console.log("cuentas post add")
           
            var errors= {}
            var nombrePattern=new RegExp(/^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/);
            
            if(!req.body.nombre){

              errors.nombre="*El nombre es requerido"

            }else if(!nombrePattern.test(req.body.nombre)){
              errors.nombre="*Ingrese un nombre válido.Unicamente letras y espacios, no se permiten caracteres especiales."
          }

            if(!req.body.plan_id){

              errors.plan_id="*El plan es requerido"

            }

            if(!req.body.status_id){

              errors.status_id="*El status es requerido"

            }

            if(!req.body.pais_id){

              errors.pais_id="*El país es requerido"

            }

            if(!req.body.timezone_id){

              errors.timezone_id="*La zona horaria es requerida.Considera la zona horaria en que se gestionará la cuenta."

            }

            if(!req.body.user_id){

              errors.user_id="*El usuario es requerido. Ingresa el usuario que gestionará esta cuenta."
              
            }
            console.log ("andrea",Object.keys(errors).length)
            if(Object.keys(errors).length !== 0){

              res.json(
                {
                  status:"error",
                  message:"Error al crear la cuenta",
                  errors: errors
                }
              )

            }else{
              
              await pool.query('INSERT INTO cuentas set ?', [req.body]);

              res.json(
              {
                status:"ok",
                message:"Cuenta creada correctamente"
              }
              )
            }
            
        });

       
        


//listar cuentas
        router.get('/', isLoggedIn,  async (req, res) => {

            
            const {id}=req.params;
            const cuentas= await pool.query(`SELECT 
            cuentas.*,
            timezone.timezone
             AS tz,status.nombre 
             AS status_nombre,paises.nombre 
             AS pais_nombre, planes.plan 
             AS plan_nombre
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
            cuentas.*,timezone.timezone AS tz,status.nombre AS status_nombre,paises.nombre AS pais_nombre, planes.descripcion AS descripcion
          FROM 
            cuentas 
            LEFT JOIN timezone ON timezone.id_timezone = cuentas.timezone_id 
            LEFT JOIN status ON status.id = cuentas.status_id 
            LEFT JOIN paises ON paises.id = cuentas.pais_id
            LEFT JOIN planes ON planes.id_plan = cuentas.plan_id
            
              WHERE 
                cuentas.id = ?`,[id]);

 

    const vehiculos = await pool.query(`
      SELECT  vehiculos.*,
        vehiculo_tipo.tipo AS tp, 
        brand.nombre AS brand, 
        modelo.nombre AS modelo, 
        year.nombre AS year, 
        color.color AS color, 
        vehiculo_status.vehiculo_status AS vhls
      FROM
        vehiculos 
        LEFT JOIN brand ON brand.id = vehiculos.brand
        LEFT JOIN modelo ON modelo.id = vehiculos.model
        LEFT JOIN year ON year.id = vehiculos.year
        LEFT JOIN color ON color.id = vehiculos.color
        LEFT JOIN vehiculo_status ON vehiculo_status.id = vehiculos.vehiculo_status
        LEFT JOIN vehiculo_tipo ON vehiculo_tipo.id = vehiculos.tipo1_id
      WHERE 
        cuenta=?`, id);

  //Listar usuarios en detalle de cuenta
    const usuarios= await pool.query(`SELECT usuarios_cuenta.*, timezone.timezone AS tz, roles.rol as rl
     FROM usuarios_cuenta 
    LEFT JOIN timezone ON timezone.id_timezone = usuarios_cuenta.timezone  
    LEFT JOIN roles ON roles.id_rol = usuarios_cuenta.rol_id 
    WHERE deleted_at is NULL AND usuarios_cuenta.cuenta_id=?`,[id]);


   

//Mostrar tabla Plan contratado

    const nVehiculos= await pool.query('SELECT COUNT(*) AS total FROM vehiculos WHERE cuenta=?',id);
    const usuariosTotal= await pool.query('SELECT COUNT(*) AS total FROM usuarios_cuenta WHERE cuenta_id=?',id);
    const conductoresTotal= await pool.query('SELECT COUNT(*) AS total FROM conductor WHERE cuenta_id=?',id);
    
   
    
    res.render('./cuentas/show', {cuenta: cuenta[0], usuarios:usuarios, nVehiculos:nVehiculos[0], 
      usuariosTotal:usuariosTotal[0],conductoresTotal:conductoresTotal[0], vehiculos:vehiculos} );
    

}); 






//Eliminar cuenta

        router.get('/delete/:id', isLoggedIn, async(req,res) => {

               const {id}=req.params;
               await pool.query('UPDATE cuentas SET deleted_at=now() WHERE id=?',[id]);
               req.flash('success','*Cuenta eliminada correctamente');
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

  console.log("Editing account" , id)
  var errors= {}

  var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
            if(!req.body.nombre){

              errors.nombre="*El nombre es requerido"

            } else if(!nombrePattern.test(req.body.nombre)){
              errors.nombre="*Ingrese un nombre válido"
          }

            if(!req.body.plan_id){

              errors.plan_id="*El plan es requerido"

            }

            if(!req.body.status_id){

              errors.status_id="*El status es requerido"

            }

            if(!req.body.pais_id){

              errors.pais_id="*El país es requerido"

            }

            if(!req.body.timezone_id){

              errors.timezone_id="*La zona horaria es requerida"

            }

            
            if(Object.keys(errors).length !== 0){

              res.json(
                {
                  status:"error",
                  message:"Error al actualizar la cuenta",
                  errors: errors
                }
              )



              }else{

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

          res.json(
            {
              status:"ok",
              message:"Cuenta actualizada correctamente"
            }
            )

            }
});
    






//Usuarios



//Agregar usuario de cuenta





router.get("/usuarios",async( req, res) =>{

    const timezones= await pool.query('SELECT * FROM timezone');
    console.log (timezones);

    const roles= await pool.query('SELECT * FROM roles');
    console.log (roles);
    
    const cuentas= await pool.query('SELECT * FROM cuentas');
    console.log (cuentas);
  


    res.render('./cuentas/usuarios', {timezones,roles,cuentas});
    
    });



    

router.post('/usuarios', isLoggedIn,  async (req, res) => {

    
  const {id} = req.params;
     
        var errors= {}

                  var emailPattern = new RegExp(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i);
                  var nombrePattern=new RegExp(/^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/);
                  var userpattern=new RegExp("[0-9]");


                  if(!req.body.nombre){
      
                    errors.nombre="*El nombre es requerido"
      
                  }else if(!nombrePattern.test(req.body.nombre)){
                    errors.nombre="*Ingrese un nombre válido. El usuario debe incluir solo caracteres y espacios"
                }
      
                  if(!req.body.rol_id){
      
                    errors.rol_id="*El rol es requerido"
      
                  }
      
                  if(!req.body.email) {
                    errors.email="*El email es requerido"
                  } else if(!emailPattern.test(req.body.email)){
                      errors.email="*Introduzca un email válido o con el formato correcto : ej. xxa1@email.com"
                  }
      
                  if(!req.body.timezone){
      
                    errors.timezone="*La zona horaria es requerida.Considere la zona horaria de manejo de cuenta."
      
                  }
      
                 if(!req.body.user_id){
      
                  errors.user_id="*Tu usuario es requerido"

                }else if(!userpattern.test(req.body.user_id)){
                  errors.user_id="*Ingrese un ID de cuenta válido"
                }
                
                if(!req.body.cuenta_id){
      
                  errors.cuenta_id="*La cuenta es requerida. Selecciona la cuenta a la que será asociado el usuario."
    
                }

                  if(Object.keys(errors).length !== 0){

                    res.json(
                      {
                        status:"error",
                        message:"*Error al crear el usuario",
                        errors: errors
                      }
                    )
      
      
      
                    }else{
      

                    const {nombre,rol_id,email,timezone,cuenta_id,user_id}= req.body;
                    const newUser ={
                
                        
                        nombre,
                        rol_id,
                        email,
                        timezone,
                        cuenta_id,
                        user_id
                        
                  

              
        
    };

    console.log(newUser);

    await pool.query('INSERT INTO usuarios_cuenta set ?', [newUser, id]);
    
    
      res.json(
        {
          status:"ok",
          message:"Usuario creado correctamente",
          errors: errors
          
        }
      )
      }
    });

   //Reset Password



   router.get('/resetPass/:id', isLoggedIn, async(req,res) => {


    const {id} =req.params;

    
    const usuario= await pool.query('SELECT * FROM users WHERE id=?',[id]);
   
    
    console.log (id);

    res.render('./cuentas/resetPass', {usuario: usuario} );
   

}); 

router.post('/resetPass/:id', isLoggedIn, async(req,res) => {

  const {id} = req.params;

  console.log("Editing user" , id)
  var errors= {}
  var passPattern=new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$/)

 


            if(!req.body.password){

              errors.password="*El campo nueva contraseña no puede quedar vacío"

            }else if(!passPattern.test(req.body.password)){
              errors.password="*La contraseña debe contener al menos una letra mayúscula, una minúscula, un número , un carácter especial y tener una longitud entre 8 y 16 caracteres. "
    
            }if(!req.body.password2){

              errors.password2="*El campo nueva contraseña no puede quedar vacío"

            }else if(!passPattern.test(req.body.password2)){
              errors.password2="*La contraseña debe contener al menos una letra mayúscula, una minúscula, un número , un carácter especial y tener una longitud entre 8 y 16 caracteres. "
    
            }else if(req.body.password2 !== req.body.password){
              errors.password2="*Las contraseñas no coinciden. "
    
            }
            
            if(Object.keys(errors).length !== 0){

              res.json(
                {
                  status:"error",
                  message:"Error al actualizar la contraseña",
                  errors: errors
                }
              )



              }else{

  const {password,password2} = req.body;
  const user={

                password,
                password2
              

  };

console.log(user);

user.password = await helpers.encryptPassword(password,password2);

await pool.query('UPDATE users set ? WHERE id=?', [user, id]);

          res.json(
            {
              status:"ok",
              message:"Usuario actualizado correctamente"
            }
            )

            }
});


passport.serializeUser((user, done) => {
  done(null, user.id);
  });
  
  
  
  passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
  });




module.exports = router;
   
   

  
