import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TimeRemaining from "../components/TimeRemaining";
import TimeStarted from "../components/TimeStarted";

const UserElectionPage = () => {
    const navigate = useNavigate();

    const electionId = useParams().id;

    const [election, setElection] = useState([]);

    useEffect(() => {
        const fetchElection = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/view_election_full/${electionId}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setElection(data.data);
                console.log("Election data:", data);
            } catch (err) {
                console.error(
                    "Error fetching election:",
                    err + " error message : " + err.message
                );
            }
        };

        fetchElection();
    }, [electionId]);

    const handleBack = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-[#29142e] flex flex-col ">
            <div className="Header p-4 flex justify-between items-center">
                <span
                    className="cursor-pointer text-white font-bold text-xl hover:underline"
                    onClick={handleBack}>
                    Back
                </span>
            </div>
            <div className="election-details flex flex-col items-center justify-center text-white">
                <p className="text-5xl font-extrabold">{election.topic}</p>
            </div>
            <div className="times  px-8 py-4 flex justify-between">
                {election?.start_time && (
                    <TimeStarted start_time={election.start_time} />
                )}
                {election?.stop_time && (
                    <TimeRemaining stop_time={election.stop_time} />
                )}
            </div>
            <div className="about-position-vote flex items-center justify-center">
                <div className="about-position">
                    <div className="about flex flex-col gap-2">
                        <span className="text-2xl font-bold">About</span>
                        <span className="text-lg text-gray-300 w-200 p-4">
                            {election.description}
                        </span>
                    </div>
                    <div className="position flex flex-col gap-2">
                        <span className="text-2xl font-bold">Position</span>
                        <span className="text-lg text-gray-300 p-4">
                            {election.position}
                        </span>
                    </div>
                </div>
                <div className="vote-btn">
                    <button className="text-3xl text-[#29142e] bg-white font-bold hover:white w-50 h-20 hover:cursor-pointer border-black px-8 my-4 rounded-2xl">
                        Vote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserElectionPage;
