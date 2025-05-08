const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

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
    select: false 
  },
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt); 
  next(); 
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);