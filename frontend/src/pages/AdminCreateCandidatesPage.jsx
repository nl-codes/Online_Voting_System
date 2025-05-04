import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import CandidateForm from "../components/CandidateForm";

const AdminCreateCandidatePage = () => {
    return (
        <div className="bg-[#29142e] min-h-screen min-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    Create New Candidates
                </p>
                <div>
                    <CandidateForm />
                </div>
            </div>
        </div>
    );
};

export default AdminCreateCandidatePage;