import React from "react";
import ProfileDisplay from "./ProfileDisplay";

const CandidateCard = ({ photo_url, full_name, saying }) => {
    return (
        <div className="flex items-center">
            <ProfileDisplay
                image_url={photo_url}
                sizes={{ width: 240, height: 240 }}
            />
            <div className="full_name-saying flex flex-col ml-8 text-white font-serif gap-8">
                <p className="text-4xl font-bold">{full_name}</p>
                <p className="text-lg">{saying}</p>
            </div>
        </div>
    );
};

export default CandidateCard;
