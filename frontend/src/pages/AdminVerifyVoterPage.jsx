import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import VerifyUserCard from "../components/VerifyUserCard";

const AdminVerifyVoterPage = () => {
    return (
        <div className="bg-[#29142e] h-screen w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col p-4 w-full">
                <div className="flex justify-end">
                    <button className="hover:bg-[#7d4788] text-white text-2xl font-bold py-2 px-4 rounded">
                        Log out
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center text-white main-page-content">
                    <p className="">Verify User Details</p>
                    <div>
                        <VerifyUserCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVerifyVoterPage;
