const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();

// Signup request
router.post('/signup', authController.signUp);

//login request
router.post('/login',authController.login);

module.exports = router;