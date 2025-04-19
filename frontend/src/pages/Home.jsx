import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/user"); // Redirect to dashboard if logged in
        }
    }, [user, navigate]);

    return (
        <div>
             {/* Common navbar */}
            <div className="home-container">
                <h1>Welcome to Our Platform</h1>
                {!user ? (
                    <>
                        <button onClick={() => navigate("/login")}>Sign In</button>
                        <button onClick={() => navigate("/signup")}>Sign Up</button>
                    </>
                ) : (
                    <div>
                        <h2>Welcome back, {user.username}!</h2>
                        <button onClick={() => navigate("/user")}>Go to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
