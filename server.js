const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();




app.get('/', (req, res) => {


res.render('index')

});



app.listen('port', ()=>{

    console.log('server on port 4000')
})

