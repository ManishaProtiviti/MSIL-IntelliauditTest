import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { forwardRef } from "react";
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
import { useEffect, useState } from "react";

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

const BarGraph = forwardRef(({ data }, ref) => {
  const [failureCountObj, setFailureCountObj] = useState({});
  console.log(data, "DATA x");
  useEffect(() => {
    countYesPerKey(data);
  }, [data]);
  const countYesPerKey = (data) => {
    // Initialize a result object to store the count of "Yes" values for each key
    const yesCount = {};

    // Iterate over the list of objects
    data?.forEach((obj) => {
      // For each object, iterate over the keys
      Object.keys(obj).forEach((key) => {
        // If the value is "Yes", increment the count for that key
        if (obj[key] === "Yes") {
          if (yesCount[key]) {
            yesCount[key] += 1;
          } else {
            yesCount[key] = 1;
          }
        } else if (
          (yesCount[key] === 0 && obj[key] === "No") ||
          obj[key] === "-"
        ) {
          yesCount[key] = 0;
        }
      });
    });

    setFailureCountObj(yesCount);
  };

  const checkFailureData = {
    labels: [
      "De-Duplication",
      "PDF Edit",
      "Copy Move",
      "Metadata",
      "QR Code",
      "Image Edit",
    ],
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
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: true,
        color: "#fff",
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 10,
        },
        formatter: (value) => value,
      },
      title: {
        display: false,
        text: "Check wise files failed",
        align: "start",
        color: "#000",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: data?.length,
        ticks: {
          stepSize: 2,
          precision: 0,
          display: false,
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#000",
          font: {
            size: 8,
          },
          autoSkip: false, // Show all labels
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="bg-white rounded-md shadow-sm gap-2">
      <h2 className="text-xs font-bold text-[#000] py-2 pl-2">
        Check Wise Files Failed
      </h2>
      <Bar ref={ref} data={checkFailureData} options={checkFailureOptions} />
    </div>
  );
});

export default BarGraph;
