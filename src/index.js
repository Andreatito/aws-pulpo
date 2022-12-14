const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session= require('express-session');
const MySQLStore= require('express-mysql-session');
const { database }=require('./keys');
const passport= require('passport');
const helpers = require('./lib/helpers');





//inicializar



const app= express();//definir puerto de conexión- settings
require('./lib/passport');
app.set('port', process.env.PORT || 4000 , '0.0.0.0');
app.set('views', path.join(__dirname,'views')); //ubicación de carpeta views

//helpers

app.engine('.hbs', exphbs.engine({

defaultLayout: 'main',
layoutsDir: path.join(app.get('views'), 'layouts'),
partialsDir: path.join(app.get('views'),'partials'),
extname: '.hbs',
helpers: require('./lib/handlebars')

}));

app.set('view engine', '.hbs');


//Funciones de petición al servidor(Middlewares)

app.use(session({

    secret: 'pulponosession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan ('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//variables globales

app.use((req, res, next)=>{

    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;

    next();
});


//rutas

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/crud',require('./routes/crud'));




//Public

app.use(express.static(path.join(__dirname,'public')));



//starting service

app.listen(app.get('port'),() =>{

console.log('Server on port', app.get('port'));

});




