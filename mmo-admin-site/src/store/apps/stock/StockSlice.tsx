import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { AccountResponseDto } from 'src/types/apps/account';
import axiosServices from 'src/utils/axios';

interface StateType {
  stocks: AccountResponseDto[];
  stockReq: string[];
  accountDetail: AccountResponseDto | null;
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  stocks: [],
  stockReq: [],
  accountDetail: null,
  totalElements: 0,
  error: '',
};

export const StockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    getAccount: (state, action) => {
      state.stocks = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    addAccount: (state, action) => {
      state.stockReq.push(action.payload);
    },
    updateAccount: (state, action) => {
      const index = state.stocks.findIndex((stocks) => stocks.id === action.payload.id);
      if (index !== -1) {
        state.stocks[index] = action.payload;
      }
    },
    deleteAccount: (state, action) => {
      state.stocks = state.stocks.filter((stocks) => stocks.id !== action.payload.id);
    },
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getAccount, addAccount, updateAccount, deleteAccount } =
  StockSlice.actions;

// Fetch Account

export const fetchAccountInStock =
  (
    id: number,
    username = '',
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

      if (username) {
        params.username = username;
      }

      const response = await axiosServices.get(`accounts/available-by-product/${id}`, { params });
      dispatch(getAccount(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Add Account
export const addAccountText = (formData: FormData) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('accounts/text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(addAccount(response.data));
    dispatch(setMessage({ message: 'Add new account successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
  }
};
export const addAccountFile = (formData: FormData) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('accounts/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(addAccount(response.data));
    dispatch(setMessage({ message: 'Add new account successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
  }
};

// Update Account
export const updateExistingAccount = (formData: FormData) => async (dispatch: AppDispatch) => {
  try {
    const id = formData.get('id');
    const response = await axiosServices.put(`accounts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(updateAccount(response.data));
    dispatch(setMessage({ message: 'Update account successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Update failed. Please try again.', severity: 'error' }));
  }
};

// Delete
export const deleteAccountByProductId = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`accounts/available-by-product/${id}`);
    dispatch(deleteAccount({ id }));
    dispatch(setMessage({ message: 'Delete successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default StockSlice.reducer;
