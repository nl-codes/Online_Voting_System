import ProfileDisplay from "./ProfileDisplay";

const CandidatePopup = ({ image_url, name, saying, isWinner = false }) => {
    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer">
            {isWinner && (
                <span className="text-3xl font-bold text-[#c791d4] drop-shadow-2xl  shadow-amber-200 bg-none">
                    Winner
                </span>
            )}

            <ProfileDisplay
                image_url={image_url}
                sizes={
                    isWinner
                        ? { width: 180, height: 180 }
                        : { width: 100, height: 100 }
                }
            />
            <span className={isWinner ? "font-bold text-3xl" : "text-xl"}>
                {name}
            </span>
        </div>
    );
};

export default CandidatePopup;
