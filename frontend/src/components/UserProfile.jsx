import React from "react";
import ProfileDisplay from "./ProfileDisplay";

const UserProfile = ({ userId }) => {
    const dummyData = {
        first_name: "Uzumaki",
        last_name: "Naruto",
        email: "uzumaki@naruto.com",
        dob: "2000-01-01",
        photo_url:
            "https://res.cloudinary.com/duhbs7hqv/image/upload/v1746112439/userProfile_images/naruto.jpg",
        gender: "Male",
        country: "Naruto",
    };

    return (
        <div className="max-w-[600px] mx-auto my-8 p-8 border border-gray-300 rounded-lg shadow-md bg-gray-50 text-center flex flex-col">
            <ProfileDisplay
                image_url={dummyData.photo_url}
                sizes={{ width: 150, height: 150 }}
                alt_text={`${dummyData.first_name} ${dummyData.last_name}`}
                className={"mx-auto mb-4"}
            />
            <h2 className="mb-4 text-gray-800 text-3xl font-bold">
                {dummyData.first_name} {dummyData.last_name}
            </h2>
            <div className="flex justify-around text-xl">
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
                    <p>{dummyData.email}</p>
                    <p>{dummyData.dob}</p>
                    <p>{dummyData.gender}</p>
                    <p>{dummyData.country}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
