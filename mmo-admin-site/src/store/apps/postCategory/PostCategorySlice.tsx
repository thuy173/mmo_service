import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { PostCategoryDto } from 'src/types/apps/postCategory';
import axiosServices from 'src/utils/axios';

interface StateType {
  postCategory: PostCategoryDto[];
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  postCategory: [],
  totalElements: 0,
  error: '',
};

export const PostCategorySlice = createSlice({
  name: 'postCategories',
  initialState,
  reducers: {
    getPostCategory: (state, action) => {
      state.postCategory = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    addPostCategory: (state, action) => {
      state.postCategory.push(action.payload);
    },
    updatePostCategory: (state, action) => {
      const index = state.postCategory.findIndex((category) => category.id === action.payload.id);
      if (index !== -1) {
        state.postCategory[index] = action.payload;
      }
    },
    deletePostCategory: (state, action) => {
      state.postCategory = state.postCategory.filter(
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
  getPostCategory,
  addPostCategory,
  updatePostCategory,
  deletePostCategory,
} = PostCategorySlice.actions;

// Fetch

export const fetchPostCategory =
  (searchName = '', pageNumber = 0, pageSize = 10, sortField = 'id', sortDirection = 'ASC') =>
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

      const response = await axiosServices.get(`post-category`, { params });
      dispatch(getPostCategory(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Add
export const addNewPostCategory = (category: PostCategoryDto) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('post-category', category);
    dispatch(addPostCategory(response.data));
    dispatch(setMessage({ message: 'Add new category successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
  }
};

// Update
export const updateExistingPostCategory = (formData: FormData) => async (dispatch: AppDispatch) => {
  try {
    const id = formData.get('id');
    const response = await axiosServices.put(`post-category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(updatePostCategory(response.data));
    dispatch(setMessage({ message: 'Update category successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Update failed. Please try again.', severity: 'error' }));
  }
};

// Delete
export const deleteExistingPostCategory = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`post-category/${id}`);
    dispatch(deletePostCategory({ id }));
    dispatch(setMessage({ message: 'Delete category successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default PostCategorySlice.reducer;
