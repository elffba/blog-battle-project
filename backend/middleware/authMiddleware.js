const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); 

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         res.status(401);
         throw new Error('Yetkisiz, kullanıcı bulunamadı');
      }
      next();

    } catch (error) {
      console.error(error); 
      res.status(401); 
      if (error.name === 'JsonWebTokenError') {
           throw new Error('Yetkisiz, geçersiz token');
      } else if (error.name === 'TokenExpiredError') {
           throw new Error('Yetkisiz, token süresi dolmuş');
      } else {
            throw new Error('Yetkisiz, token hatası');
      }
    }
  }

  if (!token) {
    res.status(401); 
    throw new Error('Yetkisiz, token bulunamadı');
  }
});

// Middleware'i dışa aktar
module.exports = { protect };