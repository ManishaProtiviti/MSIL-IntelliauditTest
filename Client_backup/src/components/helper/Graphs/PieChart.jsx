import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import BarChart from "./BarChart";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

const PieChart = ({ data }) => {
  const totalDocs = data && data.length;
  const failedDocs =
    data?.filter((item) => Object.values(item).some((value) => value === "Yes"))
      .length || 0;
  const passedDocs = totalDocs - failedDocs;

  let oneYesCount = 0;
  let twoYesCount = 0;
  let threeOrMoreYesCount = 0;

  data?.forEach((obj) => {
    const yesCount = Object.values(obj).filter((val) => val === "Yes").length;
    if (yesCount === 1) {
      oneYesCount++;
    } else if (yesCount === 2) {
      twoYesCount++;
    } else if (yesCount >= 3) {
      threeOrMoreYesCount++;
    }
  });

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
        display: true,
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

  return (
    <div className="bg-white rounded-xl shadow-md w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">
        {/* Chart Wrapper for responsiveness */}
        <div className="w-full h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>

        {/* Right-side Bar (optional) */}
        {/* <div className="w-full md:w-1/4 flex items-center justify-center h-32">
          <BarChart
            value1={oneYesCount}
            value2={twoYesCount}
            value3={threeOrMoreYesCount}
          />
        </div> */}
      </div>
    </div>
  );
};

export default PieChart;
