const Post = require('../models/Post'); 
const User = require('../models/User'); 
const asyncHandler = require('express-async-handler'); 
const fs = require('fs'); 
const path = require('path'); 


const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  // gerekli alanlar boş mu kontrolü
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Lütfen başlık, içerik ve kategori alanlarını doldurun.');
  }

  const newPost = new Post({
    title,
    content,
    category,
    author: req.user._id, // Giriş yapmış kullanıcının ID'si
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined, 
    
  });

  const createdPost = await newPost.save();
  res.status(201).json(createdPost);
});


const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}) // veritabanındaki tüm postları bul
                          .populate('author', 'username email') // yazar bilgilerini de getir (sadece username ve email)
                          .sort({ createdAt: -1 }); // oluşturulma tarihine göre en yeniden eskiye sırala


  console.log('\n--- Backend: /api/posts GET isteği alındı ---');
  if (posts && posts.length > 0) {
    console.log('Frontend\'e gönderilecek postlar ve wins/votes değerleri:');
    posts.forEach(p => {
      console.log(
        `  Başlık: "${p.title}", Wins: ${p.wins}, Votes: ${p.votes}, ID: ${p._id}`
      );
    });
  } else {
    console.log('Gönderilecek post bulunamadı.');
  }
  console.log('--- Backend log sonu ---\n');


  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404);
    throw new Error('Yazılar bulunamadı.');
  }
});


const getPostById = asyncHandler(async (req, res) => {

  const post = await Post.findById(req.params.id)
                         .populate('author', 'username email'); // Yazar bilgilerini de getir

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('Yazı bulunamadı.');
  }});

  const updatePost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;
    const postId = req.params.id;
  
    const post = await Post.findById(postId);
  

    if (!post) {
      res.status(404);
      throw new Error('Yazı bulunamadı.');
    }
  
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized (Yetkisiz)
      throw new Error('Bu işlemi yapmaya yetkiniz yok.');
    }
  
    post.title = title || post.title; // eğer yeni başlık gelmediyse eskisini koru
    post.content = content || post.content; // eğer yeni içerik gelmediyse eskisini koru
    post.category = category || post.category; // eğer yeni kategori gelmediyse eskisini koru
  
    // eğer yeni bir görsel yüklendiyse imageUrl'i güncelle
    if (req.file) {
    
      post.imageUrl = `/uploads/${req.file.filename}`;
    }
  
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  });

  const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId);
  
    if (!post) {
      res.status(404);
      throw new Error('Yazı bulunamadı.');
    }
  
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized (Yetkisiz)
      throw new Error('Bu işlemi yapmaya yetkiniz yok.');
    }
  
    if (post.imageUrl) {
   
      const filename = post.imageUrl.split('/uploads/')[1];
      if (filename) {
        const imagePath = path.join(__dirname, '..', 'uploads', filename);
    
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Görsel silinirken hata oluştu: ${imagePath}`, err);
          } else {
            console.log(`Görsel başarıyla silindi: ${imagePath}`);
          }
        });
      }
    }
  
    await post.deleteOne(); 
  
    res.status(200).json({ message: 'Yazı başarıyla silindi.' });
  });
  

  module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost, 
  };