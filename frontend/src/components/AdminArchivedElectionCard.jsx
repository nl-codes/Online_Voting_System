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

    return <div></div>;
};

export default AdminArchivedElectionCard;
