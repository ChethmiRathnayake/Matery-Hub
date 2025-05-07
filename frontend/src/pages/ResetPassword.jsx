import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log("Password reset to:", newPassword);
    };

    return (
        <AuthLayout>
            <AuthHeader title="Reset Password" />
            <form
                onSubmit={handleReset}
                className="bg-white p-10 rounded-xl shadow-lg w-[90%] max-w-md mt-32"
            >
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Enter your new password below.
                </p>

                <AuthInput
                    label="New Password"
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <AuthInput
                    label="Confirm Password"
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                    Reset Password
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <a href="/signin" className="text-indigo-500 hover:underline">
                        Back to Login
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
