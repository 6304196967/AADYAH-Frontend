import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';
import Sidebar from '../Components/csidebar';

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from backend
    fetch("http://localhost:3000/api/noti/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  useEffect(() => {
    // Configure chatbot
    window.chtlConfig = { chatbotId: "9648262883" };
    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.dataset.id = "9648262883";
    script.id = "chatling-embed-script";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification._id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const WelcomeSection = () => {
    const hours = new Date().getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';
    return (
      <div className="welcome-section">
        <h1>{greeting}, User!</h1>
        <p>Welcome to your dashboard. Here's your overview for today.</p>
        <button className="action-button">View Reports</button>
      </div>
    );
  };

  const NotificationsSection = () => {
    return (
      <div className="notifications-section">
        <div className="notifications-header">
          <h2>Notifications</h2>
          <button className="mark-all-btn" onClick={markAllAsRead}>Mark all as read</button>
        </div>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">You have no notifications</div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="notification-content">
                  <div className="notification-title">{notification.data}</div>
                  <div className="notification-time">{new Date(notification.createdAt).toLocaleTimeString()}</div>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="dashboard-content">
        {/* <header className="dashboard-header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
        </header> */}
        <main className="main-content">
          <WelcomeSection />
          <NotificationsSection />
        </main>
      </div>
    </div>
  );
}

export default App;
