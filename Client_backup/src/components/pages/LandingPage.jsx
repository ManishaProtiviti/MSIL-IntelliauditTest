import React, { useState } from "react";
import axios from "axios";
import marutiWhiteLogo from "../../assets/maruti-white-logo.svg";
import deLogo from "../../assets/power-by-DE-logo.png";
import landingpageImg from "../../assets/landing-page-img.svg";
import intelliAuditLogofrom from "../../assets/intelliAudit-logo.svg";

const api_url = import.meta.env.VITE_API_URL;
const API_KEY = "7O6pIW7s4x9lChH4lPXdT9unhrMfe1513OetVQmL";
// const CLIENT_ID = "4patfko8kccn3nquplovu6008k";
//const CLIENT_ID = "3s2ompa7a888fvl94kvm581vvj";
const CLIENT_ID = "5miscbmfvmhp49mmdlekvumsst";
const REDIRECT_URI = "http://localhost:5173/home";

const LandingPage = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
    if (loading) return;

    console.log("Launch button clicked, initiating ADFS login");

    try {
      setLoading(true);
      setStatus("Connecting to login service...");

      const res = await axios.post(
        "https://apipreprod.developersinmarutisuzuki.in/loginviauserpass/v1/common/LoginViaUsernamePassword/partner/login-with-federation",
        {
          redirectUrl: REDIRECT_URI,
          clientId: CLIENT_ID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          timeout: 10000, // 10-second timeout
        }
      );

      console.log("Login URL API response:", res.data);

      const loginUrl = await res?.data?.data;
      if (loginUrl) {
        setStatus("Redirecting to ADFS...");
        window.location.href = loginUrl;
      } else {
        throw new Error("Login URL not found in response.");
      }
    } catch (err) {
      console.error("Error getting login URL:", err);
      setStatus("Failed to connect to login service. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-flow-row grid-cols-12 items-center justify-center h-screen bg-gray-100 w-full font-roboto">
      <div
        className="col-span-7 border-black h-full bg-cover bg-center bg-blue-500"
        style={{ backgroundImage: `url(${landingpageImg})` }}
      >
        <div className="absolute w-7/12 inset-0 bg-[#00264499]" />
        <img
          src={marutiWhiteLogo}
          alt="Maruti Logo"
          width="200"
          className="absolute h-10 object-contain pl-4 pt-4"
        />
      </div>
      <div className="col-span-5 h-screen items-center justify-center text-center">
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <img
            src={deLogo}
            alt="Powered by DE Logo"
            width="200"
            className="absolute h-10 object-contain right-0 top-0"
          />
          <div>
            <img
              src={intelliAuditLogofrom}
              alt="IntelliAudit Icon"
              className="mx-auto h-20 pl-5"
            />
            <h1 className="text-4xl font-bold text-[#012386]">
              <span className="text-xl font-medium">Welcome to</span>{" "}
              IntelliAudit
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-xs">
            "AI-Powered Forgery Detection for Documents and Images"
          </p>

          {status && (
            <p className="text-sm text-gray-700 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-[#012386]"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  {status}
                </span>
              ) : (
                status
              )}
            </p>
          )}

          <button
            onClick={handleLaunch}
            disabled={loading}
            className={`mt-6 px-6 py-3 rounded-full flex justify-center items-center text-white transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#012386] hover:bg-blue-800"}`}
          >
            {loading ? "Please wait..." : "Launch"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;