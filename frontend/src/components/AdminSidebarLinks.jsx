import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebarLinks = ({ btnName, navigationLink }) => {
    const navigate = useNavigate();
    const handleBtnClick = () => {
        navigate(navigationLink);
    };
    return (
        <div>
            <button
                className=" bg-[#29142e] text-white font-extrabold text-xl px-4 py-2 rounded-xl cursor-pointer hover:bg-[#7d4788]"
                onClick={handleBtnClick}>
                {btnName}
            </button>
        </div>
    );
};

export default AdminSidebarLinks;
