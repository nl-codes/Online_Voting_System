const FinishedElectionCard = ({ electionDetails }) => {
    const {
        topic,
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

    return (
        <div className="election-card flex flex-col w-200 justify-center  bg-[#29142e] text-white p-4 m-4 rounded-xl border-white border-4 shadow-lg shadow-white">
            {/* Election Details */}
            <div>
                {/* Election */}
                <div>
                    {/* Topic */}
                    <div className="text-3xl">{topic} </div>
                    {/* Description */}
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-[#c791d4]">
                            Description
                        </span>
                        <span className="text-gray-200">{description}</span>
                    </div>
                    {/* Position */}
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-[#c791d4]">
                            Position
                        </span>
                        <span className="text-gray-200">{position}</span>
                    </div>
                    {/* Timeline */}
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-[#c791d4]">
                            Timeline
                        </span>
                        <span className="text-gray-200">{`${start_time} - ${stop_time}`}</span>
                    </div>
                </div>
                {/* Winner */}
                <div></div>
            </div>
            {/* Candidates */}
            <div></div>
        </div>
    );
};

export default FinishedElectionCard;
