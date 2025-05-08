import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/matches/'; // Match API URL'si

const initialState = {
  activeMatch: null, 
  isLoading: false,
  isError: false,
  isSuccess: false, 
  message: '',
};

// --- Async Thunks ---

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
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

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


export const startMatch = createAsyncThunk(
  'matches/start',
  async (categoryData, thunkAPI) => { 
    try {

      const response = await axios.post(API_URL + 'start', categoryData || {});
      return response.data; 
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
    resetMatchStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearActiveMatch: (state) => {
      state.activeMatch = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveMatch.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; 
        state.isError = false;
        state.message = '';
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
        state.activeMatch = null; 
      })
      .addCase(voteOnMatch.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; 
        state.isError = false;
        state.message = '';
      })
      .addCase(voteOnMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activeMatch = action.payload; 
        state.message = 'Oyunuz başarıyla kaydedildi!';
      })
      .addCase(voteOnMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(startMatch.pending, (state) => {
        state.isLoading = true; 
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(startMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Yeni eşleşme başarıyla başlatıldı!';
      })
      .addCase(startMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; 
      });
  },
});

export const { resetMatchStatus, clearActiveMatch } = matchSlice.actions;
export default matchSlice.reducer;