// routes/postRoutes.js
const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController'); // Controller fonksiyonlarını import et
const { protect } = require('../middleware/authMiddleware'); // Giriş yapmış kullanıcı kontrolü için middleware
const { uploadSingleImage } = require('../middleware/uploadMiddleware'); // Görsel yükleme middleware'i

const router = express.Router(); // Express router'ı oluştur

// '/api/posts' temel yolu için route'lar
router.route('/')
  .get(getPosts) // Tüm postları getir (Public)
  .post(protect, uploadSingleImage, createPost); // Yeni post oluştur (Private, görsel yüklemeli)
                                                // Sıralama önemli: önce protect, sonra upload, sonra controller

// '/api/posts/:id' (belirli bir ID'ye sahip post) için route'lar
router.route('/:id')
  .get(getPostById) // Tek bir postu ID ile getir (Public)
  .put(protect, uploadSingleImage, updatePost) // Postu güncelle (Private, görsel yüklemeli)
  .delete(protect, deletePost); // Postu sil (Private)

// Router'ı dışa aktar
module.exports = router;