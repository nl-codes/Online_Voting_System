import React from 'react'
import ballot from "../assets/ballot.png";

const Overview = () => {
    return (
        <div className="w-[400px] h-[400px] p-4 bg-[#c791d4] text-[#512C59] font-poppins rounded-xl shadow-xl flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-[#564181] mb-4">Online Voting System</h1>
            <p className="text-center text-lg text-[#512C59] mb-6">
                Create polls with ease and ensure fairness with our system
            </p>
            <img
                src={`${ballot}`}
                alt="Online Voting System"
                className="w-[80%] h-auto object-contain rounded-xl"
            />
        </div>
    )
}

export default Overview