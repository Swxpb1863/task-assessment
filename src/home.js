import { useNavigate } from "react-router-dom";
import "./styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* Top Heading */}
      <header className="home-header">
        <h1 className="app-title">Mini Feedback App</h1>
      </header>

      {/* Split Sections */}
      <div className="home-container">
        {/* Left Section - Customer */}
        <div
          className="home-section left-section"
          onClick={() => navigate("/CustomerLogin")}
        >
            <div className="content">
            <img src="icons/customer.png" alt="customer-icon"></img>
          <h2 className="home-title gradient-text">Customer Login</h2>
        </div>
        </div>

        {/* Right Section - Admin */}
        <div
          className="home-section right-section"
          onClick={() => navigate("/AdminLogin")}
        >
            <div className="content">
            <img src="icons/administrator.png" alt="admin-icon"></img>
          <h2 className="home-title white-text">Admin Login</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
