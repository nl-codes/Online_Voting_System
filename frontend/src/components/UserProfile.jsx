import React, { useEffect, useState } from "react";
import ProfileDisplay from "./ProfileDisplay";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const UserProfile = ({ userId }) => {
    const [firstName, setFirstName] = useState("First Name");
    const [lastName, setLastName] = useState("Last Name");
    const [email, setEmail] = useState("email@email.com");
    const [dob, setDob] = useState("0000-00-00");
    const [photoUrl, setPhotoUrl] = useState("");
    const [gender, setGender] = useState("Gender");
    const [country, setCountry] = useState("Country Name");

    const handleDateFormat = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/user_profile/${userId}`
                );
                console.log(response);
                if (response.status === 200) {
                    const data = response.data.data;
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setEmail(data.email);
                    setDob(handleDateFormat(data.dob));
                    setPhotoUrl(data.photo_url);
                    setGender(data.gender);
                    setCountry(data.country);
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        };
        fetchUserProfile();
    }, [userId]);
    return (
        <div className="max-w-[600px] mx-auto my-8 p-8 border border-gray-300 rounded-lg shadow-md bg-gray-50 text-center flex flex-col">
            <ProfileDisplay
                image_url={photoUrl}
                sizes={{ width: 150, height: 150 }}
                alt_text={`${firstName} ${lastName}`}
                className={"mx-auto mb-4"}
            />
            <h2 className="my-4 text-gray-800 text-3xl font-bold">
                {firstName} {lastName}
            </h2>
            <div className="flex justify-around text-xl mt-4">
                <div className="labels flex flex-col gap-4 text-right text-gray-600">
                    <p>
                        <strong>Email</strong>
                    </p>
                    <p>
                        <strong>Date of Birth</strong>
                    </p>
                    <p>
                        <strong>Gender</strong>
                    </p>
                    <p>
                        <strong>Country</strong>
                    </p>
                </div>
                <div className="labels flex flex-col gap-4 text-left text-gray-600">
                    <p>{email}</p>
                    <p>{dob}</p>
                    <p>{gender}</p>
                    <p>{country}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
