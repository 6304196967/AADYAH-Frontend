import { useState, useEffect } from "react";
import "./schedule.css";
import Sidebar from "../Components/adminsidebar";

const SchedulePage = () => {
  const [viewMode, setViewMode] = useState("timeTable");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [filteredTimeTable, setFilteredTimeTable] = useState([]);
  const [filteredExamSchedule, setFilteredExamSchedule] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [file, setFile] = useState(null);
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

  const handleEditClick = (row, index) => {
    setEditingRow(index);
    setEditFormData({ ...row });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    if (!year || !branch || (viewMode === "timeTable" && !section)) return;

    setIsLoading(true);
    try {
      const endpoint = viewMode === "timeTable" 
        ? "/update-time-table" 
        : "/update-exam-schedule";
      
      const body = viewMode === "timeTable"
        ? { 
            year, 
            branch, 
            section, 
            schedule: filteredTimeTable.map((item, i) => 
              i === editingRow ? editFormData : item) 
          }
        : { 
            year, 
            branch, 
            exams: filteredExamSchedule.map((item, i) => 
              i === editingRow ? editFormData : item) 
          };

      const res = await fetch(`http://localhost:3000/api/schedule${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Update failed");

      // Refresh data
      if (viewMode === "timeTable") {
        const updated = await fetchTimeTable(year, branch, section);
        setFilteredTimeTable(updated);
      } else {
        const updated = await fetchExamSchedule(year, branch);
        setFilteredExamSchedule(updated);
      }

      setEditingRow(null);
    } catch (err) {
      setError("Failed to update schedule");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !year || !branch || (viewMode === "timeTable" && !section)) {
      setError(`Please select year, branch${viewMode === "timeTable" ? " and section" : ""} and a file`);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("year", year);
      formData.append("branch", branch);
      if (viewMode === "timeTable") formData.append("section", section);

      const endpoint = viewMode === "timeTable" 
        ? "/upload-time-table" 
        : "/upload-exam-schedule";
      
      const res = await fetch(`http://localhost:3000/api/schedule${endpoint}`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      // Refresh data
      if (viewMode === "timeTable") {
        const updated = await fetchTimeTable(year, branch, section);
        setFilteredTimeTable(updated);
      } else {
        const updated = await fetchExamSchedule(year, branch);
        setFilteredExamSchedule(updated);
      }

      setFile(null);
    } catch (err) {
      setError("Failed to upload schedule");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSchedule = async () => {
    if (!year || !branch || (viewMode === "timeTable" && !section)) {
      setError(`Please select year, branch${viewMode === "timeTable" ? " and section" : ""}`);
      return;
    }

    if (!window.confirm("Are you sure you want to remove this schedule?")) return;

    setIsLoading(true);
    try {
      const endpoint = viewMode === "timeTable" 
        ? "/remove-time-table" 
        : "/remove-exam-schedule";
      
      const body = viewMode === "timeTable"
        ? { year, branch, section }
        : { year, branch };

      const res = await fetch(`http://localhost:3000/api/schedule${endpoint}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Deletion failed");

      // Clear data
      if (viewMode === "timeTable") {
        setFilteredTimeTable([]);
      } else {
        setFilteredExamSchedule([]);
      }
    } catch (err) {
      setError("Failed to remove schedule");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="schedule-container">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h2 className="title">
            {viewMode === "timeTable" ? "Timetable Management" : "Exam Schedule Management"}
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

        {/* Upload Section */}
        <div className="upload-section">
          <form onSubmit={handleFileUpload}>
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={(e) => setFile(e.target.files[0])} 
              required 
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Schedule"}
            </button>
          </form>
          <button 
            className="remove-btn" 
            onClick={handleRemoveSchedule}
            disabled={isLoading || !year || !branch || (viewMode === "timeTable" && !section)}
          >
            Remove Schedule
          </button>
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
            editingRow={editingRow}
            editFormData={editFormData}
            onEditChange={handleEditFormChange}
            onSave={handleSaveClick}
            onCancel={() => setEditingRow(null)}
            onEditClick={handleEditClick}
          />
        ) : (
          <ExamScheduleView 
            year={year}
            branch={branch}
            data={filteredExamSchedule}
            editingRow={editingRow}
            editFormData={editFormData}
            onEditChange={handleEditFormChange}
            onSave={handleSaveClick}
            onCancel={() => setEditingRow(null)}
            onEditClick={handleEditClick}
          />
        )}
      </div>
    </div>
  );
};

// Subcomponents
const TimeTableView = ({ year, branch, section, data, editingRow, editFormData, onEditChange, onSave, onCancel, onEditClick }) => {
  const [dayFilter, setDayFilter] = useState("All"); // New state for day filter

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                {editingRow === index ? (
                  <>
                    <td>
                      <select
                        name="day"
                        value={editFormData.day}
                        onChange={onEditChange}
                        required
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="subject"
                        value={editFormData.subject}
                        onChange={onEditChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        name="time"
                        value={editFormData.time}
                        onChange={onEditChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="faculty"
                        value={editFormData.faculty}
                        onChange={onEditChange}
                        required
                      />
                    </td>
                    <td>
                      <button onClick={onSave}>Save</button>
                      <button onClick={onCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.day}</td>
                    <td>{item.subject}</td>
                    <td>{item.time}</td>
                    <td>{item.faculty}</td>
                    <td>
                      <button onClick={() => onEditClick(item, index)}>Edit</button>
                    </td>
                  </>
                )}
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
const ExamScheduleView = ({ year, branch, data, editingRow, editFormData, onEditChange, onSave, onCancel, onEditClick }) => (
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((exam, index) => (
            <tr key={index}>
              {editingRow === index ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={onEditChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="subject"
                      value={editFormData.subject}
                      onChange={onEditChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="subjectCode"
                      value={editFormData.subjectCode}
                      onChange={onEditChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="startTime"
                      value={editFormData.startTime}
                      onChange={onEditChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="endTime"
                      value={editFormData.endTime}
                      onChange={onEditChange}
                      required
                    />
                  </td>
                  
                  <td>
                    <button onClick={onSave}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{new Date(exam.date).toLocaleDateString()}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.subjectCode}</td>
                  <td>{exam.startTime}</td>
                  <td>{exam.endTime}</td>
                  <td>
                    <button onClick={() => onEditClick(exam, index)}>Edit</button>
                  </td>
                </>
              )}
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