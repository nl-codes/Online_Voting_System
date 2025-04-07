import React from "react";

const VotingPopUp = ({ showPopUp, handleClosePopUp, children }) => {
    if (!showPopUp) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#ab63bb] border-2 border-white  rounded-lg p-6 w-[720px] relative min-h-fit">
                <button
                    onClick={handleClosePopUp}
                    className="absolute right-4 top-4 bg-red-800 hover:bg-red-600 text-white rounded-md w-16 h-8 flex items-center justify-center">
                    Close
                </button>
                <div className="mt-12">{children}</div>
            </div>
        </div>
    );
};

export default VotingPopUp;
