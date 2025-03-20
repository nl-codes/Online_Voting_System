import React from "react";
import Overview from "../components/Overview";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const gotoLogin = () => navigate("/login");
    const gotoSignup = () => navigate("/signup");
    // dark color used #512C59
    // header color used #564181
    return (
        <div className="flex justify-center items-center bg-[#512C59] h-screen w-screen gap-10">
            <div className="flex flex-col items-center gap-5 ">
                <Overview />
                <p className="text-white text-3xl font-bold ">
                    Create a poll now!
                </p>
            </div>
            <div className="flex ">
                <div className="flex flex-col text-xl text-amber-50">
                    <p>Already have an account?</p>
                    <button
                        className="text-xl text-white font-bold bg-[#c791d4] hover:text-[#564181] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl"
                        onClick={gotoLogin}>
                        Login
                    </button>
                    <p>Register now</p>
                    <button
                        className="text-xl text-white font-bold bg-[#c791d4] hover:text-[#564181] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl"
                        onClick={gotoSignup}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
