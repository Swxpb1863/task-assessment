import React, { useState, useEffect } from "react";
import "../styles/dashboards.css";

export default function CustomerDashboard({ customer }) {
  const [view, setView] = useState("home"); // home | past | new
  const [feedbacks, setFeedbacks] = useState([]);

  // fetch past feedbacks from backend
  useEffect(() => {
    if (view === "new") {
      fetch(`http://localhost:5000/api/new_feedbacks/${customer.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setFeedbacks(data))
        .catch((err) => console.error("Error fetching feedbacks:", err));
    }
  }, [view, customer.id]);

  const loadFeedbacks = async () => {
  try {
      const res = await fetch(`http://localhost:5000/api/show_feedback?user_id=${customer.id}`);
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data); // update state with past feedbacks
      } else {
        console.error("Failed to fetch feedbacks");
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => {
    if (view === "past") {
      loadFeedbacks();
    }
  }, [view, customer.id]);

  return (
    <div className="dashboard-container">
      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.removeItem("customer");
          window.location.reload(); // logout & refresh
        }}
        className="logout-btn"
      >
        Logout
      </button>

      {/* Welcome message */}
      <h1 className="welcome-text">Welcome To Customer Dashboard</h1>
      <h3>Customer Name: {customer.name}</h3>

      {/* Options */}
      {view === "home" && (
        <div className="options-container">
          <button onClick={() => setView("past")} className="option-btn">
            See Past Feedbacks
          </button>
          <button onClick={() => setView("new")} className="option-btn">
            Give A New Feedback
          </button>
        </div>
      )}

{view === "past" && (
  <div className="feedbacks-section">
    <h2>Your Past Feedbacks</h2>
    {feedbacks.length === 0 ? (
      <p>No feedbacks yet.</p>
    ) : (
      <div className="feedbacklist">
        <ul>
          {feedbacks.map((f) => (
            <li key={f.feedback_id}>
              <span>{f.feedback}</span>
              <div className="date">
              <small>
                {" "}
                Posted On: {new Date(f.created_at).toLocaleString()}
              </small></div>
            </li>
          ))}
        </ul>
      </div>
    )}
              <button className="back-button" onClick={() => setView("home")}>
            ⬅ Back
          </button>
  </div>
)}

      {/* New Feedback */}
      {view === "new" && (
        <div className="new-feedback-section">
          <h2>Submit New Feedback</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const feedbackData = {
                user_id: customer.id,
                feedback: formData.get("feedback"),
                is_anonymous: formData.get("is_anonymous") === "on",
              };

              fetch("http://localhost:5000/api/new_feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
              })
                .then((res) => res.json())
                .then((data) => {
                  alert(data.message || "Feedback submitted successfully!");
                  setView("home");
                })
                .catch((err) =>
                  console.error("Error submitting feedback:", err)
                );
            }}
          >
            <textarea
              name="feedback"
              placeholder="Write your feedback..."
              required
            />
            <label className="checkbox-label">
              <input type="checkbox" name="is_anonymous" /> Stay Anonymous
              <span className="tooltip">?</span>
            <span className="tooltip-text">
              If checked, your feedback will be submitted without your name.
            </span>
            </label>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
          <button className="back-btn" onClick={() => setView("home")}>
            ⬅ Back
          </button>
        </div>
      )}
    </div>
  );
}
