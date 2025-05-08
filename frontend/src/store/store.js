// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; 
import postReducer from '../features/posts/postSlice'; 
import matchReducer from '../features/matches/matchSlice'; 



export const store = configureStore({
  reducer: {
    auth: authReducer, 
    posts: postReducer, 
    match: matchReducer, 

  
  },
  devTools: process.env.NODE_ENV !== 'production',
});