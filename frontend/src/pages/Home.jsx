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
                <h1>Mastery Hub develop your skills</h1>

            </div>
        </div>
    );
};

export default Home;
