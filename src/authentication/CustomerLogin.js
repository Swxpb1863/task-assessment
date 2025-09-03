import { useState } from "react";
import "../styles/login.css";

export default function CustomerLogin( {onLoginSuccess} ) {
  const [isSignup, setIsSignup] = useState(false); // toggle between login and signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // store token (or user data) in localStorage
        localStorage.setItem("customer", JSON.stringify(data.customer));
        onLoginSuccess(data.customer); // callback to parent
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  // Handle Signup
const handleSignup = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/customer/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);

      // ✅ Switch back to login form
      setIsSignup(false);

      // (Optional) Clear the signup fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
};

  return (
    <div className="login-container customer-login">
      <div className="login-box customer-box">
        {isSignup ? (
          <>
            <h1 className="login-title">Customer Signup</h1>
            <form onSubmit={handleSignup}>
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Sign Up
              </button>
            </form>

            <p className="signup-text">
              Already a user?{" "}
              <span className="signup-link" onClick={() => setIsSignup(false)}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <h1 className="login-title">Customer Login</h1>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Login
              </button>
            </form>

            <p className="signup-text">
              New user?{" "}
              <span className="signup-link" onClick={() => setIsSignup(true)}>
                Sign up here.
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
