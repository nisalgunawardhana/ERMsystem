import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Layout from './Layout'

function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    customer_id: 0,
    customer_name: '',
    email: '',
    point: 0,
    gender: 'male'
  });
  const [formValid, setFormValid] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

  useEffect(() => {
    axios.get(`http://localhost:8080/customer/${id}`)
      .then(response => {
        setCustomer(response.data);
      })
      .catch(error => {
        console.error('Error fetching customer details:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidCustomerId = /^\d{10}$/.test(customer.customer_id);

        if (isValidCustomerId) {
            // Handle form submission (e.g., send data to backend)
            console.log('Form submitted:', customer);
            // Reset form after submission (if needed)
            setCustomer({ customer_id: '' });
            setFormValid(false); // Reset form validity state
        } else {
            // Display error message or handle invalid input
            alert('Please enter a 10-digit customer ID (phone number).');
            return;
        }
    axios.put(`http://localhost:8080/customer/update/${id}`, customer)
      .then(() => {
        navigate('/dashboard/cashier/Customer');
      })
      .catch(error => {
        console.error('Error updating customer:', error);
      });
  };

  return (
    <Layout>
    <div className="custom-form-container">
      <div className="d-flex justify-content-end mb-3">
        
      </div>
      <h2>Update Customer</h2>
      <Form onSubmit={handleSubmit}>
      <Form.Group controlId="customer_id">
                <Form.Label>Customer ID (Phone Number)</Form.Label>
                <Form.Control
                    type="text"
                    name="customer_id"
                    onChange={handleInputChange}
                    value={customer.customer_id}
                    placeholder="Enter 10-digit phone number"
                    required
                />
            </Form.Group>
        <Form.Group controlId="customerName">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            name="customer_name"
            value={customer.customer_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="point">
          <Form.Label>Point</Form.Label>
          <Form.Control
            type="number"
            name="point"
            value={customer.point}
            onChange={handleChange}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={customer.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>
        <div style={{ marginTop: '10px' }}>
  <Button variant="primary" type="submit">
    Update Customer
  </Button>
  <span style={{ marginLeft: '10px' }}></span>
  <Button variant="secondary" onClick={() => navigate('/dashboard/cashier/Customer')}>
    Back
  </Button>
</div>

      </Form>
    </div>
  
    </Layout>
  );
}

export default UpdateCustomer;
