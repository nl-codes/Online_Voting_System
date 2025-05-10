const FinishedElectionCard = ({ electionDetails }) => {
    const {
        title,
        description,
        position,
        start_time,
        stop_time,
        candidate_photo_list,
        candidate_name_list,
        candidate_saying_list,
        candidate_vote_list,
    } = electionDetails;

    // Convert pipe-separated strings to arrays
    const photos = candidate_photo_list.split("|");
    const names = candidate_name_list.split("|");
    const sayings = candidate_saying_list.split("|");
    const votes = candidate_vote_list.split("|");

    return <div className="text-white"></div>;
};

export default FinishedElectionCard;
