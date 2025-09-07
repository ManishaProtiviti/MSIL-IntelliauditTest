// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import MyViewPage from "./components/pages/MyViewPage";
import AdminPage from "./components/pages/AdminPage";
import SuperAdminPage from "./components/pages/SuperAdminPage";
import ApiViewPage from "./components/pages/ApiViewPage";
import UserGuide from "./components/pages/UserGuide";
import SupportPage from "./components/pages/SupportPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import HomePage from "./components/pages/HomePage";
import PdfTemplate from "./components/utils/PdfTemplate";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-view"
            element={
              <ProtectedRoute>
                <MyViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-view"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin-view"
            element={
              <ProtectedRoute>
                <SuperAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-view"
            element={
              <ProtectedRoute>
                <ApiViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-guide"
            element={
              <ProtectedRoute>
                <UserGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdfpreview"
            element={
              <ProtectedRoute>
                <PdfTemplate />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
