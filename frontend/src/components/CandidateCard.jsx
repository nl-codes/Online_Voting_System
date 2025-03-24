import React from "react";
import ProfileDisplay from "./ProfileDisplay";

const CandidateCard = ({ photo_url, full_name, saying }) => {
    return (
        <div className="flex items-center">
            <ProfileDisplay
                image_url={photo_url}
                sizes={{ width: 160, height: 160 }}
            />
            <div className="full_name-saying flex flex-col ml-8 text-white font-serif gap-8">
                <p className="text-4xl font-bold text-[#c791d4]">{full_name}</p>
                <p className="text-lg">{saying}</p>
            </div>
        </div>
    );
};

export default CandidateCard;
