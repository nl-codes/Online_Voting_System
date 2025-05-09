import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ElectionEditForm = () => {
    const navigate = useNavigate();

    const electionId = useParams().id;

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        // Get local date and time components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        // Format as YYYY-MM-DDTHH:mm
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [formData, setFormData] = useState({
        topic: "",
        description: "",
        position: "",
        start_time: "",
        stop_time: "",
    });

    const [errors, setErrors] = useState({
        topic: "",
        description: "",
        position: "",
        start_time: "",
        stop_time: "",
    });

    useEffect(() => {
        const fetchElectionDetails = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/get_only_election_detail/${electionId}`
                );
                if (response.status === 200) {
                    if (response.data.success) {
                        const data = response.data.electionData;
                        console.log(data);
                        setFormData({
                            ...data,
                            start_time: formatDateTime(data.start_time),
                            stop_time: formatDateTime(data.stop_time),
                        });
                    }
                }
            } catch (error) {
                console.log("Error fetching Election details: ", error);
            }
        };
        fetchElectionDetails();
    }, [electionId]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.topic.trim()) {
            newErrors.topic = "Topic is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
        }

        if (!formData.start_time) {
            newErrors.start_time = "Start time is required";
        }

        if (!formData.stop_time) {
            newErrors.stop_time = "Stop time is required";
        } else if (
            new Date(formData.stop_time) <= new Date(formData.start_time)
        ) {
            newErrors.stop_time = "Stop time must be after start time";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.put(
                `${API_BASE_URL}/edit_election/${electionId}`,
                formData
            );
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                    background: "#512C59",
                    color: "#ffffff",
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                        navigate("/sec/admin/view/election");
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                    background: "#512C59",
                    color: "#ffffff",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                iconColor: "#FF0000",
                title: "Server Error",
                text: "Can't update Election at this moment",
                background: "#512C59",
                color: "#ffffff",
            });
        }
    };

    return (
        <div className="form max-w-md mx-auto p-6 bg-[#512C59] rounded-lg shadow-xl">
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Topic <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="text"
                    name="topic"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    placeholder="Enter election topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                />
                {errors.topic && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.topic}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Description <span className="text-yellow-400">*</span>
                </label>
                <textarea
                    name="description"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    placeholder="Enter election description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                />
                {errors.description && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.description}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Position <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="text"
                    name="position"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    placeholder="Enter position title"
                    value={formData.position}
                    onChange={handleInputChange}
                />
                {errors.position && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.position}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Start Time <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="datetime-local"
                    name="start_time"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    value={formData.start_time}
                    onChange={handleInputChange}
                />
                {errors.start_time && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.start_time}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Stop Time <span className="text-yellow-400">*</span>
                </label>
                <input
                    type="datetime-local"
                    name="stop_time"
                    required
                    className="w-full px-3 py-2 bg-white text-[#29142e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c791d4]"
                    value={formData.stop_time}
                    onChange={handleInputChange}
                />
                {errors.stop_time && (
                    <p className="mt-2 text-yellow-400 text-sm">
                        {errors.stop_time}
                    </p>
                )}
            </div>

            <button
                className="w-full bg-[#c791d4] text-white py-2 px-4 rounded-md hover:bg-[#a764b8] transition-colors duration-300"
                onClick={handleEdit}>
                Update Election
            </button>
        </div>
    );
};

export default ElectionEditForm;