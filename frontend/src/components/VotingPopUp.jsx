import React from "react";

const VotingPopUp = ({ trigger, handleClosePopUp, children }) => {
    if (!trigger) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#ab63bb] border-2 border-white  rounded-lg p-6 w-[640px] relative">
                <button
                    onClick={handleClosePopUp}
                    className="absolute right-4 top-4 bg-red-600 hover:bg-red-800 text-white rounded-md w-16 h-8 flex items-center justify-center">
                    Close
                </button>
                <div className="mt-12">{children}</div>
            </div>
        </div>
    );
};

export default VotingPopUp;
