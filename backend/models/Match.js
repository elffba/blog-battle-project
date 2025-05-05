// models/Match.js (İsteğe Bağlı ama Önerilir)
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  post1: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  post2: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  votesPost1: {
    type: Number,
    default: 0,
  },
  votesPost2: {
    type: Number,
    default: 0,
  },
  voters: [{ // Hangi kullanıcıların oy verdiğini takip etmek için (1 oy/kullanıcı kuralı)
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
  }],
  winner: { // Eşleşme bitince kazanan postun ID'si
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
  round: { // Turnuvanın hangi turunda olduğu
    type: Number,
    default: 1,
  },
  status: { // Eşleşmenin durumu
    type: String,
    enum: ['active', 'finished'],
    default: 'active',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);