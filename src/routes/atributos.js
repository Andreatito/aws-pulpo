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
    const vehiculo_tipo= await pool.query('SELECT * FROM vehiculo_tipo');
    console.log (vehiculo_tipo);
  
    res.render('./atributos/addVehiculo',{brand,modelo,year,color,vehiculo_status,cuentas,vehiculo_tipo});
    
  } );
  
  
  router.post('/addVehiculo/', isLoggedIn, async (req, res) => {
  
    console.log("cuentas post add")
   
    var errors= {}

    
    if(!req.body.tipo1_id){
  
      errors.tipo1_id="*El nombre es requerido"
  
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
    if(!req.body.placa){
  
      errors.cuenta="*Ingresa la placa del vehículo"
      
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
    const estatus= await pool.query('SELECT * FROM estatus_conductor');
    console.log (estatus);
   
  
    res.render('./atributos/conductor',{vehiculos, cuentas2,estatus});
    
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
    
    errors.licencia="*Ingrese una licencia válida (El formato debe ser de tipo WW-1234)"
}
  
    if(!req.body.vehiculo_id){
  
      errors.vehiculo_id="*Debe seleccionar un vehículo"
  
    }

    if(!req.body.estatus){
  
      errors.estatus="*Debe seleccionar un estatus"
  
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



//Detalle conductores


router.get('/detConductor/', isLoggedIn, async(req,res) => {

 
  const {id}=req.params;

  const detConductor= await pool.query(`SELECT conductor.*, vehiculos.placa AS pl, cuentas.nombre as cta, estatus_conductor.tipo AS est
  FROM conductor
  LEFT JOIN vehiculos ON vehiculos.id_vehiculo = conductor.vehiculo_id
  LEFT JOIN users ON users.id = conductor.usuario_id 
  LEFT JOIN cuentas ON cuentas.id =conductor.cuenta_id
  LEFT JOIN estatus_conductor ON estatus_conductor.id = conductor.Estatus
  WHERE conductor.usuario_id=?`,[req.user.id]);


  console.log(detConductor) 
 
 
  res.render('./atributos/detConductor', {detConductor: detConductor} );
    
});




//Suspender conductor

router.get('/detConductor/:id', isLoggedIn, async(req,res) => {

  const {id}=req.params;

  await pool.query('UPDATE Conductor SET Estatus= "3" WHERE id=?',[id]);

  const detConductor= await pool.query(`SELECT conductor.*, vehiculo_tipo.tipo AS vh, cuentas.nombre as cta, estatus_conductor.tipo AS est
  FROM conductor

  LEFT JOIN vehiculos ON vehiculos.id_vehiculo = conductor.vehiculo_id
  LEFT JOIN users ON users.id = conductor.usuario_id 
  LEFT JOin cuentas ON cuentas.id =conductor.cuenta_id
  LEFT JOIN estatus_conductor ON estatus_conductor.id = conductor.Estatus
  LEFT JOIN vehiculo_tipo ON vehiculo_tipo.id = conductor.vehiculo_id


  WHERE conductor.usuario_id=?`,[req.user.id]  );
 
  res.render('./atributos/detConductor', {detConductor :detConductor});

});


//Detalle vehículos


router.get('/detVehiculos/', isLoggedIn, async(req,res) => {

  const {id}=req.params;

  const detVehiculos= await pool.query(`SELECT * FROM  vehiculos `);  


  console.log(detVehiculos) 
 
 
  res.render('./atributos/detVehiculos', {detVehiculos: detVehiculos} );
    
});



  //Agregar Mantenimiento


   
router.get('/addmantenimiento/',isLoggedIn, async(req, res) =>{
  console.log("cuentas get add")
  const vehiculos= await pool.query('SELECT * FROM vehiculos');
  console.log (vehiculos);
  const cuentas2= await pool.query('SELECT * FROM cuentas');
  console.log (cuentas2);
 

  res.render('./atributos/addMantenimiento',{vehiculos, cuentas2});
  
} );


router.post('/addMantenimiento/', isLoggedIn, async (req, res) => {

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