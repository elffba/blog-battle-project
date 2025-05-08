import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPostById, updatePost, resetStatus } from '../features/posts/postSlice';

function EditPostPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { post, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (postId) {
      dispatch(getPostById(postId));
    }
    return () => {
        dispatch(resetStatus());
    }
  }, [dispatch, postId, user, navigate]);

  useEffect(() => {
    if (post && post._id === postId) {
      if (user && post.author && user._id !== post.author._id) {
        alert('Bu yazıyı düzenleme yetkiniz yok.');
        navigate('/');
        return;
      }
      setTitle(post.title?.replace(/\"/g, '') || '');
      setContent(post.content?.replace(/\"/g, '') || '');
      setCategory(post.category?.replace(/\"/g, '') || '');
      setCurrentImageUrl(post.imageUrl || '');
    }
  }, [post, postId, user, navigate]);

  useEffect(() => {
    if (isError && message) {
      alert(`Bir hata oluştu: ${message}`);
      dispatch(resetStatus());
    }
  }, [isError, message, dispatch]);

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('Başlık, içerik ve kategori alanları zorunludur.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }

    try {
      await dispatch(updatePost({ postId, postData: formData })).unwrap();
      alert('Yazı başarıyla güncellendi!');
      navigate(`/posts/${postId}`);
    } catch (rejectedValueOrSerializedError) {
      alert(`Güncelleme Hatası: ${rejectedValueOrSerializedError || 'Bilinmeyen bir hata oluştu.'}`);
    }
  };

  if (isLoading && !post) { // Sadece isLoading ve post yoksa yükleniyor göster
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!post && !isLoading && !isError) {
      return <div className="text-center mt-10 p-4">Yazı yükleniyor veya bulunamadı...</div>
  }

  return (
    <div className="flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Yazıyı Düzenle</h1>
      <form onSubmit={onSubmit} className="w-full max-w-lg">
         <div className="form-control w-full mb-4">
          <label className="label" htmlFor="title"><span className="label-text">Başlık</span></label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" required />
        </div>
        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="category"><span className="label-text">Kategori</span></label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="input input-bordered w-full" required />
        </div>
        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="content"><span className="label-text">İçerik</span></label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="textarea textarea-bordered w-full h-32" required></textarea>
        </div>
        <div className="form-control w-full mb-6">
          <label className="label" htmlFor="image">
            <span className="label-text">Görsel Değiştir (İsteğe Bağlı)</span>
          </label>
          {currentImageUrl && (
            <div className="mb-2">
              <p className="text-sm">Mevcut/Yeni Görsel:</p>
              <img src={image ? currentImageUrl : `http://localhost:5001${currentImageUrl}`} alt="Mevcut görsel" className="w-full max-w-xs h-auto rounded-md shadow" />
            </div>
          )}
          <input type="file" id="image" className="file-input file-input-bordered w-full" onChange={onImageChange} accept="image/png, image/jpeg, image/gif"/>
        </div>
        <div className="flex space-x-2">
            <button type="submit" className="btn btn-success w-full" disabled={isLoading}>
            {isLoading ? (<span className="loading loading-spinner"></span>) : ('Değişiklikleri Kaydet')}
            </button>
            <Link to={`/posts/${postId}`} className="btn btn-ghost flex-grow">İptal</Link>
        </div>
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

export default EditPostPage;