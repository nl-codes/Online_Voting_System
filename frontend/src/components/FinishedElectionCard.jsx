import CandidatePopup from "./CandidatePopup";

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
    const votes = candidate_vote_list.split("|").map(Number);

    const winnerIndex = votes.indexOf(Math.max(...votes));

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="election-card flex flex-col w-200 justify-center  bg-[#29142e] text-white p-4 m-4 rounded-xl border-white border-4 shadow-lg shadow-white">
            {/* Election and Winner Details */}
            <div className="flex items-center justify-between">
                {/* Election */}
                <div className="text-xl flex flex-col gap-8">
                    {/* Topic */}
                    <div className="text-4xl font-bold mb-4">{topic} </div>
                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-semibold text-[#c791d4]">
                            Description
                        </span>
                        <span className="text-gray-200">{description}</span>
                    </div>
                    {/* Position */}
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-semibold text-[#c791d4]">
                            Position
                        </span>
                        <span className="text-gray-200">{position}</span>
                    </div>
                    {/* Timeline */}
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-semibold text-[#c791d4]">
                            Timeline
                        </span>
                        <span className="text-gray-200">{`${formatDateTime(
                            start_time
                        )} - ${formatDateTime(stop_time)}`}</span>
                    </div>
                </div>
                {/* Winner */}
                <div className="flex flex-col items-center justify-center gap-4">
                    <CandidatePopup
                        image_url={photos[winnerIndex]}
                        name={names[winnerIndex]}
                        saying={sayings[winnerIndex]}
                        isWinner={true}
                    />
                    <span className="text-xl">{`Votes Received: ${votes[winnerIndex]}`}</span>
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-4"></div>
            {/* Candidates */}
            <div className="flex flex-col gap-4">
                <span className="text-2xl font-semibold text-[#c791d4]">
                    Candidates
                </span>
                <div className="flex justify-around">
                    {names.map((name, index) => {
                        // Skip the winner
                        if (index === winnerIndex) return null;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-2">
                                <CandidatePopup
                                    image_url={photos[index]}
                                    name={name}
                                    saying={sayings[index]}
                                    isWinner={false}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FinishedElectionCard;
