// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık zorunludur'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'İçerik zorunludur'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // User modeline referans
    required: true,
    ref: 'User', // 'User' modeline işaret ediyor
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    // enum: ['Teknoloji', 'Gezi', 'Yemek', 'Sanat', 'Diğer'], // İstersen kategorileri sınırlayabilirsin
    trim: true,
  },
  imageUrl: {
    type: String, // Görselin URL'sini veya dosya yolunu saklayacağız
    // required: true // Şimdilik zorunlu yapmayalım
  },
  // Oylama ve Turnuva ile ilgili alanlar (Başlangıç)
  votes: { // Bu postun toplam aldığı oy sayısı (basit yaklaşım)
    type: Number,
    default: 0,
  },
  // Belki daha detaylı:
  // currentMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', default: null },
  // matchWins: { type: Number, default: 0 },
  // isActiveInTournament: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);