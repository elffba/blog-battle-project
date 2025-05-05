// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // User modeline ihtiyacımız var

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Token'ı header'dan oku (Authorization: Bearer TOKEN_BILGISI)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 'Bearer ' kısmını atıp sadece token'ı al
      token = req.headers.authorization.split(' ')[1];

      // 2. Token'ı doğrula (verify)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Token geçerliyse, payload'daki id ile kullanıcıyı bul
      //    Şifre alanını getirmemesi için .select('-password') kullanıyoruz.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         res.status(401);
         throw new Error('Yetkisiz, kullanıcı bulunamadı');
      }

      // 4. Kullanıcı bulundu, sonraki adıma (middleware veya route handler) geç
      next();

    } catch (error) {
      console.error(error); // Hata ayıklama için konsola yazdırabiliriz
      res.status(401); // Unauthorized
      // Token doğrulama hatası (örn: süresi dolmuş, geçersiz imza)
      if (error.name === 'JsonWebTokenError') {
           throw new Error('Yetkisiz, geçersiz token');
      } else if (error.name === 'TokenExpiredError') {
           throw new Error('Yetkisiz, token süresi dolmuş');
      } else {
            throw new Error('Yetkisiz, token hatası');
      }
    }
  }

  // 5. Eğer header'da 'Bearer' token yoksa
  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Yetkisiz, token bulunamadı');
  }
});

// Middleware'i dışa aktar
module.exports = { protect };