import React, { useState, useEffect } from "react";
import "../../styles/ClubPage.css";
import Sidebar from "../Components/facultysidebar";

const ClubPage = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  // Fetch clubs from backend
  useEffect(() => {
    fetch("http://localhost:3000/api/clubs/all") // Replace with your actual backend endpoint
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error("Error fetching clubs:", err));
  }, []);

  const handleCardClick = (club) => {
    setSelectedClub(club);
  };

  return (
    <div className="container">
      <Sidebar />
      <h2 className="title">College Clubs</h2>
      <div className="club-list">
        {clubs.length === 0 ? (
          <p>Loading clubs...</p> // Show a loading message while fetching
        ) : (
          clubs.map((club) => (
            <div
              className={`club-card ${selectedClub && selectedClub.id === club.id ? "expanded" : ""}`}
              key={club.id}
              onClick={() => handleCardClick(club)}
            >
              <img src={club.image} alt={club.name} className="club-img" />
              <div className="club-info">
                <h3>{club.name}</h3>
                <p>{club.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedClub && (
        <div className="modal expanded-card">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedClub(null)}>&times;</span>
            <h2>{selectedClub.name}</h2>
            <p><strong>Description:</strong> {selectedClub.description}</p>
            <p><strong>Total Students:</strong> {selectedClub.totalMembers}</p>
            {selectedClub.studentsByYear && (
              <>
                <p><strong>Students co-ordinators by Year:</strong></p>
                {Object.keys(selectedClub.studentsByYear).map((year) => (
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
              </>
            )}
            <button className="join-btn" onClick={() => alert(`Joined ${selectedClub.name}`)}>Join Club</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubPage;
