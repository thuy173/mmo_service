import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { PostDto } from 'src/types/apps/post';
import axiosServices from 'src/utils/axios';

interface StateType {
  posts: PostDto[];
  postDetail: PostDto | null;
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  posts: [],
  postDetail: null,
  totalElements: 0,
  error: '',
};

export const PostSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getPost: (state, action) => {
      state.posts = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    getDetailPost: (state, action) => {
      state.postDetail = action.payload;
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getPost, getDetailPost, addPost, updatePost, deletePost } =
  PostSlice.actions;

// Fetch

export const fetchPost =
  (title = '', pageNumber = 0, pageSize = 10, sortField = 'id', sortDirection = 'ASC') =>
  async (dispatch: AppDispatch) => {
    try {
      const params: any = {
        pageNumber,
        pageSize,
        sortField,
        sortDirection,
      };

      if (title) {
        params.title = title;
      }

      const response = await axiosServices.get(`posts`, { params });
      dispatch(getPost(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Fetch by ID
export const fetchPostById = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`posts/${id}`);
    dispatch(getDetailPost(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

// Add
export const addNewPost = (category: PostDto) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('posts', category);
    dispatch(addPost(response.data));
    dispatch(setMessage({ message: 'Add new post successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
  }
};

// Update
export const updateExistingPost = (formData: FormData) => async (dispatch: AppDispatch) => {
  try {
    const id = formData.get('id');
    const response = await axiosServices.put(`posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(updatePost(response.data));
    dispatch(setMessage({ message: 'Update post successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Update failed. Please try again.', severity: 'error' }));
  }
};

// Delete
export const deleteExistingPost = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`posts/${id}`);
    dispatch(deletePost({ id }));
    dispatch(setMessage({ message: 'Delete post successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default PostSlice.reducer;
