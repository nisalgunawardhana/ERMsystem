import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast"
import '../User.css';

function SystemUsers() {
    const [users, setUsers] = useState([]);

    //selecting users
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    //updating user
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [userDataToUpdate, setUserDataToUpdate] = useState({});

    //deleting a user
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    //search filter
    const [searchQuery, setSearchQuery] = useState("");

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

            // Filter users based on search query
            const filteredUsers = updatedUsers.filter(user => {
            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
            });

            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
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

    // Handler for selecting a checkbox
    const handleCheckboxChange = (userId) => {
        setSelectedUserIds(prevSelectedUserIds => {
            if (prevSelectedUserIds.includes(userId)) {
                return prevSelectedUserIds.filter(id => id !== userId);
            } else {
                return [...prevSelectedUserIds, userId];
            }
        });
    };

    // Handler for clearing selected checkboxes
    const handleClearSelection = async () => {
        try {
            // Send a DELETE request to the backend to delete selected users
            await axios.delete("/api/users/delete-multiple", { data: { userIds: selectedUserIds } });
            
            // Clear the selectedUserIds state in the frontend
            setSelectedUserIds([]);
            
            // toast message for successful deletion
            toast.success("Selected users were cleared successfully");
            
            // Fetch updated list of users
            fetchUsers();
        } catch (error) {
            console.error("Error deleting selected users:", error);
            toast.error("Error deleting selected users");
        }
    };
    
    const handleSearch = () => {
        // Fetch users based on the search query
        fetchUsers();
    };
    


    return (
        <Layout>
            <div className="system-users p-2">
                <h2>System Users</h2>
                <hr />

            <div className="search-container">
            <input
                type="text"
                placeholder="Search user by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
            </div>



                <div className="button-group mb-2">
                    {selectedUserIds.length > 0 && (
                        <Button variant="danger" onClick={handleClearSelection}>Clear Selection</Button>
                    )}
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Okay</th>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>User Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
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
                                
                                <td>
                                <Button variant="primary" onClick={() => handleUpdate(user)} style={{ marginRight: '15px' }}>Update</Button>
                                <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
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
                    <Form onSubmit={handleUpdateSubmit}>
                        <Form.Group controlId="first_name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="first_name" value={userDataToUpdate.first_name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="last_name" value={userDataToUpdate.last_name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={userDataToUpdate.email} onChange={handleInputChange} />
                        </Form.Group>
                        {/* Additional form fields for user role, etc. */}
                        {/* Add more Form.Group for additional fields */}
                        <Button variant="primary" type="submit">Update</Button>
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
