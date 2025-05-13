import React, { useState, useEffect } from "react";
import Sidebar from "../Components/alumnisidebar";
import Swal from "sweetalert2";
import "../Admin/Dashboard.css";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null); // New state for expanded card

  useEffect(() => {
    fetchNotifications();
    loadChatbot();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/noti/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const filtered = notifications.filter((notification) => {
        const matchesSearchTerm = notification.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesSearchDate = searchDate
          ? new Date(notification.createdAt).toLocaleDateString() ===
            new Date(searchDate).toLocaleDateString()
          : true;
        return matchesSearchTerm && matchesSearchDate;
      });
      setFilteredNotifications(filtered);
    } else {
      setFilteredNotifications(notifications);
    }
  }, [searchTerm, searchDate, notifications]);

  const loadChatbot = () => {
    window.chtlConfig = { chatbotId: "9648262883" };
    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.dataset.id = "9648262883";
    script.id = "chatling-embed-script";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: "#f8f9fa",
      backdrop: "rgba(0,0,0,0.1)",
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      timer: 2000,
      background: "#f8f9fa",
      backdrop: "rgba(0,0,0,0.1)",
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4e73df",
      cancelButtonColor: "#e74a3b",
      confirmButtonText,
      background: "#f8f9fa",
      backdrop: "rgba(0,0,0,0.1)",
    });
  };

  const sendNotification = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showErrorAlert("Title and description are required");
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const username = localStorage.getItem("username") || "Unknown User";
      const role = localStorage.getItem("role") || "Unknown Role";
      formDataToSend.append("username", username);
      formDataToSend.append("role", role);

      const response = await fetch(
        "http://localhost:3000/api/noti/notifications",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to send notification");

      const result = await response.json();
      setNotifications([result.notification, ...notifications]);
      resetForm();
      showSuccessAlert("Notification sent successfully!");
      fetchNotifications();
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    const result = await showConfirmDialog(
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/noti/notifications/${id}",
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete notification");

      setNotifications(notifications.filter((n) => n._id !== id));
      showSuccessAlert("Notification deleted successfully!");
      fetchNotifications();
      setExpandedNotificationId(null); // Close expanded card if deleted
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
      imagePreview: null,
    });
    setIsModalOpen(false);
  };

  // Toggle expanded state for a notification
  const toggleNotification = (id) => {
    setExpandedNotificationId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="dashboard-content">
        <main className="main-content">
          <div className="welcome-section">
            <h1>
 Welcome,{localStorage.getItem('username') || 'Alumni'}! <span role="img" aria-label="wave">👋</span>         </h1>
            <p className="welcome-subtitle">
              Manage your notifications efficiently from the dashboard.
            </p>
          </div>

          <div className="notification-management">
            <div className="section-header">
              <div className="section-title">
                <h2>Notifications</h2>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
              >
                <i className="fas fa-plus"></i> Create Notification
              </button>
            </div>

            <div className="search-bar">
              <div className="search-input-group">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Modal Dialog */}
            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Create New Notification</h3>
                    <button
                      className="modal-close-btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="form-group">
                      <label>Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter notification title"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description*</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter detailed description"
                        rows="4"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Image (Optional)</label>
                      <div className="image-upload">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="image-upload"
                          className="btn btn-outline-secondary upload-btn"
                        >
                          <i className="fas fa-image"></i> Choose Image
                        </label>
                        {formData.imagePreview && (
                          <div className="image-preview">
                            <img src={formData.imagePreview} alt="Preview" />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger remove-image"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  image: null,
                                  imagePreview: null,
                                }))
                              }
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      disabled={isLoading}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        sendNotification();
                        setIsModalOpen(false);
                        }}
                        disabled={
                        isLoading || !formData.title || !formData.description
                        }
                      >
                        {isLoading ? (
                        <>
                          <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                        ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Send
                          Notification
                        </>
                        )}
                      </button>
                      </div>
                    </div>
                    </div>
                  )}

                  {isLoading && notifications.length === 0 ? (
                    <div className="loading-state">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p>Loading notifications...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">
                    <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <div className="notifications-list">
                    {filteredNotifications.map((notification) => (
                      <div
                      key={notification._id}
                      className={`notification-card ${
                        expandedNotificationId === notification._id ? "expanded" : ""
                      }`}
                      onClick={() => toggleNotification(notification._id)}
                      >
                      <div className="card-title">
                        <h4>{notification.title}</h4>
                      <span className="notification-date badge bg-light text-dark">
                        <i className="far fa-clock"></i>{" "}
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {expandedNotificationId === notification._id && (
                      <div className="card-details">
                        <div className="notification-sentby">
                          <small>
                            Sent by: {notification.sentBy || "Unknown"}
                            {notification.role ? ` (${notification.role})` : ""}
                          </small>
                        </div>
                        <p>{notification.description}</p>
                        {notification.imageBase64 && (
                          <div className="notification-image">
                            <img
                              src={notification.imageBase64}
                              alt="Notification"
                              className="img-fluid rounded"
                            />
                          </div>
                        )}
                       <div className="notification-actions">
  {notification.sentBy === localStorage.getItem("username") && (
    <button
      className="btn btn-danger"
      onClick={(e) => {
        e.stopPropagation(); // Prevent card toggle on delete
        deleteNotification(notification._id);
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <>
          <i className="fas fa-trash-alt"></i> Delete
        </>
      )}
    </button>
  )}
</div>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="card-body text-center">
                  <i className="far fa-bell empty-icon"></i>
                  <h5>No notifications found</h5>
                  <p>
                    {searchTerm || searchDate
                      ? "Try adjusting your search criteria"
                      : "Create your first notification to get started"}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <i className="fas fa-plus"></i> Create Notification
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
