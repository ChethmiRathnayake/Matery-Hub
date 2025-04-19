// src/context/AuthContext.js
import { createContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Create the context
export const AuthContext = createContext();

console.log("we be here")
// Reducer to manage login/logout
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload, loading: false };
        case "LOGOUT":
            return { user: null, loading: false };
        default:
            return state;
    }
};

// Utility to check token expiration
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (err) {
        return true;
    }
};

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true,
    });

    // Auto-load user from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log(storedUser)
        const token = storedUser?.accessToken || null
console.log("looo")
        if (storedUser && !isTokenExpired(token)) {
            console.log("inhere")
            dispatch({ type: "LOGIN", payload: storedUser });

        } else {
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            //navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Optional: Automatically logout on token expiration
    useEffect(() => {
        console.log("inhhhhes")
        const token = state.user?.accessToken;
        if (!token) return;

        const decoded = jwtDecode(token);
        const timeLeft = decoded.exp * 1000 - Date.now();

        const timer = setTimeout(() => {
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            navigate("/login");
        }, timeLeft);

        return () => clearTimeout(timer);
    }, [state.user, navigate]);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {state.loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
