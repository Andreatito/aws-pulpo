

const {check} = require('express-validator')
const { validateResult } = require ('../lib/helpers')

const validateCreate= [

    check('nombre', 'Debe introducir un nombre')
    .exists()
    .not()
    .isEmpty(),
   

    check('plan_id', 'Debe seleccionar el plan contratado')
    .exists()
    .not()
    .isEmpty(),

    check('status_id', 'Seleccione un status para la cuenta')
    .exists()
    .not()
    .isEmpty(),


    check('pais_id', 'Debe seleccionar el país de origen')
    .exists()
    .not()
    .isEmpty(),

    check('timezone_id', 'Elija una zona horaria')
    .exists()
    .not()
    .isEmpty(),

    check('user_id', 'Debe asignar un usuario de cuenta')
    .exists()
    .not()
    .isEmpty(),


    (req, res, next) => {

        validateResult(req, res, next)
        
       
    }
]


module.exports={validateCreate}





