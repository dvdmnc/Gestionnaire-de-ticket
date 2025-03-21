import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../CRUD/AuthController';

const AuthRoute: React.FC = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;
