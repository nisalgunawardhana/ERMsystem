import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux" ;

function Profile() {
    const [userDetails, setUserDetails] = useState(null);
    const { user } = useSelector((state) => state.user);

    

    useEffect(() => {
        // Fetch user details when the component mounts
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            // Make a GET request to fetch user details
            const response = await axios.get('/api/users', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            // Set the user details in state
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    return (
        <Layout>
            <div className="profile">
                <h2>User Profile</h2>
                
                {userDetails ? (
                    <div>
                        <p><strong>First Name:</strong> {userDetails.first_name}</p>
                        <p><strong>Last Name:</strong> {userDetails.last_name}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>User Role:</strong> {user.role}</p>
                    </div>
                ) : (
                    <p>Loading user details...</p>
                )}
            </div>
        </Layout>
    );
}

export default Profile;
