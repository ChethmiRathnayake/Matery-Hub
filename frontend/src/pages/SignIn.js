import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

import loginbg from "../assets/loginbg.jpg"; // ensure this is the correct path

const SignIn = () => {
    const navigate = useNavigate();
    const { login, error, isLoading } = useLogin();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user } = useAuthContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(username, password);
        if (!error) {
            setUsername("");
            setPassword("");
        }
    };

    useEffect(() => {
        if (user) {
            const roles = user.roles;
            if (roles.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else if (roles.includes("ROLE_USER")) {
                navigate("/user");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate]);

    return (
        <div className="flex min-h-screen">
            {/* Left Side Image */}
            <div
                className="w-1/2 bg-cover bg-center hidden md:block"
                style={{ backgroundImage: `url(${loginbg})` }}
            ></div>

            {/* Right Side Login */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-8 relative">
                {/* MasteryHub Title */}
                <h1 className="text-5xl font-extrabold p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-xl mb-10 animate-fade-in-down">
                    MasteryHub
                </h1>

                <form
                    onSubmit={handleLogin}
                    className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                        Login
                    </h2>

                    <label htmlFor="username" className="block mb-2 text-sm text-gray-600">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password" className="block mb-2 text-sm text-gray-600">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    {error && (
                        <div className="text-red-500 mt-4 text-sm text-center">{error}</div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-indigo-300"></div>
                        <span className="mx-3 text-indigo-500 font-medium">OR</span>
                        <div className="flex-grow h-px bg-indigo-300"></div>
                    </div>

                    {/* Social Login Icons */}
                    <div className="flex justify-center gap-6 mb-4">
                        <a href="#" className="text-red-500 hover:scale-110 transition-transform">
                            <FaGoogle size={30}/>
                        </a>
                        <a href="#" className="text-blue-600 hover:scale-110 transition-transform">
                            <FaFacebookF size={30}/>
                        </a>
                        <a href="#" className="text-blue-400 hover:scale-110 transition-transform">
                            <FaTwitter size={30}/>
                        </a>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        <a href="/forgot-password" className="text-indigo-500 hover:underline">
                            Forgot Password?
                        </a>
                        <br/>
                        <span>
              Don’t have an account?{" "}
                            <a href="/signup" className="text-indigo-500 hover:underline">
                Sign Up
              </a>
            </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
