
const bcrypt = require('bcryptjs');
const helpers = {};




// cifrado de contraseña cuando se realiza el registro de usuario



helpers.encryptPassword = async (password) => {

const salt= await bcrypt.genSalt (10); //patron de cifrado

const hash = await bcrypt.hash(password, salt); //cifrado

return hash; 


}; 

// cifrado de contraseña cuando se realiza el login de usuario

helpers.matchPassword = async (password, savedPassword) => {

    try {
        
       return await bcrypt.compare(password, savedPassword); //compara password registrado contra el que se está ingresando en el login
    } catch (e) {
        
        console.log(e);
    }
};

//validaciones formulario

const { validationResult } = require('express-validator');

const validateResult = (req,res, next) => {


const errors = validationResult(req)

if(!errors.isEmpty()){


    console.log(req.body)
    const valores = req.body
    const resultado= errors.array()
    res.render( './cuentas/add',{resultado: resultado, valores: valores} )
   
}


//return res.redirect('/add')


//try {

  //  validationResult(req).throw()
    //return next()

//} catch (err) {

   // res.status(403)
    
    //const resultado = (err.array())
    //res.render('./cuentas/add', ( {resultado: resultado}))
    
    
    
//}

}


module.exports=helpers;



