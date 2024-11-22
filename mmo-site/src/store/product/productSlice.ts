import { PageResponse } from '@/models/pageResponse';
import { Product, ShortProduct } from '@/models/product';
import productService from '@/services/productService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ProductState {
    products: PageResponse<ShortProduct>;
    product: Product;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: {} as PageResponse<ShortProduct>,
    product: {} as Product,
    loading: false,
    error: null,
};

// Async thunk to fetch products from an API
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (
        { name, subCatId, pageNumber, pageSize, sortField, sortDirection }:
            {
                name: string;
                subCatId?: number;
                pageNumber?: number;
                pageSize?: number;
                sortField?: string;
                sortDirection?: string;
            }
    ) => {
        const response = await productService.getAllProducts(name, subCatId, pageNumber, pageSize, sortField, sortDirection);
        return response;
    }
);

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId: number) => {
        const response = await productService.getProductById(productId)
        return response;
    }
);

// Create the product slice
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Reducer to update stock locally
        updateLocalProductStock: (state, action) => {
            const { productId, quantity } = action.payload;
            const product = state.products?.content.find((product) => product.id === productId);
            if (product) {
                product.availableAccountQty -= quantity;
                product.soldAccountQty += quantity;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch product by ID';
            });
    },
});

export const { updateLocalProductStock } = productSlice.actions
export default productSlice.reducer
