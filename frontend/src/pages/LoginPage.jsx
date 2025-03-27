import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Overview from "../components/Overview";

const LoginPage = ({ userId, setUserId }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
            navigate("/home");
        }
    }, [setUserId, navigate]);

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/user_login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem("userId", data.id);
                setUserId(data.id);
                navigate("/home");
            } else {
                alert(data.error || "Invalid credentials!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    };

    // If user is already logged in, don't render the login page
    if (userId) {
        return null;
    }

    return (
        <div>
            {userId && (
                <div className="min-h-screen flex flex-row gap-20 items-center justify-center bg-[#c791d4] text-[#512C59] font-poppins p-4">
                    <Overview />
                    <div className="border-4 border-[#512C59] rounded-3xl p-8 w-96 shadow-xl bg-white flex flex-col items-center">
                        <h2 className="text-3xl font-bold mb-6 text-[#564181]">
                            Login
                        </h2>

                        <form className="flex flex-col items-center w-full">
                            <label className="self-start text-[#512C59] font-medium">
                                Email:
                            </label>
                            <input
                                maxLength="30"
                                minLength="5"
                                required
                                className="w-full border-2 border-[#564181] px-4 py-2 text-lg my-2 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                                type="text"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label className="self-start text-[#512C59] font-medium">
                                Password:
                            </label>
                            <input
                                maxLength="30"
                                minLength="5"
                                required
                                className="w-full border-2 border-[#564181] px-4 py-2 text-lg my-2 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                                type="password"
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                onClick={handleLogin}
                                className="w-full font-bold text-lg py-2 bg-[#564181] text-white rounded-full mt-4 transition-all duration-300 hover:bg-[#512C59] hover:text-white">
                                Login
                            </button>
                        </form>

                        <p className="mt-4 text-[#512C59]">
                            Haven't registered yet?
                            <Link
                                to="/signup"
                                className="text-[#5D76EE] font-semibold hover:underline ml-1">
                                Sign Up now
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
