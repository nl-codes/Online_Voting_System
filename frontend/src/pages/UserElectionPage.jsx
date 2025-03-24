import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TimeRemaining from "../components/TimeRemaining";
import TimeStarted from "../components/TimeStarted";
import CandidateCard from "../components/CandidateCard";

const UserElectionPage = () => {
    const navigate = useNavigate();

    const electionId = useParams().id;

    const [photo_url_list, setPhoto_url_list] = useState([]);
    const [full_name_list, setFull_name_list] = useState([]);
    const [saying_list, setSaying_list] = useState([]);

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

    useEffect(() => {
        if (election.photo_url_list) {
            const urls = election.photo_url_list
                .split("|")
                .filter((url) => url.trim());
            setPhoto_url_list(urls);
        }
    }, [election.photo_url_list]);

    useEffect(() => {
        if (election.candidate_list) {
            const candidates = election.candidate_list
                .split("|")
                .filter((candidate) => candidate.trim());
            setFull_name_list(candidates);
        }
    }, [election.candidate_list]);

    useEffect(() => {
        if (election.saying_list) {
            const sayings = election.saying_list
                .split("|")
                .filter((saying) => saying.trim());
            setSaying_list(sayings);
        }
    }, [election.saying_list]);

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
                <div className="about-position text-white">
                    <div className="about flex flex-col gap-2">
                        <span className="text-2xl font-bold">About</span>
                        <span className="text-lg text-gray-400 w-200 p-2">
                            {election.description}
                        </span>
                    </div>
                    <div className="position flex flex-col gap-2">
                        <span className="text-2xl font-bold">Position</span>
                        <span className="text-lg text-gray-400 p-2">
                            {election.position}
                        </span>
                    </div>
                </div>
                <div className="vote-bt">
                    <button className="text-3xl text-[#29142e] bg-white font-bold hover:white w-50 h-20 hover:cursor-pointer rounded-2xl hover:shadow-lg hover:shadow-[#ab63bb]">
                        Vote
                    </button>
                </div>
            </div>
            <div className="candidates-lists flex flex-col justify-center gap-4 p-4">
                {photo_url_list.map((photo_url, index) => (
                    <CandidateCard
                        key={index}
                        photo_url={photo_url}
                        full_name={full_name_list[index]}
                        saying={saying_list[index]}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserElectionPage;
