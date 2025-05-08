const multer = require('multer');
const path = require('path'); 

// Dosya depolama ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {

    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); }
});

function checkFileType(file, cb) {
  // İzin verilen dosya uzantıları
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
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
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});


const uploadSingleImage = upload.single('image'); 

module.exports = { uploadSingleImage };