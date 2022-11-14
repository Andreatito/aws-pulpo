const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();




app.get('./routes/crud', (req, res) => {


res.render('/crud/index')   

});

app.set('port', process.env.PORT || 4000 , '0.0.0.0');

app.listen(app.get('port'),() =>{

    console.log('Server on port', app.get('port'));
    
    });



