import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/discussion.css';
import Sidebar from '../Components/studentsidebar';

const API_URL = "http://localhost:3000/api/admin/posts"; 

function Discussion() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const currentUser = localStorage.getItem("username"); // Get logged-in user

  // Fetch posts from backend when component mounts
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  // Add a new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      alert('Please enter both title and content for your post');
      return;
    }

    const newPost = {
      title: newPostTitle,
      content: newPostContent,
      user: currentUser // Use logged-in username
    };

    try {
      const response = await axios.post(API_URL, newPost);
      setPosts([response.data, ...posts]); // Add new post to state
      setNewPostTitle('');
      setNewPostContent('');
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  // Delete a post (Only if the logged-in user is the author)
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${API_URL}/${postId}`);
      setPosts(posts.filter(post => post._id !== postId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Handle reply input change
  const handleReplyChange = (postId, value) => {
    setReplyContent({ ...replyContent, [postId]: value });
  };

  // Submit a reply
  const handleReplySubmit = async (postId) => {
    const reply = {
      content: replyContent[postId],
      user: currentUser, // Use logged-in username
    };

    try {
      const response = await axios.post(`${API_URL}/${postId}/reply`, reply);
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, replies: [...post.replies, response.data] } : post
      ));
      setReplyContent({ ...replyContent, [postId]: '' }); // Clear reply input
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="App">
      <Sidebar />
      <div className="post-form-container">
        <h2>Start a New Discussion</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="post-title">Title:</label>
            <input
              type="text"
              id="post-title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Enter a title for your discussion"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-content">Description:</label>
            <textarea
              id="post-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows="4"
            />
          </div>
          
          <button type="submit" className="submit-btn">Post Discussion</button>
        </form>
      </div>
      
      <div className="posts-container">
        <h2>Recent Discussions</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No discussions yet. Be the first to post!</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post">
              <div className="post-header">
                <h3>{post.title}</h3>
                {post.user === currentUser && (
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <span className="post-user">Posted by: {post.user}</span>
                <span className="post-time">{new Date(post.timestamp).toLocaleString()}</span>
              </div>

              {/* Show Reply Form only if the post is made by someone else */}
              {post.user !== currentUser && (
                <div className="reply-section">
                  <textarea
                    value={replyContent[post._id] || ""}
                    onChange={(e) => handleReplyChange(post._id, e.target.value)}
                    placeholder="Write a reply..."
                    rows="2"
                  />
                  <button 
                    onClick={() => handleReplySubmit(post._id)} 
                    className="reply-btn"
                  >
                    Reply
                  </button>
                </div>
              )}

              {/* Display Replies */}
              <div className="replies">
                {post.replies && post.replies.length > 0 ? (
                  post.replies.map((reply, index) => (
                    <div key={index} className="reply">
                      <p>{reply.content}</p>
                      <span className="reply-user">- {reply.user}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-replies">No replies yet.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Discussion;