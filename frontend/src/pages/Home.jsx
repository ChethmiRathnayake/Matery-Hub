import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostList from "./PostList";


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
                <PostList/>

            </div>
        </div>
    );
};

export default Home;
