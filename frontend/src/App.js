import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
        </Router>
    );
}

export default App;
