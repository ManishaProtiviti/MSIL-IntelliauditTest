import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import marutiBlueLogo from "../../assets/maruti-blue-logo.png";

const MIN_LOADING_TIME = 1500;

const ProtectedRoute = ({ children }) => {
  const { userData, loading: authLoading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [minTimeExpired, setMinTimeExpired] = useState(false);

  useEffect(() => {
    // Start a timer for the minimum loading time
    const timer = setTimeout(() => {
      setMinTimeExpired(true);
    }, MIN_LOADING_TIME);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  useEffect(() => {
    if (!authLoading && minTimeExpired) {
      setShowLoader(false);
    }
  }, [authLoading, minTimeExpired]);

  // Show the loader while either the auth is loading or the minimum time hasn't passed
  if (showLoader || authLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <img
          src={marutiBlueLogo}
          alt="Maruti Logo"
          width={180}
          className="shadow-transparent bg-none animate-ping"
        />
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
