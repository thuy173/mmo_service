import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import { OrderDto } from 'src/types/apps/order';
import axiosServices from 'src/utils/axios';

interface StateType {
  orders: OrderDto[];
  account: string;
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  orders: [],
  account: '',
  totalElements: 0,
  error: '',
};

export const OrderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    getOrder: (state, action) => {
      state.orders = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    getAccount: (state, action) => {
      state.account = action.payload;
    },

    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getOrder, getAccount } = OrderSlice.actions;

// Fetch

export const fetchOrder =
  (
    orderCode = '',
    createdAt = '',
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

      if (orderCode) {
        params.orderCode = orderCode;
      }
      if (createdAt) {
        params.createdAt = createdAt;
      }
      if (username) {
        params.username = username;
      }

      const response = await axiosServices.get(`orders`, { params });
      dispatch(getOrder(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Fetch by ID
export const fetchAccountByOrderId = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`accounts/sold-by-order/${id}`);
    dispatch(getAccount(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export default OrderSlice.reducer;
