const mongoose = require('mongoose');
const dotenv = require('dotenv');

// .env dosyasındaki değişkenleri yükle
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
   
    });

    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    // Hata durumunda uygulamadan çıkış yap
    process.exit(1);
  }
};

module.exports = connectDB; // Fonksiyonu dışa aktar