import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import LoadingDots from "../components/LoadingDots";
import AdminElectionCard from "../components/AdminElectionCard";

const AdminViewElectionPage = () => {
    const [viewMode, setViewMode] = useState("all");

    const [elections, setElections] = useState([]);
    const [finishedElection, setFinishedElections] = useState([]);
    const [ongoingElection, setOngoingElections] = useState([]);
    const [upcomingElection, setUpcomingElections] = useState([]);

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
                if (response.status === 200 && response.data.success) {
                    setElections(response.data.data);
                    sortElections(response.data.data);
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch elections. Please try again later.");
                console.error("Error fetching elections:", error);
                setLoading(false);
            }
        };
        const sortElections = (electionsList) => {
            const now = new Date().getTime();

            const finished = [];
            const ongoing = [];
            const upcoming = [];

            electionsList.forEach((election) => {
                const startTime = new Date(election.start_time).getTime();
                const stopTime = new Date(election.stop_time).getTime();

                if (now > stopTime) {
                    finished.push(election);
                } else if (now > startTime) {
                    ongoing.push(election);
                } else {
                    upcoming.push(election);
                }
            });

            setFinishedElections(finished);
            setOngoingElections(ongoing);
            setUpcomingElections(upcoming);
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
                <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="bg-[#512C59] text-white px-4 py-2 mt-8 rounded-lg border-2 border-[#c791d4] focus:outline-none focus:ring-2 focus:ring-[#c791d4] cursor-pointer hover:bg-[#613869] transition-colors duration-200">
                    <option value="all">All Elections</option>
                    <option value="finished">Finished Elections</option>
                    <option value="ongoing">Ongoing Elections</option>
                    <option value="upcoming">Upcoming Elections</option>
                </select>

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
