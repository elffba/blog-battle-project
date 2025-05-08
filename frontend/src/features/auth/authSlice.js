import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // API istekleri için axios


const API_URL = 'http://localhost:5001/api/auth/';

const storedUser = JSON.parse(localStorage.getItem('user'));
const storedToken = localStorage.getItem('token'); 


const initialState = {
  user: storedUser ? storedUser : null, 
  token: storedToken ? storedToken : null, 
  isError: false,       
  isSuccess: false,     
  isLoading: false,     
  message: '',       
};

// --- Async Thunks (API İstekleri) ---

// Register User Thunk
export const register = createAsyncThunk(
  'auth/register', 
  async (userData, thunkAPI) => { // userData: {username, email, password}
    try {
      const response = await axios.post(API_URL + 'register', userData);

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data)); 
      }
      return response.data; 
    } catch (error) {
      // Hata durumunda backend'den gelen mesajı veya genel hata mesajını al
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // Hata mesajıyla birlikte reject et 
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User Thunk
export const login = createAsyncThunk(
  'auth/login', 
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


export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
});


// --- Slice Tanımı ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // State'i resetlemek için 
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
        state.message = 'Kayıt başarılı!'; 
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
        state.message = 'Giriş başarılı!'; 
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
        state.isSuccess = false;
        state.isError = false;
        state.isLoading = false;
        state.message = 'Çıkış yapıldı.';
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;