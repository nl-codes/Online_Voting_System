import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminArchivedElectionsPage = () => {
    return (
        <div className="bg-[#29142e] min-h-screen max-w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold">
                    Archived Elections List
                </p>
                <div></div>
            </div>
        </div>
    );
};

export default AdminArchivedElectionsPage;
