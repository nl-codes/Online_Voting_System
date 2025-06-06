import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDisplay from "../components/ProfileDisplay.jsx";
import ElectionCard from "../components/ElectionCard.jsx";
import UraharaChibi from "../assets/urahara_chibi.jpg";
import { UserContext } from "../context/UserContext.jsx";
import UnAuthorized from "../components/UnAuthorized.jsx";
import { API_BASE_URL } from "../config/api.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const UserDashboardPage = () => {
    const { userId, setUserId } = useContext(UserContext);
    const navigate = useNavigate();

    const [isProfileUpdated, setIsProfileUpdated] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("userId");
        setUserId(null);
        navigate("/login");
    };

    const [elections, setElections] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/view_ongoing_election_brief`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Elections data:", data);
                setElections(data.data);
            } catch (error) {
                console.error("Error fetching elections:", error);
                setError(error.message);
            }
        };
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/user_profile/${userId}`
                );
                console.log(response);
                if (response.status === 200 && response.data.success) {
                    const data = response.data.data;
                    console.log(data);
                    if (
                        data.photo_url != null &&
                        data.gender != null &&
                        data.country != null
                    ) {
                        setProfilePhoto(data.photo_url);
                        setIsProfileUpdated(true);
                    }
                }
            } catch (error) {
                console.error("error fetching user profile details: ", error);
            }
        };
        fetchElections();
        fetchProfile();
    }, [userId]);

    if (!userId) {
        return <UnAuthorized />;
    }

    const handleVoterPortal = () => {
        if (!isProfileUpdated) {
            Swal.fire({
                icon: "warning",
                title: "Profile Incomple",
                text: "Please complete profile before accessing voter card!",
                background: "#512C59",
                color: "#ffffff",
            });
            return;
        }
        navigate(`/voter_card`);
    };

    const handleElectionsResult = () => {
        navigate("/past-elections");
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <div className="bg-[#29142e] min-h-screen max-w-screen overflow-x-hidden">
            {/* Header */}
            <div className="text-white text-2xl flex items-center justify-between px-20 pt-4">
                <div className="flex flex-col gap-4 justify-center">
                    <button
                        className="text-white bg-[#ab63bb] px-4 py-2 rounded-md font-bold cursor-pointer transition-all duration-150 ease-in-out hover:scale-110 hover:shadow-[0_0_10px_#ab63bb]"
                        onClick={handleVoterPortal}>
                        VOTER PORTAL
                    </button>
                    <button
                        className="text-white bg-[#ab63bb] px-4 py-2 rounded-md font-bold cursor-pointer transition-all duration-150 ease-in-out hover:scale-110 hover:shadow-[0_0_10px_#ab63bb]"
                        onClick={handleElectionsResult}>
                        ELECTIONS RESULT
                    </button>
                </div>

                <p className="text-3xl font-bold">ONLINE VOTING SYSTEM</p>
                <div className="flex items-center gap-5">
                    <div
                        className="flex flex-col items-center justify-center px-4 py-2 text-sm cursor-pointer font-bold hover:bg-white hover:text-[#29142e] rounded-2xl"
                        onClick={handleProfileClick}>
                        <ProfileDisplay
                            className="rounded-full border-4 border-[#29142e]"
                            image_url={isProfileUpdated ? profilePhoto : ""}
                        />
                        <span>Profile</span>
                    </div>
                    <button
                        className="text-xl text-white font-bold hover:text-[#29142e] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl cursor-pointer"
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            {/* Election Lists Box*/}
            <div className="text-white text-2xl flex flex-col items-center justify-center px-20 pt-4">
                <p className="text-3xl text-yellow-400 flex items-start justify-start w-full pl-40 py-5">
                    Available Elections :
                </p>
                <div className="elections-list">
                    {error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : elections.length > 0 ? (
                        elections.map((election) => (
                            <ElectionCard
                                key={election.id}
                                id={election.id}
                                topic={election.topic}
                                description={election.description}
                                stop_time={election.stop_time}
                                candidate_photo_url={election.photo_url_list}
                            />
                        ))
                    ) : (
                        <p className="text-yellow-400 mt-50">
                            No elections going on right now
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
