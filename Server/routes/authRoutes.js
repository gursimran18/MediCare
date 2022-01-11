const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



//landing page req
router.get('/',forwardAuthenticated,(req,res)=>{
    res.render('index');
})
// Signup request
router.get('/signup',forwardAuthenticated,(req,res)=>{
    res.render('signup');
})
//doctor signup request
router.get('/Dsignup',forwardAuthenticated,(req,res)=>{
    res.render('Dsignup');
})
//patient signup request
router.get('/Psignup',forwardAuthenticated,(req,res)=>{
    res.render('Psignup');
})
//doctor login request
router.get('/Dlogin',forwardAuthenticated,(req,res)=>{
    res.render('Dlogin');
})
//patient login request
router.get('/Plogin',forwardAuthenticated,(req,res)=>{
    res.render('Plogin');
})

router.get('/hangup',(req,res)=>{
    if(req.user.userType=="1")
    res.redirect('/D_dashboard/viewAppointments')
    else
    res.redirect('/P_dashboard/p_viewAppointments')
  })

router.post('/docsignup', authController.docsignUp);
router.post('/patientsignup', authController.patientsignUp);
router.post('/Dlogin',authController.Dlogin);
router.post('/Plogin',authController.Plogin);

module.exports = router;