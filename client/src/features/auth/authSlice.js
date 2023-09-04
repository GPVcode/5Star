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

        // Store both the token and user data in localStorage
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch(setUser(userData)); // Include 'username' in 'userData'

        return userData;
      } else {

        return rejectWithValue('Authentication failed');
      }
    } catch (error) {
      return rejectWithValue('Error: ' + error.message);
    }
  });

  export const googleSignIn = createAsyncThunk('auth/googleSignIn', async (_, { rejectWithValue }) => {
    try {
      // Redirect the user to the Google OAuth URL
      window.location.href = 'http://localhost:2239/oauth/google';
  
      // In this case, there's no response because the user will be redirected to Google
      // and then back to your application after authentication.
  
      // You may handle the response from Google in your OAuth callback route.
      // The response will contain an authorization code or access token,
      // which you can use to fetch user data from Google and generate a token for your app.
    } catch (error) {
      return rejectWithValue('Error: ' + error.message);
    }
  });

const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if(!token) return false;

  return true
};

const initialUser = JSON.parse(localStorage.getItem('user'));

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
      dispatch(setUser(newUser)); // Use setUser action to set user data

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
        isAuthenticated: isTokenValid(),
        user: initialUser,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
        },
        clearUser: (state) => {
          state.isAuthenticated = false;
          state.user = null;
        },
        logout: (state) => {
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
          })
          .addCase(googleSignIn.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(googleSignIn.fulfilled, (state) => {
            state.loading = false;
          })
          .addCase(googleSignIn.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    },
});

export const { logout, clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;