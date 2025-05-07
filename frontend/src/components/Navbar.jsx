// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    // ↓↓ Navbar stilleri güncellendi ↓↓
    <div className="navbar bg-neutral text-neutral-content shadow-md px-4 sm:px-6 lg:px-8">
      {/* Sol Taraf - Logo/Başlık */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl normal-case"> {/* normal-case ile harf dönüşümünü engelle */}
          BlogBattle
        </Link>
      </div>

      {/* Sağ Taraf - Menü */}
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 text-sm"> {/* Padding sıfırlandı, font küçüldü */}
        <li> {/* YENİ EKLENDİ */}
      <Link to="/battle" className="btn btn-accent btn-sm normal-case rounded-md">Oy Ver!</Link>
    </li>
          <li>
            <Link to="/" className="btn btn-ghost btn-sm normal-case rounded-md">Anasayfa</Link> {/* Buton görünümü */}
          </li>
          {user ? (
            // Giriş Yapılmışsa
            <>
              <li className="ml-2"> {/* Kullanıcı adı için */}
                 {/* Hoş geldin mesajını doğrudan metin olarak gösterelim */}
                 <span className="px-3 py-2">Hoş geldin, {user.username}!</span>
              </li>
              <li className="ml-1">
                <Link to="/create-post" className="btn btn-ghost btn-sm normal-case rounded-md">Yeni Yazı</Link>
              </li>
              <li className="ml-1">
                <button onClick={onLogout} className="btn btn-ghost btn-sm normal-case rounded-md">
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            // Giriş Yapılmamışsa
            <>
              <li className="ml-1">
                <Link to="/login" className="btn btn-ghost btn-sm normal-case rounded-md">Giriş Yap</Link>
              </li>
              <li className="ml-1">
              <Link to="/register" className="btn btn-success btn-sm normal-case rounded-md">Kayıt Ol</Link> {/* btn-primary yerine btn-success */}
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;