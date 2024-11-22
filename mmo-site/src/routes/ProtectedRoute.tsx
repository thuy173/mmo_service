import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to={'/login'} state={{ from: location }} replace />
    )
}

export default ProtectedRoute