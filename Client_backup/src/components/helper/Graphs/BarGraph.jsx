import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartDataLabels);

const BarGraph = forwardRef(({ data }, ref) => {
  const [failureCountObj, setFailureCountObj] = useState({});
  const chartRef = useRef();

  useEffect(() => {
    const yesCount = {};
    data?.forEach((obj) => {
      Object.keys(obj || {}).forEach((key) => {
        if (obj[key] === "Yes") yesCount[key] = (yesCount[key] || 0) + 1;
        else yesCount[key] = yesCount[key] || 0;
      });
    });
    setFailureCountObj(yesCount);
  }, [data]);

  const checkFailureData = {
    labels: ["De-Duplication", "PDF Edit", "Copy Move", "Metadata", "QR Code", "Image Edit"],
    datasets: [
      {
        label: "Failed Files",
        data: [
          failureCountObj.Duplicate_Exception_Flag || 0,
          failureCountObj.PDF_Edit_Exception_Flag || 0,
          failureCountObj.Copy_Move_Exception_Flag || 0,
          failureCountObj.MetaData_Exception_Flag || 0,
          failureCountObj.QR_Code_Exception_Flag || 0,
          failureCountObj.Image_Edit_Exception_Flag || 0,
        ],
        backgroundColor: "#012378",
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };

  const checkFailureOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: { display: true, anchor: "center", align: "center", color: "#fff", font: { weight: "bold", size: 10 } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
      x: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 }, grid: { display: false } },
    },
  };

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      try {
        return chartRef.current?.toBase64Image?.() || null;
      } catch (e) {
        return null;
      }
    },
    getChartInstance: () => chartRef.current || null,
  }));

  return (
    <div className="bg-white rounded-md shadow-sm gap-2">
      <h2 className="text-xs font-bold text-[#000] py-2 pl-2">Check Wise Files Failed</h2>
      <Bar ref={chartRef} data={checkFailureData} options={checkFailureOptions} />
    </div>
  );
});

export default BarGraph;
