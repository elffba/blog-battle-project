// src/features/posts/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/posts/';

const initialState = {
  posts: [],          
  post: null,           
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks ---

export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => { 
    try {
      const response = await axios.get(API_URL); // GET isteği
      return response.data; // Dönen post listesi
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token; // store'daki auth slice'ından token'ı oku

      // Axios request config 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(API_URL, postData, config);
      return response.data; // Oluşturulan post verisi
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single post by ID
export const getPostById = createAsyncThunk(
  'posts/getOne', 
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + postId); 
      return response.data; // Dönen tek post nesnesi
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(API_URL + postId, config);
      return postId; // Başarılı silme durumunda silinen post'un ID'sini döndür
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update post
// Argüman olarak { postId, postData } alacak. postData FormData 
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ postId, postData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' 
        },
      };
      const response = await axios.put(API_URL + postId, postData, config);
      return response.data; 
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Slice Tanımı ---
export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => { 
      state.posts = [];
      state.post = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    resetStatus: (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
        state.post = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      // getPosts Thunk Durumları
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.posts = [];
      })

      // createPost Thunk Durumları
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Yazı başarıyla oluşturuldu!';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
        state.post = null; 
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload; 
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.post = null;
      })

      // deletePost Thunk Durumları
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Yazı başarıyla silindi!';
        state.posts = state.posts.filter((p) => p._id !== action.payload); 
        if (state.post && state.post._id === action.payload) {
          state.post = null; 
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
      
  },
});

export const { reset, resetStatus } = postSlice.actions;
export default postSlice.reducer;