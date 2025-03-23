import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserElectionPage = () => {
    const navigate = useNavigate();

    const electionId = useParams().id;

    const [election, setElection] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElection = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/view_election/${electionId}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Election data:", data);
                setElection(data);
            } catch (error) {
                console.error("Error fetching election:", error);
                setError(error.message);
            }
        };

        fetchElection();
    }, [election, electionId]);

    const handleBack = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-[#29142e]">
            <div className="Header p-4 flex justify-between items-center">
                <span
                    className="cursor-pointer text-white font-bold text-xl hover:underline"
                    onClick={handleBack}>
                    Back
                </span>
            </div>
            <div className="election-details flex flex-col items-center justify-center text-white">
                <p>{}</p>
            </div>
        </div>
    );
};

export default UserElectionPage;
