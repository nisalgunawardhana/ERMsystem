import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    axios.put(`http://localhost:8080/customer/update/${id}`, customer)
      .then(() => {
        navigate('/customer');
      })
      .catch(error => {
        console.error('Error updating customer:', error);
      });
  };

  return (
    <div className="custom-form-container">
      <h2>Update Customer</h2>
      <Form onSubmit={handleSubmit}>
      <Form.Group controlId="customerId">
          <Form.Label>Customer ID</Form.Label>
          <Form.Control
            type="text"
            name="customer_id"
            value={customer.customer_id}
            onChange={handleChange}
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
        <Button variant="primary" type="submit">
          Update Customer
        </Button>
      </Form>
    </div>
  );
}

export default UpdateCustomer;
