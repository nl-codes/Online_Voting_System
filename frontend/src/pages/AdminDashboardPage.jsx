import React from "react";

const AdminDashboardPage = () => {
    return (
        <div className="bg-[#29142e] h-screen w-screen flex flex-col">
            <div className="flex justify-end p-4">
                <button className="hover:bg-[#7d4788] text-white font-bold py-2 px-4 rounded">
                    Log out
                </button>
            </div>
            <div className="flex flex-col justify-center items-center"></div>
        </div>
    );
};

export default AdminDashboardPage;
