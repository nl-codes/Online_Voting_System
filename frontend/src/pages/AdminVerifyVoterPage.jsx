import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import VerifyUserCard from "../components/VerifyUserCard";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import LoadingDots from "../components/LoadingDots";

const AdminVerifyVoterPage = () => {
    const [unVerifiedUserDataList, setUnVerifiedUserDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUnverifiedVoters = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/unverified_voter_list`
                );
                if (response.data.success) {
                    setUnVerifiedUserDataList(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching unverified voters:", error);
                setUnVerifiedUserDataList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnverifiedVoters();
    }, []);
    return (
        <div className="bg-[#29142e] min-h-screen min-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    Verify User Details
                </p>
                <div>
                    <p className="my-2">
                        Remaining User Verifications:{" "}
                        {unVerifiedUserDataList?.length || 0}
                    </p>
                    {isLoading ? (
                        <LoadingDots />
                    ) : unVerifiedUserDataList.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {unVerifiedUserDataList.map((userData, index) => (
                                <VerifyUserCard
                                    key={userData.voter_id || index}
                                    userData={userData}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center font-bold text-2xl text-amber-400">
                            No pending verifications
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVerifyVoterPage;
