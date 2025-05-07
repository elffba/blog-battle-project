// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate eklendi
import { getPosts, resetStatus as resetPostStatus } from '../features/posts/postSlice';
import { startMatch, resetMatchStatus } from '../features/matches/matchSlice'; // Gerekli match action'ları

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook'u çağrıldı

  // Posts state'i
  const { posts, isLoading: postsLoading, isError: postsError, message: postsMessage } = useSelector(
    (state) => state.posts
  );

  // Match state'i (isimleri yeniden adlandırarak)
  const {
    isLoading: matchLoading,
    isError: matchError,
    isSuccess: matchSuccess,
    message: matchMessage
   } = useSelector(
    (state) => state.match
  );

  // Postları çekmek için useEffect
  useEffect(() => {
    dispatch(getPosts());
    return () => {
      dispatch(resetPostStatus());
    };
  }, [dispatch]);

  // --- YENİ EKLENEN/GÜNCELLENEN KISIM ---
  // Yeni eşleşme başlatma sonrası durumları izle ve yönlendir
  useEffect(() => {
      if (matchMessage && (matchError || matchSuccess)) {
          if (matchError) {
              alert(`Eşleşme Başlatma Hatası: ${matchMessage}`);
              dispatch(resetMatchStatus()); // Durumu sıfırla
          }
          // Başarı durumunda mesajı kontrol et ve yönlendir
          if (matchSuccess && matchMessage === 'Yeni eşleşme başarıyla başlatıldı!') {
              // alert(matchMessage); // Alert yerine doğrudan yönlendirelim
              console.log("Yeni eşleşme başlatıldı, /battle sayfasına yönlendiriliyor...");
              dispatch(resetMatchStatus()); // Yönlendirmeden ÖNCE durumu sıfırla!
              navigate('/battle');          // Yönlendirme yap!
          }
          // Eğer başarı mesajı farklıysa veya sadece isSuccess ise,
          // yine de durumu sıfırlayabiliriz ama yönlendirmeyi mesaj kontrolüne bağlamak daha güvenli.
          // else if (matchSuccess) {
          //   dispatch(resetMatchStatus());
          // }
      }
  // Bağımlılıkları ekle: matchError, matchSuccess, matchMessage, dispatch, navigate
  }, [matchError, matchSuccess, matchMessage, dispatch, navigate]);
  // --- --- --- --- --- --- --- --- --- ---

  // Yeni eşleşme başlatma butonu için handler
  const handleStartMatch = () => {
    console.log("Yeni eşleşme başlatma butonu tıklandı.");
    dispatch(startMatch()); // Rastgele başlat
  };

  // ---- Render Kısmı ----

  if (postsLoading) { /* ... (Aynı) ... */ }
  if (postsError) { /* ... (Aynı) ... */ }

  return (
    <div>
      {/* --- YENİ EŞLEŞME BAŞLAT BUTONU --- */}
      <div className="text-center mb-8">
          <button
            className="btn btn-accent btn-wide"
            onClick={handleStartMatch}
            disabled={matchLoading}
          >
            {matchLoading ? (
                <span className="loading loading-spinner"></span>
             ) : (
                '⚡ Yeni Kapışma Başlat! ⚡'
             )}
          </button>
      </div>
      {/* ----------------------------------- */}

      <h1 className="text-3xl font-bold mb-8 text-center text-primary">🏆 Liderlik Tablosu 🏆</h1>

      {/* Post listesi ve sıralama (Aynı) */}
      {posts && posts.length > 0 ? (
            (() => {
                const sortedPosts = [...posts].sort((a, b) => (b.wins || 0) - (a.wins || 0));
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {sortedPosts.map((post) => (
                            <div key={post._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300/60 rounded-lg flex flex-col">
                              {/* Kart içeriği aynı */}
                              {post.imageUrl && ( <figure className="h-48 flex-shrink-0"> {/* ... */} </figure> )}
                              <div className="card-body p-5 flex flex-col flex-grow">
                                <h2 className="card-title text-xl mb-2"> {/* ... */} </h2>
                                {post.wins > 0 && ( <div className="badge badge-success badge-outline mb-2 self-start whitespace-nowrap"> {/* ... */} </div> )}
                                <p className="text-xs text-base-content/70 mb-1">Kategori: {post.category.replace(/\"/g, '')}</p>
                                <p className="text-xs text-base-content/70 mb-3">Yazar: {post.author?.username || 'Bilinmiyor'}</p>
                                <p className="text-xs text-base-content/60 mb-3">Toplam Oy: {post.votes !== undefined ? post.votes : 0}</p>
                                <div className="card-actions justify-end mt-auto pt-4">
                                   <Link to={`/posts/${post._id}`} className="btn btn-primary btn-sm">Devamını Oku</Link>
                                </div>
                              </div>
                            </div>
                        ))}
                    </div>
                );
            })()
        ) : (
            <div className="text-center py-10">
                 {/* ... (Yazı yok mesajı aynı) ... */}
            </div>
        )}
    </div>
  );
}

export default HomePage;