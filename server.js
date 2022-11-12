const express= require ('express');

const app=express();

app.get('/', (req, res) => res.send ('index'))



app.listen(4000)
console.log('server on port 4000')
