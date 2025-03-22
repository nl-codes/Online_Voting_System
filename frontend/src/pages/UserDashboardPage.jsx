import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileDisplay from "../components/ProfileDisplay.jsx";
import ElectionCard from "../components/ElectionCard.jsx";

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className="bg-[#29142e] h-screen w-screen">
            {/* Header */}
            <div className="text-white text-2xl flex items-center justify-between px-20 pt-4">
                <p className="text-3xl font-bold">ONLINE VOTING SYSTEM</p>
                <div className="flex items-center">
                    <ProfileDisplay />
                    <button
                        className="text-xl text-white font-bold hover:text-[#29142e] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl"
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            {/* Election Lists Box*/}
            <div className="text-white text-2xl flex items-center justify-center px-20 pt-4">
                <p>Available Elections</p>
                <div className="elections-list">
                    <ElectionCard
                        topic="Next PM for Group"
                        stop_time="2025-03-22"
                        cadidates_list="[]"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
