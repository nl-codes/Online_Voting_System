import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TimeRemaining from "../components/TimeRemaining";
import TimeStarted from "../components/TimeStarted";
import CandidateCard from "../components/CandidateCard";
import VotingPopUp from "../components/VotingPopUp";
import ProfileDisplay from "../components/ProfileDisplay";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";
import VoteCountDispaly from "../components/VoteCountDispaly";

const UserElectionPage = () => {
    const { userId } = useContext(UserContext);
    const navigate = useNavigate();

    const electionId = useParams().id;

    const [photo_url_list, setPhoto_url_list] = useState([]);
    const [full_name_list, setFull_name_list] = useState([]);
    const [saying_list, setSaying_list] = useState([]);
    const [candidate_id_list, setCandidate_id_list] = useState([]);
    const [votes_received_list, setVotes_received_list] = useState([]);

    const [election, setElection] = useState([]);

    const [trigger, setTrigger] = useState(false);

    const [voterId, setVoterId] = useState(0);
    const [invalidVoterError, setInvalidVoterError] = useState("");
    const [voterValid, setVoterValid] = useState(false);

    const [selectedCandidateName, setSelectedCandidateName] = useState(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

    const handleOpenPopUp = () => {
        setTrigger(true);
    };
    const handleClosePopUp = () => {
        setTrigger(false);
        setVoterId(0);
        setInvalidVoterError("");
        setVoterValid(false);
        setSelectedCandidateName(null);
        setSelectedCandidateId(null);
    };

    const handleVoterValidation = () => {
        axios
            .post(`${API_BASE_URL}/voter_id_retrieve`, {
                user_id: userId,
            })
            .then((response) => {
                if (response.data.success) {
                    const voterData = response.data.data;
                    if (voterData.voter_id === voterId) {
                        setVoterValid(true);
                        setInvalidVoterError("");
                    } else {
                        setVoterValid(false);
                        setInvalidVoterError(
                            "Invalid Voter ID. Please try again."
                        );
                    }
                } else {
                    setInvalidVoterError("Error retrieving voter data.");
                }
            })
            .catch((error) => {
                console.error("Error validating voter ID:", error);
                setInvalidVoterError("An error occurred. Please try again.");
            });
    };

    useEffect(() => {
        const fetchElection = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/view_election_full/${electionId}`
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
        if (election) {
            // Process all lists at once
            const processListData = (data, separator = "|") => {
                return data
                    ? data.split(separator).filter((item) => item.trim())
                    : [];
            };

            setPhoto_url_list(processListData(election.photo_url_list));
            setFull_name_list(processListData(election.candidate_list));
            setCandidate_id_list(processListData(election.candidate_id_list));
            setSaying_list(processListData(election.saying_list));
            setVotes_received_list(processListData(election.votes_list));
        }
    }, [election]);

    const handleBack = () => {
        navigate("/home");
    };

    const handleSelectedCandidateName = (candidateName, candidateId) => {
        setSelectedCandidateName(candidateName);
        setSelectedCandidateId(candidateId);
    };

    const handleElectionVoting = (candidateName, candidatePicture) => {
        if (!selectedCandidateName || !selectedCandidateId) {
            Swal.fire({
                title: "Please select a candidate",
                color: "white",
                icon: "warning",
                iconColor: "#29142e",
                background: "#ab63bb",
                showCancelButton: false,
                confirmButtonColor: "#29142e",
            });
            return;
        }
        Swal.fire({
            title: `Confirm to vote ${candidateName}?`,
            text: "Vote cannot be changed or reversed.",
            imageUrl: candidatePicture,
            imageAlt: candidateName,
            imageWidth: 150,
            imageHeight: 150,
            color: "white",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            confirmButtonText: "VOTE",
            cancelButtonText: "BACK",
            background: "#29142e",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`${API_BASE_URL}/vote`, {
                        election_id: electionId,
                        candidate_id: selectedCandidateId,
                        user_id: userId,
                        voter_id: voterId,
                    })
                    .then((response) => {
                        if (response.data.success) {
                            Swal.fire({
                                title: "Vote Counted!",
                                color: "white",
                                text: "Your vote has been successfully registered.",
                                icon: "success",
                                iconColor: "lightgreen",
                                background: "#29142e",
                            });
                        }
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error voting: ", error);
                        Swal.fire({
                            title: "Invalid Vote",
                            color: "white",
                            text: error.response.data.message,
                            icon: "error",
                            iconColor: "red",
                            background: "#29142e",
                        });
                    });
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#29142e] flex flex-col ">
            <VotingPopUp
                showPopUp={trigger}
                handleClosePopUp={handleClosePopUp}>
                {voterValid ? (
                    <div className="">
                        <p className="text-[#29142e] font-bold text-2xl">
                            Candidates :
                        </p>
                        <div className="candidates-groups flex justify-around mt-4">
                            {photo_url_list.map((photo_url, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-4 cursor-pointer"
                                    onClick={() =>
                                        handleSelectedCandidateName(
                                            full_name_list[index],
                                            candidate_id_list[index]
                                        )
                                    }>
                                    <ProfileDisplay
                                        image_url={photo_url}
                                        sizes={{ width: 100, height: 100 }}
                                        isSelected={
                                            selectedCandidateName ===
                                            full_name_list[index]
                                        }
                                        className={`${
                                            selectedCandidateName ===
                                            full_name_list[index]
                                                ? "border-8 border-[#6a3c75] rounded-full shadow-2xl shadow-[#dacedc]"
                                                : ""
                                        }`}
                                    />

                                    <span className="text-white font-bold text-2xl">
                                        {full_name_list[index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-center pt-8">
                            <span className="text-[#29142e]">
                                Selected Candidate:{" "}
                                <span className="font-bold text-2xl">
                                    {selectedCandidateName}
                                </span>
                            </span>
                        </div>
                        <div className="vote-btn flex justify-center items-center mt-8">
                            <button
                                onClick={() =>
                                    handleElectionVoting(
                                        selectedCandidateName,
                                        photo_url_list[
                                            full_name_list.indexOf(
                                                selectedCandidateName
                                            )
                                        ]
                                    )
                                }
                                className="text-3xl text-white font-bold bg-[#29142e] shadow-md shadow-[#29142e] px-4 py-2 hover:bg-white hover:text-[#29142e] hover:cursor-pointer rounded-xl hover:shadow-md hover:shadow-white">
                                VOTE
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 items-center justify-around">
                        <p className="text-2xl font-bold text-[#29142e]">
                            To Authorize, Enter voter ID:
                        </p>
                        <p>Check Voter Portal</p>

                        <p className="text-red-600 font-bold">
                            {invalidVoterError}
                        </p>
                        <div className="flex gap-4 items-center justify-center">
                            <input
                                type="number"
                                className="border-white border-4 h-10 p-4 text-xl font-bold rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            <div className="candidates-graphs flex pl-33 gap-8">
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

                <VoteCountDispaly
                    data={{ votes: votes_received_list, names: full_name_list }}
                />
            </div>
        </div>
    );
};

export default UserElectionPage;
