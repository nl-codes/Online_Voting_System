import React from "react";

const AdminArchivedElectionCard = ({ election }) => {
    const {
        id,
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
                        {id + ". " + original_topic}
                    </h2>
                    <p className="font-semibold text-lg">
                        Position :{" "}
                        <span className="text-gray-300 text-lg">
                            {original_position}
                        </span>
                    </p>
                </div>
                <div className="archived-at bg-[#334155] p-3 rounded-lg">
                    <span className="font-bold text-yellow-400">
                        Archived At: {formatDate(archived_at)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminArchivedElectionCard;
