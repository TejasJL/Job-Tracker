import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FaTrash, FaEdit, FaLink } from 'react-icons/fa';


function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    date: "",
    link: ""
  });
  const [filters, setFilters] = useState({
    status: "",
    date: ""
  });

  const API_URL = "http://localhost:5000/jobs";

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    const res = await axios.get(API_URL);
    setJobs(res.data);
    setFilteredJobs(res.data); // Initially show all
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, form);
    setForm({ company: "", role: "", status: "Applied", date: "", link: "" });
    getJobs();
  };

  const deleteJob = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    getJobs();
  };

  const updateStatus = async (id, newStatus) => {
    await axios.put(`${API_URL}/${id}`, { status: newStatus });
    getJobs();
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...jobs];

    if (filters.status) {
      filtered = filtered.filter((job) => job.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter((job) => job.date?.slice(0, 10) === filters.date);
    }

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🎓 Student Job Tracker</h1>
        
      <div class="form-container">
      <form onSubmit={handleSubmit}>
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="link" placeholder="Link" value={form.link} onChange={handleChange} required />
        <button type="submit">Add Job</button>
      </form> </div>

      {/* Filters */}
      <div className="filters">
        <h3>🔍 Filter Applications</h3>
        <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      <h2>📋 Job Applications</h2>
      <ul>
        {filteredJobs.map((job) => (
          <li key={job._id}>
            <strong>{job.company}</strong> - {job.role} - <span className={`status-badge status-${job.status}`}>
  {job.status}
</span>

            <br />
            <a href={job.link} target="_blank" rel="noopener noreferrer"> <FaLink />🔗 Link</a> | 📅 {new Date(job.date).toLocaleDateString()}
            <br />
            <button onClick={() => updateStatus(job._id, "Applied")}> <FaEdit /> Applied</button>
            
            <button onClick={() => updateStatus(job._id, "Interview")}> <FaEdit /> Interview</button>
            <button onClick={() => updateStatus(job._id, "Offer")}> <FaEdit /> Offer</button>
            <button onClick={() => updateStatus(job._id, "Rejected")}> <FaEdit /> Reject</button>
            <button onClick={() => deleteJob(job._id)}><FaTrash /> Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
