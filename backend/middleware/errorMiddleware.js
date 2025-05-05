// middleware/errorMiddleware.js

// 404 Not Found Hatası için Middleware
const notFound = (req, res, next) => {
    const error = new Error(`Bulunamadı - ${req.originalUrl}`);
    res.status(404);
    next(error); // Hatayı bir sonraki middleware'e (errorHandler'a) ilet
  };
  
  // Genel Hata Yakalama Middleware'i
  // (asyncHandler'dan veya manuel olarak next(error) ile gelen hataları yakalar)
  const errorHandler = (err, req, res, next) => {
    // Bazen hata 200 OK status koduyla gelebilir, onu değiştirelim
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // Mongoose CastError hatasını (geçersiz ObjectId formatı) daha anlaşılır hale getir
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404; // Not Found olarak ele alalım
      message = 'Kaynak bulunamadı (Geçersiz ID formatı)';
    }
  
    // Yanıtı JSON formatında gönder
    res.status(statusCode).json({
      message: message,
      // Geliştirme ortamındaysak hatanın stack trace'ini de gönderelim
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };