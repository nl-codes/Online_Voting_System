import React, { useState } from "react";

const VerifyUserCard = ({ userData }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle image click
    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    // Handle closing the modal
    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className="border-4 border-[#7d4788] rounded-2xl px-4 py-2">
                <div className="user-details text-lg">
                    <div className="flex gap-20">
                        UserName :{" "}
                        <span className="font-bold">{userData.full_name}</span>
                    </div>
                    <div className="flex gap-32">
                        DOB : <span className="font-bold">{userData.dob}</span>
                    </div>
                    <div className="flex gap-2">
                        Citizenship-number :{" "}
                        <span className="font-bold">
                            {userData.citizenship_number}
                        </span>
                    </div>
                </div>
                <div className="photos flex gap-10 my-4">
                    <img
                        className="border-white border-2 rounded-lg"
                        src={userData.citizenship_front_pic}
                        alt="citizenship_front_pic"
                        onClick={() =>
                            handleImageClick(userData.citizenship_front_pic)
                        }
                        width={"200px"}
                    />
                    <img
                        className="border-white border-2 rounded-lg"
                        src={userData.citizenship_back_pic}
                        alt="citizenship_back_pic"
                        onClick={() =>
                            handleImageClick(userData.citizenship_back_pic)
                        }
                        width={"200px"}
                    />
                </div>
                <span className="text-[12px]">Click to zoom</span>
            </div>
            {/* Modal for full-screen image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-[#7d4788] flex items-center justify-center z-50r"
                    onClick={handleCloseImage}>
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <img
                            src={selectedImage}
                            alt="Full screen view"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            className="absolute left-1/2 -translate-x-1/2 -bottom-10 text-white text-xl bg-red-600 bg-opacity-50 px-4 h-8 rounded-md hover:bg-red-800 cursor-pointer"
                            onClick={handleCloseImage}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default VerifyUserCard;
