const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();




app.get('./routes', (req, res) => {


res.render('index')

});



app.listen('port', process.env.PORT || 4000 , '0.0.0.0')

    console.log('server on port 4000')


