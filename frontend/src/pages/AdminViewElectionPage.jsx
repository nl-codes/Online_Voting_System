import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import LoadingDots from "../components/LoadingDots";
import AdminElectionCard from "../components/AdminElectionCard";

const AdminViewElectionPage = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE_URL}/get_all_elections`
                );
                console.log(response);
                if (response.status === 200) {
                    if (response.data.success) {
                        setElections(response.data.electionList);
                    }
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch elections. Please try again later.");
                console.error("Error fetching elections:", error);
                setLoading(false);
            }
        };
        fetchElections();
    }, []);
    return (
        <div className="bg-[#29142e] min-h-screen min-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    All Elections List
                </p>
                <div>
                    {loading ? (
                        <LoadingDots />
                    ) : error ? (
                        <p className="text-red-500 font-bold text-center">
                            {error}
                        </p>
                    ) : elections.length === 0 ? (
                        <p className="text-white font-bold text-center">
                            No Elections available
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4 mt-8 items-center">
                            {elections.map((election) => (
                                <AdminElectionCard
                                    key={election.id}
                                    election={election}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminViewElectionPage;
