import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import axios from "../api/axios";

const ResetLinkSent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = new URLSearchParams(location.search).get("email");
    const [seconds, setSeconds] = useState(20);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const timer = seconds > 0 && setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);

    const handleResend = async () => {
        setIsResending(true);
        try {
            await axios.post(`/auth/forgot-password?forceResend=true`, { email });
            setSeconds(20);
        } catch (err) {
            alert("Failed to resend email. Try again later.");
        }
        setIsResending(false);
    };

    if (!email) {
        navigate("/forgot-password");
        return null;
    }

    return (
        <AuthLayout>
            <div className="absolute top-14 text-center">
                <h1 className="text-5xl font-extrabold p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-xl mb-10 animate-fade-in-down">
                    MasteryHub
                </h1>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-lg w-[90%] max-w-md mt-32 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Reset Link Sent
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    We've sent a link to <span className="font-medium text-indigo-600">{email}</span> to reset your password. Please check your inbox and follow the instructions.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Didn’t get the email? You can resend after {seconds} second{seconds !== 1 ? "s" : ""}.
                </p>

                <button
                    onClick={handleResend}
                    disabled={seconds > 0 || isResending}
                    className={`w-full mb-4 ${
                        seconds > 0 || isResending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white font-semibold py-2 px-4 rounded transition duration-300`}
                >
                    {isResending ? "Resending..." : "Resend Email"}
                </button>

                <div className="text-center text-sm text-gray-600">
                    <a href="/login" className="text-indigo-500 hover:underline">
                        Back to Login
                    </a>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetLinkSent;
