import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Trainee() {
    const [meetings, setMeetings] = useState([]);
    const [trainees, setTrainees] = useState([]);

    useEffect(() => {
        // Fetch meetings
        axios.get('http://localhost:8080/meetings/')
            .then(res => {
                setMeetings(res.data);
            })
            .catch(err => {
                console.error('Error fetching meetings:', err);
            });

        // Fetch trainees
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
                // Reload the page after deletion
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    }
    


    return (
        <div className="container">
            <h1>Dashboard</h1>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Meeting Database</h5>
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
                                                <td>{meeting.meeting_start}</td>
                                                <td>{meeting.meeting_end}</td>
                                                <td>{meeting.meeting_date}</td>
                                                <td>{meeting.meeting_location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Link to="/addMeeting" className="btn btn-primary">Add New Meeting</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Trainee Database</h5>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Contact No</th>
                                            <th>Gender</th>
                                            <th>Ratings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trainees.map(trainee => (
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
                            <Link to="/addTrainee" className="btn btn-primary">Add New Trainee</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
