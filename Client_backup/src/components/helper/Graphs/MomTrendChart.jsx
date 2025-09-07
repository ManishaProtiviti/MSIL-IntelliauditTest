import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MomTrendChart = ({ dataLabels, passData, failData }) => {
  const data = {
    labels: dataLabels,
    datasets: [
      {
        label: "Total",
        data: passData,
        backgroundColor: "#1FC98E",
        stack: "claims",
        borderRadius: 4,
        barThickness: 24,
      },
      {
        label: "Fail",
        data: failData,
        backgroundColor: "#EA4335",
        stack: "claims",
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow manual height
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
          color: "#000",
        },
      },
      datalabels: {
        color: "#fff",
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#000",
        },
      },
      y: {
        stacked: true,
        min: 93,
        max: 100,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return `${value}%`;
          },
          color: "#000",
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md w-full h-84">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        MoM trend of claims submitted to Pass / Fail
      </h2>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MomTrendChart;
