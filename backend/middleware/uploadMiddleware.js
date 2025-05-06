// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path'); // Node.js'in path modülü

// Dosya depolama ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Yüklenen dosyaların kaydedileceği klasör
    // Bu klasörün projenizin ana dizininde olduğundan emin olun veya oluşturun
    cb(null, 'uploads/'); // 'backend/uploads/' olacak
  },
  filename: function (req, file, cb) {
    // Dosya adını benzersiz hale getir (fieldname + timestamp + orjinal uzantı)
    // fieldname: formdaki dosya alanının adı (örn: 'image')
    // Date.now(): anlık zaman damgası
    // path.extname(file.originalname): dosyanın orijinal uzantısı (örn: .jpg, .png)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); }
});

// Dosya türü filtresi (sadece belirli resim türlerine izin verelim)
function checkFileType(file, cb) {
  // İzin verilen dosya uzantıları
  const filetypes = /jpeg|jpg|png|gif/;
  // Dosya uzantısını kontrol et
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // MIME türünü kontrol et
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hata: Sadece resim dosyaları yüklenebilir (jpeg, jpg, png, gif)!'), false);
  }
}

// Multer yapılandırması
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Dosya boyutu limiti (örn: 5MB)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Tek dosya yükleme için middleware (formdaki alan adı 'image' olmalı)
// Eğer farklı bir alan adı kullanacaksanız 'image' kısmını değiştirin.
const uploadSingleImage = upload.single('image'); // 'image' form alanından tek dosya

module.exports = { uploadSingleImage };