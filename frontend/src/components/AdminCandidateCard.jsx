import ProfileDisplay from "./ProfileDisplay";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import Swal from "sweetalert2";

const AdminCandidateCard = ({ id, photo_url, full_name, saying }) => {
    const navigate = useNavigate();
    const handleEdit = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/check_if_candidate_assigned`,
                {
                    candidate_id: id,
                }
            );

            if (response.data.success) {
                // Candidate is not assigned, proceed to edit
                navigate(`/sec/admin/edit/candidate/${id}`);
            } else {
                // Show error message if candidate is assigned
                Swal.fire({
                    icon: "error",
                    title: "Cannot Edit Candidate",
                    text: response.data.message,
                    background: "#512C59",
                    color: "#ffffff",
                    confirmButtonColor: "#c791d4",
                });
            }
        } catch (error) {
            console.error("Error checking candidate assignment:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to check candidate assignment. Please try again.",
                background: "#512C59",
                color: "#ffffff",
                confirmButtonColor: "#c791d4",
            });
        }
    };
    return (
        <div className="flex items-center text-white pl-8">
            <p className="mx-8 font-bold text-xl">{id}</p>
            <ProfileDisplay
                image_url={photo_url}
                sizes={{ width: 100, height: 100 }}
            />
            <div className="full_name-saying flex flex-col ml-8 font-serif gap-2">
                <p className="text-3xl font-bold text-[#c791d4]">{full_name}</p>
                <p className="text-md w-100">{saying}</p>
            </div>
            <div
                className="bg-[#81c784] text-[#f2f2f2] cursor-pointer font-bold py-2 px-4 ml-16 rounded-lg shadow-md hover:bg-[#6fbf73] transition duration-300"
                onClick={handleEdit}>
                Edit
            </div>
        </div>
    );
};

export default AdminCandidateCard;