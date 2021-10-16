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
router.get('/Dlogin',(req,res)=>{
    res.render('Dlogin');
})
router.post('/Dlogin',authController.Dlogin);

router.get('/Plogin',(req,res)=>{
    res.render('Plogin');
})
router.post('/Plogin',authController.Plogin);

module.exports = router;