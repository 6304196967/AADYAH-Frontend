import React, { useState } from "react";
import "../../styles/adminintern.css";
import Sidebar from "../Components/facultysidebar";
const initialEvents = {
  jobs: [
    { id: 1, title: "Software Engineer Internship", company: "Google", status: "Upcoming" },
    { id: 2, title: "Cybersecurity Analyst", company: "Microsoft", status: "Completed" }
  ],
  hackathons: [
    { id: 3, title: "AI Innovation Challenge", organizer: "OpenAI", status: "Upcoming" },
    { id: 4, title: "Cybersecurity CTF", organizer: "DEF CON", status: "Completed" }
  ],
  internships: [
    { id: 5, title: "Backend Developer", company: "Amazon", status: "Upcoming" },
    { id: 6, title: "Data Science Internship", company: "Facebook", status: "Completed" }
  ]
};

export default function AdminDashboard() {
  const [events, setEvents] = useState(initialEvents);
  const [newEvent, setNewEvent] = useState({ category: "jobs", title: "", company: "", url: "" });
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (category, id) => {
    setEvents(prevEvents => ({
      ...prevEvents,
      [category]: prevEvents[category].filter(event => event.id !== id)
    }));
  };

  const typeMapping = {
    jobs: "job",
    hackathons: "hackathon",
    internships: "internship", // ✅ Ensure this matches your schema
};

const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.url) {
        alert("Please fill all required fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/intern/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: typeMapping[newEvent.category], // ✅ Convert to valid schema type
                title: newEvent.title,
                companyOrOrganizer: newEvent.company || "N/A",
                url: newEvent.url,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to add opportunity");
        }

        alert(data.message);

        setEvents(prevEvents => ({
            ...prevEvents,
            [newEvent.category]: [
                ...prevEvents[newEvent.category],
                {
                    id: data.newOpportunity._id,
                    title: newEvent.title,
                    company: newEvent.company || "N/A",
                    status: "Upcoming",
                    url: newEvent.url,
                }
            ]
        }));

        setNewEvent({ category: "jobs", title: "", company: "", url: "" });
        setShowForm(false);
    } catch (error) {
        console.error("Error adding event:", error);
        alert(error.message);
    }
};




  return (
    <div className="admin-container">
        <Sidebar />
      <h1 className="admin-title">Opportunities Pannel</h1>
      
      <button className="create-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Create New Event"}
      </button>
      
      {showForm && (
        <div className="add-event-form">
          <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}>
            <option value="jobs">Jobs</option>
            <option value="hackathons">Hackathons</option>
            <option value="internships">Internships</option>
          </select>
          <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <input type="text" placeholder="Company/Organizer" value={newEvent.company} onChange={(e) => setNewEvent({ ...newEvent, company: e.target.value })} />
          <input type="url" placeholder="Application URL" value={newEvent.url} onChange={(e) => setNewEvent({ ...newEvent, url: e.target.value })} />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
      
      <div className="admin-cards">
        {Object.keys(events).map(category => (
          <div key={category} className="admin-card">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <ul>
              {events[category].map(event => (
                <li key={event.id} className="event-item">
                  <p><strong>{event.title}</strong> - {event.company || event.organizer} ({event.status})</p>
                  <a href={event.url} target="_blank" rel="noopener noreferrer">Apply</a>
                  <button className="delete-button" onClick={() => handleDelete(category, event.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}