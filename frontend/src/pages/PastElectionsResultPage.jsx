import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

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
