// controllers/postController.js
const Post = require('../models/Post'); // Post modelini import et
const User = require('../models/User'); // Gerekirse User modelini de import edebiliriz (örn: yazar bilgilerini çekmek için)
const asyncHandler = require('express-async-handler'); // Async hataları yakalamak için
const fs = require('fs'); // Dosya işlemleri için Node.js'in fs modülü
const path = require('path'); // Dosya yolları için Node.js'in path modülü

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Giriş yapmış kullanıcı)
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  // Gerekli alanlar boş mu kontrolü
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Lütfen başlık, içerik ve kategori alanlarını doldurun.');
  }

  // req.file, uploadSingleImage middleware'i sayesinde yüklenecek dosya bilgisini içerir
  // req.user, protect middleware'i sayesinde giriş yapmış kullanıcı bilgisini içerir
  const newPost = new Post({
    title,
    content,
    category,
    author: req.user._id, // Giriş yapmış kullanıcının ID'si
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined, // Eğer dosya yüklendiyse dosya yolunu kaydet
    // votes, matchHistory gibi alanlar varsayılan değerlerini alacak veya ileride güncellenecek
  });

  const createdPost = await newPost.save();
  res.status(201).json(createdPost);
});

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}) // Veritabanındaki tüm postları bul
                          .populate('author', 'username email') // Yazar bilgilerini de getir (sadece username ve email)
                          .sort({ createdAt: -1 }); // Oluşturulma tarihine göre en yeniden eskiye sırala

  // --- KONSOL LOGLAMASI BAŞLANGIÇ ---
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
  // --- KONSOL LOGLAMASI BİTİŞ ---

  if (posts) {
    res.status(200).json(posts);
  } else {
    // Bu durum normalde Post.find({}) boş bir dizi [] döndürdüğü için pek oluşmaz.
    // Ama bir veritabanı hatası olursa veya posts bir şekilde null/undefined olursa diye...
    res.status(404);
    throw new Error('Yazılar bulunamadı.');
  }
});

// Diğer fonksiyonları (getPostById, updatePost, deletePost) buraya ekleyeceğiz.
const getPostById = asyncHandler(async (req, res) => {
  // req.params.id ile URL'den gelen :id parametresini alırız
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
  
    // 1. Yazı var mı kontrol et
    if (!post) {
      res.status(404);
      throw new Error('Yazı bulunamadı.');
    }
  
    // 2. Yazının sahibi, giriş yapmış kullanıcı mı kontrol et
    //    post.author bir ObjectId olduğu için string'e çevirip karşılaştırıyoruz.
    //    req.user._id de bir ObjectId, onu da string'e çeviriyoruz.
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized (Yetkisiz)
      throw new Error('Bu işlemi yapmaya yetkiniz yok.');
    }
  
    // 3. Yazıyı güncelle
    post.title = title || post.title; // Eğer yeni başlık gelmediyse eskisini koru
    post.content = content || post.content; // Eğer yeni içerik gelmediyse eskisini koru
    post.category = category || post.category; // Eğer yeni kategori gelmediyse eskisini koru
  
    // Eğer yeni bir görsel yüklendiyse imageUrl'i güncelle
    if (req.file) {
      // İsteğe bağlı: Eski görseli sunucudan silme işlemi burada yapılabilir.
      // Şimdilik sadece veritabanındaki yolu güncelliyoruz.
      post.imageUrl = `/uploads/${req.file.filename}`;
    }
  
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  });

  const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId);
  
    // 1. Yazı var mı kontrol et
    if (!post) {
      res.status(404);
      throw new Error('Yazı bulunamadı.');
    }
  
    // 2. Yazının sahibi, giriş yapmış kullanıcı mı kontrol et
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized (Yetkisiz)
      throw new Error('Bu işlemi yapmaya yetkiniz yok.');
    }
  
    // 3. Eğer yazının bir görseli varsa, sunucudan silmeyi dene
    if (post.imageUrl) {
      // imageUrl'den dosya adını alıyoruz (örn: /uploads/image-123.jpg -> image-123.jpg)
      // imageUrl'in /uploads/filename.ext formatında olduğunu varsayıyoruz
      const filename = post.imageUrl.split('/uploads/')[1];
      if (filename) {
        const imagePath = path.join(__dirname, '..', 'uploads', filename);
        // __dirname: mevcut dosyanın (postController.js) bulunduğu klasör (yani 'controllers')
        // '..' : bir üst klasöre çık (yani 'backend' klasörüne)
        // 'uploads': uploads klasörüne gir
        // filename: dosya adı
  
        // Dosyayı sil (asenkron ve hata kontrolü ile)
        fs.unlink(imagePath, (err) => {
          if (err) {
            // Dosya bulunamazsa veya başka bir hata olursa logla ama işlemi durdurma
            console.error(`Görsel silinirken hata oluştu: ${imagePath}`, err);
          } else {
            console.log(`Görsel başarıyla silindi: ${imagePath}`);
          }
        });
      }
    }
  
    // 4. Yazıyı veritabanından sil
    // await post.remove(); // Mongoose'un eski versiyonlarında kullanılan bir yöntemdi
    await post.deleteOne(); // Mongoose 6 ve üzeri için post instance'ı üzerinden silme
    // Alternatif: await Post.findByIdAndDelete(postId);
  
    res.status(200).json({ message: 'Yazı başarıyla silindi.' });
  });
  

  module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost, // Bu fonksiyonun burada olduğundan emin ol!
  };