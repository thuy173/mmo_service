import { OrderRequest, OrderResponse } from '@/models/order';
import { PageResponse } from '@/models/pageResponse';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateLocalProductStock } from '../product/productSlice';
import orderService from '@/services/orderService';
import { updateLocalWallet } from '../user/userSlice';

export interface OrderState {
    orders: PageResponse<OrderResponse>;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: {} as PageResponse<OrderResponse>,
    loading: false,
    error: null,
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (
        { orderCode, createdAt, daysRange, pageNumber, pageSize, sortField, sortDirection }:
            {
                orderCode: string,
                createdAt: string,
                daysRange: number,
                pageNumber: number,
                pageSize: number,
                sortField: string,
                sortDirection: string,
            }
    ) => {
        const response = await orderService.getOrders(orderCode, createdAt, daysRange, pageNumber, pageSize, sortField, sortDirection);
        return response;
    }
);

// Async thunk to create an order via an API
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: OrderRequest, { dispatch }) => {
        const response = await orderService.addOrder(orderData)

        // After successfully creating an order, update the local product stock
        const { productId, quantity } = orderData;
        dispatch(updateLocalProductStock({ productId, quantity }));
        dispatch(updateLocalWallet({ amount: response.amount }))

        return response;
    }
);

export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (orderId: string) => {
        await orderService.deleteOrder(orderId)
        return orderId;
    }
);

export const deleteManyOrders = createAsyncThunk(
    'orders/deleteManyOrders',
    async (orderIds: string[]) => {
        await orderService.deleteManyOrders(orderIds)
        return orderIds
    }
)

// Create the order slice
const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch orders';
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                const order = action.payload;
                const blob = new Blob([order.accounts ? order.accounts : ''], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${order.orderCode}.txt`;
                document.body.appendChild(a); // Append to body to work in Firefox
                a.click();
                document.body.removeChild(a); // Clean up

                window.URL.revokeObjectURL(url);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create order';
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                const orderId = action.payload;
                const order = state.orders.content.find((order) => order.id === orderId);
                if (order) {
                    order.isDeleted = true;
                }
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete order';
            })
            .addCase(deleteManyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteManyOrders.fulfilled, (state, action) => {
                state.loading = false;
                const orderIds = action.payload;
                orderIds.forEach((id) => {
                    const order = state.orders.content.find((order) => order.id === id);
                    if (order) {
                        order.isDeleted = true;
                    }
                });
            })

            .addCase(deleteManyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete many order';
            })
    },
});

export default orderSlice.reducer;
