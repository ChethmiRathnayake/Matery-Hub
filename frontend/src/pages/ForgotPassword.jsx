import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleReset = (e) => {
        e.preventDefault();
        console.log("Reset email sent to:", email);
    };

    return (
        <AuthLayout>

            <div className="absolute top-14 text-center">
                <h1 className="text-5xl font-extrabold p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-xl mb-10 animate-fade-in-down">
                    MasteryHub
                </h1>
            </div>
            <form

                onSubmit={handleReset}
                className="bg-white p-10 rounded-xl shadow-lg w-[90%] max-w-md mt-32"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Forgot Password
                </h2>

                <p className="text-sm text-gray-600 mb-6 text-center">
                    Enter your registered email address to receive a reset link.
                </p>

                <AuthInput
                    label="Email Address"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                    Send Reset Link
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <a href="/login" className="text-indigo-500 hover:underline">
                        Back to Login
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
