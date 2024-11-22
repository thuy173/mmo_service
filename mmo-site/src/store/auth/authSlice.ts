// src/store/authSlice.ts
import { AuthResponse, LoginRequest } from '@/models/auth';
import authService from '@/services/authService';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/localStorage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser } from '../user/userSlice';

export interface AuthState {
    authRes: AuthResponse;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    authRes: {} as AuthResponse,
    isAuthenticated: false,
    token: getItemLocalStorage("accessToken") || null,
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (req: LoginRequest, { rejectWithValue }) => {
        removeItemLocalStorage("accessToken")
        try {
            const response = await authService.login(req)
            setItemLocalStorage("accessToken", response.accessToken)
            return response;
        } catch (error) {
            return rejectWithValue(error || 'Failed to login');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            removeItemLocalStorage("accessToken")
            state.authRes = {} as AuthResponse;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.authRes = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUser.fulfilled, (state) => {
                state.isAuthenticated = true;
            })
    },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
