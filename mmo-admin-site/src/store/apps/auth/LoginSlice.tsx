import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import axiosServices from 'src/utils/axios';

interface AuthState {
  user: any;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('isLoggedIn', 'true');
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('accessToken');
      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const loginUser = (credentials: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('auth/login', credentials);
    dispatch(loginSuccess(response.data));
    dispatch(setMessage({ message: 'Login successful!', severity: 'success' }));
  } catch (error) {
    console.error('Login failed:', error);
    dispatch(setMessage({ message: 'Login failed. Please try again.', severity: 'error' }));
  }
};

export const checkAuthStatus = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const response = await axiosServices.get('auth/verifyToken', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(loginSuccess(response.data));
      dispatch(setMessage({ message: 'User authenticated successfully!', severity: 'success' }));
    } catch (error) {
      dispatch(logout());
      dispatch(
        setMessage({ message: 'Session expired. Please log in again.', severity: 'warning' }),
      );
    }
  } else {
    dispatch(logout());
    dispatch(setMessage({ message: 'No active session found. Please log in.', severity: 'info' }));
  }
};

export default authSlice.reducer;
