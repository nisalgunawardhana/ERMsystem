import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function Attendance() {
    const [uniqueDates, setUniqueDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/attendance/') // Fetch all attendance records
            .then((res) => {
                // Extract unique dates from attendance records
                const uniqueDates = [...new Set(res.data.map(record => record.date))];
                setUniqueDates(uniqueDates);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    // Function to handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // Fetch attendance records for the selected date
        axios.get(`http://localhost:8080/attendance/date/${date}`)
            .then((res) => {
                setAttendanceRecords(res.data);
                setShowPreviewModal(true); // Show the preview modal
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div className="container">
            <h4>Attendance Records</h4>

            {/* Display unique dates */}
            <div className="dates-container">
                {uniqueDates.map((date, index) => (
                    <button key={index} onClick={() => handleDateSelect(date)} className="date-button">{date}</button>
                ))}
            </div>

            {/* Preview Modal */}
            <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Attendance Records for {selectedDate}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display attendance records */}
                    <ul>
                        {attendanceRecords.map((record, index) => (
                            <li key={index}>{record.employee_Id}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
