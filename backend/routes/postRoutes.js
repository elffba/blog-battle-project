const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController'); 
const { protect } = require('../middleware/authMiddleware'); // Giriş yapmış kullanıcı kontrolü için middleware
const { uploadSingleImage } = require('../middleware/uploadMiddleware'); 

const router = express.Router(); 

// '/api/posts' temel yolu için route'lar
router.route('/')
  .get(getPosts) 
  .post(protect, uploadSingleImage, createPost); 

router.route('/:id')
  .get(getPostById) 
  .put(protect, uploadSingleImage, updatePost) 
  .delete(protect, deletePost); 

module.exports = router;