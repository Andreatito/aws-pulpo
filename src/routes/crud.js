const { response } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');

const {isLoggedIn} = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res) =>{

    res.render('./cuentas/add');
    
    } );
    
//Agregar cuenta
    router.post('/add', isLoggedIn,  async (req, res) => {

            const {nombre,plan}= req.body;
            const newAcount = {

                nombre,
                plan,
                user_id: req.user.id

            };
            await pool.query('INSERT INTO cuentas set ?', [newAcount]);
            req.flash('success','Cuenta creada correctamente');
            res.redirect('/crud');
        });
//listar cuentas
        router.get('/', isLoggedIn,  async (req, res) => {

            const cuentas= await pool.query('SELECT * FROM cuentas WHERE user_id=?', [req.user.id])   
            console.log(cuentas)
            res.render('./cuentas/list',{cuentas});
        });
//Eliminar cuenta
        router.get('/delete/:id', isLoggedIn, async(req,res) => {

               const {id}=req.params;
               await pool.query('DELETE FROM cuentas WHERE ID=?',[id]);
               req.flash('success','Cuenta eliminada correctamente');
               res.redirect('/crud');

        });


//Editar cuenta
router.get('/edit/:id', isLoggedIn, async(req,res) => {

    const {id}=req.params;
    const cuenta= await pool.query('SELECT * FROM cuentas WHERE ID=?',[id]);
    
    res.render('./cuentas/edit', {cuentas: cuenta[0]} );
   

});


router.post('/edit/:id', isLoggedIn, async(req,res) => {

  const {id} = req.params;
  const {nombre,plan} = req.body;
  const newcta={

    nombre,
    plan

  };

console.log(newcta);
await pool.query('UPDATE cuentas set ? WHERE id=?', [newcta, id]);
req.flash('success','Cuenta actualizada correctamente');
res.redirect('/crud');
});
    
    module.exports = router;