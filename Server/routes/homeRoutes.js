const express = require('express');
const router = express.Router();

// homepage req
router.get('/', (req,res)=>{
    res.render('index');
});

module.exports = router;