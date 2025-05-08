// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux'; // useSelector importu zaten var, güzel!

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import BattlePage from './pages/BattlePage';
import Navbar from './components/Navbar';

function App() {
  // ---- EKSİK OLAN SATIR BURASIYDI ----
  const { user } = useSelector((state) => state.auth); // <--- BU SATIRI EKLE!
  // ------------------------------------

  return (
    <>
    <Navbar /> {/* Navbar kendi iç padding'ine sahip (px-4 sm:px-6 lg:px-8) */}

    {/* Hoş geldin mesajı, Navbar ile aynı yan padding'i almalı */}
    {user && (
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2"> {/* Sadece yan padding'ler + üst/alt */}
        {/* Container ve max-width'i bir üst seviyede (main) veya burada da kullanabiliriz. */}
        {/* Şimdilik sadece padding'i eşitleyelim Navbar ile. */}
        <div className="container mx-auto max-w-7xl"> {/* İçeriği ortalamak için container */}
          <p className="text-lg text-base-content/80">
            Merhaba, <span className="font-semibold text-success">{user.username}!</span>
          </p>
        </div>
      </div>
    )}

      {/* Ana içerik alanı */}
      <main className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${user ? 'py-4' : 'py-8'}`}> {/* Eğer hoş geldin mesajı varsa üst padding'i azalt */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/edit-post/:postId" element={<EditPostPage />} />
          <Route path="/battle" element={<BattlePage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;