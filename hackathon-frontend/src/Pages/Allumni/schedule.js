import { useState } from "react";
import "../../styles/schedule.css";
import Sidebar from "../Components/alumnisidebar";

const SchedulePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");

  // Exam schedule data for different years and branches
  const EXAM_SCHEDULE = {
    "1st": {
      "CSE": [
        { subject: "Math", date: "10-Mar-2025", time: "10:00 AM" },
        { subject: "DLD", date: "12-Mar-2025", time: "2:00 PM" },
        { subject: "P&S", date: "14-Mar-2025", time: "10:00 AM" },
        { subject: "FLAT", date: "16-Mar-2025", time: "2:00 PM" },
        { subject: "DBMS", date: "18-Mar-2025", time: "10:00 AM" },
        { subject: "DSP", date: "20-Mar-2025", time: "2:00 PM" },
        { subject: "CD", date: "22-Mar-2025", time: "10:00 AM" }
      ],
      "ECE": [
        { subject: "Physics", date: "11-Mar-2025", time: "10:00 AM" },
        { subject: "FLAT", date: "13-Mar-2025", time: "2:00 PM" },
        { subject: "DSP", date: "15-Mar-2025", time: "10:00 AM" },
        { subject: "DBMS", date: "17-Mar-2025", time: "2:00 PM" },
        { subject: "P&S", date: "19-Mar-2025", time: "10:00 AM" },
        { subject: "DLD", date: "21-Mar-2025", time: "2:00 PM" },
        { subject: "CD", date: "23-Mar-2025", time: "10:00 AM" }
      ]
    }
    // Add additional years/branches if needed
  };

  // Time table data (static example)
  const TIME_TABLE_DATA = [
    { day: "Monday", subject: "Math", time: "9:00 AM", faculty: "Prof. Sharma" },
    { day: "Monday", subject: "Physics", time: "11:00 AM", faculty: "Dr. Singh" },
    { day: "Tuesday", subject: "DBMS", time: "2:00 PM", faculty: "Prof. Rao" },
    { day: "Wednesday", subject: "Thermodynamics", time: "10:30 AM", faculty: "Dr. Patel" },
    { day: "Thursday", subject: "DLD", time: "12:00 PM", faculty: "Prof. Reddy" },
    { day: "Friday", subject: "FLAT", time: "3:00 PM", faculty: "Dr. Kumar" },
    { day: "Friday", subject: "P&S", time: "4:30 PM", faculty: "Prof. Verma" },
    { day: "Friday", subject: "Robotics", time: "1:00 PM", faculty: "Dr. Mehta" }
  ];

  return (
    <div className="schedule-container">
      <Sidebar />
      <div className="main-content">
        <h2 className="title">Schedule</h2>
        
        {/* Selection Cards */}
        {!selectedOption && (
          <div className="selection-cards">
            <div className="card" onClick={() => setSelectedOption("examCalendar")}>
              View Exam Calendar
            </div>
            <div className="card" onClick={() => setSelectedOption("timeTable")}>
              Time Table Schedule
            </div>
          </div>
        )}

        {/* Exam Calendar Section */}
        {selectedOption === "examCalendar" && (
          <div className="exam-calendar">
            <h3>Exam Calendar</h3>
            <div className="filters">
              <select onChange={(e) => setYear(e.target.value)} value={year}>
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
              <select onChange={(e) => setBranch(e.target.value)} value={branch}>
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
            {year && branch && EXAM_SCHEDULE[year] && EXAM_SCHEDULE[year][branch] ? (
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAM_SCHEDULE[year][branch].map((exam, index) => (
                    <tr key={index}>
                      <td>{exam.subject}</td>
                      <td>{exam.date}</td>
                      <td>{exam.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">Please select a valid year and branch.</p>
            )}
          </div>
        )}

        {/* Time Table Schedule Section */}
        {selectedOption === "timeTable" && (
          <div className="time-table">
            <h3>Time Table Schedule</h3>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Subject</th>
                  <th>Time</th>
                  <th>Faculty</th>
                </tr>
              </thead>
              <tbody>
                {TIME_TABLE_DATA.map((item, index) => (
                  <tr key={index}>
                    <td>{item.day}</td>
                    <td>{item.subject}</td>
                    <td>{item.time}</td>
                    <td>{item.faculty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back Button */}
        {selectedOption && (
          <button className="back-button" onClick={() => setSelectedOption(null)}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
