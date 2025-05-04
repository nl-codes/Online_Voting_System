import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import LoadingDots from "../components/LoadingDots";
import AdminCandidateCard from "../components/AdminCandidateCard";

const AdminViewCandidatePage = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE_URL}/get_candidates_all`
                );
                console.log(response);
                if (response.status === 200) {
                    if (response.data.success) {
                        setCandidates(response.data.candidateList);
                    }
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch candidates. Please try again later.");
                console.error("Error fetching candidates:", error);
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);
    return (
        <div className="bg-[#29142e] min-h-screen min-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    All Candidates List
                </p>
                <div>
                    {loading ? (
                        <LoadingDots />
                    ) : error ? (
                        <p className="text-red-500 font-bold text-center">
                            {error}
                        </p>
                    ) : candidates.length === 0 ? (
                        <p className="text-white font-bold text-center">
                            No Candidates available
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4 mt-8">
                            {candidates.map((candidate) => (
                                <AdminCandidateCard
                                    key={candidate.id}
                                    id={candidate.id}
                                    photo_url={candidate.photo_url}
                                    full_name={candidate.full_name}
                                    saying={candidate.saying}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminViewCandidatePage;