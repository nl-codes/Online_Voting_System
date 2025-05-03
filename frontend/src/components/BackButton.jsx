import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ backPath }) => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(backPath);
    };
    return (
        <div
            className="flex items-center w-fit bg-[#29142e] text-white px-4 py-2 rounded-md font-bold cursor-pointer border-2 border-white hover:bg-white hover:text-[#29142e] transition-all duration-150 ease-in-out hover:scale-110 group gap-2"
            onClick={handleBack}>
            <svg
                className="w-6 h-6 text-white group-hover:text-[#29142e] transition-colors duration-150"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
            </svg>
            BACK
        </div>
    );
};

export default BackButton;
