import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Verify token on page load
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/verify-reset-token/${token}`
                );
                if (!response.data.success) {
                    setError("Invalid or expired reset token");
                }
            } catch (error) {
                console.log("error verifying token", error);
                setError("Invalid or expired reset token");
            }
        };
        verifyToken();
    }, [token]);

    const validatePassword = () => {
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password.match(passwordPattern)) {
            return "Password must be at least 8 characters long, contain 1 capital letter, 1 number, and 1 special character";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const passwordError = validatePassword();
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/reset-password`,
                {
                    token,
                    password,
                }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                    background: "#512C59",
                    color: "#ffffff",
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                        navigate("/login");
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                    background: "#512C59",
                    color: "#ffffff",
                });
                setError(response.data.message);
            }
        } catch (error) {
            console.log("error resetting password", error);
            setError("Error resetting password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#29142e] text-[#29142e] p-4">
            <div className="rounded-3xl p-8 w-96 shadow-xl bg-white">
                <h2 className="text-3xl font-bold mb-6 text-[#564181] text-center">
                    Reset Password
                </h2>

                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-[#29142e] font-medium mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-[#564181] px-4 py-2 rounded-full focus:ring-2 focus:ring-[#5D76EE] outline-none"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-[#29142e] font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border-2 border-[#564181] px-4 py-2 rounded-full focus:ring-2 focus:ring-[#5D76EE] outline-none"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full font-bold text-lg py-2 bg-[#564181] text-white rounded-full mt-4 transition-all duration-300 hover:bg-[#29142e] disabled:opacity-50">
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
