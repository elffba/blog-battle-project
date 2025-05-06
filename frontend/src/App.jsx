// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Minimal Routing Testi (Sıfırdan Kurulum)</h1>
      <nav>
        <a href="/">Anasayfa</a> | <a href="/login">Login</a> | <a href="/register">Register</a>
      </nav>
      <Routes>
        <Route path="/" element={<h2>Anasayfa Çalışıyor!</h2>} />
        <Route path="/login" element={<h2>Login Sayfası Çalışıyor!</h2>} />
        <Route path="/register" element={<h2>Register Sayfası Çalışıyor!</h2>} />
      </Routes>
    </div>
  );
}
export default App;