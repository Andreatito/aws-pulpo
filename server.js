const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();


app.get('/', (req, res) => res.send ('index'))

app.get('/', (req, res) => {


res.render('index')

});




app.listen(4000)
console.log('server on port 4000')
