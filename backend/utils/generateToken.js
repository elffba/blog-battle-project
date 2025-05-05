// utils/generateToken.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // .env dosyasını okumak için

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Token'ın payload'ı (içeriği) - buraya kullanıcının ID'sini koyuyoruz
    process.env.JWT_SECRET, // .env dosyasından okuduğumuz gizli anahtar
    {
      expiresIn: '30d', // Token'ın geçerlilik süresi (örn: 30 gün)
    }
  );
};

module.exports = generateToken;