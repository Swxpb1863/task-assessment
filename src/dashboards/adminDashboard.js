import React, { useEffect, useState } from "react";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin_feedbacks");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error("Error loading feedbacks:", err);
      }
    };

    loadFeedbacks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.reload(); // logout & refresh
  };

  return (
    <div className="admin-dashboard">
      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>

      <h1 className="title">Admin Dashboard</h1>
      <h2 className="subtitle">All Customer Feedbacks</h2>

      <div className="feedback-list">
        {feedbacks.map((f, idx) => (
          <div key={idx} className="feedback-card">
            <div className="feedback-top">
              <span className="customer-name">{f.customer_name}</span>
              <span className="timestamp">
                {new Date(f.created_at).toLocaleString()}
              </span>
            </div>
            <p className="feedback-text">{f.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
