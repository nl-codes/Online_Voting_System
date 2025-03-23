import React, { useEffect, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";

const TimeRemaining = ({ stop_time }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateTimeLeft = () => {
            const endDate = new Date(stop_time);
            const now = new Date();
            if (endDate > now) {
                setTimeLeft(formatDistanceToNow(endDate, { addSuffix: true }));
            } else {
                setTimeLeft("Election ended");
            }
        };

        updateTimeLeft();
        const timer = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [stop_time]);
    return (
        <div className="flex flex-col items-end">
            <p className="text-gray-300">
                Ends at :{" "}
                <span className="border-2 border-[#f6eef8] p-2 rounded-lg">
                    {format(new Date(stop_time), "PPpp")}
                </span>
            </p>
            <p className="text-yellow-400 font-medium mt-1 text-end">
                {timeLeft}
            </p>
        </div>
    );
};

export default TimeRemaining;
