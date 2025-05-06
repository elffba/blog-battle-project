// server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Veritabanı bağlantı fonksiyonu
const authRoutes = require('./routes/authRoutes'); // Auth route'ları
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Hata middleware'leri
const postRoutes = require('./routes/postRoutes'); // YENİ EKLENDİ: Post route'larını import et


// .env dosyasındaki değişkenleri yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

// Express uygulamasını başlat
const app = express();

// Middleware'leri kullan
app.use(cors()); // Cross-Origin Resource Sharing'i etkinleştir (Frontend'den gelen isteklere izin ver)
app.use(express.json()); // Gelen JSON verilerini (request body) parse etmek için

// YENİ EKLENDİ: 'uploads' klasörünü statik olarak sun
// Bu sayede /uploads/dosyaadi.jpg gibi yollarla görsellere erişilebilir.
// __dirname, mevcut çalışan script'in (server.js) bulunduğu dizini verir (yani 'backend' klasörü)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Basit bir test route'u (Sunucu çalışıyor mu diye kontrol için)
app.get('/', (req, res) => {
  res.send('API Çalışıyor...');
});

// Route'ları kullan
// /api/auth ile başlayan tüm istekleri authRoutes'a yönlendir
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // YENİ EKLENDİ: /api/posts ile başlayan istekleri postRoutes'a yönlendir


// ---- Diğer route'ları buraya ekleyeceğiz (örn: /api/posts) ----


// Hata Middleware'lerini kullan (Route'lardan sonra olmalı!)
app.use(notFound); // Önce bulunamayan route'ları yakala
app.use(errorHandler); // Sonra diğer tüm hataları yakala

// Port numarasını .env dosyasından al veya varsayılan 5000 kullan
const PORT = process.env.PORT || 5000;

// Sunucuyu dinlemeye başla
app.listen(PORT, () => {
  console.log(`Sunucu ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor`);
});