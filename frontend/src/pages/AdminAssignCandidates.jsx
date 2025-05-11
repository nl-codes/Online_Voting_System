import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import AdminSidebar from "../components/AdminSidebar";
import ProfileDisplay from "../components/ProfileDisplay";
import Swal from "sweetalert2";

const AdminAssignCandidates = () => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidates, setSelectedCandidates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch elections
                const electionRes = await axios.get(
                    `${API_BASE_URL}/get_all_elections`
                );
                if (electionRes.data?.success) {
                    setElections(electionRes.data.data || []);
                } else {
                    console.error(
                        "Failed to fetch elections:",
                        electionRes.data?.message
                    );
                }

                // Fetch candidates
                const candidateRes = await axios.get(
                    `${API_BASE_URL}/get_candidates_all`
                );
                if (candidateRes.data?.success) {
                    setCandidates(candidateRes.data.candidateList || []);
                } else {
                    console.error(
                        "Failed to fetch candidates:",
                        candidateRes.data?.message
                    );
                }
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleElectionSelect = (election) => {
        setSelectedElection(election);
    };

    const handleCandidateSelect = (candidate) => {
        setSelectedCandidates((prev) => {
            // If already selected, remove it
            if (prev.some((c) => c.full_name === candidate.full_name)) {
                return prev.filter((c) => c.full_name !== candidate.full_name);
            }
            // If not selected, add it
            return [...prev, candidate];
        });
    };

    const handleAssignCandidates = async () => {
        // Validation check
        if (!selectedElection || selectedCandidates.length < 2) {
            Swal.fire({
                title: "Error!",
                text: "Please select an election and at least 2 candidates",
                icon: "error",
                iconColor: "red",
                color: "white",
                background: "#29142e",
                confirmButtonColor: "#7d4788",
            });
            return;
        }

        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This will remove any existing candidate assignments for this election",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7d4788",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, assign candidates",
                background: "#29142e",
                color: "#ffffff",
            });

            if (result.isConfirmed) {
                // Use Promise.all to handle multiple requests concurrently
                const responses = await Promise.all(
                    selectedCandidates.map((candidate) =>
                        axios.post(`${API_BASE_URL}/assign_candidate`, {
                            election_id: selectedElection.id,
                            candidate_id: candidate.id,
                        })
                    )
                );

                // Check if any request failed
                const hasError = responses.some(
                    (response) => !response.data.success
                );

                if (!hasError) {
                    await Swal.fire({
                        title: "Success!",
                        text: "Candidates assigned successfully",
                        icon: "success",
                        iconColor: "lightgreen",
                        color: "white",
                        background: "#29142e",
                        confirmButtonColor: "#7d4788",
                    });

                    // Reset selections after successful assignment
                    setSelectedElection(null);
                    setSelectedCandidates([]);
                    // Refresh the page to update lists
                    window.location.reload();
                } else {
                    throw new Error("Some candidates could not be assigned");
                }
            }
        } catch (error) {
            console.error("Error assigning candidates:", error);
            Swal.fire({
                title: "Error!",
                text:
                    error.message ||
                    "Failed to assign candidates. Please try again.",
                icon: "error",
                iconColor: "red",
                color: "white",
                background: "#29142e",
                confirmButtonColor: "#7d4788",
            });
        }
    };
    const handleUnAssignCandidates = async () => {
        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This will unassign all candidates from this election!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7d4788",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, unassign all!",
                background: "#29142e",
                color: "#ffffff",
            });

            if (result.isConfirmed) {
                // Make API call
                const response = await axios.post(
                    `${API_BASE_URL}/unassign_candidates_all`,
                    {
                        election_id: selectedElection.id,
                    }
                );

                if (response.data.success) {
                    // Show success message
                    await Swal.fire({
                        title: "Unassigned!",
                        text: "All candidates have been unassigned.",
                        icon: "success",
                        iconColor: "lightgreen",
                        confirmButtonColor: "#7d4788",
                        background: "#29142e",
                        color: "#ffffff",
                    });

                    // Reset selections
                    setSelectedElection(null);
                    setSelectedCandidates([]);
                    // Refresh page to update lists
                    window.location.reload();
                } else {
                    throw new Error(response.data.message);
                }
            }
        } catch (error) {
            console.error("Error unassigning candidates:", error);
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to unassign candidates.",
                icon: "error",
                iconColor: "red",
                confirmButtonColor: "#7d4788",
                background: "#29142e",
                color: "#ffffff",
            });
        }
    };

    return (
        <div className="bg-[#29142e] min-h-screen min-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    Assign Candidates to Elections
                </p>
                {/* Selected Items Display */}
                <div className="selected bg-[#512C59] rounded-lg p-4 my-4">
                    <div className="selected-election mb-4">
                        <p className="font-bold mb-2">Selected Election:</p>
                        {selectedElection ? (
                            <div className="flex items-center gap-4">
                                <span className="bg-[#7d4788] px-3 py-1 rounded-md">
                                    {selectedElection.topic}
                                </span>
                                <button
                                    onClick={handleUnAssignCandidates}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition-colors duration-200 flex items-center gap-2">
                                    Unassign Candidates
                                </button>
                            </div>
                        ) : (
                            <span className="text-gray-400">
                                No election selected
                            </span>
                        )}
                    </div>
                    <div className="selected-candidates">
                        <p className="font-bold mb-2">Selected Candidates:</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedCandidates.map((candidate, index) => (
                                <span
                                    key={index}
                                    className="bg-[#7d4788] px-3 py-1 rounded-md">
                                    {candidate.full_name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Elections List */}
                <div className="election-list mb-8">
                    <p className="font-bold mb-4">Elections List:</p>
                    {elections.map((election, index) => (
                        <div
                            key={index}
                            onClick={() => handleElectionSelect(election)}
                            className={`flex flex-col mb-4 p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedElection?.topic === election.topic
                                    ? "bg-[#7d4788]"
                                    : "hover:bg-[#512C59]"
                            }`}>
                            <span className="text-xl font-bold">
                                {election.id}. {election.topic}
                            </span>
                            <span className="text-sm pl-5">
                                {election.position}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Candidates List */}
                <div className="candidate-list">
                    <p className="font-bold mb-4">Candidates:</p>
                    <div className="grid grid-cols-2 gap-4">
                        {candidates.map((candidate, index) => (
                            <div
                                key={index}
                                onClick={() => handleCandidateSelect(candidate)}
                                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedCandidates.some(
                                        (c) =>
                                            c.full_name === candidate.full_name
                                    )
                                        ? "bg-[#7d4788]"
                                        : "hover:bg-[#512C59]"
                                }`}>
                                <ProfileDisplay
                                    image_url={candidate.photo_url}
                                />
                                <span className="font-medium">
                                    {candidate.full_name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleAssignCandidates}
                    disabled={
                        !selectedElection || selectedCandidates.length < 2
                    }
                    className={`mt-8 px-6 py-3 rounded-lg font-bold transition-colors ${
                        selectedElection && selectedCandidates.length > 0
                            ? "bg-[#7d4788] hover:bg-[#6d3778] text-white"
                            : "bg-gray-500 cursor-not-allowed text-gray-300"
                    }`}>
                    Assign Candidates
                </button>
            </div>
        </div>
    );
};

export default AdminAssignCandidates;