const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

//landing page req
router.get('',(req,res)=>{
    res.render('index');
})

// Signup request
router.post('/signup', authController.signUp);

//login request
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/login',authController.login);

module.exports = router;