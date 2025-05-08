import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost, resetStatus } from '../features/posts/postSlice'; 

function CreatePostPage() {
  // Form girdileri için local state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null); // Görsel dosyası için state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Post state'inden ve auth state'inden (gerekirse) bilgileri al
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth); 

  // Form input değişikliklerini yöneten fonksiyonlar
  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);
  const onCategoryChange = (e) => setCategory(e.target.value);
  const onImageChange = (e) => {
    // Sadece ilk seçilen dosyayı al
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Form gönderildiğinde çalışacak fonksiyon
  const onSubmit = (e) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert('Lütfen tüm zorunlu alanları (başlık, içerik, kategori) doldurun.');
      return;
    }

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('category', category);
    if (image) { 
      postData.append('image', image); 
    }

    dispatch(createPost(postData));
  };

  useEffect(() => {
    if (!user) { 
      navigate('/login');
      return; 
    }

    if (isError && message) { // Sadece mesaj varsa alert göster
      alert(`Yazı Oluşturma Hatası: ${message}`);
      dispatch(resetStatus()); // Hata gösterildikten sonra durumu sıfırla
    }

   
    if (isSuccess && message === 'Yazı başarıyla oluşturuldu!') { 
      alert('Yazı başarıyla oluşturuldu!'); // Başarı mesajı
      navigate('/'); // Anasayfaya yönlendir
    }

  }, [user, isError, isSuccess, message, navigate, dispatch]);

   useEffect(() => {
    return () => {
      dispatch(resetStatus());
    }
  }, [dispatch]);


  return (
    <div className="flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Yeni Yazı Oluştur</h1>
      <form onSubmit={onSubmit} className="w-full max-w-lg"> 
        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="title">
            <span className="label-text">Başlık</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            placeholder="Yazı başlığını girin"
            className="input input-bordered w-full"
            onChange={onTitleChange}
            required
          />
        </div>

        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="category">
            <span className="label-text">Kategori</span>
          </label>
          <input 
            type="text"
            id="category"
            name="category"
            value={category}
            placeholder="Kategori (örn: Teknoloji, Gezi)"
            className="input input-bordered w-full"
            onChange={onCategoryChange}
            required
          />
        </div>

        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="content">
            <span className="label-text">İçerik</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            placeholder="Yazı içeriğini buraya yazın..."
            className="textarea textarea-bordered w-full h-32" 
            onChange={onContentChange}
            required
          ></textarea>
        </div>

        <div className="form-control w-full mb-6">
          <label className="label" htmlFor="image">
            <span className="label-text">Görsel Yükle (İsteğe Bağlı)</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="file-input file-input-bordered w-full"
            onChange={onImageChange}
            accept="image/png, image/jpeg, image/gif" // Sadece resim dosyalarına izin ver
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            'Yazıyı Oluştur'
          )}
        </button>

        {isError && message && (
            <div role="alert" className="alert alert-error mt-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Hata! {message}</span>
             </div>
         )}
      </form>
    </div>
  );
}

export default CreatePostPage;