const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // .env dosyasını okumak için

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '30d', 
    }
  );
};

module.exports = generateToken;