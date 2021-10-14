const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

//landing page req
router.get('/',(req,res)=>{
    res.render('index');
})

// Signup request
router.get('/signup',(req,res)=>{
    res.render('signup');
})

//doctor signup request
router.get('/Dsignup',(req,res)=>{
    res.render('Dsignup');
})
router.post('/docsignup', authController.docsignUp);

//patient signup request
router.get('/Psignup',(req,res)=>{
    res.render('Psignup');
})
router.post('/patientsignup', authController.patientsignUp);

//login request
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/login',authController.login);


module.exports = router;