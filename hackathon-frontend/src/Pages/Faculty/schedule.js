import { useState, useEffect } from "react";
import "../../styles/schedule.css";
import Sidebar from "../Components/facultysidebar";

const SchedulePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [examSchedule, setExamSchedule] = useState({});
  const [timeTable, setTimeTable] = useState([]);

  // Fetch Exam Schedule
  useEffect(() => {
    fetch("http://localhost:3000/api/schedule/exam-schedule")
      .then((res) => res.json())
      .then((data) => setExamSchedule(data))
      .catch((err) => console.error("Error fetching exam schedule:", err));
  }, []);

  // Fetch Time Table
  useEffect(() => {
    fetch("http://localhost:3000/api/schedule/time-table")
      .then((res) => res.json())
      .then((data) => setTimeTable(data))
      .catch((err) => console.error("Error fetching time table:", err));
  }, []);

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
            {year && branch && examSchedule[year] && examSchedule[year][branch] ? (
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {examSchedule[year][branch].map((exam, index) => (
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
                {timeTable.map((item, index) => (
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
