import { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import signupbg from "../assets/loginbg.jpg"; // Use same or a different background

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side image */}
            <div
                className="w-1/2 bg-cover bg-center hidden md:block"
                style={{ backgroundImage: `url(${signupbg})` }}
            ></div>

            {/* Right side form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 relative">
                {/* MasteryHub Branding */}
                <div className="absolute top-10 text-center">
                    <h1 className="text-5xl font-extrabold p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-xl mb-10 animate-fade-in-down">
                        MasteryHub
                    </h1>
                </div>

                <form
                    onSubmit={handleSignUp}
                    className="bg-white p-10 rounded-xl shadow-lg w-[90%] max-w-lg"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create Account</h2>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="input"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="input"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="input mt-4"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="input mt-4"
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="input"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded mt-6 transition duration-300"
                    >
                        Sign Up
                    </button>

                    {/* Or divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="mx-4 text-gray-500 text-sm">or</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-6 mb-4">
                        <a href="#" className="text-red-500 hover:scale-110 transition-transform">
                            <FaGoogle size={28} />
                        </a>
                        <a href="#" className="text-blue-600 hover:scale-110 transition-transform">
                            <FaFacebookF size={28} />
                        </a>
                        <a href="#" className="text-blue-400 hover:scale-110 transition-transform">
                            <FaTwitter size={28} />
                        </a>
                    </div>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-indigo-500 hover:underline">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
