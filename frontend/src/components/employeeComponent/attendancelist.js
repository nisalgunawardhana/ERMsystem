import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import employeecomponent from './employee'

export default function Employee() {
    const [employeeIds, setEmployeeIds] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [link, setLink] = useState('http://localhost:3000/dashboard/employee/attendence/form');

    // Function to handle date input change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Function to fetch employee IDs through a specific date
    const fetchEmployeeIds = () => {
        axios.get(`http://localhost:8080/attendance/employeeIds/${selectedDate}`)
            .then(res => {
                console.log('Response from backend:', res.data); // Log response from backend
                setEmployeeIds(res.data);
            })
            .catch(err => {
                console.error('Error fetching employee IDs:', err);
                // Handle error (e.g., show error message)
            });
    };

    

    useEffect(() => {
        // Fetch employee IDs when the component mounts or when the selected date changes
        if (selectedDate) {
            fetchEmployeeIds();
        }
    }, [selectedDate]);
    const copyLink = () => {
        navigator.clipboard.writeText(link);
        alert('Link copied to successfully!');
    };

    return (
        <Layout>
            <div className="container">
                {/* Your existing JSX code */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">Employee Attendance Record</h2>
                                <div className="mb-3">
                                    <label htmlFor="dateInput" className="form-label">Select Date:</label>
                                    <input type="date" id="dateInput" className="form-control" value={selectedDate} onChange={handleDateChange} />
                                </div>
                                <button  className="btn btn-outline-primary" style={{ margin: '0 5px' }} onClick={fetchEmployeeIds}>Show Employee Attendance</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display fetched employee IDs */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">Show Related Attendance</h2>
                                <ul>
                                    {employeeIds.map(employeeId => (
                                        <li key={employeeId}>{employeeId} - {date}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card m-3">
                    <div className="card-body">
                        <h3 className="card-text">This is the Attendance Taken Link</h3>
                    </div>
                    <div className="card-footer">
                        <div className="input-group">
                            <input type="text" className="form-control" value={link} readOnly />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" style={{ margin: '0 5px' }} onClick={copyLink}>Copy Link</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
