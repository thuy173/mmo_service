import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import { DashBoardDto } from 'src/types/apps/dashboard';
import axiosServices from 'src/utils/axios';

interface StateType {
  dashboards: DashBoardDto[];
  depositData: Record<string, number>;
  revenueData: Record<string, number>;
  profitData: Record<string, number>;
  error: string;
}

const initialState: StateType = {
  dashboards: [],
  depositData: {},
  revenueData: {},
  profitData: {},
  error: '',
};

export const DashboardSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    getDashboard: (state, action) => {
      state.dashboards = action.payload;
    },

    getDeposit: (state, action) => {
      state.depositData = action.payload;
    },
    getRevenue: (state, action) => {
      state.revenueData = action.payload;
    },
    getProfit: (state, action) => {
      state.profitData = action.payload;
    },

    hasError(state: StateType, action) {
      state.error = action.payload;
    },
  },
});
export const { hasError, getDashboard, getDeposit, getProfit, getRevenue } = DashboardSlice.actions;

// Fetch

export const fetchDashboard = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`dashboard`);
    dispatch(getDashboard(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchDeposit = (month: number, year: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`dashboard/deposit-chart?month=${month}&year=${year}`);
    dispatch(getDeposit(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};
export const fetchRevenue = (month: number, year: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`dashboard/revenue-chart?month=${month}&year=${year}`);
    dispatch(getRevenue(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};
export const fetchProfit = (month: number, year: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosServices.get(`dashboard/profit-chart?month=${month}&year=${year}`);
    dispatch(getProfit(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export default DashboardSlice.reducer;
