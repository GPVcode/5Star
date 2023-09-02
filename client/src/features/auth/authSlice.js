import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define an async thunk for user login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('http://localhost:2239/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (response.ok) {
        const userData = await response.json();
        dispatch({ type: 'AUTH_SUCCESS', payload: userData }); // Include 'username' in 'userData'

        return userData;
      } else {

        return rejectWithValue('Authentication failed');
      }
    } catch (error) {
      return rejectWithValue('Error: ' + error.message);
    }
  });

  export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue, dispatch }) => {
    try{ 
      const response = await fetch('http://localhost:2239/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if(response.ok){
        const newUser = await response.json();
        dispatch({ type: 'AUTH_SUCCESS', payload: newUser });

        return newUser;
      } else {

        return rejectWithValue('Registration failed');
      }
    } catch (error){

      return rejectWithValue('Error: ' + error.message);
    }
  });

// create slice for authentication
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
          state.isAuthenticated = false;
          state.user = null;
        },
        clearError: (state) => {
          state.error = null;
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
          })
          .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;