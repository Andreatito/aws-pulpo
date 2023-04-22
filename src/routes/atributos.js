const express = require ('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');

const pool = require('../database');


//Agregar vehiculo

router.get('/addVehiculo/',isLoggedIn, async(req, res) =>{
    console.log("cuentas get add")
    const brand= await pool.query('SELECT * FROM brand');
    console.log (brand);
    const modelo= await pool.query('SELECT * FROM modelo');
    console.log (modelo);
    const year= await pool.query('SELECT * FROM year');
    console.log (year);
    const color= await pool.query('SELECT * FROM color');
    console.log (color);
    const vehiculo_status= await pool.query('SELECT * FROM vehiculo_status');
    console.log (vehiculo_status);
    const cuentas= await pool.query('SELECT * FROM cuentas');
    console.log (cuentas);
  
    res.render('./atributos/addVehiculo',{brand,modelo,year,color,vehiculo_status,cuentas});
    
  } );
  
  
  router.post('/addVehiculo/', isLoggedIn, async (req, res) => {
  
    console.log("cuentas post add")
   
    var errors= {}
    var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
    
    if(!req.body.nombreV){
  
      errors.nombreV="*El nombre es requerido"
  
    }else if(!nombrePattern.test(req.body.nombreV)){
      errors.nombreV="*Ingrese un nombre válido"
  }
    
    if(!req.body.brand){
  
      errors.brand="*Ingrese la marca del vehículo"
  }
  
    if(!req.body.model){
  
      errors.model="*Debe ingresar el modelo del vehículo"
  
    }
  
    if(!req.body.year){
  
      errors.year="*El año del vehículo es requerido"
  
    }
  
    if(!req.body.color){
  
      errors.color="*El color es requerido"
  
    }
    
    if(!req.body.vehiculo_status){
  
      errors.vehiculo_status="*Ingrese el status del vehículo"
  
    }
  
    if(!req.body.cuenta){
  
      errors.cuenta="*La cuenta es requerida"
      
    }
    console.log ("andrea",Object.keys(errors).length)
    if(Object.keys(errors).length !== 0){
  
      res.json(
        {
          status:"error",
          message:"Error al agregar el vehículo",
          errors: errors
        }
      )
  
    }else{
      
      await pool.query('INSERT INTO vehiculos set ?', [req.body]);
  
      res.json(
      {
        status:"ok",
        message:"Automóvil agregado correctamente"
      }
      )
    }
    
  });



//Agregar conductor

router.get('/conductor/',isLoggedIn, async(req, res) =>{
    console.log("cuentas get add")
    const vehiculos= await pool.query('SELECT * FROM vehiculos');
    console.log (vehiculos);
    const cuentas2= await pool.query('SELECT * FROM cuentas');
    console.log (cuentas2);
   
  
    res.render('./atributos/conductor',{vehiculos, cuentas2});
    
  } );
  
  
  router.post('/conductor/', isLoggedIn, async (req, res) => {
  
    console.log("cuentas post add")
   
    var errors= {}
    var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
    var apellidoPattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
    var licenciaPattern=new RegExp(/[a-zA-Z0-9]*-[a-zA-Z0-9]*/);
    
    if(!req.body.nombre){
  
      errors.nombre="*El nombre es requerido"
  
    }else if(!nombrePattern.test(req.body.nombre)){
      errors.nombre="*Ingrese un nombre válido"
  } 
  if(!req.body.apellido){
  
    errors.apellido="*El apellido es requerido"

  }else if(!apellidoPattern.test(req.body.apellido)){
    
    errors.apellido="*Ingrese un apellido válido"
}
    
    if(!req.body.licencia){
  
      errors.licencia="*Ingrese la licencia asociada al conductor"

  }else if(!licenciaPattern.test(req.body.licencia)){
    
    errors.licencia="*Ingrese una licencia valida (El formato debe ser de tipo WW-1234)"
}
  
    if(!req.body.vehiculo_id){
  
      errors.vehiculo_id="*Debe seleccionar un vehículo"
  
    }

    if(!req.body.Cuenta_id){
  
      errors.Cuenta_id="*Debe seleccionar una cuenta para asociar al conductor"
  
    }
  
    console.log ("andrea",Object.keys(errors).length)
    if(Object.keys(errors).length !== 0){
  
      res.json(
        {
          status:"error",
          message:"Error al agregar el conductor",
          errors: errors
        }
      )
  
    }else{
      
      await pool.query('INSERT INTO conductor set ?', [req.body]);
  
      res.json(
      {
        status:"ok",
        message:"Conductor agregado correctamente"
      }
      )
    }
    
  });

//Agregar datos de facturacion

router.get('/datosfacturacion/',isLoggedIn, async(req, res) =>{
  console.log("cuentas get add")
  const vehiculos= await pool.query('SELECT * FROM vehiculos');
  console.log (vehiculos);
  const cuentas2= await pool.query('SELECT * FROM cuentas');
  console.log (cuentas2);
 

  res.render('./atributos/datosfacturacion',{vehiculos, cuentas2});
  
} );


router.post('/datosfacturacion/', isLoggedIn, async (req, res) => {

  console.log("cuentas post add")
 
  var errors= {}
  var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
  
  if(!req.body.nombre){

    errors.nombre="*El nombre es requerido"

  }else if(!nombrePattern.test(req.body.nombre)){
    errors.nombre="*Ingrese un nombre válido"
} 
if(!req.body.apellido){

  errors.apellido="*El apellido es requerido"

}else if(!nombrePattern.test(req.body.apellido)){
  
  errors.apellido="*Ingrese un apellido válido"
}
  
  if(!req.body.licencia){

    errors.licencia="*Ingrese la licencia asociada al conductor"
}

  if(!req.body.vehiculo_id){

    errors.vehiculo_id="*Debe seleccionar un vehículo"

  }

  if(!req.body.Cuenta_id){

    errors.Cuenta_id="*Debe seleccionar una cuenta para asociar al conductor"

  }

  console.log ("andrea",Object.keys(errors).length)
  if(Object.keys(errors).length !== 0){

    res.json(
      {
        status:"error",
        message:"Error al agregar el conductor",
        errors: errors
      }
    )

  }else{
    
    await pool.query('INSERT INTO conductor set ?', [req.body]);

    res.json(
    {
      status:"ok",
      message:"Conductor agregado correctamente"
    }
    )
  }
  
});





module.exports = router;