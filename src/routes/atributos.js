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
    const km_id= await pool.query('SELECT * FROM kilometros');
    console.log (km_id);
    const combustible= await pool.query('SELECT * FROM combustible');
    console.log (combustible);
  
    res.render('./atributos/addVehiculo',{brand,modelo,year,color,vehiculo_status,cuentas,vehiculo_tipo,km_id,combustible});
    
  } );
  
  
  router.post('/addVehiculo/', isLoggedIn, async (req, res) => {
  
    console.log("cuentas post add")
    var placaPattern=new RegExp(/[a-zA-Z0-9]*-[a-zA-Z0-9]*/);
    var errors= {}

    
    if(!req.body.tipo1_id){
  
      errors.tipo1_id="*El nombre es requerido"
  
    }

    if(!req.body.placa){
  
      errors.placa="*La placa del vehículo es requerida"
  
    }else if(!placaPattern.test(req.body.placa)){
      errors.placa="*Ingrese una placa válida (El formato debe ser de tipo WW-1234)"
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
  
      errors.vehiculo_status="*Seleccione el status del vehículo"
  
    }
  
    if(!req.body.cuenta){
  
      errors.cuenta="*La cuenta es requerida"
      
    }
    if(!req.body.km_id){
  
      errors.km_id="*Debes seleccionar el rango de kilometros con los que cuenta el vehículo"
      
    }
    if(!req.body.combustible){
  
      errors.combustible="*Debes seleccionar el tipo de combustible que utiliza el vehículo"
      
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

  const detVehiculos= await pool.query(`SELECT vehiculos.*, 
  vehiculos.placa AS pl, 
  cuentas.nombre as cta ,
  vehiculo_tipo.tipo AS vh,
  vehiculo_status.vehiculo_status as st,
  brand.nombre as brand,
  color.color as color,
  modelo.nombre as model,
  year.nombre as year,
  kilometros.rango as rg

  FROM vehiculos
 
  LEFT JOIN users ON users.id = vehiculos.user_id
  LEFT JOIN cuentas ON cuentas.id =vehiculos.cuenta
  LEFT JOIN brand ON brand.id =vehiculos.brand
  LEFT JOIN color ON color.id=vehiculos.color
  LEFT JOIN vehiculo_tipo ON vehiculo_tipo.id = vehiculos.tipo1_id
  LEFT JOIN vehiculo_status ON vehiculo_status.id = vehiculos.vehiculo_status
  LEFT JOIN modelo ON modelo.id = vehiculos.model
  LEFT JOIN year on year.id = vehiculos.year
  LEFT JOIN kilometros ON kilometros.id= vehiculos.km_id

  WHERE vehiculos.user_id=?`,[req.user.id]);


  console.log(detVehiculos) 
 
 
  res.render('./atributos/detVehiculos', {detVehiculos: detVehiculos} );
    
});





  //Agregar Mantenimiento


   
router.get('/addMantenimiento/',isLoggedIn, async(req, res) =>{

  console.log("cuentas get add")
  const vehiculos= await pool.query('SELECT * FROM vehiculos');
  console.log (vehiculos);
  const cuentas= await pool.query('SELECT * FROM cuentas');
  console.log (cuentas);
  const mantenimiento_tipo= await pool.query('SELECT * FROM mantenimiento_tipo');
  console.log (mantenimiento_tipo);
  const conductor= await pool.query('SELECT * FROM conductor');
  console.log (conductor);

  res.render('./atributos/addMantenimiento',{vehiculos,cuentas,mantenimiento_tipo,conductor});
  
} );


router.post('/addMantenimiento/', isLoggedIn, async (req, res) => {

  console.log("cuentas post add")
 
  var errors= {}
  var nombrePattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
  var descPattern=new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]{2,254}$/);
  
  if(!req.body.vehiculo){

    errors.vehiculo="*El vehículo es requerido"

  }
if(!req.body.mantenimiento_tipo){

  errors.mantenimiento_tipo="*Seleccione el tipo de mantenimiento que se realizará al vehículo"

}
  
  if(!req.body.conductor){

    errors.conductor="*Debe ingresar el conductor que gestionará el mantenimiento"
}

  if(!req.body.cuentas){

    errors.cuentas="*Seleccione la cuenta a la que está asociado el vehículo"

  }
  if(!req.body.fecha){

    errors.fecha="*Seleccione la fecha de realización del mantenimiento"

  }
  if(!descPattern.test(req.body.descripcion)){
    errors.descripcion="*Solo debe ingresar letras y hasta un máximo de 250 caracteres "
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
    
    await pool.query('INSERT INTO mantenimientos set ?', [req.body]);

    res.json(
    {
      status:"ok",
      message:"Mantenimiento agregado correctamente"
    }
    )
  }
  
});











module.exports = router;