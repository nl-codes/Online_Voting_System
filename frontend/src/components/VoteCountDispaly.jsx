import React from "react";
import VoteCountDoughnutchart from "./VoteCountDoughnutchart";

const VoteCountDispaly = ({ data }) => {
    // Combine the two arrays into an array of objects
    const combinedData = data.names.map((name, index) => ({
        names: name,
        votes: data.votes[index],
    }));
    const totalVotes = data.votes.reduce(
        (acc, vote) => acc + parseInt(vote, 10),
        0
    );

    return (
        <div className="w-120 border-4 border-[#c791d4] rounded-lg flex flex-col p-4">
            <span className="text-2xl text-white text-center font-serif font-bold mb-4">
                Votes Received
            </span>
            <span className="text-right text-white text-xl">
                Total Votes : <span className="font-bold"> {totalVotes}</span>
            </span>
            {combinedData.map((item, index) => (
                <div key={index} className="flex gap-4 my-2">
                    <span className="text-xl text-[#c791d4] font-serif font-bold">
                        {item.names}:
                    </span>
                    <span className="text-xl text-white font-serif font-bold">
                        {item.votes}
                    </span>
                </div>
            ))}
            <div className="flex justify-center">
                <VoteCountDoughnutchart
                    labels={data.names}
                    dataValues={data.votes}
                />
            </div>
        </div>
    );
};

export default VoteCountDispaly;
