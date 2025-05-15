import { useState, useEffect } from "react";
import "../Admin/schedule.css";
import Sidebar from "../Components/studentsidebar"; 

const SchedulePage = () => {
  const [viewMode, setViewMode] = useState("timeTable");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [filteredTimeTable, setFilteredTimeTable] = useState([]);
  const [filteredExamSchedule, setFilteredExamSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      if (!year || !branch) return;
      
      setIsLoading(true);
      setError("");
      
      try {
        if (viewMode === "examSchedule") {
          const exams = await fetchExamSchedule(year, branch);
          setFilteredExamSchedule(exams);
        } else if (section) {
          const schedule = await fetchTimeTable(year, branch, section);
          setFilteredTimeTable(schedule);
        }
      } catch (err) {
        setError("Failed to fetch schedule data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [year, branch, section, viewMode]);

  const fetchExamSchedule = async (year, branch) => {
    const res = await fetch(`http://localhost:3000/api/schedule/exam-schedule/${year}/${branch}`);
    if (!res.ok) throw new Error("Failed to fetch exam schedule");
    const data = await res.json();
    return data.exams || [];
  };

  const fetchTimeTable = async (year, branch, section) => {
    const res = await fetch(`http://localhost:3000/api/schedule/time-table/${year}/${branch}/${section}`);
    if (!res.ok) throw new Error("Failed to fetch timetable");
    const data = await res.json();
    return data.schedule || [];
  };

  return (
    <div className="schedule-container">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h2 className="title">
            {viewMode === "timeTable" ? "View Timetable" : "View Exam Schedule"}
          </h2>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === "timeTable" ? "active" : ""}`}
              onClick={() => setViewMode("timeTable")}
              disabled={isLoading}
            >
              Time Table
            </button>
            <button 
              className={`toggle-btn ${viewMode === "examSchedule" ? "active" : ""}`}
              onClick={() => setViewMode("examSchedule")}
              disabled={isLoading}
            >
              Exam Schedule
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <select 
            onChange={(e) => setYear(e.target.value)} 
            value={year}
            disabled={isLoading}
          >
            <option value="">Select Year</option>
            {["1st", "2nd", "3rd", "4th"].map(y => (
              <option key={y} value={y}>{y} Year</option>
            ))}
          </select>
          <select 
            onChange={(e) => setBranch(e.target.value)} 
            value={branch}
            disabled={isLoading}
          >
            <option value="">Select Branch</option>
            {["CSE", "ECE", "EEE", "MECH", "CIVIL", "MME", "CHEM"].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {viewMode === "timeTable" && (
            <select 
              onChange={(e) => setSection(e.target.value)} 
              value={section}
              disabled={isLoading}
            >
              <option value="">Select Section</option>
              {["A", "B", "C", "D", "E"].map(s => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Schedule Display */}
        {isLoading ? (
          <div className="loading">Loading schedule data...</div>
        ) : viewMode === "timeTable" ? (
          <TimeTableView 
            year={year}
            branch={branch}
            section={section}
            data={filteredTimeTable}
          />
        ) : (
          <ExamScheduleView 
            year={year}
            branch={branch}
            data={filteredExamSchedule}
          />
        )}
      </div>
    </div>
  );
};

// Subcomponents
const TimeTableView = ({ year, branch, section, data }) => {
  const [dayFilter, setDayFilter] = useState("All");

  // Filter data based on selected day
  const filteredData = dayFilter === "All" 
    ? data 
    : data.filter(item => item.day === dayFilter);

  return (
    <div className="time-table">
      <div className="table-header">
        <h3>Time Table Schedule {year && branch && section && `- ${year} ${branch} ${section}`}</h3>
        <div className="day-filter">
          <label>Filter by Day:</label>
          <select 
            value={dayFilter} 
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <option value="All">All Days</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredData.length > 0 ? (
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
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.subject}</td>
                <td>{item.time}</td>
                <td>{item.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">
          {dayFilter === "All" && data.length === 0
            ? "No timetable found for the selected criteria"
            : `No classes scheduled for ${dayFilter}`}
        </p>
      )}
    </div>
  );
};

const ExamScheduleView = ({ year, branch, data }) => (
  <div className="exam-calendar">
    <h3>Exam Schedule {year && branch && `- ${year} ${branch}`}</h3>
    {data.length > 0 ? (
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject Name</th>
            <th>Subject Code</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((exam, index) => (
            <tr key={index}>
              <td>{new Date(exam.date).toLocaleDateString()}</td>
              <td>{exam.subject}</td>
              <td>{exam.subjectCode}</td>
              <td>{exam.startTime}</td>
              <td>{exam.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="no-data">
        {year && branch
          ? "No exam schedule found for the selected criteria"
          : "Please select year and branch"}
      </p>
    )}
  </div>
);

export default SchedulePage;