
// controllers/authController.js
const User = require('../models/User'); // User modelini import et
const generateToken = require('../utils/generateToken'); // Token oluşturucu fonksiyonu import et
const asyncHandler = require('express-async-handler'); // Async hataları yakalamak için

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    console.log('--- Register User Endpoint Hit ---'); // YENİ EKLENDİ
    console.log('Request Body:', req.body);          // YENİ EKLENDİ
  // 1. İstek (request) body'sinden kullanıcı bilgilerini al
  const { username, email, password } = req.body;

  // 2. Basit doğrulama: Gerekli alanlar boş mu?
  if (!username || !email || !password) {
    res.status(400); // Bad Request
    throw new Error('Lütfen tüm alanları doldurun');
  }

  // 3. Kullanıcı veritabanında zaten var mı? (email ile kontrol)
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('Bu e-posta adresi zaten kayıtlı');
  }

  // 4. Yeni kullanıcıyı oluştur (Şifre hash'leme modeldeki pre-save hook ile otomatik yapılacak)
  const user = await User.create({
    username,
    email,
    password, // Orijinal şifreyi veriyoruz, model hash'leyecek
  });

  // 5. Kullanıcı başarıyla oluşturuldu mu?
  if (user) {
    // Kullanıcıya bir JWT oluştur ve gönder
    const token = generateToken(user._id);

    // Başarılı yanıt gönder (201: Created)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token, // Oluşturulan token'ı da gönderiyoruz
    });
  } else {
    res.status(400); // Bad Request
    throw new Error('Geçersiz kullanıcı verisi');
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // 1. İstek body'sinden email ve şifreyi al
  const { email, password } = req.body;

   // 2. Gerekli alanlar boş mu?
   if (!email || !password) {
    res.status(400);
    throw new Error('Lütfen e-posta ve şifrenizi girin');
  }

  // 3. Kullanıcıyı email ile bul. Şifreyi de seçmeliyiz çünkü modelde select:false idi.
  const user = await User.findOne({ email }).select('+password');

  // 4. Kullanıcı bulundu mu VE girilen şifre doğru mu?
  // user.matchPassword metodu User modelinde tanımlamıştık
  if (user && (await user.matchPassword(password))) {
    // Kullanıcı bulundu ve şifre doğruysa token oluştur
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


// Fonksiyonları dışa aktar ki route dosyasında kullanabilelim
module.exports = {
  registerUser,
  loginUser,
};