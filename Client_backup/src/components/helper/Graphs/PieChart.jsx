import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = forwardRef(({ data }, ref) => {
  const chartRef = useRef();

  const totalDocs = data?.length || 0;
  const failedDocs =
    data?.filter((item) =>
      Object.values(item).some((value) => value === "Yes")
    )?.length || 0;
  const passedDocs = totalDocs - failedDocs;

  const pieData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [passedDocs, failedDocs],
        backgroundColor: ["#3CD188", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

 const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true, // ✅ makes legend marker circular
          pointStyle: "circle", // ✅ circle instead of square
          boxWidth: 10,
          padding: 12,
          font: {
            family: "'Roboto', sans-serif",
            size: 11,
            weight: "bold",
          },
          color: "#000",
        },
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (sum, val) => sum + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(0);
          const label = context.chart.data.labels[context.dataIndex];
          return value === 1 ? `${label}: ${value} file (${percentage}%)`: `${label}: ${value} files (${percentage}%)`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 10,
          family: "'Inter', sans-serif",
        },
      },
      title: {
        display: false,
        text: "Pass / Fail Split",
        align: "start",
        color: "#000",
        font: {
          size: 12,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 8,
      },
    },
  };

  // expose toBase64Image() to parent
  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      try {
        // chartRef.current is Chart.js instance provided by react-chartjs-2
        return chartRef.current?.toBase64Image?.() || null;
      } catch (e) {
        // fallback later (canvas read) will be used by parent
        return null;
      }
    },
    getChartInstance: () => chartRef.current || null,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md gap-2 ">
      <h2 className="text-xs font-bold text-[#000] py-2 pl-2">Pass / Fail Split</h2>
      <div className="w-full h-48 p-2">
        <Pie ref={chartRef} data={pieData} options={pieOptions} />
      </div>  
    </div>
  );
});

export default PieChart;
