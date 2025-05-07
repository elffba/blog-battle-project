// src/features/matches/matchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/matches/'; // Match API URL'si

const initialState = {
  activeMatch: null, // Aktif eşleşme verilerini tutacak
  isLoading: false,
  isError: false,
  isSuccess: false, // Thunk başarı durumları için genel bir flag olabilir
  message: '',
};

// --- Async Thunks ---

// Get an active match
export const getActiveMatch = createAsyncThunk(
  'matches/getActive',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + 'active');
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      // Eğer 'Aktif eşleşme bulunamadı.' hatasıysa, bunu farklı işleyebiliriz belki
      // if (message.includes('Aktif eşleşme bulunamadı')) { // Veya status code 404 kontrolü
      //     return thunkAPI.fulfillWithValue(null); // Başarılı ama veri yok gibi? Veya reject edelim şimdilik.
      // }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Vote on a match
// Argüman: { matchId, votedForPostId }
export const voteOnMatch = createAsyncThunk(
  'matches/vote',
  async ({ matchId, votedForPostId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL + `${matchId}/vote`, { votedForPostId }, config);
      return response.data; // Güncellenmiş eşleşme verisi
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Start a new match - YENİ EKLENDİ
// Payload olarak isteğe bağlı { category: '...' } alabilir
export const startMatch = createAsyncThunk(
  'matches/start',
  async (categoryData, thunkAPI) => { // categoryData {category: '...'} veya undefined olacak
    try {
      // Bu endpoint public olduğu için token'a gerek yok şimdilik
      // Eğer kategori bilgisi varsa onu gönder, yoksa boş obje gönder
      const response = await axios.post(API_URL + 'start', categoryData || {});
      return response.data; // Yeni oluşturulan match nesnesi
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Slice Tanımı ---
export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    // Sadece statusları resetle (message, isError, isSuccess, isLoading)
    resetMatchStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    // Aktif maçı temizle (yeni bir tane çekmeden önce)
    clearActiveMatch: (state) => {
      state.activeMatch = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getActiveMatch Durumları
      .addCase(getActiveMatch.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; // Reset status flags
        state.isError = false;
        state.message = '';
        // state.activeMatch = null; // Yeni eşleşme yüklenirken eskisini temizle (isteğe bağlı)
      })
      .addCase(getActiveMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activeMatch = action.payload;
      })
      .addCase(getActiveMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.activeMatch = null; // Eşleşme bulunamadıysa null yap
      })
      // voteOnMatch Durumları
      .addCase(voteOnMatch.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; // Reset status flags
        state.isError = false;
        state.message = '';
      })
      .addCase(voteOnMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activeMatch = action.payload; // Güncel eşleşme verisiyle state'i güncelle
        state.message = 'Oyunuz başarıyla kaydedildi!';
      })
      .addCase(voteOnMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // startMatch Durumları - YENİ EKLENDİ
      .addCase(startMatch.pending, (state) => {
        state.isLoading = true; // Eşleşme başlatılırken yükleniyor
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(startMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Yeni eşleşme başarıyla başlatıldı!';
        // state.activeMatch = action.payload; // İstersek yeni maçı direkt state'e atayabiliriz
      })
      .addCase(startMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Örn: "Uygun yazı bulunamadı"
      });
  },
});

export const { resetMatchStatus, clearActiveMatch } = matchSlice.actions;
export default matchSlice.reducer;