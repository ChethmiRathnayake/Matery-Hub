// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:1010/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                console.log(userData);
            } else {
                console.error("Failed to fetch user");
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    useEffect(() => {
        fetchUser(); // call once when app starts
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
