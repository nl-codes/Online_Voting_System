import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminAssignCandidates from "./pages/AdminAssignCandidates";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserElectionPage from "./pages/UserElectionPage";
import VoterCardPortalPage from "./pages/VoterCardPortalPage";
import UserProvider from "./context/UserProvider";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminVerifyVoterPage from "./pages/AdminVerifyVoterPage";

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/sec/admin/login"
                        element={<AdminLoginPage />}
                    />
                    <Route path="/home" element={<UserDashboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/sec/admin/dashboard"
                        element={<AdminDashboardPage />}
                    />
                    <Route
                        path="/sec/admin/assign/candidate"
                        element={<AdminAssignCandidates />}
                    />
                    <Route
                        path="/sec/admin/verify/voter"
                        element={<AdminVerifyVoterPage />}
                    />
                    <Route
                        path="/election_page/:id"
                        element={<UserElectionPage />}
                    />
                    <Route
                        path="/voter_card"
                        element={<VoterCardPortalPage />}
                    />

                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
