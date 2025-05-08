import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/forgot-password`,
                {
                    email: email,
                }
            );
            const data = await response.data;
            if (data.success) {
                setMessage("success! Password reset link sent to your email!");
            } else {
                setMessage(data.error || "Email not found!");
            }
        } catch (error) {
            setMessage("An error occured. Please try again later.");
            console.log("error resetting password: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#29142e] p-4">
            <div className="rounded-3xl p-8 w-100 bg-white">
                <h2 className="text-3xl font-bold mb-6 text-[#564181] text-center">
                    Forgot Password
                </h2>

                <form
                    className="flex flex-col items-center"
                    onSubmit={handleSubmit}>
                    <label className="self-start text-[#29142e] font-medium">
                        Email:
                    </label>
                    <input
                        type="email"
                        required
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg my-2 rounded-full text-[#29142e] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {message && (
                        <p
                            className={`mt-4 text-center ${
                                message.includes("success")
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full font-bold text-lg py-2 bg-[#564181] text-white rounded-full mt-4 transition-all duration-300 hover:bg-[#29142e] hover:text-white disabled:opacity-50">
                        {isLoading ? "Sending..." : "Reset Password"}
                    </button>

                    <Link
                        to="/login"
                        className="mt-4 text-[#5D76EE] hover:underline">
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
