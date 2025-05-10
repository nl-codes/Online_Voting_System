import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminElectionCard = ({ election }) => {
    const {
        id,
        topic,
        description,
        position,
        start_time,
        stop_time,
        isArchived,
    } = election;

    const navigate = useNavigate();
    const [CandidateNames, setCandidateNames] = useState([]);
    const [CandidatePhotos, setCandidatePhotos] = useState([]);
    const [CandidateSayings, setCandidateSayings] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState("");

    // Format dates for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // Calculate time remaining

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const endTime = new Date(stop_time).getTime();
            const startTime = new Date(start_time).getTime();

            if (now < startTime) {
                return "Not started";
            }

            if (now > endTime) {
                return "Ended";
            }

            const timeLeft = endTime - now;

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
            );

            return `${days}d ${hours}h ${minutes}m`;
        };
        // Initial calculation
        setTimeRemaining(calculateTimeRemaining());

        // Update every minute
        const timer = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 60000);

        // Cleanup interval on unmount
        return () => clearInterval(timer);
    }, [stop_time, start_time]);

    useEffect(() => {
        const fetchAssignedCandidate = async () => {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/get_candidates_assigned`,
                    {
                        election_id: id,
                    }
                );

                if (response.data.success) {
                    const data = response.data.data;
                    console.log(data);
                    // Split the concatenated strings into arrays
                    setCandidateNames(
                        data.candidate_full_name?.split("|") || []
                    );
                    setCandidatePhotos(
                        data.candidate_photo_url?.split("|") || []
                    );
                    setCandidateSayings(
                        data.candidate_saying?.split("|") || []
                    );
                }
            } catch (error) {
                console.error("Error fetching assigned candidates:", error);
            }
        };
        fetchAssignedCandidate();
    }, [id]); // Add dependency array with id

    const showAssignedCandidates = () => {
        if (CandidateNames.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Candidates",
                text: "No candidates have been assigned to this election yet.",
                background: "#512C59",
                color: "#ffffff",
            });
            return;
        }

        const candidatesHtml = CandidateNames.map(
            (name, index) => `
        <div class="flex items-center gap-4 mb-4 p-4 bg-[#29142e] rounded-lg">
            <img src="${CandidatePhotos[index]}" 
                 alt="${name}" 
                 class="w-16 h-16 rounded-full object-cover"
            />
            <div>
                <h3 class="text-xl font-bold">${name}</h3>
                <p class="text-gray-300 italic">"${CandidateSayings[index]}"</p>
            </div>
        </div>
    `
        ).join("");

        Swal.fire({
            title: "Assigned Candidates",
            html: `
            <div class="flex flex-col gap-4">
                ${candidatesHtml}
            </div>
        `,
            showCloseButton: true,
            showConfirmButton: false,
            background: "#512C59",
            color: "#ffffff",
            customClass: {
                popup: "rounded-3xl border-4 border-[#c791d4]",
            },
        });
    };

    const archiveElection = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/archive_election/`,
                {
                    election_id: id,
                }
            );
            console.log(response);
            if (response.status === 200) {
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        iconColor: "#008000",
                        title: "Success",
                        text: "Election archived successfully!",
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        iconColor: "#FF0000",
                        title: "Can't archive Election",
                        text: response.data.message,
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.reload();
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error archiving election: ", error);
        }
    };

    const restartElection = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/restart_election/${id}`
            );
            console.log(response);
            if (response.status === 200) {
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        iconColor: "#008000",
                        title: "Success",
                        text: "Election restarted successfully!",
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        iconColor: "#FF0000",
                        title: "Can't restart Election",
                        text: response.data.message,
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.reload();
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error restarting election: ", error);
        }
    };

    const editElection = async () => {
        navigate(`/sec/admin/edit/election/${id}`);
    };
    const deleteElection = async () => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/delete_election/${id}`
            );
            console.log(response);
            if (response.status === 200) {
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        iconColor: "#008000",
                        title: "Success",
                        text: "Election deleted successfully!",
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        iconColor: "#FF0000",
                        title: "Can't delete Election",
                        text: response.data.message,
                        background: "#512C59",
                        color: "#ffffff",
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.reload();
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error restarting election: ", error);
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                title: "Server Error",
                text: "Can't delete Election at this moment",
                background: "#512C59",
                color: "#ffffff",
            });
        }
    };

    const handleArchive = () => {
        const now = new Date().getTime();
        const stopTime = new Date(stop_time).getTime();

        if (now > stopTime) {
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                title: "Can't archive Election",
                text: "Election has already ended",
                background: "#512C59",
                color: "#ffffff",
            });
            return;
        }
        Swal.fire({
            title: "Do you really want to archive election?",
            text: "Archiving election will lose all votes received by candidates!",
            icon: "warning",
            iconColor: "#FFA500",
            background: "#512C59",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, archive it!",
        }).then((result) => {
            if (result.isConfirmed) {
                archiveElection();
            }
        });
    };

    const handleRestart = () => {
        const now = new Date().getTime();
        const stopTime = new Date(stop_time).getTime();

        if (now > stopTime) {
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                title: "Can't restart Election",
                text: "Election has already ended",
                background: "#512C59",
                color: "#ffffff",
            });
            return;
        }
        Swal.fire({
            title: "Do you really want to restart election?",
            icon: "question",
            iconColor: "#FFA500",
            background: "#512C59",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, restart it!",
        }).then((result) => {
            if (result.isConfirmed) {
                restartElection();
            }
        });
    };

    const handleEdit = async () => {
        const now = new Date().getTime();
        const endTime = new Date(stop_time).getTime();
        if (isArchived == 0) {
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                background: "#512C59",
                color: "#ffffff",
                title: "Can't edit unarchived Election",
                text: "Please archive election before editing",
            });
            return;
        }
        if (now > endTime) {
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                background: "#512C59",
                color: "#ffffff",
                title: "Error",
                text: "Can't edit ended Election",
            });
            return;
        }
        Swal.fire({
            title: "Are you sure to edit the Election?",
            icon: "warning",
            iconColor: "#FFA500",
            background: "#512C59",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Edit",
        }).then((result) => {
            if (result.isConfirmed) {
                editElection();
            }
        });
    };

    const handleDelete = async () => {
        const now = new Date().getTime();
        const endTime = new Date(stop_time).getTime();
        if (isArchived == 0) {
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                background: "#512C59",
                color: "#ffffff",
                title: "Can't delete unarchived Election",
                text: "Please archive election before deleting",
            });
            return;
        }
        if (now > endTime) {
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                background: "#512C59",
                color: "#ffffff",
                title: "Error",
                text: "Can't delete ended Election",
            });
            return;
        }
        Swal.fire({
            title: "Are you sure to delete the Election?",
            icon: "warning",
            iconColor: "#FFA500",
            background: "#512C59",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteElection();
            }
        });
    };

    return (
        <div className="flex justify-around items-center w-full">
            <div
                className="bg-[#81c784] text-[#f2f2f2] cursor-pointer font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#6fbf73] transition duration-300"
                onClick={handleEdit}>
                Edit
            </div>
            <div className="election-card flex flex-col w-full max-w-3xl bg-[#29142e] text-[#f6eef8] p-6 m-4 rounded-xl border-[#f6eef8] border-4 shadow-lg shadow-[#f6eef8] hover:shadow-xl transition-all duration-300">
                {/* Header Section */}
                <div className="topic-section flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-2xl mb-2">
                            {id + ". " + topic}
                        </h2>
                        <div className="position-section mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-[#c791d4]">
                                Position:
                            </h3>
                            <p className="text-lg text-gray-300">{position}</p>
                        </div>
                    </div>
                    <div className="time-remaining bg-[#512C59] p-3 rounded-lg">
                        <span className="font-bold text-yellow-400">
                            {timeRemaining}
                        </span>
                    </div>
                </div>

                {/* Description Section */}
                <div className="description-section mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-[#c791d4]">
                        Description:
                    </h3>
                    <p className="text-lg text-gray-300">{description}</p>
                </div>

                {/* Time Details Section */}
                <div className="time-details-section flex justify-between">
                    <div className="start-time">
                        <h4 className="text-[#c791d4] font-semibold">
                            Start Time:
                        </h4>
                        <p className="text-lg">{formatDate(start_time)}</p>
                    </div>
                    <div className="end-time">
                        <h4 className="text-[#c791d4] font-semibold">
                            End Time:
                        </h4>
                        <p className="text-lg">{formatDate(stop_time)}</p>
                    </div>
                </div>

                {/* Archive Section */}
                <div className="archive-button mt-6 flex justify-between items-center">
                    <div className="status-section mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-[#c791d4]">
                            Status:
                        </h3>
                        <p className="text-lg text-gray-300">
                            {isArchived == 1 ? "Archived" : "Available"}
                        </p>
                    </div>
                    <div className="flex gap-8">
                        <button
                            className="bg-[#4dd0e1] text-[#f2f2f2] cursor-pointer font-bold py-2 px-4 rounded-lg 
    shadow-md hover:bg-[#3cbecf] transition duration-30"
                            onClick={handleRestart}>
                            Restart
                        </button>
                        <button
                            className="bg-[#f4a236] text-[#f2f2f2] cursor-pointer font-bold py-2 px-4 rounded-lg 
    shadow-md hover:bg-[#db902f] transition duration-300"
                            onClick={handleArchive}>
                            Archive
                        </button>
                    </div>
                </div>
                {/* See Assigned Candidates Section */}
                <div className=" w-full flex items-center justify-center text-center">
                    <span
                        className="bg-[#512c59] px-4 py-2 text-xl font-semibold rounded-xl cursor-pointer hover:bg-[#8f559cf8]"
                        onClick={showAssignedCandidates}>
                        See Assignned Candidates
                    </span>
                </div>
            </div>
            <div
                className="bg-[#e57373] text-[#f2f2f2] cursor-pointer font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#d65c5c] transition duration-300"
                onClick={handleDelete}>
                Delete
            </div>
        </div>
    );
};

export default AdminElectionCard;
