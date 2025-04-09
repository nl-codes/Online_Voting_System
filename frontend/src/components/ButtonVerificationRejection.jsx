import React from "react";

const ButtonVerificationRejection = ({ handleVerify, handleReject }) => {
    return (
        <div className="flex flex-col gap-4">
            <button
                className="font-bold bg-green-600 px-4 py-2 rounded-lg cursor-pointer"
                onClick={handleVerify}>
                VERIFY
            </button>
            <button
                className="font-bold bg-red-600 px-4 py-2 rounded-lg cursor-pointer"
                onClick={handleReject}>
                REJECT
            </button>
        </div>
    );
};

export default ButtonVerificationRejection;
