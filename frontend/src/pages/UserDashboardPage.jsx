import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDisplay from "../components/ProfileDisplay.jsx";
import ElectionCard from "../components/ElectionCard.jsx";
import UraharaChibi from "../assets/urahara_chibi.jpg";
import { UserContext } from "../context/UserContext.jsx";
import UnAuthorized from "../components/UnAuthorized.jsx";
import { API_BASE_URL } from "../config/api.jsx";

const UserDashboardPage = () => {
    const { userId, setUserId } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userId");
        setUserId(null);
        navigate("/login");
    };

    const [elections, setElections] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/view_ongoing_election_brief`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Elections data:", data);
                setElections(data.data);
            } catch (error) {
                console.error("Error fetching elections:", error);
                setError(error.message);
            }
        };
        fetchElections();
    }, []);

    const handleVoterPortal = () => {
        navigate(`/voter_card`);
    };
    if (!userId) {
        return <UnAuthorized />;
    }

    return (
        <div className="bg-[#29142e] h-screen max-w-screen">
            {/* Header */}
            <div className="text-white text-2xl flex items-center justify-between px-20 pt-4">
                <button
                    className="text-white bg-[#ab63bb] px-4 py-2 rounded-md font-bold cursor-pointer transition-all duration-150 ease-in-out hover:scale-110 hover:shadow-[0_0_10px_#ab63bb]"
                    onClick={handleVoterPortal}>
                    VOTER PORTAL
                </button>
                <p className="text-3xl font-bold">ONLINE VOTING SYSTEM</p>
                <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center justify-center px-4 py-2 text-sm cursor-pointer font-bold hover:bg-white hover:text-[#29142e] rounded-2xl">
                        <ProfileDisplay
                            className="rounded-full border-4 border-[#29142e]"
                            image_url={UraharaChibi}
                        />
                        <span>Profile</span>
                    </div>
                    <button
                        className="text-xl text-white font-bold hover:text-[#29142e] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl cursor-pointer"
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            {/* Election Lists Box*/}
            <div className="text-white text-2xl flex flex-col items-center justify-center px-20 pt-4">
                <p className="text-3xl text-yellow-400 flex items-start justify-start w-full pl-40 py-5">
                    Available Elections :
                </p>
                <div className="elections-list">
                    {error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : elections.length > 0 ? (
                        elections.map((election) => (
                            <ElectionCard
                                key={election.id}
                                id={election.id}
                                topic={election.topic}
                                description={election.description}
                                stop_time={election.stop_time}
                                candidate_photo_url={election.photo_url_list}
                            />
                        ))
                    ) : (
                        <p className="text-yellow-400 mt-50">
                            No elections going on right now
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
