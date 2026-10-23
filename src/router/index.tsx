import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import RouteError from '../components/RouteError';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductCreatePage from '../pages/ProductCreatePage';
import ProductEditPage from '../pages/ProductEditPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // cấp 1: layout
    children: [
      {
        errorElement: <RouteError />, // lỗi ở route con vẫn giữ lại thanh menu
        children: [
          { index: true, element: <Navigate to="/products" replace /> },
          {
            path: 'products', // cấp 2: nhóm /products
            children: [
              { index: true, element: <ProductListPage /> },        // /products
              { path: 'new', element: <ProductCreatePage /> },       // /products/new
              { path: ':id', element: <ProductDetailPage /> },       // /products/5   (tham số động)
              { path: ':id/edit', element: <ProductEditPage /> },    // /products/5/edit
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);