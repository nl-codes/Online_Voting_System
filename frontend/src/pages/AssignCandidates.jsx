import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const AssignCandidates = () => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedElection, setSelectedElection] = useState("");
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch elections
        axios
            .get(`${API_BASE_URL}/api/elections`)
            .then((res) => setElections(res.data))
            .catch((err) => console.error(err));

        // Fetch candidates
        axios
            .get(`${API_BASE_URL}/api/candidates`)
            .then((res) => setCandidates(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!selectedElection || selectedCandidates.length === 0) {
            setMessage("Please select an election and at least one candidate.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/election_candidates`, {
                election_id: selectedElection,
                candidate_ids: selectedCandidates,
            });

            setMessage("Candidates successfully assigned!");
            setSelectedElection("");
            setSelectedCandidates([]);
        } catch (error) {
            console.error(error);
            setMessage("Error assigning candidates.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">
                Assign Candidates to Election
            </h2>
            {message && <p className="text-green-600 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select Election */}
                <div>
                    <label className="block font-medium">Select Election</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedElection}
                        onChange={(e) => setSelectedElection(e.target.value)}
                        required>
                        <option value="">-- Choose Election --</option>
                        {elections.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.topic}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Candidates (Multi-select) */}
                <div>
                    <label className="block font-medium">
                        Select Candidates
                    </label>
                    <div className="border p-2 rounded">
                        {candidates.map((c) => (
                            <label key={c.id} className="block">
                                <input
                                    type="checkbox"
                                    value={c.id}
                                    checked={selectedCandidates.includes(c.id)}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSelectedCandidates((prev) =>
                                            prev.includes(value)
                                                ? prev.filter(
                                                      (id) => id !== value
                                                  )
                                                : [...prev, value]
                                        );
                                    }}
                                />
                                <span className="ml-2">{c.full_name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded">
                    Assign Candidates
                </button>
            </form>
        </div>
    );
};

export default AssignCandidates;
