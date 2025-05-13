import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';
import Sidebar from '../Components/studentsidebar';
import Swal from 'sweetalert2';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  const markAsRead = (id) => {
    const selected = notifications.find(n => n._id === id);
    setSelectedNotification(selected);
    setNotifications(notifications.map(notification =>
      notification._id === id ? { ...notification, read: true } : notification
    ));

    const { title, description, imageBase64 } = selected;

    Swal.fire({
      title: `<strong>${title}</strong>`,
      html: `
        <p style="margin-bottom: 15px;">${description}</p>
        ${imageBase64 ? `
          <div style="position: relative; display: inline-block;">
            <img src="${imageBase64}" alt="notification" style="max-width: 100%; border-radius: 8px;" />
            <a href="${imageBase64}" download="notification_image.png" style="
              position: absolute;
              top: 8px;
              right: 8px;
              background: white;
              border-radius: 50%;
              padding: 6px;
              text-decoration: none;
              font-size: 16px;
              box-shadow: 0 0 5px rgba(0,0,0,0.3);
            " title="Download Image">⬇️</a>
          </div>
        ` : `<p><i>No image attached</i></p>`}
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 600,
    });
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
                <div className="notification-sentby">
                  <small>
                    Sent by: {notification.sentBy || 'Unknown'}
                    {notification.role ? ` (${notification.role})` : ''}
                  </small>
                </div>
                <div className="notification-title">
                  {notification.title}
                  {notification.imageBase64 && (
                    <img 
                      src={notification.imageBase64} 
                      alt="thumb" 
                      style={{ width: '30px', height: '30px', marginLeft: '10px', borderRadius: '4px' }}
                    />
                  )}
                </div>
                
                <div className="notification-time">
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </div>
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
        <main className="main-content">
          <WelcomeSection />
          <NotificationsSection />
        </main>
      </div>
    </div>
  );
}

export default App;
