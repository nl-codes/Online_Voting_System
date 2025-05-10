import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import LoadingDots from "../components/LoadingDots";
import FinishedElectionCard from "../components/FinishedElectionCard";

const PastElectionsResultPage = () => {
    const [finishedElections, setFinishedElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFinishedElections = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/finished_election_details`
                );
                if (response.data.success) {
                    setFinishedElections(response.data.data);
                    console.log(response.data.data);
                }
            } catch (error) {
                setError("Failed to fetch election results");
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinishedElections();
    }, []);
    return (
        <div className="w-screen min-h-screen bg-[#29142e] text-white p-8 flex flex-col">
            {/* Header */}
            <div className="relative flex items-center">
                <div className="absolute left-0">
                    <BackButton backPath={"/home"} />
                </div>
                <p className="w-full text-center text-4xl font-bold">
                    Results of Past{" "}
                </p>
            </div>
            {/* Content - Cards List */}
            <div className=" flex flex-col items-center justify-center gap-8 mt-8">
                {loading ? (
                    <LoadingDots />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : finishedElections.length == 0 ? (
                    <p className="text-2xl">No finished Elections</p>
                ) : (
                    finishedElections.map((election) => (
                        <FinishedElectionCard
                            key={election.id}
                            electionDetails={election}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PastElectionsResultPage;
