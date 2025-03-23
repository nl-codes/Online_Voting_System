import React, { useState, useEffect } from "react";
import ProfileDisplay from "./ProfileDisplay";
import { useNavigate } from "react-router-dom";
import TimeRemaining from "./TimeRemaining";

const ElectionCard = ({
    id,
    topic,
    description,
    stop_time,
    candidate_photo_url,
}) => {
    const navigate = useNavigate();
    const [urlList, setUrlList] = useState([]);

    useEffect(() => {
        if (candidate_photo_url) {
            // Split the string and clean up any [#f6eef8]space
            const urls = candidate_photo_url
                .split(",")
                .filter((url) => url.trim());
            setUrlList(urls);
        }
    }, [candidate_photo_url]);

    const handleSeeMore = () => {
        navigate(`/election_page/${id}`);
    };

    return (
        <div className="election-card flex flex-col w-200 justify-center  bg-[#29142e] text-[#f6eef8] text-2xl p-4 m-4 rounded-xl border-[#f6eef8] border-4 shadow-lg shadow-[#f6eef8]">
            <div className="topic-button flex justify-between">
                <p className="font-bold mb-2">{topic}</p>
                <div className="text-lg mb-4">
                    <TimeRemaining stop_time={stop_time} />
                </div>
            </div>
            <div className="description text-lg">
                <p>About : </p>
                <p className="text-lg text-gray-500 mb-4">{description}</p>
            </div>
            <div className="candidates-button flex items-center justify-between">
                <div className="candidates">
                    <p className="text-lg mb-2">Candidates:</p>
                    <div className="candidate-picutres flex gap-4">
                        {urlList.length > 0 &&
                            urlList.map((photo_url, index) => (
                                <ProfileDisplay
                                    key={index}
                                    image_url={photo_url}
                                    sizes={{ width: 120, height: 120 }}
                                />
                            ))}
                    </div>
                </div>
                <div className="see-more">
                    <button
                        onClick={handleSeeMore}
                        className="text-lg text-white font-bold hover:text-[#29142e] w-30 h-10 hover:bg-white px-4 my-4 rounded-2xl">
                        See More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElectionCard;
