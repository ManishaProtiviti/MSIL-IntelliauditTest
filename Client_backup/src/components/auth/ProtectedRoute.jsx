import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useAuth();

  if (loading || userData === undefined) {
    return <div className="p-4">Loading...</div>;
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;