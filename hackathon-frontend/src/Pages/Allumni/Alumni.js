import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/alumniconnect.css";
import Sidebar from "../Components/alumnisidebar";

export default function AlumniMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [respondedBy, setRespondedBy] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/alumni/all");
      setMessages(response.data || []);  // Ensure messages is always an array
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch messages");
      setLoading(false);
    }
  };

  const handleReplySubmit = async (messageId) => {
    if (!replyText[messageId] || !respondedBy[messageId]) {
      alert("Reply and name are required!");
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/alumni/reply`, {
        messageId,
        text: replyText[messageId],
        respondedBy: respondedBy[messageId],
      });

      setReplyText({ ...replyText, [messageId]: "" });
      setRespondedBy({ ...respondedBy, [messageId]: "" });

      // Refresh messages after reply submission
      fetchMessages();
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to submit reply.");
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <h1 className="title">Alumni Messages</h1>
      {loading ? (
        <p className="loading">Loading messages...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-messages">No messages available.</p>
          ) : (
            messages.map((message) => (
              <div key={message._id} className="message-card">
                <p className="message-description">{message.description}</p>
                <h3 className="message-title">from - {message.title}</h3>

                {/* Replies Section */}
                {Array.isArray(message.replies) && message.replies.length > 0 && (
                  <div className="replies">
                    <h4>Replies:</h4>
                    {message.replies.map((reply, index) => (
                      <div key={index} className="reply">
                        <p>{reply.text}</p>
                        <small>- {reply.respondedBy}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="reply-form">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={respondedBy[message._id] || ""}
                    onChange={(e) =>
                      setRespondedBy({ ...respondedBy, [message._id]: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Write a reply..."
                    value={replyText[message._id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [message._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleReplySubmit(message._id)}>
                    Submit Reply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
