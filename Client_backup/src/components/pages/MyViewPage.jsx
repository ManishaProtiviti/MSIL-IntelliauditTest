import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";
import BarGraph from "../helper/Graphs/BarGraph";
import PieChart from "../helper/Graphs/PieChart";
import TransactionalOutcomeTable from "../helper/Tables/TransactionalOutcomeTable";
import BarChart from "../helper/Graphs/BarChart";
import axios from "axios";
import { useDebugValue, useEffect, useState } from "react";
import {
  convertTimestampToNormal,
  convertTimestampToNormalWithoutMS,
} from "../utils/timeStampFormatter";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PdfTemplate from "../utils/PdfTemplate";

const MyViewPage = () => {
  const [responseData, setResponsedata] = useState({});
  const [docData, setDocData] = useState({});
  const [reportList, setReportList] = useState([]);
  const [processingTime, setProcessingTime] = useState(null);
  const [selectedUploadTime, setSelectedUploadTime] = useState(
    sessionStorage.getItem("uploadTime")
  );
  const userData = JSON.parse(sessionStorage.getItem("session"));
  const [selectedReport, setSelectedReport] = useState(null);
  const [rowNumber, setRowNumber] = useState(1);
  const uploadTimeParam = sessionStorage.getItem("uploadTime");
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch reports
    getReports();
  }, []); // Only run once when the component mounts

  useEffect(() => {
    // If there's no selected report, set the latest report
    if (!selectedReport && reportList.length > 0) {
      setSelectedReport(reportList[0]); // Set the first (latest) report
    }
  }, [reportList, selectedReport]);

  useEffect(() => {
    if (selectedReport || uploadTimeParam) {
      getMyViewData(selectedReport, uploadTimeParam);
    }
  }, [selectedReport, uploadTimeParam]);

  const getMyViewData = async (selectedReport, uploadTime) => {
    let sessionId = selectedReport
      ? selectedReport?.Session_ID
      : userData?.sessionId;
    let uploadTimeStamp = selectedReport
      ? convertTimestampToNormal(selectedReport?.Upload_Timestamp, false)
      : uploadTime;
    try {
      const response = await axios.get(
        `${VITE_API_URL}/enterprise/request/status/${sessionId}/${userData?.employeeId}/${uploadTimeStamp}/details`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setResponsedata(response?.data?.data);

        const startTime = new Date(
          response?.data?.data?.status_data[0]?.Process_Start_Time
        );
        const endTime = new Date(
          response?.data?.data?.status_data[0]?.Process_End_Time
        );
        const timeDiff = endTime - startTime;

        const minutes = Math.floor(timeDiff / 60000);
        const seconds = ((timeDiff % 60000) / 1000).toFixed(0);
        setProcessingTime(`${minutes} Min ${seconds} Sec`);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const getDocData = async (data, checkType) => {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/enterprise/request/status/${userData?.sessionId}/${userData?.employeeId}/${selectedUploadTime}/${checkType}/${data?.Document_Name}/files`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setDocData(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching file data", error);
    }
  };

  const getReports = async () => {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/enterprise/request/${userData?.sessionId}/${userData?.employeeId}/reports`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const allReports = response?.data?.data?.transactions || [];

        // Sort by Upload_Timestamp DESC and take last 10
        const sortedReports = allReports
          .sort(
            (a, b) =>
              new Date(b.Upload_Timestamp) - new Date(a.Upload_Timestamp)
          )
          .slice(0, 10);

        setReportList(sortedReports);
      }
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };
  const handleDowload = async () => {
    const blob = await pdf(<PdfTemplate/>).toBlob();

    // Save the PDF file
    saveAs(blob, `report-${new Date().toISOString()}.pdf`);
    // console.log("Handle download");
    // return (
    //   <div style={{ width: "100%", height: "100vh" }}>
    //     <PDFViewer style={{ width: "100%", height: "100%" }}>
    //       <PdfTemplate />
    //     </PDFViewer>
    //   </div>
    // );
  };
  return (
    <div className="bg-[#f3f3f3] min-h-screen w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <SideBar activePage="My View" />

        <div className="lg:col-span-10 flex flex-col h-full">
          <HeaderSection title="My View" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-auto h-[calc(100vh-80px)]">
            {/* Left Section */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <h2 className="text-xl text-[#012378] font-semibold pb-3">
                Session Outcome
              </h2>

              <PieChart data={responseData?.transactions} />
              <BarGraph data={responseData?.transactions} />
              <div className="relative bg-white rounded-md shadow-sm py-2">
                <div className="flex items-center gap-2 pb-2">
                  <span className="border-2 border-[#012378] rounded-md h-7"></span>
                  <h3 className="text-sm text-[#012378] font-medium">
                    Last 10 Reports
                  </h3>
                </div>
                <div className="relative overflow-y-auto max-h-48 px-2">
                  <table className="w-full text-xs border border-collapse border-gray-200 text-center">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="border p-1">Report No.</th>
                        <th className="border p-1">Date & Time</th>
                        <th className="border p-1">No. of Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportList.map((row, i) => {
                        const isCurrent =
                          convertTimestampToNormal(
                            row.Upload_Timestamp,
                            false
                          ) === uploadTimeParam;
                        return (
                          <tr
                            key={i}
                            className={
                              i + 1 === rowNumber
                                ? "bg-yellow-100 font-bold"
                                : ""
                            }
                          >
                            <td className="border p-1">
                              <button
                                onClick={() => {
                                  setSelectedReport(row);
                                  setRowNumber(i + 1);
                                }}
                                className="text-blue-600 underline"
                              >
                                #{i + 1}
                              </button>
                            </td>
                            <td className="border p-1">
                              {convertTimestampToNormal(row.Upload_Timestamp)}
                            </td>
                            <td className="border p-1">
                              {row.Total_Documents_Upload}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="lg:col-span-8 flex flex-col gap-2 w-full">
              {/* Stats Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="flex items-center justify-between bg-white p-2 py-1 rounded-md shadow">
                  <div className="text-xs font-medium">Files Validated</div>
                  <div className="text-xs font-medium bg-[#012378] text-white px-2 py-1 rounded">
                    {responseData?.transactions?.length || 0}
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white p-2 py-1 rounded-md shadow">
                  <div className="text-xs font-medium">Data Processed</div>
                  <div className="text-xs font-medium bg-[#012378] text-white px-2 py-1 rounded">
                    {responseData?.status_data?.length
                      ? `${(
                          parseFloat(
                            responseData?.status_data[0]?.Total_Size_Upload
                          ) || 0
                        ).toFixed(2)} MB`
                      : "0.00 MB"}
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white p-2 py-1 rounded-md shadow">
                  <div className="text-xs font-medium">Processing Time</div>
                  <div className="text-xs font-medium bg-[#012378] text-white px-2 py-1 rounded">
                    {processingTime || "Calculating..."}
                  </div>
                </div>
              </div>

              <TransactionalOutcomeTable
                tableData={responseData?.transactions}
                getDocData={getDocData}
                docData={docData}
                handleDowload={handleDowload}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-[#737891] text-xs px-4 py-2">
            * Results are AI generated and may vary. Check for inaccuracies.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyViewPage;
