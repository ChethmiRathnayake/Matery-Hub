import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const ProtectedRoute = ({ element: Component, roles }) => {
    const { user } = useContext(AuthContext);

    console.log(Component,roles)
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    console.log(roles)
    console.log(user.roles)
    console.log(user.roles.some(role => roles.includes(role)))

    if (roles && !user.roles.some(role => roles.includes(role))) {
        console.log("in this part")
        return <Navigate to="/unauthorized" replace />;
    }

    return Component;
};

export default ProtectedRoute;


