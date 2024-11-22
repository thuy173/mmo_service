import { createSlice } from '@reduxjs/toolkit';
import { setMessage } from 'src/store/customizer/MessageSlice';
import { AppDispatch } from 'src/store/Store';
import { CouponDto, CouponRequest } from 'src/types/apps/coupon';
import axiosServices from 'src/utils/axios';

interface StateType {
  coupons: CouponDto[];
  couponDetail: CouponDto | null;
  totalElements: number;
  error: string;
}

const initialState: StateType = {
  coupons: [],
  couponDetail: null,
  totalElements: 0,
  error: '',
};

export const CouponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    getCoupon: (state, action) => {
      state.coupons = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    getDetailCoupon: (state, action) => {
      state.couponDetail = action.payload;
    },
    addCoupon: (state, action) => {
      state.coupons.push(action.payload);
    },
    updateCoupon: (state, action) => {
      const index = state.coupons.findIndex((coupon) => coupon.id === action.payload.id);
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    },
    deleteCoupon: (state, action) => {
      state.coupons = state.coupons.filter((coupon) => coupon.id !== action.payload.id);
    },
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getCoupon, getDetailCoupon, addCoupon, updateCoupon, deleteCoupon } =
  CouponSlice.actions;

// Fetch

export const fetchCoupon =
  (pageNumber = 0, pageSize = 10, sortField = 'id', sortDirection = 'ASC') =>
  async (dispatch: AppDispatch) => {
    try {
      const params: any = {
        pageNumber,
        pageSize,
        sortField,
        sortDirection,
      };

      const response = await axiosServices.get(`coupons`, { params });
      dispatch(getCoupon(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

// Fetch by ID
export const fetchCouponById = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`coupons/${id}`);
    dispatch(getDetailCoupon(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

// Add
export const addNewCoupon = (category: CouponDto) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.post('coupons', category);
    dispatch(addCoupon(response.data));
    dispatch(setMessage({ message: 'Add new coupon successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Add new failed. Please try again.', severity: 'error' }));
  }
};

// Update
export const updateExistingCoupon =
  (couponData: CouponRequest) => async (dispatch: AppDispatch) => {
    try {
      const { id } = couponData;
      const response = await axiosServices.put(`coupons/${id}`, couponData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch(updateCoupon(response.data));
      dispatch(setMessage({ message: 'Update coupon successful!', severity: 'success' }));
    } catch (error) {
      dispatch(hasError(error));
      dispatch(setMessage({ message: 'Update failed. Please try again.', severity: 'error' }));
    }
  };

// Delete
export const deleteExistingCoupon = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axiosServices.delete(`coupons/${id}`);
    dispatch(deleteCoupon({ id }));
    dispatch(setMessage({ message: 'Delete coupon successful!', severity: 'success' }));
  } catch (error) {
    dispatch(hasError(error));
    dispatch(setMessage({ message: 'Delete failed. Please try again.', severity: 'error' }));
  }
};

export default CouponSlice.reducer;
