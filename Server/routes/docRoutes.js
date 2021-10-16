const express = require('express');
const router = express.Router();

router.get('',(req,res) =>{
    res.render('doctors/dashboardDoctor',{
        name: req.user.firstname,
        //speciality: req.user.speciality
    });
})

router.get('/profile',(req,res) =>{
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

router.get('/backto_dash',(req,res) =>{
    res.redirect('/D_dashboard');
})

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Dlogin');
})

module.exports= router;