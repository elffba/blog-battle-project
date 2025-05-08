// src/pages/BattlePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getActiveMatch, voteOnMatch, resetMatchStatus, clearActiveMatch } from '../features/matches/matchSlice';

function BattlePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeMatch, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.match
  );
  const { user } = useSelector((state) => state.auth);

  const [showResults, setShowResults] = useState(false);
  // Kullanıcının bu spesifik maça (activeMatch._id) oy verip vermediğini session'dan bağımsız kontrol et
  const [userVotedInCurrentMatch, setUserVotedInCurrentMatch] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Sayfa yüklendiğinde veya kullanıcı değiştiğinde aktif eşleşmeyi çek
    dispatch(getActiveMatch());

    return () => {
      dispatch(resetMatchStatus());
    };
  }, [dispatch, user, navigate]);

  // activeMatch veya user değiştiğinde, kullanıcının bu maça oy verip vermediğini kontrol et
  useEffect(() => {
    if (activeMatch && user && activeMatch.voters && activeMatch.voters.includes(user._id)) {
      setUserVotedInCurrentMatch(true);
      setShowResults(true); // Eğer zaten oy vermişse direkt sonuçları göster
    } else {
      setUserVotedInCurrentMatch(false);
      // setShowResults(false); // Yeni bir maç yüklendiğinde sonuçları gizle, fetchNewMatch içinde yapılıyor.
    }
  }, [activeMatch, user]);

  useEffect(() => {
    if (isError && message) {
      alert(`Hata: ${message}`);
      dispatch(resetMatchStatus());
    }
    if (isSuccess && message === 'Oyunuz başarıyla kaydedildi!') {
      // alert(message); // Oy verdikten sonra direkt sonuçlar görüneceği için alert'e gerek yok
      setShowResults(true);
      setUserVotedInCurrentMatch(true); // Oy verdi olarak işaretle
      // getActiveMatch'ı tekrar çağırmaya gerek yok, voteOnMatch zaten güncel eşleşmeyi döndürüyor
      // ve activeMatch state'ini güncelliyor.
      dispatch(resetMatchStatus()); // Sadece status'ları resetle
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleVote = (postId) => {
    if (!activeMatch || !user || userVotedInCurrentMatch) {
      if (userVotedInCurrentMatch) alert('Bu eşleşmeye zaten oy verdiniz.');
      return;
    }
    dispatch(voteOnMatch({ matchId: activeMatch._id, votedForPostId: postId }));
  };

  const fetchNewMatch = () => {
    setShowResults(false);
    setUserVotedInCurrentMatch(false);
    dispatch(clearActiveMatch());
    dispatch(getActiveMatch());
  };

  if (isLoading && !activeMatch) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> {/* Navbar yüksekliğini çıkar */}
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!activeMatch && !isLoading) { // Hata durumunu da burada yakalayabiliriz isError ile
    return (
      <div className="text-center mt-10 p-4">
        <h2 className="text-2xl font-semibold mb-4">
          {isError ? `Hata: ${message}` : 'Şu anda aktif bir eşleşme bulunamadı.'}
        </h2>
        <p className="mb-6">Lütfen daha sonra tekrar deneyin veya yeni bir eşleşme başlatılması için bekleyin.</p>
        <button onClick={fetchNewMatch} className="btn btn-primary mr-2">Tekrar Dene</button>
        <Link to="/" className="btn btn-outline">Anasayfaya Dön</Link>
      </div>
    );
  }

  // activeMatch var ama postları yoksa (çok nadir bir durum, veri bozukluğu)
  if (!activeMatch?.post1 || !activeMatch?.post2) {
      return (
        <div className="text-center mt-10 p-4">
            <p>Eşleşme verileri eksik veya bozuk. Lütfen başka bir eşleşme deneyin.</p>
            <button onClick={fetchNewMatch} className="btn btn-primary mt-4">Başka Eşleşme</button>
        </div>
      )
  }


  const totalVotes = (activeMatch.votesPost1 || 0) + (activeMatch.votesPost2 || 0);
  const percentPost1 = totalVotes > 0 ? Math.round(((activeMatch.votesPost1 || 0) / totalVotes) * 100) : 0;
  const percentPost2 = totalVotes > 0 ? Math.round(((activeMatch.votesPost2 || 0) / totalVotes) * 100) : 0;

  const displayResults = showResults || userVotedInCurrentMatch;

  return (
    <div className="p-2 md:p-6 min-h-[calc(100vh-8rem)]"> {/* Navbar yüksekliğini çıkararak tüm ekranı kaplamasını sağla */}
      <h1 className="text-4xl font-bold text-center mb-6 text-neutral">
        BLOG BATTLE!
      </h1>
      <p className="text-center text-lg mb-8 text-base-content/70">
        Hangi yazı sence daha iyi? Seçimini yap!
      </p>

      <div className="flex flex-col lg:flex-row justify-around items-stretch gap-6">
        {/* Post 1 Card */}
        {[activeMatch.post1, activeMatch.post2].map((currentPost, index) => (
          <div key={currentPost._id} className="card w-full lg:w-[45%] bg-base-100 shadow-xl transition-all hover:shadow-2xl">
            {currentPost.imageUrl && (
              <figure className="h-64 overflow-hidden"> {/* Sabit yükseklik, taşan kısmı gizle */}
                <img src={`http://localhost:5001${currentPost.imageUrl}`} alt={currentPost.title?.replace(/\"/g, '')} className="w-full h-full object-cover" />
              </figure>
            )}
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2">
                <Link to={`/posts/${currentPost._id}`} className="link link-hover">
                    {currentPost.title?.replace(/\"/g, '')}
                </Link>
              </h2>
              <p className="text-xs text-base-content/60 mb-1">Yazar: {currentPost.author?.username || 'Bilinmiyor'}</p>
              <p className="text-xs text-base-content/60 mb-3">Kategori: {currentPost.category?.replace(/\"/g, '')}</p>
              <p className="text-sm line-clamp-4 mb-4">{currentPost.content?.replace(/\"/g, '')}</p>

              {displayResults ? (
                <div className="text-center">
                  <div className="radial-progress text-primary my-2" style={{"--value": index === 0 ? percentPost1 : percentPost2, "--size": "6rem", "--thickness": "0.5rem"}} role="progressbar">
                    {index === 0 ? percentPost1 : percentPost2}%
                  </div>
                  <p className="font-semibold">{index === 0 ? activeMatch.votesPost1 : activeMatch.votesPost2} Oy</p>
                </div>
              ) : (
                <div className="card-actions justify-center">
                  <button
                    onClick={() => handleVote(currentPost._id)}
                    className="btn btn-neutral btn-sm normal-case rounded-md" // btn-ghost yerine btn-neutral, text-primary'yi kaldırdık
                    disabled={isLoading}
                  >
                    Buna Oy Ver!
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayResults && (
        <div className="text-center mt-10">
          <button onClick={fetchNewMatch} className="btn btn-neutral btn-lg" disabled={isLoading && activeMatch}>
            {isLoading && activeMatch ? <span className="loading loading-spinner"></span> : "Sıradaki Kapışma!" }
          </button>
        </div>
      )}
       <div className="text-center mt-8">
            <Link to="/" className="btn btn-outline btn-sm">Anasayfaya Dön</Link>
        </div>
    </div>
  );
}

export default BattlePage;