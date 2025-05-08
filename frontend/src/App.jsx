import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux'; 

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import BattlePage from './pages/BattlePage';
import Navbar from './components/Navbar';

function App() {
  const { user } = useSelector((state) => state.auth); 

  return (
    <>
    <Navbar /> 

    {user && (
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2"> 
        
        <div className="container mx-auto max-w-7xl"> 
          <p className="text-lg text-base-content/80">
            Merhaba, <span className="font-semibold text-success">{user.username}!</span>
          </p>
        </div>
      </div>
    )}

      <main className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${user ? 'py-4' : 'py-8'}`}> 
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