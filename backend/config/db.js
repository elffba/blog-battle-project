// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// .env dosyasındaki değişkenleri yükle
dotenv.config();

const connectDB = async () => {
  try {
    // MongoDB'ye bağlanmayı dene
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose'un güncel sürümlerinde bu seçenekler genellikle varsayılan olarak gelir
      // ve belirtilmese de olur, ancak eski sürümlerle uyumluluk için eklenebilir.
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    // Hata durumunda uygulamadan çıkış yap
    process.exit(1);
  }
};

module.exports = connectDB; // Fonksiyonu dışa aktar