import React from "react";

const UnAuthorized = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen bg-[#29142e]">
                <h1 className="text-3xl font-bold text-yellow-400 mb-4">
                    This page is restricted for registered users only.
                </h1>
                <p className="text-lg text-white font-bold mb-6">
                    Please login to continue.
                </p>
                <button
                    className="px-6 py-2 text-white text-2xl bg-[#ab63bb]  rounded-md font-bold cursor-pointer transition-all duration-150 ease-in-out hover:scale-110 hover:shadow-[0_0_10px_#ab63bbn"
                    onClick={() => {
                        // Redirect to login page
                        window.location.href = "/login";
                    }}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default UnAuthorized;
