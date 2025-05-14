import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Overview from "../components/Overview";
import { API_BASE_URL } from "../config/api";
import Swal from "sweetalert2";

const SignupPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        dob: "",
    });

    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        dob: "",
    });

    const [message, setMessage] = useState(""); // Store success/error messages

    // Handle input changes
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Validation functions
    const validateFirstName = () => {
        if (user.first_name.length < 3)
            return "First name must be longer than 2 characters";
        return "";
    };

    const validateLastName = () => {
        if (user.last_name.length < 2)
            return "Last name must be longer than 2 characters";
        return "";
    };

    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9]{3,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,}$/;
        if (!user.email.match(emailPattern))
            return "Email must follow the format: example@domain.com";
        return "";
    };

    const validatePassword = () => {
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!user.password.match(passwordPattern)) {
            return "Password must be at least 8 characters long, contain 1 capital letter, 1 number, and 1 special character";
        }
        return "";
    };

    const validateConfirmPassword = () => {
        if (user.password !== user.confirm_password)
            return "Passwords must match";
        return "";
    };

    const validateDob = () => {
        const today = new Date();
        const dob = new Date(user.dob);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 5) return "You must be at least 5 years old";
        return "";
    };

    // Handle validation on blur (when user leaves input field)
    const handleBlur = (e) => {
        const { name } = e.target;
        setErrors({
            ...errors,
            [name]: validateForm(name),
        });
    };

    // Form validation handler
    const validateForm = (fieldName) => {
        switch (fieldName) {
            case "first_name":
                return validateFirstName();
            case "last_name":
                return validateLastName();
            case "email":
                return validateEmail();
            case "password":
                return validatePassword();
            case "dob":
                return validateDob();
            default:
                return "";
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform final validation
        const newErrors = {
            first_name: validateFirstName(),
            last_name: validateLastName(),
            email: validateEmail(),
            password: validatePassword(),
            confirm_password: validateConfirmPassword(),
            dob: validateDob(),
        };

        setErrors(newErrors);

        // If no errors, proceed with form submission
        if (Object.values(newErrors).every((error) => error === "")) {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/user_exists/${user.email}`
                );
                console.log(response.data.exists);
                if (response.data.exists) {
                    setMessage("User with this email already exists");
                    return;
                }
            } catch (error) {
                console.log("Error: ", error);
                setMessage(
                    "Error: " + (error.response?.data?.message || error.message)
                );
            }

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/user_register`,
                    user
                );
                // Bug fix -167
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Signup successfull",
                        text: "You have been successfully registered",
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            navigate("/login");
                        }
                    });
                    setUser({
                        first_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        dob: "",
                    });
                } else if (response.data.message) {
                    setMessage(response.data.message); // Show error message
                }
            } catch (error) {
                setMessage(
                    "Error: " + (error.response?.data?.message || error.message)
                );
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-row items-center gap-20 justify-center bg-[#c791d4] text-[#512C59] font-poppins p-4">
            <Overview />
            <div className="border-4 border-[#512C59] rounded-3xl p-8 w-96 shadow-xl bg-white flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6 text-[#564181]">
                    Sign Up
                </h2>

                {message && (
                    <p className="text-lg text-center font-semibold text-red-500 mb-4">
                        {message}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center w-full">
                    {/* First Name */}
                    <label className="self-start text-[#512C59] font-medium mb-1">
                        First Name:
                    </label>
                    {errors.first_name && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.first_name}
                        </p>
                    )}
                    <input
                        type="text"
                        name="first_name"
                        value={user.first_name}
                        placeholder="Enter your first name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg mb-3 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                    />

                    {/* Last Name */}
                    <label className="self-start text-[#512C59] font-medium mb-1">
                        Last Name:
                    </label>
                    {errors.last_name && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.last_name}
                        </p>
                    )}
                    <input
                        type="text"
                        name="last_name"
                        value={user.last_name}
                        placeholder="Enter your last name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg mb-3 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                    />

                    {/* Email */}
                    <label className="self-start text-[#512C59] font-medium mb-1">
                        Email:
                    </label>
                    {errors.email && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.email}
                        </p>
                    )}
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg mb-3 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                    />

                    {/* Password */}
                    <label className="self-start text-[#512C59] font-medium mb-1">
                        Password:
                    </label>
                    {errors.password && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.password}
                        </p>
                    )}
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        placeholder="Enter your password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg mb-3 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                    />
                    {/* Confirm Password */}
                    <label className="self-start text-[#512C59] font-medium mb-1">
                        Confirm Password:
                    </label>
                    {errors.confirm_password && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.confirm_password}
                        </p>
                    )}
                    <input
                        type="password"
                        name="confirm_password"
                        value={user.confirm_password}
                        placeholder="Re-enter your password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg mb-3 rounded-full text-[#512C59] placeholder-gray-400 focus:ring-2 focus:ring-[#5D76EE] outline-none"
                    />

                    {/* Date of Birth */}
                    <label className="self-start text-[#512C59] font-medium mb-1">
                        Date of Birth:
                    </label>
                    {errors.dob && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.dob}
                        </p>
                    )}
                    <input
                        type="date"
                        name="dob"
                        value={user.dob}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-[#564181] px-4 py-2 text-lg mb-3 rounded-full text-[#512C59] focus:ring-2 focus:ring-[#5D76EE] outline-none"
                    />

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full font-bold text-lg py-2 bg-[#564181] text-white rounded-full mt-4 transition-all duration-300 hover:bg-[#512C59] hover:text-white">
                        Register
                    </button>
                </form>

                {/* Login Redirect */}
                <p className="mt-4 text-[#512C59]">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-[#5D76EE] font-semibold hover:underline ml-1">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;