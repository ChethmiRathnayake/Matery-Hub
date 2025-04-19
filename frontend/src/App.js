import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login'
import UserPage from "./pages/UserPage";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";

import Unauthorized from "./pages/Unauthorized"

function App() {
    return (

            <Routes>
                {/* Public Route: Default home page */}
                <Route path="/" element={<Home />} />

                {/* Public Route: Login page */}
                <Route path="/login" element={<SignIn />} />

                {/* Public Route: Sign-Up page */}
                <Route path="/signup" element={<Signup />} />

                <Route path="/unauthorized" element={<Unauthorized/>} />
                {/* Protected Route: User Dashboard (only for logged-in users) */}
                <Route
                    path="/user"
                    element={<ProtectedRoute element={<UserPage />} roles={['ROLE_USER']} />}
                />

                {/* Optionally add more protected routes for other roles (e.g., admin) */}
                {/* <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} roles={['ROLE_ADMIN']} />} /> */}
            </Routes>

    );

}

export default App;
