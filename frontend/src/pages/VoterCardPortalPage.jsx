import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { UNSAFE_decodeViaTurboStream, useNavigate } from "react-router-dom";
import VoterForm from "../components/VoterForm";
import VoterCard from "../components/VoterCard";
import LoadingDots from "../components/LoadingDots";

const VoterCardPortalPage = () => {
    const { userId } = useContext(UserContext);
    const navigate = useNavigate();
    const [voterStatus, setVoterStatus] = useState({
        isRegistered: false,
        voterId: null,
        status: "unapplied",
        voterData: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     const checkVoterStatus = async () => {
    //         try {
    //             const response = await fetch(
    //                 "http://localhost:5000/voter_id_retrieve",
    //                 {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({ user_id: userId }),
    //                 }
    //             );

    //             const data = await response.json();

    //             if (data.success) {
    //                 setVoterStatus({
    //                     isRegistered: true,
    //                     voterId: data.voter_id,
    //                     status: data.status,
    //                     voterData: data,
    //                 });
    //             } else {
    //                 setVoterStatus({
    //                     isRegistered: false,
    //                     voterId: null,
    //                     status: data.status || "unapplied",
    //                     voterData: null,
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Error checking voter status:", error);
    //             alert("Error checking voter status");
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     if (userId) {
    //         checkVoterStatus();
    //     }
    // }, [userId]);

    // Using dummy data for testing
    useEffect(() => {
        setVoterStatus({
            isRegistered: true,
            voterId: 123456,
            status: "verified",
            voterData: {
                voter_id: 123456,
                name: "Kuchiki Rukia",
                phone_number: 12234567,
                citizenship_number: "123456--45",
            },
        });
    }, []);

    const voterData = {
        voter_id: 123456,
        name: "Kuchiki Rukia",
        phone_number: 12234567,
        citizenship_number: "123456--45",
        image_url: "Aello",
    };

    const handleBack = () => navigate("/home");

    return (
        <div className="bg-[#29142e] min-h-screen min-w-screen text-white">
            <p
                onClick={handleBack}
                className="back cursor-pointer py-4 px-8 text-white font-bold text-xl hover:underline w-fit">
                Back
            </p>
            <div className="flex flex-col items-center justify-center">
                <div className="header-voter-status flex flex-col w-screen">
                    <p className="py-2 pb-4 text-4xl font-bold text-center">
                        VOTER PORTAL
                    </p>
                    <div className="items-start w-fit justify-start mb-8 p-4 bg-[#512C59] rounded-lg ml-8">
                        <div className="flex gap-10 mb-4 ">
                            <span>Voter ID :</span>
                            <span>
                                {voterStatus.voterId || "Not registered"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status :</span>
                            <span
                                className={`font-bold ${
                                    voterStatus.status === "verified"
                                        ? "text-green-400"
                                        : voterStatus.status === "pending"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                }`}>
                                {voterStatus.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingDots />
                ) : (
                    <div className="flex flex-col items-center justify-center w-screen">
                        <VoterCard voterData={voterData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoterCardPortalPage;

/* {voterStatus.isRegistered ? ( */
//     <VoterCard voterData={voterStatus.voterData} />
// ) : (
//     <VoterForm
//         userId={userId}
//         onSubmitSuccess={() => window.location.reload()}
//     />
// )}
