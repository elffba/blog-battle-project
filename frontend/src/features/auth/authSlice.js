// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // API istekleri için axios

// Backend API URL'si (Bunu .env dosyasına taşımak daha iyi olurdu ama şimdilik burada)
// Backend'in çalıştığı portu kontrol et (5001 kullanmıştık)
const API_URL = 'http://localhost:5001/api/auth/';

// Local Storage'dan kullanıcı bilgilerini almayı dene (Sayfa yenilendiğinde state'i korumak için)
const storedUser = JSON.parse(localStorage.getItem('user'));
const storedToken = localStorage.getItem('token'); // Token'ı ayrı saklamak daha yaygın

// Başlangıç state'i
const initialState = {
  user: storedUser ? storedUser : null, // Kullanıcı bilgisi veya null
  token: storedToken ? storedToken : null, // Token veya null
  isError: false,       // Hata durumu
  isSuccess: false,     // Başarı durumu
  isLoading: false,     // Yüklenme durumu (API isteği sırasında)
  message: '',        // Hata veya başarı mesajı
};

// --- Async Thunks (API İstekleri) ---

// Register User Thunk
export const register = createAsyncThunk(
  'auth/register', // Action type prefix
  async (userData, thunkAPI) => { // userData: {username, email, password}
    try {
      const response = await axios.post(API_URL + 'register', userData);

      // Başarılı olursa backend'den dönen veriyi (user + token) sakla
      if (response.data) {
        // Token ve kullanıcı bilgisini local storage'a kaydet
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data)); // User objesini de saklayabiliriz
      }
      return response.data; // Fulfilled action'ın payload'u olacak
    } catch (error) {
      // Hata durumunda backend'den gelen mesajı veya genel hata mesajını al
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // Hata mesajıyla birlikte reject et (rejected action'ın payload'u olacak)
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User Thunk
export const login = createAsyncThunk(
  'auth/login', // Action type prefix
  async (userData, thunkAPI) => { // userData: {email, password}
    try {
      const response = await axios.post(API_URL + 'login', userData);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
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

// Logout Action (Basit state sıfırlama + local storage temizleme)
// Not: createAsyncThunk olmadan da yapılabilir çünkü backend'e gitmiyor.
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // İleride belki backend'e de bir logout isteği atılabilir (token blacklist vb için)
});


// --- Slice Tanımı ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Senkron action'lar ve state güncellemeleri için reducer'lar
  reducers: {
    // State'i resetlemek için (örn: form gönderildikten sonra mesajları temizlemek)
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  // Async thunk action'larının durumlarına göre state güncellemeleri
  extraReducers: (builder) => {
    builder
      // Register Thunk Durumları
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Backend'den dönen user objesi + token
        state.token = action.payload.token;
        state.message = 'Kayıt başarılı!'; // İsteğe bağlı mesaj
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // thunkAPI.rejectWithValue'dan gelen mesaj
        state.user = null;
        state.token = null;
      })
      // Login Thunk Durumları
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.message = 'Giriş başarılı!'; // İsteğe bağlı mesaj
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
       // Logout Thunk Durumu (fulfilled yeterli)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        // Diğer state'leri de sıfırlayabiliriz istersen
        state.isSuccess = false;
        state.isError = false;
        state.isLoading = false;
        state.message = 'Çıkış yapıldı.';
      });
  },
});

// Action creator'ları export et
export const { reset } = authSlice.actions;
// Ana reducer'ı export et
export default authSlice.reducer;