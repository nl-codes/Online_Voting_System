import React, { useEffect, useState } from "react";
import ProfileDisplay from "./ProfileDisplay";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const UserProfileForm = ({ userId, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        first_name: "First Name",
        last_name: "Last Name",
        email: "email@email.com",
        dob: "",
        photo_url: "",
        gender: "",
        country: "Country Name",
        user_id: userId,
    });

    // Format Date to YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/user_profile/${userId}`
                );
                if (response.status === 200) {
                    const data = response.data.data;
                    setFormData((prev) => ({
                        ...prev,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        dob: formatDate(data.dob),
                        photo_url: data.photo_url,
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile data: ", error);
            }
        };
        fetchProfileData();
    }, [userId]);

    const [preview, setPreview] = useState(null);

    // Only keep errors for editable fields
    const [errors, setErrors] = useState({
        photo_url: "",
        gender: "",
        country: "",
    });

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        return file && validTypes.includes(file.type);
    };

    // Handle input changes only for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validation logic only for editable fields
        let error = "";
        if (name === "country" && !value.trim()) {
            error = "Country is required";
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateImage(file)) {
            setErrors((prev) => ({
                ...prev,
                photo_url: "Please upload only JPG, JPEG or PNG files",
            }));
            e.target.value = "";
            return;
        }

        setFormData((prev) => ({
            ...prev,
            photo_url: file,
        }));
        setPreview(URL.createObjectURL(file));
        setErrors((prev) => ({
            ...prev,
            photo_url: "",
        }));
    };

    // Simplified form validation for editable fields only
    const validateForm = () => {
        const newErrors = {};

        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }
        if (!formData.country.trim()) {
            newErrors.country = "Country is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateUserProfile = async (formData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/user_profile_update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Error updating user profile: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();
        // Only send editable fields
        formDataToSend.append("photo_url", formData.photo_url);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("userId", userId);

        try {
            const isUpdated = await updateUserProfile(formDataToSend);
            if (!isUpdated) {
                Swal.fire({
                    title: "Error!",
                    icon: "error",
                    text: "Failed to update profile. Please try again later.",
                    iconColor: "red",
                    color: "white",
                    background: "#29142e",
                });
                return;
            }
            // Show success message
            Swal.fire({
                title: "Update Successfull",
                text: "Your profile has been updated successfully.",
                allowOutsideClick: false,
                icon: "success",
                iconColor: "lightgreen",
                color: "white",
                background: "#29142e",
            }).then(() => {
                if (Swal.isConfirmed || Swal.isDismissed) {
                    onSubmitSuccess();
                }
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                icon: "error",
                text: "Failed to update profile. Please try again later.",
                iconColor: "red",
                color: "white",
                background: "#29142e",
            });
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="form h-fit max-w-md mx-auto p-6 bg-[#512C59] rounded-lg shadow-xl text-white">
            {/* Profile Picture Section */}
            <div className="mb-6">
                <div className="flex flex-col items-center">
                    <ProfileDisplay
                        image_url={preview || formData.photo_url}
                        sizes={{ width: 150, height: 150 }}
                        alt_text="Profile Preview"
                        className="rounded-full mb-4"
                    />
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="mx-auto text-sm text-gray-300 file:mr-8 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c791d4] file:text-white hover:file:bg-[#a764b8]"
                        onChange={handleImageChange}
                    />
                    {errors.photo_url && (
                        <p className="mt-2 text-yellow-400 text-sm">
                            {errors.photo_url}
                        </p>
                    )}
                </div>
            </div>

            {/* Read-only Fields */}
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    First Name
                </label>
                <input
                    type="text"
                    value={formData.first_name}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Last Name
                </label>
                <input
                    type="text"
                    value={formData.last_name}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Date of Birth
                </label>
                <input
                    type="date"
                    value={formData.dob}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
                />
            </div>

            {/* Editable Fields */}
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Gender <span className="text-yellow-400">*</span>
                </label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.gender}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Country <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                />
                {errors.country && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.country}
                    </p>
                )}
            </div>

            <button
                className="w-full bg-[#c791d4] text-white font-bold py-2 px-4 rounded-md hover:bg-[#a764b8] transition-colors duration-300"
                onClick={handleSubmit}>
                Update Profile
            </button>
        </div>
    );
};

export default UserProfileForm;
