import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import { Form, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import '../User.css';


function SystemUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users data when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/users"); // Assuming your backend API is running on the same domain
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <Layout>
            <div className="system-users p-3">


            
            <h2>System Users</h2>
            <hr />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>User Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.userRole}</td> 
                            
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        </Layout>
    );
}

export default SystemUsers;