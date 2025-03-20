import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ElectionCandidateSwitchButton from "../components/ElectionCandidateSwitchButton";

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    };

    const [selectedMode, setSelectedMode] = useState("election");
    return (
        <div className="bg-[#29142e] h-screen w-screen">
            {/* Header */}
            <div className="text-white text-2xl flex items-center justify-between px-20">
                <p>ONLINE VOTING SYSTEM</p>
                <div>
                    profile
                    <button
                        className="text-xl text-white font-bold hover:text-[#29142e] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl"
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            {/* Election / Candidates */}
            <ElectionCandidateSwitchButton
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
            />
        </div>
    );
};

export default UserDashboardPage;
