import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AssignCandidates from "./pages/AssignCandidates";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserElectionPage from "./pages/UserElectionPage";

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<UserDashboardPage />} />
                    <Route
                        path="/sec/admin/dashboard"
                        element={<AdminDashboardPage />}
                    />
                    <Route
                        path="/election_page/:id"
                        element={<UserElectionPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
