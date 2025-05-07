// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; 
import postReducer from '../features/posts/postSlice'; // <--- Post reducer'ı import et
import matchReducer from '../features/matches/matchSlice'; // <--- Match reducer'ı import et



export const store = configureStore({
  reducer: {
    auth: authReducer, // <--- YENİ EKLENDİ (auth key'i ile reducer'ı bağlıyoruz)
    posts: postReducer, // İleride postlar için de ekleyeceğiz
    match: matchReducer, // <--- Match reducer'ını ekle

  
  },
  devTools: process.env.NODE_ENV !== 'production',
});