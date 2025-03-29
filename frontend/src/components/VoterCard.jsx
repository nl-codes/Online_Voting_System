import React, { useEffect } from "react";
import ProfileDisplay from "../components/ProfileDisplay";

const VoterCard = ({ voterData }) => {
    useEffect(() => {
        console.log(voterData);
    }, [voterData]);
    1;
    return (
        <div className="w-125 flex flex-col justify-around text-center">
            <p className="text-2xl font-bold mb-4 text-white">Voter Card</p>
            <div className="px-4 py-6 bg-[#c791d4] rounded-lg ">
                <div className="flex justify-around items-center">
                    <div className="space-y-4 w-70">
                        <div className="flex justify-between">
                            <span className="text-[#512C59] font-semibold">
                                Voter ID
                            </span>
                            <span className="text-[#29142e] font-bold">
                                {voterData.voter_id}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#512C59] font-semibold">
                                Name
                            </span>
                            <span className="text-[#29142e] font-bold">
                                {voterData.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#512C59] font-semibold">
                                Phone
                            </span>
                            <span className="text-[#29142e] font-bold">
                                {voterData.phone_number}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#512C59] font-semibold">
                                Citizenship Number
                            </span>
                            <span className="text-[#29142e] font-bold">
                                {voterData.citizenship_number}
                            </span>
                        </div>
                    </div>
                    <ProfileDisplay
                        image_url={voterData.image_url}
                        sizes={{ width: 120, height: 120 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VoterCard;
