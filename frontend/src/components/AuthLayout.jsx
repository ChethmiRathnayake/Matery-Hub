import React from "react";
import loginbg from "../assets/loginbg.jpg";

const AuthLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Left Side Image */}
            <div
                className="w-1/2 bg-cover bg-center hidden md:block"
                style={{ backgroundImage: `url(${loginbg})` }}
            ></div>

            {/* Right Side Content */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 relative">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
