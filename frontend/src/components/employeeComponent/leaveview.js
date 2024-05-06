import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '../Layout';

const LeaveRequestView = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [link, setLink] = useState('http://localhost:3000/dashboard/employee/leaverequest');

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await axios.get("/leave/getallleaves");
                setLeaves(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaves:', error);
                setError('Error fetching leaves');
                setLoading(false);
            }
        };

        fetchLeaves();
    }, []);

    

    const handleApprove = async (id) => {
        try {
            await axios.post("/leave/approverequest", { requestid: id });

            const response = await axios.get("/leave/getallleaves");
            setLeaves(response.data);

            toast.success("Leave request approved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve leave request.");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post("/leave/cancelrequest", { requestid: id });

            const response = await axios.get("/leave/getallleaves");
            setLeaves(response.data);

            toast.success("Leave request rejected successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject leave request.");
        }
    };


    const copyLink = () => {
        navigator.clipboard.writeText(link);
        alert('Link copied to successfully!');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Layout>
            <div className="container mt-5">
                <h2>All Leave Requests</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((leave) => (
                            <tr key={leave._id}>
                                <td>{leave.employee_Id}</td>
                                <td>{leave.fromdate}</td>
                                <td>{leave.todate}</td>
                                <td>{leave.desription}</td>
                                <td>{leave.status}</td>
                                <td>
                                    {leave.status === "Pending" && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                style={{ margin: '0 5px' }}
                                                onClick={() => handleApprove(leave._id)}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                style={{ margin: '0 5px' }}
                                                onClick={() => handleReject(leave._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
};

export default LeaveRequestView;
