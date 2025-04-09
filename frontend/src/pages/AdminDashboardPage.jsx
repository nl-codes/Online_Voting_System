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
                <div className="flex flex-col justify-center items-center text-white">
                    <p className="font-extrabold text-3xl font-serif">
                        WELCOME TO ADMIN DASHBOARD
                    </p>
                    <p> You have access</p>
                    <p>
                        to create a new elections, view list of all the election
                        existing or upcomming
                    </p>
                    <p>
                        to create a new candidate, view list of all the
                        candidates to exist
                    </p>
                    <p>
                        Assign candidates to a election before the election
                        starts
                    </p>
                    <p>
                        Verify User documents to give them a voter ID, thus
                        allowing them to vote on a election
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
