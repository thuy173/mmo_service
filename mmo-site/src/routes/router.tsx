import GeneralError from '@/pages/errors/GeneralError'
import MaintenanceError from '@/pages/errors/MaintenanceError'
import NotFoundError from '@/pages/errors/NotFoundError'
import UnauthorizedError from '@/pages/errors/UnauthorizedError'
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter([
    // Auth routes
    {
        path: '/login',
        lazy: async () => ({
            Component: (await import('@/pages/login/Login')).default,
        }),
    },
    {
        path: '/sign-up',
        lazy: async () => ({
            Component: (await import('@/pages/sign-up/SignUp')).default,
        }),
    },

    // Main routes
    {
        path: '/',
        lazy: async () => {
            const AppShell = await import('@/layouts/AppShell')
            return { Component: AppShell.default }
        },
        // errorElement: <GeneralError />,
        children: [
            {
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/home/Home')).default,
                }),
            },
            {
                path: '/profile',
                element: <ProtectedRoute />,
                lazy: async () => ({
                    Component: (await import('@/pages/profile/Profile')).default,
                }),
                children: [
                    {
                        index: true,
                        lazy: async () => ({
                            Component: (await import('@/sections/profile/personal-info')).default,
                        }),
                    },
                    {
                        path: 'transactions',
                        lazy: async () => ({
                            Component: (await import('@/sections/profile/transactions')).default,
                        }),
                    },
                    {
                        path: 'change-password',
                        lazy: async () => ({
                            Component: (await import('@/sections/profile/change-password')).default,
                        }),
                    },
                ]
            },
            {
                path: '/product',
                children: [
                    {
                        index: true,
                        lazy: async () => ({
                            Component: (await import('@/pages/product/Product')).default,
                        }),
                    },
                    {
                        path: 'category/:categoryId',
                        lazy: async () => ({
                            Component: (await import('@/pages/product/Product')).default,
                        }),
                    },
                    {
                        path: ':id',
                        lazy: async () => ({
                            Component: (await import('@/pages/product-detail/ProductDetail')).default,
                        }),
                    },
                ],
            },
            {
                path: '/order-history',
                lazy: async () => ({
                    Component: (await import('@/pages/order-history/OrderHistory')).default,
                })
            },
            {
                path: '/order/:id',
                lazy: async () => ({
                    Component: (await import('@/pages/order-detail/OrderDetail')).default,
                })
            },
            {
                path: '/blogs',
                children: [
                    {
                        index: true,
                        lazy: async () => ({
                            Component: (await import('@/pages/blog/Blog')).default,
                        }),
                    },
                    {
                        path: 'post/:id',
                        lazy: async () => ({
                            Component: (await import('@/pages/post-detail/PostDetail')).default,
                        }),
                    },
                ],
            },
        ],
    },

    // Error routes
    { path: '/500', Component: GeneralError },
    { path: '/503', Component: MaintenanceError },
    { path: '/401', Component: UnauthorizedError },

    // Fallback 404 route
    { path: '*', Component: NotFoundError },
])

export default router
