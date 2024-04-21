import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast"
import '../User.css';

function SystemUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [userDataToUpdate, setUserDataToUpdate] = useState({});
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        // Fetch users data when the component mounts
        fetchUsers(); 
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/users");
            const updatedUsers = response.data.map(userData => {
                
                //fetching the user role 
                let userRole;

                if (userData.isAdmin) {
                    userRole = 'Admin';
                } else if (userData.isCashier) {
                    userRole = 'Cashier';
                } else if (userData.isFinanceManager) {
                    userRole = 'Financial Manager';
                } else if (userData.isLogisticManager) {
                    userRole = 'Logistic Manager';
                } else if (userData.isStaffManager) {
                    userRole = 'Staff Manager';
                } else if (userData.isTrainingCoordinator) {
                    userRole = 'Training Coordinator';
                } else {
                    userRole = 'User';
                }

                return {
                    ...userData,
                    userRole: userRole
                };
            });
            setUsers(updatedUsers);
            setTotalUsers(updatedUsers.length);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Handler for selecting individual user
    const handleCheckboxChange = (userId) => {
        setSelectedUserIds(prevSelectedUserIds => {
            if (prevSelectedUserIds.includes(userId)) {
                return prevSelectedUserIds.filter(id => id !== userId);
            } else {
                return [...prevSelectedUserIds, userId];
            }
        });
    };

    // Handler for selecting all users
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUserIds([]);
        } else {
            const allUserIds = users.map(user => user._id);
            setSelectedUserIds(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    // Handler for clearing selected users
    const handleClearSelection = () => {
        setSelectedUserIds([]);
        setSelectAll(false);
    };

    // Delete selected users
    const handleDeleteSelected = async () => {
        // Check if there are selected users
    if (selectedUserIds.length === 0) {
        // If no users are selected, show a message and return
        toast.error("No users selected");
        return;
    }

        try {
            await axios.delete("/api/users/delete-multiple", { data: { userIds: selectedUserIds } });
            toast.success("Selected users deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting selected users:", error);
            toast.error("Error deleting selected users");
        }
    };

    //update
    const handleUpdate = (user) => {
        setUserDataToUpdate(user);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            // PUT or PATCH request to update user
            await axios.put(`/api/users/update/${userDataToUpdate._id}`, userDataToUpdate);
            toast.success("User updated successfully");
            setShowUpdateModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error updating user");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDataToUpdate({
            ...userDataToUpdate,
            [name]: value
        });
    };

    //delete
    const handleDelete = (userId) => {
        setUserToDelete(userId);
        setShowDeletePrompt(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/users/delete/${userToDelete}`);
            setUsers(users.filter(user => user._id !== userToDelete));
            setTotalUsers(prevTotalUsers => prevTotalUsers - 1);
            toast.success("User deleted successfully"); // Display success message
            
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user");
        }
        setShowDeletePrompt(false);
    };

    const cancelDelete = () => {
        setShowDeletePrompt(false);
    };

    //search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };
    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userRole.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //generate report
    const generateReport = () => {
        const printWindow = window.open("", "_blank", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>System User Report</title>
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
                    <h1>System User Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>User Role</th>
                                <th>User created date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map((user, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${user.first_name}</td>
                                    <td>${user.last_name}</td>
                                    <td>${user.userRole}</td>
                                    <td>${new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
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
    };
    
    
    return (
        <Layout>
            <div className="system-users p-3">
            <h2>System Users</h2>
            <hr />
            <br/>
                
            <div className="cards d-flex justify-content-between">
                <div className="col-md-4">
                    <div className="card mb-3" 
                        style={{ background: 'white', 
                        color: 'black', 
                        borderRadius: '15px'}}>

                        <div className="card-body p-4">
                            <h5 className="card-title" style={{ textAlign: 'center' }}>Total Number of System Users</h5>
                            <p style={{ fontSize: '40px', textAlign: 'center', fontWeight: 'bold' }}>{totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card mb-3" 
                        style={{ background: 'white', 
                        color: 'black', 
                        borderRadius: '15px' }}>

                        <div className="card-body p-4">
                            <h5 className="card-title">Generate Reports</h5>
                            <p className="card-text">Generate and download System Users report</p>
                            <button onClick={generateReport} className="btn btn-dark">Generate Report</button>
                        </div>
                    </div>
                </div>
            </div>

            </div>

            <div className="card p-3">
                <br/>
                <div className="button-group mb-3 d-flex align-items-center">
                   
                    {/* search */}
                    <div className="search-container col-md-7" style={{paddingLeft: '35px'}}>
                        <input
                            type="text"
                            placeholder="Search user by Name, Email, or Role"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="three-buttons" style={{ marginLeft: 'auto' }}>
                    <Button variant="danger" onClick={handleDeleteSelected}>Delete Selected</Button>
                    <Button variant="dark" onClick={handleSelectAll} style={{ marginLeft: '10px' }}>
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button variant="dark" onClick={handleClearSelection} style={{ marginLeft: '10px' }}>Clear Selection</Button>
                    </div> 
                </div>
                <br/>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>User Role</th>
                            <th>User created date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td><input type="checkbox" 
                                    checked={selectedUserIds.includes(user._id)} 
                                    onChange={() => handleCheckboxChange(user._id)} />
                                </td>
                                <td>{index + 1}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.userRole}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                                
                                <td>
                                    <Button variant="primary" onClick={() => handleUpdate(user)} style={{ marginLeft: '20px' }}>Update</Button>
                                </td>

                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(user._id)} style={{ marginLeft: '20px' }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>

             {/* Update User Modal */}
             <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Update User Form */}
                    <Form className="update p-2" onSubmit={handleUpdateSubmit}>
                        <Form.Group controlId="first_name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="first_name" value={userDataToUpdate.first_name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="last_name" style={{ marginTop: '15px' }}>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="last_name" value={userDataToUpdate.last_name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="email" style={{ marginTop: '15px' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={userDataToUpdate.email} onChange={handleInputChange} />
                        </Form.Group>

                       <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>Update</Button>

                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeletePrompt} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    <Button variant="secondary" onClick={cancelDelete}>No</Button>
                </Modal.Footer>
            </Modal>

        </Layout>
    );
}

export default SystemUsers;
