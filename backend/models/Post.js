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
  wins: { // Kaç eşleşme kazandığı
    type: Number,
    default: 0,
  },
    // --- YENİ TURNUVA ALANLARI ---
  currentRound: { // Postun şu anki turnuvada hangi turda olduğu
    type: Number,
    default: 1, // Tüm postlar 1. turdan başlar
  },
  isEliminated: { // Postun turnuvadan elenip elenmediği
    type: Boolean,
    default: false,
  },
  isActiveInTournament: { // Postun hala aktif olarak turnuvada yarışıp yarışmadığı
                           // (elenmemiş VE henüz tüm turları bitirmemiş)
    type: Boolean,
    default: true, // Yeni eklenen postlar varsayılan olarak turnuvada aktif
  },
  // --- --
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);