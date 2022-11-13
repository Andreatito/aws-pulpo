const express= require ('express');
const { Strategy } = require('passport-local');

const app=express();

<<<<<<< HEAD
app.get('/', (req, res) => res.send ('index'))
=======
app.get('/', (req, res) => {


res.render('index')

});
>>>>>>> b5f2151 (nueva modificacion)



app.listen(4000)
console.log('server on port 4000')
