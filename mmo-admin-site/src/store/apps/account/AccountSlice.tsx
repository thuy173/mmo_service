import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { AccountResponseDto } from 'src/types/apps/account';
import axiosServices from 'src/utils/axios';

interface StateType {
  accounts: AccountResponseDto[];
  accountDetail: AccountResponseDto | null;
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  accounts: [],
  accountDetail: null,
  totalElements: 0,
  error: '',
};

export const AccountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    getAccount: (state, action) => {
      state.accounts = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    getDetailAccount: (state, action) => {
      state.accountDetail = action.payload;
    },
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action) => {
      const index = state.accounts.findIndex((accounts) => accounts.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter((accounts) => accounts.id !== action.payload.id);
    },
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getAccount, getDetailAccount, addAccount, updateAccount, deleteAccount } =
  AccountSlice.actions;

// Fetch Account
export const fetchAccountAvailable =
  (username = '', pageNumber = 0, pageSize = 10, sortField = 'id', sortDirection = 'ASC') =>
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

      const response = await axiosServices.get(`accounts/available`, { params });
      dispatch(getAccount(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
export const fetchAccountSold =
  (username = '', pageNumber = 0, pageSize = 10, sortField = 'id', sortDirection = 'ASC') =>
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

      const response = await axiosServices.get(`accounts/sold`, { params });
      dispatch(getAccount(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Delete Account
export const deleteExistingAccount = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`accounts/${id}`);
    dispatch(deleteAccount({ id }));
    dispatch(setMessage({ message: 'Delete account successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default AccountSlice.reducer;
