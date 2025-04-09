import React, { useState } from "react";
import { API_BASE_URL } from "../config/api";

const VoterForm = ({ userId, status, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        citizenship_number: "",
        phone_number: "",
        citizenship_front_pic: null,
        citizenship_back_pic: null,
        user_id: userId,
    });
    const [previews, setPreviews] = useState({
        front: null,
        back: null,
    });

    const [errors, setErrors] = useState({
        citizenship_number: "",
        phone_number: "",
        citizenship_front_pic: "",
        citizenship_back_pic: "",
    });

    // Add these validation functions after your useState declarations
    const validateCitizenshipNumber = (value) => {
        return /^[0-9-]+$/.test(value);
    };

    const validatePhoneNumber = (value) => {
        return (
            /^[0-9]+$/.test(value) &&
            value.startsWith("98") &&
            value.length === 10
        );
    };

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        return file && validTypes.includes(file.type);
    };

    // Update handleCitizenshipChange
    const handleCitizenshipChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            citizenship_number: value,
        }));

        if (!value) {
            setErrors((prev) => ({
                ...prev,
                citizenship_number: "Citizenship number is required",
            }));
        } else if (!validateCitizenshipNumber(value)) {
            setErrors((prev) => ({
                ...prev,
                citizenship_number: "Only numbers and hyphens are allowed",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                citizenship_number: "",
            }));
        }
    };

    // Update handlePhoneChange
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                phone_number: value,
            }));

            if (!value) {
                setErrors((prev) => ({
                    ...prev,
                    phone_number: "Phone number is required",
                }));
            } else if (!validatePhoneNumber(value)) {
                setErrors((prev) => ({
                    ...prev,
                    phone_number: "Must start with 98 and be 10 digits",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    phone_number: "",
                }));
            }
        }
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
            [type === "citizenship_front_pic" ? "front" : "back"]:
                URL.createObjectURL(file),
        }));
        setErrors((prev) => ({
            ...prev,
            [type]: "",
        }));
    };

    // Update the form validation function
    const validateForm = () => {
        const newErrors = {};

        // Citizenship number validation
        if (!formData.citizenship_number.trim()) {
            newErrors.citizenship_number = "Citizenship number is required";
        } else if (!validateCitizenshipNumber(formData.citizenship_number)) {
            newErrors.citizenship_number =
                "Only numbers and hyphens are allowed";
        }

        // Phone number validation
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required";
        } else if (!validatePhoneNumber(formData.phone_number)) {
            newErrors.phone_number = "Must start with 98 and be 10 digits";
        }

        // Image validations
        if (!formData.citizenship_front_pic) {
            newErrors.citizenship_front_pic =
                "Front citizenship photo is required";
        } else if (!validateImage(formData.citizenship_front_pic)) {
            newErrors.citizenship_front_pic =
                "Please upload only JPG, JPEG or PNG files";
        }

        if (!formData.citizenship_back_pic) {
            newErrors.citizenship_back_pic =
                "Back citizenship photo is required";
        } else if (!validateImage(formData.citizenship_back_pic)) {
            newErrors.citizenship_back_pic =
                "Please upload only JPG, JPEG or PNG files";
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
        formDataToSend.append(
            "citizenship_number",
            formData.citizenship_number
        );
        formDataToSend.append("phone_number", formData.phone_number);
        formDataToSend.append(
            "citizenship_front_pic",
            formData.citizenship_front_pic
        );
        formDataToSend.append(
            "citizenship_back_pic",
            formData.citizenship_back_pic
        );
        formDataToSend.append("user_id", formData.user_id);

        try {
            let response;
            if (status.toLowerCase() === "unapplied") {
                response = await fetch(`${API_BASE_URL}/voter_card_register`, {
                    method: "POST",
                    body: formDataToSend,
                });
            } else if (status.toLowerCase() === "rejected") {
                response = await fetch(`${API_BASE_URL}/voter_card_register`, {
                    method: "PUT",
                    body: formDataToSend,
                });
            }

            if (response && response.ok) {
                const data = await response.json();
                console.log(data);
                alert("Voter card registration successful!");
                onSubmitSuccess(); // Callback to parent to refresh status
            } else {
                const errorData = await response.json();
                alert("Failed to register voter card: " + errorData.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    };
    return (
        <div className="form max-w-md mx-auto p-6 bg-[#512C59] rounded-lg shadow-xl">
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Citizenship Number{" "}
                    <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    placeholder="Enter numbers and hyphens only"
                    value={formData.citizenship_number}
                    onChange={handleCitizenshipChange}
                />
                {errors.citizenship_number && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.citizenship_number}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Phone Number <span className="text-yellow-400">*</span>
                </label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 bg-gray-200 text-[#29142e] rounded-l-md">
                        +977
                    </span>
                    <input
                        type="tel"
                        required
                        className="w-full px-3 py-2 bg-white text-[#29142e] rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                        placeholder="98XXXXXXXX"
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        maxLength="10"
                    />
                </div>
                {errors.phone_number && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.phone_number}
                    </p>
                )}
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Citizenship Front Photo
                    <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="file"
                    required
                    accept=".jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c791d4] file:text-white hover:file:bg-[#a764b8]"
                    onChange={(e) =>
                        handleImageChange(e, "citizenship_front_pic")
                    }
                />
                {errors.citizenship_front_pic && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.citizenship_front_pic}
                    </p>
                )}
                {previews.front && (
                    <div className="mt-2">
                        <img
                            src={previews.front}
                            alt="Front citizenship preview"
                            className="max-w-xs rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Citizenship Back Photo{" "}
                    <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="file"
                    required
                    accept=".jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c791d4] file:text-white hover:file:bg-[#a764b8]"
                    onChange={(e) =>
                        handleImageChange(e, "citizenship_back_pic")
                    }
                />
                {errors.citizenship_back_pic && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.citizenship_back_pic}
                    </p>
                )}
                {previews.back && (
                    <div className="mt-2">
                        <img
                            src={previews.back}
                            alt="Back citizenship preview"
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

export default VoterForm;
