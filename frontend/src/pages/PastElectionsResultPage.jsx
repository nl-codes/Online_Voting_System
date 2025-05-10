import { useState } from "react";
import BackButton from "../components/BackButton";

const PastElectionsResultPage = () => {
    const [electionDetails, setElectionDetails] = useState({
        title: "",
        description: "",
        position: "",
        start_time: "",
        stop_time: "",
        candidate_photo_list: "",
        candidate_name_list: "",
        candidate_saying_list: "",
        candidate_votes_list: "",
    });
    return (
        <div className="w-screen h-screen bg-[#29142e] text-white p-8">
            {/* Header */}
            <div className="relative flex items-center">
                <div className="absolute left-0">
                    <BackButton backPath={"/home"} />
                </div>
                <p className="w-full text-center text-4xl font-bold">
                    Results of Past{" "}
                </p>
            </div>
        </div>
    );
};

export default PastElectionsResultPage;
