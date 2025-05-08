const cors = require('cors');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db'); // Veritabanı bağlantı fonksiyonu
const authRoutes = require('./routes/authRoutes'); // Auth route'ları
const matchRoutes = require('./routes/matchRoutes'); 
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Hata middleware'leri
const postRoutes = require('./routes/postRoutes'); 


// .env dosyasındaki değişkenleri yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

// Express uygulamasını başlat
const app = express();

app.use(cors()); // 
app.use(express.json()); 


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.send('API Çalışıyor...');
});


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/matches', matchRoutes); 


app.use(notFound); // Önce bulunamayan route'ları yakala
app.use(errorHandler); // Sonra diğer tüm hataları yakala

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor`);
});