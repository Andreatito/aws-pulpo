const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();






app.set('port', process.env.PORT || 4000 , '0.0.0.0');

app.listen(app.get('port'),() =>{

    console.log('Server on port', app.get('port'));
    
    });

 

