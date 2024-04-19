/*global Chart*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';

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
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [selectedTraineeId, setselectedTraineeId] = useState(null);
    const [dailyAverageRatings, setDailyAverageRatings] = useState({});

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
                calculateDailyAverageRatings(res.data);
            })
            .catch(err => {
                console.error('Error fetching trainees:', err);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/trainees/')
            .then(res => {
                setTrainees(res.data);
                calculateDailyAverageRatings(res.data);
            })
            .catch(err => {
                console.error('Error fetching trainees:', err);
                // Handle error (e.g., show error message)
            });
    }, []);

    

    function handleDelete(id) {
        axios.delete(`http://localhost:8080/meetings/delete/${id}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    function handleDeleteTrainee(id) {
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

    function handleTraineeSubmit(e) {
        e.preventDefault();
        if (selectedTraineeId) {
            axios.put(`http://localhost:8080/trainees/update/${selectedTraineeId}`, formData)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err.message);
                });
        } else {
            axios.post('http://localhost:8080/trainees/add', formData)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
    }


    function handleMeetingSubmit(e) {
        e.preventDefault();
        if (selectedMeetingId) {
            axios.put(`http://localhost:8080/meetings/update/${selectedMeetingId}`, meetingFormData)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err.message);
                });
        } else {
            axios.post('http://localhost:8080/meetings/add', meetingFormData)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
    }


    function toggleForm() {
        setShowForm(prevState => !prevState);
        setselectedTraineeId(null); // Reset selected trainee ID
        setFormData({  // Reset form data
            trainee_id: '',
            trainee_name: '',
            trainee_email: '',
            trainee_gender: '',
            trainee_contact: '',
            trainee_rating: ''
        });
    }

    function toggleMeetingForm() {
        setShowMeetingForm(prevState => !prevState);
        setSelectedMeetingId(null);
        setMeetingFormData({
            meeting_id: '',
            meeting_name: '',
            meeting_start: '',
            meeting_end: '',
            meeting_date: '',
            meeting_location: ''
        });
    }

    function editMeeting(meeting) {
        setSelectedMeetingId(meeting._id);
        setMeetingFormData({
            meeting_id: meeting.meeting_id,
            meeting_name: meeting.meeting_name,
            meeting_start: meeting.meeting_start,
            meeting_end: meeting.meeting_end,
            meeting_date: meeting.meeting_date,
            meeting_location: meeting.meeting_location
        });
        setShowMeetingForm(true);
    }

    function editTrainee(trainee) {
        setselectedTraineeId(trainee._id); // Corrected line
        setFormData({  // Corrected line
            trainee_id: trainee.trainee_id,
            trainee_name: trainee.trainee_name,
            trainee_email: trainee.trainee_email,
            trainee_gender: trainee.trainee_gender,
            trainee_contact: trainee.trainee_contact,
            trainee_rating: trainee.trainee_rating
        });
        setShowForm(true);
    }

    const generateReport = () => {
        axios.get('http://localhost:8080/trainees/')
            .then(res => {
                const sortedTrainees = res.data.sort((a, b) => b.trainee_rating - a.trainee_rating); // Sort trainees array by ratings in descending order
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
                                    ${sortedTrainees.map(trainee => `
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

    // Function to calculate daily average ratings
    const calculateDailyAverageRatings = (traineesData) => {
        const dailyRatings = {};
        traineesData.forEach(trainee => {
            const date = new Date(trainee.createdAt).toLocaleDateString(); // Assuming trainee data has a createdAt field
            if (!dailyRatings[date]) {
                dailyRatings[date] = {
                    totalRatings: 0,
                    numberOfTrainees: 0
                };
            }
            dailyRatings[date].totalRatings += parseFloat(trainee.trainee_rating);
            dailyRatings[date].numberOfTrainees++;
        });

        const dailyAverage = {};
        for (const date in dailyRatings) {
            dailyAverage[date] = dailyRatings[date].totalRatings / dailyRatings[date].numberOfTrainees;
        }

        setDailyAverageRatings(dailyAverage);
        console.log('Daily Average Ratings:', dailyAverage);
    };

    // Prepare data for Chart.js
    const chartData = {
        labels: Object.keys(dailyAverageRatings), // Dates as labels
        datasets: [
            {
                label: 'Average Ratings',
                data: Object.values(dailyAverageRatings), // Average ratings as data points
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2
            }
        ]
    };

    useEffect(() => {
        let lineChart = null;

        // Function to create or update the line chart
        const createOrUpdateLineChart = () => {
            // If a previous Chart instance exists, destroy it
            if (lineChart) {
                lineChart.destroy();
            }

            // Extracting data for the chart
            const dates = Object.keys(dailyAverageRatings);
            const dailyAverages = Object.values(dailyAverageRatings);

            // Create the line chart
            lineChart = new Chart(document.getElementById('canvas-1'), {
                type: 'line',
                data: {
                    labels: dates, // Use dates as labels
                    datasets: [
                        {
                            label: 'Daily Average Ratings',
                            data: dailyAverages, // Use daily averages as data
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        },
                        // Add other datasets if needed
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };

        createOrUpdateLineChart();
        // Cleanup function to destroy the charts when the component unmounts
        return () => {
            if (lineChart) {
                lineChart.destroy();
            }
        };
    }, [dailyAverageRatings]);

    return (
        <Layout>
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Trainee</li>
                    </ol>
                </nav>
                <h1>Trainee Management</h1>
                <br></br>

                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Total Trainees</h4>
                                <div className="text-center my-auto">
                                    <h1 className="card-text">{trainees.length}</h1>
                                </div>
                                <button onClick={toggleForm} className="btn btn-success">Add New Trainee</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Total Sessions</h4>
                                <div className="text-center my-auto">
                                    <h1 className="card-text">{meetings.length}</h1>
                                </div>
                                <button onClick={toggleMeetingForm} className="btn btn-success">Add New Session</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Generate Report</h4>
                                <p className="card-text">Generate a summary of trainee performance.</p>
                                <button onClick={generateReport} className="btn btn-primary">Generate Report</button>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>

                <canvas id="canvas-1"></canvas>
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
                                    <form onSubmit={handleTraineeSubmit}>
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
                                        <button type="submit" className="btn btn-primary">{selectedTraineeId ? 'Update' : 'Submit'}</button>
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
                                    <h5 className="modal-title">{selectedMeetingId ? 'Update' : 'Add'} Meeting</h5>
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
                                            <input type="date" className="form-control" name="meeting_date" value={meetingFormData.meeting_date} onChange={handleMeetingChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Location</label>
                                            <input type="text" className="form-control" name="meeting_location" value={meetingFormData.meeting_location} onChange={handleMeetingChange} required />
                                        </div>
                                        <button type="submit" className="btn btn-primary">{selectedMeetingId ? 'Update' : 'Submit'}</button>
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
                                <h4 className="card-title">Scheduled Meetings</h4>
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
                                                <th>Action</th>
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
                                                    <td>
                                                        <button onClick={() => editMeeting(meeting)} className="btn btn-primary" style={{ margin: '0 5px' }} >Update</button>
                                                        <button onClick={() => handleDelete(meeting._id)} className="btn btn-danger" style={{ margin: '0 5px' }} >Delete</button>
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

                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="card-title">Trainees' Details</h4>
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
                                <div className="row row-cols-1 row-cols-md-2 g-4">
                                    {filteredTrainees.map(trainee => (
                                        <div key={trainee._id} className="col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="text-center my-auto">
                                                        <h4 className="card-title">{trainee.trainee_name}</h4>
                                                        <br></br>
                                                        <p className="card-text">ID :  <strong>{trainee.trainee_id}</strong></p>
                                                        <p className="card-text">Email :  <strong>{trainee.trainee_email}</strong></p>
                                                        <p className="card-text">Contact No :  <strong>{trainee.trainee_contact}</strong></p>
                                                        <p className="card-text">Gender :  <strong>{trainee.trainee_gender}</strong></p>
                                                        <p className="card-text">Ratings :  <strong>{trainee.trainee_rating}</strong></p>
                                                        <div>
                                                            <button onClick={() => editTrainee(trainee)} className="btn btn-primary" style={{ margin: '0 5px' }} >Update</button>
                                                            <button onClick={() => handleDeleteTrainee(trainee._id)} className="btn btn-danger" style={{ margin: '0 5px' }} >Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <br></br>
            </div>
        </Layout>
    );
}
