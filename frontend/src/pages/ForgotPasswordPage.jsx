import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#29142e] p-4">
            <div className="rounded-3xl p-8 w-100 bg-white">
                <h2 className="text-3xl font-bold mb-6 text-[#564181] text-center">
                    Forgot Password
                </h2>

                <form className="flex flex-col items-center">
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
