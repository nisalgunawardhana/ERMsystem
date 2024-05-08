import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddAttendanceForm() {
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Send POST request to add attendance
            await axios.post('http://localhost:8080/attendance/add', { employee_Id: employeeId, date: date });
            // Clear form fields and error message on success
            setEmployeeId('');
            setDate('');
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

    // Function to fetch today's date and set it in the state
    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setDate(currentDate);
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
                      <label htmlFor="date" className="form-label">Date:</label>
                      <input type="date" id="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Attendance</button>
              </form>
          </div>
      </div> 
  </div>
    );
}
