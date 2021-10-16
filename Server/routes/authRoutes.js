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

router.get('/D_dashboard',(req,res) =>{
    res.render('doctors/dashboardDoctor',{
        name: req.user.firstname,
        //speciality: req.user.speciality
    });
})

router.get('/P_dashboard',(req,res) =>{
    res.render('patients/dashboardPatient',{
        name: req.user.firstname
    });
})

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Dlogin');
})

router.get('/backto_Ddash',(req,res) =>{
    res.redirect('/D_dashboard');
})


router.get('/backto_Pdash',(req,res) =>{
    //res.render('patients/dashboardPatients');
    res.redirect('/P_dashboard');
})


router.get('/P_profile',(req,res) =>{
    res.render('patients/P_profile',{
        firstname: req.user.firstname,
                lastname: req.user.lastname,
                gender: req.user.gender,
                age: req.user.age,
                email: req.user.email,
                phone: req.user.phone,
                pincode: req.user.pincode


    });
})

router.get('/D_profile',(req,res) =>{
    res.render('doctors/D_profile',{
        firstname: req.user.firstname,
                lastname: req.user.lastname,
                gender: req.user.gender,
                age: req.user.age,
                email: req.user.email,
                phone: req.user.phone,
                pincode: req.user.pincode,
                degree: req.user.degree,
                speciality: req.user.speciality


    });
})

module.exports = router;