// AttendanceForm.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Employee ID:
          <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </label>
        <button type="submit">Add Attendance</button>
      </form>
    </div>
    
    
  );
  

};

export default AttendanceForm;
