import React, { useState, useEffect } from "react";
import "../../styles/ClubPage.css";
import Sidebar from "../Components/adminsidebar";

const AdminClubPage = () => {
  const [selectedClub, setSelectedClub] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clubs, setClubs] = useState([]);

  // Fetch clubs from backend
  useEffect(() => {
    fetch("http://localhost:3000/api/clubs/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched clubs:", data); // Debugging log
        setClubs(data);
      })
      .catch((err) => console.error("Error fetching clubs:", err));
  }, []);

  const [newClub, setNewClub] = useState({
    name: "",
    image: "",
    description: "",
    totalStudents: 0,
  });

  const handleCardClick = (club) => {
    setSelectedClub(club);
  };

  const handleCreateClub = () => {
    setShowCreateForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClub({ ...newClub, [name]: name === "totalStudents" ? parseInt(value) || 0 : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newClubWithId = {
      name: newClub.name,
      description: newClub.description,
      totalMembers: newClub.totalStudents,
      imageURL: newClub.image,
    };

    console.log("Sending data:", newClubWithId);

    try {
      const response = await fetch("http://localhost:3000/api/clubs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClubWithId),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add club");
      }

      const data = await response.json();
      console.log("Club added successfully:", data);

      setClubs((prevClubs) => [...prevClubs, data.club]); // Ensure state updates correctly
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error adding club:", error);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <h2 className="title">College Clubs (Admin)</h2>
      <div className="club-list">
        {clubs.map((club) => (
          <div className="club-card" key={club._id} onClick={() => handleCardClick(club)}>
            <img src={club.image} alt={club.name} className="club-img" />
            <div className="club-info">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
            </div>
          </div>
        ))}

        <div className="club-card add-club-card" onClick={handleCreateClub}>
          <div className="add-icon">+</div>
          <p>Add New Club</p>
        </div>
      </div>

      {showCreateForm && (
        <div className="modal">
          <div className="modal-content club-form-container">
            <span className="close" onClick={() => setShowCreateForm(false)}>
              &times;
            </span>
            <h2>Create New Club</h2>
            <form onSubmit={handleSubmit} className="club-form">
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  name="name"
                  value={newClub.name}
                  onChange={handleInputChange}
                  placeholder="Enter club name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newClub.image}
                  onChange={handleInputChange}
                  placeholder="Paste image URL"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newClub.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the club"
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Students</label>
                <input
                  type="number"
                  name="totalStudents"
                  value={newClub.totalStudents}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Create Club
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClubPage;
