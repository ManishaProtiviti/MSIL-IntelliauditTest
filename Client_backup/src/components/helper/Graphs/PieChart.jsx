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
      legend: { display: true, position: "right" },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((s, v) => s + v, 0);
          const pct = total ? Math.round((value / total) * 100) : 0;
          return `${value} (${pct}%)`;
        },
        color: "#fff",
        font: { weight: "bold", size: 10 },
      },
      title: { display: true, text: "Pass / Fail Split", align: "start" },
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
    <div className="bg-white rounded-xl shadow-md w-full">
      <div className="w-full h-64 p-2">
        <Pie ref={chartRef} data={pieData} options={pieOptions} />
      </div>
    </div>
  );
});

export default PieChart;
