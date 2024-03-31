import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Trainee() {
    const [meetings, setMeetings] = useState([]);
    const [trainees, setTrainees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showMeetingForm, setShowMeetingForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        trainee_id: '',
        trainee_name: '',
        trainee_email: '',
        trainee_gender: '',
        trainee_contact: '',
        trainee_rating: ''
    });
    const [meetingFormData, setMeetingFormData] = useState({
        meeting_id: '',
        meeting_name: '',
        meeting_start: '',
        meeting_end: '',
        meeting_date: '',
        meeting_location: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8080/meetings/')
            .then(res => {
                setMeetings(res.data.reverse());
            })
            .catch(err => {
                console.error('Error fetching meetings:', err);
            });

        axios.get('http://localhost:8080/trainees/')
            .then(res => {
                setTrainees(res.data);
            })
            .catch(err => {
                console.error('Error fetching trainees:', err);
            });
    }, []);

    function handleDelete(id) {
        axios.delete(`http://localhost:8080/trainees/delete/${id}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleMeetingChange(e) {
        const { name, value } = e.target;
        setMeetingFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/trainees/add', formData)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    function handleMeetingSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/meetings/add', meetingFormData)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    function toggleForm() {
        setShowForm(prevState => !prevState);
    }

    function toggleMeetingForm() {
        setShowMeetingForm(prevState => !prevState);
    }

    const generateReport = () => {
        axios.get('http://localhost:8080/trainees/')
            .then(res => {
                const traineesData = res.data;
                const printWindow = window.open("", "_blank", "width=600,height=600");
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Trainee Report</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    padding: 20px;
                                }
                                h1 {
                                    text-align: center;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-bottom: 20px;
                                }
                                th, td {
                                    border: 1px solid #ccc;
                                    padding: 8px;
                                    text-align: left;
                                }
                                th {
                                    background-color: #f2f2f2;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>Trainee Report</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Trainee ID</th>
                                        <th>Name</th>
                                        <th>Ratings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${trainees.map(trainee => `
                                        <tr>
                                            <td>${trainee.trainee_id}</td>
                                            <td>${trainee.trainee_name}</td>
                                            <td>${trainee.trainee_rating}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div class="back-button">
                                <button onclick="window.close()" class="btn btn-secondary">Back</button>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            })
            .catch(err => {
                console.error('Error fetching trainee data:', err);
                alert('Error fetching trainee data. Please try again.');
            });
    };

    const filteredTrainees = trainees.filter(trainee =>
        trainee.trainee_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h1>Trainee Management</h1>
            <br></br>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Trainees</h5>
                            <p className="card-text">{trainees.length}</p>
                            <button onClick={toggleForm} className="btn btn-primary">Add New Trainee</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Sessions</h5>
                            <p className="card-text">{meetings.length}</p>
                            <button onClick={toggleMeetingForm} className="btn btn-primary">Add New Session</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Generate Report</h5>
                            <p className="card-text">Generate a report summarizing trainee data.</p>
                            <button onClick={generateReport} className="btn btn-primary">Generate Report</button>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>

            {showForm && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Trainee</h5>
                                <button type="button" className="btn-close" onClick={toggleForm}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Trainee ID</label>
                                        <input type="text" className="form-control" name="trainee_id" value={formData.trainee_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" name="trainee_name" value={formData.trainee_name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="trainee_email" value={formData.trainee_email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Gender</label>
                                        <select className="form-select" name="trainee_gender" value={formData.trainee_gender} onChange={handleChange} required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contact No</label>
                                        <input type="text" className="form-control" name="trainee_contact" value={formData.trainee_contact} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ratings</label>
                                        <input type="number" className="form-control" name="trainee_rating" value={formData.trainee_rating} onChange={handleChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showMeetingForm && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Session</h5>
                                <button type="button" className="btn-close" onClick={toggleMeetingForm}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleMeetingSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Meeting ID</label>
                                        <input type="text" className="form-control" name="meeting_id" value={meetingFormData.meeting_id} onChange={handleMeetingChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" name="meeting_name" value={meetingFormData.meeting_name} onChange={handleMeetingChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Start Time</label>
                                        <input type="number" step="0.01" className="form-control" name="meeting_start" value={meetingFormData.meeting_start} onChange={handleMeetingChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">End Time</label>
                                        <input type="number" step="0.01" className="form-control" name="meeting_end" value={meetingFormData.meeting_end} onChange={handleMeetingChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input type="text" className="form-control" name="meeting_date" value={meetingFormData.meeting_date} onChange={handleMeetingChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <input type="text" className="form-control" name="meeting_location" value={meetingFormData.meeting_location} onChange={handleMeetingChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Scheduled Meetings</h5>
                            <br></br>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Meeting ID</th>
                                            <th>Name</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Date</th>
                                            <th>Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meetings.map(meeting => (
                                            <tr key={meeting.meeting_id}>
                                                <td>{meeting.meeting_id}</td>
                                                <td>{meeting.meeting_name}</td>
                                                <td>{parseFloat(meeting.meeting_start).toFixed(2)}</td>
                                                <td>{parseFloat(meeting.meeting_end).toFixed(2)}</td>
                                                <td>{meeting.meeting_date}</td>
                                                <td>{meeting.meeting_location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title">Trainees' Details</h5>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Trainee Name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <br></br>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Contact No</th>
                                            <th>Gender</th>
                                            <th>Ratings</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTrainees.map(trainee => (
                                            <tr key={trainee._id}>
                                                <td>{trainee.trainee_name}</td>
                                                <td>{trainee.trainee_email}</td>
                                                <td>{trainee.trainee_contact}</td>
                                                <td>{trainee.trainee_gender}</td>
                                                <td>{trainee.trainee_rating}</td>
                                                <td>
                                                    <button onClick={() => handleDelete(trainee._id)} className="btn btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>
        </div>
    );
}
