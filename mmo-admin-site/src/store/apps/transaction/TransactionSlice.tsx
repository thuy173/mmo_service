import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import { TransactionDto } from 'src/types/apps/transaction';
import axiosServices from 'src/utils/axios';

interface StateType {
  transactions: TransactionDto[];
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  transactions: [],
  totalElements: 0,
  error: '',
};

export const TransactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    getTransaction: (state, action) => {
      state.transactions = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },

    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getTransaction } = TransactionSlice.actions;

// Fetch

export const fetchTransaction =
  (pageNumber = 0, pageSize = 10, sortField = 'id', sortDirection = 'ASC') =>
  async (dispatch: AppDispatch) => {
    try {
      const params: any = {
        pageNumber,
        pageSize,
        sortField,
        sortDirection,
      };

      const response = await axiosServices.get(`transactions`, { params });
      dispatch(getTransaction(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

export default TransactionSlice.reducer;
