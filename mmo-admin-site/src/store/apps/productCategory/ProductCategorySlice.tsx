import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { ProductCategoryDto } from 'src/types/apps/productCategory';
import axiosServices from 'src/utils/axios';

interface StateType {
  productCategory: ProductCategoryDto[];
  error: string;
}

const initialState: StateType = {
  productCategory: [],
  error: '',
};

export const ProductCategorySlice = createSlice({
  name: 'productCategories',
  initialState,
  reducers: {
    getProductCategory: (state, action) => {
      state.productCategory = action.payload;
    },
    addProductCategory: (state, action) => {
      state.productCategory.push(action.payload);
    },
    updateProductCategory: (state, action) => {
      const index = state.productCategory.findIndex(
        (category) => category.id === action.payload.id,
      );
      if (index !== -1) {
        state.productCategory[index] = action.payload;
      }
    },
    deleteProductCategory: (state, action) => {
      state.productCategory = state.productCategory.filter(
        (category) => category.id !== action.payload.id,
      );
    },
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const {
  hasError,
  getProductCategory,
  addProductCategory,
  updateProductCategory,
  deleteProductCategory,
} = ProductCategorySlice.actions;

// Fetch Product Category
export const fetchProductCategory = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`product-categories`);
    dispatch(getProductCategory(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

// Add Product Category
export const addNewProductCategory =
  (category: ProductCategoryDto) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosServices.post('product-categories', category);
      dispatch(addProductCategory(response.data));
      dispatch(setMessage({ message: 'Add new category successful!', severity: 'success' }));
    } catch (error) {
      dispatch(hasError(error));
      dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
    }
  };

// Update Product Category
export const updateExistingProductCategory =
  (formData: FormData) => async (dispatch: AppDispatch) => {
    try {
      const id = formData.get('id');
      const response = await axiosServices.put(`product-categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(updateProductCategory(response.data));
      dispatch(setMessage({ message: 'Update category successful!', severity: 'success' }));
    } catch (error) {
      dispatch(hasError(error));
      dispatch(setMessage({ message: 'Update failed. Please try again.', severity: 'error' }));
    }
  };

// Delete Product Category
export const deleteExistingProductCategory = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`product-categories/${id}`);
    dispatch(deleteProductCategory({ id }));
    dispatch(setMessage({ message: 'Delete category successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default ProductCategorySlice.reducer;
