import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { forwardRef, useEffect, useState, useImperativeHandle, useRef } from "react";
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
    countYesPerKey(data);
  }, [data]);

  const countYesPerKey = (data) => {
    const yesCount = {};
    data?.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === "Yes") {
          yesCount[key] = (yesCount[key] || 0) + 1;
        } else if (!yesCount[key]) {
          yesCount[key] = 0;
        }
      });
    });
    setFailureCountObj(yesCount);
  };

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
      datalabels: {
        display: true,
        color: "#fff",
        anchor: "center",
        align: "center",
        font: { weight: "bold", size: 10 },
        formatter: (value) => value,
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
      x: {
        ticks: { color: "#000", font: { size: 8 }, autoSkip: false },
        grid: { display: false },
      },
    },
  };

  // Expose chart instance
  useImperativeHandle(ref, () => ({
    getChart: () => chartRef.current,
    toBase64Image: () => chartRef.current?.toBase64Image(),
  }));

  return (
    <div className="bg-white rounded-md shadow-sm gap-2">
      <h2 className="text-xs font-bold text-[#000] py-2 pl-2">Check Wise Files Failed</h2>
      <Bar ref={chartRef} data={checkFailureData} options={checkFailureOptions} />
    </div>
  );
});

export default BarGraph;
