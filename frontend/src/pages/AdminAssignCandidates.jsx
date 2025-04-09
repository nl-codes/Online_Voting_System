import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import AdminSidebar from "../components/AdminSidebar";
import ProfileDisplay from "../components/ProfileDisplay";

const AdminAssignCandidates = () => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidates, setSelectedCandidates] = useState([]);

    useEffect(() => {
        const dummyCandidates = [
            {
                full_name: "Pariston Hill",
                photo_url:
                    "https://res.cloudinary.com/duhbs7hqv/image/upload/v1743755500/candidates_images/bf5tr0fvkkvltcudpm2b.jpg",
            },
            {
                full_name: "Gon Freccess",
                photo_url:
                    "https://res.cloudinary.com/duhbs7hqv/image/upload/v1743755515/candidates_images/ymciahc4j57c7zf4sclm.jpg",
            },
            {
                full_name: "Kurosaki Ichigo",
                photo_url:
                    "https://res.cloudinary.com/duhbs7hqv/image/upload/v1743223625/userProfile_images/rku5ipusrpypnvekjhss.jpg",
            },
            {
                full_name: "Monkey D. Luffy",
                photo_url:
                    "https://res.cloudinary.com/duhbs7hqv/image/upload/v1743820077/userProfile_images/ojelmlg5sdjhgmpmbsdt.webp",
            },
        ];
        const dummyElection = [
            {
                topic: "Next PM ko ta ?",
                position: "Prime Minister",
            },
            {
                topic: "CEO of HunterXHunter Association?",
                position: "Chairman",
            },
        ];
        setElections(dummyElection);
        setCandidates(dummyCandidates);
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
                            <span className="bg-[#7d4788] px-3 py-1 rounded-md">
                                {selectedElection.topic}
                            </span>
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
                                {index + 1}. {election.topic}
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
            </div>
        </div>
    );
};

export default AdminAssignCandidates;
