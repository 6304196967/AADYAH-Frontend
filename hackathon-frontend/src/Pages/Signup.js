import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import { Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "", // Added role field
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role, // Send role in request
        }),
      });

      if (response.ok) {
        const userData = await response.json(); 
        localStorage.setItem("username", formData.username ); 
        localStorage.setItem("email", formData.email ); 
        localStorage.setItem("role", formData.role ); 
  
        alert("Signup successful");
        navigate("/");
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(errorData.message || "User already exists");
      } else {
        alert("Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error occurred");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmpassword">Confirm password:</label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Role Selection Dropdown */}
          <div className="form-group">
            <label htmlFor="role">Select Your Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          <button className="signup-button" type="submit">
            Sign Up
          </button>
        </form>
        <p className="login-prompt">
          Already have an account?
          <Link to="/login" className="login-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;