import React from "react";

const AdminArchivedElectionCard = ({ election }) => {
    const {
        original_election_id,
        original_topic,
        original_description,
        original_position,
        original_schedule,
        archived_at,
        original_candidates,
        original_votes,
    } = election;

    // Format dates for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const candidates = original_candidates.split("|");
    const votes = original_votes.split("|");

    return (
        <div className="archived-election-card flex flex-col w-full max-w-3xl bg-[#29142e] text-[#f6eef8] p-6 m-4 rounded-xl border-[#f6eef8] border-4 shadow-lg shadow-[#f6eef8] hover:shadow-xl transition-all duration-300">
            {/* Header Section */}
            <div className="header-section flex justify-between items-start mb-6">
                <div>
                    <h2 className="font-bold text-2xl mb-2">
                        {original_election_id + ". " + original_topic}
                    </h2>
                    <p className="font-semibold text-lg">
                        Position :{" "}
                        <span className="text-gray-300 text-lg">
                            {original_position}
                        </span>
                    </p>
                </div>
                <div className="archived-at bg-[#512C59] p-3 rounded-lg">
                    <span className="font-bold text-yellow-400">
                        Archived At: {formatDate(archived_at)}
                    </span>
                </div>
            </div>

            {/* Description Section */}
            <div className="description-section mb-6">
                <h3 className="text-xl font-semibold mb-2">Description:</h3>
                <p className="text-lg text-gray-300">{original_description}</p>
            </div>

            {/* Schedule Section */}
            <div className="schedule-section mb-6">
                <h3 className="text-xl font-semibold mb-2">
                    Original Schedule:
                </h3>
                <div className="flex gap-16">
                    <div>
                        <p className="text-[#c791d4] font-semibold">
                            Start Time:
                        </p>
                        <p className="text-lg text-gray-300">
                            {original_schedule.split("|")[0]}
                        </p>
                    </div>
                    <div>
                        <p className="text-[#c791d4] font-semibold">
                            End Time:
                        </p>
                        <p className="text-lg text-gray-300">
                            {original_schedule.split("|")[1]}
                        </p>
                    </div>
                </div>
            </div>
            {/* Candidates and Votes Section */}
            <div className="results-section mb-6">
                <h3 className="text-xl font-semibold mb-4">
                    Election Results:
                </h3>
                <div className="flex flex-col gap-4 w-1/2 mx-auto">
                    <div className="text-[#c791d4] font-semibold text-lg flex justify-between">
                        <span>Candidates</span>
                        <span>Votes</span>
                    </div>
                    {candidates.map((candidate, index) => (
                        <div
                            className="text-gray-300 font-semibold text-lg flex justify-between"
                            key={index}>
                            <span>{candidate}</span>
                            <span>{votes[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminArchivedElectionCard;
