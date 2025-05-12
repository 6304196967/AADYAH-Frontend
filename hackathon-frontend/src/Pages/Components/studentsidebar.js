import { NavLink, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, Bell, MessageSquare, GraduationCap } from "lucide-react";
import "../../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally add logout logic here (e.g., clear tokens, user state, etc.)
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Student Portal</h2>
      <nav className="sidebar-nav">
        <NavLink to="/student/dashboard" className="sidebar-link">
          <Home className="icon" /> Dashboard
        </NavLink>
        <NavLink to="/student/schedule" className="sidebar-link">
          <Calendar className="icon" /> Schedule
        </NavLink>
        <NavLink to="/student/clubs" className="sidebar-link">
          <Users className="icon" /> Clubs
        </NavLink>
        <NavLink to="/student/discussions" className="sidebar-link">
          <MessageSquare className="icon" /> Discussions
        </NavLink>
        <NavLink to="/student/alumni" className="sidebar-link">
          <GraduationCap className="icon" /> Alumni
        </NavLink>
        <NavLink to="/student/intern" className="sidebar-link">
          <GraduationCap className="icon" /> Intern
        </NavLink>
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;