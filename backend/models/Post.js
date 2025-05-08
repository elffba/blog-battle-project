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
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User', 
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    trim: true,
  },
  imageUrl: {
    type: String, 
  
  },
 
  votes: { 
    type: Number,
    default: 0,
  },
  wins: { 
    type: Number,
    default: 0,
  },
    
  currentRound: { 
    type: Number,
    default: 1, 
  },
  isEliminated: { 
    type: Boolean,
    default: false,
  },
  isActiveInTournament: { 
                      
    type: Boolean,
    default: true, 
  },
  // --- --
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);