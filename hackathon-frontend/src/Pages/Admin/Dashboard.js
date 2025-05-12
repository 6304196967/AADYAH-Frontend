import React, { useState, useEffect } from "react";
import Sidebar from "../Components/adminsidebar";
import "./Dashboard.css";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/noti/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  useEffect(() => {
    window.chtlConfig = { chatbotId: "9648262883" };
    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.dataset.id = "9648262883";
    script.id = "chatling-embed-script";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const sendNotification = async () => {
    if (newNotification.trim() === "") return;
    try {
      const response = await fetch("http://localhost:3000/api/noti/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newNotification }),
      });
      const result = await response.json();
      if (response.ok) {
        setNotifications([...notifications, result.notification]);
        setNewNotification("");
      } else {
        console.error("Error sending notification:", result.error);
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
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
          <div className="welcome-section">
            <h1>Welcome, Admin! 👋</h1>
            <p>Manage your notifications efficiently from the dashboard.</p>
          </div>

          <div className="send-notification-section">
            <h2>📢 Send a Notification</h2>
            <div className="send-notification-form">
              <input
                type="text"
                placeholder="Enter notification message..."
                value={newNotification}
                onChange={(e) => setNewNotification(e.target.value)}
              />
              <button className="send-btn" onClick={sendNotification}>
                🚀 Send
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="sent-notifications">
                <h3>📩 Sent Notifications</h3>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification._id}>
                      <span>{notification.data}</span>
                      <span className="time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;