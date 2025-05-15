import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import "../styles/Forgot.css";
    import { Link } from 'react-router-dom';

    const ForgotPassword = () => {
      const [email, setEmail] = useState("");
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch("https://aadyah-backend.onrender.com/api/user/forgot-password", { // Updated endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (response.ok) {
            alert("Password reset link sent to your email");
          } else {
            const errorData = await response.json();
            alert(errorData.message || "Failed to send reset link"); // Server message
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Network error occurred"); // Network error
        }
      };

      const handleBackToLogin = () => {
        navigate("/");
      };

      return (
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <h2 className="forgot-password-title">Reset Password</h2>
            <p className="forgot-password-description">
              Enter your email to receive a reset link.
            </p>
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Send Reset Link
              </button>
            </form>
            <Link to="/" className="back-to-login-button">
              Back to Login
            </Link>
          </div>
        </div>
      );
    };

    export default ForgotPassword;
