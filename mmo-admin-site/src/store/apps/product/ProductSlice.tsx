import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { ProductDto } from 'src/types/apps/product';
import axiosServices from 'src/utils/axios';

interface StateType {
  products: ProductDto[];
  productDetail: ProductDto | null;
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  products: [],
  productDetail: null,
  totalElements: 0,
  error: '',
};

export const ProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProduct: (state, action) => {
      state.products = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    getDetailProduct: (state, action) => {
      state.productDetail = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((products) => products.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((products) => products.id !== action.payload.id);
    },
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getProduct, getDetailProduct, addProduct, updateProduct, deleteProduct } =
  ProductSlice.actions;

// Fetch Product
export const fetchProduct =
  (
    searchName = '',
    subProductCategoryId?: number,
    pageNumber = 0,
    pageSize = 10,
    sortField = 'id',
    sortDirection = 'ASC',
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const params: any = {
        pageNumber,
        pageSize,
        sortField,
        sortDirection,
      };

      if (searchName) {
        params.name = searchName;
      }

      if (subProductCategoryId) {
        params.subProductCategoryId = subProductCategoryId;
      }

      const response = await axiosServices.get(`products`, { params });
      dispatch(getProduct(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Fetch Product by ID
export const fetchProductById = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`products/${id}`);
    dispatch(getDetailProduct(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

// Add Product
export const addNewProduct = (product: ProductDto) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('products', product);
    dispatch(addProduct(response.data));
    dispatch(setMessage({ message: 'Add new product successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
  }
};

// Update Product
export const updateExistingProduct = (formData: FormData) => async (dispatch: AppDispatch) => {
  try {
    const id = formData.get('id');
    const response = await axiosServices.put(`products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(updateProduct(response.data));
    dispatch(setMessage({ message: 'Update product successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Update failed. Please try again.', severity: 'error' }));
  }
};

// Delete Product
export const deleteExistingProduct = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`products/${id}`);
    dispatch(deleteProduct({ id }));
    dispatch(setMessage({ message: 'Delete product successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default ProductSlice.reducer;
