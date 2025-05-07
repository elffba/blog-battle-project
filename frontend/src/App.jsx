// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage'; // <--- YENİ IMPORT
import PostDetailPage from './pages/PostDetailPage'; // <--- YENİ IMPORT
import EditPostPage from './pages/EditPostPage'; // <--- YENİ IMPORT
import BattlePage from './pages/BattlePage'; // <--- YENİ IMPORT
import Navbar from './components/Navbar'; 


function App() {
  return (
    <>
    <Navbar /> 
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-2xl mb-4">Blog Battle</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-post" element={<CreatePostPage />} /> {/* <--- YENİ ROUTE */}
          <Route path="/posts/:postId" element={<PostDetailPage />} /> {/* <--- YENİ ROUTE */}
          <Route path="/edit-post/:postId" element={<EditPostPage />} /> {/* <--- YENİ ROUTE */}
          <Route path="/battle" element={<BattlePage />} /> {/* <--- YENİ ROUTE */}

        </Routes>
      </main>
    </>
  );
}

export default App;