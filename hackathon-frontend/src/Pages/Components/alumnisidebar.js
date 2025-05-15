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
      <h2 className="sidebar-title">Allumni Portal</h2>
      <nav className="sidebar-nav">
        <NavLink to="/allumni/dashboard" className="sidebar-link">
          <Home className="icon" /> Dashboard
        </NavLink>
        
        <NavLink to="/allumni/clubs" className="sidebar-link">
          <Users className="icon" /> Clubs
        </NavLink>
        <NavLink to="/allumni/discussions" className="sidebar-link">
          <MessageSquare className="icon" /> Discussions
        </NavLink>
        <NavLink to="/allumni/alumni" className="sidebar-link">
          <GraduationCap className="icon" /> Messages
        </NavLink>
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;