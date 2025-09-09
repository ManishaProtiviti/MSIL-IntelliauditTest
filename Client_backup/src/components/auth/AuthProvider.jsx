import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { createSession, getSession, clearSession } from "../utils/session";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { convertTimestampToNormal } from "../utils/timeStampFormatter";

const AuthContext = createContext();
const api_url = import.meta.env.VITE_API_URL;
const API_KEY = "7O6pIW7s4x9lChH4lPXdT9unhrMfe1513OetVQmL";
const CLIENT_ID = "3s2ompa7a888fvl94kvm581vvj";
//const CLIENT_ID = "5miscbmfvmhp49mmdlekvumsst";
// const REDIRECT_URI = `${api_url}/home`;
const REDIRECT_URI = "https://devintelliaudit.maruti-suzuki.ai/home";


export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(undefined); // initially undefined
  const [loading, setLoading] = useState(true);
  const processedRef = useRef(false); // Prevent StrictMode double calls

  useEffect(() => {
    if (processedRef.current) return; // Skip if already processed (handles StrictMode)
    processedRef.current = true;

    const session = getSession();
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    console.log("AuthProvider useEffect: session =", session, "code =", code);

    if (session) {
      console.log("Existing session found:", session);
      setUserData(session);
      setLoading(false);
    } else if (code) {
      console.log("Processing code:", code);
      fetchTokenAndUser(code);
    } else {
      const isRedirectExpected = window.location.pathname === "/home";
      if (isRedirectExpected) {
        console.log("Waiting for ADFS redirect at /home...");
      } else {
        console.log("No session or code, setting userData to null");
        setUserData(null);
        setLoading(false);
      }
    }

    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const newCode = params.get("code");
      if (newCode && newCode !== code) {
        console.log("Detected new code in URL:", newCode);
        fetchTokenAndUser(newCode);
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    const codePoll = setInterval(() => {
      const params = new URLSearchParams(window.location.search);
      const newCode = params.get("code");
      if (newCode && newCode !== code) {
        console.log("Detected code via polling:", newCode);
        fetchTokenAndUser(newCode);
        clearInterval(codePoll);
      }
    }, 500);

    const timeoutId = setTimeout(() => {
      clearInterval(codePoll);
      if (loading || !userData) {
        console.log("ADFS redirect timeout, setting userData to null");
        setUserData(null);
        setLoading(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      clearInterval(codePoll);
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchTokenAndUser = async (code) => {
    console.log("↪️ Fetching token with code:", code, "at", new Date().toISOString());
    let retryCount = 0;
    const maxRetries = 1; // Limit to one retry

    while (retryCount <= maxRetries) {
      try {
        const res = await axios.post(
          "https://apipreprod.developersinmarutisuzuki.in/loginviauserpass/v1/common/LoginViaUsernamePassword/partner/get-token",
          {
            redirectUrl: REDIRECT_URI,
            code,
            clientId: CLIENT_ID,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
            },
            timeout: 15000,
          }
        );

        console.log("Token API response:", res.data);

        const token = res.data?.data?.IdToken;
        if (!token) {
          throw new Error("No token received in response");
        }

        // const res1 = await axios.get(
        //   "https://apipreprod.developersinmarutisuzuki.in/partnermgt/v1/common/PartnerManagement/partner/cognito/verify-token",
        //   // {
        //   //   // redirectUrl: REDIRECT_URI,
        //   //   code,
        //   //   clientId: CLIENT_ID,
        //   // },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       "x-api-key": API_KEY,
        //       "Authorization": token
        //     },
        //     timeout: 15000,
        //   }
        // );
        // console.log(res1, "Response for verficatin");
        // const res2 = await axios.post(
        //   "https://apipreprod.developersinmarutisuzuki.in/dealerauth/v1/common/DealerAuthentication/partner/refresh-token",
        //   {
        //     // redirectUrl: REDIRECT_URI,
        //     // code,
        //     clientId: CLIENT_ID,
        //     refreshToken: res?.data?.data?.RefreshToken
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       "x-api-key": API_KEY,
        //       // "Authorization": token+ "gg"
        //     },
        //     timeout: 15000,
        //   }
        // );
        // console.log(res2, "Response for refresh");
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        const loginTimestamp = decoded.auth_time;
        const employeeId = decoded?.identities?.[0]?.userId || "UNKNOWN_ID";

        const sessionData = {
          employeeId,
          employeeName: decoded.name || "Unknown",
          employeeEmailId: decoded.email,
          username: decoded["cognito:username"] || decoded.username,
          givenName: decoded.given_name,
          loginTime: loginTimestamp,
          employeeDepartment: decoded["custom:department"] || "Unknown",
          accessType: "Enterprise",
          sessionId: `${employeeId}_${loginTimestamp}`,
          department: decoded["custom:department"],
        };

        const ttl = decoded.exp ? decoded.exp - decoded.auth_time : 3600;
        createSession(sessionData, ttl);
        setUserData(sessionData);
        console.log("✅ User set:", sessionData);

        await axios.post(
          `${api_url}/enterprise/addLoginDetails`,
          {
            Employee_ID: employeeId,
            Session_ID: sessionData.sessionId,
            Employee_Name: sessionData.givenName,
            Login_Timestamp: convertTimestampToNormal(loginTimestamp, true),
            Employee_Department: sessionData.employeeDepartment,
            Access_Type: "Enterprise",
            Logout_Timestamp: "0000-00-00 00:00:00",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Login details posted to API");
        return; // Success, exit loop
      } catch (error) {
        console.error(`Authentication failed (attempt ${retryCount + 1}):`, error.response?.data || error.message);
        retryCount++;
        if (retryCount > maxRetries) {
          clearSession();
          setUserData(null);
          // Optionally, redirect to landing page or show error
          window.location.href = "/"; // Force redirect on final failure
        }
      } finally {
        setLoading(false);
        // Always clear query params after attempt (success or failure)
        window.history.replaceState({}, document.title, "/home");
      }
    }
  };

  const logout = () => {
    console.log("Logging out");
    clearSession();
    setUserData(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ userData, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);