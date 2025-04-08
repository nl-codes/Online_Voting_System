import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const VoteCountDoughnutchart = ({ labels, dataValues }) => {
    const defaultColors = [
        "#5AC8FA", // Sky Blue
        "#FF9500", // Soft Orange
        "#34C759", // Mint Green
        "#AF52DE", // Lavender
        "#FF2D55", // Rose Pink
        "#FFD60A", // Lemon Yellow
        "#64D2FF", // Turquoise
        "#FF3B30", // Coral Red
    ];

    const data = {
        labels,
        datasets: [
            {
                label: "Votes",
                data: dataValues,
                backgroundColor: defaultColors.slice(0, dataValues.length),
                borderColor: defaultColors
                    .slice(0, dataValues.length)
                    .map((color) => color.replace(/[^,]+(?=\))/, "0.5")),
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };
    return (
        <div style={{ width: "300px", height: "300px" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default VoteCountDoughnutchart;
