import React, { useState, useEffect } from "react";
import "../../styles/ClubPage.css";
import Sidebar from "../Components/studentsidebar";

const API_URL = "http://localhost:3000/api/clubs/all"; // Replace with actual API URL

function ClubPage() {
  const [clubsData, setClubsData] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState(new Set(JSON.parse(localStorage.getItem("joinedClubs")) || []));

  // Fetch clubs data from API
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setClubsData(data))
      .catch((error) => console.error("Error fetching clubs:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("joinedClubs", JSON.stringify(Array.from(joinedClubs)));
  }, [joinedClubs]);

  const handleCardClick = (club) => {
    setSelectedClub(club);
  };

  const handleJoinClub = async (clubId) => {
    console.log("clubId:", clubId); // Debugging: Ensure this is printed correctly
  
    // Get userName from localStorage
    const userName = localStorage.getItem("username")?.trim();
  
    // Hardcoded values for userBranch and userYear
    const userBranch = "CSE";  
    const userYear = "E2";     
  
    // Validate required fields
    if (!clubId || !userName) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/clubs/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId, userName, userBranch, userYear }),
      });
  
      const data = await response.json();
      console.log("Response:", data); // Debugging: Check API response
      if (response.ok) {
        alert("Joined Successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error joining club:", error);
    }
  };
  
  
  

  return (
    <div className="container">
      <Sidebar />
      <h2 className="title">College Clubs</h2>
      <div className="club-list">
        {clubsData.map((club) => (
          <div
            className={`club-card ${selectedClub && selectedClub.id === club._id ? "expanded" : ""}`}
            key={club._id}
            onClick={() => handleCardClick(club)}
          >
            <img src={club.image} alt={club.name} className="club-img" />
            <div className="club-info">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <button
                className="join-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent modal from opening
                  handleJoinClub(club._id);
                }}
                disabled={joinedClubs.has(club._id)}
              >
                {joinedClubs.has(club._id) ? "Joined" : "Join Club"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedClub && (
        <div className="modal expanded-card">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedClub(null)}>&times;</span>
            <h2>{selectedClub.name}</h2>
            <p><strong>Description:</strong> {selectedClub.description}</p>
            <p><strong>Total Students:</strong> {selectedClub.totalStudents}</p>
            <p><strong>Students co-ordinators by Year:</strong></p>
            {Object.keys(selectedClub.studentsByYear || {}).map((year) => (
              <div key={year}>
                <h4>{year}</h4>
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClub.studentsByYear[year].map((student, index) => (
                      <tr key={index}>
                        <td>{student.name}</td>
                        <td>{student.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <button
              className="join-btn"
              onClick={() => handleJoinClub(selectedClub.id)}
              disabled={joinedClubs.has(selectedClub.id)}
            >
              {joinedClubs.has(selectedClub.id) ? "Joined" : "Join Club"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubPage;
