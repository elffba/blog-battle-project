const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); 

const router = express.Router(); 

// Kayıt endpoint'i

// Giriş endpoint'i
router.post('/login', loginUser);

module.exports = router;