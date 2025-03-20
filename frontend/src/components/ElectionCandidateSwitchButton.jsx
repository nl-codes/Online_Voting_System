import React from "react";

const ElectionCandidateSwitchButton = ({ selectedMode, setSelectedMode }) => {
    return (
        <div className="flex justify-around p-4 mt-10 text-[#29142e] font-bold text-4xl bg-white">
            <button
                className={`cursor-pointer px-6 py-2 rounded-lg transition-all ${
                    selectedMode === "election"
                        ? "bg-[#29142e] text-white"
                        : "bg-white text-[#29142e] border border-[#29142e]"
                }`}
                onClick={() => setSelectedMode("election")}>
                ELECTION
            </button>
            <button
                className={`cursor-pointer px-6 py-2 rounded-lg transition-all ${
                    selectedMode === "candidate"
                        ? "bg-[#29142e] text-white"
                        : "bg-white text-[#29142e] border border-[#29142e]"
                }`}
                onClick={() => setSelectedMode("candidate")}>
                CANDIDATE
            </button>
        </div>
    );
};

export default ElectionCandidateSwitchButton;
