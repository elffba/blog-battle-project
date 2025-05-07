// src/features/posts/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Backend API URL'si (Post endpoint'leri için)
const API_URL = 'http://localhost:5001/api/posts/';

// Başlangıç state'i
const initialState = {
  posts: [],          // Tüm postların listesi
  post: null,           // Tek bir postu tutmak için (detay/güncelleme) - şimdilik null
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks ---

// Get all posts
export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => { // İlk argüman (payload) yoksa '_' kullanabiliriz
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

// Create new post
// postData: { title, content, category, image } -> FormData olarak gelecek!
export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      // Token'ı auth state'inden almamız gerekiyor!
      const token = thunkAPI.getState().auth.token; // store'daki auth slice'ından token'ı oku

      // Axios request config (token ve FormData için)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' // Axios FormData gönderirken bunu genelde otomatik ayarlar
        },
      };

      // POST isteği (postData FormData olmalı)
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
  'posts/getOne', // Action type prefix
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + postId); // API_URL'in sonuna postId'yi ekle
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
// Argüman olarak { postId, postData } alacak. postData FormData olacak.
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ postId, postData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' // Axios FormData ile otomatik ayarlar
        },
      };
      const response = await axios.put(API_URL + postId, postData, config);
      return response.data; // Güncellenmiş post verisi
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
    reset: (state) => { // initialState'e resetlerken post'u da null yapalım
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
        state.post = null; // Tek postu da sıfırla
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
        // state.isSuccess = true; // Genellikle listeleme için bu gerekli değil
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
        // state.posts.unshift(action.payload); // Yeni postu listenin başına ekleyebiliriz
                                              // Veya sadece mesaj verip listenin yeniden çekilmesini bekleyebiliriz.
                                              // Şimdilik sadece mesaj verelim.
        state.message = 'Yazı başarıyla oluşturuldu!';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getPostById Thunk Durumları (EKSİK OLAN KISIM BUYDU)
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
        state.post = null; // Yeni post yüklenirken eskisini temizle
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isSuccess = true; // GET için genellikle bu işaretlenmez
        state.post = action.payload; // Gelen tek postu state'e ata
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
        // Eğer state.posts güncel tutuluyorsa, silinen postu buradan çıkar:
        state.posts = state.posts.filter((p) => p._id !== action.payload); // action.payload silinen postId idi
        if (state.post && state.post._id === action.payload) {
          state.post = null; // Eğer detayda gösterilen post silindiyse onu da temizle
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
      // TODO: updatePost için de durumları ekle (Bu hala yapılacak)
  },
});

export const { reset, resetStatus } = postSlice.actions;
export default postSlice.reducer;