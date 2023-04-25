

const {check} = require('express-validator')
const { validateResult } = require ('../lib/helpers')

const validateCreate= [

    check('username', 'Debe introducir un nombre')
    .exists()
    .not()
    .isEmpty(),
   

    

    (req, res, next) => {

        validateResult(req, res, next)
        
       
    }
]


module.exports={validateCreate}





