import React, { useContext } from "react";
import BackButton from "../components/BackButton";
import { UserContext } from "../context/UserContext";
import UserProfileForm from "../components/UserProfileForm";

const UserProfileEditPage = () => {
    const { userId } = useContext(UserContext);
    return (
        <div className="bg-[#29142e] h-screen max-w-screen py-4 px-4">
            <div className="flex justify-between items-center ">
                <BackButton backPath={"/profile"} />
            </div>
            <h1 className="w-full text-4xl text-white font-bold text-center pt-10">
                Edit Your Profile
            </h1>
            <UserProfileForm userId={userId} />
        </div>
    );
};

export default UserProfileEditPage;
