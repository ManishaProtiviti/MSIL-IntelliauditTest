import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const LineGraph = () => {
  const data = {
    labels: ["Jan", "Feb", "March", "April"],
    datasets: [
      {
        label: "Jim",
        data: [4.5, 2.5, 3.5, 4.5],
        borderColor: "#012378",
        backgroundColor: "#012378",
        tension: 0,
        pointRadius: 5,
        pointBackgroundColor: "#012378",
        fill: false,
      },
      {
        label: "Jacob",
        data: [2.2, 4.5, 1.5, 2.8],
        borderColor: "#9E9E9E",
        backgroundColor: "#9E9E9E",
        tension: 0,
        pointRadius: 5,
        pointBackgroundColor: "#9E9E9E",
        fill: false,
      },
      {
        label: "Micaela",
        data: [1.8, 1.8, 3.0, 5.2],
        borderColor: "#000000",
        backgroundColor: "#000000",
        tension: 0,
        pointRadius: 5,
        pointBackgroundColor: "#000000",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Required to control custom height
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxHeight: 8,
          boxWidth: 8,
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: { color: "#4B4B4B" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 6,
        title: {
          display: true,
          text: "% Expectation",
          color: "#4B4B4B",
        },
        ticks: { stepSize: 1, color: "#4B4B4B" },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="relative bg-white rounded-md p-4 shadow-sm w-full grid"
    >
      <h2 className="text-sm font-medium mb-2">
        Month on month trend of user wise exceptions
      </h2>
      <div className="w-full h-[200px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;
