import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./home";
import CustomerLogin from "./authentication/CustomerLogin";
import AdminLogin from "./authentication/AdminLogin";
import CustomerDashboard from "./dashboards/customerDashboard";
import AdminDashboard from "./dashboards/adminDashboard";

function App() {
  const [customer, setCustomer] = useState(null);
  const [admin, setAdmin] = useState(null);

  // Restore login state from localStorage
  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer");
    const savedAdmin = localStorage.getItem("admin");

    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Customer Login */}
        <Route
          path="/CustomerLogin"
          element={
            customer ? (
              <Navigate to="/CustomerDashboard" replace />
            ) : (
              <CustomerLogin onLoginSuccess={setCustomer} />
            )
          }
        />

        {/* Admin Login */}
        <Route
          path="/AdminLogin"
          element={
            admin ? (
              <Navigate to="/AdminDashboard" replace />
            ) : (
              <AdminLogin onLoginSuccess={setAdmin} />
            )
          }
        />

        {/* Customer Dashboard (Protected) */}
        <Route
          path="/CustomerDashboard"
          element={
            customer ? (
              <CustomerDashboard customer={customer} />
            ) : (
              <Navigate to="/CustomerLogin" replace />
            )
          }
        />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/AdminDashboard"
          element={
            admin ? (
              <AdminDashboard admin={admin} />
            ) : (
              <Navigate to="/AdminLogin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
