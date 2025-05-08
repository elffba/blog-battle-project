import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPosts, resetStatus as resetPostStatus } from '../features/posts/postSlice';
import { startMatch, resetMatchStatus } from '../features/matches/matchSlice';
import { useNavigate } from 'react-router-dom'; 

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate'i tanımla

  const { posts, isLoading: postsLoading, isError: postsError, message: postsMessage } = useSelector(
    (state) => state.posts
  );
  const {
    isLoading: matchLoading,
    isError: matchError,
    isSuccess: matchSuccess,
    message: matchMessage
   } = useSelector(
    (state) => state.match
  );

  useEffect(() => {
    dispatch(getPosts());
    return () => {
      dispatch(resetPostStatus());
    };
  }, [dispatch]);

  useEffect(() => {
      if (matchMessage && (matchError || matchSuccess)) {
          if (matchSuccess && matchMessage === 'Yeni eşleşme başarıyla başlatıldı!') {
              console.log("Yeni eşleşme başlatıldı, /battle sayfasına yönlendiriliyor...");
              dispatch(resetMatchStatus());
              navigate('/battle');
          } else if (matchError) { // Hata durumunda sadece alert gösterip sıfırla
              alert(`Eşleşme Başlatma Hatası: ${matchMessage}`);
              dispatch(resetMatchStatus());
          } else { 
              dispatch(resetMatchStatus());
          }
      }
  }, [matchError, matchSuccess, matchMessage, dispatch, navigate]);


  const handleStartMatch = () => {
    console.log("Yeni eşleşme başlatma butonu tıklandı.");
    dispatch(startMatch());
  };

  
  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) => (b.wins || 0) - (a.wins || 0))
    : [];

  useEffect(() => {
    if (posts) {
      console.log('HomePage - Gelen Posts Verisi:', posts);
      console.log('HomePage - Sıralanmış Posts Verisi:', sortedPosts);
    }
  }, [posts, sortedPosts]); 


  // ---- Render Kısmı ----

  if (postsLoading) {  }
  if (postsError) {  }

  return (
    <div>
      
      <h1 className="text-3xl font-bold mb-8 text-center text-succes">Blog Yazıları</h1>

      {sortedPosts && sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedPosts.map((post) => (
                  <div key={post._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300/60 rounded-lg flex flex-col">
                     {post.imageUrl && ( <figure className="h-48 flex-shrink-0"> <img src={`http://localhost:5001${post.imageUrl}`} alt={post.title.replace(/\"/g, '')} className="w-full h-full object-cover"/> </figure> )}
                     <div className="card-body p-5 flex flex-col flex-grow">
                        <h2 className="card-title text-xl mb-2"> {post.title.replace(/\"/g, '')} </h2>
                        {post.wins > 0 && ( <div className="badge badge-success badge-outline mb-2 self-start whitespace-nowrap"> 🏆 Kazanan ({post.wins} kez) </div> )}
                        <p className="text-xs text-base-content/70 mb-1">Kategori: {post.category.replace(/\"/g, '')}</p>
                        <p className="text-xs text-base-content/70 mb-3">Yazar: {post.author?.username || 'Bilinmiyor'}</p>
                        <p className="text-xs text-base-content/60 mb-3">Toplam Oy: {post.votes !== undefined ? post.votes : 0}</p>
                        <div className="card-actions justify-end mt-auto pt-4">
                            <Link to={`/posts/${post._id}`} className="btn btn-success btn-sm">Devamını Oku</Link>
                        </div>
                     </div>
                  </div>
              ))}
          </div>
        ) : (
            <div className="text-center py-10">
                 <p className="text-xl text-base-content/70">Gösterilecek yazı bulunamadı.</p>
                 <Link to="/create-post" className="btn btn-success mt-4">İlk Yazını Oluştur!</Link>
            </div>
        )}
    </div>
  );
}

export default HomePage;