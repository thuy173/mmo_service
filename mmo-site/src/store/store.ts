// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/auth/authSlice';
import userReducer from '@/store/user/userSlice';
import productReducer from '@/store/product/productSlice';
import orderReducer from '@/store/order/orderSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        products: productReducer,
        orders: orderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
