import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AssignCandidates from "./pages/AssignCandidates";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserElectionPage from "./pages/UserElectionPage";
import VoterCardPortalPage from "./pages/VoterCardPortalPage";

const App = () => {
    const [userId, setUserId] = useState(null);
    return (
        <Router>
            <Routes> 
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/home"
                    element={
                        <UserDashboardPage
                            userId={userId}
                            setUserId={setUserId} // Fixed naming convention
                        />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <LoginPage
                            userId={userId}
                            setUserId={setUserId} // Fixed naming convention
                        />
                    }
                />
                <Route
                    path="/sec/admin/dashboard"
                    element={<AdminDashboardPage />}
                />
                <Route
                    path="/election_page/:id"
                    element={<UserElectionPage />}
                />
                <Route
                    path="/voter_card/:userId"
                    element={<VoterCardPortalPage />}
                />

                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </Router>
    );
};

export default App;
