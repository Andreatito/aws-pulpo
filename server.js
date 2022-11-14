const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();




app.get('/crud/index', (req, res) => {


res.render('index')   

});

app.set('port', process.env.PORT || 4000 , '0.0.0.0');

app.listen(app.get('port'),() =>{

    console.log('Server on port', app.get('port'));
    
    });



