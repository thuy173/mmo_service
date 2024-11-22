import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './ProtectedRoute';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));

const ProductCategoryPage = Loadable(
  lazy(() => import('../views/pages/product-category/view/ProductCategoryTable')),
);
const AddProductCategoryPage = Loadable(
  lazy(() => import('../views/pages/product-category/view/AddProductCategory')),
);
const UpdateProductCategoryPage = Loadable(
  lazy(() => import('../views/pages/product-category/view/UpdateProductCategory')),
);
const AddSubProductCategoryPage = Loadable(
  lazy(() => import('../views/pages/product-category/view/AddSubProductCategory')),
);
const UpdateSubProductCategoryPage = Loadable(
  lazy(() => import('../views/pages/product-category/view/UpdateSubProductCategory')),
);
const ProductPage = Loadable(lazy(() => import('../views/pages/product/view/ProductTable')));
const AddProductPage = Loadable(lazy(() => import('../views/pages/product/view/AddProduct')));
const UpdateProductPage = Loadable(lazy(() => import('../views/pages/product/view/UpdateProduct')));
const PostCategoryPage = Loadable(lazy(() => import('../views/pages/post-category/view/PostCategoryTable')));
const AddPostCategoryPage = Loadable(lazy(() => import('../views/pages/post-category/view/AddPostCategory')));
const UpdatePostCategoryPage = Loadable(lazy(() => import('../views/pages/post-category/view/UpdatePostCategory')));
const PostPage = Loadable(lazy(() => import('../views/pages/post/view/PostTable')));
const AddPostPage = Loadable(lazy(() => import('../views/pages/post/view/AddPost')));
const UpdatePostPage = Loadable(lazy(() => import('../views/pages/post/view/UpdatePost')));
const CouponPage = Loadable(lazy(() => import('../views/pages/coupon/view/CouponTable')));
const AddCouponPage = Loadable(lazy(() => import('../views/pages/coupon/view/AddCoupon')));
const UpdateCouponPage = Loadable(lazy(() => import('../views/pages/coupon/view/UpdateCoupon')));
const AccountAvailablePage = Loadable(lazy(() => import('../views/pages/account/view/AccountAvailableTable')));
const AccountSoldPage = Loadable(lazy(() => import('../views/pages/account/view/AccountSoldTable')));
const AccountInStockPage = Loadable(lazy(() => import('../views/pages/stock/view/StockTable')));
const OrderPage = Loadable(lazy(() => import('../views/pages/order/view/OrderTable')));
const TransactionPage = Loadable(lazy(() => import('../views/pages/transaction/view/TransactionTable')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <Navigate to="/dashboards" /> },
          { path: '/dashboards', element: <Dashboard /> },
          { path: '/product-category', element: <ProductCategoryPage /> },
          { path: '/product-category/add', element: <AddProductCategoryPage /> },
          { path: '/product-category/update/:id', element: <UpdateProductCategoryPage /> },
          { path: '/sub-product-category/add/:id', element: <AddSubProductCategoryPage /> },
          { path: '/sub-product-category/update/:id', element: <UpdateSubProductCategoryPage /> },
          { path: '/product', element: <ProductPage /> },
          { path: '/product/add', element: <AddProductPage /> },
          { path: '/product/update/:id', element: <UpdateProductPage /> },
          { path: '/post-category', element: <PostCategoryPage /> },
          { path: '/post-category/add', element: <AddPostCategoryPage /> },
          { path: '/post-category/update/:id', element: <UpdatePostCategoryPage /> },
          { path: '/post', element: <PostPage /> },
          { path: '/post/add', element: <AddPostPage /> },
          { path: '/post/update/:id', element: <UpdatePostPage /> },
          { path: '/coupon', element: <CouponPage /> },
          { path: '/coupon/add', element: <AddCouponPage /> },
          { path: '/coupon/update/:id', element: <UpdateCouponPage /> },
          { path: '/account-available', element: <AccountAvailablePage /> },
          { path: '/account-sold', element: <AccountSoldPage /> },
          { path: '/account-in-stock/:id', element: <AccountInStockPage /> },
          { path: '/order', element: <OrderPage /> },
          { path: '/transaction', element: <TransactionPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      {
        path: '/auth/login',
        element: <ProtectedRoute isLoginRoute={true} />,
        children: [{ path: '/auth/login', element: <Login /> }],
      },
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default routes;
