import React, { useContext } from "react";
import BackButton from "../components/BackButton";
import { UserContext } from "../context/UserContext";
import UserProfile from "../components/UserProfile";
import EditButton from "../components/EditButton";

const UserProfilePage = () => {
    const { userId } = useContext(UserContext);
    return (
        <div className="bg-[#29142e] h-screen max-w-screen py-4 px-4">
            <div className="flex justify-between items-center ">
                <BackButton backPath={"/home"} />
                <EditButton editPath={"/profile/edit"} />
            </div>
            <h1 className="w-full text-4xl text-white font-bold text-center pt-10">
                User Profile
            </h1>
            <UserProfile userId={userId} />
        </div>
    );
};

export default UserProfilePage;
