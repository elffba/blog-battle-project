
// 404 Not Found Hatası için Middleware
const notFound = (req, res, next) => {
    const error = new Error(`Bulunamadı - ${req.originalUrl}`);
    res.status(404);
    next(error); // Hatayı bir sonraki middleware'e (errorHandler'a) ilet
  };
  
  // Genel Hata Yakalama Middleware'i
  const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404; 
      message = 'Kaynak bulunamadı (Geçersiz ID formatı)';
    }
  
    // Yanıtı JSON formatında gönder
    res.status(statusCode).json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };