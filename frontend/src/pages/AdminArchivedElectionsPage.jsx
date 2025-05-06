import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import LoadingDots from "../components/LoadingDots";
import AdminArchivedElectionCard from "../components/AdminArchivedElectionCard";

const AdminArchivedElectionsPage = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArchivedElections = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE_URL}/get_archive_elections`
                );
                console.log(response);
                if (response.status === 200) {
                    if (response.data.success) {
                        setElections(response.data.archivedElections);
                    }
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch elections. Please try again later. ");
                console.error("Error fetching elections: ", error);
                setLoading(false);
            }
        };
        fetchArchivedElections();
    }, []);

    return (
        <div className="bg-[#29142e] min-h-screen max-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    Archived Elections List
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
                            No Elections Archived
                        </p>
                    ) : (
                        <div>
                            {elections.map((election) => (
                                <AdminArchivedElectionCard
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

export default AdminArchivedElectionsPage;
