import React, { useState, useEffect } from "react";
import "../../styles/intern.css"; // Ensure the correct extension is used
import Sidebar from "../Components/studentsidebar"; // Ensure the correct path

const InternPortal = () => {
    const [activeTab, setActiveTab] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [jobSearch, setJobSearch] = useState("");
    const [internshipSearch, setInternshipSearch] = useState("");
    const [hackathonSearch, setHackathonSearch] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsRes, internshipsRes, hackathonsRes] = await Promise.all([
                fetch("http://localhost:3000/api/intern/all?type=job").then((res) => res.json()),
                fetch("http://localhost:3000/api/intern/all?type=internship").then((res) => res.json()),
                fetch("http://localhost:3000/api/intern/all?type=hackathon").then((res) => res.json()),
            ]);

            setJobs(Array.isArray(jobsRes) ? jobsRes : []);
            setInternships(Array.isArray(internshipsRes) ? internshipsRes : []);
            setHackathons(Array.isArray(hackathonsRes) ? hackathonsRes : []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleApply = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            alert("No application link available.");
        }
    };

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.companyOrOrganizer.toLowerCase().includes(jobSearch.toLowerCase())
    );

    const filteredInternships = internships.filter((internship) =>
        internship.title.toLowerCase().includes(internshipSearch.toLowerCase()) ||
        internship.companyOrOrganizer.toLowerCase().includes(internshipSearch.toLowerCase())
    );

    const filteredHackathons = hackathons.filter((hackathon) =>
        hackathon.title.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
        hackathon.companyOrOrganizer.toLowerCase().includes(hackathonSearch.toLowerCase())
    );

    return (
        <div className="portal-container">
            <Sidebar />
            <nav className="tab-nav">
                <button className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>Jobs</button>
                <button className={`tab-btn ${activeTab === "internships" ? "active" : ""}`} onClick={() => setActiveTab("internships")}>Internships</button>
                <button className={`tab-btn ${activeTab === "hackathons" ? "active" : ""}`} onClick={() => setActiveTab("hackathons")}>Hackathons</button>
            </nav>

            {activeTab === "jobs" && (
                <div className="section">
                    <input type="text" className="search-box" placeholder="Search jobs..." value={jobSearch} onChange={(e) => setJobSearch(e.target.value)} />
                    <div className="card-container">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="card">
                                <h3>{job.title}</h3>
                                <p>{job.companyOrOrganizer} - {job.location || "N/A"}</p>
                                <button className="apply-btn" onClick={() => handleApply(job.applyLink)}>Apply</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "internships" && (
                <div className="section">
                    <input type="text" className="search-box" placeholder="Search internships..." value={internshipSearch} onChange={(e) => setInternshipSearch(e.target.value)} />
                    <div className="card-container">
                        {filteredInternships.map((internship) => (
                            <div key={internship._id} className="card">
                                <h3>{internship.title}</h3>
                                <p>{internship.companyOrOrganizer} - {internship.location || "N/A"}</p>
                                <button className="apply-btn" onClick={() => handleApply(internship.applyLink)}>Apply</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "hackathons" && (
                <div className="section">
                    <input type="text" className="search-box" placeholder="Search hackathons..." value={hackathonSearch} onChange={(e) => setHackathonSearch(e.target.value)} />
                    <div className="card-container">
                        {filteredHackathons.map((hackathon) => (
                            <div key={hackathon._id} className="card">
                                <h3>{hackathon.title}</h3>
                                <p>Organizer: {hackathon.companyOrOrganizer}</p>
                                <button className="apply-btn" onClick={() => handleApply(hackathon.applyLink)}>Apply</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternPortal;
