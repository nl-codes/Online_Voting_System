import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const handleLogOut = () => {
        sessionStorage.removeItem("adminId");
        navigate("/sec/admin/login");
    };
    return (
        <div className="bg-[#29142e] h-screen w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col p-4 w-full">
                <div className="flex justify-end">
                    <button
                        className="hover:bg-[#7d4788] text-white text-2xl font-bold py-2 px-4 rounded"
                        onClick={handleLogOut}>
                        Log out
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center"></div>
        </div>
    );
};

export default AdminDashboardPage;
