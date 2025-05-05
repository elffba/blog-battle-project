// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // bcryptjs'i import et

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı zorunludur'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Lütfen geçerli bir e-posta adresi girin',
    ],
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6,
    select: false // API'dan kullanıcı bilgisi çekildiğinde şifreyi otomatik getirme
  },
}, {
  timestamps: true
});

// Yeni Eklendi: Kullanıcı kaydedilmeden HEMEN ÖNCE çalışacak fonksiyon (pre-save hook)
userSchema.pre('save', async function(next) {
  // Eğer şifre alanı değiştirilmediyse (örn: email güncelleniyorsa) hash'leme yapma
  if (!this.isModified('password')) {
    return next();
  }

  // Şifreyi hash'le
  const salt = await bcrypt.genSalt(10); // Hash'leme için rastgele bir "tuz" oluştur (10: güvenlik seviyesi)
  this.password = await bcrypt.hash(this.password, salt); // Şifreyi hash'le ve mevcut şifre alanına ata
  next(); // Sonraki adıma geç (kaydetme işlemi)
});

// Yeni Eklendi: Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Kullanıcının girdiği şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştır
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);