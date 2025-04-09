import React, { useState } from "react";
import ButtonVerificationRejection from "./ButtonVerificationRejection";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import Swal from "sweetalert2";

const VerifyUserCard = ({ userData }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle image click
    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    // Handle closing the modal
    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
            years--;
            months = 12 + months;
        }

        return `${years} years ${months} months`;
    };

    const handleVerify = async () => {
        if (!userData.id) {
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/verify_voter`, {
                user_id: userData.id,
            });

            if (response.data.success) {
                await Swal.fire({
                    title: "Verified!",
                    text: "User has been successfully verified.",
                    icon: "success",
                    iconColor: "lightgreen",
                    color: "white",
                    background: "#29142e",
                    confirmButtonColor: "green",
                });
                window.location.reload();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    iconColor: "red",
                    color: "white",
                    background: "#29142e",
                    confirmButtonColor: "#7d4788",
                });
            }
        } catch (error) {
            console.error("Verification error:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to verify user. Please try again.",
                icon: "error",
                iconColor: "red",
                color: "white",
                background: "#29142e",
                confirmButtonColor: "#7d4788",
            });
        }
    };

    const handleReject = async () => {
        if (!userData.id) {
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/reject_voter`, {
                user_id: userData.id,
            });

            if (response.data.success) {
                await Swal.fire({
                    title: "Rejected!",
                    text: "User verification has been rejected.",
                    icon: "warning",
                    iconColor: "orange",
                    color: "white",
                    background: "#29142e",
                    confirmButtonColor: "red",
                });
                window.location.reload();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    iconColor: "red",
                    color: "white",
                    background: "#29142e",
                    confirmButtonColor: "#7d4788",
                });
            }
        } catch (error) {
            console.error("Rejection error:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to reject user. Please try again.",
                icon: "error",
                iconColor: "red",
                color: "white",
                background: "#29142e",
                confirmButtonColor: "#7d4788",
            });
        }
    };

    return (
        <>
            <div className="border-4 border-[#7d4788] rounded-2xl px-4 py-2 flex justify-between items-center">
                <div>
                    <div className="user-details text-lg">
                        <div className="flex gap-20">
                            UserName :{" "}
                            <span className="font-bold text-[#c791d4]">
                                {userData.full_name}
                            </span>
                        </div>
                        <div className="flex gap-32">
                            DOB :
                            <span className="font-bold text-yellow-500">
                                {formatDate(userData.dob)}
                                <span className="ml-2 text-sm text-gray-300">
                                    ({calculateAge(userData.dob)})
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-2">
                            Citizenship-number :{" "}
                            <span className="font-bold">
                                {userData.citizenship_number}
                            </span>
                        </div>
                    </div>
                    <div className="photos flex gap-10 my-4">
                        <img
                            className="border-white border-2 rounded-lg"
                            src={userData.citizenship_front_pic}
                            alt="citizenship_front_pic"
                            onClick={() =>
                                handleImageClick(userData.citizenship_front_pic)
                            }
                            width={"200px"}
                        />
                        <img
                            className="border-white border-2 rounded-lg"
                            src={userData.citizenship_back_pic}
                            alt="citizenship_back_pic"
                            onClick={() =>
                                handleImageClick(userData.citizenship_back_pic)
                            }
                            width={"200px"}
                        />
                    </div>
                    <span className="text-[12px]">Click to zoom</span>
                </div>
                <div className="buttons">
                    <ButtonVerificationRejection
                        handleVerify={handleVerify}
                        handleReject={handleReject}
                    />
                </div>
            </div>
            {/* Modal for full-screen image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-[#7d4788] flex items-center justify-center z-50r"
                    onClick={handleCloseImage}>
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <img
                            src={selectedImage}
                            alt="Full screen view"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            className="absolute left-1/2 -translate-x-1/2 -bottom-10 text-white text-xl bg-red-600 bg-opacity-50 px-4 h-8 rounded-md hover:bg-red-800 cursor-pointer"
                            onClick={handleCloseImage}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default VerifyUserCard;
