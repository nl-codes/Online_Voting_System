import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TimeRemaining from "../components/TimeRemaining";
import TimeStarted from "../components/TimeStarted";
import CandidateCard from "../components/CandidateCard";
import VotingPopUp from "../components/VotingPopUp";
import ProfileDisplay from "../components/ProfileDisplay";

const UserElectionPage = () => {
    const navigate = useNavigate();

    const electionId = useParams().id;

    const [photo_url_list, setPhoto_url_list] = useState([]);
    const [full_name_list, setFull_name_list] = useState([]);
    const [saying_list, setSaying_list] = useState([]);

    const [election, setElection] = useState([]);

    const [trigger, setTrigger] = useState(false);

    const validVoterId = 1234;
    const [voterId, setVoterId] = useState(0);

    const [validVoter, setValidVoter] = useState(false);

    const handleOpenPopUp = () => {
        setTrigger(true);
    };
    const handleClosePopUp = () => {
        setTrigger(false);
    };

    const handleVoterValidation = () => {
        if (parseInt(voterId) == validVoterId) {
            setValidVoter(true);
            console.log(voterId);
            alert("Voter vaild");
        } else {
            alert("Voter not valid.");
        }
    };

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
            <VotingPopUp trigger={trigger} handleClosePopUp={handleClosePopUp}>
                {validVoter ? (
                    <div className="">
                        <p className="text-white font-bold text-2xl">
                            VOTE FOR :
                        </p>
                        <div className="candidates-groups flex justify-around mt-4">
                            {photo_url_list.map((photo_url, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-4">
                                    <ProfileDisplay
                                        image_url={photo_url}
                                        sizes={{ width: 100, height: 100 }}
                                    />
                                    <span>{full_name_list[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 items-center justify-around">
                        <p className="text-2xl font-bold text-[#29142e]">
                            To Authorize, Enter voter ID:
                        </p>
                        <div className="flex gap-4 items-center justify-center">
                            <input
                                type="number"
                                className="border-white border-4 h-10 p-4 text-xl font-bold rounded-lg"
                                onChange={(e) => setVoterId(e.target.value)}
                                value={voterId}
                            />
                            <button
                                onClick={handleVoterValidation}
                                className="text-white font-bold bg-[#29142e] py-2 px-4 cursor-pointer rounded-md">
                                Authorize
                            </button>
                        </div>
                    </div>
                )}
            </VotingPopUp>
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
                <div className="vote-btn">
                    <button
                        className="text-3xl text-[#29142e] bg-white font-bold hover:white w-40 h-20 hover:cursor-pointer rounded-2xl hover:shadow-lg hover:shadow-[#ab63bb] "
                        onClick={handleOpenPopUp}>
                        VOTE
                    </button>
                </div>
            </div>
            <div className="candidates-graphs flex itesm-center justify-center gap-8">
                <div className="candidates-lists flex flex-col justify-center gap-8 p-4">
                    <p className="text-2xl text-white font-serif  font-bold">
                        Candidate list :
                    </p>
                    {photo_url_list.map((photo_url, index) => (
                        <CandidateCard
                            key={index}
                            photo_url={photo_url}
                            full_name={full_name_list[index]}
                            saying={saying_list[index]}
                        />
                    ))}
                </div>
                <div className="w-200 bg-cyan-500">Graphs</div>
            </div>
        </div>
    );
};

export default UserElectionPage;
