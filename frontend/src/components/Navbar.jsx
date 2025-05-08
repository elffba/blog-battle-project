import React, { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset as resetAuthStatus } from '../features/auth/authSlice';
import { startMatch, resetMatchStatus } from '../features/matches/matchSlice';
import { Menu } from 'lucide-react'; 

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading: matchLoading } = useSelector((state) => state.match);

  const onLogout = () => {
    console.log('Çıkış Yap Butonuna Tıklandı!'); 
    dispatch(logout());
    dispatch(resetAuthStatus());
    navigate('/');
  };

  const handleStartNewMatch = () => {
    if (!user) { // Giriş yapmamışsa uyar ve yönlendir
      alert("Yeni bir kapışma başlatmak için lütfen giriş yapın.");
      navigate('/login');
      return;
    }
    // Giriş yapmışsa maçı başlat
    console.log("Navbar - Yeni Kapışma Başlat butonu tıklandı.");
    dispatch(startMatch())
      .unwrap()
      .then((newlyCreatedMatch) => {
        console.log('Yeni eşleşme başarıyla başlatıldı:', newlyCreatedMatch);
        dispatch(resetMatchStatus()); // Başarı sonrası state'i temizle
        navigate('/battle', { state: { newMatch: newlyCreatedMatch } });
      })
      .catch((error) => {
        alert(`Eşleşme Başlatma Hatası: ${error?.message || error || 'Bilinmeyen hata'}`);
        dispatch(resetMatchStatus()); // Hata sonrası state'i temizle
      });
  };

  useEffect(() => {
    return () => {
        dispatch(resetMatchStatus());
    }
  }, [dispatch]); 

  return (
    <div className="navbar bg-neutral text-neutral-content shadow-md px-4 sm:px-6 lg:px-8">
      {/* Sol Taraf */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl normal-case">
          BlogBattle
        </Link>
      </div>

      {/* Orta Kısım (Boş) */}
      <div className="navbar-center hidden lg:flex">
      </div>

      {/* Sağ Taraf */}
      <div className="navbar-end">
         {/* Büyük Ekranda Görünecek Menü Öğeleri */}
         <ul className="menu menu-horizontal p-0 text-sm hidden lg:flex items-center">
           {/* 1. Yeni Kapışma Butonu (Her zaman görünür, onClick içinden kontrol edilir) */}
           <li className="ml-1">
             <button onClick={handleStartNewMatch} className="btn btn-success btn-sm normal-case rounded-md" disabled={matchLoading}>
               {matchLoading ? <span className="loading loading-spinner loading-xs"></span> : '⚡ Yeni Kapışma!'}
             </button>
           </li>
           {/* 2. Oy Ver! Linki (Her zaman görünür) */}
           <li className="ml-1">
             <Link to="/battle" className="btn btn-success btn-sm normal-case rounded-md">Oy Ver!</Link>
           </li>
           {/* 3. Anasayfa Linki (Her zaman görünür) */}
           <li className="ml-1">
             <Link to="/" className="btn btn-ghost btn-sm normal-case rounded-md">Anasayfa</Link>
           </li>
           {user ? (
             <>
               <li className="ml-1">
                 <Link to="/create-post" className="btn btn-ghost btn-sm normal-case rounded-md">Yeni Yazı</Link>
               </li>
               <li className="ml-1">
                 <button onClick={onLogout} className="btn btn-ghost btn-sm normal-case rounded-md">Çıkış Yap</button>
               </li>
             </>
           ) : (
             <>
               <li className="ml-1">
                 <Link to="/login" className="btn btn-ghost btn-sm normal-case rounded-md">Giriş Yap</Link>
               </li>
               <li className="ml-1">
                 <Link to="/register" className="btn btn-success btn-sm normal-case rounded-md">Kayıt Ol</Link>
               </li>
             </>
           )}
         </ul>

        {/* Mobil Menü İçin Dropdown */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="h-5 w-5" />
          </label>
        
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">
            <li onClick={!matchLoading ? handleStartNewMatch : undefined} className={matchLoading ? "disabled" : ""}>
                <a>{matchLoading ? <span className="loading loading-spinner loading-xs"></span> : '⚡ Yeni Kapışma!'}</a>
            </li>
            <li><Link to="/battle">Oy Ver!</Link></li>
            <li><Link to="/">Anasayfa</Link></li>
            {user && <li><Link to="/create-post">Yeni Yazı</Link></li>}
            {user ? (
              <li onClick={onLogout}><a>Çıkış Yap</a></li>
            ) : (
              <>
                <li><Link to="/login">Giriş Yap</Link></li>
                <li><Link to="/register">Kayıt Ol</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;