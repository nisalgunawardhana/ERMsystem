import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout";

const AttendanceForm = () => {
  const [employeeId, setEmployeeId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send POST request to backend to add attendance
    axios.post("http://localhost:8080/attendance/add", { employee_Id: employeeId })
      .then((res) => {
        console.log(res.data);
        // Display success message
        alert("Attendance added successfully");
        // Reset form after successful submission
        setEmployeeId("");
      })
      .catch((err) => {
        console.error("Error:", err);
        // Display error message
        alert("Failed to add attendance");
      });
  };

  return (
    <Layout>
    <div className="card">
    <div className="card-body">
      <h2 className="card-title">Add Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input 
            type="text" 
            id="employeeId" 
            className="form-control" 
            value={employeeId} 
            onChange={(e) => setEmployeeId(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Attendance</button>
      </form>
    </div>
  </div>
  </Layout>
);
};


export default AttendanceForm;
