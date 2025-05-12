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
      <h2 className="sidebar-title"> FacultyPortal</h2>
      <nav className="sidebar-nav">
        <NavLink to="/faculty/dashboard" className="sidebar-link">
          <Home className="icon" /> Dashboard
        </NavLink>
        <NavLink to="/faculty/schedule" className="sidebar-link">
          <Calendar className="icon" /> Schedule
        </NavLink>
        <NavLink to="/faculty/clubs" className="sidebar-link">
          <Users className="icon" /> Clubs
        </NavLink>
        <NavLink to="/faculty/discussions" className="sidebar-link">
          <MessageSquare className="icon" /> Discussions
        </NavLink>
        <NavLink to="/faculty/alumni" className="sidebar-link">
          <GraduationCap className="icon" /> Alumni
        </NavLink>
        <NavLink to="/faculty/postintern" className="sidebar-link">
          <GraduationCap className="icon" /> PostIntern
        </NavLink>
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;