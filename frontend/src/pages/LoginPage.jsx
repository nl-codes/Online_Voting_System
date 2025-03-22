import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Overview from "../components/Overview";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    // Load user from localStorage (if logged in before)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(email, password);
        const response = await fetch("http://localhost:5000/user_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data)); // Store user
            setUser(data); // Update state
            alert("Login successful!");
            navigate("/home");
        } else {
            alert("Invalid credentials!");
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        alert("Logged out successfully!");
    };

    return (
        <div>
            {user ? (
                <div className="bg-[#512C59]/90 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">
                        Welcome, {user.first_name}!
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-[#512C59] px-4 py-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            ) : (
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
