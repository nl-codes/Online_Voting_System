import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#29142e] p-4">
            <div className="rounded-3xl p-8 w-100 bg-white">
                <h2 className="text-3xl font-bold mb-6 text-[#564181] text-center">
                    Forgot Password
                </h2>

                <Link
                    to="/login"
                    className="mt-4 text-[#5D76EE] hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
