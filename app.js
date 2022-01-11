const express = require('express');
const morgan = require('morgan');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const app = express();
//passport config
require('./Server/config/passport')(passport);

const path = require('path');
const authRoutes = require('./Server/routes/authRoutes')
const docRoutes = require('./Server/routes/docRoutes')
const patientRoutes = require('./Server/routes/patientRoutes')
app.use(morgan('dev'));

// Middleware to read the body of http post request
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//set view path 
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))
app.use("/static", express.static('static'));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  

//connect flash  
app.use(flash());

//global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//specifying routes
app.use('/',authRoutes);
app.use('/D_dashboard',docRoutes);
app.use('/P_dashboard',patientRoutes);

app.use('*', (req, res) => {
    res.status(404).send('This route is not defined!');
});
module.exports = app;