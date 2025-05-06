import React, { useEffect, useState } from "react";
import TimeRemaining from "./TimeRemaining";

const AdminElectionCard = ({ election }) => {
    const { id, topic, description, position, start_time, stop_time } =
        election;
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

    const handleArchive = () => {};

    return (
        <div className="election-card flex flex-col w-full max-w-3xl bg-[#29142e] text-[#f6eef8] p-6 m-4 rounded-xl border-[#f6eef8] border-4 shadow-lg shadow-[#f6eef8] hover:shadow-xl transition-all duration-300">
            {/* Header Section */}
            <div className="topic-section flex justify-between items-start mb-6">
                <div>
                    <h2 className="font-bold text-2xl mb-2">
                        {id + ". " + topic}
                    </h2>
                    <p className="text-[#c791d4] text-lg">{position}</p>
                </div>
                <div className="time-remaining bg-[#512C59] p-3 rounded-lg">
                    <span className="font-bold text-yellow-400">
                        {timeRemaining}
                    </span>
                </div>
            </div>

            {/* Description Section */}
            <div className="description-section mb-6">
                <h3 className="text-xl font-semibold mb-2">Description:</h3>
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

            {/* Archive Button */}
            <div className="archive-button mt-6 flex justify-center">
                <button
                    className="bg-[#c791d4] text-[#29142e] cursor-pointer font-bold py-2 px-4 rounded-lg hover:bg-[#a76bb5] transition duration-300"
                    onClick={handleArchive}>
                    Archive Election
                </button>
            </div>
        </div>
    );
};

export default AdminElectionCard;
