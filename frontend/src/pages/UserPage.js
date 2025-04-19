import React, { useContext } from "react";
//import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const UserPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            {/* Common navbar */}
            <div className="user-dashboard">
                <h1>Welcome to your Dashboard, {user.username}!</h1>
                <p>Your roles: {user.roles.join(", ")}</p>
                {/* More content here */}
            </div>
        </div>
    );
};

export default UserPage;
