import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { ProductCategoryDto, SubProductCategoryDto } from 'src/types/apps/productCategory';
import axiosServices from 'src/utils/axios';

interface StateType {
  subProductCategory: SubProductCategoryDto[];
  fullProductCategory: ProductCategoryDto[];
  error: string;
}

const initialState: StateType = {
  subProductCategory: [],
  fullProductCategory: [],
  error: '',
};

export const SubProductCategorySlice = createSlice({
  name: 'subProductCategories',
  initialState,
  reducers: {
    getSubProductCategory: (state, action) => {
      state.subProductCategory = action.payload;
    },
    getFullProductCategory: (state, action) => {
      state.fullProductCategory = action.payload;
    },
    addProductCategory: (state, action) => {
      state.subProductCategory.push(action.payload);
    },
    updateProductCategory: (state, action) => {
      const index = state.subProductCategory.findIndex(
        (category) => category.id === action.payload.id,
      );
      if (index !== -1) {
        state.subProductCategory[index] = action.payload;
      }
    },
    deleteProductCategory: (state, action) => {
      state.subProductCategory = state.subProductCategory.filter(
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
  getSubProductCategory,
  getFullProductCategory,
  addProductCategory,
  updateProductCategory,
  deleteProductCategory,
} = SubProductCategorySlice.actions;

// Fetch Full Category
export const fetchFullProductCategory = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`product-categories/get-all`);
    dispatch(getFullProductCategory(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

// Fetch Sub Category
export const fetchSubProductCategory =
  (productCategoryId: number) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosServices.get(`product-categories/${productCategoryId}`);
      dispatch(getSubProductCategory(response.data.subProductCategories));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Add Category
export const addNewSubProductCategory =
  (category: SubProductCategoryDto) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosServices.post('sub-product-categories', category);
      dispatch(addProductCategory(response.data));
      dispatch(setMessage({ message: 'Add new sub category successful!', severity: 'success' }));
    } catch (error) {
      dispatch(hasError(error));
      dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
    }
  };

// Update Category
export const updateSubProductCategory =
  (formData: FormData) => async (dispatch: AppDispatch) => {
    try {
      const id = formData.get('id');
      const response = await axiosServices.put(`sub-product-categories/${id}`, formData, {
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

// Delete Category
export const deleteSubProductCategory = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`sub-product-categories/${id}`);
    dispatch(deleteProductCategory({ id }));
    dispatch(setMessage({ message: 'Delete category successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default SubProductCategorySlice.reducer;
