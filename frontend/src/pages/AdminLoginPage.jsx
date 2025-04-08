import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import Swal from "sweetalert2";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/admin_login`, {
                email,
                password,
            });

            if (response.data.success) {
                navigate("/sec/admin/dashboard");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Credentials",
                    text: response.data.message,
                    background: "#29142e",
                    color: "white",
                });
            }
        } catch (error) {
            console.error("Login error: ", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "An error occurred during login",
                background: "#29142e",
                color: "white",
            });
        }
    };
    return (
        <div className="min-h-screen flex flex-row gap-20 items-center justify-center bg-[#29142e] text-[#29142e] font-poppins p-4">
            <div className="border-4 border-[#29142e] rounded-3xl p-8 w-96 shadow-xl bg-white flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6 text-[#564181]">
                    Admin Login Portal
                </h2>

                <form className="flex flex-col items-center w-full">
                    <label className="self-start text-[#29142e] font-medium">
                        Email:
                    </label>
                    <input
                        maxLength="30"
                        minLength="5"
                        required
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg my-2 rounded-full text-[#29142e] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                        type="text"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="self-start text-[#29142e] font-medium">
                        Password:
                    </label>
                    <input
                        maxLength="30"
                        minLength="5"
                        required
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg my-2 rounded-full text-[#29142e] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full font-bold text-lg py-2 bg-[#564181] text-white rounded-full mt-4 transition-all duration-300 hover:bg-[#29142e] hover:text-white">
                        Login
                    </button>
                </form>

                <p className="mt-4 text-[#29142e]">
                    Go to User Login :
                    <Link
                        to="/login"
                        className="text-[#5D76EE] font-semibold hover:underline ml-1">
                        USER LOGIN PAGE
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
