import React, { useState, useRef, useEffect } from "react";
import HeaderSection from "../helper/HeaderSection";
import SideBar from "../helper/SideBar";
import UploadSection from "../helper/UploadSection";
import { Link, useNavigate } from "react-router-dom";
import CheckCard from "../helper/CheckCard";
import initialChecks from "../utils/initialChecks";
// import { createSession, getSession, clearSession } from "../utils/session";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { convertTimestampToNormal } from "../utils/timeStampFormatter";
import UploadMessageModal from "../helper/Modals/UploadMessageModal";
import { useAuth } from "../auth/AuthProvider";
const api_url = import.meta.env.VITE_API_URL;
const API_KEY = "7O6pIW7s4x9lChH4lPXdT9unhrMfe1513OetVQmL";
//const CLIENT_ID = "5miscbmfvmhp49mmdlekvumsst";
// const CLIENT_ID = "4patfko8kccn3nquplovu6008k";
const CLIENT_ID = "3s2ompa7a888fvl94kvm581vvj";
const REDIRECT_URI = "https://devintelliaudit.maruti-suzuki.ai/home";
//const REDIRECT_URI = "http://localhost:5173/home";

const HomePage = () => {
  const [checks, setChecks] = useState(initialChecks);
  const [selectAll, setSelectAll] = useState(
    initialChecks.every((c) => c.checked)
  );
  const [checksDisplay, setChecksDisplay] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [userData, setUserData] = useState({});
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processMessage, setProcessMessage] = useState("");
  const [uploadValues, setUploadValues] = useState({
    uploadTime: Date.now(),
    requestId: "",
    totalFileSize: 0,
    totalFiles: 0,
    isZip: false,
  });
  console.log("Upload Values", uploadValues);
  const uploadSectionRef = useRef(null);
  const navigate = useNavigate();
  const { userData: user } = useAuth(); // CORRECT

  console.log("Auth user:", user);
  useEffect(() => {
    if (user === null) {
      navigate("/"); // not authenticated
    }
  }, [user]);
  

  // const fetchTokenAndUser = async (code) => {
  //   try {
  //     const res = await axios.post(
  //       "https://apipreprod.developersinmarutisuzuki.in/loginviauserpass/v1/common/LoginViaUsernamePassword/partner/get-token",
  //       {
  //         redirectUrl: REDIRECT_URI,
  //         code,
  //         clientId: CLIENT_ID,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-key": API_KEY,
  //         },
  //       }
  //     );

  //     const token = res.data?.data?.IdToken;
  //     if (!token) {
  //       console.error("Token not received.");
  //       return;
  //     }

  //     const decoded = jwtDecode(token);
  //     const loginTimestamp = decoded.auth_time;
  //     const employeeId = decoded?.identities?.[0]?.userId || "UNKNOWN_ID";
  //     const employeeName = decoded.name || "Unknown";
  //     const employeeDepartment = decoded["custom:department"] || "Unknown";
  //     const sessionId = `${employeeId}_${loginTimestamp}`;

  //     const sessionData = {
  //       employeeId,
  //       employeeName,
  //       employeeEmailId: decoded.email,
  //       username: decoded["cognito:username"] || decoded.username,
  //       givenName: decoded.given_name,
  //       loginTime: loginTimestamp,
  //       employeeDepartment,
  //       accessType: "Enterprise",
  //       sessionId,
  //       department: decoded["custom:department"]
  //     };

  //     const ttl = decoded.exp ? decoded.exp - decoded.auth_time : 3600;

  //     createSession(sessionData, ttl);
  //     setUserData(sessionData);
  //     setUser(sessionData)

  //     // Call addLoginDetails only once
  //     await axios.post(`${api_url}/enterprise/addLoginDetails`, {
  //       Employee_ID: employeeId,
  //       Session_ID: sessionId,
  //       Employee_Name: sessionData?.givenName,
  //       Login_Timestamp: convertTimestampToNormal(loginTimestamp, true),
  //       Employee_Department: employeeDepartment,
  //       Access_Type: "Enterprise",
  //       Logout_Timestamp: "0000-00-00 00:00:00",
  //     });

  //     console.log("Login details sent.");
  //     window.history.replaceState({}, document.title, "/home"); // Remove ?code=...
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  const handleToggleCheck = (id) => {
    const updated = checks.map((check) =>
      check.id === id ? { ...check, checked: !check.checked } : check
    );
    setChecks(updated);
    setSelectAll(updated.every((c) => c.checked));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updated = checks.map((check) => ({ ...check, checked: isChecked }));
    setChecks(updated);
  };

  const handleChecksDisplay = (toggle) => {
    setChecksDisplay(toggle);
  };
  const getDataFromUpload = (data) => {
    setUploadValues(data);
  };
  const handleExecute = async () => {
    setLoading(true);
    try {
      if (
        uploadSectionRef.current &&
        uploadSectionRef.current.handleProcessChecks
      ) {
        const checksPayload = {
          requestId: uploadValues?.requestId, // Replace with dynamic if needed
          checks: {
            duplicate: checks.some(
              (c) => c.id === "deduplication" && c.checked
            ),
            pdfEditForge: checks.some((c) => c.id === "pdf-edit" && c.checked),
            metadataCheck: checks.some((c) => c.id === "metadata" && c.checked),
            tamper: checks.some((c) => c.id === "image-tampering" && c.checked),
            copyMoveForge: checks.some(
              (c) => c.id === "copy-move" && c.checked
            ),
            qrCode: checks.some((c) => c.id === "qr-code" && c.checked),
          },
          Employee_ID: user?.employeeId,
          Session_ID: user?.sessionId,
          Total_Documents_Upload: uploadValues?.totalFiles,
          Total_Size_Upload: uploadValues?.totalFileSize,
          Process_Start_Time: convertTimestampToNormal(Date.now()),
          isZip: uploadValues?.isZip,
          Upload_Datetime: convertTimestampToNormal(
            uploadValues?.uploadTime,
            false
          ),
        };
        sessionStorage.setItem(
          "uploadTime",
          convertTimestampToNormal(uploadValues?.uploadTime, false)
        );
        axios.defaults.timeout = 600000;
        await axios.post(`${api_url}/enterprise/process`, checksPayload, {
          timeout: 600000,
          headers: { "Content-Type": "application/json" },
        });

        setProcessMessage(
          `${uploadValues.totalFiles} files have been processed successfully.`
        );
        setShowProcessModal(true);
      }
    } catch (error) {
      console.error("Execution failed:", error);
      uploadSectionRef.current?.setUploadStatus("Failed to generate results.");
    } finally {
      setLoading(false);
    }
  };

  //   const handleLogout = async () => {
  //   const session = getSession();
  //   if (session) {
  //     try {
  //       await axios.post(`${api_url}/enterprise/addLoginDetails`, {
  //         Employee_ID: session.employeeId,
  //         Session_ID: session.sessionId,
  //         Employee_Name: session.employeeName,
  //         Login_Timestamp: new Date(session.loginTime * 1000).toISOString(),
  //         Employee_Department: session.employeeDepartment,
  //         Access_Type: session.accessType,
  //         Logout_Timestamp: new Date().toISOString(),
  //       });
  //     } catch (err) {
  //       console.error("Error sending logout time:", err);
  //     }
  //   }
  //   clearSession();
  //   window.location.href = "/";
  // };

  return (
    <div className="relative box-border min-h-screen w-full mx-auto flex flex-col items-center overflow-hidden">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-20 flex items-center justify-center cursor-not-allowed">
          {/* <div className="bg-white px-6 py-3 rounded-md shadow-md text-sm font-semibold">
          Processing... please wait
        </div> */}
        </div>
      )}
      <div className="relative w-full max-h-screen">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="Home" />
          <div className="relative col-span-10 box-border max-h-screen grid-rows-12">
            <div className="grid row-span-1">
              <HeaderSection title="Home" />
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 box-border p-3 overflow-y-auto h-[calc(100vh-80px)]">
              <UploadSection
                wrapperClassName="col-span-4"
                ref={uploadSectionRef}
                analyticalChecks={checks}
                handleChecksDisplay={handleChecksDisplay}
                setUploadComplete={setUploadComplete}
                setUploadStatus={(status) => {
                  if (uploadSectionRef.current) {
                    uploadSectionRef.current.setUploadStatus(status);
                  }
                }}
                setResponseData={setResponseData}
                getDataFromUpload={getDataFromUpload}
                uploadComplete={uploadComplete}
                checks={checks}
              />
              <div className="relative h-full col-span-1 md:col-span-8 bg-white box-border border border-[#e6e9eb] shadow-sm rounded-lg">
                <div className="relative box-border p-6 gap-4 grid grid-flow-row">
                  <div className="relative grid grid-flow-col justify-between ">
                    <h2 className="relative text-md font-semibold text-gray-800">
                      Choose the analytical checks
                    </h2>
                    <div className="grid grid-flow-col items-center gap-3 mr-4 ">
                      <span className="text-sm text-gray-600">Select All</span>
                      <input
                        type="checkbox"
                        disabled={!uploadComplete}
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-3 h-3 text-[#012386] border-gray-300 rounded focus:ring-[#012386] accent-[#012386]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-col grid-rows-6 md:grid-rows-3 gap-4 box-border max-h-screen">
                    {checks.map((check) => (
                      <CheckCard
                        key={check.id}
                        check={check}
                        onToggle={handleToggleCheck}
                        checksDisplay={uploadComplete}
                      />
                    ))}
                  </div>
                  <div className="grid grid-flow-col justify-end">
                    <button
                      onClick={handleExecute}
                      disabled={loading || !checks.some((c) => c.checked)}
                      className={`flex items-center gap-2 border border-[#012386] rounded-md px-4 py-1.5 text-sm font-semibold text-white transition ${
                        loading || !checks.some((c) => c.checked)
                          ? "bg-gray-400"
                          : "bg-[#012386] hover:bg-[#00195e]"
                      }`}
                    >
                      {loading ? (
                        <div className="flex gap-2">
                          <p>Executing...</p>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        "Execute"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UploadMessageModal
        isOpen={showProcessModal}
        onClose={() => {
          setShowProcessModal(false);
          navigate("/my-view");
        }}
        message={processMessage}
        title="Files Processed Status"
        buttonName="Ok"
      />
    </div>
  );
};

export default HomePage;
