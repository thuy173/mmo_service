import { UserRequest, UserResponse } from "@/models/user";
import { Wallet } from "@/models/wallet";
import userService from "@/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/authSlice";

export interface UserState {
    user: UserResponse;
    loadingAvatar: boolean;
    loadingProfile: boolean;
    wallet: Wallet;
}

const initialState: UserState = {
    user: {} as UserResponse,
    loadingAvatar: false,
    loadingProfile: false,
    wallet: {} as Wallet,
}

export const fetchUser = createAsyncThunk(
    'user/fetch',
    async () => {
        const response = await userService.getUser()
        return response
    }
)

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (req: UserRequest) => {
        const response = await userService.updateUser(req)
        return response
    }
)

export const updateAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (file: File) => {
        const response = await userService.updateAvatar(file)
        return response
    }
)

export const fetchWallet = createAsyncThunk(
    'user/wallet',
    async () => {
        const response = await userService.getWallet()
        return response
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateLocalWallet: (state, action) => {
            const { amount } = action.payload;
            state.wallet.balance -= amount;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(updateProfile.pending, (state) => {
                state.loadingProfile = true
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loadingProfile = false
                const user = action.payload
                if (state.user) state.user = user;
            })
            .addCase(updateProfile.rejected, (state) => {
                state.loadingProfile = false
            })
            .addCase(updateAvatar.pending, (state) => {
                state.loadingAvatar = true
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loadingAvatar = false
                const avatarUrl = action.payload
                if (state.user) state.user.avatar = avatarUrl;
            })
            .addCase(updateAvatar.rejected, (state) => {
                state.loadingAvatar = false
            })
            .addCase(fetchWallet.fulfilled, (state, action) => {
                state.wallet = action.payload
            })
            .addCase(logoutUser, (state) => {
                state.user = {} as UserResponse;
            })
    },
});

export const { updateLocalWallet } = userSlice.actions
export default userSlice.reducer