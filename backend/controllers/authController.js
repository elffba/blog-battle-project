
const User = require('../models/User'); 
const generateToken = require('../utils/generateToken'); // Token oluşturucu fonksiyonu import et
const asyncHandler = require('express-async-handler'); // Async hataları yakalamak için


const registerUser = asyncHandler(async (req, res) => {
    console.log('--- Register User Endpoint Hit ---'); 
    console.log('Request Body:', req.body);          
  
  const { username, email, password } = req.body;

  // basit doğrulama
  if (!username || !email || !password) {
    res.status(400); // Bad Request
    throw new Error('Lütfen tüm alanları doldurun');
  }

  // veritabanında email ile kontrol
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('Bu e-posta adresi zaten kayıtlı');
  }

  // yeni kullanıcıyı oluştur
  const user = await User.create({
    username,
    email,
    password, 
  });

  // kullanıcı başarıyla oluşturuldu mu
  if (user) {
    // Kullanıcıya bir JWT oluştur ve gönder
    const token = generateToken(user._id);

    // Başarılı yanıt gönder (201: Created)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token, 
    });
  } else {
    res.status(400); // Bad Request
    throw new Error('Geçersiz kullanıcı verisi');
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
   if (!email || !password) {
    res.status(400);
    throw new Error('Lütfen e-posta ve şifrenizi girin');
  }

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    // Başarılı yanıt gönder (200: OK)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    });
  } else {
    // Kullanıcı bulunamadı veya şifre yanlışsa
    res.status(401); // Unauthorized
    throw new Error('Geçersiz e-posta veya şifre');
  }
});


module.exports = {
  registerUser,
  loginUser,
};