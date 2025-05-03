import React from "react";
import BackButton from "../components/BackButton";

const UserProfilePage = () => {
    return (
        <div className="bg-[#29142e] h-screen max-w-screen py-4 px-4">
            <BackButton backPath={"/home"} />
            <h1 className="w-full text-4xl text-white font-bold text-center pt-10">
                User Profile
            </h1>
        </div>
    );
};

export default UserProfilePage;
