import { NavLink, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, Bell, MessageSquare, GraduationCap } from "lucide-react";
import "../../styles/hsidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally add logout logic here (e.g., clear tokens, user state, etc.)
    navigate('/');
  };

  return (
    <div className="sidebar">
      {/* Additional Content in Sidebar */}
      <div className="sidebar-additional-content">
        <div className="additional-section">
          <h2>Why Choose UNI Connect?</h2>
          <ul>
            <li>Seamless collaboration with peers and faculty.</li>
            <li>Stay updated on campus events and announcements.</li>
            <li>Join discussions and share ideas in real-time.</li>
          </ul>
        </div>
        <div className="additional-section">
          <h2>Get Started Today</h2>
          <p>Sign up now to unlock all the features of UNI Connect and start connecting with your university community.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;