import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import VerifyUserCard from "../components/VerifyUserCard";

const AdminVerifyVoterPage = () => {
    const dummyUserData = {
        full_name: "Kurosaki Ichigo",
        dob: "2005-11-25",
        citizenship_number: "123456789",
        phone_number: "9845612347",
        citizenship_front_pic:
            "https://res.cloudinary.com/duhbs7hqv/image/upload/v1743821397/citizenship_images/gzxjm3kh5at4f93iffzu.png",
        citizenship_back_pic:
            "https://res.cloudinary.com/duhbs7hqv/image/upload/v1743821397/citizenship_images/gzxjm3kh5at4f93iffzu.png",
    };
    return (
        <div className="bg-[#29142e] h-screen w-screen flex pr-8">
            <AdminSidebar />
            <div className="flex flex-col p-4 w-full">
                <div className="flex justify-end">
                    <button className="hover:bg-[#7d4788] text-white text-2xl font-bold py-2 px-4 rounded">
                        Log out
                    </button>
                </div>
                <div className="flex flex-col justify-center  text-white main-page-content">
                    <p className="text-center">Verify User Details</p>
                    <div>
                        <p>Remaining User Verifications : {1}</p>
                        <VerifyUserCard userData={dummyUserData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVerifyVoterPage;
