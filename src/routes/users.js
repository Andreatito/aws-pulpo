const express = require ('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');

const pool = require('../database');

router.get('/:id/edit', isLoggedIn, async(req,res) => {

    const {id}=req.params;
  
    const usuario= await pool.query('SELECT * FROM usuarios_cuenta WHERE usuario_id=?',[id]);
    const role= await pool.query('SELECT *, if(id_rol=?,"S","") AS selected FROM roles',[usuario[0].rol_id]);
    const timezones=await pool.query('SELECT *, if(id_timezone=?,"S","") AS selected FROM timezone',[usuario[0].timezone]);
    
    console.log (usuario);
    res.render('./users/edit', {usuario:usuario[0], roles:role, timezones:timezones});

  
});

    router.post('/:id/edit', isLoggedIn, async(req,res) => {
        const {id} = req.params;
      
        console.log("Editing user" , id)
        var errors= {}
      
        var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
        var emailPattern = new RegExp(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i);

                  if(!req.body.nombre){
      
                    errors.nombre="*El nombre de usuario es requerido"
      
                  } else if(!nombrePattern.test(req.body.nombre)){
                    errors.nombre="*Ingrese un nombre válido"
                }
      
                  if(!req.body.rol_id){
      
                    errors.rol_id="*El rol es requerido"
      
                  }
      
                  if(!req.body.email){
      
                    errors.email="*El email es requerido"
      
                  } else if(!emailPattern.test(req.body.email)){
                    errors.email="*Introduzca un email válido"
                }
      
                  if(!req.body.timezone_id){
      
                    errors.timezone_id="*La zona horaria es requerida"
      
                  }
      
                
      
                  
                  if(Object.keys(errors).length !== 0){
      
                    res.json(
                      {
                        status:"error",
                        message:"Error al crear la cuenta",
                        errors: errors
                      }
                    )
      
      
      
                    }else{
      
        const {nombre,rol_id,email,timezone_id} = req.body;
        const newuser={
      
                     nombre,
                      rol_id,
                      email,
                      timezone: timezone_id,
                   
                    
      
        };
      
      console.log(newuser);
      await pool.query('UPDATE usuarios_cuenta set ? WHERE usuario_id=?', [newuser, id]);
      
                res.json(
                  {
                    status:"ok",
                    message:"Usuario creado correctamente"
                  }
                  )
      
                  }
      });
          
      
      
      //Listar usuarios en showusers




router.get('/showUser/', isLoggedIn, async(req,res) => {

  const {id}=req.params;

  const usuarioC= await pool.query(`SELECT usuarios_cuenta.*, timezone.timezone AS tz, roles.rol as rl
  FROM usuarios_cuenta 
  LEFT JOIN timezone ON timezone.id_timezone = usuarios_cuenta.timezone  
  LEFT JOIN roles ON roles.id_rol = usuarios_cuenta.rol_id 
  LEFT JOIN users ON users.id = usuarios_cuenta.user_id 
  WHERE deleted_at is NULL AND usuarios_cuenta.user_id=?`,[req.user.id]);  
   


  console.log(usuarioC) 
 
 
  res.render('./users/showUser', {usuarioC :usuarioC} );
    
});


//Eliminar cuenta
router.get('/delete/:id', isLoggedIn, async(req,res) => {

  const {id}=req.params;
  await pool.query('UPDATE usuarios_cuenta SET deleted_at=now() WHERE usuario_id=?',[id]);
  req.flash('success','*Usuario eliminado correctamente');
  res.redirect('/user/showUser');

  

});




module.exports = router;