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
import UserProfilePage from "./pages/UserProfilePage";
import UserProfileEditPage from "./pages/UserProfileEditPage";
import AdminViewElectionPage from "./pages/AdminViewElectionPage";
import AdminCreateElectionPage from "./pages/AdminCreateElectionPage";
import AdminViewCandidatePage from "./pages/AdminViewCandidatePage";
import AdminCreateCandidatePage from "./pages/AdminCreateCandidatesPage";
import AdminArchivedElectionsPage from "./pages/AdminArchivedElectionsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminEditElectionPage from "./pages/AdminEditElectionPage";
import PastElectionsResultPage from "./pages/PastElectionsResultPage";
import AdminEditCandidatePage from "./pages/AdminEditCandidatePage";
import PageNotFoundPage from "./pages/PageNotFoundPage";

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
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={<ResetPasswordPage />}
                    />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route
                        path="/profile/edit"
                        element={<UserProfileEditPage />}
                    />
                    <Route
                        path="/sec/admin/dashboard"
                        element={<AdminDashboardPage />}
                    />
                    <Route
                        path="/sec/admin/view/election"
                        element={<AdminViewElectionPage />}
                    />
                    <Route
                        path="/sec/admin/create/election"
                        element={<AdminCreateElectionPage />}
                    />
                    <Route
                        path="/sec/admin/edit/election/:id"
                        element={<AdminEditElectionPage />}
                    />
                    <Route
                        path="/sec/admin/archived/election"
                        element={<AdminArchivedElectionsPage />}
                    />
                    <Route
                        path="/sec/admin/view/candidate"
                        element={<AdminViewCandidatePage />}
                    />
                    <Route
                        path="/sec/admin/create/candidate"
                        element={<AdminCreateCandidatePage />}
                    />
                    <Route
                        path="/sec/admin/edit/candidate/:id"
                        element={<AdminEditCandidatePage />}
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
                    <Route
                        path="/past-elections"
                        element={<PastElectionsResultPage />}
                    />

                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="*" element={<PageNotFoundPage />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
