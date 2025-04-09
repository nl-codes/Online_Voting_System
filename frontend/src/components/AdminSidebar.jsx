import React from "react";
import AdminSidebarLinks from "./AdminSidebarLinks";

const AdminSidebar = () => {
    return (
        <div className="bg-white rounded-2xl w-70 flex flex-col items-center py-20 gap-6">
            <AdminSidebarLinks
                btnName={"DASHBOARD"}
                navigationLink={"/sec/admin/dashboard"}
            />
            <AdminSidebarLinks
                btnName={"View Election"}
                navigationLink={"/sec/admin/view/election"}
            />
            <AdminSidebarLinks
                btnName={"Create Election"}
                navigationLink={"/sec/admin/create/election"}
            />
            <AdminSidebarLinks
                btnName={"View Candidate"}
                navigationLink={"/sec/admin/view/candidate"}
            />
            <AdminSidebarLinks
                btnName={"Create Candidate"}
                navigationLink={"/sec/admin/create/candidate"}
            />
            <AdminSidebarLinks
                btnName={"Assign Candidate"}
                navigationLink={"/sec/admin/assign/candidate"}
            />
            <AdminSidebarLinks
                btnName={"Verify Voter Card"}
                navigationLink={"/sec/admin/verify/voter"}
            />
        </div>
    );
};

export default AdminSidebar;
