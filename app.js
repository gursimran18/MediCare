const express = require('express');
const morgan = require('morgan');
const app = express();

const path = require('path');
const userRoutes = require('./Server/routes/userRoutes')
app.use(morgan('dev'));

// Middleware to read the body of http post request
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//set view path 
app.set('views', path.join(__dirname, 'views'));
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

//specifying routes
app.use('/users', userRoutes);

app.use('*', (req, res) => {
    res.status(404).send('This route is not defined!');
});
module.exports = app;