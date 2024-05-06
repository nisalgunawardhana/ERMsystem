import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddAttendanceForm() {
    const [employeeId, setEmployeeId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Send POST request to add attendance
            await axios.post('http://localhost:8080/attendance/add', { employee_Id: employeeId, dateTime: dateTime });
            // Clear form fields and error message on success
            setEmployeeId('');
            setDateTime('');
            setErrorMessage('');
            alert('Attendance added successfully');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Failed to add attendance');
            }
        }
    };

    // Function to fetch current date and time and set it in the state
    useEffect(() => {
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = currentDateTime.getMonth() + 1 < 10 ? `0${currentDateTime.getMonth() + 1}` : currentDateTime.getMonth() + 1;
        const day = currentDateTime.getDate() < 10 ? `0${currentDateTime.getDate()}` : currentDateTime.getDate();
        const hours = currentDateTime.getHours() < 10 ? `0${currentDateTime.getHours()}` : currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes() < 10 ? `0${currentDateTime.getMinutes()}` : currentDateTime.getMinutes();
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        setDateTime(formattedDateTime);
    }, []);

    return (
      
      <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card">
          <div className="card-body">
              <h2 className="card-title">Add Form</h2>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                      <label htmlFor="employeeId" className="form-label">Employee ID:</label>
                      <input type="text" id="employeeId" className="form-control" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                      <label htmlFor="dateTime" className="form-label">Date & Time:</label>
                      <input type="datetime-local" id="dateTime" className="form-control" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Attendance</button>
              </form>
          </div>
      </div> 
  </div>
    );
}
