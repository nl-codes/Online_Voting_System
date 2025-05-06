import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import Swal from "sweetalert2";

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
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        iconColor: "#FF0000",
                        title: "Can't archive Election",
                        text: response.data.message,
                        background: "#512C59",
                        color: "#ffffff",
                    });
                }
            }
        } catch (error) {
            console.error("Error archiving election: ", error);
        }
    };

    const handleArchive = () => {
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
            }
        });
    };

    return (
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
                    <h4 className="text-[#c791d4] font-semibold">End Time:</h4>
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
                <div>
                    <button
                        className="bg-[#c791d4] text-[#29142e] cursor-pointer font-bold py-2 px-4 rounded-lg hover:bg-[#a76bb5] transition duration-300"
                        onClick={handleRestart}>
                        Restart Election
                    </button>
                    <button
                        className="bg-[#c791d4] text-[#29142e] cursor-pointer font-bold py-2 px-4 rounded-lg hover:bg-[#a76bb5] transition duration-300"
                        onClick={handleArchive}>
                        Archive Election
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminElectionCard;
