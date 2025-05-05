// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Controller fonksiyonlarını import et

const router = express.Router(); // Express router'ı oluştur

// Kayıt endpoint'i: POST isteği /api/auth/register adresine gelirse registerUser çalışır
router.post('/register', registerUser);

// Giriş endpoint'i: POST isteği /api/auth/login adresine gelirse loginUser çalışır
router.post('/login', loginUser);

// Router'ı dışa aktar ki ana server dosyamızda kullanabilelim
module.exports = router;