import React from "react";
import ProfileDisplay from "./ProfileDisplay";

const CandidateCard = ({ photo_url, full_name, saying }) => {
    return (
        <div className="flex items-center">
            <ProfileDisplay
                image_url={photo_url}
                sizes={{ width: 100, height: 100 }}
            />
            <div className="full_name-saying flex flex-col ml-8 text-white font-serif gap-2">
                <p className="text-3xl font-bold text-[#c791d4]">{full_name}</p>
                <p className="text-md w-100">{saying}</p>
            </div>
        </div>
    );
};

export default CandidateCard;
