import React from "react";
import { format } from "date-fns";

const TimeStarted = ({ start_time }) => {
    return (
        <div className="flex flex-col items-start px-8 py-4">
            <p className="text-gray-300">
                Started at:{" "}
                <span className="border-2 border-[#f6eef8] p-2 rounded-lg">
                    {format(new Date(start_time), "PPpp")}
                </span>
            </p>
        </div>
    );
};

export default TimeStarted;
