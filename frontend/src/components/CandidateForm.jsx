import React, { useState } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import Swal from "sweetalert2";

const CandidateForm = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        saying: "",
        photo: null,
    });
    const [previews, setPreviews] = useState({
        photo: null,
    });

    const [errors, setErrors] = useState({
        full_name: "",
        saying: "",
        photo: "",
    });

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        return file && validTypes.includes(file.type);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // Update the handleImageChange function
    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateImage(file)) {
            setErrors((prev) => ({
                ...prev,
                [type]: "Please upload only JPG, JPEG or PNG files",
            }));
            e.target.value = "";
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [type]: file,
        }));
        setPreviews((prev) => ({
            ...prev,
            [type]: URL.createObjectURL(file),
        }));
        setErrors((prev) => ({
            ...prev,
            [type]: "",
        }));
    };

    // Update the form validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full Name is required";
        }

        if (!formData.saying.trim()) {
            newErrors.saying = "Candidate's Saying is required";
        }

        // Image validations
        if (!formData.photo) {
            newErrors.photo = "Candidate's photo is required";
        } else if (!validateImage(formData.photo)) {
            newErrors.photo = "Please upload only JPG, JPEG or PNG files";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("full_name", formData.full_name);
        formDataToSend.append("saying", formData.saying);
        formDataToSend.append("photo_url", formData.photo);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/candidate_register`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unknown error occured while submitting the form",
            });
        }
    };
    return (
        <div className="form max-w-md mx-auto p-6 bg-[#512C59] rounded-lg shadow-xl">
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    placeholder="Enter full name of the Candidate"
                    value={formData.full_name}
                    onChange={handleInputChange}
                />
                {errors.full_name && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.full_name}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Saying <span className="text-yellow-400">*</span>
                </label>
                <div className="flex">
                    <input
                        type="text"
                        name="saying"
                        required
                        className="w-full px-3 py-2 bg-white text-[#29142e] rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                        placeholder="what the candidate have to say"
                        value={formData.saying}
                        onChange={handleInputChange}
                    />
                </div>
                {errors.saying && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.saying}
                    </p>
                )}
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Candidate Photo
                    <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="file"
                    name="photo"
                    required
                    accept=".jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c791d4] file:text-white hover:file:bg-[#a764b8]"
                    onChange={(e) => handleImageChange(e, "photo")}
                />
                {errors.photo && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.photo}
                    </p>
                )}
                {previews.photo && (
                    <div className="mt-2">
                        <img
                            src={previews.photo}
                            alt="Candidate photo preview"
                            className="max-w-xs rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>

            <button
                className="w-full bg-[#c791d4] text-white py-2 px-4 rounded-md hover:bg-[#a764b8] transition-colors duration-300"
                onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
};

export default CandidateForm;