import { Pie } from "react-chartjs-2";
import { forwardRef, useImperativeHandle } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = forwardRef(({ data }, ref) => {
  const totalDocs = data && data.length;
  const failedDocs =
    data?.filter((item) => Object.values(item).some((value) => value === "Yes"))
      .length || 0;
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
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (sum, val) => sum + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(0);
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value} (${percentage}%)`;
        },
        color: "#fff",
        font: { weight: "bold", size: 10 },
      },
      title: {
        display: true,
        text: "Pass / Fail Split",
        align: "start",
        color: "#000",
        font: { size: 12, weight: "bold" },
      },
    },
  };

  // Expose Chart.js instance to parent
  useImperativeHandle(ref, () => ({
    getChart: () => chartRef.current,
    toBase64Image: () => chartRef.current?.toBase64Image(),
  }));

  const chartRef = React.useRef();

  return (
    <div className="bg-white rounded-xl shadow-md w-full">
      <div className="w-full h-64 p-2">
        <Pie ref={chartRef} data={pieData} options={pieOptions} />
      </div>
    </div>
  );
});

export default PieChart;
