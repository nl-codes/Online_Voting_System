import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDisplay from "../components/ProfileDisplay.jsx";
import ElectionCard from "../components/ElectionCard.jsx";

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    };

    const [elections, setElections] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/view_election_brief"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Elections data:", data);
                setElections(data);
            } catch (error) {
                console.error("Error fetching elections:", error);
                setError(error.message);
            }
        };

        fetchElections();
    }, []);

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
                    {error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : elections.length > 0 ? (
                        elections.map((election) => (
                            <ElectionCard
                                key={election.id}
                                topic={election.topic}
                                stop_time={election.stop_time}
                                candidates_photo_url={election.photo_url}
                            />
                        ))
                    ) : (
                        <p>No elections available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
