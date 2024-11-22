import { configureStore } from '@reduxjs/toolkit';
import LoginReducer from './apps/auth/LoginSlice';
import ProductCategoryReducer from './apps/productCategory/ProductCategorySlice';
import SubProductCategoryReducer from './apps/subProductCategory/SubProductCategorySlice';
import ProductReducer from './apps/product/ProductSlice';
import PostCategoryReducer from './apps/postCategory/PostCategorySlice';
import PostReducer from './apps/post/PostSlice';
import CouponReducer from './apps/coupon/CouponSlice';
import AccountReducer from './apps/account/AccountSlice';
import StockReducer from './apps/stock/StockSlice';
import OrderReducer from './apps/order/OrderSlice';
import TransactionReducer from './apps/transaction/TransactionSlice';
import DashBoardReducer from './apps/dashboard/DashboardSlice';
import MessageReducer from './customizer/MessageSlice';
import CustomizerReducer from './customizer/CustomizerSlice';
import { combineReducers } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';

const rootReducer = combineReducers({
  loginReducer: LoginReducer,
  productCategories: ProductCategoryReducer,
  subProductCategories: SubProductCategoryReducer,
  products: ProductReducer,
  postCategories: PostCategoryReducer,
  posts: PostReducer,
  coupons: CouponReducer,
  accounts: AccountReducer,
  stocks: StockReducer,
  orders: OrderReducer,
  transactions: TransactionReducer,
  dashboards: DashBoardReducer,
  messages: MessageReducer,

  customizer: CustomizerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<AppState, void, AnyAction>;

export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;
