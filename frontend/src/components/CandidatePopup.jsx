import Swal from "sweetalert2";
import ProfileDisplay from "./ProfileDisplay";

const CandidatePopup = ({
    image_url,
    name,
    saying,
    votes_received,
    isWinner = false,
    winnerVotes,
}) => {
    const handleClick = () => {
        Swal.fire({
            html: `
                <div class="flex flex-col items-center gap-4">
                ${
                    isWinner
                        ? '<div class="text-[#c791d4] text-2xl font-bold mt-2">Winner!</div>'
                        : ""
                }
                    <img src="${image_url}" 
                        alt="${name}" 
                        class="w-48 h-48 rounded-full object-cover"
                    />
                    <h2 class="text-2xl font-bold">${name}</h2>
                    <p class="text-lg italic">"${saying}"</p>
                    <p class="text-xl font-semibold">
                        Votes: ${isWinner ? winnerVotes : votes_received}
                    </p>
                    
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            background: "#29142e",
            color: "#ffffff",
            customClass: {
                popup: "rounded-3xl border-4 border-[#c791d4]",
            },
        });
    };
    return (
        <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={handleClick}>
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
